// Demo — a labelled card that wraps each interactive example inside a chapter.
//
// Anatomy:
//   ┌─────────────────────────────────────┐
//   │ CONCEPT  (the Next.js API/file name) │  ← small ALL-CAPS tag
//   │ Title of this demo                  │  ← plain-English description
//   ├─────────────────────────────────────┤
//   │  children  (live demo content)      │
//   └─────────────────────────────────────┘
//
// This is a Server Component — no "use client" is needed because it has no
// state or event handlers. Its children can be Server OR Client Components.

interface DemoProps {
  // concept: the exact Next.js symbol being shown, e.g. "layout.tsx", "useRouter"
  concept: string;
  // title: one sentence explaining what the demo illustrates
  title: string;
  children: React.ReactNode;
}

export function Demo({ title, concept, children }: DemoProps) {
  return (
    <section className="rounded-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
      {/* Header band ─ concept tag + human-readable title */}
      <div className="bg-zinc-50 dark:bg-zinc-800/60 px-5 py-3 border-b border-zinc-200 dark:border-zinc-700">
        <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">{concept}</p>
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 mt-0.5">{title}</p>
      </div>
      {/* Body ─ live demo, explanation, code snippets */}
      <div className="bg-white dark:bg-zinc-900 p-5">{children}</div>
    </section>
  );
}
