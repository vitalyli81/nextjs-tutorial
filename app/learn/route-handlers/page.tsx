// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 7 — Route Handlers
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • route.ts             — file convention; exports named HTTP handler functions
//                            (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
//   • NextRequest          — extended Web Request with helpers (nextUrl, cookies…)
//   • NextResponse         — extended Web Response (.json(), .redirect()…)
//   • URL conventions      — app/api/name/route.ts → /api/name
//   • No page.tsx conflict — a folder can have route.ts OR page.tsx, not both
//   • Route Handlers vs Server Actions — when to use each
//
// This PAGE is a Server Component (no "use client").
// RouteHandlerDemo is a Client Component — it uses fetch() and useState to
// make live GET and POST requests against /api/learn-demo.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";
import { RouteHandlerDemo } from "./_components/RouteHandlerDemo";

export const metadata: Metadata = { title: "Route Handlers" };

export default function RouteHandlersPage() {
  return (
    <ChapterLayout
      slug="route-handlers"
      title="Route Handlers"
      docsHref="https://nextjs.org/docs/app/getting-started/route-handlers-and-middleware"
    >
      {/* ── Demo 1: route.ts file convention ──────────────────────────── */}
      <Demo concept="route.ts" title="Export named HTTP functions — GET, POST, PUT, DELETE…">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          Create a{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">route.ts</code> file
          inside <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">app/</code>.
          Export async functions named after HTTP methods — Next.js routes incoming requests
          to the matching export automatically. No Express, no manual routing.
        </p>
        <CodeBlock>{`// app/api/learn-demo/route.ts  →  accessible at /api/learn-demo
import { NextRequest, NextResponse } from "next/server";

// Handles GET /api/learn-demo and GET /api/learn-demo?search=xxx
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search") ?? "";
  const results = search
    ? db.filter(item => item.text.toLowerCase().includes(search.toLowerCase()))
    : db;
  // NextResponse.json() serializes the object and sets Content-Type: application/json
  return NextResponse.json({ results, total: db.length });
}

// Handles POST /api/learn-demo  (body: { text: string })
export async function POST(req: NextRequest) {
  const body = await req.json();          // parse JSON request body
  if (!body?.text?.trim()) {
    // Return a 400 with an error payload
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  const item = { id: nextId++, text: body.text.trim() };
  db.push(item);
  return NextResponse.json({ item }, { status: 201 }); // 201 Created
}`}
        </CodeBlock>
        <Callout kind="rule">
          A folder cannot have both <code>route.ts</code> and <code>page.tsx</code> —
          they would conflict on the same URL. Keep API routes in <code>app/api/</code>
          to separate them from pages.
        </Callout>
      </Demo>

      {/* ── Demo 2: Live interactive demo ─────────────────────────────── */}
      <Demo concept="Live demo — /api/learn-demo" title="Test GET (search) and POST (create) against the real endpoint">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
          The inputs below call <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/api/learn-demo</code>{" "}
          with real <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">fetch()</code> requests.
          Watch the status bar — it shows the HTTP status code and response body.
        </p>
        {/* RouteHandlerDemo is a Client Component — uses useState + fetch().
            It calls the route handler defined in app/api/learn-demo/route.ts. */}
        <RouteHandlerDemo />
      </Demo>

      {/* ── Demo 3: NextRequest + NextResponse API ─────────────────────── */}
      <Demo concept="NextRequest + NextResponse" title="Extended Request/Response with Next.js helpers">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          Next.js extends the standard Web{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">Request</code> and{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">Response</code> with
          extra helpers — no need to import the browser globals.
        </p>
        <CodeBlock>{`import { NextRequest, NextResponse } from "next/server";

// ── Reading from the request ──────────────────────────────────────
req.nextUrl.searchParams.get("key")   // query string: GET /api?key=value
req.nextUrl.pathname                  // "/api/learn-demo"
await req.json()                      // parse JSON body (POST/PUT/PATCH)
await req.formData()                  // parse multipart/form-data body
req.headers.get("Authorization")      // read a specific header
req.cookies.get("session")            // read a cookie

// ── Building responses ────────────────────────────────────────────
NextResponse.json({ data }, { status: 200 })           // JSON response
NextResponse.redirect(new URL("/login", req.url))      // redirect
new NextResponse("plain text", { status: 200 })        // plain text
new NextResponse(null, { status: 204 })                // no content`}
        </CodeBlock>
      </Demo>

      {/* ── Demo 4: Route Handlers vs Server Actions ───────────────────── */}
      <Demo concept="Route Handlers vs Server Actions" title="Same goal, different use cases — pick the right tool">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">
          Both can mutate data, but they serve different audiences:
        </p>
        <div className="text-sm text-zinc-600 dark:text-zinc-300 space-y-3">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
            <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">Route Handler (route.ts)</p>
            <p>
              Public HTTP API — use when <strong>other clients</strong> call it:
              mobile app, third-party service, <code>curl</code>, Postman, a partner&apos;s backend.
              You explicitly handle JSON parsing, status codes, and auth headers.
            </p>
          </div>
          <div className="rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-3">
            <p className="font-semibold text-purple-700 dark:text-purple-300 mb-1">Server Action (&apos;use server&apos;)</p>
            <p>
              Internal mutation — use when <strong>only your own Next.js UI</strong> triggers it.
              No manual <code>fetch()</code> needed — Next.js handles the transport transparently.
              Works with <code>useActionState</code> for forms.
            </p>
          </div>
        </div>
        <CodeBlock>{`// ✓ Route Handler — external API, public endpoint
// app/api/webhooks/stripe/route.ts
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  // ... verify and process webhook from Stripe
}

// ✓ Server Action — internal form mutation, no external callers
// _actions/create-post.ts
"use server";
export async function createPost(prevState, formData: FormData) {
  // ... insert into DB, revalidatePath(), return new state
}`}
        </CodeBlock>
        <Callout kind="tip">
          If you&apos;re building a Next.js-only feature (a form, a button), prefer Server Actions —
          less boilerplate and built-in progressive enhancement.
          If you need other apps to call your endpoint over HTTP, use a Route Handler.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "File convention: <code>app/api/name/route.ts</code> → URL <code>/api/name</code>. Export async functions named after HTTP methods: <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>DELETE</code>, <code>PATCH</code>, <code>HEAD</code>, <code>OPTIONS</code>.",
        "A folder cannot have both <code>route.ts</code> and <code>page.tsx</code> — they'd conflict on the same URL. Keep API routes under <code>app/api/</code>.",
        "Import <code>NextRequest</code> and <code>NextResponse</code> from <code>'next/server'</code>. Use <code>req.nextUrl.searchParams</code> for query params, <code>await req.json()</code> for request body.",
        "<code>NextResponse.json(data, { status })</code> returns a JSON response. Use status 201 for created, 400 for bad request, 404 for not found, 200 (default) for success.",
        "Route Handlers run on the server — they can access databases, read <code>process.env</code> secrets, and never expose internals to the browser.",
        "Use <strong>Route Handlers</strong> for public HTTP APIs callable by external clients (mobile apps, third parties, webhooks). Use <strong>Server Actions</strong> for mutations triggered only by your own Next.js UI.",
        "Dynamic route segments work in route.ts too: <code>app/api/posts/[id]/route.ts</code> receives <code>{ params: Promise&lt;{ id: string }&gt; }</code> as the second argument.",
      ]} />
    </ChapterLayout>
  );
}
