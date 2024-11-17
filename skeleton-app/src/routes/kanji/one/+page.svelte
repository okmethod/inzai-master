<script lang="ts">
  import { getContext, onDestroy } from "svelte";
  import type { Writable } from "svelte/store";
  import type { KanjiQuestion, KanjiData } from "$lib/types/kanji";
  import KanjiCard from "$lib/components/cards/KanjiCard.svelte";
  import { pickRandomElementsFromArray } from "$lib/utils/collections";

  export let data: {
    kanjiDataArray: KanjiData[];
  };

  let selectedKanjiData: KanjiData | null =
    data.kanjiDataArray.find((kanjiData) => kanjiData.index === Number(0)) ?? null;
  function selectContent(event: Event) {
    const selectedIndex = (event.target as HTMLSelectElement).value;
    selectedKanjiData = data.kanjiDataArray.find((kanjiData) => kanjiData.index === Number(selectedIndex)) ?? null;
  }

  let selectedKanjiQuestion: KanjiQuestion | null = null;
  function pickRandomKanji() {
    if (selectedKanjiData) {
      selectedKanjiQuestion = pickRandomElementsFromArray(selectedKanjiData.data, 1)[0];
    }
    resetShowAnswers();
  }

  let showAnswer = false;
  function resetShowAnswers() {
    // 再描画をトリガーするため、別の値にしてから false に戻す
    showAnswer = true;
    showAnswer = false;
  }

  const isKakiModeStore = getContext<Writable<boolean>>("isKakiMode");
  const unsubscribe = isKakiModeStore.subscribe(() => {
    resetShowAnswers();
  });

  onDestroy(() => {
    unsubscribe();
  });
</script>

<div class="cPageBodyStyle">
  <div class="mb-4 flex items-center space-x-2">
    <select id="select-grade" class="cMonoColor border rounded" on:change={selectContent}>
      {#each data.kanjiDataArray as kanjiData}
        <option value={kanjiData.index}>{kanjiData.title}</option>
      {/each}
    </select>
    <button type="button" class="cButtonStandardStyle h-8" on:click={pickRandomKanji}> 出題 </button>
  </div>
  {#if selectedKanjiQuestion}
    <KanjiCard data={selectedKanjiQuestion} isKakiMode={$isKakiModeStore} {showAnswer} />
  {:else}
    <span> 範囲を選択して、出題ボタンをクリック！ </span>
  {/if}
</div>
