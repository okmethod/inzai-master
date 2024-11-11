import { writable, get } from "svelte/store";
import type { Theme } from "$lib/stores/theme";
import { UserData, setUserData } from "$lib/internal/UserData";

const userStore = writable<UserData | null>(null);

export function getUser(): UserData | null {
  return get(userStore);
}

export async function setUser(userData: UserData): Promise<void> {
  userStore.set(userData);
  await setUserData(userData.sub, userData);
}

export async function updateUserTheme(theme: Theme): Promise<void> {
  const userData = getUser();
  if (!userData) return;

  const updatedUserData = userData.updatedTheme(theme);
  await setUser(updatedUserData);
}
