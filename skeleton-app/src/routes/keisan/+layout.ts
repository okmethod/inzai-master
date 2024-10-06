import type { KeisanDataProps } from "$lib/types/keisan";
import type { SlotTabSetting } from "$lib/types/tabSetting";

interface KeisanDataPath {
  title: string;
  data: string[];
}

const contents: KeisanDataPath[] = [
  {
    title: "たし算",
    data: ["1桁", "b", "c", "d", "e", "f"],
  },
  {
    title: "ひき算",
    data: ["a", "b", "c", "d", "e", "f"],
  },
  {
    title: "かけ算",
    data: ["a", "b", "c", "d", "e", "f"],
  },
];

export async function load(): Promise<{ propsArray: KeisanDataProps[]; slotTabSettings: SlotTabSetting[] }> {
  const propsArray = contents.map((content, index) => ({
    index: index,
    title: content.title,
    data: content.data,
  }));

  const slotTabSettings: SlotTabSetting[] = [
    { index: 0, label: "[XXリスト]", title: "", path: "" },
    { index: 1, label: "[1問1答モード]", title: "", path: "" },
    { index: 2, label: "[テスト練習モード]", title: "", path: "" },
  ];

  return { propsArray, slotTabSettings };
}
