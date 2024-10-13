import type { ToastStore, ToastSettings } from "@skeletonlabs/skeleton";
import { getJSTDateString } from "$lib/utils/dateString";
import { collectionNameUsers, UserData, type UserDataDoc } from "$lib/types/document";
import UserCollectionService from "$lib/services/UserCollectionService";

interface RewordData {
  name: string;
  points: number;
}

const REWARDS: Record<string, RewordData> = {
  DAILY_LOGIN: {
    name: "ログインボーナス",
    points: 1,
  },
};

type RewardKey = keyof typeof REWARDS;

export async function updateRewardPoints(sub: string, rewardKey: RewardKey): Promise<number> {
  const dbService = new UserCollectionService(collectionNameUsers);
  const doc = await dbService.getBySub<UserDataDoc>(sub);
  if (!doc) {
    throw new Error(`No users found with sub=${sub}`);
  }
  const userData = UserData.fromDoc(doc);

  let latestLoginRewardDate = userData.getDate("latestLoginReward");
  const latestKanjiExamDate = userData.getDate("latestKanjiExam");
  const latestKeisanExamDate = userData.getDate("latestKeisanExam");
  switch (rewardKey) {
    case "DAILY_LOGIN":
      latestLoginRewardDate = new Date();
      break;
    default:
      break;
  }

  const rewardPoints = REWARDS[rewardKey].points;
  const updatedRewardPoints = userData.rewardPoints + rewardPoints;
  const updatedUserData = new UserData(
    sub,
    {
      latestLoginReward: latestLoginRewardDate,
      latestKanjiExam: latestKanjiExamDate,
      latestKeisanExam: latestKeisanExamDate,
    },
    updatedRewardPoints,
  );
  await dbService.setBySub(sub, updatedUserData.toDoc());

  return updatedRewardPoints;
}

export function showRewardToast(toastStore: ToastStore, rewardKey: RewardKey): void {
  const { name, points } = REWARDS[rewardKey];
  const toastSettings: ToastSettings = {
    message: `✨ ${name} 獲得！ +${points}pt`,
    background: "bg-yellow-100 select-none",
    timeout: 5000,
  };
  toastStore.trigger(toastSettings);
}

export function isEligibleForDailyLoginReward(latestLoginRewardDate: Date): boolean {
  const now = new Date();
  const JSTtoday = getJSTDateString(now);
  const JSTlatestLoginRewardDate = getJSTDateString(latestLoginRewardDate);

  return JSTlatestLoginRewardDate !== JSTtoday;
}
