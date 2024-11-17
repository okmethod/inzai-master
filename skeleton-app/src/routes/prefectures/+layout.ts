// import type { LoadEvent } from "@sveltejs/kit";
import type { SlotTabSetting } from "$lib/types/tabSetting";

export async function load(): Promise<{
  slotTabSettings: SlotTabSetting[];
}> {
  const slotTabSettings: SlotTabSetting[] = [{ index: 0, label: "[都道府県リスト]", title: "", path: "" }];

  return { slotTabSettings };
}
