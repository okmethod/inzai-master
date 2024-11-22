<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import type { SvelteComponent } from "svelte";
  import type { PrefectureData } from "$lib/types/prefectures";

  export let parent: SvelteComponent;
  export let data: PrefectureData;

  const modalStore = getModalStore();

  function closeModal() {
    modalStore.close();
  }
</script>

{#if $modalStore[0]}
  <div
    class="
      w-full md:w-80 p-2 md:p-4
      rounded border shadow-2xl
      font-serif text-black bg-green-100 border-gray-600
    "
    data-parent={parent}
  >
    <div class="relative">
      <div class="flex flex-col items-center justify-center space-y-4">
        <h2 class="text-2xl font-bold mb-4">{data.name}</h2>
        <div class="w-40 h-40 p-1 bg-white border rounded">
          <img src={data.imageUrl} alt={data.name} class="w-full h-full object-contain" />
        </div>
        <p class="text-lg">{data.region} 地方</p>
      </div>
      <button
        type="button"
        class="btn-icon btn-icon-sm !bg-transparent absolute top-0 right-0 z-10"
        on:click={closeModal}
      >
        ✕
      </button>
    </div>
  </div>
{/if}
