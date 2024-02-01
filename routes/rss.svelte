<script context="module">
  export const pattern = '.xml';

  import * as meta from '@server/meta.json';
  import {striptags, replace} from '@server/shared.ts';

  const url = new URL('/rss.xml', meta.url);

  const template = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/rss.xsl" type="text/xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{{meta.name}}</title>
    <description>{{meta.description}}</description>
    <link>{{meta.url}}</link>
    <lastBuildDate>{{lastBuildDate}}</lastBuildDate>
    <atom:link href="{{url}}" rel="self" type="application/rss+xml"/>
    <language>en-GB</language>
{{entries}}</channel>
</rss>
`;

  const entry = `<item>
  <title>{{title}}</title>
  <description>{{description}}</description>
  <link>{{link}}</link>
  <guid isPermaLink="true">{{guid}}</guid>
  <pubDate>{{pubDate}}</pubDate>
</item>
`;

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
      html = striptags(html);
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
