// Counter — a minimal Client Component demonstrating useState + event handlers.
//
// WHY "use client"?
//   useState and onClick are browser-only APIs. Adding "use client" at the top
//   of this file tells Next.js to include it in the JavaScript bundle that is
//   sent to the browser. Everything this file imports is also pulled into the
//   client bundle.
//
// KEY POINT: "use client" is a BOUNDARY directive, not a component attribute.
//   Every component in this file AND its imports become client code.
//   Place "use client" as DEEP in the tree as possible to keep the bundle small.
//
// Props:
//   label        — text shown next to the counter (passed from Server Component)
//   initialCount — starting value, defaults to 0. Demonstrates server → client
//                  prop passing (the value is serialized to JSON at the boundary).

"use client";

import { useState } from "react";

export function Counter({
  label,
  initialCount = 0,
}: {
  label: string;
  initialCount?: number; // optional — server can pass a computed starting value
}) {
  // useState initialises with the server-provided value.
  // After hydration, state lives entirely on the client — the server is no longer involved.
  const [count, setCount] = useState(initialCount);

  return (
    <div className="flex items-center gap-3">
      {/* Decrement button — onClick is a client-side event handler */}
      <button
        onClick={() => setCount(c => c - 1)}
        className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm transition-colors"
      >
        −
      </button>

      {/* Current count — re-renders on every click thanks to useState */}
      <span className="text-sm font-mono w-8 text-center">{count}</span>

      {/* Increment button */}
      <button
        onClick={() => setCount(c => c + 1)}
        className="w-7 h-7 rounded-full border border-zinc-300 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm transition-colors"
      >
        +
      </button>

      {/* Label comes from the parent — a serializable string prop */}
      <span className="text-xs text-zinc-400">{label}</span>
    </div>
  );
}
