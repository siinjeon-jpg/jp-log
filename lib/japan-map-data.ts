import type { PrefectureName, PrefectureSlug } from "@/lib/prefectures";

export type JapanMapLabelAnchor = "start" | "middle" | "end";

export type JapanMapRegion = {
  slug: PrefectureSlug;
  label: PrefectureName;
  pathId: string;
  labelX: number;
  labelY: number;
  labelAnchor?: JapanMapLabelAnchor;
  labelLine?: string;
};

export const JAPAN_MAP_ASSET_PATH = "/maps/jp.svg";
export const JAPAN_MAP_VIEW_BOX = "0 0 1000 846";

export const JAPAN_MAP_REGIONS: JapanMapRegion[] = [
  {
    slug: "hokkaido",
    label: "홋카이도",
    pathId: "JP01",
    labelX: 704,
    labelY: 98,
    labelAnchor: "start",
    labelLine: "M626 123 L690 104"
  },
  {
    slug: "tokyo",
    label: "도쿄",
    pathId: "JP13",
    labelX: 594,
    labelY: 395,
    labelAnchor: "start",
    labelLine: "M527 420 L582 400"
  },
  {
    slug: "kyoto",
    label: "교토",
    pathId: "JP26",
    labelX: 360,
    labelY: 425,
    labelAnchor: "end",
    labelLine: "M416 438 L369 427"
  },
  {
    slug: "osaka",
    label: "오사카",
    pathId: "JP27",
    labelX: 362,
    labelY: 479,
    labelAnchor: "end",
    labelLine: "M414 458 L370 472"
  },
  {
    slug: "fukuoka",
    label: "후쿠오카",
    pathId: "JP40",
    labelX: 216,
    labelY: 489,
    labelAnchor: "end",
    labelLine: "M273 493 L225 489"
  },
  {
    slug: "okinawa",
    label: "오키나와",
    pathId: "JP47",
    labelX: 232,
    labelY: 788,
    labelAnchor: "start",
    labelLine: "M196 730 L222 775"
  }
];
