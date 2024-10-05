<script lang="ts">
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
  import { slide } from "svelte/transition";
  import Icon from "@iconify/svelte";
  import KanjiCard from "$lib/components/KanjiCard.svelte";
  import type { ContentProps } from "./+page";

  export let data: {
    propsArray: Array<ContentProps>;
  };

  let kanjiMode = true;
  let showAnswer = false;
  function setKanjiMode(mode: boolean) {
    kanjiMode = mode;
    // 再描画をトリガーするため、別の値にしてから false に戻す
    showAnswer = true;
    showAnswer = false;
  }
</script>

<div class="cRouteBodyStyle">
  <!-- タイトル部 -->
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">漢字マスター</h1>
  </div>

  <!-- コンテンツ部 -->
  <div class="cContentPartStyle !m-4">
    <div class="mb-4 flex">
      <button on:click={() => setKanjiMode(true)}>
        <span class="cButtonYellowStyle {kanjiMode ? '!bg-yellow-900' : ''}">読み問題</span>
      </button>
      <span class="mx-3 text-gray-500">|</span>
      <button on:click={() => setKanjiMode(false)}>
        <span class="cButtonYellowStyle {!kanjiMode ? '!bg-yellow-900' : ''}">書き問題</span>
      </button>
    </div>

    <Accordion
      width="w-[300px] md:w-[600px] lg:w-[1000px]"
      rounded="rounded-lg"
      hover="hover:underline"
      transitions={true}
      transitionIn={slide}
      transitionInParams={{ duration: 300 }}
      transitionOut={slide}
      transitionOutParams={{ duration: 300 }}
    >
      {#each data.propsArray as content}
        <div class="border rounded">
          <AccordionItem>
            <svelte:fragment slot="lead">
              <Icon icon="mdi:book-open-variant-outline" class="text-black" />
            </svelte:fragment>
            <svelte:fragment slot="summary">
              <h2 class="text-xl font-bold">{content.title}</h2>
            </svelte:fragment>
            <svelte:fragment slot="content">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {#each content.data as row}
                  <KanjiCard data={row} {kanjiMode} {showAnswer} />
                {/each}
              </div>
            </svelte:fragment>
          </AccordionItem>
        </div>
      {/each}
    </Accordion>
  </div>
</div>
