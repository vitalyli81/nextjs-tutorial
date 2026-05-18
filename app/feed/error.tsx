"use client";

// error.tsx — Next.js special file (must be a Client Component).
// Catches unhandled errors thrown inside this route segment, including errors
// from the async Feed RSC and from VirtualFeed's fetch calls.
// `reset` re-renders the segment so the user can retry without a full reload.

import { useEffect } from "react";

export default function FeedError({ error, reset }: { error: Error; reset: () => void }) {
  // Log to an error reporting service in production (e.g. Sentry).
  useEffect(() => {
    console.error("[FeedError]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold text-zinc-800 dark:text-white">Failed to load feed</h2>
      <p className="text-sm text-zinc-500">{error.message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-medium transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
