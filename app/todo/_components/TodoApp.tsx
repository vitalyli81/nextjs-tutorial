"use client";

// TodoApp — root client component for the Todo feature.
// Owns the new-todo input and delegates per-item actions to TodoItem.
// All state lives in the Zustand store (todoStore.ts); this component only
// holds the local input string.

import { useState } from "react";
import { useTodoStore } from "../../_store/todoStore";
import TodoItem from "./TodoItem";

export default function TodoApp() {
  const { todos, addTodo } = useTodoStore();
  const [input, setInput] = useState("");

  // Derived — not stored in state to stay in sync with the store automatically.
  const remaining = todos.filter((t) => !t.completed).length;

  function handleAdd() {
    addTodo(input);
    setInput(""); // clear regardless; addTodo ignores blank strings internally
  }

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-white mb-6">Todo List</h1>

        {/* Add-todo row */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add a new task..."
            className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-4 py-2 text-zinc-800 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAdd}
            className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 font-medium transition-colors"
          >
            Add
          </button>
        </div>

        {todos.length === 0 ? (
          <p className="text-center text-zinc-400 py-8">No tasks yet. Add one above!</p>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        )}

        {todos.length > 0 && (
          <p className="mt-4 text-xs text-zinc-400 text-right">
            {remaining} task{remaining !== 1 ? "s" : ""} remaining
          </p>
        )}
      </div>
    </div>
  );
}
