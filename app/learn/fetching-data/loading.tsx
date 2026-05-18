// loading.tsx — Next.js file convention for route-level loading UI.
//
// HOW IT WORKS:
//   Next.js automatically wraps page.tsx in a <Suspense> boundary and uses
//   this file as the fallback. When a user navigates to /learn/fetching-data,
//   this skeleton renders immediately while page.tsx awaits its async data.
//
// FILE CONVENTION:
//   • Must be named exactly "loading.tsx" (or .js / .jsx)
//   • Lives next to the page.tsx it covers
//   • Exports a default React component (no special props)
//   • Can be a Server Component — no "use client" needed
//
// BONUS: loading.tsx also enables PARTIAL PREFETCH for dynamic routes.
//   When a <Link> to this page enters the viewport, Next.js prefetches
//   the layout + this skeleton. The user sees the shell instantly on click
//   even before the data arrives.
//
// Navigate away from this chapter and back to see this skeleton fire.

export default function FetchingLoading() {
  return (
    // animate-pulse: Tailwind utility that fades the opacity in/out
    // — the standard skeleton loading animation
    <div className="max-w-3xl mx-auto animate-pulse space-y-6 pt-4">

      {/* Fake chapter title bar */}
      <div className="h-6 bg-zinc-200 dark:bg-zinc-700 rounded w-48" />

      {/* Three fake Demo card skeletons — mirrors the real page structure */}
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden"
        >
          {/* Fake Demo card header */}
          <div className="h-12 bg-zinc-100 dark:bg-zinc-800" />
          {/* Fake Demo card body — two lines of varying width */}
          <div className="p-5 space-y-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
            <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
