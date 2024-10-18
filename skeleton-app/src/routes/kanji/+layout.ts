import type { LoadEvent } from "@sveltejs/kit";
import type { KanjiQuestion, KanjiData } from "$lib/types/kanji";
import type { SlotTabSetting } from "$lib/types/tabSetting";
import { loadCsv } from "$lib/utils/loadfile";

interface KanjiDataPath {
  title: string;
  path: string;
}

const contents: KanjiDataPath[] = [
  {
    title: "印西市の漢字",
    path: "kanji/inzai.csv",
  },
  {
    title: "小学6年生の漢字",
    path: "kanji/elementaryGrade6.csv",
  },
  {
    title: "小学5年生の漢字",
    path: "kanji/elementaryGrade5.csv",
  },
  {
    title: "小学4年生の漢字",
    path: "kanji/elementaryGrade4.csv",
  },
  {
    title: "小学3年生の漢字",
    path: "kanji/elementaryGrade3.csv",
  },
  {
    title: "小学2年生の漢字",
    path: "kanji/elementaryGrade2.csv",
  },
];

export async function load({ fetch }: LoadEvent): Promise<{
  kanjiDataArray: KanjiData[];
  slotTabSettings: SlotTabSetting[];
}> {
  const dataArrays = await Promise.all(contents.map((content) => loadCsv(fetch, content.path)));

  const kanjiDataArray = contents.map((content, index) => ({
    index: index,
    title: content.title,
    data: dataArrays[index] as KanjiQuestion[],
  }));

  const slotTabSettings: SlotTabSetting[] = [
    { index: 0, label: "[全漢字リスト]", title: "", path: "" },
    { index: 1, label: "[1問1答モード]", title: "", path: "one" },
    { index: 2, label: "[検定練習モード]", title: "", path: "trial" },
    { index: 3, label: "[検定挑戦モード]", title: "", path: "exam" },
  ];

  return { kanjiDataArray, slotTabSettings };
}
