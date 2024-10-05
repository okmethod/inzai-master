import type { LoadEvent } from "@sveltejs/kit";
import type { KanjiDataProps } from "$lib/types/kanji";

export async function load({ parent }: LoadEvent): Promise<{ propsArray: KanjiDataProps[] }> {
  const parentData = await parent();
  return { propsArray: parentData.propsArray };
}
