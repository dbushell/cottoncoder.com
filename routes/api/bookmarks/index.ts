import * as kv from '@server/kv.ts';
import {authorized, redirect} from '@server/shared.ts';
import type {DinoHandle} from 'dinossr';

export const pattern =
  '/:id([a-f\\d]{8}-[a-f\\d]{4}-7[a-f\\d]{3}-[a-f\\d]{4}-[a-f\\d]{12})/';

export const GET: DinoHandle = async ({request, match}) => {
  if (!authorized(request)) {
    return new Response(null, {status: 401});
  }
  const id = match.pathname.groups.id as string;
  const data = await kv.getBookmark(id);
  if (data) {
    return Response.json(data);
  }
};

export const DELETE: DinoHandle = async ({request, match, platform}) => {
  if (!platform.serverData.admin) {
    return new Response(null, {status: 401});
  }
  const id = match.pathname.groups.id as string;
  await kv.deleteBookmark(id);
  const ajax = request.headers.get('accept')?.includes('application/json');
  if (ajax) {
    return Response.json({location: '/'});
  }
  return redirect('/');
};

export const PATCH: DinoHandle = async ({request, match, platform}) => {
  if (!platform.serverData.admin) {
    return new Response(null, {status: 401});
  }
  const id = match.pathname.groups.id as string;
  const data = await kv.getBookmark(id);
  const form = await request.formData();
  const ajax = request.headers.get('accept')?.includes('application/json');
  const date = new Date(
    form.get('date')?.toString() ?? data?.date ?? Date.now()
  );
  const url = form.get('url')?.toString() ?? data?.url ?? '';
  const title = form.get('title')?.toString() ?? data?.title ?? '';
  const markdown = form.get('markdown')?.toString() ?? data?.markdown ?? '';
  await kv.setBookmark(
    {
      date,
      url,
      title,
      markdown
    },
    id
  );
  const location = `/bookmarks/${id}/`;
  if (ajax) {
    return Response.json({location});
  }
  return redirect(location);
};
