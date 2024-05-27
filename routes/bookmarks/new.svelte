<script context="module" lang="ts">
  import type {DinoLoad} from 'dinossr';
  import type {Data} from '@server/types.ts';

  export const pattern = '/';

  import {redirect} from '@server/shared.ts';

  export const load: DinoLoad<Data> = async ({serverData}) => {
    if (serverData.admin !== true) {
      return redirect('/account/login/');
    }
  };
</script>

<script lang="ts">
  import {Container} from '@components/patchwork.ts';
  import Layout from '@components/layout.svelte';
  import FormBookmark from '@components/forms/bookmark.svelte';
</script>

<Layout>
  <Container>
    <main class="Stack">
      <h1>New Bookmark</h1>
      <FormBookmark />
    </main>
  </Container>
</Layout>
