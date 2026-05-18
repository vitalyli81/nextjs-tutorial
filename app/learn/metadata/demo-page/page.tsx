// demo-page/page.tsx — demonstrates generateMetadata() with dynamic searchParams.
//
// HOW generateMetadata() WORKS HERE:
//   1. User navigates from GenerateMetadataDemo with ?title=...&description=...
//   2. Next.js calls generateMetadata() BEFORE rendering the page.
//   3. generateMetadata() awaits searchParams (Promise in Next.js 15) and returns
//      a Metadata object with the user-provided values.
//   4. Next.js injects those values as <title> and <meta name="description">
//      into <head> before streaming the HTML.
//   5. The page component ALSO reads searchParams — the values are deduplicated
//      and the params object is resolved only once.
//
// KEY RULE: Both generateMetadata() and the page component receive the same
//   params/searchParams. They share the fetch cache — if both call the same
//   DB function, the DB is only queried ONCE (deduplication).

import type { Metadata } from "next";
import Link from "next/link";

// Props type — shared between generateMetadata() and the page component.
// In Next.js 15, searchParams is a Promise — must be awaited.
type Props = { searchParams: Promise<{ title?: string; description?: string }> };

// ── generateMetadata — runs on the server before the page renders ──────────
// Returns a Metadata object — Next.js injects it into <head> automatically.
// The function is async and can await any data source (DB, API, searchParams).
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  // await searchParams — required in Next.js 15 (searchParams is a Promise)
  const { title = "Dynamic Title", description = "Set via generateMetadata" } = await searchParams;

  return {
    // title here uses the root layout's template → "Dynamic Title | Next.js Tutorial"
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

// ── Page component ─────────────────────────────────────────────────────────
export default async function MetadataDemoPage({ searchParams }: Props) {
  // Await the same searchParams — Next.js resolves the Promise once and shares the result.
  // This is NOT a duplicate fetch — deduplication ensures params are resolved only once.
  const { title = "Dynamic Title", description = "Set via generateMetadata" } = await searchParams;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="rounded-2xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-6 space-y-3">
        {/* Visual label identifying this as the generateMetadata() demo */}
        <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider">
          generateMetadata() demo
        </p>
        <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
          Browser tab title: &ldquo;{title} | Next.js Tutorial&rdquo;
        </p>
        <p className="text-sm text-purple-600 dark:text-purple-400">
          description: {description}
        </p>
        <p className="text-xs text-purple-500 dark:text-purple-400">
          Inspect the page source — the{" "}
          {/* These tags were injected by generateMetadata() BEFORE the HTML streamed */}
          <code className="bg-purple-100 dark:bg-purple-900/30 px-1 rounded">&lt;title&gt;</code> and{" "}
          <code className="bg-purple-100 dark:bg-purple-900/30 px-1 rounded">&lt;meta name=&quot;description&quot;&gt;</code>{" "}
          tags were generated server-side from the URL query params — not added by JS in the browser.
        </p>
      </div>
      {/* Navigate back to the chapter */}
      <Link href="/learn/metadata" className="inline-block text-sm text-blue-500 hover:underline">
        ← Back to chapter
      </Link>
    </div>
  );
}
