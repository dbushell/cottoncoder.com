<script context="module">
  const formatDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
</script>

<script>
  import {getContext, onMount} from 'svelte';

  export let id;
  export let hash;
  export let date;
  export let url;
  export let title;
  export let html;

  const {admin} = getContext('serverData') ?? {};

  onMount(() => {
    window.addEventListener('storage', function (ev) {
      if (
        ev.storageArea !== sessionStorage ||
        ev.key !== `/api/bookmarks/${id}/`
      ) {
        return;
      }
      try {
        const oldData = JSON.parse(ev.oldValue);
        const newData = JSON.parse(ev.newValue);
        if (oldData.url !== newData.url) {
          url = newData.url;
        }
        if (oldData.title !== newData.title) {
          title = newData.title;
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
</script>

<article id="bookmark-{hash}">
  <header>
    <h3>
      <a href={url} target="_blank" rel="noopener noreferrer">
        <span>{title}</span>
      </a>
    </h3>
  </header>
  <div>{@html html}</div>
  <p>
    <time datetime={date}>{formatDate.format(new Date(date))}</time>
    {#if admin}
      &ndash;
      <a href="/bookmarks/{id}/">Edit</a>
    {/if}
  </p>
</article>

<style>
  article {
    background-image: linear-gradient(
      225deg,
      oklch(var(--color-bg-default) / 1),
      oklch(var(--color-bg-default) / 0.5)
    );
    border: calc((1 / 16) * 1rem) solid oklch(var(--color-bg-lighter));
    border-radius: calc((8 / 16) * 1rem);
    display: grid;
    gap: var(--space-s);
    grid-template-columns: auto;
    grid-template-rows: auto auto 1fr;
    padding: var(--space-m) var(--space-m-l);
  }

  h3 {
    inline-size: fit-content;
    position: relative;
  }

  h3::after {
    aspect-ratio: 1 / 1;
    background: currentColor;
    content: '';
    display: block;
    inline-size: clamp(1rem, calc(var(--font-size) * 0.5), 2rem);
    inset-block-start: 10%;
    inset-inline-start: calc(100% + var(--space-2xs));
    mask: var(--bookmark) center center / 100% auto no-repeat;
    position: absolute;
  }

  h3 a {
    --underline-opacity: 0.5;
    position: relative;
    background-image: linear-gradient(
      to right,
      oklch(var(--color-primary) / 0.5),
      oklch(var(--color-secondary) / 0.5)
    );
    background-position: bottom 5% left;
    background-repeat: repeat-x;
    background-size: 100% 0;
    position: relative;
    text-decoration-line: underline;
    text-decoration-thickness: calc((2 / 16) * 1rem);
    text-decoration-skip-ink: all;
    text-decoration-color: oklch(
      var(--color-primary) / var(--underline-opacity)
    );
    text-underline-offset: 0.15em;
    transition:
      color 200ms,
      background-size 200ms,
      text-decoration-color 200ms;
  }

  h3 a:hover {
    --underline-opacity: 0;
    background-size: 100% 20%;
  }

  h3 a:focus-visible {
    --underline-opacity: 0;
    background-size: 100% 0;
  }

  div {
    --font-size: var(--step-0);
  }

  p {
    align-self: end;
    color: oklch(var(--color-text-subtle));
    font-size: var(--step-0);
    font-weight: 250;
    max-inline-size: none;
    text-align: end;
  }

  @container bookmarks (inline-size >= calc((900 / 16) * 1rem)) {
    article {
      grid-column-end: span 6;
    }

    article:nth-of-type(2n + 2) {
      grid-column-start: auto;
    }
  }
</style>
