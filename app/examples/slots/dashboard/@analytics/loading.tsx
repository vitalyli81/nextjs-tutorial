// @analytics/loading.tsx — shown only while this slot is loading.
// The @team slot is unaffected and keeps rendering normally.

export default function AnalyticsLoading() {
  return (
    <div className="animate-pulse space-y-3">
      <p className="text-[10px] font-mono text-zinc-400">@analytics/loading.tsx</p>
      <div className="grid grid-cols-2 gap-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-2.5 h-14" />
        ))}
      </div>
    </div>
  );
}
