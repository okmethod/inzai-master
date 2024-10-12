export interface Auth0UserData {
  sub: string;
}

export const collectionNameUsers = "users";
export interface UserData extends Auth0UserData {
  latestLogin: Date;
}
