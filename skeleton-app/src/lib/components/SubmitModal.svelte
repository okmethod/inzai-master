<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import type { SvelteComponent } from "svelte";

  export let parent: SvelteComponent;
  export let title: string;

  const modalStore = getModalStore();

  function onConfirm(): void {
    if (typeof $modalStore[0]?.response === "function") {
      $modalStore[0].response(true);
    }
    modalStore.close();
  }
</script>

{#if $modalStore[0]}
  <div class="flex flex-col items-center justify-center p-8 border rounded-lg bg-white shadow-2xl">
    <p class="text-xl font-bold">{title}</p>
    <div class="mt-2 mb-8">
      <slot />
    </div>
    <div class="space-x-2">
      <button class="cButtonGrayStyle" on:click={onConfirm}>OK </button>
      <button class="cButtonGrayStyle" on:click={parent.onClose}>Cancel</button>
    </div>
  </div>
{/if}
