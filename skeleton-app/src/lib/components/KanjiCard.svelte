<script lang="ts">
  import { diffChars } from "diff";
  import type { KanjiCsv } from "$lib/types/kanji";

  export let data: KanjiCsv;
  export let showKanji: boolean;
  export let showAnswer: boolean = false;
  export let isCompact: boolean | undefined = undefined;
  export let isTrialInProgress: boolean | undefined = undefined;

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

  const cCardAreaSize = isCompact
    ? "w-full lg:w-80 min-h-24 space-y-1"
    : "w-full md:w-80 lg:w-[450px] min-h-36 space-y-3";
  const cAnswerAreaSize = isCompact ? "w-32 h-10" : "w-60 h-16";
  const cTextSize = isCompact ? "text-lg lg:text-xl" : "text-2xl lg:text-3xl";
</script>

<div
  class="
    flex flex-col justify-center items-center
    border rounded bg-yellow-100 p-2
    {cCardAreaSize}
  "
>
  <div class="font-serif {cTextSize}">
    {#each diffParts as part}
      {#if part.isDiff}
        {#if part.isKanji === showKanji}
          <span class="font-bold underline">{part.str}</span>
        {/if}
      {:else}
        {part.str}
      {/if}
    {/each}
  </div>
  <div
    class="
      flex justify-center items-center bg-white border rounded {cAnswerAreaSize}
      {isTrialInProgress ? 'hidden' : ''}
    "
  >
    {#if showAnswer}
      {#each diffParts as part}
        {#if part.isDiff}
          {#if part.isKanji !== showKanji}
            <span class="font-serif {cTextSize}">{part.str}</span>
          {/if}
        {/if}
      {/each}
    {:else}
      <button on:click={() => (showAnswer = true)}>
        <span class="cButtonYellowStyle">こたえ</span>
      </button>
    {/if}
  </div>
</div>
