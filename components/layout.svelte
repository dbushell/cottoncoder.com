<script>
  import {Button, Footer} from '@components/patchwork.js';
  import Header from '@components/header.svelte';
  import IconRSS from '@components/icons/rss.svelte';
  import * as meta from '../server/meta.json';

  export let title = `${meta.name} ${meta.emoji}`;
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="application-name" content={meta.name} />
  <meta name="description" content={meta.description} />
</svelte:head>

<div class="App">
  <Header />
  <slot />
  <Footer menu={meta.footer.menu}>
    <svelte:fragment slot="secondary">
      <div class="flex-shrink-0 flex gap-xs">
        <Button small label="Log in" href="/account/login/" />
        <Button
          icon
          small
          label="RSS Feed"
          href="/rss.xml"
          attr={{target: '_blank'}}
        >
          <IconRSS slot="icon" />
        </Button>
      </div>
    </svelte:fragment>
  </Footer>
</div>

<style>
  @font-face {
    font-family: 'Sora';
    src: url('/fonts/Sora-Variable.woff2') format('woff2');
    font-display: swap;
    font-weight: 100 800;
    font-style: normal;
  }

  @font-face {
    font-family: 'Cotton Coder';
    src: url('/fonts/Comfortaa-logotype.woff2') format('woff2');
    font-display: swap;
    font-weight: 300 700;
    font-style: normal;
    /* Subset for "Cotton Coder" */
    unicode-range: U+0043, U+006F, U+0074, U+006E, U+0064, U+0065, U+0072,
      U+0020;
  }

  :root {
    --color-primary: var(--color-pink);
    --color-secondary: var(--color-blue);
    --color-focus: var(--color-blue);
    --font-display: 'Sora', sans-serif;
    --font-sans: 'Sora', sans-serif;
    --bookmark: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18.885 2a1 1 0 0 0-1-1h-6a1 1 0 1 0 0 2h3.586L9.178 9.293a1 1 0 1 0 1.414 1.414l6.293-6.293V8a1 1 0 1 0 2 0zM3.009 3a2.012 2.012 0 0 0-1.998 2.218c.148 1.453.374 3.978.374 5.782 0 1.746-.212 4.17-.36 5.642a2.028 2.028 0 0 0 2.218 2.218c1.473-.148 3.896-.36 5.642-.36 1.804 0 4.33.226 5.782.374a2.012 2.012 0 0 0 2.218-1.998V12a1 1 0 1 0-2 0v4.878l-.003.003a.018.018 0 0 1-.006.003h-.006c-1.451-.147-4.068-.384-5.985-.384-1.857 0-4.37.222-5.842.37h-.008a.034.034 0 0 1-.012-.008.033.033 0 0 1-.008-.012.01.01 0 0 1 0-.002v-.006c.148-1.473.37-3.985.37-5.842 0-1.917-.237-4.534-.385-5.985v-.006l.004-.006A.016.016 0 0 1 3.007 5h4.878a1 1 0 0 0 0-2z"/></svg>');
  }

  :root[data-theme='light'] {
    --color-pink: 55% 0.22 330;
  }

  @media (prefers-color-scheme: light) {
    :root:not([data-theme]) {
      --color-pink: 55% 0.22 330;
    }
  }

  :global(h1, .h1) {
    font-weight: 900;
    letter-spacing: -0.05em;
  }

  :global(h2, h3) {
    font-weight: 600;
    letter-spacing: -0.025em;
  }

  :global(q) {
    text-decoration-line: underline;
    text-decoration-style: wavy;
    text-decoration-color: oklch(var(--color-secondary) / 0.5);
    text-decoration-skip-ink: all;
    text-underline-offset: 0.2em;
  }

  :global(q::before) {
    content: '“';
    font-weight: 200;
  }

  :global(q::after) {
    content: '”';
    font-weight: 200;
  }

  :global(.Footer .Button) {
    white-space: nowrap;
  }
</style>
