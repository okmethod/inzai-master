import Auth0Singleton from "$lib/services/Auth0Singleton";
import { collectionNameUsers, type UserData } from "$lib/types/document";
import UserCollectionService from "$lib/services/UserCollectionService";

export async function load() {
  const dbService = new UserCollectionService(collectionNameUsers);
  const user = await Auth0Singleton.getUser();
  const doc = user?.sub ? await dbService.getBySub<UserData>(user.sub) : null;

  return { user, userData: doc };
}
