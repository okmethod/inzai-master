<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import type { Writable } from "svelte/store";
  import type { KanjiCsv, KanjiDataProps, KanjiMode } from "$lib/types/kanji";
  import KanjiCard from "$lib/components/KanjiCard.svelte";
  import { pickRandomElementsFromArray } from "$lib/utils/collections";
  import { useTimerToast } from "$lib/utils/timer";

  export let data: {
    propsArray: KanjiDataProps[];
  };

  let currentMode: KanjiMode = "yomi";
  let selectedKanjiQuestions: KanjiCsv[] = [];
  let isTrialInProgress = false;
  const modeStore = getContext<Writable<KanjiMode>>("mode");
  const unsubscribe = modeStore.subscribe((value) => {
    currentMode = value;
    selectedKanjiQuestions = [];
    isTrialInProgress = false;
  });
  onDestroy(() => {
    unsubscribe();
  });

  let selectedKanjiData: KanjiDataProps | null = data.propsArray.find((props) => props.index === Number(1)) ?? null;
  function selectContent(event: Event) {
    const selectedIndex = (event.target as HTMLSelectElement).value;
    selectedKanjiData = data.propsArray.find((props) => props.index === Number(selectedIndex)) ?? null;
  }

  const numOfQuestions = 10;
  function pickRandomKanji() {
    if (selectedKanjiData) {
      selectedKanjiQuestions = pickRandomElementsFromArray(selectedKanjiData.data, numOfQuestions);
    }
  }

  const { startTimer, stopTimer, resetTimer } = useTimerToast(600); // 10分（600秒）

  function handleButtonClick() {
    if (isTrialInProgress) {
      isTrialInProgress = false;
      stopTimer();
      resetTimer();
    } else {
      pickRandomKanji();
      startTimer();
      isTrialInProgress = true;
    }
  }

  onDestroy(() => {
    stopTimer();
  });
</script>

<div class="cContentPartStyle !m-4">
  <div class="mb-4 flex space-x-2">
    <select id="select-grade" class="border rounded" on:change={selectContent}>
      {#each data.propsArray.filter((props) => props.index !== 0) as props}
        <option value={props.index}>{props.title.replace("の漢字", "")}</option>
      {/each}
    </select>
    <button on:click={handleButtonClick}>
      <span class="cButtonYellowStyle">
        {isTrialInProgress ? "答え合わせ" : "テスト出題"}
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
