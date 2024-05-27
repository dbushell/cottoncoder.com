<script context="module" lang="ts">
  export const island = true;
</script>

<script lang="ts">
  import Bookmark from '@components/bookmark.svelte';
</script>

<Bookmark {...$$props} />
