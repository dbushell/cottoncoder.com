<script context="module">
  export const pattern = '/';
</script>

<script>
  import {getContext} from 'svelte';
  import Layout from '@components/layout.svelte';
  import Redirect from '@components/redirect.svelte';
  import FormLogin from '@components/form-login.svelte';
  import FormLogout from '@components/form-logout.svelte';
  import {Container} from '@components/patchwork.js';
  import * as meta from '../../server/meta.json';

  const url = getContext('url');
  const {user} = getContext('locals');

  const title = `Log in ${meta.emoji} ${meta.name}`;
</script>

<Layout {title}>
  <Container>
    <main class="Stack">
      {#if url.searchParams.has('redirect')}
        <Redirect pathname={'/account/login/'} />
      {:else}
        <h1>
          {#if user}Log out{:else}Log in{/if}
        </h1>
        {#if url.searchParams.get('error') === 'github'}
          <p><strong>GitHub authentication error.</strong></p>
        {/if}
        {#if user}
          <p>Logged in as {user.login}@github</p>
          <FormLogout />
        {:else}
          <p>Log in with GitHub</p>
          <FormLogin />
        {/if}
      {/if}
    </main>
  </Container>
</Layout>
