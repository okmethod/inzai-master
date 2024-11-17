<script lang="ts">
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
  import { slide } from "svelte/transition";
  import Icon from "@iconify/svelte";
  import type { RegionData } from "$lib/types/prefectures";
  import PrefectureCard from "$lib/components/cards/PrefectureCard.svelte";

  export let data: {
    regionDataArray: RegionData[];
  };
</script>

<div class="cPageBodyStyle">
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
    {#each data.regionDataArray as regionData}
      <div class="cSurfaceBg cPrimaryText cSurfaceBorder border rounded">
        <AccordionItem>
          <svelte:fragment slot="lead">
            <Icon icon="mdi:map-outline" />
          </svelte:fragment>
          <svelte:fragment slot="summary">
            <h2 class="text-xl font-bold">{regionData.name} 地方</h2>
          </svelte:fragment>
          <svelte:fragment slot="content">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {#each regionData.prefectures as prefectureData}
                <PrefectureCard data={prefectureData} isCompact={true} />
              {/each}
            </div>
          </svelte:fragment>
        </AccordionItem>
      </div>
    {/each}
  </Accordion>
</div>
