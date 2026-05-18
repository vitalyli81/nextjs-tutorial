// not-found-demo/page.tsx — demonstrates notFound() in a Server Component.
//
// HOW IT WORKS:
//   notFound() is imported from "next/navigation".
//   When called, it throws internally (like redirect()) and halts execution.
//   Next.js renders the nearest not-found.tsx in the route hierarchy instead.
//   This page's not-found.tsx is in the same folder.
//
// FILE CONVENTION:
//   not-found.tsx must be placed next to (or above) the page that calls notFound().
//   The NEAREST ancestor not-found.tsx wins — just like error.tsx bubble-up.
//
// HTTP STATUS:
//   The response gets a 404 HTTP status code automatically when notFound() is used.

import { notFound } from "next/navigation";

// This page ALWAYS calls notFound() — it exists only to demo the pattern.
// In a real app you'd call notFound() conditionally:
//   const post = await db.post.findUnique({ where: { slug } });
//   if (!post) notFound();
export default function NotFoundDemo() {
  // notFound() throws internally — nothing after this line executes.
  notFound();
}
