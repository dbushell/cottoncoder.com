import * as kv from '@server/kv.ts';
import {redirect} from '@server/shared.ts';
import type {DinoHandle} from 'dinossr';

export const pattern = '/';

export const POST: DinoHandle = async ({platform}) => {
  try {
    // Delete encrypted session data
    const cookie = platform.cookies.get('session')?.value;
    const [session] = cookie?.split(':') ?? [];
    await Promise.allSettled([
      kv.db.delete(['token', session]),
      kv.db.delete(['user', session])
    ]);
  } catch {
    // Ignore...
  }
  // Delete session cookie
  platform.cookies.delete('session');
  return redirect('/account/login/');
};
