import { Timestamp } from "@firebase/firestore";
import type { Theme } from "$lib/stores/theme";
import type { Auth0UserData } from "$lib/types/auth0";

export const timestampKeys = ["latestLoginReward", "latestKanjiExam", "latestKeisanExam"] as const;

export type TimestampKey = (typeof timestampKeys)[number];
type TimestampFields = {
  [key in TimestampKey]: Timestamp;
};

export function isTimestampKey(key: string): key is TimestampKey {
  return (timestampKeys as readonly string[]).includes(key);
}

export interface UserDataFields {
  rewardPoints: number;
  theme: Theme;
}

export interface UserDataDoc extends Auth0UserData, TimestampFields, UserDataFields {}
