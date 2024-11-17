import type { LoadEvent } from "@sveltejs/kit";
import type { RegionData } from "$lib/types/prefectures";

export async function load({ parent }: LoadEvent): Promise<{ regionDataArray: RegionData[] }> {
  const parentData = await parent();
  return { regionDataArray: parentData.regionDataArray };
}
