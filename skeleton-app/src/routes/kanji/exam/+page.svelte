<script lang="ts">
  import { onDestroy } from "svelte";
  import type { KanjiQuestion, KanjiData } from "$lib/types/kanji";
  import KanjiCard from "$lib/components/KanjiCard.svelte";
  import { pickRandomElementsFromArray } from "$lib/utils/collections";
  import TimerToast from "$lib/utils/TimerToast";

  export let data: {
    kanjiDataArray: KanjiData[];
  };

  let selectedKanjiQuestions: KanjiQuestion[] = [];
  let isTrialInProgress = false;
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
          <KanjiCard data={question} showKanji={index < numOfQuestions} showAnswer={true} {isTrialInProgress} />
        </div>
      {/each}
    </div>
  {:else}
    <span> 範囲を選択して、出題ボタンをクリック！ </span>
  {/if}
</div>
