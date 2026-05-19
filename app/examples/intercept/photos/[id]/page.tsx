// photos/[id]/page.tsx — the FULL photo page.
// This renders when the user navigates DIRECTLY to /examples/intercept/photos/[id]
// (fresh tab, refresh, shared link). No interception — no modal.

import Link from "next/link";
import { notFound } from "next/navigation";

const photos = [
  { id: 1, title: "Mountain sunrise",  emoji: "🏔️",  color: "bg-orange-100 dark:bg-orange-900/40", desc: "Golden light breaks over the peaks as the world wakes up." },
  { id: 2, title: "Ocean at dusk",     emoji: "🌊",  color: "bg-blue-100 dark:bg-blue-900/40",     desc: "The horizon blurs where sea meets the violet sky." },
  { id: 3, title: "Forest path",       emoji: "🌲",  color: "bg-green-100 dark:bg-green-900/40",   desc: "Dappled light filters through a canopy of ancient trees." },
  { id: 4, title: "City lights",       emoji: "🌃",  color: "bg-purple-100 dark:bg-purple-900/40", desc: "A million windows glow against the deep blue of night." },
  { id: 5, title: "Desert dunes",      emoji: "🏜️",  color: "bg-yellow-100 dark:bg-yellow-900/40", desc: "Wind-carved ridges stretch endlessly under a blazing sun." },
  { id: 6, title: "Arctic aurora",     emoji: "🌌",  color: "bg-cyan-100 dark:bg-cyan-900/40",     desc: "Ribbons of green and violet dance above the frozen tundra." },
];

export default async function PhotoFullPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const photo = photos.find(p => p.id === Number(id));
  if (!photo) notFound();

  return (
    <main className="max-w-lg mx-auto px-4 py-12 space-y-6">
      <div className="text-xs font-mono text-zinc-400 space-y-0.5">
        <p>photos/[id]/page.tsx</p>
        <p className="text-green-500">← full page (direct navigation / refresh)</p>
        <p className="text-zinc-400">No interception — @modal received default.tsx (null)</p>
      </div>

      <div className={`${photo.color} rounded-2xl h-56 flex items-center justify-center text-7xl`}>
        {photo.emoji}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">{photo.title}</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">{photo.desc}</p>
      </div>

      <Link
        href="/examples/intercept/photos"
        className="inline-flex items-center gap-2 text-sm text-blue-500 hover:underline"
      >
        ← Back to grid
      </Link>
    </main>
  );
}
