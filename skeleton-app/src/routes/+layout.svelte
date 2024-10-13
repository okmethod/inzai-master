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
  import UserCollectionService from "$lib/services/UserCollectionService";
  import { collectionNameUsers, UserData, type UserDataDoc } from "$lib/types/document";
  import UserButton from "$lib/components/UserButton.svelte";
  import { rewardDailyLogin } from "$lib/internal/reward";

  let user: User | null = null;
  let checkedAuth = false;
  onMount(async () => {
    const rootUrl = `${$page.url.origin}`;
    await Auth0Singleton.init(rootUrl);
    await Auth0Singleton.handleRedirectCallback($page.url.pathname);
    user = await Auth0Singleton.getUser();
    if (user && user.sub) {
      console.log("User is authenticated.");
      await handleUserData(user.sub);
    } else {
      console.log("User is not authenticated.");
    }
    checkedAuth = true;
  });

  async function handleUserData(sub: string) {
    const dbService = new UserCollectionService(collectionNameUsers);
    const doc = await dbService.getBySub<UserDataDoc>(sub);
    const now = new Date();
    if (!doc) {
      const newUserData = new UserData(sub, now, 0);
      await dbService.add<UserDataDoc>(newUserData.toDoc());
    } else {
      const currentUserData = UserData.fromDoc(doc);
      const updatedUserData = new UserData(
        sub,
        now,
        doc.rewardPoints + rewardDailyLogin(currentUserData.latestLoginDate),
      );
      await dbService.setBySub<UserDataDoc>(sub, updatedUserData.toDoc());
    }
  }
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
