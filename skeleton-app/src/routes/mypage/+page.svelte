<script lang="ts">
  import { getToastStore, getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
  import type { User } from "@auth0/auth0-spa-js";
  import Auth0Singleton from "$lib/services/Auth0Singleton";
  import { getUser } from "$lib/stores/user";
  import { isEligibleForDailyReward, addRewardPoints, showRewardToast } from "$lib/internal/reward";
  import UserDataCard from "$lib/components/cards/UserDataCard.svelte";
  import IconButton from "$lib/components/buttons/IconButton.svelte";
  import ThemeSwitchModal from "$lib/components/modals/ThemeSwitchModal.svelte";

  export let data: {
    user: User | null;
  };

  const userData = getUser();

  const userImageUrl = data.user ? data.user.picture : "";
  const userNickName = data.user ? data.user.nickname : "";
  let userRewardPoints = userData ? userData.rewardPoints : 0;

  const toastStore = getToastStore();

  const rewardKey = "DAILY_LOGIN";
  let addedReward = userData ? !isEligibleForDailyReward(userData, rewardKey) : false;
  async function handleLoginReward() {
    userRewardPoints += await addRewardPoints(rewardKey);
    showRewardToast(toastStore, rewardKey);
    addedReward = true;
  }

  const modalStore = getModalStore();
  function showThemeSwitchModal(): void {
    const m: ModalSettings = {
      type: "component",
      component: {
        ref: ThemeSwitchModal,
        props: {},
      },
      backdropClasses: "fixed inset-0 !bg-gray-300/90",
    };
    modalStore.trigger(m);
  }

  async function handleLogout() {
    await Auth0Singleton.logout();
  }
</script>

{#if data.user === null || userData === null}
  <span> マイページを確認するにはログインしてね！ </span>
{:else}
  <div class="flex flex-col items-center mt-2 space-y-4">
    <UserDataCard {userImageUrl} {userNickName} bind:userRewardPoints />
    <IconButton
      icon="mdi:creation"
      label={addedReward ? "また明日もらえるよ" : "ログインボーナスをもらう"}
      onClick={handleLoginReward}
      cButton="cMonoButton"
      disabled={addedReward}
    />
    <IconButton icon="mdi:menu" label="テーマ切り替え" cButton="cMonoButton" onClick={showThemeSwitchModal} />
    <IconButton icon="mdi:logout" label="ログアウト" cButton="cMonoButton" onClick={handleLogout} />
  </div>
{/if}
