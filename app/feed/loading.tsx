export default function FeedLoading() {
  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center pt-20 pb-10 px-4">
      <div className="w-full max-w-2xl">
        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-700 rounded-lg mb-2 animate-pulse" />
        <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-700 rounded mb-8 animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-800 rounded-xl p-4 space-y-2 animate-pulse">
              <div className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-full" />
              <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
