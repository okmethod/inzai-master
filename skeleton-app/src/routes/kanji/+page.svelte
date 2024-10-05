<script lang="ts">
  import { onMount } from "svelte";
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
  import Icon from "@iconify/svelte";
  import type { kanjiCsv } from "$lib/types/csv";
  import KanjiCard from "$lib/components/KanjiCard.svelte";
  import { loadCsv } from "$lib/utils/loadfile";

  let inzai: kanjiCsv[] = [];
  onMount(async () => {
    inzai = (await loadCsv(window.fetch, "kanji/inzai.csv")) as kanjiCsv[];
  });

  let kanjiMode = true;
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">漢字マスター</h1>
  </div>

  <!-- コンテンツ部 -->
  <div class="cContentPartStyle !m-4">
    <div class="mb-4 flex">
      <button on:click={() => (kanjiMode = true)}>
        <span class="cButtonYellowStyle {kanjiMode ? '!bg-yellow-900' : ''}">読み問題</span>
      </button>
      <span class="mx-3 text-gray-500">|</span>
      <button on:click={() => (kanjiMode = false)}>
        <span class="cButtonYellowStyle {!kanjiMode ? '!bg-yellow-900' : ''}">書き問題</span>
      </button>
    </div>

    <Accordion width="w-[300px] md:w-[600px] lg:w-[1000px]" rounded="rounded-lg" hover="hover:underline">
      <div class="border rounded">
        <AccordionItem>
          <svelte:fragment slot="lead">
            <Icon icon="mdi:book-open-variant-outline" class="text-black" />
          </svelte:fragment>
          <svelte:fragment slot="summary">
            <h2 class="text-xl font-bold">印西の漢字</h2>
          </svelte:fragment>
          <svelte:fragment slot="content">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {#each inzai as row}
                <KanjiCard data={row} {kanjiMode} showAnswer={false} />
              {/each}
            </div>
          </svelte:fragment>
        </AccordionItem>
      </div>
    </Accordion>
  </div>
</div>
