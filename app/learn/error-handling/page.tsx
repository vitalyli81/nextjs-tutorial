// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 6 — Error Handling
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • error.tsx            — file convention; Next.js wraps page.tsx in a React
//                            error boundary and uses this file as the fallback UI
//   • "use client" on error.tsx — REQUIRED; React error boundaries only work
//                            in Client Components
//   • notFound()           — function from "next/navigation"; renders the nearest
//                            not-found.tsx and halts execution
//   • not-found.tsx        — file convention; custom 404 UI for a route segment
//   • global-error.tsx     — root-level safety net for errors in layout.tsx
//   • Error bubble-up      — errors propagate up to the nearest error.tsx ancestor
//
// This PAGE is a Server Component (no "use client").
// ErrorThrower is a Client Component — it uses useState and useTransition to
// throw a render-time error so you can see error.tsx catch it live.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";
import { ErrorThrower } from "./_components/ErrorThrower";

export const metadata: Metadata = { title: "Error Handling" };

export default function ErrorHandlingPage() {
  return (
    <ChapterLayout
      slug="error-handling"
      title="Error Handling"
      docsHref="https://nextjs.org/docs/app/getting-started/error-handling"
    >
      {/* ── Demo 1: error.tsx file convention ─────────────────────────── */}
      <Demo concept="error.tsx" title="Catches uncaught errors in the same route segment">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          Place <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">error.tsx</code> next to{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">page.tsx</code>.
          Next.js automatically wraps the page in a React error boundary, using{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">error.tsx</code> as
          the fallback UI. Click below to throw an error — watch it get caught
          without crashing the sidebar or the rest of the page:
        </p>

        {/* ErrorThrower is a Client Component — it throws a render error on button click.
            error.tsx (in this same folder) catches it and shows the recovery UI. */}
        <ErrorThrower />

        <CodeBlock>{`// app/learn/error-handling/error.tsx
"use client";  // ← REQUIRED — React error boundaries only work in Client Components

// Next.js passes two props automatically:
//   error — the Error object that was thrown
//   reset — a function that re-renders this segment (retry without a page reload)
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }; // digest = server-generated error ID (for logs)
  reset: () => void;
}) {
  return (
    <div>
      <p>Something went wrong: {error.message}</p>
      {/* Calling reset() tells Next.js to re-render page.tsx in this segment */}
      <button onClick={reset}>Try again</button>
    </div>
  );
}`}
        </CodeBlock>
        <Callout kind="rule">
          <code>error.tsx</code> <strong>must</strong> be a Client Component (<code>&apos;use client&apos;</code>)
          because React error boundaries require client-side JavaScript to catch render errors
          and enable recovery with <code>reset()</code>.
        </Callout>
      </Demo>

      {/* ── Demo 2: notFound() + not-found.tsx ────────────────────────── */}
      <Demo concept="not-found.tsx + notFound()" title="Programmatically render a custom 404 page">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          Call <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">notFound()</code> from{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">next/navigation</code> anywhere
          in a Server Component to render the nearest{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">not-found.tsx</code>{" "}
          in the route hierarchy. Commonly used when a DB record doesn&apos;t exist:
        </p>
        <CodeBlock>{`// app/blog/[slug]/page.tsx — dynamic route
import { notFound } from "next/navigation";

export default async function BlogPost({ params }) {
  const { slug } = await params;                              // await in Next.js 15
  const post = await db.post.findUnique({ where: { slug } }); // query the database

  // If the post doesn't exist, render the nearest not-found.tsx instead.
  // notFound() throws internally — no code after it runs.
  if (!post) notFound();

  return <article>{post.title}</article>;
}

// ─────────────────────────────────────────────────────────
// app/blog/[slug]/not-found.tsx — shown when notFound() is called
export default function PostNotFound() {
  return <p>Post not found. <Link href="/blog">Back to blog</Link></p>;
}`}
        </CodeBlock>

        {/* Link to a demo route that actually calls notFound() — user can see it live */}
        <Link
          href="/learn/error-handling/not-found-demo"
          className="inline-block mt-3 rounded-lg border border-yellow-400 text-yellow-600 dark:text-yellow-400 px-4 py-2 text-sm hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
        >
          Visit a route that calls notFound() →
        </Link>
        <Callout kind="tip">
          <code>not-found.tsx</code> can be a Server Component — it doesn&apos;t need{" "}
          <code>&apos;use client&apos;</code>. Unlike <code>error.tsx</code>, it&apos;s just a normal
          page rendered when <code>notFound()</code> is called. It also receives a 404 HTTP status.
        </Callout>
      </Demo>

      {/* ── Demo 3: Error bubble-up hierarchy ─────────────────────────── */}
      <Demo concept="Error hierarchy" title="Errors bubble up to the nearest error.tsx — like try/catch for UI">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          If a route segment has no <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">error.tsx</code>,
          the error bubbles up to the parent segment&apos;s{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">error.tsx</code>.
          The root-level safety net is{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">global-error.tsx</code>.
        </p>
        <CodeBlock>{`app/
  global-error.tsx            ← catches errors in root layout.tsx
                                (must be "use client", replaces the entire page UI)
  learn/
    error-handling/
      error.tsx               ← catches errors in THIS segment's page.tsx
      page.tsx                ← if this throws, error.tsx above catches it
      not-found-demo/
        page.tsx              ← if this throws and has no local error.tsx,
                                 the error bubbles up to error-handling/error.tsx`}
        </CodeBlock>
        <CodeBlock>{`// KEY RULE: error.tsx catches its SIBLING page.tsx, but NOT layout.tsx
// in the same segment. Layout errors bubble further up.

app/dashboard/
  layout.tsx    ← error here? NOT caught by dashboard/error.tsx
  error.tsx     ← only catches dashboard/page.tsx errors
  page.tsx      ← errors here ARE caught by error.tsx above

// To catch layout.tsx errors, place error.tsx one level UP:
app/
  error.tsx     ← catches app/dashboard/layout.tsx errors
  dashboard/
    layout.tsx
    page.tsx`}
        </CodeBlock>
        <Callout kind="rule">
          <code>error.tsx</code> catches errors in its <strong>sibling</strong>{" "}
          <code>page.tsx</code> and child segments — but <strong>not</strong> its sibling{" "}
          <code>layout.tsx</code>. Layout errors bubble to the parent. Use{" "}
          <code>global-error.tsx</code> at the app root as the final fallback.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "Place <code>error.tsx</code> next to <code>page.tsx</code> — Next.js automatically wraps the page in a React error boundary using it as the fallback UI.",
        "<code>error.tsx</code> <strong>must</strong> be a Client Component (<code>'use client'</code>). React error boundaries only work client-side. It receives two props: <code>error: Error</code> and <code>reset: () =&gt; void</code>.",
        "Call <code>reset()</code> inside <code>error.tsx</code> to re-render the route segment — lets users retry without a full page reload.",
        "Call <code>notFound()</code> from <code>next/navigation</code> in any Server Component to render the nearest <code>not-found.tsx</code>. It throws internally — no code after it runs.",
        "<code>not-found.tsx</code> does NOT need <code>'use client'</code> — it's a regular Server Component rendered in place of the page when <code>notFound()</code> is called. Response gets HTTP 404.",
        "Errors bubble up to the nearest <code>error.tsx</code> ancestor — just like JavaScript <code>try/catch</code> for the component tree.",
        "<code>error.tsx</code> catches its sibling <code>page.tsx</code> errors, but NOT its sibling <code>layout.tsx</code> errors. Layout errors bubble to the parent segment.",
        "Add <code>global-error.tsx</code> at the app root as the final safety net for root layout errors. It must be <code>'use client'</code> and replaces the entire page UI when triggered.",
      ]} />
    </ChapterLayout>
  );
}
