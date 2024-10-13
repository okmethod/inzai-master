<script lang="ts">
  import type { User } from "@auth0/auth0-spa-js";
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";
  import Auth0Singleton from "$lib/services/Auth0Singleton";

  export let user: User | null;

  async function handleLogin() {
    await Auth0Singleton.login();
  }
</script>

{#if user}
  <button
    class="cButtonGrayStyle flex flex-row items-center space-x-1 m-1"
    on:click|preventDefault={() => goto("/mypage")}
  >
    <div class="w-5 h-5">
      <Icon icon="mdi:account" class="w-full h-full" />
    </div>
    <span class="">{user.nickname}</span>
  </button>
{:else}
  <button class="cButtonGrayStyle flex flex-row items-center space-x-1 m-1" on:click|preventDefault={handleLogin}>
    <div class="w-5 h-5">
      <Icon icon="mdi:login" class="w-full h-full" />
    </div>
    <span class="">ログイン</span>
  </button>
{/if}
