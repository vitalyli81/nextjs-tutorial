// ─────────────────────────────────────────────────────────────────────────────
// Server Action file — _actions/guestbook.ts
//
// "use server" at the TOP of the file means:
//   Every exported function in this file becomes a Server Action.
//   Next.js automatically creates an encrypted POST endpoint for each one.
//   Client Components can import and call these functions directly — Next.js
//   handles the network request transparently.
//
// ALTERNATIVE: "use server" can also be placed inside a single function body
//   (inline Server Action) instead of at the top of the file:
//   export async function Page() {
//     async function save() { "use server"; await db.save(); }
//     return <form action={save}>…</form>
//   }
//
// SECURITY: Server Actions always run on the server. They can safely access
//   databases, read secrets, and write files — none of that code ships to
//   the browser. However, they ARE callable from the internet as POST
//   endpoints, so always validate inputs and check authentication.
// ─────────────────────────────────────────────────────────────────────────────

"use server";

// ── State type ─────────────────────────────────────────────────────────────
// Returned by the action and received by useActionState in the Client Component.
// Must be JSON-serializable (crosses the server → client boundary).
export type GuestbookState = {
  entries: { name: string; message: string; id: number }[];
  error?: string; // validation error message, if any
};

// ── In-memory "database" ───────────────────────────────────────────────────
// Resets every time the Node.js process restarts.
// In a real app this would be a database: await db.guestbook.findMany()
const entries: { name: string; message: string; id: number }[] = [
  { id: 1, name: "Alice", message: "Love Next.js Server Actions!" },
];
let nextId = 2;

// ── addEntry Server Action ─────────────────────────────────────────────────
// Signature required by useActionState:
//   (prevState: State, formData: FormData) => Promise<State>
//
// prevState — the state returned by the previous invocation (or the initial
//             state passed to useActionState). Useful for optimistic updates.
// formData  — the submitted form fields, accessed with formData.get("fieldName")
export async function addEntry(
  prevState: GuestbookState,   // previous state from useActionState
  formData: FormData           // native Web API — field values from the form
): Promise<GuestbookState> {

  // Simulate network/DB latency so the loading spinner is visible in the demo
  await new Promise(r => setTimeout(r, 600));

  // Read and sanitize inputs — formData.get() returns string | File | null
  const name    = (formData.get("name")    as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  // ── Server-side validation ──────────────────────────────────────────────
  // Always validate on the server even if you also validate on the client.
  // Client-side validation can be bypassed; server-side cannot.
  if (!name || !message) {
    // Return an error state — useActionState surfaces it via state.error
    return { entries: [...entries], error: "Both fields are required." };
  }
  if (message.length > 120) {
    return { entries: [...entries], error: "Message must be ≤120 characters." };
  }

  // ── Mutation ────────────────────────────────────────────────────────────
  // In a real app: await db.guestbook.create({ data: { name, message } })
  // In production you'd also call revalidatePath("/guestbook") here to bust
  // the Next.js cache and cause any cached page to re-render with fresh data.
  entries.push({ id: nextId++, name, message });

  // Return the new state — useActionState updates the UI with this
  return { entries: [...entries] };
}

// ── getEntries helper ──────────────────────────────────────────────────────
// Called by the page.tsx Server Component to load initial entries.
// Not a mutation — doesn't need to be a Server Action, but it's convenient
// to keep related data functions in the same file.
export async function getEntries(): Promise<GuestbookState> {
  return { entries: [...entries] };
}
