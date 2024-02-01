export const redirect = (location: string | URL, status = 302) => {
  location = location instanceof URL ? location.href : location;
  return new Response(null, {
    status,
    headers: {
      location
    }
  });
};

export const authorized = (request: Request) => {
  if (
    request.method === 'GET' &&
    request.headers.get('authorization') ===
      `Bearer ${Deno.env.get('CC_API_KEY')}`
  ) {
    return true;
  }
};

export const striptags = (html: string) => {
  const regex = /<([\w]+?)[^>]*?>(.*?)<\/\1>/s;
  if (regex.test(html)) {
    html = html.replace(regex, (...args) => {
      if (args[1] === 'q') {
        return `“${args[2]}”`;
      } else {
        return args[2];
      }
    });
    html = striptags(html);
  }
  return html;
};

export const replace = (
  subject: string,
  search: string,
  replace = '',
  all = false
) => {
  let parts = subject.split(search);
  if (parts.length === 1) return subject;
  if (!all) parts = [parts.shift()!, parts.join(search)];
  return parts.join(replace);
};
