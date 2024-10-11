<script lang="ts">
  import { get } from "svelte/store";
  import type { User } from "@auth0/auth0-spa-js";
  import Icon from "@iconify/svelte";
  import { goto } from "$app/navigation";
  import { auth0Store } from "$lib/stores/auth0";

  export let checkedAuth: boolean;
  export let user: User | null;

  const auth0Service = get(auth0Store);

  async function handleLogin() {
    await auth0Service.login();
  }
</script>

{#if !checkedAuth}
  <div class="cButtonGrayStyle flex flex-row items-center space-x-1 m-1">
    <div class="w-5 h-5">
      <Icon icon="mdi:account-question" class="w-full h-full" />
    </div>
    <span class="">Loading...</span>
  </div>
{:else if user}
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
