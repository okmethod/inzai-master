<script lang="ts">
  import { Accordion, AccordionItem } from "@skeletonlabs/skeleton";
  import { slide } from "svelte/transition";
  import Icon from "@iconify/svelte";
  import type { KeisanData } from "$lib/types/keisan";
  import KeisanCard from "$lib/components/KeisanCard.svelte";

  export let data: {
    keisanDataArray: KeisanData[];
  };

  let showAnswer = false;

  const enableTransitions = true;
  const transitionConfig = slide;
  const transitionParams = { duration: 300 };

  const cAccordionRounded = "rounded-lg";
  const cAccordionHover = "hover:underline";
  const cAccordionItemDiv = "border rounded";
  const cAccordionLabel = "text-xl font-bold";
</script>

<div class="cContentPartStyle !m-4">
  <Accordion
    width="w-[300px] md:w-[600px] lg:w-[1000px]"
    rounded={cAccordionRounded}
    hover={cAccordionHover}
    transitions={enableTransitions}
    transitionIn={transitionConfig}
    transitionInParams={transitionParams}
    transitionOut={transitionConfig}
    transitionOutParams={transitionParams}
  >
    {#each data.keisanDataArray as keisanData}
      <div class={cAccordionItemDiv}>
        <AccordionItem>
          <svelte:fragment slot="lead">
            <Icon icon="mdi:book-open-variant-outline" class="text-black" />
          </svelte:fragment>
          <svelte:fragment slot="summary">
            <h2 class={cAccordionLabel}>{keisanData.title}</h2>
          </svelte:fragment>
          <svelte:fragment slot="content">
            <div class="gap-2">
              <Accordion
                width="w-full"
                rounded={cAccordionRounded}
                hover={cAccordionHover}
                transitions={enableTransitions}
                transitionIn={transitionConfig}
                transitionInParams={transitionParams}
                transitionOut={transitionConfig}
                transitionOutParams={transitionParams}
              >
                {#each keisanData.data as row}
                  <div class={cAccordionItemDiv}>
                    <AccordionItem>
                      <svelte:fragment slot="lead">
                        <Icon icon="mdi:book-open-variant-outline" class="text-black" />
                      </svelte:fragment>
                      <svelte:fragment slot="summary">
                        <h2 class={cAccordionLabel}>{row.label}</h2>
                      </svelte:fragment>
                      <svelte:fragment slot="content">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                          {#each Array(3) as _}
                            <KeisanCard data={row} {showAnswer} isCompact={true} />
                          {/each}
                        </div>
                      </svelte:fragment>
                    </AccordionItem>
                  </div>
                {/each}
              </Accordion>
            </div>
          </svelte:fragment>
        </AccordionItem>
      </div>
    {/each}
  </Accordion>
</div>
