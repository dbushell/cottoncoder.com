import {v4} from 'uuid';
import * as kv from './kv.ts';
import * as secret from './secret.ts';
import type {DinoCookies, DinoHandle, DinoPlatform} from 'dinossr';
import type {
  MapValueType,
  EncryptedValue,
  GitHubToken,
  GitHubUser
} from './types.ts';

const ADMIN_IDS = Deno.env.get('GH_ADMIN_IDS')?.split(',') ?? [];

export const stateCookie: MapValueType<DinoCookies> = {
  name: 'state',
  value: '',
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'Lax'
};

export const sessionCookie: MapValueType<DinoCookies> = {
  name: 'session',
  value: '',
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'Strict'
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
    platform.serverData.user = decrypted;
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
    platform.serverData.user = data;
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
      const id = props.platform?.serverData.user?.id;
      if (ADMIN_IDS.includes(String(id))) {
        props.platform.serverData.admin = true;
      }
    } catch {
      // Ignore...
    }
  }
  return response;
};
