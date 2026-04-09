export const PREFECTURES = [
  {
    slug: "hokkaido",
    name: "홋카이도",
    svgId: "JP01"
  },
  {
    slug: "aomori",
    name: "아오모리",
    svgId: "JP02"
  },
  {
    slug: "iwate",
    name: "이와테",
    svgId: "JP03"
  },
  {
    slug: "miyagi",
    name: "미야기",
    svgId: "JP04"
  },
  {
    slug: "akita",
    name: "아키타",
    svgId: "JP05"
  },
  {
    slug: "yamagata",
    name: "야마가타",
    svgId: "JP06"
  },
  {
    slug: "fukushima",
    name: "후쿠시마",
    svgId: "JP07"
  },
  {
    slug: "ibaraki",
    name: "이바라키",
    svgId: "JP08"
  },
  {
    slug: "tochigi",
    name: "도치기",
    svgId: "JP09"
  },
  {
    slug: "gunma",
    name: "군마",
    svgId: "JP10"
  },
  {
    slug: "saitama",
    name: "사이타마",
    svgId: "JP11"
  },
  {
    slug: "chiba",
    name: "지바",
    svgId: "JP12"
  },
  {
    slug: "tokyo",
    name: "도쿄",
    svgId: "JP13"
  },
  {
    slug: "kanagawa",
    name: "가나가와",
    svgId: "JP14"
  },
  {
    slug: "niigata",
    name: "니가타",
    svgId: "JP15"
  },
  {
    slug: "toyama",
    name: "도야마",
    svgId: "JP16"
  },
  {
    slug: "ishikawa",
    name: "이시카와",
    svgId: "JP17"
  },
  {
    slug: "fukui",
    name: "후쿠이",
    svgId: "JP18"
  },
  {
    slug: "yamanashi",
    name: "야마나시",
    svgId: "JP19"
  },
  {
    slug: "nagano",
    name: "나가노",
    svgId: "JP20"
  },
  {
    slug: "gifu",
    name: "기후",
    svgId: "JP21"
  },
  {
    slug: "shizuoka",
    name: "시즈오카",
    svgId: "JP22"
  },
  {
    slug: "aichi",
    name: "아이치",
    svgId: "JP23"
  },
  {
    slug: "mie",
    name: "미에",
    svgId: "JP24"
  },
  {
    slug: "shiga",
    name: "시가",
    svgId: "JP25"
  },
  {
    slug: "kyoto",
    name: "교토",
    svgId: "JP26"
  },
  {
    slug: "osaka",
    name: "오사카",
    svgId: "JP27"
  },
  {
    slug: "hyogo",
    name: "효고",
    svgId: "JP28"
  },
  {
    slug: "nara",
    name: "나라",
    svgId: "JP29"
  },
  {
    slug: "wakayama",
    name: "와카야마",
    svgId: "JP30"
  },
  {
    slug: "tottori",
    name: "돗토리",
    svgId: "JP31"
  },
  {
    slug: "shimane",
    name: "시마네",
    svgId: "JP32"
  },
  {
    slug: "okayama",
    name: "오카야마",
    svgId: "JP33"
  },
  {
    slug: "hiroshima",
    name: "히로시마",
    svgId: "JP34"
  },
  {
    slug: "yamaguchi",
    name: "야마구치",
    svgId: "JP35"
  },
  {
    slug: "tokushima",
    name: "도쿠시마",
    svgId: "JP36"
  },
  {
    slug: "kagawa",
    name: "가가와",
    svgId: "JP37"
  },
  {
    slug: "ehime",
    name: "에히메",
    svgId: "JP38"
  },
  {
    slug: "kochi",
    name: "고치",
    svgId: "JP39"
  },
  {
    slug: "fukuoka",
    name: "후쿠오카",
    svgId: "JP40"
  },
  {
    slug: "saga",
    name: "사가",
    svgId: "JP41"
  },
  {
    slug: "nagasaki",
    name: "나가사키",
    svgId: "JP42"
  },
  {
    slug: "kumamoto",
    name: "구마모토",
    svgId: "JP43"
  },
  {
    slug: "oita",
    name: "오이타",
    svgId: "JP44"
  },
  {
    slug: "miyazaki",
    name: "미야자키",
    svgId: "JP45"
  },
  {
    slug: "kagoshima",
    name: "가고시마",
    svgId: "JP46"
  },
  {
    slug: "okinawa",
    name: "오키나와",
    svgId: "JP47"
  }
] as const;

export type PrefectureSlug = (typeof PREFECTURES)[number]["slug"];
export type PrefectureName = (typeof PREFECTURES)[number]["name"];
export type PrefectureMeta = (typeof PREFECTURES)[number];

export function getPrefectureBySlug(slug: string) {
  return PREFECTURES.find((prefecture) => prefecture.slug === slug);
}
