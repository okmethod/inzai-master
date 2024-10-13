import type { LoadEvent } from "@sveltejs/kit";
import type { User } from "@auth0/auth0-spa-js";
import Auth0Singleton from "$lib/services/Auth0Singleton";
import UserCollectionService from "$lib/services/UserCollectionService";
import { collectionNameUsers, UserData, type UserDataDoc } from "$lib/types/document";
import { rewardDailyLogin } from "$lib/internal/reward";

export async function load({ url }: LoadEvent): Promise<{
  user: User | null;
}> {
  const rootUrl = `${url.origin}`;
  await Auth0Singleton.init(rootUrl);
  await Auth0Singleton.handleRedirectCallback(url.pathname);
  const user = await Auth0Singleton.getUser();

  if (user && user.sub) {
    console.debug("User is authenticated.");
    await _handleUserData(user.sub);
  } else {
    console.debug("User is not authenticated.");
  }

  async function _handleUserData(sub: string) {
    const dbService = new UserCollectionService(collectionNameUsers);
    const doc = await dbService.getBySub<UserDataDoc>(sub);
    const now = new Date();
    if (!doc) {
      const newUserData = new UserData(sub, now, 0);
      await dbService.add<UserDataDoc>(newUserData.toDoc());
    } else {
      const currentUserData = UserData.fromDoc(doc);
      const updatedUserData = new UserData(
        sub,
        now,
        doc.rewardPoints + rewardDailyLogin(currentUserData.latestLoginRewardDate),
      );
      await dbService.setBySub<UserDataDoc>(sub, updatedUserData.toDoc());
    }
  }

  return { user };
}
