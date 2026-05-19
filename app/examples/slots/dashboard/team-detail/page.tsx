// team-detail/page.tsx — the children slot at /dashboard/team-detail.
// Navigating here triggers @team/detail/page.tsx in the team slot
// while @analytics/default.tsx keeps showing the analytics overview unchanged.

export default function TeamDetailPage() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold text-zinc-800 dark:text-white">Team — Detail</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
          The <span className="text-purple-500 font-medium">@team</span> slot loaded its detail view.
          The <span className="text-blue-500 font-medium">@analytics</span> slot is unchanged.
        </p>
      </div>
      <div className="text-xs font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded">
        team-detail/page.tsx
      </div>
    </div>
  );
}
