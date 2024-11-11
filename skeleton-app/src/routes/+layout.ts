import type { LoadEvent } from "@sveltejs/kit";
import type { User } from "@auth0/auth0-spa-js";
import Auth0Singleton from "$lib/services/Auth0Singleton";
import { UserData, getUserFromDB, setUserToDB } from "$lib/models/UserData";
import { setUser } from "$lib/stores/user";
import { getTheme } from "$lib/stores/theme";

export async function load({ url }: LoadEvent): Promise<{
  user: User | null;
}> {
  const rootUrl = `${url.origin}`;
  await Auth0Singleton.init(rootUrl);
  await Auth0Singleton.handleRedirectCallback(url.pathname);
  const user = await Auth0Singleton.getUser();

  if (user && user.sub) {
    console.debug("User is authenticated.");
    const userData = await getUserFromDB(user.sub);
    if (!userData) {
      const newUserData = new UserData(user.sub, {}, 0, getTheme());
      await setUserToDB(user.sub, newUserData);
      setUser(newUserData);
    } else {
      setUser(userData);
    }
  } else {
    console.debug("User is not authenticated.");
  }

  return { user };
}
