<script context="module">
  export const island = true;
</script>

<script>
  import {Hero} from '@components/patchwork.js';
  import * as meta from '../server/meta.json';
</script>

<Hero heading={meta.name} description={meta.description} {...$$props}>
  <svelte:fragment slot="intro">
    <div class="Hero__intro">
      <p>{@html meta.descriptionHTML}</p>
    </div>
  </svelte:fragment>
</Hero>

<style>
  :global(.Hero) {
    --hero-min-height: calc((200 / 16) * 1rem);
    --hero-max-height: calc((100dvh - var(--header-height)) * 0.44);
  }

  :global(.Hero__heading) {
    font-family: 'Cotton Coder', var(--font-display);
  }

  :global(.Hero__intro) {
    grid-column: 1 / -1;
    text-wrap: balance;
  }

  :global(.Hero__intro a) {
    --color-anchor: var(--color-text);
  }
</style>
