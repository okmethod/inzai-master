export const regions = ["北海道", "東北", "関東", "中部", "近畿", "中国", "四国", "九州"] as const;
export type Region = (typeof regions)[number];

export interface PrefectureData {
  index: number;
  name: string;
  region: Region;
  imagePath: string;
}

export interface RegionData {
  index: number;
  name: string;
  prefectures: PrefectureData[];
}
