// Tracks the pixel height of a DOM element via ResizeObserver.
// Returns a ref to attach to the element and the current measured height.
// Starts at 600px so the initial virtual-list window is non-zero before the
// first ResizeObserver callback fires.

import { useState, useEffect, useRef } from "react";

export function useContainerHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setHeight(entry.contentRect.height);
    });
    ro.observe(el);
    setHeight(el.clientHeight);
    return () => ro.disconnect();
  }, []);

  return { ref, height };
}
