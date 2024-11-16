<script lang="ts">
  import { tick } from "svelte";
  import type { KeisanTemplate } from "$lib/types/keisan";
  import KeisanCard from "$lib/components/cards/KeisanCard.svelte";

  export let data: {
    keisanTemplates: KeisanTemplate[];
  };

  let selectedKeisanTemplate: KeisanTemplate = data.keisanTemplates[0];
  function selectContent(event: Event) {
    const selectedIndex = parseInt((event.target as HTMLSelectElement).value, 10);
    selectedKeisanTemplate = data.keisanTemplates[selectedIndex];
  }

  let showedKeisanTemplate: KeisanTemplate | null = null;
  async function flickKeisanTemplate() {
    resetShowAnswers();
    // 再描画をトリガーするため、別の値にしてから元に戻す
    showedKeisanTemplate = null;
    await tick(); // 次のイベントループまで待つ
    showedKeisanTemplate = { ...selectedKeisanTemplate };
  }

  let showAnswer = false;
  function resetShowAnswers() {
    // 再描画をトリガーするため、別の値にしてから false に戻す
    showAnswer = true;
    showAnswer = false;
  }
</script>

<div class="cContentPartStyle !m-4">
  <div class="mb-4 flex items-center space-x-2">
    <select id="select-grade" class="cMonoColor border rounded" on:change={selectContent}>
      {#each data.keisanTemplates as keisanTemplate, index}
        <option value={index}>{keisanTemplate.label}</option>
      {/each}
    </select>
    <button type="button" class="cButtonStandardStyle h-8" on:click={flickKeisanTemplate}> 出題 </button>
  </div>
  {#if showedKeisanTemplate}
    <KeisanCard data={showedKeisanTemplate} {showAnswer} />
  {:else}
    <span> 範囲を選択して、出題ボタンをクリック！ </span>
  {/if}
</div>
