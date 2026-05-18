// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 11 — State Management: Zustand vs React Context
//
// KEY CONCEPTS IN THIS FILE:
//   • Zustand          — tiny (1 KB) external state library; global store defined
//                        outside React; selectors prevent unnecessary re-renders;
//                        works natively with Next.js App Router (Client Components)
//   • React Context    — built-in React API; great for low-frequency updates
//                        (theme, auth user); re-renders ALL consumers on change
//   • create()         — Zustand's store factory; takes a callback that receives
//                        `set` for updating state
//   • persist()        — Zustand middleware for localStorage/sessionStorage sync
//   • Selector pattern — pass a selector fn to the hook to subscribe to a slice;
//                        prevents re-renders when unrelated state changes
//   • When to use what — decision guide based on app size and update frequency
//
// REAL-WORLD CONTEXT (Fox News / CNBC-scale media app):
//   A large news platform might have: auth state, user preferences (dark mode,
//   font size), bookmark list, live ticker data, notification count, AB test flags.
//   Using one global Context for all of this would cause thousands of unnecessary
//   re-renders. Zustand stores let you split by concern and subscribe granularly.
//
// This PAGE is a Server Component. The interactive counter demos live in
// _components/ as Client Components.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from "next";
import { ChapterLayout } from "../_components/ChapterLayout";
import { Demo } from "../_components/Demo";
import { Callout } from "../_components/Callout";
import { CodeBlock } from "../_components/CodeBlock";
import { CheatSheet } from "../_components/CheatSheet";
import { ZustandCounter } from "./_components/ZustandCounter";
import { ContextCounter } from "./_components/ContextCounter";

export const metadata: Metadata = { title: "State Management" };

export default function StateManagementPage() {
  return (
    <ChapterLayout
      slug="state-management"
      title="State Management"
      docsHref="https://zustand.docs.pmnd.rs"
    >
      {/* ── Demo 1: The problem — why not just useState? ──────────────── */}
      <Demo concept="The problem" title="Why useState isn't enough — and when to upgrade">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">useState</code> is perfect
          for <strong>local, component-scoped state</strong>. The moment two distant components
          need to read or write the same state, you hit prop drilling or need a global solution.
        </p>
        <CodeBlock>{`// ❌ PROBLEM: Prop drilling — passing state through many layers
function Page() {
  const [user, setUser] = useState(null);
  return <Layout user={user} setUser={setUser} />;           // passed down
}
function Layout({ user, setUser }) {
  return <Sidebar user={user} setUser={setUser} />;          // passed down again
}
function Sidebar({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;         // ← finally used here
}

// ✓ SOLUTION: Global state — UserMenu reads directly from the store/context
function UserMenu() {
  const user = useUserStore((s) => s.user);   // Zustand: subscribe to just "user"
  // OR
  const { user } = useContext(UserContext);   // Context: read from nearest provider
}`}
        </CodeBlock>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mt-3">
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 p-3">
            <p className="font-semibold text-zinc-700 dark:text-zinc-200 mb-1 text-xs uppercase tracking-wide">Use useState when</p>
            <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <li>✓ State belongs to one component</li>
              <li>✓ No sibling/parent needs it</li>
              <li>✓ Form input, modal open/close, hover</li>
            </ul>
          </div>
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 p-3">
            <p className="font-semibold text-zinc-700 dark:text-zinc-200 mb-1 text-xs uppercase tracking-wide">Use global state when</p>
            <ul className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <li>✓ Shared across distant components</li>
              <li>✓ Needs to survive route changes</li>
              <li>✓ Auth user, cart, theme, bookmarks</li>
            </ul>
          </div>
        </div>
      </Demo>

      {/* ── Demo 2: Zustand live counter ──────────────────────────────── */}
      <Demo concept="Zustand — create() store" title="Define state + actions in one call, read anywhere">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          Zustand stores are plain JavaScript objects created outside React.
          Any Client Component can read from them with a hook — no Provider needed.
          The counter below uses a Zustand store:
        </p>

        {/* ZustandCounter is a Client Component — renders the live counter */}
        <ZustandCounter />

        <CodeBlock>{`// stores/counter.ts — define the store OUTSIDE React (module level)
import { create } from "zustand";

type CounterState = {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
};

// create() takes a callback that receives "set" for updating state.
// set() MERGES the returned object into the current state (like setState).
export const useCounterStore = create<CounterState>()((set) => ({
  count: 0,
  increment: () => set((s) => ({ count: s.count + 1 })),
  decrement: () => set((s) => ({ count: s.count - 1 })),
  reset:     () => set({ count: 0 }),
}));

// Any Client Component — use the hook with a selector
function Counter() {
  // SELECTOR: only subscribe to the fields you need.
  // This component re-renders ONLY when count changes — not on unrelated updates.
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);

  return <button onClick={increment}>{count}</button>;
}`}
        </CodeBlock>
        <Callout kind="rule">
          No Provider needed — Zustand stores live outside the React tree and are available
          globally. Any Client Component can import and use the hook directly.
        </Callout>
      </Demo>

      {/* ── Demo 3: Zustand with persist middleware ────────────────────── */}
      <Demo concept="Zustand persist middleware" title="Sync store to localStorage with one line">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
          Wrap <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">create()</code> with
          the <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">persist</code> middleware
          — state survives page refreshes automatically. The Todo app in this tutorial uses this pattern.
        </p>
        <CodeBlock>{`// Real example from this tutorial's Todo app:
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTodoStore = create<TodoStore>()(
  persist(                              // ← wrap create callback with persist
    (set) => ({
      todos: [],
      addTodo: (text) => set((s) => ({
        todos: [...s.todos, { id: Date.now(), text, completed: false }],
      })),
      toggleTodo: (id) => set((s) => ({
        todos: s.todos.map((t) => t.id === id ? { ...t, completed: !t.completed } : t),
      })),
    }),
    { name: "todos" }  // localStorage key — data persists across browser sessions
  )
);

// Other persist options:
persist(fn, {
  name: "my-store",                        // localStorage key (required)
  storage: createJSONStorage(() => sessionStorage), // swap to sessionStorage
  partialize: (state) => ({ user: state.user }),    // persist only a slice
})`}
        </CodeBlock>
        <Callout kind="tip">
          The <code>persist</code> middleware handles serialization, rehydration, and
          storage writes automatically. No manual <code>localStorage.setItem</code> calls needed.
        </Callout>
      </Demo>

      {/* ── Demo 4: React Context live counter ────────────────────────── */}
      <Demo concept="React Context — built-in alternative" title="Great for low-frequency shared state (theme, auth user)">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          React Context is built into React — no extra package required.
          It works well when updates are infrequent and the consumer count is small.
          The counter below uses Context instead of Zustand:
        </p>

        {/* ContextCounter wraps a Provider + consumer in one component for the demo */}
        <ContextCounter />

        <CodeBlock>{`// 1. Create the context (define the shape with a default value)
const UserContext = createContext<UserCtx>({ user: null, setUser: () => {} });

// 2. Create a Provider component — wraps the subtree that needs access
function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

// 3. Wrap your layout (or page) with the Provider
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <UserProvider>   {/* must be "use client" if UserProvider uses hooks */}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}

// 4. Read from anywhere in the subtree
function Header() {
  const { user } = useContext(UserContext);
  return <p>Welcome, {user?.name}</p>;
}`}
        </CodeBlock>
        <Callout kind="warning">
          Context re-renders <strong>every consumer</strong> whenever any value in the context
          changes — even consumers that only use a different field. Use separate contexts for
          unrelated state, or switch to Zustand for high-frequency updates.
        </Callout>
      </Demo>

      {/* ── Demo 5: Side-by-side comparison ───────────────────────────── */}
      <Demo concept="Zustand vs Context" title="When to use each — especially at media company scale">
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          A large media app like <strong>Fox News</strong> or <strong>CNBC</strong> has many
          concurrent state concerns: live ticker prices updating every second, auth user,
          reading preferences, bookmark lists, notification counts, A/B test flags.
          Here&apos;s how to choose:
        </p>
        <div className="space-y-3 text-sm">
          {/* Zustand column */}
          <div className="rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
            <p className="font-bold text-blue-700 dark:text-blue-300 mb-2">Use Zustand when…</p>
            <ul className="space-y-1 text-blue-800 dark:text-blue-200 text-xs">
              <li>✓ <strong>High-frequency updates</strong>: live stock prices, notification badge, video progress</li>
              <li>✓ <strong>Many consumers</strong>: user preferences read by 50+ components across the page</li>
              <li>✓ <strong>Large state shape</strong>: cart + bookmarks + auth + preferences all in one store</li>
              <li>✓ <strong>Server ↔ client sync</strong>: rehydrating server data into client store on first load</li>
              <li>✓ <strong>Persistence</strong>: bookmarks, reading history, font size — survive page refresh</li>
              <li>✓ <strong>DevTools</strong>: Zustand has a Redux DevTools middleware for time-travel debugging</li>
            </ul>
          </div>
          {/* Context column */}
          <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 p-4">
            <p className="font-bold text-purple-700 dark:text-purple-300 mb-2">Use React Context when…</p>
            <ul className="space-y-1 text-purple-800 dark:text-purple-200 text-xs">
              <li>✓ <strong>Low-frequency updates</strong>: dark/light theme toggle, locale (changes rarely)</li>
              <li>✓ <strong>Small subtree</strong>: auth user passed to 3–5 components in a section</li>
              <li>✓ <strong>No extra dependencies</strong>: prototypes, small projects, or when bundle size matters</li>
              <li>✓ <strong>Framework patterns</strong>: Next.js itself uses Context for things like ThemeProvider</li>
            </ul>
          </div>
        </div>
        <CodeBlock>{`// ── Fox News / CNBC scale example ────────────────────────────────
// GOOD: split by concern — each store has tight, unrelated consumers

// 1. Live market data — high frequency, granular subscriptions
export const useTickerStore = create<TickerState>()((set) => ({
  prices: {},
  updatePrice: (symbol, price) => set((s) => ({ prices: { ...s.prices, [symbol]: price } })),
}));
// Consumer only re-renders when its symbol changes:
const applePrice = useTickerStore((s) => s.prices["AAPL"]);

// 2. Auth — low frequency, Context is fine
const AuthContext = createContext<AuthCtx>({ user: null });

// 3. User preferences (bookmarks, font size) — persisted Zustand store
export const usePrefsStore = create<PrefsState>()(
  persist((set) => ({ fontSize: "md", bookmarks: [] }), { name: "user-prefs" })
);

// ANTIPATTERN: one giant context with everything
// This re-renders all consumers on every ticker update — kills performance
const AppContext = createContext({ user, prices, bookmarks, fontSize, notifications });`}
        </CodeBlock>
        <Callout kind="rule">
          At scale, split state by update frequency and consumer count.
          Use <strong>Zustand</strong> for anything that updates often or has many consumers.
          Use <strong>Context</strong> for stable, infrequent values (theme, locale, auth user).
          Never put live data (prices, scores, notifications) into a Context.
        </Callout>
      </Demo>

      {/* ── Cheat Sheet ────────────────────────────────────────────────── */}
      <CheatSheet items={[
        "Use <code>useState</code> for local component state. Upgrade to global state when two distant components need to share or update the same value.",
        "<strong>Zustand</strong>: <code>create&lt;State&gt;()((set) =&gt; ({ ...state, ...actions }))</code> — defines state and actions together. No Provider. Import the hook anywhere.",
        "Subscribe with a <strong>selector</strong>: <code>useStore((s) =&gt; s.count)</code>. Component re-renders only when the selected slice changes — prevents unnecessary renders.",
        "<code>set()</code> in Zustand <strong>merges</strong> the returned object (like <code>setState</code>). Pass a function to read current state: <code>set((s) =&gt; ({ count: s.count + 1 }))</code>.",
        "Persist to localStorage with <code>persist</code> middleware: <code>create()(persist(fn, { name: 'key' }))</code>. State survives page refresh automatically.",
        "<strong>React Context</strong>: create → provide → consume with <code>useContext</code>. Re-renders ALL consumers when any context value changes. Best for low-frequency updates (theme, auth, locale).",
        "At media-company scale: use Zustand for live data (prices, scores, notifications), user preferences, and bookmarks. Use Context for theme and auth user which rarely change.",
        "Zustand stores are Client-side only — initialize them from server data via <code>useEffect</code> or pass initial values as props from Server Components.",
      ]} />
    </ChapterLayout>
  );
}
