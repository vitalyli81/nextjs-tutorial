// ─────────────────────────────────────────────────────────────────────────────
// Route Handler — app/api/learn-demo/route.ts
//
// URL: /api/learn-demo
//
// FILE CONVENTION:
//   "route.ts" inside any app/ folder creates an HTTP endpoint at that path.
//   Export named async functions corresponding to HTTP methods:
//     GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
//   Next.js routes incoming requests to the matching export automatically.
//
// NO "use server" NEEDED:
//   Route handlers always run on the server — no directive required.
//   They are NOT Server Actions; they are standalone HTTP endpoints.
//
// IMPORTS:
//   NextRequest  — extends the Web Request API with nextUrl, cookies, etc.
//   NextResponse — extends the Web Response API with .json(), .redirect(), etc.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

// ── In-memory "database" ───────────────────────────────────────────────────
// Resets on every server restart. In a real app this would be a real DB call.
const db: { id: number; text: string }[] = [
  { id: 1, text: "Learn Next.js" },
  { id: 2, text: "Build something cool" },
];
let nextId = 3;

// ── GET /api/learn-demo ────────────────────────────────────────────────────
// Optional query param: ?search=keyword — filters results by text (case-insensitive)
// Response: { results: Item[], total: number }
export async function GET(req: NextRequest) {
  // req.nextUrl is a Next.js-extended URL object — searchParams is always available
  const search = req.nextUrl.searchParams.get("search") ?? "";

  const results = search
    ? db.filter(item => item.text.toLowerCase().includes(search.toLowerCase()))
    : db; // no filter — return everything

  // NextResponse.json() serializes the object and sets Content-Type: application/json
  return NextResponse.json({ results, total: db.length });
}

// ── POST /api/learn-demo ───────────────────────────────────────────────────
// Body: { text: string }
// Response: { item: Item } with HTTP 201 Created, or { error } with HTTP 400
export async function POST(req: NextRequest) {
  // await req.json() parses the JSON body — only available for methods with a body
  const body = await req.json();

  // Server-side validation — never trust client input
  if (!body?.text?.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const item = { id: nextId++, text: body.text.trim() };
  db.push(item);

  // 201 Created — standard HTTP status for a successful resource creation
  return NextResponse.json({ item }, { status: 201 });
}
