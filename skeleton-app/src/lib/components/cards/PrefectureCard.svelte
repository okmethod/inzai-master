<script lang="ts">
  import type { PrefectureData } from "$lib/types/prefectures";

  export let data: PrefectureData;
  export let isCompact: boolean | undefined = undefined;

  const cCardAreaSize = isCompact
    ? "w-full lg:w-80 min-h-24 space-y-1"
    : "w-full md:w-80 lg:w-[450px] min-h-36 space-y-3";
  const cTextSize = isCompact ? "text-lg lg:text-xl" : "text-2xl lg:text-3xl";
</script>

<div
  class="
    flex flex-col justify-center items-center p-2
    !bg-green-100 border !border-gray-600 rounded
    {cCardAreaSize}
  "
>
  <div class="text-black font-serif {cTextSize}">
    {data.name}
  </div>
  <div class="w-20 h-20 p-1 bg-white border rounded">
    <img src={data.imageUrl} alt={data.name} class="w-full h-full object-contain" />
  </div>
</div>
