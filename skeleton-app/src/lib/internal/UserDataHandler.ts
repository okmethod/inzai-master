import UserCollectionService from "$lib/services/UserCollectionService";
import type { UserDataDoc } from "$lib/types/document";
import { collectionNameUsers, UserData } from "$lib/types/document";

const dbService = new UserCollectionService(collectionNameUsers);

export async function getUserDataList(sub: string): Promise<UserData[]> {
  const docs = await dbService.listBySub<UserDataDoc>(sub);
  return docs.map((doc) => UserData.fromDoc(doc));
}

export async function getUserData(sub: string): Promise<UserData | null> {
  const doc = await dbService.getBySub<UserDataDoc>(sub);
  return doc ? UserData.fromDoc(doc) : null;
}

export async function setUserData(sub: string, userData: UserData): Promise<void> {
  await dbService.setBySub(sub, userData.toDoc());
  return;
}
