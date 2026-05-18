import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Checkbox Tree",
  description: "Nested checkboxes with indeterminate state — O(1) reads, O(depth) writes.",
};

export default function CheckboxesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <Link
        href="/"
        className="absolute top-4 left-4 z-10 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-white transition-colors"
      >
        ← Home
      </Link>
      {children}
    </div>
  );
}
