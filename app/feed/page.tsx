import { Suspense } from "react";
import VirtualFeed from "./_components/VirtualFeed";
import type { Post } from "../api/posts/route";

async function getFirstPage(): Promise<{ posts: Post[]; nextPage: number | null }> {
  // Absolute URL required for server-side fetch in Next.js Route Handlers
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/posts?page=1`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

async function Feed() {
  const { posts, nextPage } = await getFirstPage();
  return <VirtualFeed initialPosts={posts} initialNextPage={nextPage} />;
}

export default function FeedPage() {
  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center pt-20 pb-10 px-4">
      <div className="w-full max-w-2xl mb-6">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">Infinite Feed</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          200 posts · paginated API · virtual list · no libraries
        </p>
      </div>

      {/* Suspense streams in the first page while loading.tsx shows the skeleton */}
      <Suspense fallback={null}>
        <Feed />
      </Suspense>
    </main>
  );
}
