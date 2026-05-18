// Flat-tree data structure for the checkbox tree feature.
//
// Why flat instead of nested?
//   Nested trees require recursion on every toggle/read. By flattening the
//   tree once at build time and pre-computing `subtreeSize` and `childIds`,
//   all runtime operations become O(subtree) for writes and O(1) for reads.
//
// CheckedCountMap design:
//   Each node stores the count of its *checked descendants* (not itself).
//   This lets isIndeterminate() check in O(1): count > 0 && count < subtreeSize.
//   Updating the map after a toggle only touches ancestors — O(depth).

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RawNode = {
  id: string;
  label: string;
  children?: RawNode[];
};

// FlatNode: what the UI works with after buildFlatTree runs once.
export type FlatNode = {
  id: string;
  label: string;
  parentId: string | null;
  depth: number;
  subtreeSize: number; // total number of descendants (not counting self)
  childIds: string[];
};

export type FlatTree = Map<string, FlatNode>;

// ---------------------------------------------------------------------------
// Build flat tree from raw nested input  –  O(n)
// ---------------------------------------------------------------------------

export function buildFlatTree(roots: RawNode[]): { tree: FlatTree; rootIds: string[] } {
  const tree: FlatTree = new Map();

  function walk(node: RawNode, parentId: string | null, depth: number): number {
    const childIds = (node.children ?? []).map((c) => c.id);
    let subtreeSize = childIds.length;
    for (const child of node.children ?? []) {
      subtreeSize += walk(child, node.id, depth + 1);
    }
    tree.set(node.id, { id: node.id, label: node.label, parentId, depth, subtreeSize, childIds });
    return subtreeSize;
  }

  for (const root of roots) walk(root, null, 0);
  return { tree, rootIds: roots.map((r) => r.id) };
}

// ---------------------------------------------------------------------------
// CheckedCountMap — Map<id, number of checked descendants>
// Initialized to zero; maintained by toggle().
// ---------------------------------------------------------------------------

export type CheckedCountMap = Map<string, number>;

export function buildCheckedCountMap(tree: FlatTree): CheckedCountMap {
  const m: CheckedCountMap = new Map();
  for (const id of tree.keys()) m.set(id, 0);
  return m;
}

// ---------------------------------------------------------------------------
// Toggle a node  –  O(subtree) for the checked set, O(depth) for the counts
//
// Rules:
//   - Checking:   marks the node + all descendants checked.
//   - Unchecking: marks the node + all descendants unchecked.
//   - After toggling, ancestor checkedCounts are adjusted by the net delta.
//
// Returns new immutable copies of checked and checkedCount so React can
// detect the state change via reference equality.
// ---------------------------------------------------------------------------

export function toggle(
  nodeId: string,
  checked: Set<string>,
  checkedCount: CheckedCountMap,
  tree: FlatTree,
): { checked: Set<string>; checkedCount: CheckedCountMap } {
  const node = tree.get(nodeId)!;
  const nextChecked = new Set(checked);
  const nextCount = new Map(checkedCount);

  const wasChecked = nextChecked.has(nodeId);
  const willCheck = !wasChecked;

  // BFS to collect the node + all descendants — O(subtree size).
  const subtree: string[] = [];
  const queue = [nodeId];
  while (queue.length) {
    const id = queue.shift()!;
    subtree.push(id);
    for (const cid of tree.get(id)!.childIds) queue.push(cid);
  }

  // Apply the check/uncheck to every node in the subtree; track net change.
  let delta = 0;
  for (const id of subtree) {
    if (willCheck && !nextChecked.has(id)) {
      nextChecked.add(id);
      delta++;
    } else if (!willCheck && nextChecked.has(id)) {
      nextChecked.delete(id);
      delta--;
    }
  }

  // Propagate the delta up the ancestor chain — O(depth).
  let cur: FlatNode | undefined = node;
  while (cur?.parentId) {
    const pid = cur.parentId;
    nextCount.set(pid, (nextCount.get(pid) ?? 0) + delta);
    cur = tree.get(pid);
  }
  // The toggled node's own count = number of checked descendants.
  nextCount.set(nodeId, willCheck ? node.subtreeSize : 0);

  return { checked: nextChecked, checkedCount: nextCount };
}

// ---------------------------------------------------------------------------
// O(1) state queries
// ---------------------------------------------------------------------------

export function isChecked(id: string, checked: Set<string>): boolean {
  return checked.has(id);
}

// A node is indeterminate when some — but not all — of its descendants are checked.
// Leaves can never be indeterminate (subtreeSize === 0).
export function isIndeterminate(
  id: string,
  checked: Set<string>,
  checkedCount: CheckedCountMap,
  tree: FlatTree,
): boolean {
  const node = tree.get(id)!;
  if (node.subtreeSize === 0) return false; // leaf node
  const count = checkedCount.get(id) ?? 0;
  return count > 0 && count < node.subtreeSize;
}
