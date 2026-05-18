// CheatSheet — shown at the bottom of every chapter.
// Each item is one atomic fact a developer should be able to recall cold.
// Props:
//   items  — the bullet list of facts
//   title  — optional override (defaults to "Chapter Cheat Sheet")

type CheatSheetProps = {
  items: string[];
  title?: string;
};

export function CheatSheet({ items, title = "Chapter Cheat Sheet" }: CheatSheetProps) {
  return (
    // Visually distinct from Demo boxes — uses a darker background so it reads
    // as a "summary" section separate from the interactive content above it.
    <section className="rounded-2xl border border-zinc-300 dark:border-zinc-600 bg-zinc-900 dark:bg-zinc-950 text-zinc-100 p-6 mt-4">
      <div className="flex items-center gap-2 mb-4">
        {/* Bookmark icon — signals "save this" */}
        <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 3a2 2 0 00-2 2v16l7-3 7 3V5a2 2 0 00-2-2H5z" />
        </svg>
        <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">{title}</p>
      </div>

      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
            {/* Numbered badge */}
            <span className="mt-0.5 w-5 h-5 rounded-full bg-yellow-400/20 text-yellow-400 text-[11px] font-bold flex items-center justify-center shrink-0">
              {i + 1}
            </span>
            {/* Allow inline <code> tags inside item strings via dangerouslySetInnerHTML
                so callers can write "Use <code>layout.tsx</code> for…" naturally.
                Items come from our own source — no user input, no XSS risk. */}
            <span
              className="text-zinc-300 [&_code]:bg-zinc-700 [&_code]:text-yellow-300 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
