<script lang="ts">
  import {Button} from '@components/patchwork.ts';
</script>

<form action="/auth/github/logout/" method="POST">
  <Button type="submit" label="Log out" />
</form>
