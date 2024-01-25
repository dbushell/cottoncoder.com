<script context="module">
  export const pattern = '/:id/';

  export const load = async ({fetch, params, publicData}) => {
    try {
      const response = await fetch(`/api/bookmarks/${params.id}/`, {
        headers: {
          authorization: `Bearer ${Deno.env.get('CC_API_KEY')}`
        }
      });
      publicData.bookmark = await response.json();
    } catch {
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

  const {bookmark} = getContext('publicData');
  const {admin} = getContext('serverData');
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
