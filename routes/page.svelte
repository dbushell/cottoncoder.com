<script context="module" lang="ts">
  import type {DinoLoad} from 'dinossr';
  import type {Data} from '@server/types.ts';

  export const pattern = '/:page(\\d+)/';

  import {redirect} from '@server/shared.ts';

  export const load: DinoLoad<Data> = async ({request, params, fetch, serverData}) => {
    try {
      const page = Number.parseInt(params.page) - 1;
      if (page <= 0) {
        return redirect(new URL('/', request.url), 307);
      }
      const response = await fetch(`/api/bookmarks/page/${page}/`, {
        headers: {
          authorization: `Bearer ${Deno.env.get('CC_API_KEY')}`
        }
      });
      if (!response.ok) {
        return redirect(new URL('/', request.url), 307);
      }
      const data = await response.json();
      serverData.pageIndex = data.index;
      serverData.pageLength = data.length;
      serverData.bookmarks = data.bookmarks;
    } catch {
      serverData.pageIndex = 0;
      serverData.pageLength = 0;
      serverData.bookmarks = [];
    }
  };
</script>

<script lang="ts">
  import type {ServerData} from '@server/types.ts';
  import {getContext} from 'svelte';
  import {Container} from '@components/patchwork.ts';
  import Layout from '@components/layout.svelte';
  import Hero from '@components/hero.svelte';
  import Bookmarks from '@components/bookmarks.svelte';
  import Pagination from '@components/pagination.svelte';
  import * as meta from '@server/meta.json';

  const {pageIndex, pageLength, bookmarks} = getContext<ServerData>('serverData');

  const heading = `Page ${pageIndex + 1}`;
  const title = `${heading} ${meta.emoji} ${meta.name}`;
</script>

<Layout {title}>
  <Hero />
  {#if pageLength === 0}
    <Container>
      <div class="Alert">
        <p>Website down for maintenance.</p>
      </div>
    </Container>
  {:else}
    <Bookmarks {bookmarks} />
  {/if}
  <Pagination index={pageIndex} length={pageLength} />
</Layout>
