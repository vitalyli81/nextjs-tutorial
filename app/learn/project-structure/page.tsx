// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 1 — Project Structure
//
// KEY CONCEPTS IN THIS FILE:
//   • Top-level folders    — app/, public/, src/
//   • Special files        — page, layout, loading, error, route, template, default
//   • Nested routes        — folders map to URL segments
//   • Dynamic routes       — [slug], [...slug], [[...slug]]
//   • Route groups         — (group) organise without affecting URLs
//   • Private folders      — _folder opts out of routing
//   • Parallel routes      — @slot renders multiple pages in one layout
//   • Intercepted routes   — (.), (..), (...) show a route inside the current view
//   • Component hierarchy  — layout → template → error → loading → not-found → page
//
// This PAGE is a Server Component — pure reference content, no interactivity.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";
import { SameLevelDemo, OneLevelUpDemo, FromRootDemo, SlotsDemo } from "./_components/InterceptDemo";

export const metadata: Metadata = { title: "Project Structure" };

export default function ProjectStructurePage() {
  return (
    <ChapterLayout
      slug="project-structure"
      title="Project Structure"
      docsHref="https://nextjs.org/docs/app/getting-started/project-structure"
    >

      {/* ── Demo 1: Top-level folders & files ────────────────────────── */}
      <Demo concept="Top-level folders & files" title="What lives at the root of a Next.js project">
        <CodeBlock>{`my-app/
├── app/              ← App Router — routes, layouts, pages, API handlers
├── public/           ← Static assets served as-is: images, fonts, robots.txt
├── src/              ← Optional: move app/ (and pages/) inside src/ to
│                        keep config files separate from application code
│
├── next.config.ts    ← Next.js configuration (rewrites, headers, env…)
├── tsconfig.json     ← TypeScript configuration
├── eslint.config.mjs ← ESLint configuration
├── postcss.config.mjs← PostCSS / Tailwind CSS configuration
├── package.json      ← Dependencies and scripts
│
├── .env              ← Shared env vars (commit carefully — no secrets)
├── .env.local        ← Local overrides — NEVER commit
├── .env.production   ← Production-only env vars
└── .env.development  ← Development-only env vars`}
        </CodeBlock>
        <Callout kind="tip">
          The <code>src/</code> folder is entirely optional. Use it when you want a clean
          separation between application code and the root-level config files. Next.js
          automatically detects it — no extra configuration needed.
        </Callout>
      </Demo>

      {/* ── Demo 2: Special files ─────────────────────────────────────── */}
      <Demo concept="Special file conventions" title="Files Next.js recognises by name inside any route segment">
        <CodeBlock>{`app/dashboard/
├── page.tsx          ← UI for /dashboard. Required to make the route public.
├── layout.tsx        ← Wraps /dashboard and all descendants. Persists across
│                        navigation — does NOT re-mount when navigating between
│                        child routes. Ideal for sidebars, persistent nav.
├── loading.tsx       ← Shown instantly while page.tsx streams in.
│                        Next.js wraps it in <Suspense> automatically.
├── error.tsx         ← Catches render errors in this segment.
│                        MUST be "use client" (uses React error boundary hooks).
├── not-found.tsx     ← Rendered when notFound() is called from this segment.
├── template.tsx      ← Like layout.tsx but RE-MOUNTS on every navigation.
│                        Use for enter/exit animations or resetting state.
├── default.tsx       ← Fallback UI for a parallel route slot when no active
│                        state matches (e.g. on direct navigation).
└── route.ts          ← API endpoint (Route Handler). Cannot coexist with
                         page.tsx in the same folder.

// ── Metadata files (place in any segment) ───────────────────────
app/
├── favicon.ico             ← Browser tab icon (app root only)
├── opengraph-image.tsx     ← Generate OG image with JSX + ImageResponse
├── twitter-image.tsx       ← Generate Twitter card image
├── sitemap.ts              ← Returns MetadataRoute.Sitemap → /sitemap.xml
└── robots.ts               ← Returns MetadataRoute.Robots  → /robots.txt`}
        </CodeBlock>
        <Callout kind="rule">
          <code>route.ts</code> and <code>page.tsx</code> cannot live in the same folder —
          a segment is either a UI route or an API endpoint, not both. Put the API handler
          in a sibling folder like <code>app/api/users/route.ts</code>.
        </Callout>
      </Demo>

      {/* ── Demo 3: Nested & dynamic routes ──────────────────────────── */}
      <Demo concept="Nested & dynamic routes" title="How folders map to URL segments">
        <CodeBlock>{`// ── Nested routes — folders become URL segments ─────────────────
app/
  page.tsx                      → /
  blog/
    page.tsx                    → /blog
    [slug]/
      page.tsx                  → /blog/my-first-post

// ── Dynamic segments ─────────────────────────────────────────────
[slug]          → one segment   /blog/hello-world
[...slug]       → catch-all     /shop/clothing/shirts  (1 or more)
[[...slug]]     → optional      /docs  OR  /docs/api/use-router  (0 or more)

// Accessed via the params prop:
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;   // Next.js 15: params is a Promise
}) {
  const { slug } = await params;
  return <h1>{slug}</h1>;
}

// ── Multiple dynamic segments ────────────────────────────────────
app/shop/[category]/[product]/page.tsx
// → /shop/clothing/blue-shirt
// params: { category: "clothing", product: "blue-shirt" }

// ── Catch-all — params.slug is an array ──────────────────────────
app/docs/[...slug]/page.tsx
// → /docs/api/use-router
// params: { slug: ["api", "use-router"] }`}
        </CodeBlock>
      </Demo>

      {/* ── Demo 4: Route groups ──────────────────────────────────────── */}
      <Demo concept="Route groups  (name)" title="Organise routes without changing URLs">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 mb-1">
          Wrap a folder name in parentheses and Next.js ignores it in the URL.
          Use this to <strong>share a layout between some routes</strong> but not others,
          or to <strong>split a large app into sections</strong> without affecting paths.
        </p>
        <CodeBlock>{`app/
  (marketing)/
    layout.tsx          ← layout only for / and /about
    page.tsx            → /
    about/page.tsx      → /about
  (app)/
    layout.tsx          ← layout only for /dashboard and /settings
    dashboard/page.tsx  → /dashboard
    settings/page.tsx   → /settings

// The (marketing) and (app) folders don't appear in any URL.
// Each group can have its own layout, even its own root layout.

// ── Multiple root layouts ────────────────────────────────────────
// Remove app/layout.tsx and add layout.tsx to each group:
app/
  (marketing)/
    layout.tsx    ← its own <html><body> for the public site
  (dashboard)/
    layout.tsx    ← its own <html><body> for the authenticated app

// ── Scoping loading.tsx to a single route ────────────────────────
// Wrap just that route in a group:
app/dashboard/
  (overview)/
    loading.tsx     ← only applies to /dashboard/overview
    page.tsx        → /dashboard/overview
  analytics/page.tsx → /dashboard/analytics  (no loading skeleton)`}
        </CodeBlock>
        <Callout kind="tip">
          Route groups are also how you opt specific pages into a layout without putting
          all sibling pages under that layout. Any route outside the group folder is
          unaffected.
        </Callout>
      </Demo>

      {/* ── Demo 5: Private folders ───────────────────────────────────── */}
      <Demo concept="Private folders  _name" title="Colocate implementation files that are never routes">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 mb-1">
          Prefix any folder with <code>_</code> and Next.js opts it out of routing
          entirely — even if it contains a <code>page.tsx</code>. Use it to keep
          components, utilities, and data files next to the routes that use them.
        </p>
        <CodeBlock>{`app/
  dashboard/
    _components/       ← private — never a route
      StatsCard.tsx
      RevenueChart.tsx
    _lib/              ← private — never a route
      fetchStats.ts
      formatCurrency.ts
    _hooks/            ← private — never a route
      useRealtimeData.ts
    page.tsx           → /dashboard   (the only public file here)

// ── This project's convention ────────────────────────────────────
app/
  learn/
    _components/    ← shared UI used by all chapter pages
    _data/          ← chapters.ts — the single source of truth
  feed/
    _components/    ← VirtualFeed, PostCard
    _hooks/         ← useContainerHeight, useInfiniteScroll
    _lib/           ← posts.ts — data layer
    _actions/       ← server actions

// Files are colocated with the feature that owns them.
// The _ prefix makes it clear they are implementation details, not routes.`}
        </CodeBlock>
      </Demo>

      {/* ── Demo 6: Parallel routes ───────────────────────────────────── */}
      <Demo concept="Parallel routes  @slot" title="Render multiple independent pages in one layout simultaneously">

        {/* What */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Normally a layout has one <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">children</code> prop — one page at a time.
          Slots let a layout render <strong className="text-zinc-800 dark:text-zinc-100">multiple independent pages simultaneously</strong>, each in its own named region.
          You create a slot by naming a folder with <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@</code> — Next.js passes it as a prop to the layout automatically.
        </p>

        {/* Key behaviours */}
        <div className="mt-3 rounded-lg border border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
          {[
            ["Independent loading", <>Each slot has its own <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">loading.tsx</code> — switching a tab in <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@analytics</code> shows that slot&apos;s skeleton while <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@team</code> stays fully interactive.</>],
            ["Independent errors",  <>Each slot has its own <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">error.tsx</code> — a crash in one slot doesn&apos;t affect the others.</>],
            ["No URL segment",      <><code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@analytics</code> never appears in the URL — it&apos;s a layout concept only.</>],
            ["default.tsx required", <>When a URL only matches one slot, the others need a <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">default.tsx</code> fallback — otherwise Next.js throws a 404.</>],
          ].map(([label, desc]) => (
            <div key={label as string} className="flex gap-3 px-3 py-2.5">
              <span className="text-blue-500 font-bold shrink-0 mt-0.5">→</span>
              <div><span className="font-medium text-zinc-800 dark:text-zinc-100">{label}</span>{" "}<span className="text-zinc-500 dark:text-zinc-400">{desc}</span></div>
            </div>
          ))}
        </div>

        {/* When to use */}
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-4 mb-1.5">When to use</p>
        <ul className="text-sm text-zinc-500 dark:text-zinc-400 space-y-1 mb-4">
          {[
            "Dashboard with several independent panels (analytics, team, activity feed)",
            "Split-pane UI — list on the left, detail on the right, each with its own loading state",
            "Paired with intercepted routes to hold a modal overlay (see below)",
          ].map(t => <li key={t} className="flex gap-2"><span className="text-blue-400 shrink-0">✓</span>{t}</li>)}
        </ul>

        {/* How the layout wires it */}
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">How the layout receives slots</p>
        <CodeBlock>{`// dashboard/layout.tsx
export default function Layout({ children, analytics, team }: {
  children:  React.ReactNode;
  analytics: React.ReactNode;   // ← injected from @analytics/page.tsx
  team:      React.ReactNode;   // ← injected from @team/page.tsx
}) {
  return (
    <div>
      <main>{children}</main>   {/* dashboard/page.tsx */}
      <aside>
        {analytics}             {/* @analytics/page.tsx */}
        {team}                  {/* @team/page.tsx */}
      </aside>
    </div>
  );
}`}
        </CodeBlock>

        {/* Live demo */}
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-4 mb-1.5">Try it — switch tabs in one slot, the other is unaffected</p>
        <SlotsDemo />

        <Callout kind="tip">
          <a href="/examples/slots" className="underline font-medium">See the full example with real <code>@analytics</code> and <code>@team</code> folders in the file system →</a>
        </Callout>
      </Demo>

      {/* ── Demo 7: Intercepted routes ────────────────────────────────── */}
      <Demo concept="Intercepted routes  (.)  (..)  (...)" title="Show a different route inside the current layout without navigating away">

        {/* What */}
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Normally clicking a link replaces the current page. Intercepted routes let you{" "}
          <strong className="text-zinc-800 dark:text-zinc-100">render a different route inside the current layout</strong> — the URL updates
          but the page you came from stays visible. Refresh or open the URL directly and you get the normal full page. No interception.
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          This means <strong className="text-zinc-800 dark:text-zinc-100">one URL serves two purposes</strong>: a modal when navigated to in-app, a standalone page when opened directly.
        </p>

        {/* Key behaviours */}
        <div className="mt-3 rounded-lg border border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800 text-sm">
          {[
            ["URL changes, page doesn't", <>Click a photo → URL becomes <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/photos/1</code> but the grid stays visible behind the modal.</>],
            ["Refresh shows the real page", <>Refresh <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/photos/1</code> → no interception, renders <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">photos/[id]/page.tsx</code> as a full page.</>],
            ["Two files, one URL", <><code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">photos/[id]/page.tsx</code> is the real page. <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@modal/(.)photos/[id]/page.tsx</code> is the modal version. Same URL, different render based on context.</>],
            ["Always pair with a @slot", <>The intercepted content needs somewhere to render — a <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@modal</code> parallel slot in the layout holds it.</>],
          ].map(([label, desc]) => (
            <div key={label as string} className="flex gap-3 px-3 py-2.5">
              <span className="text-blue-500 font-bold shrink-0 mt-0.5">→</span>
              <div><span className="font-medium text-zinc-800 dark:text-zinc-100">{label}</span>{" "}<span className="text-zinc-500 dark:text-zinc-400">{desc}</span></div>
            </div>
          ))}
        </div>

        {/* When to use */}
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-4 mb-1.5">When to use</p>
        <ul className="text-sm text-zinc-500 dark:text-zinc-400 space-y-1 mb-4">
          {[
            "Photo / video grid — click opens a modal, share link opens the full page",
            "Social feed — quick-view drawer on click, full post page on direct URL",
            "Login flow — modal from a CTA button, /login URL still works standalone",
          ].map(t => <li key={t} className="flex gap-2"><span className="text-blue-400 shrink-0">✓</span>{t}</li>)}
        </ul>

        {/* Prefix reference */}
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Choosing the right prefix</p>
        <CodeBlock>{`// The prefix describes WHERE the target route lives
// relative to the @slot folder — like a relative import path.
//
//  (.)folder    target is at the SAME level as the @slot folder
//  (..)folder   target is ONE level ABOVE the @slot folder
//  (...)folder  target is at the APP ROOT (any depth)
//
// Count folder levels, not URL segments.`}
        </CodeBlock>

        {/* Interactive demos */}
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-4 mb-1.5">
          (.) — target is a sibling of @modal
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          Click a photo to intercept — URL updates, grid stays behind. Hit <strong className="text-zinc-700 dark:text-zinc-300">Simulate refresh</strong> to see the same URL as a full page.
        </p>
        <SameLevelDemo />

        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-5 mb-1.5">
          (..) — target is one level above @modal
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@modal</code> lives inside <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">feed/</code> but the target <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">posts/</code> is one level up — so <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">(..)</code> is needed.
        </p>
        <OneLevelUpDemo />

        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-5 mb-1.5">
          (...) — target is at the app root
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@modal</code> is deep inside <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">dashboard/analytics/</code> but the target <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">login/</code> is at the app root — so <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">(...)</code> is needed.
        </p>
        <FromRootDemo />

        <Callout kind="rule">
          Intercepted routes always need a <code>@slot</code> to render into — the layout renders both
          the background page and the overlay simultaneously, no extra state needed.
          Always add <code>default.tsx</code> returning <code>null</code> to the slot — otherwise
          Next.js throws on direct navigation when no intercepted state is active.{" "}
          <a href="/examples/intercept" className="underline font-medium">See the full example with real folder names →</a>
        </Callout>
      </Demo>

      {/* ── Demo 8: Component hierarchy ──────────────────────────────── */}
      <Demo concept="Component hierarchy" title="The order Next.js nests special files in the React tree">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 mb-1">
          Next.js wraps each special file around the next one in a fixed order.
          Knowing this tells you which boundaries catch which errors and which
          components re-mount on navigation.
        </p>
        <CodeBlock>{`// For any route segment, Next.js nests components in this order:
//
//   layout.tsx
//     template.tsx
//       error.tsx          ← error boundary (catches errors below it)
//         loading.tsx      ← suspense boundary (shows while page streams)
//           not-found.tsx  ← 404 boundary (catches notFound())
//             page.tsx     ← your actual page

// ── What this means in practice ──────────────────────────────────

// error.tsx wraps loading.tsx and page.tsx
// → an error thrown in page.tsx is caught by error.tsx
// → an error thrown in layout.tsx is NOT caught (use the parent segment's error.tsx)

// loading.tsx wraps page.tsx in <Suspense>
// → the page can stream in; loading.tsx shows immediately while it loads

// layout.tsx does NOT re-mount between navigations
// → sidebar/nav state is preserved when navigating between child routes

// template.tsx DOES re-mount on every navigation
// → use for enter/exit animations or resetting form state between pages

// ── Nested segments compound the hierarchy ───────────────────────
// app/layout.tsx           ← root layout (outermost)
//   app/dashboard/layout.tsx
//     app/dashboard/error.tsx
//       app/dashboard/loading.tsx
//         app/dashboard/page.tsx   ← innermost`}
        </CodeBlock>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "<strong>Top-level folders</strong>: <code>app/</code> App Router routes · <code>public/</code> static assets · <code>src/</code> optional wrapper for app code. Config files (<code>next.config.ts</code>, <code>tsconfig.json</code>) always live at the root.",
        "<strong>Special files</strong>: <code>page.tsx</code> makes a folder a public route · <code>layout.tsx</code> wraps children (persists, no re-mount) · <code>loading.tsx</code> Suspense fallback · <code>error.tsx</code> error boundary (must be <code>\"use client\"</code>) · <code>route.ts</code> API endpoint (can't coexist with <code>page.tsx</code>).",
        "<strong>Dynamic routes</strong>: <code>[slug]</code> one segment · <code>[...slug]</code> catch-all (1+) · <code>[[...slug]]</code> optional catch-all (0+). In Next.js 15 <code>params</code> is a Promise — always <code>await params</code>.",
        "<strong>Route groups <code>(name)</code></strong>: folder is omitted from the URL. Use to share a layout between some routes, create multiple root layouts, or scope <code>loading.tsx</code> to a single route without affecting siblings.",
        "<strong>Private folders <code>_name</code></strong>: opts the folder out of routing entirely. Use for components, hooks, utils, and data files colocated with the feature that uses them (<code>_components/</code>, <code>_lib/</code>, <code>_hooks/</code>).",
        "<strong>Parallel routes <code>@slot</code></strong>: render multiple independent pages in one layout. Each slot is a prop on the layout. Each slot can have its own <code>loading.tsx</code> and <code>error.tsx</code>. Use <code>default.tsx</code> as a fallback on direct navigation.",
        "<strong>Intercepted routes</strong>: <code>(.)</code> same level · <code>(..)</code> one level up · <code>(...)</code> from root. Classic use: photo grid where clicking a photo shows a modal (intercepted), but refreshing the URL shows the full page (not intercepted). Always pair with a <code>@modal</code> parallel slot.",
        "<strong>Component hierarchy</strong> (outer → inner): <code>layout</code> → <code>template</code> → <code>error</code> → <code>loading</code> → <code>not-found</code> → <code>page</code>. Errors in <code>layout.tsx</code> are NOT caught by the same segment's <code>error.tsx</code> — they bubble to the parent.",
      ]} />
    </ChapterLayout>
  );
}
