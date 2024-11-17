import type { LoadEvent } from "@sveltejs/kit";
import type { RegionData, PrefectureData } from "$lib/types/prefectures";
import { regions } from "$lib/types/prefectures";
import type { SlotTabSetting } from "$lib/types/tabSetting";
import { loadCsv } from "$lib/utils/loadfile";

const PrefectureDataPath = "prefectures/prefectures.csv";

export async function load({ fetch }: LoadEvent): Promise<{
  regionDataArray: RegionData[];
  slotTabSettings: SlotTabSetting[];
}> {
  const prefectureDataArray = (await loadCsv(fetch, PrefectureDataPath)) as PrefectureData[];
  const regionDataArray = regions.map((region, index) => ({
    index,
    name: region,
    prefectures: prefectureDataArray.filter((prefecture) => prefecture.region === region),
  }));

  const slotTabSettings: SlotTabSetting[] = [{ index: 0, label: "[都道府県リスト]", title: "", path: "" }];

  return { regionDataArray, slotTabSettings };
}
