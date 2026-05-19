// This is the parallel routes layout.
// Next.js passes each @slot folder as a prop automatically.
// The slot names match the folder names without the @ prefix.

import Link from "next/link";

export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children:  React.ReactNode;
  analytics: React.ReactNode;  // injected from @analytics/
  team:      React.ReactNode;  // injected from @team/
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top bar */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/examples/slots" className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            ← slots example
          </Link>
          <span className="text-zinc-200 dark:text-zinc-700">|</span>
          <p className="text-sm font-semibold text-zinc-800 dark:text-white">Dashboard</p>
        </div>
        <p className="text-xs text-zinc-400 font-mono">dashboard/layout.tsx</p>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* children slot — dashboard/page.tsx */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            children slot — dashboard/page.tsx
          </p>
          {children}
        </div>

        {/* two parallel slots */}
        <div className="grid sm:grid-cols-2 gap-4">
          {/* @analytics */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <p className="text-xs font-semibold text-blue-500">@analytics slot</p>
              <div className="flex gap-2 text-[10px] text-blue-400 font-mono">
                <Link href="/examples/slots/dashboard" className="hover:text-blue-600">overview</Link>
                <span>·</span>
                <Link href="/examples/slots/dashboard/analytics-detail" className="hover:text-blue-600">detail</Link>
              </div>
            </div>
            <div className="p-4">{analytics}</div>
          </div>

          {/* @team */}
          <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-zinc-900 overflow-hidden">
            <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-2 border-b border-purple-200 dark:border-purple-800 flex items-center justify-between">
              <p className="text-xs font-semibold text-purple-500">@team slot</p>
              <div className="flex gap-2 text-[10px] text-purple-400 font-mono">
                <Link href="/examples/slots/dashboard" className="hover:text-purple-600">overview</Link>
                <span>·</span>
                <Link href="/examples/slots/dashboard/team-detail" className="hover:text-purple-600">detail</Link>
              </div>
            </div>
            <div className="p-4">{team}</div>
          </div>
        </div>

        <p className="text-xs text-zinc-400 text-center">
          Clicking a tab above navigates to a sub-route — only that slot re-renders. The other slot keeps its current state.
        </p>
      </div>
    </div>
  );
}
