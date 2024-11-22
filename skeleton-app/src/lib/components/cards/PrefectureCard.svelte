<script lang="ts">
  import type { ModalComponent, ModalSettings, ModalStore } from "@skeletonlabs/skeleton";
  import type { PrefectureData } from "$lib/types/prefectures";
  import PrefectureModal from "$lib/components/modals/PrefectureModal.svelte";

  export let data: PrefectureData;
  export let isCompact: boolean | undefined = undefined;
  export let modalStore: ModalStore | undefined = undefined;

  function showPrefectureModal(): void {
    if (modalStore === undefined) return;
    const modalComponent: ModalComponent = {
      ref: PrefectureModal,
      props: {
        data,
      },
    };
    const m: ModalSettings = {
      type: "component",
      component: modalComponent,
      backdropClasses: "cModalStandardBackdrop",
    };
    modalStore.trigger(m);
  }

  const cCardAreaSize = isCompact
    ? "w-full lg:w-80 min-h-24 space-y-1"
    : "w-full md:w-80 lg:w-[450px] min-h-36 space-y-3";
  const cTextSize = isCompact ? "text-lg lg:text-xl" : "text-2xl lg:text-3xl";
</script>

<button
  type="button"
  class="
    {modalStore === undefined ? '' : 'btn variant-filled hover:!bg-green-200'}
    flex flex-col justify-center items-center p-2
    !bg-green-100 border !border-gray-600 rounded
    {cCardAreaSize}
  "
  on:click={showPrefectureModal}
  disabled={modalStore === undefined}
>
  <div class="text-black font-serif {cTextSize}">
    {data.name}
  </div>
  <div class="w-20 h-20 p-1 bg-white border rounded">
    <img src={data.imageUrl} alt={data.name} class="w-full h-full object-contain" />
  </div>
</button>
