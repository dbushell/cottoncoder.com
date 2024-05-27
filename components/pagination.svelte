<script lang="ts">
  import {Container, Button} from '@components/patchwork.ts';
  import ArrowLeft from '@components/icons/arrow-left.svelte';
  import ArrowRight from '@components/icons/arrow-right.svelte';

  export let index: number;
  export let length: number;

  let newer: boolean | string = false;
  let older: boolean | string = false;

  if (index === 1) {
    newer = '/';
  }
  if (index > 1) {
    newer = `/page/${index}/`;
  }
  if (index < length - 1) {
    older = `/page/${index + 2}/`;
  }
</script>

{#if newer || older}
  <Container>
    <div class="Button-pagination">
      {#if newer}
        <Button href={newer} label="Newer" classes={['Button--left']}>
          <ArrowLeft slot="icon" />
        </Button>
      {/if}
      {#if older}
        <Button href={older} label={index ? 'Older' : 'More'} classes={['Button--right']}>
          <ArrowRight slot="icon" />
        </Button>
      {/if}
    </div>
  </Container>
{/if}

<style>
  :global(.Button-pagination .Button) {
    gap: var(--space-2xs);
  }

  :global(.Button--right svg) {
    order: 1;
  }
</style>
