<script context="module" lang="ts">
  import type {DinoLoad} from 'dinossr';
  import type {Data} from '@server/types.ts';

  export const load: DinoLoad<Data> = async ({fetch, serverData}) => {
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

<script lang="ts">
  import type {ServerData} from '@server/types.ts';
  import {getContext} from 'svelte';
  import {Container, Button} from '@components/patchwork.ts';
  import Layout from '@components/layout.svelte';
  import Hero from '@components/hero.svelte';
  import Bookmarks from '@components/bookmarks.svelte';
  import Pagination from '@components/pagination.svelte';
  import FormLogout from '@components/forms/logout.svelte';
  import IconBookmark from '@components/icons/bookmark.svelte';

  const {admin, pageIndex, pageLength, bookmarks} = getContext<ServerData>('serverData');
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
