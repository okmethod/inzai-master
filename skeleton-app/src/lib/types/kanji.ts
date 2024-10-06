export interface KanjiQuestion {
  id: number;
  kanji: string;
  yomi: string;
}

export interface KanjiData {
  index: number;
  title: string;
  data: KanjiQuestion[];
}

export type KanjiMode = "yomi" | "kaki";
