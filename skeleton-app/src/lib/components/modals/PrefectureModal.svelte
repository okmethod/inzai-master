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
      w-full md:w-[800px] p-2 md:p-4
      rounded border shadow-2xl
      text-black bg-green-100 border-gray-600
    "
    data-parent={parent}
  >
    <div class="relative">
      <h2 class="text-center text-2xl font-bold mb-4">{data.name}</h2>
      <div class="grid grid-cols-2 md:grid-cols-3">
        <div class="col-span-1 w-40 h-40 md:w-60 md:h-60 p-1 bg-white border rounded">
          <img src={data.imageUrl} alt={data.name} class="w-full h-full object-contain" />
        </div>
        <table class="table-auto w-full text-left">
          <tbody>
            <tr>
              <th class="px-4 py-2">地方</th>
              <td class="px-4 py-2">{data.region}地方</td>
            </tr>
            <tr>
              <th class="px-4 py-2">県庁所在地</th>
              <td class="px-4 py-2">{data.capital}</td>
            </tr>
          </tbody>
        </table>
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
