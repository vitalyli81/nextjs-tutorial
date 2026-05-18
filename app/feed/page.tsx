// RSC page — runs on the server.
// Fetches the first page of posts by calling getPostsPage() directly (no HTTP
// round-trip). Subsequent pages are loaded client-side via the Route Handler.
//
// Streaming pattern:
//   - loading.tsx renders immediately as a skeleton while <Feed> awaits data.
//   - <Suspense> inside this page allows the shell (h1, description) to stream
//     first, then the feed content streams in without a full-page stall.

import { Suspense } from "react";
import VirtualFeed from "./_components/VirtualFeed";
import { getPostsPage } from "./_lib/posts";

// Opt out of static rendering — posts are dynamic and shouldn't be cached.
export const dynamic = "force-dynamic";

// Inner async component so Suspense can stream it independently of the shell.
async function Feed() {
  const { posts, nextPage } = getPostsPage(1);
  return <VirtualFeed initialPosts={posts} initialNextPage={nextPage} />;
}

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center pt-20 pb-10 px-4">
      {/* Shell — renders immediately before Feed resolves */}
      <div className="w-full max-w-2xl mb-6">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Infinite Feed</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          200 posts · paginated API · virtual list · no libraries
        </p>
      </div>

      {/* Suspense streams in the first page; loading.tsx shows the skeleton */}
      <Suspense fallback={null}>
        <Feed />
      </Suspense>
    </main>
  );
}
