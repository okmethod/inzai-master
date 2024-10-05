<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import type { SlotTabSetting } from "$lib/types/tabSetting";
  import type { KanjiMode } from "$lib/types/kanji";
  import ContentsTabGroup from "$lib/components/ContentsTabGroup.svelte";

  export let data: {
    slotTabSettings: SlotTabSetting[];
  };
  const tabSettings = data.slotTabSettings;

  let currentTabIndex = 0;

  let currentMode: KanjiMode = "yomi";
  const modeStore = writable<KanjiMode>(currentMode);
  setContext("mode", modeStore);
  function updateKanjiMode(mode: KanjiMode) {
    currentMode = mode;
    modeStore.set(currentMode);
  }
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle flex flex-col md:flex-row justify-center items-center">
    <h1 class="cTitleStyle md:!text-3xl">漢字マスター</h1>
    <div class="mx-4 mt-1 md:mt-0">
      <span class="text-gray-500 hidden md:inline md:mx-3">:</span>
      <button on:click={() => updateKanjiMode("yomi")}>
        <span class="cButtonYellowStyle {currentMode === 'yomi' ? '!bg-yellow-900' : ''}">読み問題</span>
      </button>
      <span class="mx-3 text-gray-500">|</span>
      <button on:click={() => updateKanjiMode("kaki")}>
        <span class="cButtonYellowStyle {currentMode === 'kaki' ? '!bg-yellow-900' : ''}">書き問題</span>
      </button>
    </div>
  </div>

  <!-- コンテンツ部 -->
  <ContentsTabGroup
    bind:currentTabIndex
    {tabSettings}
    navigatePathPrefix="/kanji"
    cContainer="w-full"
    cPanel="max-h-[calc(100vh-12rem)] overflow-y-auto"
  >
    <slot />
  </ContentsTabGroup>
</div>
