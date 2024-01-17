import {v4} from 'uuid';
import * as kv from '../data/kv.ts';
import * as secret from '../data/secret.ts';
import {redirect} from '../utils.ts';
import type {DinoCookies, DinoHandle, DinoPlatform} from 'dinossr';
import type {
  MapValueType,
  EncryptedValue,
  GitHubToken,
  GitHubUser
} from '../types.ts';

const ADMIN_IDS = Deno.env.get('GH_ADMIN_IDS')?.split(',') ?? [];

const stateCookie: MapValueType<DinoCookies> = {
  name: 'state',
  value: '',
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'Lax'
};

const sessionCookie: MapValueType<DinoCookies> = {
  name: 'session',
  value: '',
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'Strict'
};

const githubLogout: DinoHandle = async (_req, _res, props) => {
  try {
    // Delete encrypted session data
    const cookie = props.platform.cookies.get('session')?.value;
    const [session] = cookie?.split(':') ?? [];
    await Promise.allSettled([
      kv.db.delete(['token', session]),
      kv.db.delete(['user', session])
    ]);
  } catch {
    // Ignore...
  }
  // Delete session cookie
  props.platform.cookies.delete('session');
  return redirect('/login/');
};

const githubLogin: DinoHandle = async (request, _res, props) => {
  const stateKey = crypto.randomUUID();
  const stateValue = crypto.randomUUID();
  const expireIn = 300_000;
  // Store the state value in database
  await kv.db.set(['state', stateKey], stateValue, {expireIn});
  // Store the state key in cookie
  props.platform.cookies.set('state', {
    ...stateCookie,
    value: stateKey,
    expires: new Date(Date.now() + expireIn)
  });
  const callback = new URL('/auth/github/callback/', request.url);
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', Deno.env.get('GH_CLIENT_ID')!);
  url.searchParams.set('redirect_uri', callback.href);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', stateValue);
  url.searchParams.set('scope', '');
  return redirect(url.href);
};

const githubCallback: DinoHandle = async (request, _res, props) => {
  const url = new URL(request.url);
  if (url.searchParams.has('error')) {
    return redirect('/login/?error=denied');
  }
  // Validate state key
  const state = url.searchParams.get('state') ?? '';
  const stateKey = props.platform.cookies.get('state')?.value ?? '';
  if (!v4.validate(state) || !v4.validate(stateKey)) {
    return redirect('/login/?error=expired');
  }
  // Validate state value
  const stateValue = await kv.db.get<string>(['state', stateKey]);
  if (state !== stateValue?.value) {
    return redirect('/login/?error=mismatch');
  }
  // Delete temporary state
  await kv.db.delete(['state', stateKey]);
  props.platform.cookies.delete('state');
  // Fetch access token
  try {
    const code = url.searchParams.get('code')!;
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        body: new URLSearchParams({
          client_id: Deno.env.get('GH_CLIENT_ID')!,
          client_secret: Deno.env.get('GH_CLIENT_SECRET')!,
          redirect_uri: new URL(`/auth/github/callback/`, request.url).href,
          grant_type: 'authorization_code',
          code
        }),
        headers: {
          accept: 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        }
      }
    );
    const token: GitHubToken = await response.json();
    const session = crypto.randomUUID();
    const password = crypto.randomUUID();
    const expireIn = token.expires_in * 1000;
    const encryped: EncryptedValue = {
      encrypted: await secret.encryptText(JSON.stringify(token), password),
      expires: new Date(Date.now() + expireIn)
    };
    const cookie = [session, password].join(':');
    await kv.db.set(['token', session], encryped, {expireIn});
    props.platform.cookies.set('session', {
      ...sessionCookie,
      value: cookie,
      expires: encryped.expires
    });
  } catch {
    return redirect('/login/?error=token');
  }
  return redirect('/login/?redirect=true');
};

const userFetchMap = new Map<string, Promise<JSON>>();

const githubUser = async (platform: DinoPlatform) => {
  // Parse and validate session cookie
  const cookie = platform.cookies.get('session')?.value;
  const [session, password] = cookie?.split(':') ?? [];
  if (!v4.validate(session) || !v4.validate(password)) {
    throw new Error();
  }
  // Check if user data is cached for this session
  const user = await kv.db.get<EncryptedValue>(['user', session]);
  if (user.value) {
    const decrypted: GitHubUser = JSON.parse(
      await secret.decryptText(user.value.encrypted, password)
    );
    platform.locals.user = decrypted;
    return;
  }
  const encrypted = await kv.db.get<EncryptedValue>(['token', session]);
  if (!encrypted.value) {
    throw new Error();
  }
  const decrypted: GitHubToken = JSON.parse(
    await secret.decryptText(encrypted.value.encrypted, password)
  );
  try {
    // Use map to prevent multiple concurrent requests
    if (!userFetchMap.has(session)) {
      const promise = fetch('https://api.github.com/user', {
        headers: {
          accept: 'application/vnd.github+json',
          authorization: `${decrypted.token_type} ${decrypted.access_token}`,
          'x-github-api-version': '2022-11-28'
        }
      })
        .then((response) => {
          return response.json();
        })
        .catch(() => ({}));
      userFetchMap.set(session, promise);
    }
    const data = await userFetchMap.get(session)!;
    if (!Object.hasOwn(data, 'login')) {
      throw new Error();
    }
    const expireIn = 3_600_000;
    const encryped: EncryptedValue = {
      encrypted: await secret.encryptText(JSON.stringify(data), password),
      expires: new Date(Date.now() + expireIn)
    };
    await kv.db.set(['user', session], encryped, {expireIn});
    platform.locals.user = data;
  } catch (err) {
    throw err;
  } finally {
    userFetchMap.delete(session);
  }
};

export const handle: DinoHandle = async (request, response, props) => {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/auth/')) {
    // Check if user is logged in
    try {
      await githubUser(props.platform);
      // @ts-ignore - TODO: fix types
      const id = props.platform?.locals.user?.id;
      if (ADMIN_IDS.includes(String(id))) {
        props.platform.locals.admin = true;
      }
    } catch {
      // Ignore...
    }
    return response;
  }
  if (request.method === 'POST') {
    if (url.pathname === '/auth/github/login/') {
      return githubLogin(request, response, props);
    }
    if (url.pathname === '/auth/github/logout/') {
      return githubLogout(request, response, props);
    }
  } else if (request.method === 'GET') {
    if (url.pathname === '/auth/github/callback/') {
      return githubCallback(request, response, props);
    }
  }
  return response ?? new Response(null, {status: 404});
};
