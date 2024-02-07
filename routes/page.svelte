<script context="module">
  export const pattern = '/:page(\\d+)/';

  import {redirect} from '@server/shared.ts';

  export const load = async ({request, params, fetch, serverData}) => {
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

<script>
  import {getContext} from 'svelte';
  import Layout from '@components/layout.svelte';
  import Hero from '@components/hero.svelte';
  import Bookmarks from '@components/bookmarks.svelte';
  import Pagination from '@components/pagination.svelte';
  import {Container} from '@components/patchwork.ts';
  import * as meta from '@server/meta.json';

  const {pageIndex, pageLength, bookmarks} = getContext('serverData');

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
