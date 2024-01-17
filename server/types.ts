export type MapKeyType<T> = T extends Map<infer K, unknown> ? K : never;

export type MapValueType<T> = T extends Map<unknown, infer V> ? V : never;

export interface BookmarkValue {
  date: Date;
  url: string;
  title: string;
  markdown: string;
}

export interface EncryptedValue {
  encrypted: string;
  expires: Date;
}

export interface Bookmark extends BookmarkValue {
  id: string;
  hash: string;
  html: string;
}

export interface GitHubUser {
  id: number;
  login: string;
  name: string;
  url: string;
}

export interface GitHubToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  token_type: string;
  scope: string;
}
