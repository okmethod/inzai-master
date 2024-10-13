import type { LoadEvent } from "@sveltejs/kit";
import type { User } from "@auth0/auth0-spa-js";
import { collectionNameUsers, type UserDataDoc } from "$lib/types/document";
import UserCollectionService from "$lib/services/UserCollectionService";

export async function load({ parent }: LoadEvent): Promise<{
  user: User | null;
  userDataDoc: UserDataDoc | null;
}> {
  const parentData = await parent();
  const user = parentData.user;

  const dbService = new UserCollectionService(collectionNameUsers);
  const doc = user?.sub ? await dbService.getBySub<UserDataDoc>(user.sub) : null;

  return { user, userDataDoc: doc };
}
