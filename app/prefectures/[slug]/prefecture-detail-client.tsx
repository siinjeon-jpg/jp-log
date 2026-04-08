"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type { PrefectureMeta } from "@/lib/prefectures";
import { supabase } from "@/lib/supabase";

type DetailMessage = {
  type: "success" | "error";
  text: string;
} | null;

function mapDetailErrorMessage(message: string) {
  if (message.includes("relation") && message.includes("prefecture_journals")) {
    return "저널 테이블이 아직 없습니다. supabase/prefecture_journals.sql을 Supabase SQL Editor에서 먼저 실행해 주세요.";
  }

  if (message.includes("relation") && message.includes("visited_prefectures")) {
    return "방문 지역 테이블이 아직 없습니다. supabase/visited_prefectures.sql을 먼저 실행해 주세요.";
  }

  return `저장 중 문제가 발생했습니다: ${message}`;
}

export function PrefectureDetailClient({
  prefecture
}: {
  prefecture: PrefectureMeta;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingVisited, setTogglingVisited] = useState(false);
  const [visited, setVisited] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [message, setMessage] = useState<DetailMessage>(null);

  useEffect(() => {
    let ignore = false;

    async function loadPrefectureDetail() {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const [visitedResult, journalResult] = await Promise.all([
        supabase
          .from("visited_prefectures")
          .select("visited")
          .eq("user_id", session.user.id)
          .eq("prefecture", prefecture.name)
          .maybeSingle(),
        supabase
          .from("prefecture_journals")
          .select("title, content, visit_date")
          .eq("user_id", session.user.id)
          .eq("prefecture_slug", prefecture.slug)
          .maybeSingle()
      ]);

      if (visitedResult.error) {
        if (!ignore) {
          setMessage({
            type: "error",
            text: mapDetailErrorMessage(visitedResult.error.message)
          });
          setLoading(false);
        }
        return;
      }

      if (journalResult.error) {
        if (!ignore) {
          setMessage({
            type: "error",
            text: mapDetailErrorMessage(journalResult.error.message)
          });
          setLoading(false);
        }
        return;
      }

      if (!ignore) {
        setVisited(Boolean(visitedResult.data?.visited));
        setTitle(journalResult.data?.title ?? "");
        setContent(journalResult.data?.content ?? "");
        setVisitDate(journalResult.data?.visit_date ?? "");
        setLoading(false);
      }
    }

    void loadPrefectureDetail();

    return () => {
      ignore = true;
    };
  }, [prefecture.name, prefecture.slug, router]);

  async function handleVisitedToggle() {
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    const nextVisited = !visited;

    setTogglingVisited(true);
    setMessage(null);

    const { error } = await supabase.from("visited_prefectures").upsert(
      {
        user_id: session.user.id,
        prefecture: prefecture.name,
        visited: nextVisited,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: "user_id,prefecture"
      }
    );

    if (error) {
      setMessage({
        type: "error",
        text: mapDetailErrorMessage(error.message)
      });
      setTogglingVisited(false);
      return;
    }

    setVisited(nextVisited);
    setTogglingVisited(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setMessage({
        type: "error",
        text: "제목을 입력해 주세요."
      });
      return;
    }

    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/login");
      return;
    }

    setSaving(true);
    setMessage(null);

    const { error } = await supabase.from("prefecture_journals").upsert(
      {
        user_id: session.user.id,
        prefecture_slug: prefecture.slug,
        title: trimmedTitle,
        content: trimmedContent,
        visit_date: visitDate || null,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: "user_id,prefecture_slug"
      }
    );

    if (error) {
      setMessage({
        type: "error",
        text: mapDetailErrorMessage(error.message)
      });
      setSaving(false);
      return;
    }

    setMessage({
      type: "success",
      text: "저널이 저장되었습니다."
    });
    setSaving(false);
  }

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <section className="mx-auto w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl shadow-black/30">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              ← 대시보드로 돌아가기
            </Link>
            <p className="mt-6 text-sm uppercase tracking-[0.3em] text-zinc-500">
              JP-Log Journal
            </p>
            <h1 className="mt-3 text-4xl font-semibold">{prefecture.name}</h1>
            <p className="mt-3 text-zinc-400">
              이 지역에서 남기고 싶은 여행 기록을 적어보세요.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-3 text-sm">
            <p className="text-zinc-500">방문 상태</p>
            <p className="mt-1 font-medium text-white">
              {loading ? "불러오는 중..." : visited ? "방문 완료" : "아직 방문 전"}
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold">방문 체크</p>
              <p className="mt-2 text-sm text-zinc-400">
                이 지역을 실제로 방문했다면 상태를 바꿔둘 수 있어요.
              </p>
            </div>

            <button
              type="button"
              onClick={handleVisitedToggle}
              disabled={loading || togglingVisited}
              className={`rounded-2xl px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 ${
                visited
                  ? "bg-white text-black hover:bg-zinc-200"
                  : "border border-zinc-700 bg-zinc-950 text-white hover:bg-zinc-900"
              }`}
            >
              {togglingVisited
                ? "변경 중..."
                : visited
                  ? "방문 완료로 표시됨"
                  : "방문 완료로 표시하기"}
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-6"
        >
          <div>
            <p className="text-lg font-semibold">여행 저널</p>
            <p className="mt-2 text-sm text-zinc-400">
              간단한 제목과 메모, 방문 날짜를 기록해 둘 수 있습니다.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">제목</span>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={`${prefecture.name}에서 남길 기록 제목`}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-zinc-600"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">메모 / 내용</span>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="좋았던 장소, 기억에 남는 순간, 다시 가고 싶은 이유 등을 적어보세요."
                className="min-h-40 w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-zinc-600"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-zinc-400">방문 날짜</span>
              <input
                type="date"
                value={visitDate}
                onChange={(event) => setVisitDate(event.target.value)}
                className="w-full rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-zinc-600"
              />
            </label>
          </div>

          {message ? (
            <p
              className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                message.type === "success"
                  ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
              }`}
            >
              {message.text}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || saving}
            className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "저장 중..." : "저널 저장"}
          </button>
        </form>
      </section>
    </main>
  );
}
