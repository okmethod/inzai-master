<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import type { SvelteComponent } from "svelte";

  export let parent: SvelteComponent;
  export let title: string;
  export let min: number;
  export let max: number;
  let inputValue = 0;

  const modalStore = getModalStore();

  function onConfirm(): void {
    if (typeof $modalStore[0]?.response === "function") {
      $modalStore[0].response({ isConfirm: true, inputValue });
    }
    modalStore.close();
  }
</script>

{#if $modalStore[0]}
  <div class="flex flex-col items-center justify-center p-8 cSurfaceStyle rounded-lg shadow-2xl">
    <p class="text-xl font-bold">{title}</p>
    <div class="mt-2 mb-8">
      <slot />
    </div>
    <div class="flex flex-col items-center justify-center space-y-4">
      <div class="">
        <input type="number" bind:value={inputValue} {min} {max} class="w-20 h-10 p-1 text-center cMonoStyle rounded" />
        <span>問 正解できた！</span>
      </div>
      <div class="space-x-2">
        <button type="button" class="btn variant-filled h-8" on:click={onConfirm}>OK </button>
        <button type="button" class="btn variant-filled h-8" on:click={parent.onClose}>Cancel</button>
      </div>
    </div>
  </div>
{/if}
