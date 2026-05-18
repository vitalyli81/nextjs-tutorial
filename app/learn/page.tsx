// /learn index page — Server Component.
// Renders the chapter grid by mapping over the shared `chapters` array from
// _data/chapters.ts. Each card links to the corresponding chapter route.
// No client JavaScript needed — pure server-rendered navigation.

import Link from "next/link";
import { chapters } from "./_data/chapters";

export default function LearnIndex() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-2">Next.js Learn</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-8">
        Every concept from the official getting-started docs, demonstrated live. Pick a chapter.
      </p>

      {/* Chapter grid — two columns on small+ screens */}
      <ul className="grid gap-3 sm:grid-cols-2">
        {chapters.map((ch) => (
          <li key={ch.slug}>
            <Link
              href={`/learn/${ch.slug}`}
              className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors group"
            >
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {ch.title}
              </span>
              <span className="ml-auto text-zinc-300 dark:text-zinc-600 group-hover:text-blue-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
