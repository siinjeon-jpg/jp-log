"use client";

import Image from "next/image";

import {
  JAPAN_MAP_ASSET_PATH,
  JAPAN_MAP_REGIONS,
  JAPAN_MAP_VIEW_BOX
} from "@/lib/japan-map-data";
import type { PrefectureName, PrefectureSlug } from "@/lib/prefectures";

type JapanMapBoardProps = {
  loading: boolean;
  visited: Record<PrefectureName, boolean>;
  onPrefectureSelect: (slug: PrefectureSlug) => void;
};

function getRegionColors(isVisited: boolean) {
  if (isVisited) {
    return {
      fill: "rgba(255,255,255,0.82)",
      stroke: "rgba(255,255,255,0.98)",
      label: "#ffffff",
      halo: "rgba(255,255,255,0.14)"
    };
  }

  return {
    fill: "rgba(39,39,42,0.56)",
    stroke: "rgba(113,113,122,0.88)",
    label: "#f4f4f5",
    halo: "rgba(255,255,255,0.05)"
  };
}

export function JapanMapBoard({
  loading,
  visited,
  onPrefectureSelect
}: JapanMapBoardProps) {
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
                dy="12"
                stdDeviation="10"
                floodColor="rgba(0,0,0,0.4)"
              />
            </filter>
          </defs>

          {JAPAN_MAP_REGIONS.map((region) => {
            const isVisited = visited[region.label];
            const colors = getRegionColors(isVisited);

            return (
              <g
                key={region.slug}
                role="link"
                tabIndex={loading ? -1 : 0}
                aria-label={`${region.label} ${isVisited ? "기록 보기" : "기록 남기기"}`}
                onClick={() => {
                  if (!loading) {
                    onPrefectureSelect(region.slug);
                  }
                }}
                onKeyDown={(event) => {
                  if ((event.key === "Enter" || event.key === " ") && !loading) {
                    event.preventDefault();
                    onPrefectureSelect(region.slug);
                  }
                }}
                className="cursor-pointer outline-none"
              >
                <use
                  href={`${JAPAN_MAP_ASSET_PATH}#${region.pathId}`}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="2"
                  filter="url(#prefectureGlow)"
                  className="transition-all duration-200"
                />
                <use
                  href={`${JAPAN_MAP_ASSET_PATH}#${region.pathId}`}
                  fill="none"
                  stroke={colors.halo}
                  strokeWidth="8"
                  opacity="0.9"
                />
                {region.labelLine ? (
                  <path
                    d={region.labelLine}
                    fill="none"
                    stroke="rgba(212,212,216,0.58)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                ) : null}
                <text
                  x={region.labelX}
                  y={region.labelY}
                  textAnchor={region.labelAnchor ?? "middle"}
                  fontSize="18"
                  fontWeight="700"
                  fill={colors.label}
                  stroke="rgba(9,9,11,0.95)"
                  strokeWidth="5"
                  paintOrder="stroke"
                >
                  {region.label}
                </text>
              </g>
            );
          })}
        </svg>
        </div>
      </div>

      <div className="mt-4 flex justify-center sm:mt-6">
        <div className="rounded-full border border-zinc-800 bg-black/40 px-4 py-2 text-xs text-zinc-500">
          밝게 표시된 지점은 방문 완료, 어두운 지점은 아직 기록 전입니다
        </div>
      </div>
    </div>
  );
}
