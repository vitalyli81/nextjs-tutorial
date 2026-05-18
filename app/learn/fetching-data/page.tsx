// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 4 — Fetching Data
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • async Server Components  — fetch data with plain await, no useEffect
//   • Promise.all              — parallel requests (total = slowest, not sum)
//   • <Suspense> streaming     — each async section resolves independently
//   • loading.tsx              — file convention for route-level skeleton UI
//
// This entire file is a SERVER COMPONENT — no "use client".
// All async functions run on the server; only the resulting HTML goes to
// the browser. The artificial delays (300/500/800ms) simulate real DB calls.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { Suspense } from "react";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";

export const metadata: Metadata = { title: "Fetching Data" };

// ── Simulated data-fetching functions ────────────────────────────────────
// In a real app these would call a database or external API.
// The setTimeout simulates network/DB latency so you can see streaming happen.

async function getUser() {
  await new Promise(r => setTimeout(r, 300)); // simulates 300ms DB query
  return { name: "Alice", role: "Admin" };
}

async function getPosts() {
  await new Promise(r => setTimeout(r, 800)); // simulates 800ms slow query
  return [
    { id: 1, title: "Hello Next.js" },
    { id: 2, title: "App Router Deep Dive" },
    { id: 3, title: "Server Components Explained" },
  ];
}

async function getStats() {
  await new Promise(r => setTimeout(r, 500)); // simulates 500ms API call
  return { views: 12_480, likes: 834 };
}

// ── Skeleton component ────────────────────────────────────────────────────
// Shown as the <Suspense> fallback while async components are awaiting data.
// animate-pulse is a Tailwind utility for the standard skeleton shimmer.
function Skeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        // Varying widths make the skeleton look like real text content
        <div
          key={i}
          className="h-4 bg-zinc-200 dark:bg-zinc-700 rounded"
          style={{ width: `${60 + (i % 3) * 15}%` }}
        />
      ))}
    </div>
  );
}

// ── Async Server Components ───────────────────────────────────────────────
// Each one is wrapped in its own <Suspense> in the page below.
// They resolve independently — the slowest doesn't block the others.

async function UserCard() {
  const user = await getUser(); // 300ms — resolves first
  return (
    <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800 p-3 text-sm">
      <p className="font-medium text-zinc-800 dark:text-white">{user.name}</p>
      <p className="text-zinc-500 text-xs">{user.role}</p>
    </div>
  );
}

async function PostList() {
  const posts = await getPosts(); // 800ms — resolves last
  return (
    <ul className="space-y-1">
      {posts.map(p => (
        <li key={p.id} className="text-sm text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 text-xs flex items-center justify-center font-mono shrink-0">
            {p.id}
          </span>
          {p.title}
        </li>
      ))}
    </ul>
  );
}

async function StatsPanel() {
  const stats = await getStats(); // 500ms — resolves second
  return (
    <div className="flex gap-4">
      <div className="text-center">
        <p className="text-lg font-bold text-zinc-800 dark:text-white">{stats.views.toLocaleString()}</p>
        <p className="text-xs text-zinc-400">views</p>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-zinc-800 dark:text-white">{stats.likes.toLocaleString()}</p>
        <p className="text-xs text-zinc-400">likes</p>
      </div>
    </div>
  );
}

// ── Parallel fetch demo component ─────────────────────────────────────────
// Uses Promise.all to fire both requests at once.
// Total wait = max(300ms, 500ms) = 500ms instead of 300 + 500 = 800ms.
async function ParallelDemo() {
  // Both promises START at the same time — they run concurrently
  const [user, stats] = await Promise.all([getUser(), getStats()]);
  return (
    <div className="text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
      <p>User: <strong>{user.name}</strong> ({user.role})</p>
      <p>Views: <strong>{stats.views.toLocaleString()}</strong> · Likes: <strong>{stats.likes.toLocaleString()}</strong></p>
      <p className="text-xs text-zinc-400 mt-1">
        Resolved in ~500ms (max of 300ms + 500ms), not 800ms (sequential would be 300+500).
      </p>
    </div>
  );
}

export default function FetchingDataPage() {
  return (
    <ChapterLayout
      slug="fetching-data"
      title="Fetching Data"
      docsHref="https://nextjs.org/docs/app/getting-started/fetching-data"
    >
      {/* ── Demo 1: async/await in Server Components ───────────────────── */}
      <Demo concept="fetch() in Server Components" title="Just use async/await — no useEffect, no useState needed">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Server Components can be <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">async</code>.
          Fetch data directly — no API routes, no client-side loading state, no hydration concerns.
          The HTML arrives at the browser with data already embedded.
        </p>
        <CodeBlock>{`// app/dashboard/page.tsx — Server Component, fetches data directly
export default async function DashboardPage() {
  // Direct DB access — only possible because this runs on the server
  const user = await db.user.findFirst({ where: { id: 1 } });

  // Or use the standard fetch() API — Next.js extends it with caching
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();

  // Data is already available — no loading state needed in JSX
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{posts.length} posts</p>
    </div>
  );
}`}
        </CodeBlock>
        <Callout kind="rule">
          Never use <code>useEffect</code> + <code>useState</code> for data fetching in Next.js.
          Use <code>async</code> Server Components instead — the server fetches once,
          the HTML arrives complete. No waterfall, no flash of empty content.
        </Callout>
      </Demo>

      {/* ── Demo 2: Promise.all ────────────────────────────────────────── */}
      <Demo concept="Promise.all — parallel fetching" title="Fire multiple requests at once — total time = slowest, not the sum">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          User (300ms) and stats (500ms) below are fetched in parallel with{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">Promise.all</code>.
          Total wait ≈ 500ms, not 800ms.
        </p>
        {/* ParallelDemo is an async Server Component — wrap in Suspense to stream */}
        <Suspense fallback={<Skeleton lines={2} />}>
          <ParallelDemo />
        </Suspense>
        <CodeBlock>{`// ❌ Sequential — each await blocks the next: 300 + 500 = 800ms total
const user  = await getUser();    // waits 300ms
const stats = await getStats();   // then waits another 500ms

// ✓ Parallel — both start immediately: max(300, 500) = 500ms total
const [user, stats] = await Promise.all([
  getUser(),   // starts now
  getStats(),  // also starts now
]);`}
        </CodeBlock>
        <Callout kind="rule">
          When two requests don&apos;t depend on each other&apos;s result, always use{" "}
          <code>Promise.all</code>. Sequential <code>await</code> creates unnecessary waterfalls.
        </Callout>
      </Demo>

      {/* ── Demo 3: Suspense streaming ─────────────────────────────────── */}
      <Demo concept="<Suspense> streaming" title="Sections resolve and paint independently — the slowest doesn't block the others">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Each column below has its own{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&lt;Suspense&gt;</code> boundary.
          Reload the page — watch User (300ms) paint first, then Stats (500ms), then Posts (800ms).
          The page is usable before all data is ready.
        </p>
        {/* Three independent Suspense boundaries — each streams when its await resolves */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-zinc-400 mb-2 font-mono">User — 300ms</p>
            {/* Fallback renders immediately; replaced by UserCard when it resolves */}
            <Suspense fallback={<Skeleton lines={2} />}><UserCard /></Suspense>
          </div>
          <div>
            <p className="text-xs text-zinc-400 mb-2 font-mono">Stats — 500ms</p>
            <Suspense fallback={<Skeleton lines={1} />}><StatsPanel /></Suspense>
          </div>
          <div>
            <p className="text-xs text-zinc-400 mb-2 font-mono">Posts — 800ms</p>
            <Suspense fallback={<Skeleton lines={3} />}><PostList /></Suspense>
          </div>
        </div>
        <CodeBlock>{`// Each boundary streams independently — PostList doesn't block UserCard
<Suspense fallback={<Skeleton lines={2} />}>
  <UserCard />   {/* resolves at 300ms */}
</Suspense>

<Suspense fallback={<Skeleton lines={1} />}>
  <StatsPanel /> {/* resolves at 500ms */}
</Suspense>

<Suspense fallback={<Skeleton lines={3} />}>
  <PostList />   {/* resolves at 800ms */}
</Suspense>`}
        </CodeBlock>
        <Callout kind="rule">
          Without <code>&lt;Suspense&gt;</code>, one slow component blocks the entire page response.
          Wrap each independent async section in its own boundary to unlock streaming.
        </Callout>
      </Demo>

      {/* ── Demo 4: loading.tsx ────────────────────────────────────────── */}
      <Demo concept="loading.tsx" title="File convention — Next.js wraps the whole page in Suspense for you">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Add <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">loading.tsx</code> next to{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">page.tsx</code> and Next.js
          automatically wraps the page in <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&lt;Suspense&gt;</code>.
          Navigate away and back to see the skeleton on this very page.
        </p>
        {/* File-tree showing the convention */}
        <CodeBlock>{`app/learn/fetching-data/
  page.tsx      ← async Server Component (this file)
  loading.tsx   ← shown AUTOMATICALLY while page.tsx is awaiting data
                   Next.js wraps page.tsx in <Suspense fallback={<FetchingLoading />}>`}
        </CodeBlock>
        <CodeBlock>{`// loading.tsx — a regular Server Component, no special API required
export default function Loading() {
  return (
    // Skeleton UI — match the shape of the real page for the best UX
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-zinc-200 rounded w-48" />
      <div className="h-32 bg-zinc-100 rounded" />
    </div>
  );
}`}
        </CodeBlock>
        <Callout kind="tip">
          <code>loading.tsx</code> also enables <strong>partial prefetch</strong>.
          When a <code>&lt;Link&gt;</code> to a dynamic page enters the viewport,
          Next.js prefetches the layout + this skeleton — so navigation feels instant
          even before the data is ready.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "Fetch data in <strong>async Server Components</strong> with plain <code>await</code>. No <code>useEffect</code>, no <code>useState</code>, no API routes needed for server-side data.",
        "Never chain <code>await</code> for independent requests — use <code>Promise.all([a(), b()])</code>. Total time = slowest request, not the sum.",
        "Wrap each slow async section in its own <code>&lt;Suspense fallback={&lt;Skeleton /&gt;}&gt;</code>. Sections stream to the browser as they resolve — the slowest doesn't block the rest.",
        "<code>loading.tsx</code> next to <code>page.tsx</code> = automatic <code>&lt;Suspense&gt;</code> wrapper for the entire page. No imports or wiring needed.",
        "<code>loading.tsx</code> enables partial prefetch: Next.js prefetches the layout + skeleton for dynamic routes, making navigation feel instant.",
        "Next.js extends <code>fetch()</code> with <strong>caching</strong>: same URL called multiple times in one request is deduplicated automatically.",
      ]} />
    </ChapterLayout>
  );
}
