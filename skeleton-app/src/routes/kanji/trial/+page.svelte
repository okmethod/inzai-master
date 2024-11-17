<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import type { Writable } from "svelte/store";
  import type { KanjiQuestion, KanjiData } from "$lib/types/kanji";
  import KanjiCard from "$lib/components/cards/KanjiCard.svelte";
  import { pickRandomElementsFromArray } from "$lib/utils/collections";
  import TimerToast from "$lib/utils/TimerToast";

  export let data: {
    kanjiDataArray: KanjiData[];
  };

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
    if (selectedKanjiData) {
      selectedKanjiQuestions = pickRandomElementsFromArray(selectedKanjiData.data, numOfQuestions);
    }
    if (!$isKakiModeStore && inzaiKanjiData) {
      // 読み問題モードでは、印西の漢字を1問含める
      selectedKanjiQuestions = [
        ...selectedKanjiQuestions.slice(0, numOfQuestions - 1),
        ...pickRandomElementsFromArray(inzaiKanjiData.data, 1),
      ];
    }
  }

  let isTrialInProgress = false;
  const timerToast = new TimerToast(300); // 5分
  function handleButtonClick() {
    if (isTrialInProgress) {
      isTrialInProgress = false;
      timerToast.stopTimer();
    } else {
      pickRandomKanji();
      timerToast.startTimer();
      isTrialInProgress = true;
    }
  }

  function resetTrial(): void {
    selectedKanjiQuestions = [];
    isTrialInProgress = false;
    timerToast.stopTimer();
  }

  let selectedKanjiQuestions: KanjiQuestion[] = [];
  const isKakiModeStore = getContext<Writable<boolean>>("isKakiMode");
  const unsubscribe = isKakiModeStore.subscribe(() => {
    resetTrial();
  });

  onDestroy(() => {
    unsubscribe();
    timerToast.destroy();
  });
</script>

<div class="cPageBodyStyle">
  <div class="mb-4 flex items-center space-x-2">
    <select id="select-grade" class="cMonoColor border rounded" on:change={selectContent}>
      {#each data.kanjiDataArray.filter((kanjiData) => kanjiData.index !== 0) as kanjiData}
        <option value={kanjiData.index}>{kanjiData.title}</option>
      {/each}
    </select>
    <button type="button" class="cButtonStandardStyle h-8" on:click={handleButtonClick}>
      {isTrialInProgress ? "答え合わせ" : "出題"}
    </button>
  </div>
  {#if selectedKanjiQuestions.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      {#each selectedKanjiQuestions as question, index}
        <div>
          <span> {index + 1}. </span>
          <KanjiCard data={question} isKakiMode={$isKakiModeStore} showAnswer={true} {isTrialInProgress} />
        </div>
      {/each}
    </div>
  {:else}
    <span> 範囲を選択して、出題ボタンをクリック！ </span>
  {/if}
</div>
