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

export function rewardDailyLogin(latestLogin: Date): number {
  const now = new Date();
  const today = getJSTDateString(now);
  const latestLoginDate = getJSTDateString(latestLogin);

  return latestLoginDate === today ? 0 : 1;
}
