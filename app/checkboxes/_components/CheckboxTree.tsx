"use client";

import { useEffect, useRef } from "react";
import type { FlatTree, CheckedCountMap } from "../_lib/tree";
import { isChecked, isIndeterminate } from "../_lib/tree";

type Props = {
  nodeIds: string[];
  tree: FlatTree;
  checked: Set<string>;
  checkedCount: CheckedCountMap;
  onToggle: (id: string) => void;
};

export default function CheckboxTree({ nodeIds, tree, checked, checkedCount, onToggle }: Props) {
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

function TreeNode({ id, tree, checked, checkedCount, onToggle }: {
  id: string;
  tree: FlatTree;
  checked: Set<string>;
  checkedCount: CheckedCountMap;
  onToggle: (id: string) => void;
}) {
  const node = tree.get(id)!;
  const nodeChecked = isChecked(id, checked);
  const nodeIndeterminate = isIndeterminate(id, checked, checkedCount, tree);
  const hasChildren = node.childIds.length > 0;

  return (
    <li>
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
        {hasChildren && (
          <span className="text-xs text-zinc-400 ml-auto">
            {checkedCount.get(id) ?? 0} / {node.subtreeSize}
          </span>
        )}
      </label>

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

// Native checkbox with the indeterminate property.
// `indeterminate` is a DOM property — not an HTML attribute — so it must be set via a ref.
function IndeterminateCheckbox({
  checked,
  indeterminate,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  onChange: () => void;
}) {
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
