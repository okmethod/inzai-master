import type { LoadEvent } from "@sveltejs/kit";
import type { User } from "@auth0/auth0-spa-js";
import Auth0Singleton from "$lib/services/Auth0Singleton";
import UserCollectionService from "$lib/services/UserCollectionService";
import { collectionNameUsers, UserData, type UserDataDoc } from "$lib/types/document";

export async function load({ url }: LoadEvent): Promise<{
  user: User | null;
}> {
  const rootUrl = `${url.origin}`;
  await Auth0Singleton.init(rootUrl);
  await Auth0Singleton.handleRedirectCallback(url.pathname);
  const user = await Auth0Singleton.getUser();

  if (user && user.sub) {
    console.debug("User is authenticated.");
    await _addNewUserData(user.sub);
  } else {
    console.debug("User is not authenticated.");
  }

  async function _addNewUserData(sub: string) {
    const dbService = new UserCollectionService(collectionNameUsers);
    const doc = await dbService.getBySub<UserDataDoc>(sub);
    if (!doc) {
      const newUserData = new UserData(sub, {}, 0);
      await dbService.add<UserDataDoc>(newUserData.toDoc());
    }
  }

  return { user };
}
