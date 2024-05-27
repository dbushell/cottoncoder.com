<script context="module" lang="ts">
  import type {DinoHandle} from 'dinossr';
  import type {Data} from '@server/types.ts';

  export const pattern = '/';

  export const GET: DinoHandle<Data> = ({response}) => {
    // Add CSP header for OAuth redirect
    // required in Safari and Chromium but not Firefox
    response.headers.append('x-form-action', 'https://github.com/login/oauth/authorize');
    return response;
  };
</script>

<script lang="ts">
  import type {ServerData} from '@server/types.ts';
  import {getContext} from 'svelte';
  import {Container} from '@components/patchwork.ts';
  import Layout from '@components/layout.svelte';
  import Redirect from '@components/redirect.svelte';
  import FormLogin from '@components/forms/login.svelte';
  import FormLogout from '@components/forms/logout.svelte';
  import * as meta from '@server/meta.json';

  const url = getContext<URL>('url');
  const {user} = getContext<ServerData>('serverData');

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
