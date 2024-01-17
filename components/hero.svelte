<script>
  import Island from '@dinossr/island';
  import {Hero} from '@components/patchwork.js';
  import * as meta from '../server/meta.json';
</script>

<Island props={$$props}>
  <Hero heading={meta.name} description={meta.description} {...$$props}>
    <svelte:fragment slot="intro">
      <p class="Hero__intro">
        {@html meta.descriptionHTML}
      </p>
    </svelte:fragment>
  </Hero>
</Island>

<style>
  :global(.Hero) {
    --hero-min-height: calc((200 / 16) * 1rem);
    --hero-max-height: calc((100dvh - var(--header-height)) * 0.4);
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
