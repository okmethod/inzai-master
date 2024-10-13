import { Timestamp } from "@firebase/firestore";

export interface Auth0UserData {
  sub: string;
}

export const collectionNameUsers = "users";

export interface UserDataDoc extends Auth0UserData {
  sub: string;
  latestLogin: Timestamp;
  rewardPoints: number;
}

export class UserData implements Auth0UserData {
  sub: string;
  private _latestLogin: Timestamp;
  rewardPoints: number;

  constructor(sub: string, latestLogin: Date | Timestamp, rewardPoints: number) {
    this.sub = sub;
    if (latestLogin instanceof Date) {
      this._latestLogin = Timestamp.fromDate(latestLogin);
    } else {
      this._latestLogin = latestLogin;
    }
    this.rewardPoints = rewardPoints;
  }

  get latestLogin(): Timestamp {
    return this._latestLogin;
  }

  get latestLoginDate(): Date {
    return this._latestLogin.toDate();
  }

  toDoc(): UserDataDoc {
    return {
      sub: this.sub,
      latestLogin: this._latestLogin,
      rewardPoints: this.rewardPoints,
    };
  }

  static fromDoc(doc: UserDataDoc): UserData {
    return new UserData(doc.sub, doc.latestLogin, doc.rewardPoints);
  }
}
