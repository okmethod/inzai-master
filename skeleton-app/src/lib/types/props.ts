import type { kanjiCsv } from "$lib/types/csv";

export interface KanjiDataProps {
  index: number;
  title: string;
  data: kanjiCsv[];
}
