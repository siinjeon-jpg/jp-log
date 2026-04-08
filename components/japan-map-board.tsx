"use client";

import {
  JAPAN_MAP_HOTSPOTS,
  JAPAN_SILHOUETTE_PATHS
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
      fill: "#f5f5f5",
      stroke: "rgba(255,255,255,0.9)",
      label: "#050505",
      helper: "rgba(5,5,5,0.62)",
      halo: "rgba(255,255,255,0.16)"
    };
  }

  return {
    fill: "rgba(32,32,36,0.96)",
    stroke: "rgba(113,113,122,0.95)",
    label: "#fafafa",
    helper: "#a1a1aa",
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

      <div className="relative">
        <svg
          viewBox="0 0 760 520"
          className="w-full"
          role="img"
          aria-label="일본 여행 지도"
        >
          <defs>
            <filter
              id="regionGlow"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feDropShadow
                dx="0"
                dy="12"
                stdDeviation="14"
                floodColor="rgba(0,0,0,0.28)"
              />
            </filter>
            <linearGradient id="boardGlow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.01)" />
            </linearGradient>
          </defs>

          <rect
            x="18"
            y="18"
            width="724"
            height="484"
            rx="26"
            fill="rgba(9,9,11,0.5)"
            stroke="rgba(63,63,70,0.75)"
          />
          <rect
            x="42"
            y="42"
            width="676"
            height="436"
            rx="22"
            fill="url(#boardGlow)"
            stroke="rgba(63,63,70,0.35)"
          />
          <path
            d="M510 140 L537 188 L563 214"
            fill="none"
            stroke="rgba(113,113,122,0.22)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M512 422 L548 438 L587 444"
            fill="none"
            stroke="rgba(113,113,122,0.22)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <path
            d={JAPAN_SILHOUETTE_PATHS.hokkaido}
            fill="rgba(42,42,47,0.82)"
            stroke="rgba(96,96,106,0.95)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d={JAPAN_SILHOUETTE_PATHS.honshu}
            fill="rgba(48,48,54,0.82)"
            stroke="rgba(96,96,106,0.95)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d={JAPAN_SILHOUETTE_PATHS.kyushu}
            fill="rgba(42,42,47,0.82)"
            stroke="rgba(96,96,106,0.95)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d={JAPAN_SILHOUETTE_PATHS.okinawa}
            fill="rgba(42,42,47,0.82)"
            stroke="rgba(96,96,106,0.95)"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {JAPAN_MAP_HOTSPOTS.map((region) => {
            const isVisited = visited[region.label];
            const colors = getRegionColors(isVisited);

            return (
              <g
                key={region.slug}
                role="link"
                tabIndex={loading ? -1 : 0}
                aria-pressed={isVisited}
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
                <circle
                  cx={region.cx}
                  cy={region.cy}
                  r={region.r + 10}
                  fill={colors.halo}
                />
                <circle
                  cx={region.cx}
                  cy={region.cy}
                  r={region.r}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="2.5"
                  filter="url(#regionGlow)"
                  className="transition-all duration-200"
                />
                {region.labelLine ? (
                  <path
                    d={region.labelLine}
                    fill="none"
                    stroke={isVisited ? colors.helper : "rgba(113,113,122,0.8)"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                ) : null}
                <text
                  x={region.labelX}
                  y={region.labelY}
                  textAnchor={region.labelAnchor ?? "middle"}
                  fontSize="16"
                  fontWeight="700"
                  fill={colors.label}
                >
                  {region.label}
                </text>
                <text
                  x={region.labelX}
                  y={region.labelY + 17}
                  textAnchor={region.labelAnchor ?? "middle"}
                  fontSize="10.5"
                  fill={colors.helper}
                >
                  {loading ? "불러오는 중" : isVisited ? "기록 보기" : "기록 남기기"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-4 flex justify-center sm:mt-6">
        <div className="rounded-full border border-zinc-800 bg-black/40 px-4 py-2 text-xs text-zinc-500">
          밝게 표시된 지점은 방문 완료, 어두운 지점은 아직 기록 전입니다
        </div>
      </div>
    </div>
  );
}
