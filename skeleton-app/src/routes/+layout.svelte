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
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import type { User } from "@auth0/auth0-spa-js";
  import Auth0Singleton from "$lib/services/Auth0Singleton";
  import { collectionNameUsers, type UserData } from "$lib/types/document";
  import UserCollectionService from "$lib/services/UserCollectionService";
  import UserButton from "$lib/components/UserButton.svelte";

  let user: User | null = null;
  let checkedAuth = false;
  onMount(async () => {
    const rootUrl = `${$page.url.origin}`;
    await Auth0Singleton.init(rootUrl);
    await Auth0Singleton.handleRedirectCallback($page.url.pathname);
    user = await Auth0Singleton.getUser();
    if (user) {
      console.log("User is authenticated.");
      const dbService = new UserCollectionService(collectionNameUsers);
      if (user.sub) {
        const doc = await dbService.getBySub<UserData>(user.sub);
        const now = new Date();
        if (!doc) {
          dbService.add<UserData>({ sub: user.sub, latestLogin: now });
        } else {
          dbService.setBySub<UserData>(user.sub, { latestLogin: now });
        }
      }
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
        on:click|preventDefault={() => goto("/")}
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
