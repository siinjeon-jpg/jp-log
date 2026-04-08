import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center px-6">
        <h1 className="text-5xl font-bold mb-4">JP-Log</h1>
        <p className="text-lg text-zinc-300 mb-8">
          지도를 물들이며 완성하는 나만의 일본 여행기
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-full bg-white text-black px-6 py-3 font-medium"
          >
            시작하기
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-zinc-600 px-6 py-3 font-medium"
          >
            로그인
          </Link>
        </div>
      </div>
    </main>
  )
}