<script context="module">
  export const pattern = '/:id/';

  export const load = async (_req, {params, fetch}) => {
    try {
      const response = await fetch(`/api/bookmarks/${params.id}/`, {
        headers: {
          authorization: `Bearer ${Deno.env.get('CC_API_KEY')}`
        }
      });
      const data = await response.json();
      return {
        bookmark: data
      };
    } catch (err) {
      return new Response(null, {
        status: 404
      });
    }
  };
</script>

<script>
  import {getContext} from 'svelte';
  import Layout from '@components/layout.svelte';
  import Bookmark from '@components/bookmark.svelte';
  import FormBookmark from '@components/form-bookmark.svelte';
  import {Container} from '@components/patchwork.js';

  const {bookmark} = getContext('data');
  const {admin} = getContext('locals');
</script>

<Layout>
  <Container>
    <main class="Stack">
      <Bookmark {...bookmark} />
      {#if admin === true}
        <FormBookmark {...bookmark} />
      {/if}
    </main>
  </Container>
</Layout>
