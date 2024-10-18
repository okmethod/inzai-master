<script lang="ts">
  import { onDestroy, tick } from "svelte";
  import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
  import type { KeisanTemplate, KeisanData } from "$lib/types/keisan";
  import type { UserData } from "$lib/internal/UserData";
  import { isEligibleForDailyReward } from "$lib/internal/reward";
  import KeisanCard from "$lib/components/KeisanCard.svelte";
  import { showSubmitExamModal, showInputScoreModal } from "$lib/internal/showModal";
  import TimerToast from "$lib/utils/TimerToast";

  export let data: {
    keisanDataArray: KeisanData[];
    userData: UserData | null;
  };

  const modalStore = getModalStore();
  const toastStore = getToastStore();
  const timerToast = new TimerToast(600); // 10分

  const keisanTemplates = data.keisanDataArray.flatMap((keisanData) => keisanData.data);
  let selectedKeisanTemplate: KeisanTemplate = keisanTemplates[0];
  function selectContent(event: Event) {
    const selectedIndex = parseInt((event.target as HTMLSelectElement).value, 10);
    selectedKeisanTemplate = keisanTemplates[selectedIndex];
  }

  const numOfQuestions = 10;
  let showedKeisanTemplate: KeisanTemplate | null = null;
  async function flickKeisanTemplate() {
    // 再描画をトリガーするため、別の値にしてから元に戻す
    showedKeisanTemplate = null;
    await tick(); // 次のイベントループまで待つ
    showedKeisanTemplate = { ...selectedKeisanTemplate };
  }

  let addedReward = data.userData ? !isEligibleForDailyReward(data.userData, "KEISAN_EXAM_PARTICIPATION") : false;
  let isTrialInProgress = false;
  function startExam() {
    flickKeisanTemplate();
    timerToast.startTimer();
    isTrialInProgress = true;
  }

  let isScoringInProgress = false;
  function finishExam() {
    isTrialInProgress = false;
    timerToast.stopTimer();
    isScoringInProgress = true;
  }

  function handleButtonClick() {
    if (isTrialInProgress) {
      finishExam();
    } else if (isScoringInProgress) {
      showInputScoreModal(
        modalStore,
        toastStore,
        numOfQuestions,
        numOfQuestions - 1,
        "KEISAN_EXAM_PASS",
        "KEISAN_EXAM_PARTICIPATION",
        data.userData ? data.userData.sub : null,
        () => {
          addedReward = true;
          isScoringInProgress = false;
          addedReward = true;
        },
      );
    } else {
      showSubmitExamModal(modalStore, startExam);
    }
  }

  onDestroy(() => {
    timerToast.destroy();
  });
</script>

<div class="cContentPartStyle !m-4">
  {#if data.userData == null}
    <span> 検定に挑戦するにはログインしてね！ </span>
  {:else}
    <div class="mb-4 flex space-x-2">
      <select id="select-grade" class="border rounded" on:change={selectContent}>
        {#each keisanTemplates as keisanTemplate, index}
          <option value={index}>{keisanTemplate.label}</option>
        {/each}
      </select>
      <button on:click={handleButtonClick} disabled={!isTrialInProgress && addedReward}>
        <span class="cButtonYellowStyle {!isTrialInProgress && addedReward ? '!bg-gray-500' : ''}">
          {isTrialInProgress ? "答え合わせ" : isScoringInProgress ? "何問正解？" : addedReward ? "終了" : "出題"}
        </span>
      </button>
    </div>
    {#if showedKeisanTemplate !== null}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each Array(numOfQuestions) as _, index}
          <div>
            <span> {index + 1}. </span>
            <KeisanCard data={showedKeisanTemplate} showAnswer={true} {isTrialInProgress} />
          </div>
        {/each}
      </div>
    {:else if addedReward}
      <span> また明日挑戦してね！ </span>
    {:else}
      <span> 範囲を選択して、出題ボタンをクリック！ </span>
    {/if}
  {/if}
</div>
