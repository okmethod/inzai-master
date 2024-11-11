import type { ToastStore, ToastSettings } from "@skeletonlabs/skeleton";
import { getJSTDateString } from "$lib/utils/dateString";
import type { TimestampKey } from "$lib/types/document";
import type { UserData } from "$lib/models/UserData";
import { updateUserRewardPoints } from "$lib/stores/user";

interface RewordData {
  dateKey: TimestampKey;
  message: string;
  points: number;
}

const REWARDS: Record<string, RewordData> = {
  DAILY_LOGIN: {
    dateKey: "latestLoginReward",
    message: "✏️ 今日も自学えらい！",
    points: 1,
  },
  KANJI_EXAM_PARTICIPATION: {
    dateKey: "latestKanjiExam",
    message: "✨ 漢字検定にトライ！ ",
    points: 5,
  },
  KANJI_EXAM_PASS: {
    dateKey: "latestKanjiExam",
    message: "🏅 漢字検定マスター！",
    points: 15,
  },
  KEISAN_EXAM_PARTICIPATION: {
    dateKey: "latestKeisanExam",
    message: "✨ 計算検定にトライ！ ",
    points: 5,
  },
  KEISAN_EXAM_PASS: {
    dateKey: "latestKeisanExam",
    message: "🏅 計算検定マスター！",
    points: 15,
  },
};

type RewardKey = keyof typeof REWARDS;

export async function addRewardPoints(rewardKey: RewardKey): Promise<number> {
  const { dateKey, points } = REWARDS[rewardKey];
  await updateUserRewardPoints(dateKey, points);

  return points;
}

export function showRewardToast(toastStore: ToastStore, rewardKey: RewardKey): void {
  const { message, points } = REWARDS[rewardKey];
  const toastSettings: ToastSettings = {
    message: `${message} +${points}pt`,
    background: "bg-yellow-100 select-none",
    timeout: 5000,
  };
  toastStore.trigger(toastSettings);
}

export function isEligibleForDailyReward(userDate: UserData, rewardKey: RewardKey): boolean {
  const now = new Date();
  const JSTtoday = getJSTDateString(now);
  const JSTlatestRewardDate = getJSTDateString(userDate.getDate(REWARDS[rewardKey].dateKey));

  return JSTlatestRewardDate !== JSTtoday;
}
