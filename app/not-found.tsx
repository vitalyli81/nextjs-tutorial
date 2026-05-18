import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-100 dark:bg-zinc-900">
      <h1 className="text-6xl font-bold text-zinc-800 dark:text-white">404</h1>
      <p className="text-zinc-500 dark:text-zinc-400">This page does not exist.</p>
      <Link
        href="/"
        className="rounded-lg bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-white text-white dark:text-zinc-900 px-5 py-2 text-sm font-medium transition-colors"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
