import * as kv from '../data/kv.ts';
import {redirect} from '../utils.ts';
import type {DinoHandle, DinoPlatform} from 'dinossr';

const getBookmark = async (id: string) => {
  const data = await kv.getBookmark(id);
  if (data) return Response.json(data);
  return new Response(null, {status: 400});
};

const setBookmark = async (
  id: string,
  request: Request,
  {serverData}: DinoPlatform
) => {
  if (serverData.admin !== true) {
    return new Response(null, {status: 401});
  }
  if (id === 'new') {
    id = kv.getId();
  }
  const data = await kv.getBookmark(id);
  const form = await request.formData();
  if (form.get('delete') === 'on') {
    await kv.deleteBookmark(id);
    return redirect('/');
  }
  await kv.setBookmark(
    {
      date: new Date(form.get('date')?.toString() ?? data?.date ?? Date.now()),
      url: form.get('url')?.toString() ?? data?.url ?? '',
      title: form.get('title')?.toString() ?? data?.title ?? '',
      markdown: form.get('markdown')?.toString() ?? data?.markdown ?? ''
    },
    id
  );
  return redirect(`/bookmarks/${id}/`);
};

const getPage = async (index: number) => {
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

export const handle: DinoHandle = async (request, response, props) => {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/')) {
    return response;
  }
  response = undefined;

  let pattern: URLPattern;
  let match: URLPatternResult | null;

  // Protect JSON API endpoints
  if (
    request.method === 'GET' &&
    request.headers.get('authorization') !==
      `Bearer ${Deno.env.get('CC_API_KEY')}`
  ) {
    return new Response(null, {status: 401});
  }

  // Read or write bookmark
  pattern = new URLPattern('/api/bookmarks/:id/', request.url);
  match = pattern.exec(request.url);
  if (match) {
    const id = match.pathname.groups.id!;
    if (request.method === 'GET') {
      response = await getBookmark(id);
    }
    if (request.method === 'POST') {
      response = await setBookmark(id, request, props.platform);
    }
  }

  // Read paginated bookmarks
  pattern = new URLPattern('/api/bookmarks/page/:index(\\d+)/', request.url);
  match = pattern.exec(request.url);
  if (match) {
    const index = Number.parseInt(match.pathname.groups.index!);
    response = await getPage(index);
  }

  if (response) {
    response.headers.set('x-robots-tag', 'noindex');
  }
  return response ?? new Response(null, {status: 404});
};
