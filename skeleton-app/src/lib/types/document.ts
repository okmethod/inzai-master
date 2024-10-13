import { Timestamp } from "@firebase/firestore";

export interface Auth0UserData {
  sub: string;
}

export const collectionNameUsers = "users";

export interface UserDataDoc extends Auth0UserData {
  sub: string;
  latestLoginRewardTimestamp: Timestamp;
  rewardPoints: number;
}

export class UserData implements Auth0UserData {
  sub: string;
  private _latestLoginRewardTimestamp: Timestamp;
  rewardPoints: number;

  constructor(sub: string, latestLoginRewardTimestamp: Date | Timestamp, rewardPoints: number) {
    this.sub = sub;
    if (latestLoginRewardTimestamp instanceof Date) {
      this._latestLoginRewardTimestamp = Timestamp.fromDate(latestLoginRewardTimestamp);
    } else {
      this._latestLoginRewardTimestamp = latestLoginRewardTimestamp;
    }
    this.rewardPoints = rewardPoints;
  }

  get latestLoginRewardTimestamp(): Timestamp {
    return this._latestLoginRewardTimestamp;
  }

  get latestLoginRewardDate(): Date {
    return this._latestLoginRewardTimestamp.toDate();
  }

  toDoc(): UserDataDoc {
    return {
      sub: this.sub,
      latestLoginRewardTimestamp: this._latestLoginRewardTimestamp,
      rewardPoints: this.rewardPoints,
    };
  }

  static fromDoc(doc: UserDataDoc): UserData {
    return new UserData(doc.sub, doc.latestLoginRewardTimestamp, doc.rewardPoints);
  }
}
