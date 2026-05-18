// GuestbookForm — Client Component that wires a Server Action to a form.
//
// WHY "use client"?
//   useActionState is a React hook — hooks only work in Client Components.
//   The form itself and the inputs are interactive (controlled/uncontrolled),
//   and we need the pending boolean to show a spinner.
//
// KEY PATTERN: useActionState
//   const [state, action, pending] = useActionState(serverAction, initialState)
//
//   state   — the latest value RETURNED by the server action (or initialState
//             before the first submission). Used to display entries and errors.
//   action  — a wrapped version of the server action. Pass this to <form action>.
//   pending — true while the server action is executing. Use it to disable the
//             submit button and show a spinner.
//
// PROGRESSIVE ENHANCEMENT:
//   <form action={action}> works without JavaScript — the browser submits a
//   native POST. The spinner and instant feedback are layered on top by React.

"use client";

import { useActionState } from "react";
import { addEntry, type GuestbookState } from "../_actions/guestbook";

interface GuestbookFormProps {
  initial: GuestbookState;
}

export function GuestbookForm({ initial }: GuestbookFormProps) {
  // useActionState wires the server action to this component.
  // initial — loaded by the parent Server Component and passed as a prop.
  const [state, action, pending] = useActionState(addEntry, initial);
  // state   = latest GuestbookState returned by addEntry (or `initial`)
  // action  = the action function to pass to <form action={…}>
  // pending = true while addEntry is executing on the server

  return (
    <div className="space-y-4">
      {/* Pass `action` to the form — Next.js intercepts the submit and calls
          the server action instead of doing a traditional page reload. */}
      <form action={action} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* name="name" — the field key used in formData.get("name") server-side */}
          <input
            name="name"
            placeholder="Your name"
            required
            className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-800 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* name="message" — read with formData.get("message") in the action */}
          <input
            name="message"
            placeholder="Your message (max 120 chars)"
            required
            maxLength={120}
            className="flex-[2] rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-800 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={pending} // prevent double-submit while the action is running
            className="rounded-lg bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2"
          >
            {/* Spinner — only visible while pending is true */}
            {pending && (
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {pending ? "Adding…" : "Add entry"}
          </button>
        </div>

        {/* Server-side validation error from the returned state.
            aria-live="polite" announces the error to screen readers. */}
        {state.error && (
          <p aria-live="polite" className="text-sm text-red-500">
            {state.error}
          </p>
        )}
      </form>

      {/* Entry list — populated from state.entries which is returned by the action.
          After each submission, the action returns the updated list and React
          re-renders this section without a page reload. */}
      <ul className="space-y-2">
        {state.entries.map(e => (
          <li
            key={e.id}
            className="rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 px-3 py-2 text-sm"
          >
            <span className="font-medium text-zinc-800 dark:text-white">{e.name}</span>
            <span className="text-zinc-400 mx-2">·</span>
            <span className="text-zinc-600 dark:text-zinc-300">{e.message}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
