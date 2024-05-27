<script lang="ts">
  import type {Bookmark as BookmarkType} from '@server/types';
  import Bookmark from '@components/bookmark.svelte';
  import Support from '@components/support.svelte';

  export let bookmarks: Array<BookmarkType>;

  const support = (i: number) => {
    if (bookmarks.length <= 8) {
      return i === bookmarks.length - 1;
    }
    return i === 7;
  };
</script>

<div class="Grid | Container | Bookmarks">
  <h2 class="hidden">Bookmarks</h2>
  {#each bookmarks as bookmark, i (bookmark.hash)}
    <Bookmark {...bookmark} />
    {#if support(i)}
      <Support />
    {/if}
  {/each}
</div>

<style>
  .Bookmarks {
    align-items: stretch;
    container-name: bookmarks;
    container-type: inline-size;
    grid-row-gap: var(--space-m);
  }
</style>
