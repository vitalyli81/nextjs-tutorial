// analytics-detail/page.tsx — the children slot at /dashboard/analytics-detail.
// Navigating here triggers @analytics/detail/page.tsx in the analytics slot
// while @team/default.tsx keeps showing the team overview unchanged.

export default function AnalyticsDetailPage() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-zinc-800 dark:text-white">Analytics — Detail</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          The <span className="text-blue-500 font-medium">@analytics</span> slot loaded its detail view.
          The <span className="text-purple-500 font-medium">@team</span> slot is unchanged.
        </p>
      </div>
      <div className="text-xs font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded">
        analytics-detail/page.tsx
      </div>
    </div>
  );
}
