// CodeBlock — a dark <pre> block for inline code snippets inside Demo cards.
//
// Intentionally minimal — no syntax highlighting library so there are zero
// extra dependencies. Colour is a flat dark background that contrasts with
// the white Demo card body and the dark cheat-sheet section.
//
// Usage:
//   <CodeBlock>{`// page.tsx
// export default async function Page() {
//   const data = await fetch(…);
// }`}</CodeBlock>
//
// Tip: use a template literal (backticks) so you can write multi-line strings
// without escaping anything.

interface CodeBlockProps {
  children: React.ReactNode;
}

export function CodeBlock({ children }: CodeBlockProps) {
  return (
    // overflow-x-auto: wide snippets scroll horizontally instead of wrapping
    // leading-relaxed: extra line-height makes dense code easier to read
    <pre className="rounded-lg bg-zinc-900 dark:bg-zinc-950 text-zinc-100 text-xs p-4 overflow-x-auto leading-relaxed mt-3">
      <code>{children}</code>
    </pre>
  );
}
