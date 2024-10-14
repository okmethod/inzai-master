import type { LoadEvent } from "@sveltejs/kit";
import type { User } from "@auth0/auth0-spa-js";
import { UserData, getUserData } from "$lib/internal/UserData";

export async function load({ parent }: LoadEvent): Promise<{
  user: User | null;
  userData: UserData | null;
}> {
  const parentData = await parent();
  const user = parentData.user;
  const userData = await getUserData(user.sub);

  return { user, userData };
}
