import { notFound } from "next/navigation";

import { PREFECTURES, getPrefectureBySlug } from "@/lib/prefectures";

import { PrefectureDetailClient } from "./prefecture-detail-client";

export function generateStaticParams() {
  return PREFECTURES.map((prefecture) => ({
    slug: prefecture.slug
  }));
}

export default async function PrefecturePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const prefecture = getPrefectureBySlug(slug);

  if (!prefecture) {
    notFound();
  }

  return <PrefectureDetailClient prefecture={prefecture} />;
}
