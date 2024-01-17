<script>
  import {Button, Checkbox, Field} from '@components/patchwork.js';

  export let id = 'new';
  export let date = '';
  export let url = '';
  export let title = '';
  export let markdown = '';

  date = new Date(date || Date.now()).toISOString().split('.')[0];

  const action = `/api/bookmarks/${id}/`;
</script>

<form class="Stack Stack--small" {action} method="POST">
  <label class="p" for="bookmark-title">Title</label>
  <Field id="bookmark-title" name="title" value={title} required />
  <label class="p" for="bookmark-url">URL</label>
  <Field id="bookmark-url" name="url" type="url" value={url} required />
  <label class="p" for="bookmark-date">Date</label>
  <input
    class="Field"
    id="bookmark-date"
    name="date"
    type="datetime-local"
    value={date}
  />
  <label class="hidden" for="bookmark-markdown">Markdown</label>
  <textarea
    id="bookmark-markdown"
    class="Field"
    rows="8"
    name="markdown"
    required>{markdown}</textarea
  >
  <div class="flex gap-s ai-center jc-between">
    <Button type="submit" label="Save Bookmark" />
    {#if id !== 'new'}
      <Checkbox label="Delete" name="delete" />
    {/if}
  </div>
</form>

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
