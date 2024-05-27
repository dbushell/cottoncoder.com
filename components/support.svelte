<script lang="ts">
  import {Button} from '@components/patchwork.ts';
  import IconKofi from '@components/icons/kofi.svelte';
  import * as meta from '@server/meta.json';
</script>

<aside class="Alert | flex ai-center jc-between gap-m">
  <p>{meta.support.text}</p>
  <Button small href={meta.support.url} label={meta.support.label} attr={{target: '_blank'}}>
    <IconKofi slot="icon" />
  </Button>
</aside>

<style>
  aside {
    margin: var(--space-s-m) auto;
    order: 0;
    padding: var(--space-s);
    padding-inline-start: var(--space-m);
    position: relative;
    transition: border-color 200ms;
    width: fit-content;
  }

  aside :global([href]::after) {
    content: '';
    display: block;
    inset: 0;
    position: absolute;
  }

  aside:has([href]:hover, [href]:focus) {
    border-color: oklch(var(--color-secondary));
  }

  p {
    margin-block: 0;
  }

  @container bookmarks (inline-size < calc((900 / 16) * 1rem)) {
    aside {
      margin-block: 0;
    }

    p {
      text-align: start;
    }
  }
</style>
