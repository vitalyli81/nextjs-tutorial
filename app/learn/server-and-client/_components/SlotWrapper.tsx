// SlotWrapper — demonstrates the "children as slot" interleaving pattern.
//
// THE PATTERN:
//   A Client Component can receive Server Component output as `children`.
//   The server renders the child first, then passes the resulting HTML
//   as an opaque prop to the Client Component.
//
//   Server page:
//     <SlotWrapper>
//       <ServerBox />   ← Server Component rendered on the server
//     </SlotWrapper>
//
//   SlotWrapper never re-renders <ServerBox> on the client — it just
//   shows/hides the already-rendered HTML it received.
//
// WHY THIS MATTERS:
//   You CANNOT import a Server Component inside a "use client" file.
//   But you CAN receive server-rendered output as children from a server parent.
//   This lets you wrap interactive UI around server-fetched content without
//   pulling that content into the client bundle.
//
// RULE: The server parent (page.tsx) controls what goes in the slot.
//       The client child (SlotWrapper) controls how it's displayed.

"use client";

import { useState } from "react";

export function SlotWrapper({ children }: { children: React.ReactNode }) {
  // Client-side toggle — this is why "use client" is needed
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      {/* Toggle button — purely client-side interaction */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2 bg-zinc-50 dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-200"
      >
        <span>Client wrapper — click to toggle</span>
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {/* children = the already-rendered server HTML passed from the parent page */}
      {open && (
        <div className="p-4 bg-white dark:bg-zinc-900">
          {children}
        </div>
      )}
    </div>
  );
}
