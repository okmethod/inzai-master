<script lang="ts">
  import { onMount } from "svelte";
  import type { kanjiCsv } from "$lib/types/csv";
  import KanjiCard from "$lib/components/KanjiCard.svelte";
  import { loadCsv } from "$lib/utils/loadfile";

  let inzai: kanjiCsv[] = [];
  onMount(async () => {
    inzai = (await loadCsv(window.fetch, "kanji/inzai.csv")) as kanjiCsv[];
  });

  let kanjiMode = true;
  function toggleMode() {
    kanjiMode = !kanjiMode;
  }
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">漢字マスター</h1>
  </div>

  <!-- コンテンツ部 -->
  <div class="cContentPartStyle !m-4">
    <button on:click={toggleMode}>
      <span class="border rounded bg-gray-100 p-1">{kanjiMode ? "漢字モード" : "読みモード"}</span>
    </button>
    <h2 class="text-xl font-bold underline">印西の漢字</h2>
    <div class="grid grid-cols-3 gap-2">
      {#each inzai as row}
        <KanjiCard data={row} {kanjiMode} showAnswer={false} />
      {/each}
    </div>
  </div>
</div>
