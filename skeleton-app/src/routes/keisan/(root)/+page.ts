import type { LoadEvent } from "@sveltejs/kit";
import type { KeisanDataProps } from "$lib/types/keisan";

export async function load({ parent }: LoadEvent): Promise<{ propsArray: KeisanDataProps[] }> {
  const parentData = await parent();
  return { propsArray: parentData.propsArray };
}
