// ─────────────────────────────────────────────────────────────────────────────
// NavBar — global sticky top navigation bar.
//
// WHY "use client"?
//   This file uses:
//     • useState     — dropdown open/close state, mobile menu toggle
//     • useRef       — detect clicks outside the dropdown to auto-close
//     • useEffect    — attach/remove the document mousedown listener
//     • usePathname  — highlight the active dropdown item (via DropdownItem)
//   All are React hooks — hooks only work in Client Components.
//
// STRUCTURE:
//   NavBar
//   ├── Logo link (/)
//   ├── Desktop nav (hidden on mobile)
//   │   ├── Dropdown "Learn"       — 10 chapter links
//   │   └── Dropdown "App Examples" — 4 mini-app links
//   └── Mobile hamburger toggle
//       └── Mobile menu (vertical list, shown/hidden by mobileOpen)
//
// DROPDOWN CLOSE BEHAVIOR:
//   Dropdown uses useRef + useEffect to listen for mousedown events outside
//   its container. When detected, it sets open=false. This is the standard
//   "click outside to close" pattern for accessible dropdowns.
//
// ACTIVE HIGHLIGHTING:
//   DropdownItem uses usePathname (from next/navigation) to compare the
//   item's href against the current URL. Exact match → blue highlight.
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";

// Chapter list — duplicated here so NavBar has no server-side import dependency.
// In a larger app you'd import from _data/chapters.ts, but NavBar is "use client"
// and the data is small enough to inline.
const chapters = [
  { slug: "project-structure",    title: "1. Project Structure"  },
  { slug: "layouts-and-pages",    title: "2. Layouts & Pages"    },
  { slug: "linking-and-navigating", title: "3. Linking & Navigating" },
  { slug: "server-and-client",    title: "4. Server & Client"    },
  { slug: "fetching-data",        title: "5. Fetching Data"      },
  { slug: "mutating-data",        title: "6. Mutating Data"      },
  { slug: "error-handling",       title: "7. Error Handling"     },
  { slug: "route-handlers",       title: "8. Route Handlers"     },
  { slug: "css",                  title: "9. CSS"                },
  { slug: "fonts-and-images",     title: "10. Fonts & Images"    },
  { slug: "metadata",             title: "11. Metadata"          },
  { slug: "state-management",     title: "12. State Management"  },
  { slug: "tailwind-css",         title: "13. Tailwind CSS"      },
  { slug: "typescript",           title: "14. TypeScript"        },
];

const apps = [
  { href: "/todo",        title: "Todo List",     emoji: "✅" },
  { href: "/tictactoe",   title: "Tic-Tac-Toe",   emoji: "🎮" },
  { href: "/feed",        title: "Infinite Feed",  emoji: "📜" },
  { href: "/checkboxes",  title: "Checkbox Tree",  emoji: "☑️" },
];

// ── Dropdown ─────────────────────────────────────────────────────────────
// Manages its own open/close state.
// Closes when the user clicks outside using a mousedown listener on document.
function Dropdown({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  // ref attached to the wrapper div — used to detect outside clicks
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Close dropdown when user clicks anywhere outside this component
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    // Clean up the listener when the component unmounts
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Toggle button — chevron rotates 180° when open */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel — rendered only when open; z-50 floats above page content */}
      {open && (
        <div
          onClick={() => setOpen(false)} // close when any item is clicked
          className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl z-50 py-1 overflow-hidden"
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ── DropdownItem ──────────────────────────────────────────────────────────
// A single item inside a Dropdown. Uses usePathname for active highlighting.
function DropdownItem({ href, children }: { href: string; children: React.ReactNode }) {
  // usePathname — returns the current URL path (e.g. "/learn/fetching-data")
  const pathname = usePathname();
  // Exact match — only highlight the item whose href equals the current path
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
        active
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium"
          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
      }`}
    >
      {children}
    </Link>
  );
}

// ── NavBar ────────────────────────────────────────────────────────────────
// sticky top-0 z-40 — sticks to top, floats above page content
// backdrop-blur — frosted glass effect (transparent enough to show scroll below)
export function NavBar() {
  // Controls the mobile hamburger menu open/close
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-2">

        {/* Logo — links to home, always visible */}
        <Link href="/" className="flex items-center gap-2 mr-4 shrink-0">
          <span className="text-xl">▲</span>
          <span className="font-bold text-zinc-900 dark:text-white text-sm">Next.js Tutorial</span>
        </Link>

        {/* Desktop nav — hidden on mobile (sm:flex shows it on ≥640px screens) */}
        <nav className="hidden sm:flex items-center gap-1 flex-1">
          {/* "Learn" dropdown — lists all 10 chapters + "All chapters" link */}
          <Dropdown label="Learn">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Chapters
            </div>
            {chapters.map((ch) => (
              <DropdownItem key={ch.slug} href={`/learn/${ch.slug}`}>
                {/* Extract just the number from "1. Layouts & Pages" → "1" */}
                <span className="text-zinc-400 font-mono text-xs w-5 shrink-0">
                  {ch.slug.match(/^(\d+)/)?.[1] ?? ""}
                </span>
                {/* Strip the "N. " prefix — number is shown separately above */}
                {ch.title.replace(/^\d+\.\s/, "")}
              </DropdownItem>
            ))}
            {/* Divider + "All chapters" link at the bottom */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
              <DropdownItem href="/learn">
                <span className="text-zinc-400 text-xs">→</span>
                All chapters
              </DropdownItem>
            </div>
          </Dropdown>

          {/* "App Examples" dropdown — links to the 4 mini apps */}
          <Dropdown label="App Examples">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Mini Apps
            </div>
            {apps.map((app) => (
              <DropdownItem key={app.href} href={app.href}>
                <span className="w-5 text-center">{app.emoji}</span>
                {app.title}
              </DropdownItem>
            ))}
          </Dropdown>
        </nav>

        {/* Mobile hamburger — only visible on small screens (sm:hidden) */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="sm:hidden ml-auto p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Toggle menu"
        >
          {/* X icon when open, hamburger icon when closed */}
          <svg className="w-5 h-5 text-zinc-700 dark:text-zinc-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* Mobile menu — shown below the header bar when hamburger is open */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)} // close when any link is tapped
          className="sm:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 space-y-4"
        >
          {/* Learn section */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">Learn</p>
            <div className="space-y-0.5">
              {chapters.map((ch) => (
                <Link
                  key={ch.slug}
                  href={`/learn/${ch.slug}`}
                  className="block px-2 py-1.5 rounded text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  {ch.title}
                </Link>
              ))}
            </div>
          </div>

          {/* App Examples section */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">App Examples</p>
            <div className="space-y-0.5">
              {apps.map((app) => (
                <Link
                  key={app.href}
                  href={app.href}
                  className="flex items-center gap-2 px-2 py-1.5 rounded text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                >
                  {app.emoji} {app.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
