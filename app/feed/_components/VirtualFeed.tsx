"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Post } from "../../api/posts/route";

// Each card has a fixed height — required for virtual list math
const ITEM_HEIGHT = 100; // px
const OVERSCAN = 3;      // extra rows rendered above/below viewport

type Props = {
  initialPosts: Post[];
  initialNextPage: number | null;
};

export default function VirtualFeed({ initialPosts, initialNextPage }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [nextPage, setNextPage] = useState<number | null>(initialNextPage);
  const [loading, setLoading] = useState(false);

  // The scrollable container — we measure its height for the virtual window
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [scrollTop, setScrollTop] = useState(0);

  // Sentinel div at the bottom — IntersectionObserver watches this to trigger loads
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Track container height on mount and resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });
    ro.observe(el);
    setContainerHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  // Load next page when sentinel scrolls into view
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

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  // --- Virtual list math ---
  const totalHeight = posts.length * ITEM_HEIGHT;
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
        {/* Full-height spacer so the scrollbar reflects the real list length */}
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

        {/* Sentinel lives inside the scroll container, at the very bottom */}
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
        <p className="text-center text-xs text-zinc-400 py-2">You've reached the end</p>
      )}
    </div>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <div className="h-full bg-white dark:bg-zinc-800 rounded-xl px-4 py-3 flex flex-col justify-between shadow-sm">
      <p className="text-sm font-semibold text-zinc-800 dark:text-white truncate">{post.title}</p>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{post.body}</p>
      <p className="text-xs text-zinc-400">by {post.author} · #{post.id}</p>
    </div>
  );
}
