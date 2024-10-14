import { Timestamp } from "@firebase/firestore";

export interface Auth0UserData {
  sub: string;
}

export const collectionNameUsers = "users";

export const timestampKeys = ["latestLoginReward", "latestKanjiExam", "latestKeisanExam"] as const;
export type TimestampKey = (typeof timestampKeys)[number];
type TimestampFields = {
  [key in TimestampKey]: Timestamp;
};
export interface UserDataDoc extends Auth0UserData, TimestampFields {
  rewardPoints: number;
}

export class UserData implements Auth0UserData {
  public sub: string;
  private timestamps: Record<TimestampKey, Timestamp>;
  public rewardPoints: number;
  private static readonly EpochZero = new Date(0);

  constructor(sub: string, timestamps: Record<string, Timestamp | Date>, rewardPoints: number) {
    this.sub = sub;
    this.timestamps = {} as Record<TimestampKey, Timestamp>;
    for (const key in timestamps) {
      if (Object.prototype.hasOwnProperty.call(timestamps, key) && this.isTimestampKey(key)) {
        this.timestamps[key] = this.convertToTimestamp(timestamps[key]);
      }
    }
    this.rewardPoints = rewardPoints;
  }

  private isTimestampKey(key: string): key is TimestampKey {
    return (timestampKeys as readonly string[]).includes(key);
  }

  private convertToTimestamp(dateOrTimestamp: Date | Timestamp): Timestamp {
    return dateOrTimestamp instanceof Date ? Timestamp.fromDate(dateOrTimestamp) : dateOrTimestamp;
  }

  private getOrDefault(key: TimestampKey): Timestamp {
    return this.timestamps[key] || Timestamp.fromDate(UserData.EpochZero);
  }

  public getTimestamp(key: TimestampKey): Timestamp {
    return this.getOrDefault(key);
  }

  public getDate(key: TimestampKey): Date {
    return this.getOrDefault(key).toDate();
  }

  toDoc(): UserDataDoc {
    return {
      sub: this.sub,
      latestLoginReward: this.timestamps.latestLoginReward,
      latestKanjiExam: this.timestamps.latestKanjiExam,
      latestKeisanExam: this.timestamps.latestKeisanExam,
      rewardPoints: this.rewardPoints,
    };
  }

  private static extractTimestamps(doc: UserDataDoc): Record<TimestampKey, Timestamp> {
    const result: Partial<Record<TimestampKey, Timestamp>> = {};
    for (const key in doc) {
      if (doc[key as keyof UserDataDoc] instanceof Timestamp) {
        result[key as TimestampKey] = doc[key as keyof UserDataDoc] as Timestamp;
      }
    }
    return result as Record<TimestampKey, Timestamp>;
  }

  static fromDoc(doc: UserDataDoc): UserData {
    return new UserData(doc.sub, UserData.extractTimestamps(doc), doc.rewardPoints);
  }
}
