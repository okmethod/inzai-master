<script lang="ts">
  import { tick } from "svelte";
  import type { KeisanTemplate, KeisanData } from "$lib/types/keisan";
  import KeisanCard from "$lib/components/KeisanCard.svelte";

  export let data: {
    keisanDataArray: KeisanData[];
  };

  let showAnswer = false;
  function resetShowAnswers() {
    // 再描画をトリガーするため、別の値にしてから false に戻す
    showAnswer = true;
    showAnswer = false;
  }

  const keisanTemplates = data.keisanDataArray.flatMap((keisanData) => keisanData.data);

  let selectedKeisanTemplate: KeisanTemplate = keisanTemplates[0];
  let showedKeisanTemplate: KeisanTemplate | null = null;
  function selectContent(event: Event) {
    const selectedIndex = parseInt((event.target as HTMLSelectElement).value, 10);
    selectedKeisanTemplate = keisanTemplates[selectedIndex];
  }

  async function flickKeisanTemplate() {
    resetShowAnswers();
    // 再描画をトリガーするため、別の値にしてから元に戻す
    showedKeisanTemplate = null;
    await tick(); // 次のイベントループまで待つ
    showedKeisanTemplate = { ...selectedKeisanTemplate };
  }
</script>

<div class="cContentPartStyle !m-4">
  <div class="mb-4 flex space-x-2">
    <select id="select-grade" class="border rounded" on:change={selectContent}>
      {#each keisanTemplates as keisanTemplate, index}
        <option value={index}>{keisanTemplate.label}</option>
      {/each}
    </select>
    <button on:click={flickKeisanTemplate}>
      <span class="cButtonYellowStyle">出題</span>
    </button>
  </div>
  {#if showedKeisanTemplate}
    <KeisanCard data={showedKeisanTemplate} {showAnswer} />
  {:else}
    <span> 範囲を選択して、出題ボタンをクリック！ </span>
  {/if}
</div>
