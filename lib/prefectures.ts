export const PREFECTURES = [
  {
    slug: "hokkaido",
    name: "홋카이도"
  },
  {
    slug: "tokyo",
    name: "도쿄"
  },
  {
    slug: "osaka",
    name: "오사카"
  },
  {
    slug: "kyoto",
    name: "교토"
  },
  {
    slug: "fukuoka",
    name: "후쿠오카"
  },
  {
    slug: "okinawa",
    name: "오키나와"
  }
] as const;

export type PrefectureSlug = (typeof PREFECTURES)[number]["slug"];
export type PrefectureName = (typeof PREFECTURES)[number]["name"];
export type PrefectureMeta = (typeof PREFECTURES)[number];

export function getPrefectureBySlug(slug: string) {
  return PREFECTURES.find((prefecture) => prefecture.slug === slug);
}
