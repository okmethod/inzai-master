import { writable, get } from "svelte/store";
import type { Theme } from "$lib/stores/theme";
import { timestampKeys, type TimestampKey } from "$lib/types/document";
import { setUserToDB, type UserData } from "$lib/models/UserData";

const userStore = writable<UserData | null>(null);

export function getUser(): UserData | null {
  return get(userStore);
}

export async function setUser(userData: UserData): Promise<void> {
  userStore.set(userData);
  await setUserToDB(userData.sub, userData);
}

export async function updateUserRewardPoints(dateKey: TimestampKey, earnedPoints: number): Promise<void> {
  const userData = getUser();
  if (!userData) return;

  const currentDates = timestampKeys.reduce(
    (dates, key) => {
      dates[key] = userData.getDate(key);
      return dates;
    },
    {} as Record<TimestampKey, Date>,
  );
  const updatedDates = {
    ...currentDates,
    [dateKey]: new Date(), // 対象キーの日付のみ更新する
  };

  const updatedRewardPoints = userData.rewardPoints + earnedPoints;
  const updatedUserData = userData.updatedReward(updatedDates, updatedRewardPoints);
  await setUser(updatedUserData);
}

export async function updateUserTheme(theme: Theme): Promise<void> {
  const userData = getUser();
  if (!userData) return;

  const updatedUserData = userData.updatedTheme(theme);
  await setUser(updatedUserData);
}
