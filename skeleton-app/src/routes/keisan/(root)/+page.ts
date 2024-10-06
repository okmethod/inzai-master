import type { LoadEvent } from "@sveltejs/kit";
import type { KeisanData } from "$lib/types/keisan";

export async function load({ parent }: LoadEvent): Promise<{ keisanDataArray: KeisanData[] }> {
  const parentData = await parent();
  return { keisanDataArray: parentData.keisanDataArray };
}
