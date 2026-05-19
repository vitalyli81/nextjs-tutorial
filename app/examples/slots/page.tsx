import Link from "next/link";

function Concept({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-500 text-xs flex items-center justify-center font-bold">→</span>
      <div>
        <p className="text-sm font-semibold text-zinc-800 dark:text-white">{label}</p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{children}</p>
      </div>
    </div>
  );
}

export default function SlotsIndex() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 space-y-8">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Parallel Routes — @slot</p>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">What are slots?</h1>
      </div>

      {/* Plain-English explanation */}
      <div className="space-y-4">
        <p className="text-base text-zinc-600 dark:text-zinc-300">
          Normally a layout has one <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-sm">children</code> prop — one page rendered inside it.
          Slots let a layout render <strong className="text-zinc-900 dark:text-white">multiple independent pages at the same time</strong>, each in its own named region.
        </p>
        <p className="text-base text-zinc-600 dark:text-zinc-300">
          You create a slot by naming a folder with <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-sm">@</code> — for example <code className="bg-zinc-100 dark:bg-zinc-800 px-1 rounded text-sm">@analytics/</code>.
          Next.js automatically passes it as a prop to the layout in the same folder. No extra configuration needed.
        </p>
      </div>

      {/* Key behaviours */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 space-y-4">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Key behaviours</p>
        <div className="space-y-4">
          <Concept label="Independent loading">
            Each slot wraps its own <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">loading.tsx</code> — switching a tab in one
            slot shows that slot&apos;s skeleton while the other slot stays fully interactive.
          </Concept>
          <Concept label="Independent errors">
            Each slot can have its own <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">error.tsx</code> — a crash in{" "}
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@team</code> doesn&apos;t affect{" "}
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@analytics</code>.
          </Concept>
          <Concept label="No URL segment">
            The <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@analytics</code> folder name never appears in the URL —
            it&apos;s a layout concept only.
          </Concept>
          <Concept label="default.tsx is required">
            When the user navigates to a URL that only matches one slot, the other slot needs a{" "}
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">default.tsx</code> fallback — otherwise Next.js throws a 404.
          </Concept>
        </div>
      </div>

      {/* When to use */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 space-y-2">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">When to use slots</p>
        <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">✓</span> Dashboard with several independent panels (analytics, team, activity)</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">✓</span> Split-pane UI — list on the left, detail on the right, each with own loading state</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">✓</span> Sidebar + main content that load and error independently</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">✓</span> Paired with intercepted routes to hold a modal overlay (see intercept example)</li>
        </ul>
      </div>

      {/* How the layout wires it up */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">How it works in code</p>
        <div className="rounded-xl bg-zinc-900 dark:bg-zinc-950 text-zinc-100 text-xs p-4 font-mono leading-relaxed space-y-1 overflow-x-auto">
          <p className="text-zinc-500">{"// dashboard/layout.tsx"}</p>
          <p>{"export default function Layout({ children, analytics, team }) {"}</p>
          <p className="pl-4">{"return ("}</p>
          <p className="pl-8">{"<div>"}</p>
          <p className="pl-12">{"<main>{children}</main>       "}<span className="text-zinc-500">{"// dashboard/page.tsx"}</span></p>
          <p className="pl-12">{"<aside>"}</p>
          <p className="pl-16">{"<div>{analytics}</div>   "}<span className="text-zinc-500">{"// @analytics/page.tsx"}</span></p>
          <p className="pl-16">{"<div>{team}</div>        "}<span className="text-zinc-500">{"// @team/page.tsx"}</span></p>
          <p className="pl-12">{"</aside>"}</p>
          <p className="pl-8">{"</div>"}</p>
          <p className="pl-4">{");"}</p>
          <p>{"}"}</p>
        </div>
      </div>

      {/* Folder tree */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Folder structure in this example</p>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4 font-mono text-xs space-y-0.5">
          <p className="text-zinc-500 dark:text-zinc-400">app/examples/slots/dashboard/</p>
          <p className="pl-4 text-zinc-600 dark:text-zinc-300">layout.tsx        <span className="text-zinc-400">← receives {"{ children, analytics, team }"}</span></p>
          <p className="pl-4 text-zinc-600 dark:text-zinc-300">page.tsx          <span className="text-zinc-400">← children slot</span></p>
          <p className="pl-4 text-blue-500">@analytics/       <span className="text-zinc-400 font-sans text-[10px]">← slot folder</span></p>
          <p className="pl-8 text-zinc-500">page.tsx          <span className="text-zinc-400">← overview</span></p>
          <p className="pl-8 text-zinc-500">analytics-detail/page.tsx  <span className="text-zinc-400">← detail view</span></p>
          <p className="pl-8 text-zinc-500">loading.tsx       <span className="text-zinc-400">← only this slot skeletons</span></p>
          <p className="pl-8 text-zinc-500">default.tsx       <span className="text-zinc-400">← fallback when unmatched</span></p>
          <p className="pl-4 text-purple-500">@team/            <span className="text-zinc-400 font-sans text-[10px]">← slot folder</span></p>
          <p className="pl-8 text-zinc-500">page.tsx          <span className="text-zinc-400">← overview</span></p>
          <p className="pl-8 text-zinc-500">team-detail/page.tsx  <span className="text-zinc-400">← detail view</span></p>
          <p className="pl-8 text-zinc-500">loading.tsx       <span className="text-zinc-400">← only this slot skeletons</span></p>
          <p className="pl-8 text-zinc-500">default.tsx       <span className="text-zinc-400">← fallback when unmatched</span></p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/examples/slots/dashboard"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Open the live dashboard →
        </Link>
        <Link
          href="/learn/project-structure"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Back to chapter →
        </Link>
      </div>
    </div>
  );
}
