import { Timestamp } from "@firebase/firestore";

export interface Auth0UserData {
  sub: string;
}

export const timestampKeys = ["latestLoginReward", "latestKanjiExam", "latestKeisanExam"] as const;

export type TimestampKey = (typeof timestampKeys)[number];
type TimestampFields = {
  [key in TimestampKey]: Timestamp;
};

export function isTimestampKey(key: string): key is TimestampKey {
  return (timestampKeys as readonly string[]).includes(key);
}

export interface UserDataDoc extends Auth0UserData, TimestampFields {
  rewardPoints: number;
}
