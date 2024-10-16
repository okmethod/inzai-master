export function getRandomNumber(length: number): number {
  return Math.floor(Math.random() * length);
}

export function convertToKanji(num: number) {
  if (num === 0) return "零";
  if (num === 1) return "初";

  const kanjiDigits = ["", "壱", "弐", "参", "肆", "伍", "陸", "漆", "捌", "玖"];
  const kanjiUnits = ["", "拾", "佰", "阡", "萬", "億", "兆"];

  let kanji = "";
  let unitIndex = 0;
  while (num > 0) {
    const digit = num % 10;
    if (digit !== 0) {
      kanji = kanjiDigits[digit] + kanjiUnits[unitIndex] + kanji;
    }
    num = Math.floor(num / 10);
    unitIndex++;
  }

  // 特殊ケースの処理（例: 一十 -> 十）
  kanji = kanji.replace(/^一十/, "十");

  return kanji;
}
