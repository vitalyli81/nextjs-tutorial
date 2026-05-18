// ErrorThrower — Client Component that demonstrates error.tsx in action.
//
// HOW IT WORKS:
//   When the button is clicked, `boom` state is set to true.
//   On the next render, the component throws an Error.
//   React's error boundary (wired up by error.tsx in this route segment)
//   catches the thrown error and renders the error.tsx fallback UI.
//
// WHY useTransition?
//   Wrapping setBoom in startTransition ensures React treats this as a
//   non-urgent update. Without it, throwing during an event handler can
//   behave differently across React versions. useTransition makes the
//   throw happen during a render, where error boundaries reliably catch it.
//
// WHY "use client"?
//   useState, useTransition, and onClick are all client-only APIs.
//   This component is the interactive leaf that triggers the demo.

"use client";

import { useState, useTransition } from "react";

export function ErrorThrower() {
  // boom = true causes the component to throw on the next render,
  // which triggers the error.tsx boundary in this route segment.
  const [boom, setBoom] = useState(false);

  // useTransition lets us start the throw inside a React transition,
  // ensuring error boundaries reliably catch it as a render-phase error.
  const [, start] = useTransition();

  // Throw during render (not during the event handler) so React's error
  // boundary mechanism intercepts it correctly.
  if (boom) throw new Error("Intentional demo error — caught by error.tsx boundary!");

  return (
    <div className="space-y-2">
      {/* Clicking this sets boom=true → next render throws → error.tsx catches it */}
      <button
        onClick={() => start(() => setBoom(true))}
        className="rounded-lg bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm font-medium transition-colors"
      >
        Throw a render error
      </button>
      <p className="text-xs text-zinc-400">
        The error.tsx in this route will catch it and show a recovery UI with a Reset button.
      </p>
    </div>
  );
}
