<script lang="ts">
  import IconButton from "$lib/components/buttons/IconButton.svelte";
  import { isIconConfig, type TransitionButtonConfig } from "$lib/utils/transitions";

  export let data: {
    buttonConfigs: Array<TransitionButtonConfig>;
  };
</script>

<div class="cPageBodyStyle">
  <div class="cTitlePartStyle md:!mb-4">
    <h1 class="cTitleStyle md:!text-3xl">自学マスタードリル</h1>
  </div>

  <div class="cPageBodyStyle">
    {#each data.buttonConfigs as config}
      <IconButton
        icon={isIconConfig(config.symbol) ? config.symbol.icon : "mdi:circle-small"}
        label={config.label}
        cButton="w-80 !text-lg md:!text-2xl font-bold cSurfaceBg cPrimaryText cSurfaceBorder"
        onClick={config.onClick}
      />
    {/each}
  </div>
</div>
