import { getJSTDateString } from "$lib/utils/dateString";

export function rewardDailyLogin(latestLoginRewardDate: Date): number {
  const now = new Date();
  const JSTtoday = getJSTDateString(now);
  const JSTlatestLoginRewardDate = getJSTDateString(latestLoginRewardDate);

  return JSTlatestLoginRewardDate === JSTtoday ? 0 : 1;
}
