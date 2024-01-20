<script>
  import Bookmark from '@components/bookmark.svelte';

  export let bookmarks;
</script>

<div class="Grid | Container | Bookmarks">
  <h2 class="hidden">Bookmarks</h2>
  {#each bookmarks as bookmark (bookmark.hash)}
    <Bookmark {...bookmark} />
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
