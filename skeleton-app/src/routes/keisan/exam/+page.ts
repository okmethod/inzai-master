import type { LoadEvent } from "@sveltejs/kit";
import type { KeisanData, KeisanTemplate } from "$lib/types/keisan";
import { UserData, getUserData } from "$lib/internal/UserData";

export async function load({ parent }: LoadEvent): Promise<{
  keisanTemplates: KeisanTemplate[];
  userData: UserData | null;
}> {
  const parentData = await parent();
  const keisanDataArray: KeisanData[] = parentData.keisanDataArray;
  const keisanTemplates: KeisanTemplate[] = keisanDataArray.flatMap((keisanData) => keisanData.data);
  const user = parentData.user;
  const userData = user && user.sub ? await getUserData(user.sub) : null;

  return { keisanTemplates, userData };
}
