<script context="module">
  export const pattern = '.xml';

  import * as meta from '../server/meta.json';

  const url = new URL('/rss.xml', meta.url);

  const template = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/rss.xsl" type="text/xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[{{meta.name}}]]></title>
    <description><![CDATA[{{meta.description}}]]></description>
    <link>{{meta.url}}</link>
    <lastBuildDate>{{lastBuildDate}}</lastBuildDate>
    <atom:link href="{{url}}" rel="self" type="application/rss+xml"/>
    <language><![CDATA[en-GB]]></language>
{{entries}}</channel>
</rss>
`;

  const entry = `<item>
  <title><![CDATA[{{title}}]]></title>
  <description><![CDATA[{{description}}]]></description>
  <link>{{link}}</link>
  <guid isPermaLink="true">{{guid}}</guid>
  <pubDate>{{pubDate}}</pubDate>
</item>
`;

  const replace = (subject, search, replace = '', all = false) => {
    let parts = subject.split(search);
    if (parts.length === 1) return subject;
    if (!all) parts = [parts.shift(), parts.join(search)];
    return parts.join(replace);
  };

  export const load = async ({fetch, serverData}) => {
    const response = await fetch(`/api/bookmarks/page/0/`, {
      headers: {
        authorization: `Bearer ${Deno.env.get('CC_API_KEY')}`
      }
    });
    const data = await response.json();
    serverData.bookmarks = data.bookmarks;
  };

  export const get = async (_req, _res, {platform}) => {
    const {bookmarks} = platform.serverData;

    let body = template;
    body = replace(body, `{{url}}`, url.href);
    body = replace(
      body,
      `{{lastBuildDate}}`,
      new Date(bookmarks[0].date).toUTCString()
    );
    for (const [key, value] of Object.entries(meta)) {
      body = body.replaceAll(`{{meta.${key}}}`, value);
    }

    const entries = bookmarks.map((bookmark) => {
      let xml = entry;
      let html = bookmark.html;
      html += `<p><a href="${meta.url}"><b>${url.hostname}</b></a></p>`;
      const pubDate = new Date(bookmark.date).toUTCString();
      const guid = new URL(meta.url);
      guid.pathname = `/bookmarks/${bookmark.id}/`;
      xml = replace(xml, `{{title}}`, bookmark.title);
      xml = replace(xml, `{{description}}`, html);
      xml = replace(xml, `{{link}}`, bookmark.url);
      xml = replace(xml, `{{guid}}`, guid.href);
      xml = replace(xml, `{{pubDate}}`, pubDate);
      return xml;
    });

    body = replace(body, `{{entries}}`, entries.join(''));

    return new Response(body, {
      headers: {
        'access-control-allow-origin': '*',
        'content-type': 'application/xml; charset=utf-8',
        'content-length': body.length.toString()
      }
    });
  };
</script>
