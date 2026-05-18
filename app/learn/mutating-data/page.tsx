// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 5 — Mutating Data
//
// KEY NEXT.JS CONCEPTS IN THIS FILE:
//   • "use server"         — marks a file/function as a Server Action
//   • Server Action        — async function callable from a form or client button,
//                            runs exclusively on the server
//   • useActionState       — React hook that wires a Server Action to a form and
//                            tracks pending state + returned state
//   • FormData             — native Web API for reading submitted form fields
//   • revalidatePath()     — invalidates the Next.js cache so page re-renders
//   • redirect()           — server-side navigation after a successful mutation
//   • Progressive enhance  — forms with Server Actions work without JavaScript
//
// This PAGE is a Server Component (no "use client").
// It loads the initial guestbook entries server-side via getEntries() and passes
// them as a prop to GuestbookForm, which is a Client Component.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";
import { GuestbookForm } from "./_components/GuestbookForm";
import { getEntries } from "./_actions/guestbook";

// metadata must be typed as Metadata from "next" — tells Next.js this is a
// valid metadata export and enables IDE auto-complete for all metadata fields.
export const metadata: Metadata = { title: "Mutating Data" };

export default async function MutatingDataPage() {
  // Load initial guestbook entries on the server before rendering.
  // This is NOT a Server Action — getEntries() is a plain async function.
  // The result is serialized to JSON and passed as a prop to GuestbookForm.
  // GuestbookForm (Client Component) uses it as the initialState for useActionState.
  const initial = await getEntries();

  return (
    <ChapterLayout
      slug="mutating-data"
      title="Mutating Data"
      docsHref="https://nextjs.org/docs/app/getting-started/mutating-data"
    >
      {/* ── Demo 1: Server Action basics ───────────────────────────────── */}
      <Demo concept="Server Action" title="A function that runs on the server — called directly from a form or button">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Mark a file with{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&apos;use server&apos;</code>{" "}
          at the top, or put it inside a single function body.
          Next.js automatically creates an <strong>encrypted POST endpoint</strong> for each exported
          function — no API route file needed. Client code can import and call these functions
          as if they were local, but they always execute on the server.
        </p>
        <CodeBlock>{`// Option A — "use server" at the top of the file:
//   Every exported function in this file becomes a Server Action.
"use server";

export async function addEntry(prevState, formData: FormData) {
  const name    = formData.get("name");     // native Web API
  const message = formData.get("message");
  await db.guestbook.create({ data: { name, message } }); // direct DB access
  revalidatePath("/guestbook");             // bust cache → re-render the page
  return { success: true };
}

// Option B — "use server" inside a single function (inline Server Action):
export default function Page() {
  async function save(formData: FormData) {
    "use server";   // ← only THIS function is a Server Action
    await db.save(formData.get("name"));
  }
  return <form action={save}>…</form>;
}`}
        </CodeBlock>
        <Callout kind="rule">
          Server Actions run <strong>on the server</strong> even when called from a Client Component.
          They can safely access databases, env secrets, and file systems.
          However, they ARE reachable as HTTP POST endpoints — always validate inputs
          and check authentication inside the action.
        </Callout>
      </Demo>

      {/* ── Demo 2: useActionState — live guestbook ────────────────────── */}
      <Demo concept="useActionState" title="Tracks pending state and action result — live guestbook below">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">useActionState</code> is a
          React hook that wires a Server Action to a form. It returns three values:
          the latest state returned by the action, a wrapped action function to pass to{" "}
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">&lt;form action&gt;</code>,
          and a <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">pending</code> boolean.
          Try submitting the guestbook below:
        </p>

        {/* GuestbookForm is a Client Component — it needs useActionState (a hook).
            We pass `initial` (loaded by this Server Component) as the initialState
            so the form renders with existing entries on first paint. */}
        <GuestbookForm initial={initial} />

        <CodeBlock>{`// GuestbookForm.tsx — "use client" because useActionState is a hook
"use client";
import { useActionState } from "react";
import { addEntry } from "../_actions/guestbook";

// Signature: useActionState(serverAction, initialState)
// Returns:  [latestState, actionFn, isPending]
const [state, action, pending] = useActionState(addEntry, initialState);
//      ↑ latest return value from addEntry
//              ↑ pass this to <form action={…}>
//                       ↑ true while the server action is running

// The action's signature MUST be: (prevState, formData) => Promise<State>
// prevState — what the action returned last time (or initialState)
// formData  — the submitted form fields (native Web API)

return (
  <form action={action}>
    <input name="name" />                           {/* formData.get("name") */}
    <button disabled={pending}>                     {/* prevent double-submit */}
      {pending ? "Saving…" : "Submit"}
    </button>
    {state.error && <p aria-live="polite">{state.error}</p>}
  </form>
);`}
        </CodeBlock>
        <Callout kind="rule">
          Forms with a Server Action <code>action</code> work <strong>without JavaScript</strong>{" "}
          (progressive enhancement) — the browser submits a native POST.
          The spinner, validation UI, and instant updates are layered on top by React when JS loads.
        </Callout>
      </Demo>

      {/* ── Demo 3: Server Action lifecycle ────────────────────────────── */}
      <Demo concept="Lifecycle" title="What happens step-by-step when the form submits">
        <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          {[
            ["1", "User submits the form. Next.js intercepts and sends a POST to the action's endpoint (or the browser does a native POST if JS is not loaded — progressive enhancement)."],
            ["2", "Server Action runs on the server. It can validate inputs, read secrets, and write to the database."],
            ["3", "Action returns new state as a plain object. useActionState updates the component with the returned value (pending goes false, state gets the new value)."],
            ["4", "Call revalidatePath('/path') or revalidateTag('tag') inside the action to invalidate the Next.js cache and re-render any cached Server Components that show the mutated data."],
            ["5", "Or call redirect('/success') to navigate the user to another route after a successful mutation. redirect() throws internally — don't wrap it in try/catch."],
          ].map(([n, text]) => (
            <div key={n} className="flex items-start gap-3">
              {/* Step number badge */}
              <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-500 text-xs flex items-center justify-center shrink-0 mt-0.5">{n}</span>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <CodeBlock>{`// Inside a Server Action — after a successful mutation:

// Option 1: stay on the page, refresh cached data
import { revalidatePath } from "next/cache";
revalidatePath("/guestbook");         // bust cache for /guestbook
// or bust a tag shared across multiple pages:
revalidateTag("guestbook");           // all fetches tagged "guestbook"

// Option 2: navigate away after success
import { redirect } from "next/navigation";
redirect("/guestbook");               // server-side redirect — throws internally
                                      // do NOT put inside try/catch`}
        </CodeBlock>
        <Callout kind="tip">
          <strong>Server Actions vs Route Handlers:</strong> Use Server Actions for mutations
          triggered by your own UI (forms, buttons). Use Route Handlers (
          <code>app/api/…/route.ts</code>) when you need a public REST endpoint callable
          by external clients, mobile apps, or third-party integrations.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "<strong>'use server'</strong> at the top of a file turns every exported async function into a Server Action. Next.js creates an encrypted POST endpoint for each one automatically.",
        "Alternatively, place <code>'use server'</code> inside a single function body to make only that function a Server Action (inline Server Action).",
        "<strong>useActionState</strong> signature: <code>const [state, action, pending] = useActionState(serverFn, initialState)</code>. <code>state</code> = latest return value, <code>action</code> = pass to <code>&lt;form action&gt;</code>, <code>pending</code> = true while running.",
        "Server Action signature: <code>(prevState: State, formData: FormData) =&gt; Promise&lt;State&gt;</code>. <code>prevState</code> is what the action returned last time; <code>formData.get('field')</code> reads submitted fields.",
        "Call <code>revalidatePath('/path')</code> or <code>revalidateTag('tag')</code> inside an action to bust the Next.js cache and force re-render of stale Server Components.",
        "Call <code>redirect('/path')</code> inside an action to navigate after success. It throws internally — never wrap it in try/catch.",
        "Forms with Server Actions are <strong>progressively enhanced</strong>: they submit a native POST without JS. Spinners and optimistic UI are added on top when JS is available.",
        "Always validate and authenticate inside Server Actions — they are reachable as POST endpoints from anywhere on the internet.",
      ]} />
    </ChapterLayout>
  );
}
