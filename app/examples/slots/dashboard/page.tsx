// dashboard/page.tsx — the children slot.
// Rendered in the middle of the layout alongside both @slot panels.

export default function DashboardPage() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-zinc-800 dark:text-white">Welcome back</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          Both slots below load and render independently.
        </p>
      </div>
      <div className="text-xs font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded">
        dashboard/page.tsx
      </div>
    </div>
  );
}
