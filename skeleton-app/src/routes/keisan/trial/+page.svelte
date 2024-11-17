<script lang="ts">
  import { tick, onDestroy } from "svelte";
  import type { KeisanTemplate } from "$lib/types/keisan";
  import KeisanCard from "$lib/components/cards/KeisanCard.svelte";
  import TimerToast from "$lib/utils/TimerToast";

  export let data: {
    keisanTemplates: KeisanTemplate[];
  };

  let selectedKeisanTemplate: KeisanTemplate = data.keisanTemplates[0];
  function selectContent(event: Event) {
    const selectedIndex = parseInt((event.target as HTMLSelectElement).value, 10);
    selectedKeisanTemplate = data.keisanTemplates[selectedIndex];
  }

  const numOfQuestions = 10;

  let showedKeisanTemplate: KeisanTemplate | null = null;
  async function flickKeisanTemplate() {
    // 再描画をトリガーするため、別の値にしてから元に戻す
    showedKeisanTemplate = null;
    await tick(); // 次のイベントループまで待つ
    showedKeisanTemplate = { ...selectedKeisanTemplate };
  }

  let isTrialInProgress = false;
  const timerToast = new TimerToast(300); // 5分
  function handleButtonClick() {
    if (isTrialInProgress) {
      isTrialInProgress = false;
      timerToast.stopTimer();
    } else {
      flickKeisanTemplate();
      timerToast.startTimer();
      isTrialInProgress = true;
    }
  }

  onDestroy(() => {
    timerToast.destroy();
  });
</script>

<div class="cPageBodyStyle">
  <div class="mb-4 flex items-center space-x-2">
    <select id="select-grade" class="cMonoColor border rounded" on:change={selectContent}>
      {#each data.keisanTemplates as keisanTemplate, index}
        <option value={index}>{keisanTemplate.label}</option>
      {/each}
    </select>
    <button type="button" class="cButtonStandardStyle h-8" on:click={handleButtonClick}>
      {isTrialInProgress ? "答え合わせ" : "出題"}
    </button>
  </div>
  {#if showedKeisanTemplate !== null}
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
      {#each Array(numOfQuestions) as _, index}
        <div>
          <span> {index + 1}. </span>
          <KeisanCard data={showedKeisanTemplate} showAnswer={true} {isTrialInProgress} />
        </div>
      {/each}
    </div>
  {:else}
    <span> 範囲を選択して、出題ボタンをクリック！ </span>
  {/if}
</div>
