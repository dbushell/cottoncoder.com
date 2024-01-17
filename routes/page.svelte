<script context="module">
  export const pattern = '/:page(\\d+)/';

  export const load = async (_request, {params, fetch}) => {
    try {
      const page = Number.parseInt(params.page) - 1;
      if (page <= 0) {
        // Redirect to homepage
        return new Response(null, {
          status: 307,
          headers: {
            Location: '/'
          }
        });
      }
      const response = await fetch(`/api/bookmarks/page/${page}/`);
      if (!response.ok) {
        return new Response(null, {
          status: 307,
          headers: {
            Location: '/'
          }
        });
      }
      const data = await response.json();
      return {
        pageIndex: data.index,
        pageLength: data.length,
        bookmarks: data.bookmarks
      };
    } catch (err) {
      console.error(err);
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

  const {pageIndex, pageLength, bookmarks} = getContext('data');
</script>

<Layout>
  <Hero />
  <Bookmarks {bookmarks} />
  <Pagination index={pageIndex} length={pageLength} />
</Layout>
