import Auth0Singleton from "$lib/services/Auth0Singleton";
import { collectionNameUsers, type UserDataDoc } from "$lib/types/document";
import UserCollectionService from "$lib/services/UserCollectionService";

export async function load() {
  const dbService = new UserCollectionService(collectionNameUsers);
  const user = await Auth0Singleton.getUser();
  const doc = user?.sub ? await dbService.getBySub<UserDataDoc>(user.sub) : null;

  return { user, userDataDoc: doc };
}
