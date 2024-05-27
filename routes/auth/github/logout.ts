import type {DinoHandle} from 'dinossr';
import type {Data} from '@server/types.ts';
import * as kv from '@server/kv.ts';
import {redirect} from '@server/shared.ts';

export const pattern = '/';

export const POST: DinoHandle<Data> = async ({platform}) => {
  try {
    // Delete encrypted session data
    const cookie = platform.cookies.get('session')?.value;
    const [session] = cookie?.split(':') ?? [];
    await Promise.allSettled([kv.db.delete(['token', session]), kv.db.delete(['user', session])]);
  } catch {
    // Ignore...
  }
  // Delete session cookie
  platform.cookies.delete('session');
  return redirect('/account/login/');
};
