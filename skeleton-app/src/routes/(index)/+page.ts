import type { TransitionContent, TransitionButtonConfig } from "$lib/utils/transitions";
import { generateButtonConfigs } from "$lib/utils/transitions";
// import { GITHUB_REPO_URL } from "$lib/constants/common";

const contentLinks: TransitionContent[] = [
  {
    label: "漢字マスタードリル",
    symbolSrc: { type: "icon", key: "mdi:book" },
    action: "navigate",
    target: "/kanji",
  },
  {
    label: "計算マスタードリル",
    symbolSrc: { type: "icon", key: "mdi:book" },
    action: "navigate",
    target: "/keisan",
  },
  {
    label: "都道府県マスタードリル",
    symbolSrc: { type: "icon", key: "mdi:book" },
    action: "navigate",
    target: "/prefectures",
  },
  /**{
    label: "ソースコード",
    symbolSrc: { type: "icon", key: "mdi:source-repository" },
    action: "redirectNewTab",
    target: GITHUB_REPO_URL,
  },**/
];

export async function load(): Promise<{ buttonConfigs: TransitionButtonConfig[] }> {
  const buttonConfigs = generateButtonConfigs(contentLinks);

  return { buttonConfigs };
}
