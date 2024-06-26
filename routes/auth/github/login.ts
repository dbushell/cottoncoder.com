import type {DinoHandle} from 'dinossr';
import type {Data} from '@server/types.ts';
import * as kv from '@server/kv.ts';
import {redirect} from '@server/shared.ts';
import {stateCookie} from '@server/auth.ts';

export const pattern = '/';

export const POST: DinoHandle<Data> = async ({request, platform}) => {
  const stateKey = crypto.randomUUID();
  const stateValue = crypto.randomUUID();
  const expireIn = 300_000;
  // Store the state value in database
  await kv.db.set(['state', stateKey], stateValue, {expireIn});
  // Store the state key in cookie
  platform.cookies.set('state', {
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
