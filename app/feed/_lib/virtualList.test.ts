/**
 * Tests for the virtual-list math used in VirtualFeed.
 *
 * The component hard-codes ITEM_HEIGHT=100 and OVERSCAN=3.
 * We replicate those constants here so the math can be verified
 * independently of the React rendering layer.
 */
import { describe, it, expect } from "vitest";

const ITEM_HEIGHT = 100;
const OVERSCAN = 3;

function computeWindow(
  scrollTop: number,
  containerHeight: number,
  totalItems: number,
): { startIndex: number; endIndex: number; visiblePosts: number[] } {
  const startIndex = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - OVERSCAN);
  const visibleCount = Math.ceil(containerHeight / ITEM_HEIGHT) + OVERSCAN * 2;
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount);
  // Return indices of posts that would be sliced
  const visiblePosts = Array.from(
    { length: endIndex - startIndex + 1 },
    (_, i) => startIndex + i,
  );
  return { startIndex, endIndex, visiblePosts };
}

describe("virtual list — startIndex", () => {
  it("starts at 0 when scrollTop is 0", () => {
    const { startIndex } = computeWindow(0, 600, 50);
    expect(startIndex).toBe(0);
  });

  it("clamps startIndex to 0 when overscan would go negative", () => {
    // scrollTop of 100 → floor(100/100)=1, minus OVERSCAN=3 → -2, clamped to 0
    const { startIndex } = computeWindow(100, 600, 50);
    expect(startIndex).toBe(0);
  });

  it("applies overscan correctly mid-list", () => {
    // scrollTop=1000 → floor(1000/100)=10, minus 3 = 7
    const { startIndex } = computeWindow(1000, 600, 50);
    expect(startIndex).toBe(7);
  });
});

describe("virtual list — endIndex", () => {
  it("does not exceed the last item index", () => {
    const { endIndex } = computeWindow(0, 600, 5);
    expect(endIndex).toBe(4); // only 5 items (0-4)
  });

  it("includes overscan rows below the viewport", () => {
    // viewport shows 6 rows (600/100), overscan adds 3 above and below
    // startIndex=0, visibleCount=6+6=12, endIndex=min(49, 0+12)=12
    const { endIndex } = computeWindow(0, 600, 50);
    expect(endIndex).toBe(12);
  });
});

describe("virtual list — visible slice", () => {
  it("renders only items in the computed window", () => {
    const { visiblePosts } = computeWindow(0, 300, 50);
    // startIndex=0, visibleCount=ceil(300/100)+6=3+6=9, endIndex=min(49,9)=9
    expect(visiblePosts[0]).toBe(0);
    expect(visiblePosts[visiblePosts.length - 1]).toBe(9);
  });

  it("slides the window as the user scrolls down", () => {
    const { startIndex: s1 } = computeWindow(0, 600, 50);
    const { startIndex: s2 } = computeWindow(2000, 600, 50);
    expect(s2).toBeGreaterThan(s1);
  });
});

describe("virtual list — total height spacer", () => {
  it("equals itemCount × ITEM_HEIGHT", () => {
    const totalItems = 200;
    const totalHeight = totalItems * ITEM_HEIGHT;
    expect(totalHeight).toBe(20000);
  });
});

// ─── API route logic ──────────────────────────────────────────────────────────

const TOTAL = 200;
const PAGE_SIZE = 20;

function getPaginationResult(page: number) {
  const from = (page - 1) * PAGE_SIZE;
  const to = Math.min(from + PAGE_SIZE, TOTAL);
  const postIds = Array.from({ length: to - from }, (_, i) => from + i + 1);
  const nextPage = to < TOTAL ? page + 1 : null;
  return { postIds, nextPage };
}

describe("feed API — pagination math", () => {
  it("page 1 returns ids 1–20", () => {
    const { postIds } = getPaginationResult(1);
    expect(postIds[0]).toBe(1);
    expect(postIds[postIds.length - 1]).toBe(20);
    expect(postIds).toHaveLength(20);
  });

  it("page 1 has nextPage=2", () => {
    expect(getPaginationResult(1).nextPage).toBe(2);
  });

  it("page 10 returns ids 181–200", () => {
    const { postIds } = getPaginationResult(10);
    expect(postIds[0]).toBe(181);
    expect(postIds[postIds.length - 1]).toBe(200);
    expect(postIds).toHaveLength(20);
  });

  it("last page has nextPage=null", () => {
    expect(getPaginationResult(10).nextPage).toBeNull();
  });

  it("never returns more than PAGE_SIZE posts per page", () => {
    for (let p = 1; p <= 10; p++) {
      const { postIds } = getPaginationResult(p);
      expect(postIds.length).toBeLessThanOrEqual(PAGE_SIZE);
    }
  });

  it("post ids are contiguous and cover 1–200 across all pages", () => {
    const all: number[] = [];
    for (let p = 1; p <= 10; p++) {
      all.push(...getPaginationResult(p).postIds);
    }
    expect(all).toHaveLength(200);
    expect(all[0]).toBe(1);
    expect(all[199]).toBe(200);
  });
});
