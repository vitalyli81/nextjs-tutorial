"use client";

// CheckboxTree — renders a flat list of TreeNode rows.
// Despite looking recursive in JSX, the actual tree structure is already
// encoded in `tree` (FlatTree), so no recursive data traversal happens here.
//
// IndeterminateCheckbox is split into its own component because
// `indeterminate` is a DOM property, not an HTML attribute — it can only be
// set imperatively via a ref, which requires a dedicated useEffect.

import { useEffect, useRef } from "react";
import type { FlatTree, CheckedCountMap } from "../_lib/tree";
import { isChecked, isIndeterminate } from "../_lib/tree";

// ── Types ─────────────────────────────────────────────────────────────────────

interface CheckboxTreeProps {
  nodeIds: string[];
  tree: FlatTree;
  checked: Set<string>;
  checkedCount: CheckedCountMap;
  onToggle: (id: string) => void;
}

interface TreeNodeProps {
  id: string;
  tree: FlatTree;
  checked: Set<string>;
  checkedCount: CheckedCountMap;
  onToggle: (id: string) => void;
}

interface IndeterminateCheckboxProps {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
}

// ── CheckboxTree ──────────────────────────────────────────────────────────────

// Entry point — renders the top-level nodes; each node renders its own children.
export default function CheckboxTree({ nodeIds, tree, checked, checkedCount, onToggle }: CheckboxTreeProps) {
  return (
    <ul className="space-y-0.5">
      {nodeIds.map((id) => (
        <TreeNode
          key={id}
          id={id}
          tree={tree}
          checked={checked}
          checkedCount={checkedCount}
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}

// ── TreeNode ──────────────────────────────────────────────────────────────────

function TreeNode({ id, tree, checked, checkedCount, onToggle }: TreeNodeProps) {
  const node = tree.get(id)!;
  const nodeChecked = isChecked(id, checked);
  const nodeIndeterminate = isIndeterminate(id, checked, checkedCount, tree);
  const hasChildren = node.childIds.length > 0;

  return (
    <li>
      {/* paddingLeft drives the visual indentation based on depth */}
      <label
        className="flex items-center gap-2 py-1 px-2 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700/50 select-none"
        style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
      >
        <IndeterminateCheckbox
          checked={nodeChecked}
          indeterminate={nodeIndeterminate}
          onChange={() => onToggle(id)}
        />
        <span className={`text-sm ${hasChildren ? "font-medium text-zinc-800 dark:text-zinc-100" : "text-zinc-600 dark:text-zinc-300"}`}>
          {node.label}
        </span>
        {/* Show checked/total count badge on parent nodes */}
        {hasChildren && (
          <span className="text-xs text-zinc-400 ml-auto">
            {checkedCount.get(id) ?? 0} / {node.subtreeSize}
          </span>
        )}
      </label>

      {/* Recursively render children — depth is already encoded in FlatNode */}
      {hasChildren && (
        <ul>
          {node.childIds.map((cid) => (
            <TreeNode
              key={cid}
              id={cid}
              tree={tree}
              checked={checked}
              checkedCount={checkedCount}
              onToggle={onToggle}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// ── IndeterminateCheckbox ─────────────────────────────────────────────────────

// `indeterminate` is a DOM property (not an HTML attribute), so React cannot
// set it declaratively. We use a ref + useEffect to sync it after every render.
function IndeterminateCheckbox({ checked, indeterminate, onChange }: IndeterminateCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 accent-blue-500 cursor-pointer shrink-0"
    />
  );
}
