import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tic-Tac-Toe",
  description: "Play Tic-Tac-Toe against an unbeatable AI opponent.",
};

export default function TicTacToeLayout({ children }: { children: React.ReactNode }) {
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
