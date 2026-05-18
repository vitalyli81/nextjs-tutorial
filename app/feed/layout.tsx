// Segment layout — wraps every route inside /feed.
// Provides the page-level metadata and the "← Home" back-link.
// Layouts are Server Components by default in Next.js App Router.

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Infinite Feed",
  description: "Infinite scroll with virtualization — no third-party libraries.",
};

export default function FeedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Back-link rendered at layout level so it persists during Suspense streaming */}
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors"
      >
        ← Home
      </Link>
      {children}
    </div>
  );
}
