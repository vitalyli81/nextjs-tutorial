// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 2 — Linking & Navigating
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • <Link>             — client-side navigation with automatic prefetching
//   • prefetch prop      — control when/whether a route is prefetched
//   • useRouter()        — programmatic navigation from Client Components
//   • usePathname()      — read the current URL path in a Client Component
//   • useSearchParams()  — read ?key=value query params in a Client Component
//   • <Suspense>         — required wrapper for useSearchParams to work
//
// This is a SERVER COMPONENT — only the <RouterDemo> child is a Client Component.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";
import { RouterDemo } from "./_components/RouterDemo";

export const metadata: Metadata = { title: "Linking & Navigating" };

export default function LinkingPage() {
  return (
    <ChapterLayout
      slug="linking-and-navigating"
      title="Linking & Navigating"
      docsHref="https://nextjs.org/docs/app/getting-started/linking-and-navigating"
    >
      {/* ── Demo 1: <Link> ─────────────────────────────────────────────── */}
      <Demo concept="next/link" title="<Link> — the primary way to navigate between routes">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Drop-in replacement for <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&lt;a&gt;</code>.
          Adds client-side navigation (no full reload) and automatic prefetching.
        </p>
        {/* Basic usage patterns — static href, string href, object href */}
        <CodeBlock>{`import Link from "next/link";

// Static string href
<Link href="/about">About</Link>

// Dynamic segment
<Link href={\`/blog/\${post.slug}\`}>Read post</Link>

// Object form — useful when building URLs programmatically
<Link href={{ pathname: "/search", query: { q: "nextjs" } }}>
  Search
</Link>

// Disable prefetching for a specific link
<Link href="/heavy-page" prefetch={false}>Heavy page</Link>`}
        </CodeBlock>
        {/* Live demo links */}
        <div className="flex flex-wrap gap-2 mt-3">
          <Link href="/learn/layouts-and-pages" className="text-sm text-blue-500 hover:underline">← Ch 1</Link>
          <Link href="/learn/server-and-client"  className="text-sm text-blue-500 hover:underline">Ch 3 →</Link>
          <Link href="/learn" prefetch={false}   className="text-sm text-zinc-400 hover:underline">Index (prefetch=false)</Link>
        </div>
        <Callout kind="rule">
          Always use <code>&lt;Link&gt;</code> for internal navigation. A bare{" "}
          <code>&lt;a href=&quot;/page&quot;&gt;</code> causes a full browser reload —
          React state is lost and all layouts re-mount from scratch.
        </Callout>
      </Demo>

      {/* ── Demo 2: Prefetching ────────────────────────────────────────── */}
      <Demo concept="Prefetching" title="Routes are downloaded before you click — navigation feels instant">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          When a <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&lt;Link&gt;</code> scrolls
          into the viewport, Next.js prefetches it in the background so the transition is instant.
        </p>
        {/* Table comparing prefetch behaviour by route type */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left py-2 pr-4 text-zinc-500 font-semibold">Route type</th>
                <th className="text-left py-2 pr-4 text-zinc-500 font-semibold">Default</th>
                <th className="text-left py-2 text-zinc-500 font-semibold">With loading.tsx</th>
              </tr>
            </thead>
            <tbody className="text-zinc-600 dark:text-zinc-300">
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="py-2 pr-4">Static route</td>
                <td className="py-2 pr-4 text-green-600">Full page prefetch</td>
                <td className="py-2 text-green-600">Full page prefetch</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Dynamic route</td>
                {/* Dynamic routes have no pre-renderable HTML — skipped by default */}
                <td className="py-2 pr-4 text-amber-600">Skipped</td>
                {/* loading.tsx gives Next.js a shell it CAN prefetch */}
                <td className="py-2 text-green-600">Layout + loading skeleton</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout kind="tip">
          Add <code>loading.tsx</code> next to dynamic pages — it gives Next.js a static
          shell to prefetch, so navigation still feels instant before data loads.
        </Callout>
      </Demo>

      {/* ── Demo 3: useRouter / usePathname / useSearchParams ──────────── */}
      <Demo concept="useRouter / usePathname / useSearchParams" title="Programmatic navigation — Client Component only">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Use these hooks when navigation must trigger from JS logic (auth guard, timer,
          form submit). <strong>All three require <code>&apos;use client&apos;</code></strong>.
          Watch the live values update as you click:
        </p>
        {/*
          RouterDemo is a "use client" component.
          It MUST be wrapped in <Suspense> because useSearchParams() triggers
          dynamic rendering — without the boundary Next.js would bail out of
          static generation for the entire page.
        */}
        <Suspense fallback={<p className="text-sm text-zinc-400">Loading…</p>}>
          <RouterDemo />
        </Suspense>
        <CodeBlock>{`"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// useRouter — imperative navigation
const router = useRouter();
router.push("/dashboard");       // go to /dashboard, add history entry
router.replace("/login");        // go to /login, REPLACE current entry (no back)
router.back();                   // same as browser back button
router.refresh();                // re-fetch server data for the current route

// usePathname — current URL path as a string (no query string)
const pathname = usePathname();  // e.g. "/learn/linking-and-navigating"

// useSearchParams — read-only access to ?key=value query params
const params = useSearchParams();
const tab = params.get("tab");   // "one" if URL is ?tab=one, else null`}
        </CodeBlock>
        <Callout kind="warning">
          <code>useSearchParams()</code> opts the component into <strong>dynamic rendering</strong>.
          Always wrap the component that uses it in <code>&lt;Suspense&gt;</code> — otherwise
          Next.js falls back to client-side rendering for the entire page.
        </Callout>
      </Demo>

      {/* ── Demo 4: Active link pattern ────────────────────────────────── */}
      <Demo concept="Active link" title="Highlight the current route with usePathname()">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          The sidebar on the left highlights the active chapter using this exact pattern.
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded ml-1">SidebarLink</code> is a
          tiny Client Component — its parent layout stays a Server Component.
        </p>
        {/* Full source of the SidebarLink component used in the actual sidebar */}
        <CodeBlock>{`// app/learn/_components/SidebarLink.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarLink({ href, children }) {
  const pathname = usePathname();
  const active = pathname === href; // exact match

  return (
    <Link
      href={href}
      className={active
        ? "bg-blue-50 text-blue-600 font-medium"  // highlighted
        : "text-zinc-500 hover:bg-zinc-100"       // default
      }
    >
      {children}
    </Link>
  );
}`}
        </CodeBlock>
        <Callout kind="rule">
          Keep interactive hooks in the <em>smallest possible</em> Client Component.
          A parent Server Component that renders a tiny <code>&apos;use client&apos;</code> child
          still renders itself on the server — the bundle only grows for the child.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "Always use <code>&lt;Link href=&quot;/path&quot;&gt;</code> for internal navigation — never a bare <code>&lt;a&gt;</code> tag. <code>&lt;a&gt;</code> causes a full reload and loses React state.",
        "<code>&lt;Link&gt;</code> prefetches routes automatically when they enter the viewport. Disable with <code>prefetch={false}</code> for heavy pages.",
        "Static routes are fully prefetched. Dynamic routes are skipped — add <code>loading.tsx</code> to unlock partial prefetch (layout + skeleton).",
        "<code>useRouter()</code> for programmatic navigation: <code>push()</code> adds history, <code>replace()</code> doesn't, <code>back()</code> goes back, <code>refresh()</code> re-fetches server data.",
        "<code>usePathname()</code> returns the current path as a string. Use it to highlight active nav links.",
        "<code>useSearchParams()</code> reads <code>?key=value</code> from the URL. <strong>Must be inside <code>&lt;Suspense&gt;</code></strong> or the whole page loses static rendering.",
        "All three hooks (<code>useRouter</code>, <code>usePathname</code>, <code>useSearchParams</code>) require <code>'use client'</code>.",
      ]} />
    </ChapterLayout>
  );
}
