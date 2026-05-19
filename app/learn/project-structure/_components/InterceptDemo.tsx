"use client";

// InterceptDemo — simulates all three intercept patterns as clickable demos.
//
// Each demo shows:
//   1. A "background page" (the list/grid you came from)
//   2. Clicking an item intercepts — shows a modal overlay, URL label updates
//   3. A "Direct navigation" button simulates refreshing — shows the full page
//   4. Folder structure showing why (.) / (..) / (...) is the right prefix

import { useState, useEffect } from "react";

// pushUrl / popUrl — update the real browser URL bar without navigating.
// We save the original URL on first call and restore it on close.
let savedUrl: string | null = null;

function pushUrl(path: string) {
  if (!savedUrl) savedUrl = window.location.href;
  window.history.pushState(null, "", path);
}

function restoreUrl() {
  if (savedUrl) {
    window.history.pushState(null, "", savedUrl);
    savedUrl = null;
  }
}

// ── shared types ─────────────────────────────────────────────────────────────
interface ModalProps {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}

function Modal({ title, subtitle, onClose, children }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 shadow-2xl overflow-hidden">
        <div className="bg-zinc-50 dark:bg-zinc-800 px-5 py-4 border-b border-zinc-200 dark:border-zinc-700 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Modal (intercepted route)</p>
            <p className="font-semibold text-zinc-800 dark:text-white mt-0.5">{title}</p>
            <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg leading-none mt-0.5"
          >
            ✕
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function FullPage({ title, subtitle, onBack, children }: ModalProps & { onBack: () => void }) {
  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      <div className="bg-zinc-50 dark:bg-zinc-800 px-5 py-4 border-b border-zinc-200 dark:border-zinc-700 flex items-center gap-3">
        <button
          onClick={onBack}
          className="text-sm text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
        >
          ← back
        </button>
        <div>
          <p className="text-xs font-semibold text-green-500 uppercase tracking-wider">Full page (direct navigation)</p>
          <p className="font-semibold text-zinc-800 dark:text-white">{title}</p>
          <p className="text-xs text-zinc-400">{subtitle}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FolderTree({ lines }: { lines: string[] }) {
  return (
    <pre className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed mt-3 border-t border-zinc-100 dark:border-zinc-800 pt-3 font-mono whitespace-pre">
      {lines.join("\n")}
    </pre>
  );
}

// ── Demo 1: (.) same level ────────────────────────────────────────────────────
export function SameLevelDemo() {
  type View = "grid" | "modal" | "fullpage";
  const [view, setView] = useState<View>("grid");
  const [selected, setSelected] = useState<{ id: number; title: string; color: string } | null>(null);

  const photos = [
    { id: 1, title: "Mountain sunrise",  color: "bg-orange-200 dark:bg-orange-900" },
    { id: 2, title: "Ocean at dusk",     color: "bg-blue-200 dark:bg-blue-900"     },
    { id: 3, title: "Forest path",       color: "bg-green-200 dark:bg-green-900"   },
    { id: 4, title: "City lights",       color: "bg-purple-200 dark:bg-purple-900" },
  ];

  // Sync real browser URL bar with the demo state
  useEffect(() => {
    if (view === "modal" && selected)   pushUrl(`/photos/${selected.id}`);
    else if (view === "fullpage" && selected) pushUrl(`/photos/${selected.id}`);
    else restoreUrl();
  }, [view, selected]);

  // Restore URL if the component unmounts (user navigates away)
  useEffect(() => () => restoreUrl(), []);

  function close() { setView("grid"); setSelected(null); }

  if (view === "fullpage" && selected) {
    return (
      <div>
        <FullPage
          title={selected.title}
          subtitle="photos/[id]/page.tsx — full standalone page"
          onClose={close}
          onBack={close}
        >
          <div className={`${selected.color} rounded-xl h-40 flex items-center justify-center mb-3`}>
            <span className="text-4xl">🖼️</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            You navigated directly to <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/photos/{selected.id}</code>.
            No interception — this is the real <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">photos/[id]/page.tsx</code> full page.
          </p>
        </FullPage>
        <FolderTree lines={[
          "app/",
          "  layout.tsx          ← owns @modal slot",
          "  photos/",
          "    [id]/page.tsx      ← YOU ARE HERE (full page)",
          "  @modal/",
          "    default.tsx        ← null (no modal on direct nav)",
          "    (.)photos/[id]/",
          "      page.tsx         ← modal version (not used here)",
        ]} />
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-zinc-400 mb-2 font-mono">photos/page.tsx — background page</p>
      <div className="grid grid-cols-2 gap-2">
        {photos.map(p => (
          <button
            key={p.id}
            onClick={() => { setSelected(p); setView("modal"); }}
            className={`${p.color} rounded-xl p-4 text-left hover:scale-[1.02] transition-transform cursor-pointer border-2 border-transparent hover:border-blue-400`}
          >
            <div className="text-2xl mb-1">🖼️</div>
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-200">{p.title}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">click to open</p>
          </button>
        ))}
      </div>
      <button
        onClick={() => { setSelected(photos[0]); setView("fullpage"); }}
        className="mt-3 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 underline underline-offset-2"
      >
        Simulate direct navigation to /photos/1 (refresh) →
      </button>

      {view === "modal" && selected && (
        <Modal
          title={selected.title}
          subtitle={`@modal/(.)photos/[id]/page.tsx · URL is /photos/${selected.id}`}
          onClose={close}
        >
          <div className={`${selected.color} rounded-xl h-32 flex items-center justify-center mb-3`}>
            <span className="text-4xl">🖼️</span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            The grid is still rendering behind this modal. The URL bar changed to{" "}
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/photos/{selected.id}</code> but
            no page transition happened.
          </p>
          <button
            onClick={() => setView("fullpage")}
            className="text-xs text-blue-500 hover:underline"
          >
            Simulate refresh → see full page instead
          </button>
        </Modal>
      )}

      <FolderTree lines={[
        "app/",
        "  layout.tsx          ← renders {children} + {modal}",
        "  @modal/",
        "    default.tsx        ← null",
        "    (.)photos/         ← (.) = same level as @modal",
        "      [id]/page.tsx    ← modal version",
        "  photos/",
        "    page.tsx           ← grid (background)",
        "    [id]/page.tsx      ← full page (direct nav)",
      ]} />
    </div>
  );
}

// ── Demo 2: (..) one level up ─────────────────────────────────────────────────
export function OneLevelUpDemo() {
  type View = "feed" | "modal" | "fullpage";
  const [view, setView] = useState<View>("feed");
  const [selected, setSelected] = useState<{ id: number; title: string } | null>(null);

  const posts = [
    { id: 10, title: "How React Server Components work" },
    { id: 11, title: "Understanding the App Router"     },
    { id: 12, title: "When to use Zustand vs Context"   },
  ];

  useEffect(() => {
    if (view === "modal" && selected)        pushUrl(`/posts/${selected.id}`);
    else if (view === "fullpage" && selected) pushUrl(`/posts/${selected.id}`);
    else restoreUrl();
  }, [view, selected]);

  useEffect(() => () => restoreUrl(), []);

  function close() { setView("feed"); setSelected(null); }

  if (view === "fullpage" && selected) {
    return (
      <div>
        <FullPage
          title={selected.title}
          subtitle="posts/[id]/page.tsx — full standalone page"
          onClose={close}
          onBack={close}
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Navigated directly to <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/posts/{selected.id}</code>.
            The feed layout is not involved — this is just <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">posts/[id]/page.tsx</code>.
          </p>
        </FullPage>
        <FolderTree lines={[
          "app/",
          "  posts/[id]/page.tsx   ← YOU ARE HERE (full page)",
          "  feed/",
          "    layout.tsx          ← owns @modal (not active here)",
          "    @modal/(..)posts/",
          "      [id]/page.tsx     ← modal version (not used on direct nav)",
        ]} />
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs text-zinc-400 mb-2 font-mono">feed/page.tsx — background page</p>
      <div className="space-y-2">
        {posts.map(p => (
          <button
            key={p.id}
            onClick={() => { setSelected(p); setView("modal"); }}
            className="w-full text-left rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-4 py-3 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-700 transition-colors"
          >
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{p.title}</p>
            <p className="text-[10px] text-zinc-400 mt-0.5">click to open in modal</p>
          </button>
        ))}
      </div>
      <button
        onClick={() => { setSelected(posts[0]); setView("fullpage"); }}
        className="mt-3 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 underline underline-offset-2"
      >
        Simulate direct navigation to /posts/10 (refresh) →
      </button>

      {view === "modal" && selected && (
        <Modal
          title={selected.title}
          subtitle={`@modal/(..)posts/[id]/page.tsx · URL is /posts/${selected.id}`}
          onClose={close}
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            The feed is still rendering behind this. <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">(..)</code>{" "}
            was needed because <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@modal</code> lives
            inside <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">feed/</code> but
            target <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">posts/</code> is one level up.
          </p>
          <button
            onClick={() => setView("fullpage")}
            className="text-xs text-blue-500 hover:underline"
          >
            Simulate refresh → see full page instead
          </button>
        </Modal>
      )}

      <FolderTree lines={[
        "app/",
        "  posts/[id]/page.tsx      ← full page (direct nav)",
        "  feed/",
        "    layout.tsx             ← renders {children} + {modal}",
        "    page.tsx               ← feed list (background)",
        "    @modal/",
        "      default.tsx          ← null",
        "      (..)posts/           ← (..) = one level up from @modal",
        "        [id]/page.tsx      ← modal version",
      ]} />
    </div>
  );
}

// ── Demo 3: (...) from root ───────────────────────────────────────────────────
export function FromRootDemo() {
  type View = "dashboard" | "modal" | "fullpage";
  const [view, setView] = useState<View>("dashboard");

  useEffect(() => {
    if (view === "modal" || view === "fullpage") pushUrl("/login");
    else restoreUrl();
  }, [view]);

  useEffect(() => () => restoreUrl(), []);

  function close() { setView("dashboard"); }

  if (view === "fullpage") {
    return (
      <div>
        <FullPage
          title="Login"
          subtitle="login/page.tsx — full standalone page"
          onClose={close}
          onBack={close}
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Navigated directly to <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/login</code>.
            The dashboard layout is not involved — this is just <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">login/page.tsx</code>.
          </p>
        </FullPage>
        <FolderTree lines={[
          "app/",
          "  login/page.tsx           ← YOU ARE HERE (full page)",
          "  dashboard/analytics/",
          "    layout.tsx             ← owns @modal (not active here)",
          "    @modal/(...)login/",
          "      page.tsx             ← modal version (not used on direct nav)",
        ]} />
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2 border-b border-zinc-200 dark:border-zinc-700">
          <p className="text-xs font-mono text-zinc-400">dashboard/analytics/page.tsx</p>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {["Revenue", "Users", "Sessions"].map(m => (
              <div key={m} className="rounded-lg bg-zinc-100 dark:bg-zinc-800 p-3 text-center">
                <p className="text-lg font-bold text-zinc-800 dark:text-white">
                  {m === "Revenue" ? "$12k" : m === "Users" ? "843" : "2.1k"}
                </p>
                <p className="text-[10px] text-zinc-400">{m}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setView("modal")}
            className="w-full rounded-lg border border-zinc-300 dark:border-zinc-600 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Switch account (→ /login)
          </button>
          <button
            onClick={() => setView("fullpage")}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 underline underline-offset-2"
          >
            Simulate direct navigation to /login (refresh) →
          </button>
        </div>
      </div>

      {view === "modal" && (
        <Modal
          title="Switch Account"
          subtitle="@modal/(...)login/page.tsx · URL is /login"
          onClose={close}
        >
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
            The dashboard is still rendering behind this. <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">(...)</code> was
            needed because <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@modal</code> is
            deeply nested inside <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">dashboard/analytics/</code> but
            target <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">login/</code> is at the app root.
          </p>
          <div className="space-y-2">
            <input placeholder="Email" className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm" />
            <input placeholder="Password" type="password" className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-2 text-sm" />
            <button
              onClick={close}
              className="w-full rounded-lg bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm font-medium transition-colors"
            >
              Log in
            </button>
          </div>
          <button
            onClick={() => setView("fullpage")}
            className="mt-3 text-xs text-blue-500 hover:underline block"
          >
            Simulate refresh → see full page instead
          </button>
        </Modal>
      )}

      <FolderTree lines={[
        "app/",
        "  login/page.tsx              ← full page (direct nav)",
        "  dashboard/analytics/",
        "    layout.tsx                ← renders {children} + {modal}",
        "    page.tsx                  ← dashboard (background)",
        "    @modal/",
        "      default.tsx             ← null",
        "      (...)login/             ← (...) = from app root",
        "        page.tsx              ← modal version",
      ]} />
    </div>
  );
}

// ── Demo 4: @slot parallel routes ────────────────────────────────────────────
//
// Shows a dashboard layout with two independent slots: @analytics and @team.
// Each slot has its own loading state and can error independently.
// Tabs let you switch which sub-page each slot is showing — the other stays put.

type SlotPage = "overview" | "detail";

interface SlotState {
  analytics: SlotPage;
  team: SlotPage;
  loading: "analytics" | "team" | null;
}

export function SlotsDemo() {
  const [slots, setSlots] = useState<SlotState>({
    analytics: "overview",
    team: "overview",
    loading: null,
  });

  function navigate(slot: "analytics" | "team", page: SlotPage) {
    setSlots(s => ({ ...s, loading: slot }));
    setTimeout(() => {
      setSlots(s => ({ ...s, [slot]: page, loading: null }));
    }, 700);
  }

  return (
    <div className="space-y-3">
      {/* Layout shell */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
        {/* layout.tsx header */}
        <div className="bg-zinc-50 dark:bg-zinc-800 px-4 py-2 border-b border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
          <p className="text-xs font-mono text-zinc-400">dashboard/layout.tsx</p>
          <p className="text-[10px] text-zinc-400">renders children + @analytics + @team</p>
        </div>

        {/* children slot */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">children (dashboard/page.tsx)</p>
          <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-700/50 px-3 py-2">
            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">Dashboard</p>
            <p className="text-xs text-zinc-400">Welcome back — here&apos;s your overview.</p>
          </div>
        </div>

        {/* two slots side by side */}
        <div className="grid sm:grid-cols-2 gap-3 p-3">

          {/* @analytics slot */}
          <div className="rounded-lg border border-blue-200 dark:border-blue-800 overflow-hidden">
            <div className="bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">@analytics slot</p>
              <div className="flex gap-1">
                <button
                  onClick={() => navigate("analytics", "overview")}
                  className={`text-[10px] px-2 py-0.5 rounded transition-colors ${slots.analytics === "overview" && slots.loading !== "analytics" ? "bg-blue-500 text-white" : "text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"}`}
                >overview</button>
                <button
                  onClick={() => navigate("analytics", "detail")}
                  className={`text-[10px] px-2 py-0.5 rounded transition-colors ${slots.analytics === "detail" && slots.loading !== "analytics" ? "bg-blue-500 text-white" : "text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"}`}
                >detail</button>
              </div>
            </div>
            <div className="p-3 min-h-[90px] flex items-center justify-center bg-white dark:bg-zinc-900">
              {slots.loading === "analytics" ? (
                <div className="w-full animate-pulse space-y-2">
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
                  <p className="text-[10px] text-center text-zinc-400 pt-1">@analytics/loading.tsx</p>
                </div>
              ) : slots.analytics === "overview" ? (
                <div className="w-full space-y-2">
                  <p className="text-[10px] font-mono text-zinc-400">@analytics/page.tsx</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[["Revenue", "$12k"], ["Sessions", "2.1k"]].map(([k, v]) => (
                      <div key={k} className="rounded bg-zinc-50 dark:bg-zinc-800 p-2 text-center">
                        <p className="text-sm font-bold text-zinc-800 dark:text-white">{v}</p>
                        <p className="text-[10px] text-zinc-400">{k}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-1.5">
                  <p className="text-[10px] font-mono text-zinc-400">@analytics/detail/page.tsx</p>
                  {[70, 85, 55, 90].map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="h-2 rounded-full bg-blue-400" style={{ width: `${w}%` }} />
                      <span className="text-[10px] text-zinc-400">{w}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* @team slot */}
          <div className="rounded-lg border border-purple-200 dark:border-purple-800 overflow-hidden">
            <div className="bg-purple-50 dark:bg-purple-900/30 px-3 py-1.5 border-b border-purple-200 dark:border-purple-800 flex items-center justify-between">
              <p className="text-[10px] font-semibold text-purple-500 uppercase tracking-wider">@team slot</p>
              <div className="flex gap-1">
                <button
                  onClick={() => navigate("team", "overview")}
                  className={`text-[10px] px-2 py-0.5 rounded transition-colors ${slots.team === "overview" && slots.loading !== "team" ? "bg-purple-500 text-white" : "text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50"}`}
                >overview</button>
                <button
                  onClick={() => navigate("team", "detail")}
                  className={`text-[10px] px-2 py-0.5 rounded transition-colors ${slots.team === "detail" && slots.loading !== "team" ? "bg-purple-500 text-white" : "text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50"}`}
                >detail</button>
              </div>
            </div>
            <div className="p-3 min-h-[90px] flex items-center justify-center bg-white dark:bg-zinc-900">
              {slots.loading === "team" ? (
                <div className="w-full animate-pulse space-y-2">
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-3/4" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
                  <p className="text-[10px] text-center text-zinc-400 pt-1">@team/loading.tsx</p>
                </div>
              ) : slots.team === "overview" ? (
                <div className="w-full space-y-1.5">
                  <p className="text-[10px] font-mono text-zinc-400">@team/page.tsx</p>
                  {["Alice", "Bob", "Carol"].map(name => (
                    <div key={name} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-800 flex items-center justify-center text-[10px] font-bold text-purple-600 dark:text-purple-300">{name[0]}</div>
                      <span className="text-xs text-zinc-600 dark:text-zinc-300">{name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full space-y-1.5">
                  <p className="text-[10px] font-mono text-zinc-400">@team/detail/page.tsx</p>
                  {[["Alice", "Admin", "12 PRs"], ["Bob", "Dev", "8 PRs"], ["Carol", "Design", "3 PRs"]].map(([n, r, s]) => (
                    <div key={n} className="flex items-center justify-between text-xs">
                      <span className="text-zinc-700 dark:text-zinc-200 font-medium">{n}</span>
                      <span className="text-zinc-400">{r}</span>
                      <span className="text-purple-500">{s}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-[10px] text-zinc-400 px-4 pb-3">
          Switch tabs in either slot — the other slot is unaffected. Each slot streams and errors independently.
        </p>
      </div>

      <FolderTree lines={[
        "app/dashboard/",
        "  layout.tsx         ← receives { children, analytics, team }",
        "  page.tsx           → /dashboard  (the children slot)",
        "  @analytics/",
        "    page.tsx         ← overview tab",
        "    detail/",
        "      page.tsx       ← detail tab",
        "    loading.tsx      ← shown while this slot fetches",
        "  @team/",
        "    page.tsx         ← overview tab",
        "    detail/",
        "      page.tsx       ← detail tab",
        "    loading.tsx      ← shown while this slot fetches",
        "    error.tsx        ← only crashes @team, not @analytics",
      ]} />
    </div>
  );
}
