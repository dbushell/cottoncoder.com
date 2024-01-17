<script context="module">
  export const pattern = '/';
</script>

<script>
  import Layout from '@components/layout.svelte';
  import {Container} from '@components/patchwork.js';
  import * as meta from '../server/meta.json';

  const heading = 'About';
  const title = `${heading} ${meta.emoji} ${meta.name}`;
</script>

<Layout {title}>
  <Container>
    <main class="Stack">
      <h1>{heading}</h1>
      <div class="Prose">
        <p>
          <strong>Cotton Coder</strong> is a bookmark blog (aka
          <a
            href="https://en.wikipedia.org/wiki/Linklog"
            rel="noopener noreferrer"
            target="_blank">linklog</a
          >) curated by me; <a href="https://dbushell.com">David Bushell</a>.
        </p>
        <p>Links are related to:</p>
        <ul>
          <li>Web design</li>
          <li>Web development</li>
          <li>Web technology</li>
        </ul>
        <p>
          Basically anything web related or web adjacent that I find
          interesting.
        </p>
        <h2>Disclaimer</h2>
        <p><strong>Click at your own risk!</strong></p>
        <p>
          Linking to a page does not mean I endorse nor agree with its content;
          only that I think it’s worth sharing. I cannot guarantee the content
          or uptime of any page linked. Broken links will be removed if found.
          Please open a <a
            href="https://github.com/dbushell/cottoncoder.com/issues"
            rel="noopener noreferrer"
            target="_blank">GitHub issue</a
          > if you have any concerns.
        </p>
        <p>☁️</p>
      </div>
    </main>
  </Container>
</Layout>
