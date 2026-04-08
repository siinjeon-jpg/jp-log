"use client";

import { type FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "signup";
type MessageState = {
  type: "success" | "error";
  text: string;
} | null;

function mapAuthErrorMessage(message: string) {
  switch (message) {
    case "Invalid login credentials":
      return "이메일 또는 비밀번호를 다시 확인해 주세요.";
    case "User already registered":
      return "이미 가입된 이메일입니다. 로그인으로 진행해 주세요.";
    case "Password should be at least 6 characters":
      return "비밀번호는 6자 이상으로 입력해 주세요.";
    default:
      return `인증 중 문제가 발생했습니다: ${message}`;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>(null);

  useEffect(() => {
    let ignore = false;

    async function checkSession() {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!ignore && session) {
        router.replace("/dashboard");
      }
    }

    void checkSession();

    return () => {
      ignore = true;
    };
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!email || !password) {
      setMessage({
        type: "error",
        text: "이메일과 비밀번호를 모두 입력해 주세요."
      });
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        setMessage({
          type: "error",
          text: mapAuthErrorMessage(error.message)
        });
        setLoading(false);
        return;
      }

      setMessage({
        type: "success",
        text: "로그인에 성공했습니다. 대시보드로 이동합니다."
      });
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      setMessage({
        type: "error",
        text: mapAuthErrorMessage(error.message)
      });
      setLoading(false);
      return;
    }

    if (data.session) {
      setMessage({
        type: "success",
        text: "회원가입이 완료되었습니다. 대시보드로 이동합니다."
      });
      router.replace("/dashboard");
      router.refresh();
      return;
    }

    setMessage({
      type: "success",
      text: "회원가입이 완료되었습니다. 이메일 인증 후 로그인해 주세요."
    });
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 py-16 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl shadow-black/30">
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">JP-Log</p>
          <h1 className="mt-3 text-3xl font-semibold">
            {mode === "login" ? "로그인" : "회원가입"}
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {mode === "login"
              ? "이미 계정이 있다면 로그인해서 여행 기록을 이어가세요."
              : "처음이라면 간단하게 계정을 만들고 JP-Log를 시작해 보세요."}
          </p>
        </div>

        <div className="mb-6 grid grid-cols-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage(null);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              mode === "login"
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setMessage(null);
            }}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              mode === "signup"
                ? "bg-white text-black"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            회원가입
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">이메일</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-zinc-600"
              autoComplete="email"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm text-zinc-400">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="6자 이상 입력"
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-zinc-600"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={6}
              required
            />
          </label>

          {message ? (
            <p
              className={`rounded-2xl px-4 py-3 text-sm ${
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
            disabled={loading}
            className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? mode === "login"
                ? "로그인 중..."
                : "회원가입 중..."
              : mode === "login"
                ? "로그인"
                : "회원가입"}
          </button>
        </form>
      </section>
    </main>
  );
}
