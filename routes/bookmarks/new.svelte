<script context="module">
  export const pattern = '/';

  import {redirect} from '@server/utils.ts';

  export const load = async ({serverData}) => {
    if (serverData.admin !== true) {
      return redirect('/account/login/');
    }
  };
</script>

<script>
  import Layout from '@components/layout.svelte';
  import FormBookmark from '@components/forms/bookmark.svelte';
  import {Container} from '@components/patchwork.js';
</script>

<Layout>
  <Container>
    <main class="Stack">
      <h1>New Bookmark</h1>
      <FormBookmark />
    </main>
  </Container>
</Layout>
