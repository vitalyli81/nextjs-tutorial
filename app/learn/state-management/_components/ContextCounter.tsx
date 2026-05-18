// ContextCounter — live demo of the same counter implemented with React Context.
//
// PURPOSE: side-by-side comparison with ZustandCounter so learners can see how
// the two solutions differ in code structure and re-render behavior.
//
// RE-RENDER DIFFERENCE:
//   Context re-renders EVERY consumer when ANY value in the context changes.
//   Here the context only has `count`, so it's fine. In a large app with many
//   fields in one context, every consumer re-renders on every update — that's
//   the performance problem Zustand solves.
//
// WHY "use client"?
//   createContext, useContext, useState, and useCallback are all React APIs
//   that require client-side JavaScript.

"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// ── Context definition ────────────────────────────────────────────────────
type CounterCtx = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

// createContext requires a default value — used when a component is rendered
// outside the provider (rare in practice; null + type assertion is common too)
const CounterContext = createContext<CounterCtx>({
  count: 0,
  increment: () => {},
  decrement: () => {},
  reset: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────
// Wraps any subtree that needs access to the counter state.
// useCallback prevents new function references on every render.
function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);
  const reset     = useCallback(() => setCount(0), []);

  return (
    <CounterContext.Provider value={{ count, increment, decrement, reset }}>
      {children}
    </CounterContext.Provider>
  );
}

// ── Consumer component ─────────────────────────────────────────────────
function CounterDisplay() {
  // useContext reads from the nearest CounterContext.Provider above in the tree
  const { count, increment, decrement, reset } = useContext(CounterContext);

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-8 py-6">
      <p className="text-4xl font-bold font-mono text-zinc-800 dark:text-white">{count}</p>
      <div className="flex gap-2">
        <button
          onClick={decrement}
          className="rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-white px-4 py-2 text-sm font-medium transition-colors"
        >
          −
        </button>
        <button
          onClick={increment}
          className="rounded-lg bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 text-sm font-medium transition-colors"
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
      <p className="text-xs text-zinc-400 font-mono">react context · count = {count}</p>
    </div>
  );
}

// ── Export: Provider wrapping the display ──────────────────────────────
// CounterProvider wraps CounterDisplay so the context is available.
// In a real app the Provider would wrap a layout or page component.
export function ContextCounter() {
  return (
    <CounterProvider>
      <CounterDisplay />
    </CounterProvider>
  );
}
