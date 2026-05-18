// ─────────────────────────────────────────────────────────────────────────────
// app/learn/layout.tsx — LEARN SECTION LAYOUT
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • Nested layout    — wraps all /learn/* routes with a sidebar + main area;
//                        the root layout (app/layout.tsx) wraps this layout too,
//                        so every learn page has: NavBar → sidebar → content
//   • metadata         — overrides the title template for the /learn subtree;
//                        child pages fill in %s  (e.g. "Fetching Data | Next.js Learn")
//   • sticky sidebar   — top-14 aligns below the h-14 NavBar; calc(100vh-3.5rem)
//                        makes the sidebar exactly fill the remaining viewport height
//   • SidebarLink      — Client Component that uses usePathname to highlight the
//                        active chapter (requires "use client" for the hook)
//   • chapters data    — imported from _data/chapters.ts (single source of truth);
//                        same array used by ChapterLayout for prev/next links
//
// This layout is a SERVER COMPONENT — no "use client" needed here.
// Only SidebarLink is a Client Component (it reads the current URL with usePathname).
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { SidebarLink } from "./_components/SidebarLink";
import { chapters } from "./_data/chapters";

// Title template for all /learn/* pages.
// Overrides the root layout's template for this subtree.
// Child page: metadata = { title: "Fetching Data" }
// Result:     <title>Fetching Data | Next.js Learn</title>
export const metadata: Metadata = {
  title: { template: "%s | Next.js Learn", default: "Next.js Learn" },
  description: "Interactive examples for every Next.js getting-started chapter.",
};

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    // flex-1 — expands to fill the remaining height after the NavBar
    // min-h-0 — prevents overflow in flex column layouts
    <div className="flex flex-1 min-h-0">

      {/* ── Sidebar ───────────────────────────────────────────────── */}
      {/* w-56 — fixed width; hidden sm:block — hidden on mobile (hamburger in NavBar instead)
          sticky top-14 — sticks to the viewport, offsetting the h-14 NavBar above it
          h-[calc(100vh-3.5rem)] — fills exactly the height below the NavBar (3.5rem = h-14)
          overflow-y-auto — scroll if chapter list is taller than viewport */}
      <nav className="w-56 shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-4 overflow-y-auto hidden sm:block sticky top-14 h-[calc(100vh-3.5rem)]">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Chapters</p>
        <ul className="space-y-1">
          {/* Each SidebarLink is a Client Component — it uses usePathname to
              highlight the currently active chapter with a blue background */}
          {chapters.map((ch) => (
            <li key={ch.slug}>
              <SidebarLink href={`/learn/${ch.slug}`}>{ch.title}</SidebarLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Main content ────────────────────────────────────────────── */}
      {/* flex-1 — takes all remaining width after the sidebar
          overflow-y-auto — content area scrolls independently from the sidebar */}
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
