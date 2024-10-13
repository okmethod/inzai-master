<script lang="ts">
  import { setContext } from "svelte";
  import { writable, derived } from "svelte/store";
  import { page } from "$app/stores";
  import type { SlotTabSetting } from "$lib/types/tabSetting";
  import type { KanjiMode } from "$lib/types/kanji";
  import ContentsTabGroup from "$lib/components/ContentsTabGroup.svelte";

  export let data: {
    slotTabSettings: SlotTabSetting[];
  };
  const tabSettings = data.slotTabSettings;

  let currentTabIndex = 0;

  const modeStore = writable<KanjiMode>("yomi");
  setContext("mode", modeStore);
  function updateKanjiMode(mode: KanjiMode) {
    modeStore.set(mode);
  }

  function getButtonClass(target: KanjiMode, mode: KanjiMode, disabled: boolean): string {
    let baseClass = "cButtonYellowStyle";
    if (mode === target) {
      baseClass += " !bg-yellow-900";
    }
    if (disabled) {
      baseClass += " !bg-gray-500";
    }
    return baseClass;
  }

  const isExamPath = derived(page, ($page) => $page.url.pathname === "/kanji/exam");
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle flex flex-col md:flex-row justify-center items-center">
    <h1 class="cTitleStyle md:!text-3xl">漢字マスタードリル</h1>
    <div class="mx-4 mt-1 md:mt-0">
      <span class="text-gray-500 hidden md:inline md:mx-3">:</span>
      <button on:click={() => updateKanjiMode("yomi")} disabled={$isExamPath}>
        <span class={getButtonClass("yomi", $modeStore, $isExamPath)}>読み問題</span>
      </button>
      <span class="mx-3 text-gray-500">|</span>
      <button on:click={() => updateKanjiMode("kaki")} disabled={$isExamPath}>
        <span class={getButtonClass("kaki", $modeStore, $isExamPath)}>書き問題</span>
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
