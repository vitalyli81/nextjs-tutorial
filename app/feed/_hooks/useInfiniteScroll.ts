// Watches a sentinel element with IntersectionObserver and calls `onLoadMore`
// when it enters the viewport. Re-attaches the observer whenever `onLoadMore`
// changes (i.e. when the next-page cursor advances).

import { useEffect, useRef } from "react";

export function useInfiniteScroll(onLoadMore: () => void) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore(); },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [onLoadMore]);

  return { sentinelRef };
}
