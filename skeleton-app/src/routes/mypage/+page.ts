import type { LoadEvent } from "@sveltejs/kit";
import type { User } from "@auth0/auth0-spa-js";

export async function load({ parent }: LoadEvent): Promise<{
  user: User | null;
}> {
  const parentData = await parent();
  const user = parentData.user;

  return { user };
}
