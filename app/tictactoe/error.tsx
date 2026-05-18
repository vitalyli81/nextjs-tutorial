"use client";

// error.tsx — Next.js special file (must be a Client Component).
// Catches unhandled errors thrown anywhere inside the /tictactoe segment.
// `reset` re-renders the segment so the user can retry without a full reload.

import { useEffect } from "react";

export default function TicTacToeError({ error, reset }: { error: Error; reset: () => void }) {
  // Log to an error reporting service in production (e.g. Sentry).
  useEffect(() => {
    console.error("[TicTacToeError]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Something went wrong</h2>
      <p className="text-sm text-zinc-500">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
