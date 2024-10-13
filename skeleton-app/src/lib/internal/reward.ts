function getJSTDateString(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  const formatter = new Intl.DateTimeFormat("ja-JP", options);
  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  return `${year}-${month}-${day}`;
}

export function rewardDailyLogin(latestLoginRewardDate: Date): number {
  const now = new Date();
  const JSTtoday = getJSTDateString(now);
  const JSTlatestLoginRewardDate = getJSTDateString(latestLoginRewardDate);

  return JSTlatestLoginRewardDate === JSTtoday ? 0 : 1;
}
