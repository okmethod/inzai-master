<script lang="ts">
  import "../app.postcss";
  import { Toast, Modal, initializeStores } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  initializeStores();

  // Floating UI for Popups
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { storePopup } from "@skeletonlabs/skeleton";
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  import { goto } from "$app/navigation";
  import type { User } from "@auth0/auth0-spa-js";
  import UserButton from "$lib/components/UserButton.svelte";

  import { onMount } from "svelte";
  import { applyTheme } from "$lib/stores/theme";

  let isLoaded = false;
  onMount(async () => {
    function wait(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    await Promise.all([applyTheme(), wait(500)]);
    isLoaded = true;
  });

  export let data: {
    user: User | null;
  };
</script>

<svelte:head>
  <title>自学マスタードリル</title>
</svelte:head>

<Modal />
<Toast position="tr" rounded="rounded-lg" />

{#if isLoaded}
  <div class="h-screen flex flex-col">
    <div class="relative border-b border-gray-400 bg-gray-100">
      <div class="h-full flex items-center justify-between">
        <button
          class="cButtonGrayStyle flex flex-row items-center space-x-1 m-1"
          on:click|preventDefault={() => goto("/")}
        >
          <div class="w-5 h-5">
            <Icon icon="mdi:home-outline" class="w-full h-full" />
          </div>
          <span class="">HOME</span>
        </button>
        <div class="flex-grow"><!--spacer--></div>
        <UserButton user={data.user} />
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
