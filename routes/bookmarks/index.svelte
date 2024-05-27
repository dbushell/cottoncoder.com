<script context="module" lang="ts">
  import type {DinoLoad} from 'dinossr';
  import type {Data} from '@server/types.ts';

  export const pattern = '/:id/';

  export const load: DinoLoad<Data> = async ({fetch, params, publicData}) => {
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

<script lang="ts">
  import type {PublicData, ServerData} from '@server/types.ts';
  import {getContext} from 'svelte';
  import {Container} from '@components/patchwork.ts';
  import Layout from '@components/layout.svelte';
  import Bookmark from '@components/bookmark-island.svelte';
  import FormBookmark from '@components/forms/bookmark.svelte';

  const {bookmark} = getContext<PublicData>('publicData');
  const {admin} = getContext<ServerData>('serverData');
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
