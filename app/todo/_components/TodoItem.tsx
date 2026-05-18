"use client";

import { useState, useRef, useEffect } from "react";
import type { Todo } from "../../_store/todoStore";
import { useTodoStore } from "../../_store/todoStore";

type Props = {
  todo: Todo;
};

export default function TodoItem({ todo }: Props) {
  const { toggleTodo: onToggle, editTodo: onEdit, deleteTodo: onDelete } = useTodoStore();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commitEdit() {
    onEdit(todo.id, draft);
    setEditing(false);
  }

  function cancelEdit() {
    setDraft(todo.text);
    setEditing(false);
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border border-zinc-100 dark:border-zinc-700 p-3 group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="w-4 h-4 accent-blue-500 cursor-pointer shrink-0"
        aria-label={`Mark "${todo.text}" as ${todo.completed ? "incomplete" : "complete"}`}
      />

      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitEdit();
            if (e.key === "Escape") cancelEdit();
          }}
          onBlur={commitEdit}
          className="flex-1 text-sm rounded border border-blue-400 px-2 py-0.5 bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <span
          onDoubleClick={() => !todo.completed && setEditing(true)}
          title={todo.completed ? undefined : "Double-click to edit"}
          className={`flex-1 text-sm cursor-default select-none ${
            todo.completed
              ? "line-through text-zinc-400"
              : "text-zinc-700 dark:text-zinc-200"
          }`}
        >
          {todo.text}
        </span>
      )}

      {!editing && (
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {!todo.completed && (
            <button
              onClick={() => setEditing(true)}
              className="text-zinc-400 hover:text-blue-500 transition-colors text-sm px-1"
              aria-label="Edit"
            >
              ✎
            </button>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            className="text-zinc-400 hover:text-red-400 transition-colors text-lg leading-none px-1"
            aria-label="Delete"
          >
            ×
          </button>
        </div>
      )}
    </li>
  );
}
