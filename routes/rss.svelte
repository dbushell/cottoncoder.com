<script context="module">
  export const pattern = '.xml';

  import * as meta from '../server/meta.json';

  const url = new URL('/rss.xml', meta.url);

  const template = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet href="/rss.xsl" type="text/xsl"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
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

  export const load = async (request, {fetch}) => {
    const response = await fetch(`/api/bookmarks/page/0/`);
    return response;
  };

  export const get = async (request, response) => {
    const data = await response.json();

    let body = template;
    body = body.replace(`{{url}}`, url.href);
    body = body.replace(`{{lastBuildDate}}`, new Date().toUTCString());
    for (const [key, value] of Object.entries(meta)) {
      body = body.replaceAll(`{{meta.${key}}}`, value);
    }

    const entries = data.bookmarks.map((bookmark) => {
      let xml = entry;
      let html = bookmark.html;
      html += `<p><a href="${meta.url}"><b>${url.hostname}</b></a></p>`;
      const pubDate = new Date(bookmark.date).toUTCString();
      const guid = new URL(meta.url);
      guid.searchParams.set('guid', bookmark.hash);
      xml = xml.replace(`{{title}}`, bookmark.title);
      xml = xml.replace(`{{description}}`, html);
      xml = xml.replace(`{{link}}`, bookmark.url);
      xml = xml.replace(`{{guid}}`, guid.href);
      xml = xml.replace(`{{pubDate}}`, pubDate);
      return xml;
    });

    body = body.replace(`{{entries}}`, entries.join(''));

    return new Response(body, {
      headers: {
        'access-control-allow-origin': '*',
        'content-type': 'application/xml; charset=utf-8',
        'content-length': body.length.toString()
      }
    });
  };
</script>
