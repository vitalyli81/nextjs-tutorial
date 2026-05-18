"use client";

// VirtualFeed — client component that renders a virtual scrolling list.
//
// Virtual list pattern:
//   Only the rows currently in (or near) the viewport are mounted in the DOM.
//   A full-height spacer div preserves the correct scrollbar size.
//   Each visible row is absolutely positioned at `index * ITEM_HEIGHT`.
//
// Infinite scroll:
//   useInfiniteScroll watches a 1px sentinel div at the bottom of the scroll
//   container. When it enters the viewport the next page is fetched from the
//   Route Handler and appended to the posts array.

import { useState, useCallback } from "react";
import type { Post } from "../_lib/posts";
import { useContainerHeight } from "../_hooks/useContainerHeight";
import { useInfiniteScroll } from "../_hooks/useInfiniteScroll";

// Fixed row height — required for virtual list math. Must match PostCard CSS.
const ITEM_HEIGHT = 100; // px
// Extra rows rendered above and below the visible window to reduce blank flash on fast scroll.
const OVERSCAN = 3;

interface VirtualFeedProps {
  initialPosts: Post[];
  // null means we're already on the last page.
  initialNextPage: number | null;
}

export default function VirtualFeed({ initialPosts, initialNextPage }: VirtualFeedProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [nextPage, setNextPage] = useState<number | null>(initialNextPage);
  const [loading, setLoading] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);

  const { ref: containerRef, height: containerHeight } = useContainerHeight();

  // Fetch the next page and append posts; wrapped in useCallback so the
  // IntersectionObserver effect only re-subscribes when nextPage changes.
  const loadMore = useCallback(async () => {
    if (!nextPage || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts?page=${nextPage}`);
      const data = await res.json();
      setPosts((prev) => [...prev, ...data.posts]);
      setNextPage(data.nextPage);
    } finally {
      setLoading(false);
    }
  }, [nextPage, loading]);

  const { sentinelRef } = useInfiniteScroll(loadMore);

  // ── Virtual list math ──────────────────────────────────────────────────────
  const totalHeight = posts.length * ITEM_HEIGHT;
  // First row index to render, clamped so overscan never goes below 0.
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT) + OVERSCAN * 2;
  const endIndex = Math.min(posts.length - 1, startIndex + visibleCount);
  const visiblePosts = posts.slice(startIndex, endIndex + 1);

  return (
    <div className="w-full max-w-2xl flex flex-col gap-4">
      <p className="text-xs text-zinc-400 text-right">{posts.length} posts loaded</p>

      {/* Scrollable virtual container */}
      <div
        ref={containerRef}
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        className="relative overflow-y-auto rounded-xl"
        style={{ height: "70vh" }}
      >
        {/* Full-height spacer — makes the scrollbar reflect the true list length */}
        <div style={{ height: totalHeight, position: "relative" }}>
          {visiblePosts.map((post, i) => (
            <div
              key={post.id}
              style={{
                position: "absolute",
                top: (startIndex + i) * ITEM_HEIGHT,
                left: 0,
                right: 0,
                height: ITEM_HEIGHT,
                padding: "6px 0",
              }}
            >
              <PostCard post={post} />
            </div>
          ))}
        </div>

        {/* Sentinel lives at the very bottom of the scroll container */}
        <div
          ref={sentinelRef}
          style={{ position: "absolute", bottom: 0, height: 1, width: "100%" }}
        />
      </div>

      {/* Status bar below the scroll box */}
      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-zinc-400 py-2">
          <span className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
          Loading more…
        </div>
      )}
      {!nextPage && !loading && (
        <p className="text-center text-xs text-zinc-400 py-2">You&apos;ve reached the end</p>
      )}
    </div>
  );
}

// Presentational card — kept in the same file since it's only used here.
function PostCard({ post }: { post: Post }) {
  return (
    <div className="h-full bg-white dark:bg-zinc-800 rounded-xl px-4 py-3 flex flex-col justify-between shadow-sm">
      <p className="text-sm font-semibold text-zinc-800 dark:text-white truncate">{post.title}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{post.body}</p>
      <p className="text-xs text-zinc-400">by {post.author} · #{post.id}</p>
    </div>
  );
}
