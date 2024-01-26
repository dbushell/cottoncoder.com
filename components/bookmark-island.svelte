<script>
  import Island from '@dinossr/island';
  import Bookmark from '@components/bookmark.svelte';
</script>

<Island props={$$props}>
  <Bookmark {...$$props} />
</Island>
