import type { KeisanValue, NumberRange } from "$lib/types/keisan";

export const keisanValues: KeisanValue[] = [
  { label: "1桁", range: { min: 1, max: 9 }, allowNegative: false, decimalPlaces: 0 },
  { label: "2桁", range: { min: 10, max: 99 }, allowNegative: false, decimalPlaces: 0 },
  { label: "3桁", range: { min: 100, max: 999 }, allowNegative: false, decimalPlaces: 0 },
  // { label: "小数", range: { min: 0.1, max: 99.9 }, allowNegative: false, decimalPlaces: 1 },   // TODO: 小数の計算を十進数で扱う
];

export function generateRandomNumber(range: NumberRange, decimalPlaces: number): number {
  const randomValue = Math.random() * (range.max - range.min) + range.min;
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(randomValue * factor) / factor;
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
): {
  formula: string;
  answer: number;
} {
  switch (type) {
    case OperationType.Add:
      return {
        formula: `${x} ＋ ${y}`,
        answer: x + y,
      };
    case OperationType.Sub:
      return {
        formula: `${x} － ${y}`,
        answer: x - y,
      };
    case OperationType.Mul:
      return {
        formula: `${x} × ${y}`,
        answer: x * y,
      };
    // case OperationType.Div:
    //   return {
    //     formula: `${x} ÷ ${y}`,
    //     answer: x / y,
    //   };
  }
}
