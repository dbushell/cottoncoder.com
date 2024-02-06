import * as kv from '@server/kv.ts';
import {redirect} from '@server/shared.ts';
import type {DinoHandle} from 'dinossr';

export const pattern = '/';

export const post: DinoHandle = async ({request, platform}) => {
  if (!platform.serverData.admin) {
    return new Response(null, {status: 401});
  }
  const id = kv.getId();
  const form = await request.formData();
  const ajax = request.headers.get('accept')?.includes('application/json');
  const date = new Date(form.get('date')?.toString() ?? Date.now());
  const url = form.get('url')?.toString() ?? '';
  const title = form.get('title')?.toString() ?? '';
  const markdown = form.get('markdown')?.toString() ?? '';
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
