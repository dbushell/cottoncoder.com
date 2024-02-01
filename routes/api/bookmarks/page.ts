import * as kv from '../../../server/kv.ts';
import {authorized} from '../../../server/shared.ts';
import type {DinoHandle} from 'dinossr';

export const pattern = '/:index(\\d+)/';

export const get: DinoHandle = async (request, _res, {match}) => {
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
