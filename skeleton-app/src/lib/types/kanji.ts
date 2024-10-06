export interface KanjiCsv {
  id: number;
  kanji: string;
  yomi: string;
}

export interface KanjiData {
  index: number;
  title: string;
  data: KanjiCsv[];
}

export type KanjiMode = "yomi" | "kaki";
