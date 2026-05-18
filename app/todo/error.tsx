"use client";

// error.tsx — Next.js special file (must be a Client Component).
// Catches unhandled errors thrown anywhere inside the /todo segment.
// Because the todo app uses Zustand (no async RSC data), errors here are
// unlikely in normal use but guard against unexpected runtime failures.
// `reset` re-renders the segment so the user can retry without a full reload.

import { useEffect } from "react";

export default function TodoError({ error, reset }: { error: Error; reset: () => void }) {
  // Log to an error reporting service in production (e.g. Sentry).
  useEffect(() => {
    console.error("[TodoError]", error);
  }, [error]);

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
