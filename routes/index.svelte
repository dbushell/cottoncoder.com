<script context="module">
  export const load = async ({fetch, serverData}) => {
    try {
      const response = await fetch(`/api/bookmarks/page/0/`, {
        headers: {
          authorization: `Bearer ${Deno.env.get('CC_API_KEY')}`
        }
      });
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
  import FormLogout from '@components/forms/logout.svelte';
  import IconBookmark from '@components/icons/bookmark.svelte';
  import {Container, Button} from '@components/patchwork.ts';

  const {admin, pageIndex, pageLength, bookmarks} = getContext('serverData');
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
