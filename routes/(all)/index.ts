import type {DinoHandle} from 'dinossr';
import type {Data} from '@server/types.ts';
import {redirect} from '@server/shared.ts';

// Match all routes
export const pattern = '/*';

// After all other routes
export const order = 999;

const themes = ['light', 'dark'];

export const GET: DinoHandle<Data> = async ({request, response, platform}) => {
  const url = new URL(request.url);
  // Redirect to RSS feed
  if (/^\/(rss|feed)\/?$/.test(url.pathname)) {
    return redirect(new URL('/rss.xml', url), 308);
  }
  if (!(response instanceof Response)) {
    return response;
  }
  // Add strict security headers
  if (request.url.startsWith(Deno.env.get('ORIGIN')!)) {
    try {
      response.headers.set(
        'strict-transport-security',
        'max-age=63072000; includeSubDomains; preload'
      );
    } catch {
      // Ignore immutable headers
    }
  }
  if (response.headers.get('content-type')?.includes('text/html')) {
    try {
      // Add policy to allow `data:` URIs in the stylesheet
      response.headers.append('x-img-src', 'data:');
    } catch {
      // Ignore immutable headers
    }
    // Add theme attribute to HTML document
    const theme = platform.cookies.get('theme')?.value;
    if (themes.includes(theme!)) {
      let body = await response.text();
      body = body.replace(/<html([^>]+?)>/, `<html$1 data-theme="${theme}">`);
      response = new Response(body, response);
    }
  }
  return response;
};
