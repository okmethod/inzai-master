<script lang="ts">
  import { getToastStore } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import Auth0Singleton from "$lib/services/Auth0Singleton";
  import type { User } from "@auth0/auth0-spa-js";
  import type { UserData } from "$lib/types/document";
  import { isEligibleForDailyReward, updateRewardPoints, showRewardToast } from "$lib/internal/reward";

  export let data: {
    user: User | null;
    userData: UserData | null;
  };
  const userImageUrl = data.user ? data.user.picture : "";
  const userNickName = data.user ? data.user.nickname : "";
  let userRewardPoints = data.userData ? data.userData.rewardPoints : 0;

  const toastStore = getToastStore();

  const rewardKey = "DAILY_LOGIN";
  let addedReward = data.userData ? !isEligibleForDailyReward(data.userData, rewardKey) : false;
  async function handleLoginReward() {
    userRewardPoints = data.userData ? await updateRewardPoints(data.userData.sub, rewardKey) : 0;
    showRewardToast(toastStore, rewardKey);
    addedReward = true;
  }

  async function handleLogout() {
    await Auth0Singleton.logout();
  }
</script>

<div class="flex flex-col items-center mt-2 space-y-4">
  <div class="flex flex-col items-center border rounded-lg space-y-4 p-4">
    <img src={userImageUrl} alt="profile" class="w-20 h-20 rounded-full" />
    <div>{userNickName} さんのページ</div>
    <div class="flex items-center space-x-1">
      <span>獲得ポイント: </span>
      <span class="inline-block w-10 text-right">{userRewardPoints}</span>
      <span> pt</span>
    </div>
  </div>

  <button
    class="cButtonGrayStyle flex flex-row items-center space-x-1 m-1 {addedReward ? 'hover:!bg-gray-400' : ''}"
    on:click|preventDefault={handleLoginReward}
    disabled={addedReward}
  >
    <div class="w-5 h-5">
      <Icon icon="mdi:creation" class="w-full h-full" />
    </div>
    <span class="">{addedReward ? "また明日もらえるよ" : "ログインボーナスをもらう"}</span>
  </button>

  <button class="cButtonGrayStyle flex flex-row items-center space-x-1 m-1" on:click|preventDefault={handleLogout}>
    <div class="w-5 h-5">
      <Icon icon="mdi:logout" class="w-full h-full" />
    </div>
    <span class="">ログアウト</span>
  </button>
</div>
