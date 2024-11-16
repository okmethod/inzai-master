<script lang="ts">
  import type { KeisanTemplate } from "$lib/types/keisan";
  import { generateRandomNumbers, buildFormula } from "$lib/internal/keisan";

  export let data: KeisanTemplate;
  export let showAnswer: boolean = false;
  export let isCompact: boolean | undefined = undefined;
  export let isTrialInProgress: boolean | undefined = undefined;

  const { x, y } = generateRandomNumbers(data.range, data.decimalPlaces, data.operationType, data.allowNegative);
  const { formulaString, answerString } = buildFormula(x, y, data.operationType, data.decimalPlaces);

  const subjectColor = "blue";
  const cCardAreaSize = isCompact
    ? "w-full lg:w-72 min-h-24 space-y-1"
    : "w-full md:w-80 lg:w-[450px] min-h-36 space-y-3";
  const cAnswerAreaSize = isCompact ? "w-32 h-10" : "w-60 h-16";
  const cTextSize = isCompact ? "text-lg lg:text-xl" : "text-2xl lg:text-3xl";
</script>

<div
  class="
    flex flex-col justify-center items-center p-2
    !bg-blue-100 border !border-gray-600 rounded
    {cCardAreaSize}
  "
>
  <div class="text-black font-mono {cTextSize}">{formulaString} ＝ ？</div>
  <div
    class="
      flex justify-center items-center !text-black !bg-white border rounded {cAnswerAreaSize}
      {isTrialInProgress ? 'hidden' : ''}
    "
  >
    {#if showAnswer}
      <span class="font-mono {cTextSize}">{answerString}</span>
    {:else}
      <button on:click={() => (showAnswer = true)}>
        <span class="px-2 py-1 text-white rounded !bg-blue-500 hover:!bg-blue-600 select-none"> こたえ </span>
      </button>
    {/if}
  </div>
</div>
