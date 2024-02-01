<script>
  import Layout from '@components/layout.svelte';
  import {Container} from '@components/patchwork.js';
  import * as meta from '@server/meta.json';

  const heading = '404 Not Found';
  const title = `${heading} ${meta.emoji} ${meta.name}`;
</script>

<Layout {title}>
  <Container>
    <main class="Stack">
      <h1>{heading}</h1>
    </main>
  </Container>
</Layout>
