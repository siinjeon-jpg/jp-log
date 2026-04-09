"use client";

import Image from "next/image";
import { useState } from "react";

import {
  JAPAN_MAP_ASSET_PATH,
  JAPAN_MAP_VIEW_BOX
} from "@/lib/japan-map-data";
import {
  PREFECTURES,
  getPrefectureBySlug,
  type PrefectureMeta,
  type PrefectureName,
  type PrefectureSlug
} from "@/lib/prefectures";

type JapanMapBoardProps = {
  loading: boolean;
  visited: Record<PrefectureName, boolean>;
  onPrefectureSelect: (slug: PrefectureSlug) => void;
};

function getPrefectureColors(isVisited: boolean, isActive: boolean) {
  if (isVisited) {
    return {
      fill: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.84)",
      stroke: "rgba(255,255,255,0.98)",
      halo: isActive ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.12)"
    };
  }

  if (isActive) {
    return {
      fill: "rgba(63,63,70,0.82)",
      stroke: "rgba(228,228,231,0.82)",
      halo: "rgba(255,255,255,0.08)"
    };
  }

  return {
    fill: "rgba(24,24,27,0.32)",
    stroke: "rgba(113,113,122,0.62)",
    halo: "rgba(255,255,255,0.04)"
  };
}

function getHoveredText(prefecture: PrefectureMeta | null, isVisited: boolean | null) {
  if (!prefecture) {
    return "마우스를 올리면 지역 이름이 보이고, 클릭하면 여행 기록 페이지로 이동합니다";
  }

  return `${prefecture.name} · ${isVisited ? "방문 완료" : "아직 기록 전"}`;
}

export function JapanMapBoard({
  loading,
  visited,
  onPrefectureSelect
}: JapanMapBoardProps) {
  const [hoveredSlug, setHoveredSlug] = useState<PrefectureSlug | null>(null);

  const hoveredPrefecture = hoveredSlug ? getPrefectureBySlug(hoveredSlug) : null;
  const hoveredVisited = hoveredPrefecture
    ? visited[hoveredPrefecture.name]
    : null;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_22rem)]" />

      <div className="relative overflow-hidden rounded-[1.5rem] border border-zinc-800/80 bg-black/30">
        <div className="relative aspect-[1000/846] w-full">
          <Image
            src={JAPAN_MAP_ASSET_PATH}
            alt=""
            fill
            priority
            className="pointer-events-none select-none object-contain"
          />

          <svg
            viewBox={JAPAN_MAP_VIEW_BOX}
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="일본 여행 지도"
          >
            <defs>
              <filter
                id="prefectureGlow"
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
              >
                <feDropShadow
                  dx="0"
                  dy="10"
                  stdDeviation="8"
                  floodColor="rgba(0,0,0,0.42)"
                />
              </filter>
            </defs>

            {PREFECTURES.map((prefecture) => {
              const isVisited = visited[prefecture.name];
              const isActive = hoveredSlug === prefecture.slug;
              const colors = getPrefectureColors(isVisited, isActive);
              const statusText = loading
                ? "불러오는 중"
                : isVisited
                  ? "방문 완료"
                  : "아직 기록 전";

              return (
                <g
                  key={prefecture.slug}
                  role="link"
                  tabIndex={loading ? -1 : 0}
                  aria-label={`${prefecture.name} ${statusText}`}
                  onMouseEnter={() => setHoveredSlug(prefecture.slug)}
                  onMouseLeave={() => {
                    setHoveredSlug((current) =>
                      current === prefecture.slug ? null : current
                    );
                  }}
                  onFocus={() => setHoveredSlug(prefecture.slug)}
                  onBlur={() => {
                    setHoveredSlug((current) =>
                      current === prefecture.slug ? null : current
                    );
                  }}
                  onClick={() => {
                    if (!loading) {
                      onPrefectureSelect(prefecture.slug);
                    }
                  }}
                  onKeyDown={(event) => {
                    if ((event.key === "Enter" || event.key === " ") && !loading) {
                      event.preventDefault();
                      onPrefectureSelect(prefecture.slug);
                    }
                  }}
                  className="cursor-pointer outline-none"
                >
                  <title>{prefecture.name}</title>

                  {isVisited || isActive ? (
                    <use
                      href={`${JAPAN_MAP_ASSET_PATH}#${prefecture.svgId}`}
                      fill="none"
                      stroke={colors.halo}
                      strokeWidth={isActive ? "6" : "4"}
                      opacity="0.95"
                    />
                  ) : null}

                  <use
                    href={`${JAPAN_MAP_ASSET_PATH}#${prefecture.svgId}`}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={isActive ? "1.8" : "1.1"}
                    filter={isVisited || isActive ? "url(#prefectureGlow)" : undefined}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-full border border-zinc-800 bg-black/40 px-4 py-2 text-xs text-zinc-500">
          밝게 표시된 지역은 방문 완료입니다
        </div>
        <div className="rounded-full border border-zinc-800 bg-black/40 px-4 py-2 text-xs text-zinc-400">
          {getHoveredText(hoveredPrefecture ?? null, hoveredVisited)}
        </div>
      </div>
    </div>
  );
}
