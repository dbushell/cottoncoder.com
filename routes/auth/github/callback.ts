import {v4} from 'uuid';
import * as kv from '@server/kv.ts';
import * as secret from '@server/secret.ts';
import {redirect} from '@server/shared.ts';
import {sessionCookie} from '@server/auth.ts';
import type {EncryptedValue, GitHubToken} from '@server/types.ts';
import type {DinoHandle} from 'dinossr';

export const pattern = '/';

export const GET: DinoHandle = async ({request, platform}) => {
  const url = new URL(request.url);
  if (url.searchParams.has('error')) {
    return redirect('/account/login/?error=denied');
  }
  // Validate state key
  const state = url.searchParams.get('state') ?? '';
  const stateKey = platform.cookies.get('state')?.value ?? '';
  if (!v4.validate(state) || !v4.validate(stateKey)) {
    return redirect('/account/login/?error=expired');
  }
  // Validate state value
  const stateValue = await kv.db.get<string>(['state', stateKey]);
  if (state !== stateValue?.value) {
    return redirect('/account/login/?error=mismatch');
  }
  // Delete temporary state
  await kv.db.delete(['state', stateKey]);
  platform.cookies.delete('state');
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
    platform.cookies.set('session', {
      ...sessionCookie,
      value: cookie,
      expires: encryped.expires
    });
  } catch {
    return redirect('/account/login/?error=token');
  }
  return redirect('/account/login/?redirect=true');
};
