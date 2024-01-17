<script>
  import Island from '@dinossr/island';
  import {onMount} from 'svelte';

  export let pathname;

  onMount(() => {
    window.location.href = pathname;
  });
</script>

<Island props={$$props}>
  <p>
    <a href={pathname}>Continue</a> if you are not automatically redirected...
  </p>
</Island>
