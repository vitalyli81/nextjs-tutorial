import { describe, it, expect } from "vitest";
import {
  buildFlatTree,
  buildCheckedCountMap,
  toggle,
  isChecked,
  isIndeterminate,
} from "./tree";
import type { RawNode } from "./tree";

// ─── Fixtures ────────────────────────────────────────────────────────────────

// parent → child → grandchild
const SIMPLE: RawNode[] = [
  {
    id: "root",
    label: "Root",
    children: [
      {
        id: "child",
        label: "Child",
        children: [{ id: "leaf", label: "Leaf" }],
      },
    ],
  },
];

// Two siblings under one parent
const SIBLINGS: RawNode[] = [
  {
    id: "parent",
    label: "Parent",
    children: [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ],
  },
];

// ─── buildFlatTree ────────────────────────────────────────────────────────────

describe("buildFlatTree", () => {
  it("creates a node entry for every id in the tree", () => {
    const { tree } = buildFlatTree(SIMPLE);
    expect([...tree.keys()].sort()).toEqual(["child", "leaf", "root"]);
  });

  it("sets parentId correctly", () => {
    const { tree } = buildFlatTree(SIMPLE);
    expect(tree.get("root")!.parentId).toBeNull();
    expect(tree.get("child")!.parentId).toBe("root");
    expect(tree.get("leaf")!.parentId).toBe("child");
  });

  it("sets depth correctly", () => {
    const { tree } = buildFlatTree(SIMPLE);
    expect(tree.get("root")!.depth).toBe(0);
    expect(tree.get("child")!.depth).toBe(1);
    expect(tree.get("leaf")!.depth).toBe(2);
  });

  it("computes subtreeSize correctly", () => {
    const { tree } = buildFlatTree(SIMPLE);
    // root has 2 descendants (child + leaf)
    expect(tree.get("root")!.subtreeSize).toBe(2);
    // child has 1 descendant (leaf)
    expect(tree.get("child")!.subtreeSize).toBe(1);
    // leaf is a leaf
    expect(tree.get("leaf")!.subtreeSize).toBe(0);
  });

  it("returns rootIds listing only top-level nodes", () => {
    const { rootIds } = buildFlatTree(SIBLINGS);
    expect(rootIds).toEqual(["parent"]);
  });

  it("handles a forest (multiple roots)", () => {
    const forest: RawNode[] = [
      { id: "r1", label: "R1" },
      { id: "r2", label: "R2" },
    ];
    const { rootIds, tree } = buildFlatTree(forest);
    expect(rootIds).toEqual(["r1", "r2"]);
    expect(tree.size).toBe(2);
  });
});

// ─── toggle ──────────────────────────────────────────────────────────────────

describe("toggle — checking a leaf", () => {
  it("adds the leaf to checked", () => {
    const { tree } = buildFlatTree(SIMPLE);
    const checked = new Set<string>();
    const counts = buildCheckedCountMap(tree);

    const { checked: next } = toggle("leaf", checked, counts, tree);
    expect(next.has("leaf")).toBe(true);
  });

  it("increments ancestor checkedCounts", () => {
    const { tree } = buildFlatTree(SIMPLE);
    const checked = new Set<string>();
    const counts = buildCheckedCountMap(tree);

    const { checkedCount } = toggle("leaf", checked, counts, tree);
    expect(checkedCount.get("child")).toBe(1);
    expect(checkedCount.get("root")).toBe(1);
  });
});

describe("toggle — checking a parent checks all descendants", () => {
  it("checks parent and all children", () => {
    const { tree } = buildFlatTree(SIBLINGS);
    const checked = new Set<string>();
    const counts = buildCheckedCountMap(tree);

    const { checked: next } = toggle("parent", checked, counts, tree);
    expect(next.has("parent")).toBe(true);
    expect(next.has("a")).toBe(true);
    expect(next.has("b")).toBe(true);
  });

  it("sets parent's own checkedCount to its subtreeSize", () => {
    const { tree } = buildFlatTree(SIBLINGS);
    const checked = new Set<string>();
    const counts = buildCheckedCountMap(tree);

    const { checkedCount } = toggle("parent", checked, counts, tree);
    expect(checkedCount.get("parent")).toBe(tree.get("parent")!.subtreeSize);
  });
});

describe("toggle — unchecking", () => {
  it("unchecks a previously checked leaf", () => {
    const { tree } = buildFlatTree(SIMPLE);
    let checked = new Set<string>();
    let counts = buildCheckedCountMap(tree);

    ({ checked, checkedCount: counts } = toggle("leaf", checked, counts, tree));
    ({ checked, checkedCount: counts } = toggle("leaf", checked, counts, tree));

    expect(checked.has("leaf")).toBe(false);
    expect(counts.get("child")).toBe(0);
    expect(counts.get("root")).toBe(0);
  });

  it("unchecking a parent clears all descendants", () => {
    const { tree } = buildFlatTree(SIBLINGS);
    let checked = new Set<string>();
    let counts = buildCheckedCountMap(tree);

    ({ checked, checkedCount: counts } = toggle("parent", checked, counts, tree));
    ({ checked, checkedCount: counts } = toggle("parent", checked, counts, tree));

    expect(checked.size).toBe(0);
    expect(counts.get("parent")).toBe(0);
  });
});

// ─── isChecked / isIndeterminate ─────────────────────────────────────────────

describe("isChecked", () => {
  it("returns false when node is not in checked set", () => {
    expect(isChecked("leaf", new Set())).toBe(false);
  });

  it("returns true when node is in checked set", () => {
    expect(isChecked("leaf", new Set(["leaf"]))).toBe(true);
  });
});

describe("isIndeterminate", () => {
  it("returns false for a leaf node regardless of checked state", () => {
    const { tree } = buildFlatTree(SIMPLE);
    const counts = buildCheckedCountMap(tree);
    expect(isIndeterminate("leaf", new Set(), counts, tree)).toBe(false);
    expect(isIndeterminate("leaf", new Set(["leaf"]), counts, tree)).toBe(false);
  });

  it("returns false when no descendants are checked", () => {
    const { tree } = buildFlatTree(SIBLINGS);
    const counts = buildCheckedCountMap(tree);
    expect(isIndeterminate("parent", new Set(), counts, tree)).toBe(false);
  });

  it("returns true when some-but-not-all descendants are checked", () => {
    const { tree } = buildFlatTree(SIBLINGS);
    let checked = new Set<string>();
    let counts = buildCheckedCountMap(tree);

    // Check only child 'a', leaving 'b' unchecked
    ({ checked, checkedCount: counts } = toggle("a", checked, counts, tree));

    expect(isIndeterminate("parent", checked, counts, tree)).toBe(true);
  });

  it("returns false when all descendants are checked", () => {
    const { tree } = buildFlatTree(SIBLINGS);
    let checked = new Set<string>();
    let counts = buildCheckedCountMap(tree);

    ({ checked, checkedCount: counts } = toggle("parent", checked, counts, tree));

    // All descendants checked — parent should not be indeterminate
    expect(isIndeterminate("parent", checked, counts, tree)).toBe(false);
  });
});
