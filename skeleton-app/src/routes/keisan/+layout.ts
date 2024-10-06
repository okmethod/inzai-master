import type { KeisanValue, KeisanData } from "$lib/types/keisan";
import { OperationType } from "$lib/types/keisan";
import type { SlotTabSetting } from "$lib/types/tabSetting";

const keisanValues: KeisanValue[] = [
  { label: "1桁", range: { min: 1, max: 9 }, allowDecimal: false },
  { label: "2桁", range: { min: 10, max: 99 }, allowDecimal: false },
  { label: "3桁", range: { min: 100, max: 999 }, allowDecimal: false },
  { label: "小数", range: { min: 0.1, max: 99.9 }, allowDecimal: true },
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
      allowDecimal: value.allowDecimal,
      operationType: type,
    })),
  }));

  const slotTabSettings: SlotTabSetting[] = [
    { index: 0, label: "[XXリスト]", title: "", path: "" },
    { index: 1, label: "[1問1答モード]", title: "", path: "" },
    { index: 2, label: "[テスト練習モード]", title: "", path: "" },
  ];

  return { keisanDataArray, slotTabSettings };
}
