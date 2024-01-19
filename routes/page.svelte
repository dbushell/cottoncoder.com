<script context="module">
  export const pattern = '/:page(\\d+)/';

  const redirect = (location) =>
    new Response(null, {
      status: 307,
      headers: {
        location
      }
    });

  export const load = async (_req, {params, fetch}) => {
    try {
      const page = Number.parseInt(params.page) - 1;
      if (page <= 0) {
        return redirect('/');
      }
      const response = await fetch(`/api/bookmarks/page/${page}/`, {
        headers: {
          authorization: `Bearer ${Deno.env.get('CC_API_KEY')}`
        }
      });
      if (!response.ok) {
        return redirect('/');
      }
      const data = await response.json();
      return {
        pageIndex: data.index,
        pageLength: data.length,
        bookmarks: data.bookmarks
      };
    } catch {
      return {
        pageIndex: 0,
        pageLength: 0,
        bookmarks: []
      };
    }
  };
</script>

<script>
  import {getContext} from 'svelte';
  import Layout from '@components/layout.svelte';
  import Hero from '@components/hero.svelte';
  import Bookmarks from '@components/bookmarks.svelte';
  import Pagination from '@components/pagination.svelte';
  import {Container} from '@components/patchwork.js';
  import * as meta from '../server/meta.json';

  const {pageIndex, pageLength, bookmarks} = getContext('data');

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
