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

export default function InterceptIndex() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 space-y-8">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Intercepted Routes — @modal + (.)</p>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">What are intercepted routes?</h1>
      </div>

      {/* Plain-English explanation */}
      <div className="space-y-4">
        <p className="text-base text-zinc-600 dark:text-zinc-300">
          Normally clicking a link replaces the current page. Intercepted routes let you{" "}
          <strong className="text-zinc-900 dark:text-white">show a different route inside the current layout</strong> — without navigating away.
          The URL updates, but the page you came from stays visible behind an overlay.
        </p>
        <p className="text-base text-zinc-600 dark:text-zinc-300">
          The trick: Next.js checks whether there is an intercepting folder when navigating <em>from a specific context</em>.
          If yes, it renders the intercepted version (modal). If the user opens that URL directly — fresh tab, refresh, shared link — there is no context, so Next.js renders the real page instead.
        </p>
        <p className="text-base text-zinc-600 dark:text-zinc-300">
          This means <strong className="text-zinc-900 dark:text-white">one URL serves two purposes</strong>: a modal when navigated to in-app, a standalone page when opened directly.
        </p>
      </div>

      {/* Key behaviours */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 space-y-4">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Key behaviours</p>
        <div className="space-y-4">
          <Concept label="URL updates, page doesn't change">
            Click a photo → URL becomes <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/photos/1</code> but
            the photo grid is still visible behind the modal. No full navigation happened.
          </Concept>
          <Concept label="Refresh shows the real page">
            Refresh <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">/photos/1</code> → no interception,
            Next.js renders <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">photos/[id]/page.tsx</code> as a full standalone page.
          </Concept>
          <Concept label="Two files, one URL">
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">photos/[id]/page.tsx</code> — the real page (direct nav).{" "}
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@modal/(.)photos/[id]/page.tsx</code> — the modal version (in-app nav).
            Same URL, different render depending on context.
          </Concept>
          <Concept label="Always use with a @slot">
            The intercepted content needs somewhere to render. A <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@modal</code> parallel
            slot in the layout holds it. The layout renders both the background and the overlay at the same time.
          </Concept>
          <Concept label="(.) prefix = same folder level">
            The <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">(.)</code> in <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">(.)photos</code> means
            the target route (<code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">photos/</code>) is at the same folder level as the{" "}
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">@modal/</code> folder — both live directly inside{" "}
            <code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 rounded">intercept/</code>.
          </Concept>
        </div>
      </div>

      {/* When to use */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-5 space-y-2">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">When to use intercepted routes</p>
        <ul className="space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400">
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">✓</span> Photo / video grid — click opens a modal, share link opens the full page</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">✓</span> Social feed — click a post opens a quick-view drawer, direct URL shows the full post</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">✓</span> Login / auth flow — trigger login modal from a CTA, /login URL still works standalone</li>
          <li className="flex gap-2"><span className="text-blue-400 shrink-0">✓</span> Any detail view where you want to keep the list visible while showing the detail</li>
        </ul>
      </div>

      {/* How the layout wires it up */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">How it works in code</p>
        <div className="rounded-xl bg-zinc-900 dark:bg-zinc-950 text-zinc-100 text-xs p-4 font-mono leading-relaxed space-y-1 overflow-x-auto">
          <p className="text-zinc-500">{"// intercept/layout.tsx"}</p>
          <p>{"export default function Layout({ children, modal }) {"}</p>
          <p className="pl-4">{"return ("}</p>
          <p className="pl-8">{"<html><body>"}</p>
          <p className="pl-12">{"{ children }    "}<span className="text-zinc-500">{"// photos/page.tsx  (always visible)"}</span></p>
          <p className="pl-12">{"{ modal }       "}<span className="text-zinc-500">{"// @modal/default.tsx (null) OR"}</span></p>
          <p className="pl-12">{"               "}<span className="text-zinc-500">{"// @modal/(.)photos/[id]/page.tsx"}</span></p>
          <p className="pl-8">{"</body></html>"}</p>
          <p className="pl-4">{");"}</p>
          <p>{"}"}</p>
        </div>
      </div>

      {/* Folder tree */}
      <div>
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Folder structure in this example</p>
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 p-4 font-mono text-xs space-y-0.5">
          <p className="text-zinc-500 dark:text-zinc-400">app/examples/intercept/</p>
          <p className="pl-4 text-zinc-600 dark:text-zinc-300">layout.tsx               <span className="text-zinc-400">← renders children + @modal</span></p>
          <p className="pl-4 text-zinc-600 dark:text-zinc-300">photos/</p>
          <p className="pl-8 text-zinc-500">page.tsx                 <span className="text-zinc-400">← the grid (always shown)</span></p>
          <p className="pl-8 text-zinc-500">[id]/page.tsx            <span className="text-zinc-400">← full page on direct nav / refresh</span></p>
          <p className="pl-4 text-blue-500">@modal/                  <span className="text-zinc-400 font-sans text-[10px]">← parallel slot</span></p>
          <p className="pl-8 text-zinc-500">default.tsx              <span className="text-zinc-400">← returns null (no modal by default)</span></p>
          <p className="pl-8 text-blue-400">(.)photos/               <span className="text-zinc-400 font-sans">(.) = same level as @modal</span></p>
          <p className="pl-12 text-blue-300">[id]/page.tsx            <span className="text-zinc-400 font-sans">← modal version on click</span></p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/examples/intercept/photos"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 text-sm font-medium transition-colors"
        >
          Open the photo grid →
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
