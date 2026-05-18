// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 1 — Layouts & Pages
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • page.tsx file convention  — makes a folder into a public URL
//   • layout.tsx file convention — shared UI that wraps child pages
//   • [slug] dynamic segment    — one file handles many URL variations
//   • searchParams prop         — server-side access to ?key=value query strings
//   • metadata export           — sets the browser <title> for this route
//
// This is a SERVER COMPONENT (no "use client" directive).
// It can be async, read searchParams, and render without sending JS to the browser.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";

// ── metadata export ────────────────────────────────────────────────────────
// Next.js reads this at build/request time and injects a <title> tag.
// The root layout has template: "%s | Next.js Tutorial" so the full title
// becomes "Layouts & Pages | Next.js Tutorial".
export const metadata: Metadata = { title: "Layouts & Pages" };

// ── searchParams type ──────────────────────────────────────────────────────
// In Next.js 15, searchParams is a Promise — it must be awaited before use.
// The generic type describes the expected query-string shape.
type Props = { searchParams: Promise<{ filter?: string }> };

// The page component is async so we can await searchParams.
// Next.js automatically passes searchParams to every page component.
export default async function LayoutsAndPagesPage({ searchParams }: Props) {
  // Destructure with a default — "filter" is undefined if ?filter= is absent
  const { filter = "" } = await searchParams;

  return (
    <ChapterLayout
      slug="layouts-and-pages"
      title="Layouts & Pages"
      docsHref="https://nextjs.org/docs/app/getting-started/layouts-and-pages"
    >
      {/* ── Demo 1: page.tsx ───────────────────────────────────────────── */}
      <Demo concept="page.tsx" title="Any folder with a page.tsx becomes a public URL">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          The file system <em>is</em> the router. No route config files needed.
        </p>
        {/* File-tree diagram showing the mapping from folder structure to URLs */}
        <CodeBlock>{`app/
  page.tsx                  → /                        (home)
  about/
    page.tsx                → /about
  learn/
    layouts-and-pages/
      page.tsx              → /learn/layouts-and-pages  ← you are here`}
        </CodeBlock>
        <Callout kind="rule">
          Only <code>page.tsx</code> makes a route public. Other files in the same folder
          (components, utilities, tests) are colocated but <strong>never exposed as URLs</strong>.
        </Callout>
      </Demo>

      {/* ── Demo 2: layout.tsx ─────────────────────────────────────────── */}
      <Demo concept="layout.tsx" title="Shared UI that wraps child pages — doesn't re-render on navigation">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          The sidebar and header you see right now come from{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">app/learn/layout.tsx</code>.
          It stays mounted while you click between chapters — React never unmounts it.
        </p>
        {/* layout.tsx must accept and render a "children" prop.
            Next.js injects the matched page.tsx as children automatically. */}
        <CodeBlock>{`// app/learn/layout.tsx
export default function LearnLayout({ children }) {
  return (
    <div>
      <Sidebar />              {/* renders once, stays alive across pages */}
      <main>{children}</main>  {/* ← the matched page.tsx renders here */}
    </div>
  );
}`}
        </CodeBlock>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
          Layouts nest — every layout from <code>app/layout.tsx</code> down to the current
          segment is stacked outermost-first:
        </p>
        {/* Visual of the nesting stack for this exact page */}
        <CodeBlock>{`app/layout.tsx                          ← outermost (html + body)
  app/learn/layout.tsx                  ← sidebar shell
    app/learn/layouts-and-pages/page.tsx ← this page`}
        </CodeBlock>
        <Callout kind="rule">
          Layouts <strong>never re-render</strong> during client-side navigation.
          State inside a layout (scroll position, open dropdowns, etc.) is preserved
          across page transitions.
        </Callout>
      </Demo>

      {/* ── Demo 3: Dynamic segment [slug] ─────────────────────────────── */}
      <Demo concept="[slug] — dynamic segment" title="One route file handles infinite URL variations">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Wrapping a folder name in square brackets makes it dynamic.
          The matched URL segment is available as{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">params.slug</code>.
          Click any post link below:
        </p>
        {/* params is also a Promise in Next.js 15 — must be awaited */}
        <CodeBlock>{`// app/learn/layouts-and-pages/post/[slug]/page.tsx
type Props = { params: Promise<{ slug: string }> };

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  // slug = "nextjs-basics" | "react-tips" | any value in the URL
  const post = await db.findPost(slug); // use it to fetch data
}`}
        </CodeBlock>
        {/* Live demo — clicking these navigates to the [slug] page */}
        <div className="flex flex-wrap gap-2 mt-3">
          {["nextjs-basics", "react-tips", "typescript-guide"].map((slug) => (
            <Link
              key={slug}
              href={`/learn/layouts-and-pages/post/${slug}`}
              className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
            >
              /post/{slug}
            </Link>
          ))}
        </div>
        <Callout kind="tip">
          Multiple dynamic segments: <code>[category]/[slug]</code> — both values land in{" "}
          <code>params</code>. Catch-all: <code>[...slug]</code> — params.slug becomes an array.
          Optional catch-all: <code>[[...slug]]</code> — also matches the parent route.
        </Callout>
      </Demo>

      {/* ── Demo 4: searchParams ───────────────────────────────────────── */}
      <Demo concept="searchParams" title="Server pages receive the URL query string as a prop">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Click a filter — the page re-renders on the server and shows the active value.
          No client JS needed; the URL updates and Next.js re-runs this component.
        </p>
        {/* Filter buttons — each is a <Link> that changes ?filter= in the URL.
            The active button is highlighted based on the current `filter` value. */}
        <div className="flex gap-2 flex-wrap mb-3">
          {["all", "draft", "published"].map((f) => (
            <Link
              key={f}
              href={`?filter=${f}`}
              className={`rounded-lg border px-3 py-1 text-sm transition-colors ${
                filter === f
                  ? "bg-blue-500 text-white border-blue-500"
                  : "border-zinc-200 dark:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-700"
              }`}
            >
              {f}
            </Link>
          ))}
        </div>
        {/* Live display of the current searchParams value */}
        <p className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded">
          searchParams.filter ={" "}
          <span className="text-blue-500">&quot;{filter || "(none)"}&quot;</span>
        </p>
        {/* Code showing the exact pattern used in this file */}
        <CodeBlock>{`// This file — Server Component, no "use client"
type Props = { searchParams: Promise<{ filter?: string }> };

export default async function Page({ searchParams }: Props) {
  const { filter = "all" } = await searchParams;
  // filter is now a plain string — use it to query a DB, filter arrays, etc.
  const posts = await db.posts.findMany({ where: { status: filter } });
}`}
        </CodeBlock>
        <Callout kind="warning">
          <code>searchParams</code> is a <strong>Promise</strong> in Next.js 15 — always{" "}
          <code>await</code> it before reading values. In Client Components, use{" "}
          <code>useSearchParams()</code> from <code>next/navigation</code> instead.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "<code>page.tsx</code> inside a folder = that folder becomes a public URL. No other file convention does this.",
        "<code>layout.tsx</code> wraps all <code>page.tsx</code> files in the same folder and below. It receives <code>children</code> and <strong>never re-renders</strong> on client navigation.",
        "Layouts stack outermost-first: <code>app/layout.tsx</code> → <code>app/learn/layout.tsx</code> → <code>page.tsx</code>.",
        "A folder named <code>[slug]</code> is a dynamic segment. The matched value lands in <code>params.slug</code> (a Promise in Next.js 15 — always <code>await params</code>).",
        "<code>searchParams</code> is the URL query string as an object. It is a Promise in Next.js 15 — <code>await searchParams</code> before reading keys.",
        "Only <code>page.tsx</code> is publicly accessible. Other files colocated in the same folder (components, utils) are <strong>never</strong> exposed as routes.",
        "<code>export const metadata = { title: '…' }</code> in a <code>page.tsx</code> or <code>layout.tsx</code> sets the browser <code>&lt;title&gt;</code> automatically.",
      ]} />
    </ChapterLayout>
  );
}
