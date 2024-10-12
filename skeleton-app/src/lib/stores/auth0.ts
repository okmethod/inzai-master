import { writable } from "svelte/store";
import type { User } from "@auth0/auth0-spa-js";
import Auth0Service from "$lib/services/Auth0Service";

const auth0Service = new Auth0Service();

export const auth0Store = writable<Auth0Service>(auth0Service);
export const auth0User = writable<User | null>(null);

export async function initAuth0(rootUrl: string): Promise<void> {
  await auth0Service.init(rootUrl);
  auth0Store.set(auth0Service);
}
