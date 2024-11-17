import type { LoadEvent } from "@sveltejs/kit";
import type { RegionData, StaticPrefectureData, PrefectureData } from "$lib/types/prefectures";
import { regions } from "$lib/types/prefectures";
import type { SlotTabSetting } from "$lib/types/tabSetting";
import { loadCsv } from "$lib/utils/loadfile";

const PrefectureDataPath = "prefectures/prefectures.csv";

export async function load({ fetch }: LoadEvent): Promise<{
  regionDataArray: RegionData[];
  slotTabSettings: SlotTabSetting[];
}> {
  const staticPrefectureDataArray = (await loadCsv(fetch, PrefectureDataPath)) as StaticPrefectureData[];
  const regionDataArray = regions.map((region, index) => ({
    index,
    name: region,
    prefectures: staticPrefectureDataArray
      .filter((prefecture) => prefecture.region === region)
      .map(
        (prefecture) =>
          ({
            index: prefecture.index,
            name: prefecture.name,
            region: prefecture.region,
            imageUrl: `prefectures/images/${prefecture.imagePath}`,
          }) as PrefectureData,
      ),
  }));

  const slotTabSettings: SlotTabSetting[] = [{ index: 0, label: "[都道府県リスト]", title: "", path: "" }];

  return { regionDataArray, slotTabSettings };
}
