import {marked} from 'marked';
import {markedSmartypants} from 'marked-smartypants';

marked.use({
  silent: true
});

marked.use({
  hooks: {
    postprocess: (html: string) => {
      html = html.replace(
        /(<p[^>]*?>.*?)&#8220;(.+?)&#8221;(.*?<\/p>)/g,
        '$1<q>$2</q>$3'
      );
      return html;
    }
  }
});

marked.use(markedSmartypants());

marked.use({
  renderer: {
    link(href: string, title: string | null | undefined, text: string) {
      try {
        const url = new URL(href);
        href = url.href;
      } catch {
        // Ignore...
      }
      let out = `<a href="${href}"`;
      if (title) out += ` title="${title}"`;
      out += ` rel="noopener noreferrer" target="_blank"`;
      out += `>${text}</a>`;
      return out;
    }
  }
});

export const markdown = (value: string) => marked.parse(value);
