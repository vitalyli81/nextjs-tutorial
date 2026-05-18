// Server Component page — no async data needed.
// Renders the static heading server-side so it's included in the initial HTML,
// then mounts the interactive TicTacToe client component inside.
// Metadata is exported from layout.tsx one level up.

import TicTacToe from "./_components/TicTacToe";

export default function TicTacToePage() {
  return (
    <main className="min-h-screen bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center p-8 gap-8">
      {/* Static heading — rendered on the server, no JS needed */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-zinc-800 dark:text-white mb-1">Tic-Tac-Toe</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">You are X — AI is O</p>
      </div>

      {/* Interactive game board — client component */}
      <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8">
        <TicTacToe />
      </div>
    </main>
  );
}
