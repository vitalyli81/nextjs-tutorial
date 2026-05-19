// @team/loading.tsx — shown only while this slot is loading.
// The @analytics slot is unaffected.

export default function TeamLoading() {
  return (
    <div className="animate-pulse space-y-3">
      <p className="text-[10px] font-mono text-zinc-400">@team/loading.tsx</p>
      {[1, 2, 3].map(i => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-2.5 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
            <div className="h-2 bg-zinc-100 dark:bg-zinc-800 rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
