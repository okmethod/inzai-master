import type { KeisanValue, NumberRange } from "$lib/types/keisan";

export const keisanValues: KeisanValue[] = [
  { label: "1桁", range: { min: 1, max: 9 }, allowNegative: false, decimalPlaces: 0 },
  { label: "2桁", range: { min: 10, max: 99 }, allowNegative: false, decimalPlaces: 0 },
  { label: "3桁", range: { min: 100, max: 999 }, allowNegative: false, decimalPlaces: 0 },
  { label: "小数", range: { min: 0.1, max: 99.9 }, allowNegative: false, decimalPlaces: 1 },
];

function roundToDecimalPlaces(num: number, decimalPlaces: number): number {
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(num * factor) / factor;
}

function roundAndFormat(num: number, decimalPlaces: number): string {
  return roundToDecimalPlaces(num, decimalPlaces).toFixed(decimalPlaces);
}

export enum OperationType {
  Add = "たし算",
  Sub = "ひき算",
  Mul = "かけ算",
  // Div = "わり算",  // TODO: 割り切れるかどうかを考慮する
}

export function buildFormula(
  x: number,
  y: number,
  type: OperationType,
  decimalPlaces: number,
): {
  formulaString: string;
  answerString: string;
} {
  const xString = x.toFixed(decimalPlaces);
  const yString = y.toFixed(decimalPlaces);
  switch (type) {
    case OperationType.Add:
      return {
        formulaString: `${xString} ＋ ${yString}`,
        answerString: roundAndFormat(x + y, decimalPlaces),
      };
    case OperationType.Sub:
      return {
        formulaString: `${xString} － ${yString}`,
        answerString: roundAndFormat(x - y, decimalPlaces),
      };
    case OperationType.Mul:
      return {
        formulaString: `${xString} × ${yString}`,
        answerString: roundAndFormat(x * y, decimalPlaces * 2),
      };
    // case OperationType.Div:
    //   return {
    //     formulaString: `${xString} ÷ ${yString}`,
    //     answerString: roundAndFormat(x / y, decimalPlaces),
    //   };
  }
}

function generateRandomNumber(range: NumberRange, decimalPlaces: number): number {
  const randomValue = Math.random() * (range.max - range.min) + range.min;
  return roundToDecimalPlaces(randomValue, decimalPlaces);
}

export function generateRandomNumbers(
  range: NumberRange,
  decimalPlaces: number,
  operationType: OperationType,
  allowNegative: boolean,
): { x: number; y: number } {
  let x = generateRandomNumber(range, decimalPlaces);
  let y = generateRandomNumber(range, decimalPlaces);

  if (!allowNegative && operationType === OperationType.Sub && x < y) {
    [x, y] = [y, x]; // x と y の値を入れ替える
  }

  return { x, y };
}
