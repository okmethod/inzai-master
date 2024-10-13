import { getJSTDateString } from "$lib/utils/dateString";
import { collectionNameUsers, UserData, type UserDataDoc } from "$lib/types/document";
import UserCollectionService from "$lib/services/UserCollectionService";

const REWARD_POINTS = {
  DAILY_LOGIN: 1,
};

type RewardKey = keyof typeof REWARD_POINTS;

export async function updateRewardPoints(sub: string, rewardKey: RewardKey): Promise<number> {
  const dbService = new UserCollectionService(collectionNameUsers);
  const doc = await dbService.getBySub<UserDataDoc>(sub);
  if (!doc) {
    throw new Error(`No users found with sub=${sub}`);
  }
  const userData = UserData.fromDoc(doc);

  let latestLoginRewardData = userData.latestLoginRewardDate;
  switch (rewardKey) {
    case "DAILY_LOGIN":
      latestLoginRewardData = new Date();
      break;
    default:
      break;
  }

  const rewardPoints = REWARD_POINTS[rewardKey];
  const updatedRewardPoints = userData.rewardPoints + rewardPoints;
  const updatedUserData = new UserData(sub, latestLoginRewardData, updatedRewardPoints);
  await dbService.setBySub(sub, updatedUserData.toDoc());

  return updatedRewardPoints;
}

export function isEligibleForDailyLoginReward(latestLoginRewardDate: Date): boolean {
  const now = new Date();
  const JSTtoday = getJSTDateString(now);
  const JSTlatestLoginRewardDate = getJSTDateString(latestLoginRewardDate);

  return JSTlatestLoginRewardDate !== JSTtoday;
}
