import type { SlotTabSetting } from "$lib/types/tabSetting";

export async function load(): Promise<{ slotTabSettings: SlotTabSetting[] }> {
  const slotTabSettings: SlotTabSetting[] = [
    { index: 0, label: "[XXリスト]", title: "", path: "" },
    { index: 1, label: "[1問1答モード]", title: "", path: "" },
    { index: 2, label: "[テスト練習モード]", title: "", path: "" },
  ];

  return { slotTabSettings };
}
