<script lang="ts">
  import { diffChars } from "diff";
  import type { kanjiCsv } from "$lib/types/csv";

  export let data: kanjiCsv;
  export let kanjiMode: boolean = false;
  export let showAnswer: boolean = false;

  interface DiffPart {
    str: string;
    isDiff: boolean;
    isKanji: boolean;
  }

  function getDiffParts(kanji: string, yomi: string): DiffPart[] {
    const diff = diffChars(kanji, yomi);
    return diff.map((part) => ({
      str: part.value,
      isDiff: !!part.added || !!part.removed,
      isKanji: !!part.removed,
    }));
  }

  let diffParts: DiffPart[] = [];
  $: {
    diffParts = getDiffParts(data.kanji, data.yomi);
  }
</script>

<div class="flex flex-col justify-center items-center border rounded bg-yellow-100 w-full lg:w-80 p-2 space-y-1">
  <h2 class="font-serif text-lg lg:text-xl">
    {#each diffParts as part}
      {#if part.isDiff}
        {#if part.isKanji === kanjiMode}
          <span class="font-bold underline">{part.str}</span>
        {/if}
      {:else}
        {part.str}
      {/if}
    {/each}
  </h2>
  <p class="flex justify-center items-center w-32 h-10 bg-white border rounded">
    {#if showAnswer}
      {#each diffParts as part}
        {#if part.isDiff}
          {#if part.isKanji !== kanjiMode}
            <span class="font-serif text-lg lg:text-xl">{part.str}</span>
          {/if}
        {/if}
      {/each}
    {:else}
      <button on:click={() => (showAnswer = true)}>
        <span class="cButtonYellowStyle">こたえ</span>
      </button>
    {/if}
  </p>
</div>
