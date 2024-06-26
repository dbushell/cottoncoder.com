import type {DinoHandle} from 'dinossr';
import type {Data} from '@server/types.ts';
import {markdown} from '@server/markdown.ts';

export const pattern = '/';

export const POST: DinoHandle<Data> = async ({request, platform}) => {
  if (!platform.serverData.admin) {
    return new Response(null, {status: 401});
  }
  try {
    const html = await markdown(await request.text());
    return new Response(html, {
      headers: {'content-type': 'text/html; charset=utf-8'}
    });
  } catch {
    return new Response(null, {status: 400});
  }
};
