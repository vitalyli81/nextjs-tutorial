// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RawNode = {
  id: string;
  label: string;
  children?: RawNode[];
};

// FlatNode: what the UI works with.
// `subtreeSize` = total number of descendants (not counting self).
// Stored flat so we never recurse during interaction.
export type FlatNode = {
  id: string;
  label: string;
  parentId: string | null;
  depth: number;
  subtreeSize: number;    // precomputed at build time
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
// checkedCount map  –  Map<id, number of checked descendants>
// Maintained so indeterminate check is O(1): read checkedCount[id]
// ---------------------------------------------------------------------------

export type CheckedCountMap = Map<string, number>;

export function buildCheckedCountMap(tree: FlatTree): CheckedCountMap {
  const m: CheckedCountMap = new Map();
  for (const id of tree.keys()) m.set(id, 0);
  return m;
}

// ---------------------------------------------------------------------------
// Toggle a node  –  O(depth), effectively O(1) for bounded trees
//
// Rules:
//   - Checking a node: marks it + all descendants checked.
//   - Unchecking a node: marks it + all descendants unchecked.
//   - After changing a subtree, walk ancestors and recompute their counts.
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

  // Collect the node itself + all descendants via BFS  –  O(subtree)
  // (This part is O(subtree size) which is correct — you must touch each node
  //  being toggled. The indeterminate *read* is still O(1).)
  const subtree: string[] = [];
  const queue = [nodeId];
  while (queue.length) {
    const id = queue.shift()!;
    subtree.push(id);
    for (const cid of tree.get(id)!.childIds) queue.push(cid);
  }

  // How many items in this subtree are changing state?
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

  // Walk ancestors, adjusting their checkedCount  –  O(depth)
  let cur: FlatNode | undefined = node;
  while (cur?.parentId) {
    const pid = cur.parentId;
    nextCount.set(pid, (nextCount.get(pid) ?? 0) + delta);
    cur = tree.get(pid);
  }
  // The node's own checkedCount = number of checked descendants (not self)
  // We need to update it too for nodes that have children
  if (willCheck) {
    nextCount.set(nodeId, node.subtreeSize);
  } else {
    nextCount.set(nodeId, 0);
  }

  return { checked: nextChecked, checkedCount: nextCount };
}

// ---------------------------------------------------------------------------
// O(1) state queries
// ---------------------------------------------------------------------------

export function isChecked(id: string, checked: Set<string>): boolean {
  return checked.has(id);
}

// Indeterminate = node is not checked itself, but some descendants are checked.
// OR node is checked but not all descendants are checked.
// Simplified: some-but-not-all descendants checked, regardless of self.
export function isIndeterminate(id: string, checked: Set<string>, checkedCount: CheckedCountMap, tree: FlatTree): boolean {
  const node = tree.get(id)!;
  if (node.subtreeSize === 0) return false; // leaf
  const count = checkedCount.get(id) ?? 0;
  return count > 0 && count < node.subtreeSize;
}
