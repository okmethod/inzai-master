import type { LoadEvent } from "@sveltejs/kit";
import type { KeisanData, KeisanTemplate } from "$lib/types/keisan";

export async function load({ parent }: LoadEvent): Promise<{ keisanTemplates: KeisanTemplate[] }> {
  const parentData = await parent();
  const keisanDataArray: KeisanData[] = parentData.keisanDataArray;
  const keisanTemplates: KeisanTemplate[] = keisanDataArray.flatMap((keisanData) => keisanData.data);
  return { keisanTemplates };
}
