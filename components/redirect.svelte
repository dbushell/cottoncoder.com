<script context="module" lang="ts">
  export const island = true;
</script>

<script lang="ts">
  import {onMount} from 'svelte';

  export let pathname: string;

  onMount(() => {
    window.location.href = pathname;
  });
</script>

<p>
  <a href={pathname}>Continue</a> if you are not automatically redirected...
</p>
