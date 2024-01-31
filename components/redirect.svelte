<script context="module">
  export const island = true;
</script>

<script>
  import {onMount} from 'svelte';

  export let pathname;

  onMount(() => {
    window.location.href = pathname;
  });
</script>

<p>
  <a href={pathname}>Continue</a> if you are not automatically redirected...
</p>
