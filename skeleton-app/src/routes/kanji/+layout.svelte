<script lang="ts">
  import { setContext } from "svelte";
  import { writable, derived } from "svelte/store";
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import { page } from "$app/stores";
  import type { SlotTabSetting } from "$lib/types/tabSetting";
  import type { KanjiMode } from "$lib/types/kanji";
  import ContentsTabGroup from "$lib/components/ContentsTabGroup.svelte";

  export let data: {
    slotTabSettings: SlotTabSetting[];
  };
  const tabSettings = data.slotTabSettings;

  let currentTabIndex = 0;

  let isKakiMode = false;
  const modeStore = writable<KanjiMode>("yomi");
  setContext("mode", modeStore);
  function updateKanjiMode() {
    const mode = isKakiMode ? "kaki" : "yomi";
    modeStore.set(mode);
  }

  const isExamPath = derived(page, ($page) => $page.url.pathname === "/kanji/exam");
</script>

<div class="cRouteBodyStyle">
  <div class="cTitlePartStyle flex flex-col md:flex-row justify-center items-center">
    <h1 class="cTitleStyle md:!text-3xl">漢字マスタードリル</h1>
    <span class="text-gray-500 hidden md:inline md:mx-3">:</span>
    <SlideToggle
      name="slide"
      bind:checked={isKakiMode}
      on:change={updateKanjiMode}
      background="bg-surface-900 dark:bg-surface-300"
      active="bg-surface-900 dark:bg-surface-300"
      class="px-2 py-1"
      disabled={$isExamPath}
    >
      {isKakiMode ? "書き問題モード" : "読み問題モード"}
    </SlideToggle>
  </div>

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
