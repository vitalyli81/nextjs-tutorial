// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx — HOME PAGE  (route: /)
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • Server Component — default; no "use client" needed; HTML is rendered on
//                        the server, no JS sent to the browser for this page
//   • next/link        — client-side navigation; prefetches linked routes when
//                        they enter the viewport
//   • Sections:
//       Hero           — headline, description, two CTAs
//       Learn          — grid of 10 chapter cards linking to /learn/[slug]
//       App Examples   — grid of 4 mini-app cards with emoji + tag chips
//
// DATA SHAPE:
//   chapters[] — slug (URL segment) + title + description used for the cards
//   apps[]     — href + emoji + title + description + tags
//
// These are hardcoded here because they're static and only used on this page.
// The canonical chapter list lives in app/learn/_data/chapters.ts.
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";

// Chapter cards data — title/description shown on the home page index
// slug → /learn/[slug] (matches the folder name under app/learn/)
const chapters = [
  { slug: "project-structure",      title: "Project Structure",    description: "special files, route groups, parallel & intercepted routes" },
  { slug: "layouts-and-pages",      title: "Layouts & Pages",      description: "file-system routing, layout.tsx, dynamic segments" },
  { slug: "linking-and-navigating", title: "Linking & Navigating", description: "<Link>, useRouter, prefetching, active routes" },
  { slug: "server-and-client",      title: "Server & Client",      description: "'use client', props across the boundary, interleaving" },
  { slug: "fetching-data",          title: "Fetching Data",        description: "async/await, Promise.all, Suspense streaming" },
  { slug: "mutating-data",          title: "Mutating Data",        description: "Server Actions, useActionState, revalidatePath" },
  { slug: "error-handling",         title: "Error Handling",       description: "error.tsx, notFound(), global-error.tsx" },
  { slug: "route-handlers",         title: "Route Handlers",       description: "route.ts, GET/POST, NextRequest/NextResponse" },
  { slug: "css",                    title: "CSS",                  description: "Tailwind, CSS Modules, globals.css" },
  { slug: "fonts-and-images",       title: "Fonts & Images",       description: "next/font/google, next/image, remotePatterns" },
  { slug: "metadata",               title: "Metadata",             description: "static export, generateMetadata, title template" },
  { slug: "state-management",       title: "State Management",     description: "Zustand vs React Context, persist middleware, selectors" },
  { slug: "tailwind-css",           title: "Tailwind CSS",         description: "utilities, responsive, dark mode, clsx, config extension" },
  { slug: "typescript",             title: "TypeScript",           description: "primitives, generics, utility types, React typing, narrowing" },
];

// App examples data — 4 mini-apps demonstrating real-world Next.js patterns
const apps = [
  {
    href: "/todo",
    title: "Todo List",
    description: "Zustand + localStorage persistence, inline editing.",
    emoji: "✅",
    tags: ["Zustand", "localStorage"],
  },
  {
    href: "/tictactoe",
    title: "Tic-Tac-Toe",
    description: "Unbeatable AI via minimax algorithm.",
    emoji: "🎮",
    tags: ["Minimax", "Game AI"],
  },
  {
    href: "/feed",
    title: "Infinite Feed",
    description: "Virtual list + IntersectionObserver, no libraries.",
    emoji: "📜",
    tags: ["Virtualization", "IntersectionObserver"],
  },
  {
    href: "/checkboxes",
    title: "Checkbox Tree",
    description: "Nested indeterminate checkboxes — O(1) state reads.",
    emoji: "☑️",
    tags: ["Tree algorithms", "DOM refs"],
  },
];

// Home page — Server Component (no "use client")
// The entire HTML is rendered on the server; no client JS for this page itself.
export default function Home() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16 space-y-24">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="text-center space-y-5">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
          <span className="text-xl">▲</span> Next.js App Router
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Next.js Tutorial
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Every App Router concept — explained with live interactive demos.
          Fourteen chapters, four mini apps.
        </p>
        {/* CTAs — next/link for client-side navigation with prefetch */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Link
            href="/learn"
            className="rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-6 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Start Learning →
          </Link>
          {/* Anchor link to the #apps section below on the same page */}
          <Link
            href="#apps"
            className="rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 px-6 py-2.5 text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            App Examples
          </Link>
        </div>
      </section>

      {/* ── Learn section — chapter cards grid ─────────────────────── */}
      <section>
        <div className="mb-8">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">14 chapters</p>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Learn</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            Interactive demos covering every topic in the official Next.js getting-started docs.
          </p>
        </div>
        {/* 2-column grid — each card links to /learn/[slug] */}
        <div className="grid gap-3 sm:grid-cols-2">
          {chapters.map((ch, i) => (
            // next/link — hovers into viewport → prefetches the chapter route
            <Link
              key={ch.slug}
              href={`/learn/${ch.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-5 py-4 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-sm transition-all"
            >
              {/* Zero-padded chapter number: "01", "02", … "10" */}
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600 pt-0.5 w-5 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                {/* group-hover:text-blue-600 — title turns blue when card is hovered */}
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {ch.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5 truncate">
                  {ch.description}
                </p>
              </div>
              {/* Arrow indicator — turns blue on hover */}
              <span className="ml-auto text-zinc-300 dark:text-zinc-700 group-hover:text-blue-400 transition-colors shrink-0 pt-0.5">→</span>
            </Link>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link href="/learn" className="text-sm text-blue-500 hover:underline">
            View all chapters →
          </Link>
        </div>
      </section>

      {/* ── App Examples section ────────────────────────────────────── */}
      {/* id="apps" — target for the "App Examples" anchor link in the hero */}
      <section id="apps">
        <div className="mb-8">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-1">4 apps</p>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">App Examples</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            Mini apps that demonstrate real-world Next.js patterns end-to-end.
          </p>
        </div>
        {/* 4-column grid on large screens, 2 on medium, 1 on mobile */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {apps.map((app) => (
            <Link
              key={app.href}
              href={app.href}
              className="group flex flex-col gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-sm transition-all"
            >
              <span className="text-3xl">{app.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {app.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                  {app.description}
                </p>
              </div>
              {/* Tag chips — show the key technology/concept for each app */}
              <div className="flex flex-wrap gap-1 mt-auto pt-1">
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 px-2 py-0.5 text-[11px] font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
