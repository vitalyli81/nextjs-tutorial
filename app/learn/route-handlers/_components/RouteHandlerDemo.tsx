// RouteHandlerDemo — Client Component for the interactive Route Handlers demo.
//
// WHY "use client"?
//   This component uses useState (local UI state) and calls fetch() in response
//   to button clicks — both require client-side JavaScript.
//
// WHAT IT DOES:
//   • GET section — sends GET /api/learn-demo (with optional ?search= query param)
//                   and displays the HTTP status + returned items
//   • POST section — sends POST /api/learn-demo { text } and shows the created item
//
// The endpoint lives at app/api/learn-demo/route.ts.
// After POST, hit GET again to see the new item appear in the list.

"use client";

import { useState } from "react";

type Item = { id: number; text: string };

export function RouteHandlerDemo() {
  // items — results returned by the most recent GET request
  const [items, setItems] = useState<Item[]>([]);
  // total — total count of items in the server-side "database"
  const [total, setTotal] = useState<number | null>(null);
  // search — value of the ?search= query param
  const [search, setSearch] = useState("");
  // newText — body text for the POST request
  const [newText, setNewText] = useState("");
  // status lines shown below each section
  const [getStatus, setGetStatus] = useState("");
  const [postStatus, setPostStatus] = useState("");
  // loading — tracks which request is in-flight to disable the right button
  const [loading, setLoading] = useState<"get" | "post" | null>(null);

  // ── GET handler ──────────────────────────────────────────────────────────
  async function handleGet() {
    setLoading("get");
    setGetStatus("");
    try {
      // Build the URL — append ?search= only when the user typed something
      const url = search
        ? `/api/learn-demo?search=${encodeURIComponent(search)}`
        : "/api/learn-demo";
      const res = await fetch(url); // standard browser fetch()
      const data = await res.json();
      setItems(data.results);
      setTotal(data.total);
      setGetStatus(`200 OK — ${data.results.length} result(s), ${data.total} total in db`);
    } catch {
      setGetStatus("Network error");
    } finally {
      setLoading(null);
    }
  }

  // ── POST handler ─────────────────────────────────────────────────────────
  async function handlePost() {
    if (!newText.trim()) return;
    setLoading("post");
    setPostStatus("");
    try {
      const res = await fetch("/api/learn-demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // required so req.json() parses correctly
        body: JSON.stringify({ text: newText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Route handler returned a 4xx — show the error message
        setPostStatus(`${res.status} — ${data.error}`);
      } else {
        setPostStatus(`201 Created — id: ${data.item.id}, text: "${data.item.text}"`);
        setNewText(""); // clear the input after success
      }
    } catch {
      setPostStatus("Network error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* ── GET section ─────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          GET /api/learn-demo
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGet()} // submit on Enter
            placeholder="?search= (leave empty for all)"
            className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGet}
            disabled={loading === "get"}
            className="rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            {loading === "get" ? "Fetching…" : "Send GET"}
          </button>
        </div>
        {/* Status line — shows HTTP status and result count */}
        {getStatus && (
          <p className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded text-green-600 dark:text-green-400">
            {getStatus}
          </p>
        )}
        {/* Item list — rendered after a successful GET */}
        {items.length > 0 && (
          <ul className="font-mono text-xs space-y-1">
            {items.map((item) => (
              <li key={item.id} className="flex gap-2">
                <span className="text-zinc-400">#{item.id}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <hr className="border-zinc-200 dark:border-zinc-700" />

      {/* ── POST section ────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          POST /api/learn-demo {"{ text: string }"}
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePost()}
            placeholder="New item text…"
            className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handlePost}
            disabled={loading === "post" || !newText.trim()} // disabled when empty or in-flight
            className="rounded-lg bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-4 py-2 text-sm font-medium transition-colors"
          >
            {loading === "post" ? "Posting…" : "Send POST"}
          </button>
        </div>
        {/* Status line — shows 201 Created or 400 error */}
        {postStatus && (
          <p className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-3 py-2 rounded text-emerald-600 dark:text-emerald-400">
            {postStatus}
          </p>
        )}
        <p className="text-xs text-zinc-400">
          After posting, hit Send GET to see the new item appear in the db.
        </p>
      </div>
    </div>
  );
}
