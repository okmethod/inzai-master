import type { LoadEvent } from "@sveltejs/kit";
import type { User } from "@auth0/auth0-spa-js";
import Auth0Singleton from "$lib/services/Auth0Singleton";
import { UserData, getUserData, setUserData } from "$lib/internal/UserData";

export async function load({ url }: LoadEvent): Promise<{
  user: User | null;
}> {
  const rootUrl = `${url.origin}`;
  await Auth0Singleton.init(rootUrl);
  await Auth0Singleton.handleRedirectCallback(url.pathname);
  const user = await Auth0Singleton.getUser();

  if (user && user.sub) {
    console.debug("User is authenticated.");
    const userData = await getUserData(user.sub);
    if (!userData) {
      const newUserData = new UserData(user.sub, {}, 0);
      await setUserData(user.sub, newUserData);
    }
  } else {
    console.debug("User is not authenticated.");
  }

  return { user };
}
