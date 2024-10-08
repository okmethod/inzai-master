<script lang="ts">
  import "../app.postcss";
  import { Toast, Modal, initializeStores } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  initializeStores();

  // Floating UI for Popups
  import { computePosition, autoUpdate, flip, shift, offset, arrow } from "@floating-ui/dom";
  import { storePopup } from "@skeletonlabs/skeleton";
  storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { page } from "$app/stores";
  import { base } from "$app/paths";
  import { initAuth0, auth0Store, auth0User } from "$lib/stores/auth0";
  import { navigateTo } from "$lib/utils/navigation.client";
  import UserButton from "$lib/components/UserButton.svelte";

  let user = $auth0User;
  let checkedAuth = false;
  onMount(async () => {
    const rootUrl = `${$page.url.origin}${base}`;
    await initAuth0(rootUrl);
    const auth0Service = get(auth0Store);
    await auth0Service.handleRedirectCallback($page.url.pathname);
    user = await auth0Service.getUser();
    if (user) {
      console.log("User is authenticated.");
      auth0User.set(user);
    } else {
      console.log("User is not authenticated.");
    }
    checkedAuth = true;
  });
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
        on:click|preventDefault={() => navigateTo("/")}
      >
        <div class="w-5 h-5">
          <Icon icon="mdi:home-outline" class="w-full h-full" />
        </div>
        <span class="">HOME</span>
      </button>
      <div class="flex-grow"><!--spacer--></div>
      <UserButton {checkedAuth} {user} />
    </div>
  </div>

  <div class="container mx-auto overflow-y-auto pb-2">
    <slot />
  </div>
</div>
