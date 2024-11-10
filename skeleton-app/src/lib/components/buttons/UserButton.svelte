<script lang="ts">
  import type { User } from "@auth0/auth0-spa-js";
  import { goto } from "$app/navigation";
  import Auth0Singleton from "$lib/services/Auth0Singleton";
  import IconButton from "$lib/components/buttons/IconButton.svelte";

  export let user: User | null;
  export let cButton: string = "";

  async function handleLogin() {
    await Auth0Singleton.login();
  }
</script>

{#if user}
  <IconButton icon="mdi:account" label={user.nickname} {cButton} onClick={() => goto("/mypage")} />
{:else}
  <IconButton icon="mdi:login" label="ログイン" {cButton} onClick={handleLogin} />
{/if}
