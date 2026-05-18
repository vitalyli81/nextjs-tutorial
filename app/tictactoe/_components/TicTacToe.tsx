"use client";

import { useState, useEffect } from "react";
import { getBestMove, getWinner, getWinningLine, isBoardFull, type Board } from "../_lib/minimax";

function getStatus(board: Board, isPlayerTurn: boolean): string {
  const winner = getWinner(board);
  if (winner === "X") return "You win! 🎉";
  if (winner === "O") return "AI wins! 🤖";
  if (isBoardFull(board)) return "It's a draw! 🤝";
  return isPlayerTurn ? "Your turn (X)" : "AI is thinking...";
}

export default function TicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  const winner = getWinner(board);
  const winningLine = getWinningLine(board);
  const isDraw = !winner && isBoardFull(board);
  const gameOver = !!winner || isDraw;

  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timeout = setTimeout(() => {
        const next = [...board];
        const move = getBestMove(next);
        next[move] = "O";
        setBoard(next);
        setIsPlayerTurn(true);
      }, 350);
      return () => clearTimeout(timeout);
    }
  }, [isPlayerTurn, board, gameOver]);

  function handleClick(index: number) {
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

  const statusText = getStatus(board, isPlayerTurn);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Status */}
      <div className="h-8 text-lg font-semibold text-zinc-700 dark:text-zinc-200 text-center">
        {statusText}
      </div>

      {/* Board */}
      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, i) => {
          const isWinCell = winningLine?.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              disabled={!!cell || !isPlayerTurn || gameOver}
              className={`
                w-24 h-24 rounded-xl text-4xl font-bold transition-all duration-150
                flex items-center justify-center
                ${!cell && isPlayerTurn && !gameOver
                  ? "bg-zinc-100 dark:bg-zinc-700 hover:bg-blue-50 dark:hover:bg-zinc-600 cursor-pointer"
                  : "bg-zinc-100 dark:bg-zinc-700 cursor-default"}
                ${isWinCell ? "bg-green-100 dark:bg-green-900 ring-2 ring-green-400" : ""}
                ${cell === "X" ? "text-blue-500" : "text-purple-500"}
              `}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Reset */}
      <button
        onClick={reset}
        className="mt-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-white text-white dark:text-zinc-900 px-6 py-2 font-medium transition-colors"
      >
        {gameOver ? "Play Again" : "Reset"}
      </button>
    </div>
  );
}
