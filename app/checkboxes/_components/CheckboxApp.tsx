"use client";

// CheckboxApp — root client component for the checkbox tree feature.
//
// State:
//   - `checked`      Set<string>     — which node ids are checked.
//   - `checkedCount` CheckedCountMap — for each node, how many descendants are checked.
//     This map is what makes isIndeterminate() O(1) instead of O(subtree).
//
// The flat tree and root ids are built once at module load (outside the
// component) because buildFlatTree is a pure, expensive transformation that
// never needs to re-run — the raw data is static.

import { useState, useMemo } from "react";
import { buildFlatTree, buildCheckedCountMap, toggle } from "../_lib/tree";
import { RAW_TREE } from "../_lib/data";
import CheckboxTree from "./CheckboxTree";

// Module-level constant — computed once, never re-computed on re-renders.
const { tree, rootIds } = buildFlatTree(RAW_TREE);

export default function CheckboxApp() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [checkedCount, setCheckedCount] = useState(() => buildCheckedCountMap(tree));

  function handleToggle(id: string) {
    const result = toggle(id, checked, checkedCount, tree);
    setChecked(result.checked);
    setCheckedCount(result.checkedCount);
  }

  const totalNodes = tree.size;
  const totalChecked = checked.size;

  // Build a readable summary of current selections for the status line.
  // useMemo avoids recomputing the label list unless the checked set changes.
  const summary = useMemo(() => {
    if (totalChecked === 0) return "Nothing selected";
    if (totalChecked === totalNodes) return "Everything selected";
    const labels = [...checked].map((id) => tree.get(id)!.label);
    if (labels.length <= 3) return labels.join(", ");
    return `${labels.slice(0, 3).join(", ")} +${labels.length - 3} more`;
  }, [checked, totalChecked, totalNodes]);

  // Checks every node; manually sets each node's checkedCount to its subtreeSize
  // because toggle() only handles single-node operations.
  function selectAll() {
    const allChecked = new Set(tree.keys());
    const allCounts = buildCheckedCountMap(tree);
    for (const [id, node] of tree) allCounts.set(id, node.subtreeSize);
    setChecked(allChecked);
    setCheckedCount(allCounts);
  }

  function clearAll() {
    setChecked(new Set());
    setCheckedCount(buildCheckedCountMap(tree));
  }

  return (
    <div className="w-full max-w-lg">
      {/* Stats bar */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          {totalChecked} / {totalNodes} selected
        </p>
        <div className="flex gap-2">
          <button onClick={selectAll} className="text-xs text-blue-500 hover:underline">
            Select all
          </button>
          <span className="text-zinc-300 dark:text-zinc-600">|</span>
          <button onClick={clearAll} className="text-xs text-blue-500 hover:underline">
            Clear
          </button>
        </div>
      </div>

      {/* Flat-rendered tree — each node is a CheckboxTree row */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-700 p-3">
        <CheckboxTree
          nodeIds={rootIds}
          tree={tree}
          checked={checked}
          checkedCount={checkedCount}
          onToggle={handleToggle}
        />
      </div>

      {/* Selection summary */}
      <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500 italic">{summary}</p>
    </div>
  );
}
