import type {DinoHandle} from 'dinossr';
import type {Data} from '@server/types.ts';
import * as kv from '@server/kv.ts';
import {authorized} from '@server/shared.ts';

export const pattern = '/:index(\\d+)/';

export const GET: DinoHandle<Data> = async ({request, match}) => {
  if (!authorized(request)) {
    return new Response(null, {status: 401});
  }
  const index = Number.parseInt(match.pathname.groups.index!);
  try {
    const data = await kv.getFormattedPage(index);
    return Response.json({
      index: index,
      length: data.length,
      bookmarks: data.bookmarks
    });
  } catch {
    return new Response(null, {status: 400});
  }
};
