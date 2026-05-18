// ─────────────────────────────────────────────────────────────────────────────
// Dynamic route demo — app/learn/layouts-and-pages/post/[slug]/page.tsx
//
// KEY CONCEPTS:
//   • [slug] folder  — the square brackets make this a dynamic segment.
//                      Any URL like /post/anything matches this file.
//   • params prop    — Next.js passes the matched segment value(s) here.
//                      In Next.js 15 params is a Promise — must be awaited.
//   • generateMetadata — async function that reads params to build a dynamic
//                      <title> tag for each individual post page.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import Link from "next/link";
import { ChapterLayout } from "../../../_components/ChapterLayout";

// Props type — both params and searchParams are Promises in Next.js 15
type Props = { params: Promise<{ slug: string }> };

// ── generateMetadata ───────────────────────────────────────────────────────
// Called by Next.js before rendering — produces the <title> and any other
// metadata tags for this specific page instance.
// Because params is a Promise, we must await it here too.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // Returns a dynamic title like "Post: nextjs-basics | Next.js Tutorial"
  return { title: `Post: ${slug}` };
}

// ── Mock data store ────────────────────────────────────────────────────────
// In a real app this would be a database query: db.post.findUnique({ slug })
// Here we use a plain object so there are no external dependencies.
const posts: Record<string, { title: string; body: string }> = {
  "nextjs-basics":    { title: "Next.js Basics",   body: "Next.js is a React framework for building full-stack web apps with the App Router." },
  "react-tips":       { title: "React Tips",        body: "Use hooks, keep components small, and lift state only when needed." },
  "typescript-guide": { title: "TypeScript Guide",  body: "TypeScript adds static types to JavaScript, catching bugs at compile time." },
};

// ── Page component ─────────────────────────────────────────────────────────
// async so we can await params (required in Next.js 15)
export default async function PostPage({ params }: Props) {
  // Await params to get the actual slug string from the URL
  const { slug } = await params;

  // Look up the post — undefined if someone visits an unknown slug
  const post = posts[slug];

  return (
    // Reuses the ChapterLayout shell so this demo page looks consistent
    // with the rest of the /learn section.
    <ChapterLayout
      slug="layouts-and-pages"
      title="Layouts & Pages"
      docsHref="https://nextjs.org/docs/app/getting-started/layouts-and-pages"
    >
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-6 space-y-3">
        {/* Show the raw params value so learners can see what Next.js provides */}
        <p className="text-xs font-mono text-blue-500">
          params.slug = <strong>&quot;{slug}&quot;</strong>
        </p>

        {post ? (
          <>
            <h2 className="text-xl font-bold text-zinc-800 dark:text-white">{post.title}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{post.body}</p>
          </>
        ) : (
          // Handles unknown slugs — in a real app you'd call notFound() here
          <p className="text-red-500 text-sm">
            Post &quot;{slug}&quot; not found — try one of the valid slugs from the chapter page.
          </p>
        )}

        {/* Back link — plain <Link> for client-side navigation */}
        <Link href="/learn/layouts-and-pages" className="inline-block pt-2 text-sm text-blue-500 hover:underline">
          ← Back to chapter
        </Link>
      </div>
    </ChapterLayout>
  );
}
