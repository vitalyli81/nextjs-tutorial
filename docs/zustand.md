# Zustand — Complete Reference

> Version used in this project: **Zustand 5.x** · React **19** · TypeScript **5**

---

## Table of Contents

1. [What is Zustand?](#1-what-is-zustand)
2. [Installation](#2-installation)
3. [Creating a Store](#3-creating-a-store)
4. [Reading State — Selectors](#4-reading-state--selectors)
5. [Updating State — `set()`](#5-updating-state--set)
6. [Async Actions](#6-async-actions)
7. [Middleware](#7-middleware)
   - [persist](#persist--localstorage--sessionstorage-sync)
   - [devtools](#devtools--redux-devtools-integration)
   - [immer](#immer--immutable-updates-with-mutable-syntax)
   - [subscribeWithSelector](#subscribewithselector)
8. [Derived / Computed State](#8-derived--computed-state)
9. [Slices Pattern — Large Stores](#9-slices-pattern--large-stores)
10. [Accessing State Outside React](#10-accessing-state-outside-react)
11. [Zustand vs React Context](#11-zustand-vs-react-context)
12. [Zustand in Next.js App Router](#12-zustand-in-nextjs-app-router)
13. [TypeScript Patterns](#13-typescript-patterns)
14. [Testing Stores](#14-testing-stores)
15. [Real-World Example — This Project](#15-real-world-example--this-project)
16. [Common Mistakes](#16-common-mistakes)

---

## 1. What is Zustand?

Zustand is a small (~1 KB), fast, and scalable state management library for React. It uses a simplified flux-like pattern without reducers, action types, or boilerplate.

**Core ideas:**
- The store is a plain JavaScript object defined **outside the React tree** — no Provider needed.
- Any Client Component subscribes to a slice of the store via a hook.
- Components re-render **only** when the slice they subscribed to changes (via selectors).
- Actions are just functions that call `set()`.

**Why Zustand over alternatives:**

| | useState | Context | Zustand | Redux |
|---|---|---|---|---|
| Bundle size | 0 KB | 0 KB | ~1 KB | ~50 KB |
| Provider needed | No | Yes | No | Yes |
| Granular re-renders | N/A | No | Yes | Yes |
| DevTools | No | No | Yes | Yes |
| Async actions | N/A | Manual | Built-in | Middleware |
| Persistence | No | Manual | 1 line | Middleware |
| Learning curve | None | Low | Very low | High |

---

## 2. Installation

```bash
npm install zustand
```

Zustand 5 is the version used in this project. It has full TypeScript support out of the box.

---

## 3. Creating a Store

```ts
// store/counter.ts
import { create } from "zustand";

// 1. Define the shape (state + actions)
type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  incrementBy: (amount: number) => void;
};

// 2. create() takes a callback that receives `set` (and optionally `get`)
//    The callback returns the initial state + action functions.
//    IMPORTANT: Define at MODULE LEVEL — the store is a singleton.
export const useCounterStore = create<CounterState>()((set) => ({
  // Initial state
  count: 0,

  // Actions — call set() to update state
  increment:   () => set((s) => ({ count: s.count + 1 })),
  decrement:   () => set((s) => ({ count: s.count - 1 })),
  reset:       () => set({ count: 0 }),
  incrementBy: (amount) => set((s) => ({ count: s.count + amount })),
}));
```

**Usage in a component:**

```tsx
// components/Counter.tsx
"use client";
import { useCounterStore } from "@/store/counter";

export function Counter() {
  // Subscribe to the whole store (fine for small stores)
  const { count, increment, decrement } = useCounterStore();

  return (
    <div>
      <p>{count}</p>
      <button onClick={decrement}>−</button>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

---

## 4. Reading State — Selectors

**Always use selectors** to subscribe to only the parts of the store you need. This prevents unnecessary re-renders when unrelated state changes.

```tsx
// ✓ Selector — component only re-renders when `count` changes
const count = useCounterStore((state) => state.count);

// ✓ Read multiple fields — create a new object, re-renders when either changes
const { count, total } = useCounterStore((state) => ({
  count: state.count,
  total: state.total,
}));

// ✓ Read actions — actions never change, no re-render concern
const increment = useCounterStore((state) => state.increment);
const { increment, decrement } = useCounterStore((state) => ({
  increment: state.increment,
  decrement: state.decrement,
}));

// ✗ No selector — re-renders whenever ANY part of the store changes
const store = useCounterStore();
```

### Equality Function

For object/array selectors, Zustand does a shallow comparison by default in v5. For deep equality:

```tsx
import { useShallow } from "zustand/react/shallow";

// useShallow does shallow comparison of the returned object
const { count, name } = useCounterStore(
  useShallow((state) => ({ count: state.count, name: state.name }))
);
```

---

## 5. Updating State — `set()`

`set()` **merges** its argument into the current state (like `setState` in class components). It does NOT replace the whole store.

```ts
// Merge a partial update (other fields are preserved)
set({ count: 5 });

// Function form — use when you need the current state value
set((state) => ({ count: state.count + 1 }));

// Replace the ENTIRE store (dangerous — use sparingly)
set({ count: 0, name: "" }, true); // second arg = true means replace, not merge

// Update nested state — must return a new object (Zustand is NOT Immer by default)
set((state) => ({
  user: { ...state.user, name: "Alice" }  // spread to avoid mutating
}));

// Reading state inside set with `get`
import { create } from "zustand";
const useStore = create<State>()((set, get) => ({
  count: 0,
  doubleCount: () => get().count * 2, // get() reads current state synchronously
  increment: () => set((s) => ({ count: s.count + 1 })),
}));
```

---

## 6. Async Actions

Actions can be `async` — just mark them with `async` and call `set()` when ready.

```ts
type PostsState = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
};

export const usePostsStore = create<PostsState>()((set) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      set({ posts: data.posts, loading: false });
    } catch (err) {
      set({ error: "Failed to fetch posts", loading: false });
    }
  },
}));
```

**In a component:**

```tsx
"use client";
import { useEffect } from "react";
import { usePostsStore } from "@/store/posts";

export function PostList() {
  const { posts, loading, error, fetchPosts } = usePostsStore();

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;
  return <ul>{posts.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}
```

---

## 7. Middleware

Middleware wraps the `create` callback. Stack multiple middleware from inside out.

### `persist` — localStorage / sessionStorage Sync

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light" as "light" | "dark",
      fontSize: "md" as "sm" | "md" | "lg",
      setTheme:    (theme)    => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: "user-settings",     // localStorage key (required)

      // Optional: swap storage engine
      storage: createJSONStorage(() => sessionStorage),

      // Optional: persist only a slice (omit sensitive data)
      partialize: (state) => ({ theme: state.theme }),

      // Optional: run logic after rehydration from storage
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated from storage:", state);
      },

      // Optional: migrate old stored data to new shape
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 1) {
          // rename old field
          return { ...(persistedState as object), theme: "light" };
        }
        return persistedState as SettingsState;
      },
    }
  )
);
```

**Avoiding hydration mismatch in Next.js** (server renders default, client rehydrates from localStorage):

```tsx
"use client";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/store/settings";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  // Render nothing (or a loading shell) until the store rehydrates
  if (!hydrated) return null;

  return <>{children}</>;
}

// Alternative: use Zustand's built-in hydration hook
const hasHydrated = useSettingsStore.persist.hasHydrated();
```

---

### `devtools` — Redux DevTools Integration

```ts
import { devtools } from "zustand/middleware";

export const useStore = create<State>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((s) => ({ count: s.count + 1 }), false, "increment"),
      //                                                      ^^^^^ replace?  ^^^^ action name in DevTools
    }),
    { name: "CounterStore" }  // store name shown in DevTools
  )
);
```

Install the [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) in Chrome/Firefox to use time-travel debugging.

---

### `immer` — Immutable Updates with Mutable Syntax

```bash
npm install immer
```

```ts
import { immer } from "zustand/middleware/immer";

type State = {
  user: { name: string; address: { city: string } };
  updateCity: (city: string) => void;
};

export const useStore = create<State>()(
  immer((set) => ({
    user: { name: "Alice", address: { city: "NYC" } },

    // Without immer: { user: { ...state.user, address: { ...state.user.address, city } } }
    // With immer: mutate directly — Immer produces a new immutable object
    updateCity: (city) =>
      set((state) => {
        state.user.address.city = city; // direct mutation — Immer handles immutability
      }),
  }))
);
```

---

### `subscribeWithSelector`

Subscribe to a store slice from outside React (useful for non-React code, effects, or canvas).

```ts
import { subscribeWithSelector } from "zustand/middleware";

export const useStore = create<State>()(
  subscribeWithSelector((set) => ({
    count: 0,
    increment: () => set((s) => ({ count: s.count + 1 })),
  }))
);

// Outside React — subscribe to a slice, fire callback when it changes
const unsub = useStore.subscribe(
  (state) => state.count,        // selector
  (count, prevCount) => {        // callback — receives new and old values
    console.log("count changed from", prevCount, "to", count);
    if (count > 10) analytics.track("high_count");
  },
  { equalityFn: Object.is, fireImmediately: true }
);

// Unsubscribe when done
unsub();
```

---

## 8. Derived / Computed State

Compute derived values inside selectors (preferred) or inside the store.

```ts
// Option A: derive in the selector (recomputes on every render if not memoized)
const total = useCartStore((s) => s.items.reduce((sum, item) => sum + item.price, 0));

// Option B: derive inside the store as a getter (memoized by Zustand)
type CartState = {
  items: CartItem[];
  total: () => number;  // computed from state
  addItem: (item: CartItem) => void;
};

export const useCartStore = create<CartState>()((set, get) => ({
  items: [],
  total: () => get().items.reduce((sum, item) => sum + item.price, 0),
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
}));

// Usage
const total = useCartStore((s) => s.total()); // call it as a function
```

---

## 9. Slices Pattern — Large Stores

Split a large store into focused slices, then combine. Each slice manages one concern.

```ts
// store/slices/authSlice.ts
type AuthSlice = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

export const createAuthSlice = (set: SetState): AuthSlice => ({
  user: null,
  login:  (user)  => set({ user }),
  logout: ()      => set({ user: null }),
});

// store/slices/cartSlice.ts
type CartSlice = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  clearCart: () => void;
};

export const createCartSlice = (set: SetState): CartSlice => ({
  items: [],
  addItem:   (item) => set((s) => ({ items: [...s.items, item] })),
  clearCart: ()     => set({ items: [] }),
});

// store/index.ts — combine slices
type AppState = AuthSlice & CartSlice;

export const useAppStore = create<AppState>()((...args) => ({
  ...createAuthSlice(...args),
  ...createCartSlice(...args),
}));

// Use with selectors — subscribe only to what you need
const user  = useAppStore((s) => s.user);
const items = useAppStore((s) => s.items);
```

---

## 10. Accessing State Outside React

```ts
// Read current state synchronously (no subscription)
const count = useCounterStore.getState().count;

// Update state from outside React (e.g., from a WebSocket handler)
useCounterStore.setState({ count: 42 });
useCounterStore.setState((s) => ({ count: s.count + 1 }));

// Subscribe to changes outside React
const unsub = useCounterStore.subscribe((state) => {
  document.title = `Count: ${state.count}`;
});
unsub(); // call to unsubscribe

// Reset the entire store to initial state
const initialState = { count: 0 };
useCounterStore.setState(initialState, true); // true = replace, not merge
```

---

## 11. Zustand vs React Context

### Re-Render Behavior — The Key Difference

```tsx
// Context — ALL consumers re-render when ANY value in the context changes
const AppContext = createContext({ user, ticker, preferences, notifications });

// If `ticker` updates every second:
// → UserMenu re-renders (it only uses `user` but gets notified of ALL changes)
// → Header re-renders
// → Sidebar re-renders
// → Every other consumer re-renders — even if they don't use `ticker`

// Zustand — ONLY components subscribed to the changed slice re-render
const ticker  = useTickerStore((s) => s.prices["AAPL"]); // re-renders on AAPL price change only
const user    = useUserStore((s) => s.user);              // re-renders on user change only
// These two components are completely independent
```

### Decision Matrix

| Factor | React Context | Zustand |
|---|---|---|
| Update frequency | Rare (theme, locale, auth) | Any |
| Number of consumers | Few (< 5) | Many |
| State shape | Simple | Simple or complex |
| Persistence | Manual | 1-line middleware |
| DevTools | No | Yes |
| Bundle size | 0 KB | ~1 KB |
| No Provider setup | No | Yes |
| Async actions | Manual | Built-in |

### Side-by-Side Example

```tsx
// CONTEXT APPROACH (fine for theme)
const ThemeContext = createContext<"light" | "dark">("light");
function App() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <ThemeContext.Provider value={theme}>
      <button onClick={() => setTheme(t => t === "light" ? "dark" : "light")}>
        Toggle
      </button>
      {children}
    </ThemeContext.Provider>
  );
}
const theme = useContext(ThemeContext); // in any consumer

// ZUSTAND APPROACH (better for frequently-updated or complex state)
export const useThemeStore = create<{ theme: "light" | "dark"; toggle: () => void }>()((set) => ({
  theme: "light",
  toggle: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
}));
const theme  = useThemeStore((s) => s.theme);  // in any component, no Provider needed
const toggle = useThemeStore((s) => s.toggle);
```

---

## 12. Zustand in Next.js App Router

### Zustand is Client-Side Only

Zustand stores run only on the client. Never call `useStore()` in a Server Component.

```tsx
// ✓ Client Component — uses the store
"use client";
import { useCartStore } from "@/store/cart";
export function CartButton() {
  const count = useCartStore((s) => s.items.length);
  return <button>Cart ({count})</button>;
}

// ✗ Server Component — cannot use Zustand
export default async function Page() {
  const count = useCartStore((s) => s.items.length); // ERROR: hooks in server component
}
```

### Initializing Zustand from Server Data

When the server fetches data that belongs in a Zustand store, pass it as a prop and initialize in a Client Component:

```tsx
// page.tsx (Server Component)
export default async function Page() {
  const user = await db.user.findFirst(); // server-side fetch
  return <UserInitializer initialUser={user} />;
}

// UserInitializer.tsx ("use client")
"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/user";

export function UserInitializer({ initialUser }: { initialUser: User }) {
  useEffect(() => {
    useUserStore.setState({ user: initialUser });
  }, [initialUser]);
  return null; // render nothing — just sync the store
}
```

### Avoid Store Sharing Between Requests (SSR)

In Next.js, each server render must use **isolated** store instances to prevent one user's data leaking into another's response. The standard pattern is to create the store inside a React context Provider that is instantiated per-request:

```tsx
// This is only needed if you render the store server-side.
// For purely client-side stores (most cases), the singleton pattern is fine.

// store/createStore.ts
import { createStore } from "zustand";
export type CounterStore = ReturnType<typeof initCounterStore>;
export const initCounterStore = (initState?: Partial<CounterState>) =>
  createStore<CounterState>()((set) => ({ count: 0, ...initState, increment: … }));

// providers/CounterProvider.tsx
"use client";
import { createContext, useContext, useRef } from "react";
const CounterContext = createContext<CounterStore | null>(null);

export function CounterProvider({ children, initialCount }: { children: ReactNode; initialCount?: number }) {
  const storeRef = useRef<CounterStore>();
  if (!storeRef.current) {
    storeRef.current = initCounterStore({ count: initialCount ?? 0 });
  }
  return <CounterContext.Provider value={storeRef.current}>{children}</CounterContext.Provider>;
}

export const useCounterStore = <T,>(selector: (state: CounterState) => T) => {
  const store = useContext(CounterContext);
  if (!store) throw new Error("CounterProvider missing");
  return useStore(store, selector);
};
```

For purely client-side stores (no SSR, `persist` middleware), the simpler singleton pattern at the top of this guide is fine.

---

## 13. TypeScript Patterns

### Typed Store with Explicit Generic

```ts
import { create, StateCreator } from "zustand";

type BearState = {
  bears: number;
  increase: (by: number) => void;
};

// Explicit type parameter — provides full autocomplete and type checking
export const useBearStore = create<BearState>()((set) => ({
  bears: 0,
  increase: (by) => set((state) => ({ bears: state.bears + by })),
}));
```

### Typed Slice Pattern

```ts
import { StateCreator } from "zustand";
import type { AppState } from "./index";

export type AuthSlice = {
  user: User | null;
  setUser: (user: User | null) => void;
};

// StateCreator<AppState, [], [], AuthSlice>
// params: full store type, mutators in, mutators out, slice type
export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
});
```

### Extract State and Actions Types

```ts
type CounterState = {
  count: number;
};

type CounterActions = {
  increment: () => void;
  decrement: () => void;
};

// Combine
type CounterStore = CounterState & CounterActions;

export const useCounterStore = create<CounterStore>()((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
}));
```

---

## 14. Testing Stores

```ts
// counter.test.ts
import { act } from "@testing-library/react";
import { useCounterStore } from "./counter";

beforeEach(() => {
  // Reset store to initial state before each test
  useCounterStore.setState({ count: 0 });
});

test("increment increases count by 1", () => {
  act(() => useCounterStore.getState().increment());
  expect(useCounterStore.getState().count).toBe(1);
});

test("incrementBy adds the given amount", () => {
  act(() => useCounterStore.getState().incrementBy(5));
  expect(useCounterStore.getState().count).toBe(5);
});

test("reset returns count to 0", () => {
  useCounterStore.setState({ count: 42 });
  act(() => useCounterStore.getState().reset());
  expect(useCounterStore.getState().count).toBe(0);
});
```

**Testing with `persist` middleware** — mock `localStorage`:

```ts
beforeEach(() => {
  localStorage.clear();
  useSettingsStore.setState({ theme: "light" }, true); // true = replace
});
```

---

## 15. Real-World Example — This Project

This project's **Todo app** uses a Zustand store with the `persist` middleware:

```ts
// app/_store/todoStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type TodoStore = {
  todos: Todo[];
  addTodo:    (text: string) => void;
  toggleTodo: (id: number) => void;
  editTodo:   (id: number, text: string) => void;
  deleteTodo: (id: number) => void;
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        set((s) => ({
          todos: [...s.todos, { id: Date.now(), text: trimmed, completed: false }],
        }));
      },

      toggleTodo: (id) =>
        set((s) => ({
          todos: s.todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t),
        })),

      editTodo: (id, text) => {
        const trimmed = text.trim();
        // Empty edit = delete the todo
        if (!trimmed) {
          set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
          return;
        }
        set((s) => ({
          todos: s.todos.map((t) => t.id === id ? { ...t, text: trimmed } : t),
        }));
      },

      deleteTodo: (id) =>
        set((s) => ({ todos: s.todos.filter((t) => t.id !== id) })),
    }),
    { name: "todos" }  // persisted to localStorage under key "todos"
  )
);
```

**Usage in the TodoApp component:**

```tsx
// app/todo/_components/TodoApp.tsx
"use client";
import { useTodoStore } from "../../_store/todoStore";

export default function TodoApp() {
  // Subscribe only to the fields this component needs
  const { todos, addTodo } = useTodoStore();
  const remaining = todos.filter((t) => !t.completed).length;
  // ...
}
```

---

## 16. Common Mistakes

| Mistake | Fix |
|---|---|
| Calling `useStore()` in a Server Component | Zustand hooks only work in Client Components (`"use client"`) |
| No selector — `useStore()` without args | Always use `useStore((s) => s.field)` to prevent over-rendering |
| Mutating state directly — `state.count++` | Use `set()` — direct mutation doesn't trigger re-renders |
| Using `set({ ...state, count: 5 })` | Just use `set({ count: 5 })` — set() merges automatically |
| Creating the store inside a component | Define at module level — the store is a singleton |
| Forgetting `persist` key | The `name` option in `persist` is required — it's the localStorage key |
| Hydration mismatch with `persist` | Gate client-only rendering with `useEffect` + `useState(false)` |
| Chaining `get()` inside `set()` | Pass a function to `set()` instead: `set((s) => …)` |
| Not cleaning up `subscribe()` | Always call the returned unsubscribe function on cleanup |
