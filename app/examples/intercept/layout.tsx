// Root layout for the intercept example.
// Receives the @modal slot as a prop — when a photo is clicked from the grid,
// Next.js renders the (.)photos/[id]/page.tsx here instead of navigating away.
// On direct navigation to /examples/intercept/photos/[id], @modal gets default.tsx (null).

import Link from "next/link";

export default function InterceptLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal:    React.ReactNode; // injected from @modal/
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/examples/intercept" className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            ← intercept example
          </Link>
          <span className="text-zinc-200 dark:text-zinc-700">|</span>
          <p className="text-sm font-semibold text-zinc-800 dark:text-white">Photos</p>
        </div>
        <p className="text-xs text-zinc-400 font-mono">intercept/layout.tsx — renders children + @modal</p>
      </header>

      {/* children = the grid page or the full photo page */}
      {children}

      {/* modal = null (default.tsx) normally, or the intercepted photo on click */}
      {modal}
    </div>
  );
}
