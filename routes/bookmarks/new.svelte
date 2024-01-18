<script context="module">
  export const pattern = '/';

  export const load = async (_request, {locals}) => {
    if (locals.admin !== true) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/account/login/'
        }
      });
    }
  };
</script>

<script>
  import Layout from '@components/layout.svelte';
  import FormBookmark from '@components/form-bookmark.svelte';
  import {Container} from '@components/patchwork.js';
</script>

<Layout>
  <Container>
    <main class="Stack">
      <h1>New Bookmark</h1>
      <FormBookmark />
    </main>
  </Container>
</Layout>
