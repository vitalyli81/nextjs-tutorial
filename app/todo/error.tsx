"use client";

export default function TodoError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Something went wrong</h2>
      <p className="text-sm text-zinc-500">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
