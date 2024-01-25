// Match all routes
export const pattern = '/*';

// After all other routes
export const order = 999;

const themes = ['light', 'dark'];

export const get = async (request, response, {platform}) => {
  const url = new URL(request.url);
  // Redirect to RSS feed
  if (/^\/(rss|feed)\/?$/.test(url.pathname)) {
    return Response.redirect(new URL('/rss.xml', url), 308);
  }
  if (!(response instanceof Response)) {
    return response;
  }
  // Add strict security headers
  if (request.url.startsWith(Deno.env.get('ORIGIN'))) {
    response.headers.set(
      'strict-transport-security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }
  // Add policy to allow `data:` URIs in the stylesheet
  if (response.headers.get('content-type')?.includes('text/html')) {
    response.headers.append('x-img-src', 'data:');
    const theme = platform.cookies.get('theme')?.value;
    if (themes.includes(theme)) {
      let body = await response.text();
      body = body.replace(/<html([^>]+?)>/, `<html$1 data-theme="${theme}">`);
      response = new Response(body, response);
    }
  }
  return response;
};
