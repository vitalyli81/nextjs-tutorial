// @modal/(.)photos/[id]/page.tsx — the MODAL version of the photo.
// This renders in the @modal slot when the user clicks a photo FROM the grid.
// The (.) prefix means: intercept a route at the same level as @modal (= photos/).
//
// The grid (photos/page.tsx) stays visible behind this modal.
// The URL updates to /examples/intercept/photos/[id] — same as the full page URL.
// If the user refreshes that URL, Next.js renders photos/[id]/page.tsx instead.

"use client";

import { useRouter } from "next/navigation";
import { useEffect, use } from "react";

const photos = [
  { id: 1, title: "Mountain sunrise",  emoji: "🏔️",  color: "bg-orange-100 dark:bg-orange-900/40", desc: "Golden light breaks over the peaks as the world wakes up." },
  { id: 2, title: "Ocean at dusk",     emoji: "🌊",  color: "bg-blue-100 dark:bg-blue-900/40",     desc: "The horizon blurs where sea meets the violet sky." },
  { id: 3, title: "Forest path",       emoji: "🌲",  color: "bg-green-100 dark:bg-green-900/40",   desc: "Dappled light filters through a canopy of ancient trees." },
  { id: 4, title: "City lights",       emoji: "🌃",  color: "bg-purple-100 dark:bg-purple-900/40", desc: "A million windows glow against the deep blue of night." },
  { id: 5, title: "Desert dunes",      emoji: "🏜️",  color: "bg-yellow-100 dark:bg-yellow-900/40", desc: "Wind-carved ridges stretch endlessly under a blazing sun." },
  { id: 6, title: "Arctic aurora",     emoji: "🌌",  color: "bg-cyan-100 dark:bg-cyan-900/40",     desc: "Ribbons of green and violet dance above the frozen tundra." },
];

export default function PhotoModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const photo = photos.find(p => p.id === Number(id));

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") router.back();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router]);

  if (!photo) return null;

  return (
    // Backdrop — clicking it goes back to the grid
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={() => router.back()}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-zinc-50 dark:bg-zinc-800 px-5 py-3 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">
              @modal/(.)photos/[id]/page.tsx
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              intercepted — grid still renders behind this
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className={`${photo.color} rounded-xl h-44 flex items-center justify-center text-6xl`}>
            {photo.emoji}
          </div>
          <div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">{photo.title}</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">{photo.desc}</p>
          </div>
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => router.back()}
              className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              ← back to grid
            </button>
            <a
              href={`/examples/intercept/photos/${photo.id}`}
              className="text-xs text-blue-500 hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              open full page in new tab →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
