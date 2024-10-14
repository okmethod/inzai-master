<script lang="ts">
  import { onDestroy } from "svelte";
  import type { ModalComponent, ModalSettings } from "@skeletonlabs/skeleton";
  import { getModalStore, getToastStore } from "@skeletonlabs/skeleton";
  import type { KanjiQuestion, KanjiData } from "$lib/types/kanji";
  import type { UserData } from "$lib/internal/UserData";
  import { isEligibleForDailyReward, updateRewardPoints, showRewardToast } from "$lib/internal/reward";
  import KanjiCard from "$lib/components/KanjiCard.svelte";
  import { pickRandomElementsFromArray } from "$lib/utils/collections";
  import TimerToast from "$lib/utils/TimerToast";
  import SubmitModal from "$lib/components/SubmitModal.svelte";
  import InputModal from "$lib/components/InputModal.svelte";

  export let data: {
    kanjiDataArray: KanjiData[];
    userData: UserData | null;
  };

  let selectedKanjiQuestions: KanjiQuestion[] = [];
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

  const rewardKey = "KANJI_EXAM_PARTICIPATION";
  let addedReward = data.userData ? !isEligibleForDailyReward(data.userData, rewardKey) : false;
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

  function showSubmitModal(): void {
    const modalComponent: ModalComponent = {
      ref: SubmitModal,
      props: { title: "検定に挑戦しますか？" },
      slot: "(挑戦できるのは1日に1回までです)",
    };
    const modal: ModalSettings = {
      type: "component",
      component: modalComponent,
      response: (isConfirm: boolean) => {
        if (isConfirm) {
          startExam();
        }
      },
    };
    modalStore.trigger(modal);
  }

  function showInputScoreModal(): void {
    const modalComponent: ModalComponent = {
      ref: InputModal,
      props: {
        title: "20問中、何問正解できた？",
        min: 0,
        max: 20,
      },
      slot: "(自己採点して、正解した問題を数えてね)",
    };
    const modal: ModalSettings = {
      type: "component",
      component: modalComponent,
      response: async (res: { isConfirm: boolean; inputValue: number }) => {
        if (res.isConfirm && data.userData && data.userData.sub) {
          const key = res.inputValue < (numOfQuestions - 1) * 2 ? rewardKey : "KANJI_EXAM_PASS";
          await updateRewardPoints(data.userData.sub, key);
          showRewardToast(toastStore, key);
          addedReward = true;
          isScoringInProgress = false;
          addedReward = true;
        }
      },
    };
    modalStore.trigger(modal);
  }

  function handleButtonClick() {
    if (isTrialInProgress) {
      finishExam();
    } else if (isScoringInProgress) {
      showInputScoreModal();
    } else {
      showSubmitModal();
    }
  }

  onDestroy(() => {
    timerToast.destroy();
  });
</script>

<div class="cContentPartStyle !m-4">
  <div class="mb-4 flex space-x-2">
    <select id="select-grade" class="border rounded" on:change={selectContent}>
      {#each data.kanjiDataArray.filter((kanjiData) => kanjiData.index !== 0) as kanjiData}
        <option value={kanjiData.index}>{kanjiData.title.replace("の漢字", "")}</option>
      {/each}
    </select>
    <button on:click={handleButtonClick} disabled={!isTrialInProgress && addedReward}>
      <span class="cButtonYellowStyle {!isTrialInProgress && addedReward ? '!bg-gray-500' : ''}">
        {isTrialInProgress
          ? "答え合わせ"
          : isScoringInProgress
            ? "得点を入力する"
            : addedReward
              ? "また挑戦してね"
              : "出題"}
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
  {:else}
    <span> 範囲を選択して、出題ボタンをクリック！ </span>
  {/if}
</div>
