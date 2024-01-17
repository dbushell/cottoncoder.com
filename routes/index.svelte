<script context="module">
  export const load = async (_request, {fetch}) => {
    try {
      const response = await fetch(`/api/bookmarks/page/0/`);
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
  import FormLogout from '@components/form-logout.svelte';
  import IconBookmark from '@components/icon/bookmark.svelte';
  import {Container, Button} from '@components/patchwork.js';

  const {pageIndex, pageLength, bookmarks} = getContext('data');
  const {admin} = getContext('locals');
</script>

<Layout>
  <Hero />
  {#if admin === true}
    <Container>
      <div class="flex gap-s ai-center jc-between">
        <Button href="/bookmarks/new/" label="New Bookmark">
          <IconBookmark slot="icon" />
        </Button>
        <FormLogout />
      </div>
    </Container>
  {/if}
  <Bookmarks {bookmarks} />
  <Pagination index={pageIndex} length={pageLength} />
</Layout>
