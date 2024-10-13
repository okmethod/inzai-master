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

  export let data: {
    user: User | null;
  };
</script>

<svelte:head>
  <title>自学マスタードリル</title>
</svelte:head>

<Modal />
<Toast position="tr" rounded="rounded-lg" />

<div class="flex flex-col h-screen">
  <div class="relative border-b border-gray-400 bg-gray-100">
    <div class="flex items-center justify-between h-full">
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

  <div class="container mx-auto overflow-y-auto pb-2">
    <slot />
  </div>
</div>
