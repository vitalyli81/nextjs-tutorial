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
      <Demo concept="Parallel routes  @slot" title="Render multiple pages simultaneously in one layout">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 mb-1">
          Each slot (<code>@analytics</code>, <code>@team</code>) is an independent page rendered
          by the same layout at the same time. Switch tabs in one slot — the other is unaffected.
          Each slot has its own <code>loading.tsx</code> skeleton and <code>error.tsx</code> boundary.
        </p>
        <SlotsDemo />
        <Callout kind="tip">
          Slot folders (<code>@analytics</code>) are not URL segments — they don&apos;t
          appear in the address bar. Always add a <code>default.tsx</code> to each slot
          so direct navigation doesn&apos;t crash when no active state matches.{" "}
          <a href="/examples/slots" className="underline font-medium">See a live example with real @slot folders →</a>
        </Callout>
      </Demo>

      {/* ── Demo 7a: (.) same level ───────────────────────────────────── */}
      <Demo concept="Intercepted routes  (.)" title="(.) — intercept a sibling route: photo grid → modal">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 mb-1">
          Click a photo to open it as a modal — URL updates but the grid stays behind.
          Then try <strong>Simulate refresh</strong> to see the same URL render as a full page instead.
        </p>
        <SameLevelDemo />
      </Demo>

      {/* ── Demo 7b: (..) one level up ────────────────────────────────── */}
      <Demo concept="Intercepted routes  (..)" title="(..) — intercept a route one level up: feed → post modal">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 mb-1">
          The <code>@modal</code> slot lives inside <code>feed/</code> but the target
          is <code>posts/</code> one level up — so <code>(..)</code> is needed.
          Click a post to see the intercept, then simulate a refresh.
        </p>
        <OneLevelUpDemo />
      </Demo>

      {/* ── Demo 7c: (...) from root ───────────────────────────────────── */}
      <Demo concept="Intercepted routes  (...)" title="(...) — intercept from app root: dashboard → login modal">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 mb-1">
          The <code>@modal</code> is deeply nested inside <code>dashboard/analytics/</code> but
          the target <code>login/</code> is at the app root — so <code>(...)</code> is needed.
          Click <strong>Switch account</strong> to see the intercept.
        </p>
        <FromRootDemo />
        <Callout kind="rule">
          Parallel + intercepted routes always work together: the <code>@modal</code> slot
          (parallel) holds the intercepted route, and the layout renders both the background
          page and the overlay at once. Always add a <code>default.tsx</code> that returns{" "}
          <code>null</code> to each slot — otherwise Next.js throws on direct navigation
          when no intercepted state is active.{" "}
          <a href="/examples/intercept" className="underline font-medium">See a live example with real @modal + (.)photos folders →</a>
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
