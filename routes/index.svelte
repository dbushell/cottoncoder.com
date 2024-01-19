<script context="module">
  export const load = async (_req, {fetch}) => {
    try {
      const response = await fetch(`/api/bookmarks/page/0/`, {
        headers: {
          authorization: `Bearer ${Deno.env.get('CC_API_KEY')}`
        }
      });
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
