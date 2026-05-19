// photos/page.tsx — the grid.
// Clicking a photo navigates to /examples/intercept/photos/[id].
// Because @modal/(.)photos/[id]/page.tsx exists, Next.js intercepts
// that navigation and renders it in the @modal slot instead of replacing this page.

import Link from "next/link";

const photos = [
  { id: 1, title: "Mountain sunrise",  emoji: "🏔️",  color: "bg-orange-100 dark:bg-orange-900/40 border-orange-200 dark:border-orange-800" },
  { id: 2, title: "Ocean at dusk",     emoji: "🌊",  color: "bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800"         },
  { id: 3, title: "Forest path",       emoji: "🌲",  color: "bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800"     },
  { id: 4, title: "City lights",       emoji: "🌃",  color: "bg-purple-100 dark:bg-purple-900/40 border-purple-200 dark:border-purple-800" },
  { id: 5, title: "Desert dunes",      emoji: "🏜️",  color: "bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-800" },
  { id: 6, title: "Arctic aurora",     emoji: "🌌",  color: "bg-cyan-100 dark:bg-cyan-900/40 border-cyan-200 dark:border-cyan-800"         },
];

export default function PhotosGrid() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-mono text-zinc-400 mb-0.5">photos/page.tsx</p>
          <h1 className="text-xl font-semibold text-zinc-800 dark:text-white">Photo Grid</h1>
        </div>
        <p className="text-xs text-zinc-400 max-w-[200px] text-right">
          Click any photo — watch the URL change but this grid stay visible
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map(p => (
          <Link
            key={p.id}
            href={`/examples/intercept/photos/${p.id}`}
            className={`rounded-xl border-2 p-5 flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform ${p.color}`}
          >
            <span className="text-4xl">{p.emoji}</span>
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200 text-center">{p.title}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
