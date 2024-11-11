import type { LoadEvent } from "@sveltejs/kit";
import type { KanjiData } from "$lib/types/kanji";

export async function load({ parent }: LoadEvent): Promise<{
  kanjiDataArray: KanjiData[];
}> {
  const parentData = await parent();
  const kanjiDataArray = parentData.kanjiDataArray;

  return { kanjiDataArray };
}
