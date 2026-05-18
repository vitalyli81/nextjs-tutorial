// ChapterLayout — the outer shell for every chapter page.
//
// Responsibilities:
//   1. Renders the chapter header (number badge, title, official docs link)
//   2. Wraps all Demo / Callout / CheatSheet children in a consistent container
//   3. Reads `chapters` to compute prev/next navigation links
//
// Usage in every chapter page:
//   <ChapterLayout slug="fetching-data" title="Fetching Data" docsHref="…">
//     <Demo …>…</Demo>
//     <CheatSheet items={[…]} />
//   </ChapterLayout>
//
// NOTE: This is a Server Component. No "use client" needed — it does no
// interactive work. The prev/next links are plain Next.js <Link> components.

import Link from "next/link";
import { chapters } from "../_data/chapters";

type Props = {
  slug: string;         // must match a slug in _data/chapters.ts
  title: string;        // displayed in the <h1>
  docsHref: string;     // full URL to the official Next.js docs page
  children: React.ReactNode;
};

export function ChapterLayout({ slug, title, docsHref, children }: Props) {
  // Find this chapter's position so we can display "Chapter N" and compute
  // prev / next links automatically from the shared chapters array.
  const idx = chapters.findIndex((c) => c.slug === slug);
  const prev = chapters[idx - 1]; // undefined for chapter 1
  const next = chapters[idx + 1]; // undefined for the last chapter

  return (
    <div className="max-w-3xl mx-auto">

      {/* ── Chapter header ───────────────────────────────────────────────── */}
      <div className="mb-8">
        {/* "Chapter 4" badge — idx is 0-based so we add 1 */}
        <p className="text-xs text-blue-500 font-semibold uppercase tracking-wider mb-1">
          Chapter {idx + 1}
        </p>
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-2">{title}</h1>
        {/* External link to the official docs — opens in a new tab */}
        <a
          href={docsHref}
          target="_blank"
          rel="noopener noreferrer"  // security: prevents the new tab accessing window.opener
          className="text-xs text-zinc-400 hover:text-blue-500 transition-colors"
        >
          📖 Official docs ↗
        </a>
      </div>

      {/* ── Chapter content (Demo cards, Callouts, CheatSheet) ───────────── */}
      <div className="space-y-8">{children}</div>

      {/* ── Prev / Next navigation ───────────────────────────────────────── */}
      {/* Uses Next.js <Link> for client-side navigation with prefetching */}
      <div className="flex justify-between mt-12 pt-6 border-t border-zinc-200 dark:border-zinc-700">
        {prev ? (
          <Link href={`/learn/${prev.slug}`} className="text-sm text-blue-500 hover:underline">
            ← {prev.title}
          </Link>
        ) : (
          <span /> // empty span keeps flex layout balanced on chapter 1
        )}
        {next && (
          <Link href={`/learn/${next.slug}`} className="text-sm text-blue-500 hover:underline">
            {next.title} →
          </Link>
        )}
      </div>
    </div>
  );
}
