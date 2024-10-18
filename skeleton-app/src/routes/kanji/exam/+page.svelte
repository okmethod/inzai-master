<script lang="ts">
  import { onDestroy } from "svelte";
  import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
  import type { KanjiQuestion, KanjiData } from "$lib/types/kanji";
  import type { UserData } from "$lib/internal/UserData";
  import { isEligibleForDailyReward } from "$lib/internal/reward";
  import KanjiCard from "$lib/components/KanjiCard.svelte";
  import { showSubmitExamModal, showInputScoreModal } from "$lib/internal/showModal";
  import { pickRandomElementsFromArray } from "$lib/utils/collections";
  import TimerToast from "$lib/utils/TimerToast";

  export let data: {
    kanjiDataArray: KanjiData[];
    userData: UserData | null;
  };

  const modalStore = getModalStore();
  const toastStore = getToastStore();
  const timerToast = new TimerToast(600); // 10分

  const inzaiKanjiData: KanjiData | null =
    data.kanjiDataArray.find((kanjiData) => kanjiData.index === Number(0)) ?? null;
  let selectedKanjiData: KanjiData | null =
    data.kanjiDataArray.find((kanjiData) => kanjiData.index === Number(1)) ?? null;
  function selectContent(event: Event) {
    const selectedIndex = (event.target as HTMLSelectElement).value;
    selectedKanjiData = data.kanjiDataArray.find((kanjiData) => kanjiData.index === Number(selectedIndex)) ?? null;
  }

  const numOfQuestions = 10;
  let selectedKanjiQuestions: KanjiQuestion[] = [];
  function pickRandomKanji() {
    // 書き問題10問 + 読み問題を10問を選出
    if (selectedKanjiData) {
      selectedKanjiQuestions = pickRandomElementsFromArray(selectedKanjiData.data, numOfQuestions * 2);
    }
    // うち1問を印西の漢字を1問に置き換え
    if (inzaiKanjiData) {
      selectedKanjiQuestions = [
        ...selectedKanjiQuestions.slice(0, numOfQuestions * 2 - 1),
        ...pickRandomElementsFromArray(inzaiKanjiData.data, 1),
      ];
    }
  }

  let addedReward = data.userData ? !isEligibleForDailyReward(data.userData, "KANJI_EXAM_PARTICIPATION") : false;
  let isTrialInProgress = false;
  function startExam() {
    pickRandomKanji();
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
        numOfQuestions * 2,
        (numOfQuestions - 1) * 2,
        "KANJI_EXAM_PASS",
        "KANJI_EXAM_PARTICIPATION",
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
        {#each data.kanjiDataArray.filter((kanjiData) => kanjiData.index !== 0) as kanjiData}
          <option value={kanjiData.index}>{kanjiData.title}</option>
        {/each}
      </select>
      <button on:click={handleButtonClick} disabled={!isTrialInProgress && addedReward}>
        <span class="cButtonYellowStyle {!isTrialInProgress && addedReward ? '!bg-gray-500' : ''}">
          {isTrialInProgress ? "答え合わせ" : isScoringInProgress ? "何問正解？" : addedReward ? "終了" : "出題"}
        </span>
      </button>
    </div>
    {#if selectedKanjiQuestions.length > 0}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
        {#each selectedKanjiQuestions as question, index}
          <div>
            <span> {index + 1}. </span>
            <KanjiCard data={question} showKanji={index >= numOfQuestions} showAnswer={true} {isTrialInProgress} />
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
