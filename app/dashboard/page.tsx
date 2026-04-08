"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { JapanMapBoard } from "@/components/japan-map-board";
import { PREFECTURES, type PrefectureName } from "@/lib/prefectures";
import { supabase } from "@/lib/supabase";

type VisitedState = Record<PrefectureName, boolean>;
type DashboardMessage = {
  type: "info" | "error";
  text: string;
} | null;

function createInitialVisitedState(): VisitedState {
  const state = {} as VisitedState;

  for (const prefecture of PREFECTURES) {
    state[prefecture.name] = false;
  }

  return state;
}

function mapPrefectureError(message: string) {
  if (message.includes("relation") && message.includes("visited_prefectures")) {
    return "방문 지역 테이블이 아직 없습니다. 프로젝트의 supabase/visited_prefectures.sql을 Supabase SQL Editor에서 먼저 실행해 주세요.";
  }

  return `방문 지역 정보를 불러오거나 저장하는 중 문제가 발생했습니다: ${message}`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [visited, setVisited] = useState<VisitedState>(createInitialVisitedState);
  const [message, setMessage] = useState<DashboardMessage>(null);

  useEffect(() => {
    let ignore = false;

    async function loadSession() {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data, error } = await supabase
        .from("visited_prefectures")
        .select("prefecture, visited")
        .eq("user_id", session.user.id);

      if (error) {
        if (!ignore) {
          setMessage({
            type: "error",
            text: mapPrefectureError(error.message)
          });
          setLoading(false);
        }
        return;
      }

      const nextVisited = createInitialVisitedState();

      for (const row of data ?? []) {
        const prefecture = row.prefecture as PrefectureName;

        if (prefecture in nextVisited) {
          nextVisited[prefecture] = Boolean(row.visited);
        }
      }

      if (!ignore) {
        setVisited(nextVisited);
        setLoading(false);
      }
    }

    void loadSession();

    return () => {
      ignore = true;
    };
  }, [router]);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  const visitedCount = Object.values(visited).filter(Boolean).length;
  const progress = Math.round((visitedCount / PREFECTURES.length) * 100);

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">JP-Log</p>
            <h1 className="mt-4 text-4xl font-semibold">JP-Log 대시보드</h1>
            <p className="mt-3 text-zinc-400">
              내가 방문한 일본 지역을 기록해보자
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loading || loggingOut}
            className="rounded-2xl border border-zinc-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? "로그아웃 중..." : "로그아웃"}
          </button>
        </div>

        <div className="mt-10 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm text-zinc-400">진행 현황</p>
              <p className="mt-2 text-2xl font-semibold">
                방문 {visitedCount} / {PREFECTURES.length}
              </p>
            </div>
            <p className="text-sm text-zinc-400">{progress}% 완료</p>
          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {message ? (
          <p
            className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
              message.type === "error"
                ? "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                : "border border-zinc-700 bg-zinc-900 text-zinc-300"
            }`}
          >
            {message.text}
          </p>
        ) : null}

        <div className="mt-10">
          <div className="mb-5">
            <p className="text-lg font-semibold text-white">일본 여행 지도</p>
            <p className="mt-2 text-sm text-zinc-400">
              방문한 지역을 색으로 채워보자
            </p>
          </div>

          <JapanMapBoard
            loading={loading}
            visited={visited}
            onPrefectureSelect={(slug) => {
              router.push(`/prefectures/${slug}`);
            }}
          />
        </div>
      </section>
    </main>
  );
}
