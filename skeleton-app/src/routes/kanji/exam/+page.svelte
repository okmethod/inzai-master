<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import type { Writable } from "svelte/store";
  import type { KanjiQuestion, KanjiData, KanjiMode } from "$lib/types/kanji";
  import KanjiCard from "$lib/components/KanjiCard.svelte";
  import { pickRandomElementsFromArray } from "$lib/utils/collections";
  import TimerToast from "$lib/utils/TimerToast";

  export let data: {
    kanjiDataArray: KanjiData[];
  };

  let currentMode: KanjiMode = "yomi";
  let selectedKanjiQuestions: KanjiQuestion[] = [];
  let isTrialInProgress = false;
  const timerToast = new TimerToast(600); // 10分

  const modeStore = getContext<Writable<KanjiMode>>("mode");
  const unsubscribe = modeStore.subscribe((value) => {
    currentMode = value;
    selectedKanjiQuestions = [];
    isTrialInProgress = false;
    timerToast.stopTimer();
  });
  onDestroy(() => {
    unsubscribe();
  });

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
    if (currentMode === "yomi" && inzaiKanjiData) {
      // 読み問題モードでは、印西の漢字を1問含める
      selectedKanjiQuestions = [
        ...selectedKanjiQuestions.slice(0, numOfQuestions - 1),
        ...pickRandomElementsFromArray(inzaiKanjiData.data, 1),
      ];
    }
  }

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
    <button on:click={handleButtonClick}>
      <span class="cButtonYellowStyle">
        {isTrialInProgress ? "答え合わせ" : "出題"}
      </span>
    </button>
  </div>
  {#if selectedKanjiQuestions.length > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      {#each selectedKanjiQuestions as question, index}
        <div>
          <span> {index + 1}. </span>
          <KanjiCard data={question} showKanji={currentMode === "yomi"} showAnswer={true} {isTrialInProgress} />
        </div>
      {/each}
    </div>
  {:else}
    <span> 範囲を選択して、出題ボタンをクリック！ </span>
  {/if}
</div>
