<script>
  import Bookmark from '@components/bookmark.svelte';
  import Support from '@components/support.svelte';

  export let bookmarks;

  const support = (i) => {
    if (bookmarks.length <= 4) {
      return i === bookmarks.length - 1;
    }
    return i === 3;
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
