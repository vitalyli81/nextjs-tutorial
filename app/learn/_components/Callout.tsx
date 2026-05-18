// Callout — a coloured banner for short, high-priority information.
//
// Three variants:
//   "rule"    (blue)   — a Next.js rule that must be followed
//   "tip"     (green)  — a helpful shortcut or best practice
//   "warning" (amber)  — a common mistake or gotcha to avoid
//
// Usage:
//   <Callout kind="rule">error.tsx MUST be a Client Component.</Callout>
//   <Callout kind="tip">Add loading.tsx to enable partial prefetch.</Callout>
//   <Callout kind="warning">await searchParams — it's a Promise in Next.js 15.</Callout>

type CalloutProps = {
  children: React.ReactNode;
  kind?: "rule" | "tip" | "warning";
};

// Tailwind class sets per variant — border + background + text colour
const styles = {
  rule:    "border-blue-300   dark:border-blue-700   bg-blue-50   dark:bg-blue-900/20   text-blue-800   dark:text-blue-200",
  tip:     "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200",
  warning: "border-amber-300  dark:border-amber-700  bg-amber-50  dark:bg-amber-900/20  text-amber-800  dark:text-amber-200",
};

// Short labels rendered above the content
const labels = {
  rule:    "★ Key rule",
  tip:     "💡 Tip",
  warning: "⚠ Watch out",
};

export function Callout({ children, kind = "rule" }: CalloutProps) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm mt-4 ${styles[kind]}`}>
      {/* Label badge — uppercase, faded opacity so it doesn't compete with content */}
      <span className="font-semibold text-xs uppercase tracking-wider opacity-70 block mb-1">
        {labels[kind]}
      </span>
      {children}
    </div>
  );
}
