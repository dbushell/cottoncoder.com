import * as kv from '../../../server/kv.ts';
import {redirect} from '../../../server/shared.ts';
import type {DinoHandle} from 'dinossr';

export const pattern = '/';

export const post: DinoHandle = async (_req, _res, props) => {
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
  return redirect('/account/login/');
};
