// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 3 — Server & Client Components
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • Server Component (default) — async, no JS sent to browser, DB access OK
//   • "use client"               — opts a file into the client bundle
//   • Props across the boundary  — must be JSON-serializable
//   • Children / slot pattern    — pass server-rendered JSX into a client wrapper
//   • Decision guide             — when to use each type
//
// This PAGE is a Server Component (no "use client" at the top).
// Only Counter and SlotWrapper are Client Components — they live in _components/.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";
import { Counter } from "./_components/Counter";
import { SlotWrapper } from "./_components/SlotWrapper";

export const metadata: Metadata = { title: "Server & Client Components" };

// ── Inline Server Component ────────────────────────────────────────────────
// Defined here (not in _components/) because it only exists to demo server
// capabilities — process.version and Date are server-only.
// This component is async — it can await data, but here we just read builtins.
async function ServerBox() {
  // new Date() runs on the SERVER at request time — the browser never sees this code.
  // Refresh the page to see a new timestamp (the client doesn't re-run this).
  const renderTime = new Date().toISOString();

  return (
    <div className="font-mono text-xs space-y-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-zinc-600 dark:text-zinc-300">
      {/* process.version is Node.js — only available on the server */}
      <p>Node: <span className="text-green-500">{process.version}</span></p>
      <p>Rendered at: <span className="text-green-500">{renderTime}</span></p>
      <p className="text-zinc-400 text-[11px] pt-1">
        Server-only — refresh to see a new timestamp. None of this code ships to the browser.
      </p>
    </div>
  );
}

export default async function ServerAndClientPage() {
  // This random number is computed ON THE SERVER.
  // It gets passed as a prop to Counter — serialized to JSON at the boundary.
  const serverSideNumber = Math.floor(Math.random() * 100);

  return (
    <ChapterLayout
      slug="server-and-client"
      title="Server & Client Components"
      docsHref="https://nextjs.org/docs/app/getting-started/server-and-client-components"
    >
      {/* ── Demo 1: Server Component ───────────────────────────────────── */}
      <Demo concept="Server Component (default)" title="Runs only on the server — zero JS sent to the browser">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Every component is a Server Component by default — no directive needed.
          They can be <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">async</code>,
          read env secrets, and call databases directly.
          None of their code is included in the JavaScript bundle shipped to users.
        </p>
        {/* Live proof: shows Node version and server timestamp */}
        <ServerBox />
        <CodeBlock>{`// Server Component — no "use client", no bundle cost
async function UserProfile() {
  // ✓ Direct database access — runs only on the server
  const user = await db.user.findFirst({ where: { id: 1 } });

  // ✓ Secret env vars — never leaked to the browser
  const apiKey = process.env.INTERNAL_API_KEY;

  return <div>{user.name}</div>; // only the HTML output is sent to the client
}`}
        </CodeBlock>
        <Callout kind="rule">
          Server Components <strong>cannot</strong> use <code>useState</code>,{" "}
          <code>useEffect</code>, or any browser API (<code>window</code>,{" "}
          <code>document</code>, <code>localStorage</code>…).
          They run once per request on the server, never in the browser.
        </Callout>
      </Demo>

      {/* ── Demo 2: "use client" ───────────────────────────────────────── */}
      <Demo concept="'use client'" title="Client Component — enables useState, events, browser APIs">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Add <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&apos;use client&apos;</code> at
          the top of a file to make it and all its imports part of the client bundle.
          The counter below uses <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">useState</code>:
        </p>
        {/* Counter is a Client Component — lives in _components/Counter.tsx */}
        <Counter label="client counter — click me" />
        <CodeBlock>{`// _components/Counter.tsx
"use client";  // ← BOUNDARY: this file + all imports go into the JS bundle

import { useState } from "react";  // ✓ works because this is a Client Component

export function Counter({ initialCount = 0 }) {
  const [count, setCount] = useState(initialCount); // ✓ client state
  return (
    <button onClick={() => setCount(c => c + 1)}>  {/* ✓ event handler */}
      {count}
    </button>
  );
}`}
        </CodeBlock>
        <Callout kind="rule">
          <code>&apos;use client&apos;</code> marks a <strong>bundle boundary</strong> for the whole file,
          not just one component. Place it as deep in the component tree as possible
          so the server bundle stays small and fast.
        </Callout>
      </Demo>

      {/* ── Demo 3: Props across the server→client boundary ────────────── */}
      <Demo concept="Props: server → client" title="Server computes a value and passes it as a prop">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          The server computed <strong>{serverSideNumber}</strong> and passed it as{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">initialCount</code>.
          Refresh the page to see a new random starting value.
        </p>
        {/* The number was computed server-side above and is serialized to JSON */}
        <Counter label="initial value from server" initialCount={serverSideNumber} />
        <CodeBlock>{`// page.tsx — Server Component
const serverSideNumber = Math.floor(Math.random() * 100); // runs on server

// Prop is serialized to JSON when crossing the boundary:
//   { "initialCount": 42 }
return <Counter initialCount={serverSideNumber} />;

// Counter.tsx — Client Component
// useState picks up the server value as its initial state
const [count, setCount] = useState(initialCount); // starts at 42`}
        </CodeBlock>
        <Callout kind="warning">
          Props crossing the server → client boundary must be <strong>JSON-serializable</strong>:
          strings, numbers, booleans, plain objects, arrays.
          You cannot pass: functions, class instances, <code>Date</code> objects, <code>undefined</code>,
          or React Server Component output directly as a prop (use <code>children</code> instead).
        </Callout>
      </Demo>

      {/* ── Demo 4: Children / slot pattern ───────────────────────────── */}
      <Demo concept="Interleaving — children slot" title="Pass Server Component output into a Client Component">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          The toggle below is a <strong>Client Component</strong> (<code>SlotWrapper</code>).
          The server info <em>inside</em> it is a <strong>Server Component</strong> (<code>ServerBox</code>)
          passed as <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">children</code>.
          Toggle it — the server HTML is shown/hidden but never re-fetched.
        </p>
        {/*
          page.tsx (Server Component) renders ServerBox on the server,
          then passes the resulting HTML as children to SlotWrapper.
          SlotWrapper (Client Component) receives opaque HTML — it can't
          "see inside" or re-render ServerBox.
        */}
        <SlotWrapper>
          <ServerBox />
        </SlotWrapper>
        <CodeBlock>{`// page.tsx — Server Component owns the composition
<SlotWrapper>       {/* Client Component */}
  <ServerBox />     {/* Server Component — rendered on server, passed as children */}
</SlotWrapper>

// SlotWrapper.tsx — "use client"
export function SlotWrapper({ children }) {
  const [open, setOpen] = useState(true);
  // children is already-rendered server HTML — SlotWrapper can't re-render it
  return <div>{open && children}</div>;
}

// ✗ WRONG — you cannot import a Server Component inside a Client file:
// import { ServerBox } from "./ServerBox"; // ← breaks the pattern`}
        </CodeBlock>
        <Callout kind="rule">
          You <strong>cannot import</strong> a Server Component inside a <code>&apos;use client&apos;</code> file.
          Pass server-rendered output as <code>children</code> or another prop from a
          Server Component parent instead.
        </Callout>
      </Demo>

      {/* ── Demo 5: Decision guide ─────────────────────────────────────── */}
      <Demo concept="Decision guide" title="When to use Server vs Client">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 space-y-1">
            <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Server Component</p>
            <p>✓ Fetch data / query DB</p>
            <p>✓ Read secret env vars</p>
            <p>✓ Keep bundle small</p>
            <p>✓ SEO-critical content</p>
            <p>✓ Static / non-interactive UI</p>
          </div>
          <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-3 space-y-1">
            <p className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Client Component</p>
            <p>✓ useState / useReducer</p>
            <p>✓ useEffect / lifecycle</p>
            <p>✓ onClick / onChange</p>
            <p>✓ Browser APIs (window, localStorage…)</p>
            <p>✓ Custom hooks with the above</p>
          </div>
        </div>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "Every component is a <strong>Server Component by default</strong> — no directive needed. Server Components run on the server, never in the browser.",
        "Add <code>'use client'</code> at the top of a file to make it a Client Component. This is a <strong>bundle boundary</strong> — the file AND all its imports go into the JS bundle.",
        "Server Components CAN: be <code>async</code>, query databases, read <code>process.env</code> secrets, reduce bundle size.",
        "Server Components CANNOT: use <code>useState</code>, <code>useEffect</code>, <code>onClick</code>, or any browser-only API.",
        "Props crossing server → client must be <strong>JSON-serializable</strong>: strings, numbers, plain objects, arrays. No functions, no class instances.",
        "To put a Server Component <em>inside</em> a Client Component: pass it as <code>children</code> from a Server Component parent — never import it directly in a 'use client' file.",
        "Place <code>'use client'</code> as <strong>deep in the tree as possible</strong> — a layout or page should stay a Server Component; only interactive leaves need to be client.",
      ]} />
    </ChapterLayout>
  );
}
