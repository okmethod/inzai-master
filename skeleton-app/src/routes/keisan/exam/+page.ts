import type { LoadEvent } from "@sveltejs/kit";
import type { KeisanData } from "$lib/types/keisan";
import { UserData, getUserData } from "$lib/internal/UserData";

export async function load({ parent }: LoadEvent): Promise<{
  keisanDataArray: KeisanData[];
  userData: UserData | null;
}> {
  const parentData = await parent();
  const keisanDataArray = parentData.keisanDataArray;
  const user = parentData.user;
  const userData = user && user.sub ? await getUserData(user.sub) : null;

  return { keisanDataArray, userData };
}
