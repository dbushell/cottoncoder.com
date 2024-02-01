<script context="module">
  export const island = true;
</script>

<script>
  import {onMount} from 'svelte';
  import {Header, Button} from '@components/patchwork.js';
  import IconRSS from '@components/icons/rss.svelte';
  import IconSun from '@components/icons/sun.svelte';
  import IconMoon from '@components/icons/moon.svelte';
  import * as meta from '@server/meta.json';

  let theme = '';

  const onTheme = async (newTheme) => {
    const response = await fetch('/theme/', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({theme: newTheme})
    });
    const {success} = await response.json();
    if (success) {
      document.documentElement.setAttribute('data-theme', newTheme);
      theme = newTheme;
    }
  };

  onMount(() => {
    if ('serviceWorker' in window.navigator) {
      window.navigator.serviceWorker.register('/sw.js');
    }
    theme = document.documentElement.getAttribute('data-theme');
    if (!theme) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        theme = 'dark';
      } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        theme = 'light';
      }
    }
  });
</script>

<Header heading={meta.name} tag={meta.tag}>
  <svelte:fragment slot="secondary">
    <div class="Header__theme | flex gap-xs">
      <div class="Button-group">
        <Button
          small
          label="Light"
          disabled={theme === 'light'}
          on:click={() => onTheme('light')}
        >
          <IconSun slot="icon" />
        </Button>
        <Button
          small
          label="Dark"
          disabled={theme === 'dark'}
          on:click={() => onTheme('dark')}
        >
          <IconMoon slot="icon" />
        </Button>
      </div>
      <Button
        icon
        small
        label="RSS Feed"
        href="/rss.xml"
        attr={{target: '_blank'}}
      >
        <IconRSS slot="icon" />
      </Button>
    </div></svelte:fragment
  >
</Header>

<style>
  :global(.Header__logo) {
    align-items: center;
    display: flex;
    font-weight: 200;
    gap: var(--space-xs);
    white-space: nowrap;
  }

  :global(.Header__name) {
    font-family: 'Cotton Coder', var(--font-display);
    letter-spacing: -0.025em;
  }

  :global(.Header__tag) {
    text-transform: none;
  }

  :global(.Header__logo::before) {
    aspect-ratio: 450 / 300;
    background: url('/cotton.svg') center center / contain no-repeat;
    block-size: var(--button-small-height);
    content: '';
    display: block;
  }

  :global(:where([dir='rtl']) .Header__logo::before) {
    transform: scaleX(-1);
  }

  :global(.Header__theme .Button-group) {
    flex-wrap: nowrap;
    margin: 0;
  }

  :global(.Header__theme .Button-group .Button) {
    gap: var(--space-2xs);
  }

  @container header (inline-size < calc((550 / 16) * 1rem)) {
    :global(.Header__tag) {
      display: none;
    }
  }

  @container header (inline-size < calc((450 / 16) * 1rem)) {
    :global(.Header__name) {
      display: none;
    }
  }

  @container header (inline-size < calc((350 / 16) * 1rem)) {
    :global(.Header [href$='rss.xml']) {
      display: none;
    }
  }
</style>
