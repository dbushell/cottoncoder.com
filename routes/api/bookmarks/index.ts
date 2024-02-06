import * as kv from '@server/kv.ts';
import {authorized, redirect} from '@server/shared.ts';
import type {DinoHandle} from 'dinossr';

export const pattern =
  '/:id([a-f\\d]{8}-[a-f\\d]{4}-7[a-f\\d]{3}-[a-f\\d]{4}-[a-f\\d]{12})/';

export const get: DinoHandle = async ({request, match}) => {
  if (!authorized(request)) {
    return new Response(null, {status: 401});
  }
  const id = match.pathname.groups.id as string;
  const data = await kv.getBookmark(id);
  if (data) {
    return Response.json(data);
  }
};

export const post: DinoHandle = async ({request, match, platform}) => {
  if (!platform.serverData.admin) {
    return new Response(null, {status: 401});
  }
  const id = match.pathname.groups.id as string;
  const data = await kv.getBookmark(id);
  const form = await request.formData();
  const ajax = request.headers.get('accept')?.includes('application/json');
  if (form.get('delete') === 'on') {
    await kv.deleteBookmark(id);
    if (ajax) {
      return Response.json({location: '/'});
    }
    return redirect('/');
  }
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
