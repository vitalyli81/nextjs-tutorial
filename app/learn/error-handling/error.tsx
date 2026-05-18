// error.tsx — Next.js file convention for route-level error UI.
//
// HOW IT WORKS:
//   Next.js wraps the sibling page.tsx in a React error boundary and uses
//   this component as the fallback UI when an unhandled error is thrown.
//
// REQUIRED: "use client"
//   React error boundaries must be Client Components — they rely on client-side
//   JS to intercept errors during rendering and enable recovery via reset().
//
// PROPS (injected automatically by Next.js):
//   error — the Error object that was thrown (may include a digest for server logs)
//   reset — calling this re-renders the route segment, giving the user a retry
//
// SCOPE:
//   This error.tsx catches errors thrown by the sibling page.tsx and any of
//   its descendant components. It does NOT catch errors in layout.tsx — those
//   bubble up to a parent error.tsx (or global-error.tsx).

"use client";

export default function ErrorHandlingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }; // digest = server-generated ID for cross-referencing server logs
  reset: () => void;                  // re-renders the segment without a full page reload
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6 space-y-3">
        {/* Visual label so it's obvious this is the error.tsx UI, not a real crash */}
        <p className="text-xs font-semibold text-red-400 uppercase tracking-wider">error.tsx caught this</p>
        <p className="text-lg font-bold text-red-700 dark:text-red-300">Something went wrong!</p>
        {/* Show the error message — in production, avoid leaking internal details */}
        <p className="text-sm text-red-600 dark:text-red-400 font-mono bg-red-100 dark:bg-red-900/30 px-3 py-2 rounded">
          {error.message}
        </p>
        {/* reset() asks Next.js to re-render the route segment — no page reload */}
        <button
          onClick={reset}
          className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-medium transition-colors"
        >
          Reset (calls reset() to re-render the segment)
        </button>
      </div>
    </div>
  );
}
