import type { LoadEvent } from "@sveltejs/kit";
import type { kanjiCsv } from "$lib/types/csv";
import { loadCsv } from "$lib/utils/loadfile";

export interface ContentProps {
  title: string;
  data: kanjiCsv[];
}

interface Content {
  title: string;
  path: string;
}

const contents: Content[] = [
  {
    title: "1級・2級の漢字",
    path: "kanji/grade1and2.csv",
  },
  {
    title: "印西市の漢字",
    path: "kanji/inzai.csv",
  },
];

export async function load({ fetch }: LoadEvent) {
  const dataArrays = await Promise.all(contents.map((content) => loadCsv(fetch, content.path)));

  const propsArray = contents.map((content, index) => ({
    title: content.title,
    data: dataArrays[index] as kanjiCsv[],
  }));

  return { propsArray };
}
