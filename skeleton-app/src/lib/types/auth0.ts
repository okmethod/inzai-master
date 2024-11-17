export interface Auth0UserKey {
  sub: string; // 不整合を避けるため、DBにはKeyのみ保存する
}
