// Server Component page — no async data needed here because the todo list
// lives entirely in the client via Zustand + localStorage. The page's only
// job is to render the client component tree.
// Metadata is exported from layout.tsx one level up.

import TodoApp from "./_components/TodoApp";

export default function TodoPage() {
  return <TodoApp />;
}
