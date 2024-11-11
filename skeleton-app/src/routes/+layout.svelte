<script lang="ts">
  import "../app.postcss";
  import { onMount } from "svelte";
  import { Toast, Modal, initializeStores } from "@skeletonlabs/skeleton";
  import { storePopup } from "@skeletonlabs/skeleton";
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import type { User } from "@auth0/auth0-spa-js";
  import { goto } from "$app/navigation";
  import { getUser } from "$lib/stores/user";
  import { setTheme } from "$lib/stores/theme";
  import IconButton from "$lib/components/buttons/IconButton.svelte";
  import UserButton from "$lib/components/buttons/UserButton.svelte";

  export let data: {
    user: User | null;
  };

  initializeStores();
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  let isLoaded = false;
  onMount(async () => {
    function wait(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await Promise.all([setTheme(getUser()?.theme ?? null), wait(500)]);
    isLoaded = true;
  });
</script>

<svelte:head>
  <title>自学マスタードリル</title>
</svelte:head>

<Modal />
<Toast position="tr" rounded="rounded-lg" />

{#if isLoaded}
  <div class="h-screen flex flex-col">
    <div class="relative border-b border-primary-400 bg-primary-200 p-1">
      <div class="h-full flex items-center justify-between space-x-2">
        <IconButton icon="mdi:home-outline" label="Home" cButton="cIconButtonStyle" onClick={() => goto("/")} />
        <div class="flex-grow"><!--spacer--></div>
        <UserButton user={data.user} cButton="cIconButtonStyle" />
      </div>
    </div>

    <div class="w-screen mx-auto overflow-y-scroll scrollbar-gutter-stable sm:ml-2 pb-24">
      <slot />
    </div>
  </div>
{:else}
  <div class="h-screen flex items-center justify-center bg-gray-100">
    <div class="font-mono text-black text-2xl">Now Loading...</div>
  </div>
{/if}
