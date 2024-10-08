<script lang="ts">
  import { get } from "svelte/store";
  import Icon from "@iconify/svelte";
  import { auth0Store, auth0User } from "$lib/stores/auth0";

  const auth0Service = get(auth0Store);
  const user = get(auth0User);

  async function handleLogout() {
    await auth0Service.logout();
  }
</script>

<div class="flex flex-col items-center gap-1">
  <h1>MYページ</h1>
  <h2>ようこそ！ {user ? user.nickname : "Unknown"}</h2>

  <button class="cButtonGrayStyle flex flex-row items-center space-x-1 m-1" on:click|preventDefault={handleLogout}>
    <div class="w-5 h-5">
      <Icon icon="mdi:logout" class="w-full h-full" />
    </div>
    <span class="">ログアウト</span>
  </button>
</div>
