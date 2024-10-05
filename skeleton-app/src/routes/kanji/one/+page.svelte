<script lang="ts">
  import { onMount } from "svelte";
  import type { kanjiCsv } from "$lib/types/csv";
  import type { KanjiDataProps } from "$lib/types/props";
  import KanjiCard from "$lib/components/KanjiCard.svelte";
  import { pickRandomElementsFromArray } from "$lib/utils/collections";

  export let data: {
    propsArray: KanjiDataProps[];
  };

  let kanjiMode = true;
  let showAnswer = false;
  function setKanjiMode(mode: boolean) {
    kanjiMode = mode;
    resetShowAnswers();
  }

  function resetShowAnswers() {
    // 再描画をトリガーするため、別の値にしてから false に戻す
    showAnswer = true;
    showAnswer = false;
  }

  let selectedKanjiData: KanjiDataProps | null = null;
  function selectContent(event: Event) {
    const selectedIndex = (event.target as HTMLSelectElement).value;
    selectedKanjiData = data.propsArray.find((props) => props.index === Number(selectedIndex)) ?? null;
  }

  let selectedKanjiQuestion: kanjiCsv | null = null;
  function pickRandomKanji() {
    if (selectedKanjiData) {
      const randomElement = pickRandomElementsFromArray(selectedKanjiData.data, 1)[0];
      selectedKanjiQuestion = { ...randomElement };
    }
    resetShowAnswers();
  }

  onMount(() => {
    selectedKanjiData = data.propsArray.find((props) => props.index === Number(0)) ?? null;
    pickRandomKanji();
  });
</script>

<div class="cContentPartStyle !m-4">
  <div class="mb-4 flex">
    <button on:click={() => setKanjiMode(true)}>
      <span class="cButtonYellowStyle {kanjiMode ? '!bg-yellow-900' : ''}">読み問題</span>
    </button>
    <span class="mx-3 text-gray-500">|</span>
    <button on:click={() => setKanjiMode(false)}>
      <span class="cButtonYellowStyle {!kanjiMode ? '!bg-yellow-900' : ''}">書き問題</span>
    </button>
  </div>
  <div class="mb-4 flex space-x-2">
    <select id="select-grade" class="border rounded" on:change={selectContent}>
      {#each data.propsArray as props}
        <option value={props.index}>{props.title}</option>
      {/each}
    </select>
    <button on:click={pickRandomKanji}>
      <span class="cButtonYellowStyle">ランダム出題</span>
    </button>
  </div>
  {#if selectedKanjiQuestion}
    <KanjiCard data={selectedKanjiQuestion} {kanjiMode} {showAnswer} />
  {:else}
    <span> 問題を選択してください </span>
  {/if}
</div>
