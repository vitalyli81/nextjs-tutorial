"use client";

// TicTacToe — interactive game board.
//
// Turn flow:
//   1. Player clicks a cell  → handleClick sets cell to "X", flips isPlayerTurn.
//   2. useEffect fires        → setTimeout gives the AI a short "thinking" pause,
//                               then getBestMove computes O's move synchronously.
//   3. AI places O            → isPlayerTurn flips back to true.
//
// The 350 ms delay is intentional UX — without it the AI responds so fast that
// the board feels broken. setTimeout is cleaned up if the component unmounts
// mid-delay (e.g. navigating away), which is why useEffect returns a cleanup.

import { useState, useEffect } from "react";
import { getBestMove, getWinner, getWinningLine, isBoardFull, type Board } from "../_lib/minimax";

// Derives a human-readable status string from the current board state.
function getStatus(board: Board, isPlayerTurn: boolean): string {
  const winner = getWinner(board);
  if (winner === "X") return "You win! 🎉";
  if (winner === "O") return "AI wins! 🤖";
  if (isBoardFull(board)) return "It's a draw! 🤝";
  return isPlayerTurn ? "Your turn (X)" : "AI is thinking...";
}

// ── BoardCell ─────────────────────────────────────────────────────────────────

interface BoardCellProps {
  cell: string | null;
  index: number;
  isWinCell: boolean;
  // When false the cell is disabled (AI turn, game over, or already occupied).
  isClickable: boolean;
  onClick: (index: number) => void;
}

function BoardCell({ cell, index, isWinCell, isClickable, onClick }: BoardCellProps) {
  return (
    <button
      onClick={() => onClick(index)}
      disabled={!!cell || !isClickable}
      className={`
        w-24 h-24 rounded-xl text-4xl font-bold transition-all duration-150
        flex items-center justify-center
        ${isClickable && !cell
          ? "bg-zinc-100 dark:bg-zinc-700 hover:bg-blue-50 dark:hover:bg-zinc-600 cursor-pointer"
          : "bg-zinc-100 dark:bg-zinc-700 cursor-default"}
        ${isWinCell ? "bg-green-100 dark:bg-green-900 ring-2 ring-green-400" : ""}
        ${cell === "X" ? "text-blue-500" : "text-purple-500"}
      `}
    >
      {cell}
    </button>
  );
}

// ── TicTacToe ─────────────────────────────────────────────────────────────────

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  // Pre-compute derived state once per render — avoids redundant calls.
  const winner = getWinner(board);
  const winningLine = getWinningLine(board);
  const isDraw = !winner && isBoardFull(board);
  const gameOver = !!winner || isDraw;

  // AI move — only runs when it's the AI's turn and the game is still active.
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timeout = setTimeout(() => {
        const next = [...board];
        const move = getBestMove(next);
        next[move] = "O";
        setBoard(next);
        setIsPlayerTurn(true);
      }, 350);
      return () => clearTimeout(timeout); // cleanup on unmount or re-render
    }
  }, [isPlayerTurn, board, gameOver]);

  function handleClick(index: number) {
    // Ignore clicks when it's the AI's turn, the cell is taken, or game is over.
    if (!isPlayerTurn || board[index] || gameOver) return;
    const next = [...board];
    next[index] = "X";
    setBoard(next);
    setIsPlayerTurn(false);
  }

  function reset() {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Status line — fixed height prevents layout shift between messages */}
      <div className="h-8 text-lg font-semibold text-zinc-700 dark:text-zinc-200 text-center">
        {getStatus(board, isPlayerTurn)}
      </div>

      {/* 3×3 board */}
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => (
          <BoardCell
            key={i}
            cell={cell}
            index={i}
            isWinCell={winningLine?.includes(i) ?? false}
            isClickable={isPlayerTurn && !gameOver}
            onClick={handleClick}
          />
        ))}
      </div>

      {/* Reset / Play again */}
      <button
        onClick={reset}
        className="mt-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-white text-white dark:text-zinc-900 px-6 py-2 font-medium transition-colors"
      >
        {gameOver ? "Play Again" : "Reset"}
      </button>
    </div>
  );
}
