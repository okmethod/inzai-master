import type { KeisanValue, KeisanData } from "$lib/types/keisan";
import { OperationType } from "$lib/types/keisan";
import type { SlotTabSetting } from "$lib/types/tabSetting";

const keisanValues: KeisanValue[] = [
  { label: "1桁", range: { min: 1, max: 9 }, allowNegative: false, decimalPlaces: 0 },
  { label: "2桁", range: { min: 10, max: 99 }, allowNegative: false, decimalPlaces: 0 },
  { label: "3桁", range: { min: 100, max: 999 }, allowNegative: false, decimalPlaces: 0 },
  // { label: "小数", range: { min: 0.1, max: 99.9 }, allowNegative: false, decimalPlaces: 1 },   // TODO: 小数の計算を十進数で扱う
];

export async function load(): Promise<{
  keisanDataArray: KeisanData[];
  slotTabSettings: SlotTabSetting[];
}> {
  const operationTypes = Object.values(OperationType);
  const keisanDataArray = operationTypes.map((type, index) => ({
    index: index,
    title: type,
    data: keisanValues.map((value) => ({
      label: `${value.label}の${type}`,
      range: value.range,
      allowNegative: value.allowNegative,
      decimalPlaces: value.decimalPlaces,
      operationType: type,
    })),
  }));

  const slotTabSettings: SlotTabSetting[] = [
    { index: 0, label: "[例題リスト]", title: "", path: "" },
    { index: 1, label: "[1問1答モード]", title: "", path: "one" },
    { index: 2, label: "[検定練習モード]", title: "", path: "trial" },
  ];

  return { keisanDataArray, slotTabSettings };
}
