export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          Vyzora
        </h1>
        <p className="mt-3 text-lg text-gray-400">
          Analytics for developers and founders.
        </p>
      </div>

      <div className="flex gap-4">
        <a
          href="/login"
          className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          Get Started
        </a>
        <a
          href="/dashboard"
          className="rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-semibold text-gray-300 hover:bg-gray-800 transition-colors"
        >
          Dashboard
        </a>
      </div>

      <p className="text-xs text-gray-600">v0.1.0 — Scaffold phase</p>
    </main>
  );
}
