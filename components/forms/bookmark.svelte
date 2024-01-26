<script>
  import Island from '@dinossr/island';
  import {onMount} from 'svelte';
  import {Button, Checkbox, Field} from '@components/patchwork.js';

  export let id = 'new';
  export let date = '';
  export let url = '';
  export let title = '';
  export let markdown = '';

  date = new Date(date || Date.now()).toISOString().split('.')[0];

  const action = `/api/bookmarks/${id}/`;

  const loadStorage = () => {
    if (id !== 'new') return;
    try {
      const data = JSON.parse(localStorage.getItem(action));
      ({url, title, markdown} = data);
    } catch {
      localStorage.setItem(action, JSON.stringify({url, title, markdown}));
    }
  };

  const updateStorage = () => {
    const storageArea =
      window[id === 'new' ? 'localStorage' : 'sessionStorage'];
    const key = action;
    const oldValue = storageArea.getItem(key);
    const newValue = JSON.stringify({url, title, markdown});
    storageArea.setItem(key, newValue);
    window.dispatchEvent(
      new StorageEvent('storage', {
        storageArea,
        key,
        oldValue,
        newValue
      })
    );
  };

  onMount(() => {
    loadStorage();
  });

  const onSubmit = async (ev) => {
    ev.preventDefault();
    const data = new FormData(ev.target);
    const response = await fetch(action, {
      method: 'POST',
      body: data,
      headers: {
        accept: 'application/json'
      }
    });
    if (response.headers.get('content-type') === 'application/json') {
      const json = await response.json();
      if (json.location) {
        if (id === 'new') {
          localStorage.removeItem(action);
        }
        window.location.href = json.location;
      }
    }
  };

  const onInputURL = (ev) => {
    url = ev.target.value;
    updateStorage();
  };

  const onInputTitle = (ev) => {
    title = ev.target.value;
    updateStorage();
  };

  const onInputMarkdown = (ev) => {
    markdown = ev.target.value;
    updateStorage();
  };
</script>

<Island props={$$props}>
  <form class="Stack Stack--small" method="POST" {action} on:submit={onSubmit}>
    <label class="p" for="bookmark-title">Title</label>
    <Field
      required
      id="bookmark-title"
      name="title"
      value={title ?? ''}
      on:input={onInputTitle}
    />
    <label class="p" for="bookmark-url">URL</label>
    <Field
      required
      id="bookmark-url"
      name="url"
      type="url"
      value={url ?? ''}
      on:input={onInputURL}
    />
    <label class="p" for="bookmark-date">Date</label>
    <input
      class="Field"
      id="bookmark-date"
      name="date"
      type="datetime-local"
      step="any"
      value={date ?? ''}
    />
    <label class="hidden" for="bookmark-markdown">Markdown</label>
    <textarea
      required
      id="bookmark-markdown"
      class="Field"
      rows="8"
      name="markdown"
      value={markdown ?? ''}
      on:input={onInputMarkdown}
    />
    <div class="flex gap-s ai-center jc-between">
      <Button type="submit" label="Save Bookmark" />
      {#if id !== 'new'}
        <Checkbox label="Delete" name="delete" />
      {/if}
    </div>
  </form>
</Island>

<style>
  form {
    align-items: center;
    display: grid;
    grid-template-columns: auto 1fr;
  }

  form > * {
    grid-column: 2/ 3;
  }

  form > label {
    grid-column: 1/ 2;
  }

  textarea {
    height: auto;
  }
</style>
