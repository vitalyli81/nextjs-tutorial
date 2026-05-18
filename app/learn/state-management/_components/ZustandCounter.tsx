// ZustandCounter — minimal live demo of a Zustand store.
//
// WHY "use client"?
//   useCounterStore calls a Zustand hook — hooks only work in Client Components.
//   The counter state lives on the client; it does not need to be server-rendered.
//
// HOW ZUSTAND WORKS HERE:
//   1. create() defines the store: initial state + actions in one call.
//   2. The component subscribes to exactly the slices it needs.
//      React only re-renders this component when `count` changes — not on every
//      store update. This is Zustand's built-in selector optimization.

"use client";

import { create } from "zustand";

// ── Store definition ─────────────────────────────────────────────────────
// Defined at module level so the store is a singleton shared across all
// components that import useCounterStore on this page.
type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

const useCounterStore = create<CounterState>()((set) => ({
  count: 0,
  // set() merges the returned object into the current state
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  reset:     () => set({ count: 0 }),
}));

// ── Counter component ─────────────────────────────────────────────────────
// Reads only `count`, `increment`, `decrement`, `reset` from the store.
// Zustand's selector ensures this component re-renders only on count changes.
export function ZustandCounter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-8 py-6">
      {/* Current count value */}
      <p className="text-4xl font-bold font-mono text-zinc-800 dark:text-white">{count}</p>
      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={decrement}
          className="rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-white px-4 py-2 text-sm font-medium transition-colors"
        >
          −
        </button>
        <button
          onClick={increment}
          className="rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors"
        >
          +
        </button>
        <button
          onClick={reset}
          className="rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700 px-4 py-2 text-sm font-medium transition-colors"
        >
          Reset
        </button>
      </div>
      <p className="text-xs text-zinc-400 font-mono">zustand store · count = {count}</p>
    </div>
  );
}
