<script lang="ts">
  import { setContext } from "svelte";
  import { writable, derived } from "svelte/store";
  import { SlideToggle } from "@skeletonlabs/skeleton";
  import { page } from "$app/stores";
  import type { SlotTabSetting } from "$lib/types/tabSetting";
  import ContentsTabGroup from "$lib/components/ContentsTabGroup.svelte";

  export let data: {
    slotTabSettings: SlotTabSetting[];
  };
  const tabSettings = data.slotTabSettings;

  let currentTabIndex = 0;

  let isKakiMode = false;
  const isKakiModeStore = writable<boolean>(isKakiMode);
  setContext("isKakiMode", isKakiModeStore);
  function updateKanjiMode() {
    isKakiModeStore.set(isKakiMode);
  }

  const isExamPath = derived(page, ($page) => $page.url.pathname === "/kanji/exam");
</script>

<div class="cTabGroupLayoutBodyStyle">
  <div class="cTitlePartStyle">
    <h1 class="cTitleLabelStyle">漢字マスタードリル</h1>
    <span class="text-gray-500 hidden md:inline md:mx-3">:</span>
    <SlideToggle
      name="slide"
      bind:checked={isKakiMode}
      on:change={updateKanjiMode}
      background="cPrimaryBg"
      active="cPrimaryBg"
      border="border cSurfaceBorder"
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
