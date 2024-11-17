<script lang="ts">
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { ProgressBar } from "@skeletonlabs/skeleton";
  import { convertToKanji } from "$lib/utils/numerics";

  export let userImageUrl = "";
  export let userNickName = "";
  export let userRewardPoints = 0;

  const rankIndex = Math.floor(userRewardPoints / 100) + 1;
  const nextRankValue = rankIndex * 100;

  let progressBarValue = tweened(0, {
    duration: 200, // 200ms
    easing: cubicOut,
  });

  function updateProgressBarValue(value: number) {
    progressBarValue.set(value);
  }

  $: updateProgressBarValue(userRewardPoints);

  const cAreaColor =
    "bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-100 border-primary-400 dark:border-primary-600";
</script>

<div class="w-80 space-y-4 p-4 flex flex-col items-center border rounded-lg {cAreaColor}">
  <img src={userImageUrl} alt="profile" class="w-20 h-20 rounded-full" />
  <div>{userNickName} さんの自学の成果</div>
  <div class="flex items-center space-x-1">
    <span>研鑽ポイント: </span>
    <span class="inline-block w-10 text-right">{userRewardPoints}</span>
    <span> pt</span>
  </div>
  <div class="flex items-center space-x-1">
    <span>マスターランク: </span>
    <span class="inline-block w-14 text-right">{convertToKanji(rankIndex)}</span>
    <span> 段</span>
  </div>
  <ProgressBar
    value={$progressBarValue}
    max={nextRankValue}
    height="h-4"
    rounded="rounded-full"
    transition="transition-[width] duration-500"
    meter="bg-primary-600"
    track="bg-surface-100"
    class="border border-surface-300"
  />
  <div class="flex items-center space-x-1">
    <span>(次のランクまであと </span>
    <span class="inline-block w-8 text-right">{nextRankValue - userRewardPoints}</span>
    <span> pt)</span>
  </div>
</div>
