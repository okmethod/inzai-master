import type { KeisanData } from "$lib/types/keisan";
import { keisanValues, OperationType } from "$lib/internal/keisan";
import type { SlotTabSetting } from "$lib/types/tabSetting";

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
