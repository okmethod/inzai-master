import type { NumberRange } from "$lib/types/keisan";
import { OperationType } from "$lib/types/keisan";

export function generateRandomNumber(range: NumberRange, decimalPlaces: number): number {
  const randomValue = Math.random() * (range.max - range.min) + range.min;
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(randomValue * factor) / factor;
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
    case OperationType.Div:
      return {
        formula: `${x} ÷ ${y}`,
        answer: x / y,
      };
  }
}
