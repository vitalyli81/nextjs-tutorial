// RouterDemo — live demonstration of useRouter, usePathname, useSearchParams.
//
// WHY "use client"?
//   All three navigation hooks are client-only — they read from the browser's
//   router state. This component must be a Client Component.
//
// WHY wrapped in <Suspense> in the parent page?
//   useSearchParams() causes Next.js to mark the component as "dynamic" (it
//   reads URL state at runtime). Without a <Suspense> boundary the ENTIRE page
//   would be forced into client-side rendering. Wrapping in <Suspense> isolates
//   the dynamic part so the rest of the page can still be statically rendered.

"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export function RouterDemo() {
  // useRouter — gives access to push(), replace(), back(), refresh()
  const router = useRouter();

  // usePathname — the current URL path, e.g. "/learn/linking-and-navigating"
  // Re-renders this component on every route change.
  const pathname = usePathname();

  // useSearchParams — read-only view of ?key=value query params
  // Returns a URLSearchParams-like object.
  const searchParams = useSearchParams();

  return (
    <div className="space-y-4">
      {/* Live readout — shows current pathname and search params */}
      <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 font-mono text-xs space-y-1">
        <p>
          <span className="text-purple-500">usePathname()</span>
          {" = "}
          <span className="text-green-600 dark:text-green-400">&quot;{pathname}&quot;</span>
        </p>
        <p>
          <span className="text-purple-500">useSearchParams()</span>
          {" = "}
          {/* .toString() returns the full query string, e.g. "tab=one" */}
          <span className="text-green-600 dark:text-green-400">
            &quot;{searchParams.toString() || "(empty)"}&quot;
          </span>
        </p>
      </div>

      {/* Buttons that trigger each router method */}
      <div className="flex flex-wrap gap-2">
        {/* push — navigates and adds a new history entry (can go back) */}
        <button
          onClick={() => router.push("/learn/linking-and-navigating?tab=one")}
          className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1.5 transition-colors"
        >
          router.push(?tab=one)
        </button>

        {/* replace — navigates but REPLACES the current history entry (can't go back) */}
        <button
          onClick={() => router.replace("/learn/linking-and-navigating?tab=two")}
          className="rounded-lg bg-purple-500 hover:bg-purple-600 text-white text-sm px-3 py-1.5 transition-colors"
        >
          router.replace(?tab=two)
        </button>

        {/* back — same as clicking the browser's back button */}
        <button
          onClick={() => router.back()}
          className="rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-200 text-sm px-3 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
        >
          router.back()
        </button>
      </div>

      {/* Key distinction between push and replace */}
      <p className="text-xs text-zinc-400">
        <strong>push()</strong> adds to history — the back button works.{" "}
        <strong>replace()</strong> overwrites the current entry — back goes further up.
      </p>
    </div>
  );
}
