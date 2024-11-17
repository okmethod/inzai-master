<script lang="ts">
  import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
  import type { User } from "@auth0/auth0-spa-js";
  import Auth0Singleton from "$lib/services/Auth0Singleton";
  import { getUser } from "$lib/stores/user";
  import { isEligibleForDailyReward, addRewardPoints, showRewardToast } from "$lib/internal/reward";
  import showThemeSwitchModal from "$lib/internal/showThemeSwitchModal";
  import UserDataCard from "$lib/components/cards/UserDataCard.svelte";
  import IconButton from "$lib/components/buttons/IconButton.svelte";

  export let data: {
    user: User | null;
  };

  const userData = getUser();

  const userImageUrl = data.user ? data.user.picture : "";
  const userNickName = data.user ? data.user.nickname : "";
  let userRewardPoints = userData ? userData.rewardPoints : 0;

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  const rewardKey = "DAILY_LOGIN";
  let addedReward = userData ? !isEligibleForDailyReward(userData, rewardKey) : false;
  async function handleLoginReward() {
    userRewardPoints += await addRewardPoints(rewardKey);
    showRewardToast(toastStore, rewardKey);
    addedReward = true;
  }

  async function handleLogout() {
    await Auth0Singleton.logout();
  }
</script>

<div class="cPageBodyStyle">
  {#if data.user === null || userData === null}
    <span> マイページを確認するにはログインしてね！ </span>
  {:else}
    <div class="mb-4 flex flex-col items-center space-y-4">
      <UserDataCard {userImageUrl} {userNickName} bind:userRewardPoints />
      <IconButton
        icon="mdi:creation"
        label={addedReward ? "また明日もらえるよ" : "ログインボーナスをもらう"}
        onClick={handleLoginReward}
        cButton="cMonoButton"
        disabled={addedReward}
      />
      <IconButton
        icon="mdi:menu"
        label="テーマ切り替え"
        cButton="cMonoButton"
        onClick={() => showThemeSwitchModal(modalStore)}
      />
      <IconButton icon="mdi:logout" label="ログアウト" cButton="cMonoButton" onClick={handleLogout} />
    </div>
  {/if}
</div>
