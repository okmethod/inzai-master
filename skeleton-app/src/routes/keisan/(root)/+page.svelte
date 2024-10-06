<script lang="ts">
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
  import { slide } from "svelte/transition";
  import Icon from "@iconify/svelte";
  import type { KeisanDataProps } from "$lib/types/keisan";

  export let data: {
    propsArray: KeisanDataProps[];
  };
</script>

<div class="cContentPartStyle !m-4">
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
                <span> {row} </span>
              {/each}
            </div>
          </svelte:fragment>
        </AccordionItem>
      </div>
    {/each}
  </Accordion>
</div>
