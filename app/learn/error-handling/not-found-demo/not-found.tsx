// not-found.tsx — Next.js file convention for custom 404 UI.
//
// HOW IT WORKS:
//   When notFound() is called anywhere in this route segment (or its children),
//   Next.js renders this component instead of the page.
//   The response automatically receives HTTP status 404.
//
// FILE CONVENTION:
//   • Must be named exactly "not-found.tsx" (or .js / .jsx)
//   • Lives next to the page.tsx that calls notFound(), or anywhere above it
//   • The NEAREST not-found.tsx in the route hierarchy wins
//   • Does NOT need "use client" — it's a regular Server Component
//
// DIFFERENCE FROM error.tsx:
//   • not-found.tsx is for expected missing resources (404) — no "use client" needed
//   • error.tsx is for unexpected runtime errors — MUST be "use client"

import Link from "next/link";

export default function DemoNotFound() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-6 space-y-3">
        {/* Visual label showing which file handled this */}
        <p className="text-xs font-semibold text-yellow-500 uppercase tracking-wider">not-found.tsx</p>
        <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">404 — Route not found</p>
        <p className="text-sm text-yellow-600 dark:text-yellow-400">
          The page called{" "}
          {/* notFound() from next/navigation — throws internally, halts rendering */}
          <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">notFound()</code> from{" "}
          <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">next/navigation</code>,
          which rendered this{" "}
          <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1 rounded">not-found.tsx</code> file.
          The response has HTTP status 404.
        </p>
        {/* Link back to the chapter — next/link for client-side navigation */}
        <Link href="/learn/error-handling" className="inline-block text-sm text-blue-500 hover:underline">
          ← Back to chapter
        </Link>
      </div>
    </div>
  );
}
