import type { LoadEvent } from "@sveltejs/kit";
import type { KanjiData } from "$lib/types/kanji";
import { UserData, getUserData } from "$lib/internal/UserData";

export async function load({ parent }: LoadEvent): Promise<{
  kanjiDataArray: KanjiData[];
  userData: UserData | null;
}> {
  const parentData = await parent();
  const kanjiDataArray = parentData.kanjiDataArray;
  const user = parentData.user;
  const userData = user && user.sub ? await getUserData(user.sub) : null;

  return { kanjiDataArray, userData };
}
