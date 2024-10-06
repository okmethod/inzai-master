import type { LoadEvent } from "@sveltejs/kit";
import type { KanjiCsv, KanjiData } from "$lib/types/kanji";
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
    title: "1級・2級の漢字",
    path: "kanji/grade1and2.csv",
  },
  {
    title: "3級・4級の漢字",
    path: "kanji/grade3and4.csv",
  },
  {
    title: "5級・6級の漢字",
    path: "kanji/grade5and6.csv",
  },
  {
    title: "7級・8級の漢字",
    path: "kanji/grade7and8.csv",
  },
  {
    title: "9級・10級の漢字",
    path: "kanji/grade9and10.csv",
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
    data: dataArrays[index] as KanjiCsv[],
  }));

  const slotTabSettings: SlotTabSetting[] = [
    { index: 0, label: "[全漢字リスト]", title: "", path: "" },
    { index: 1, label: "[1問1答モード]", title: "", path: "one" },
    { index: 2, label: "[テスト練習モード]", title: "", path: "trial" },
  ];

  return { kanjiDataArray, slotTabSettings };
}
