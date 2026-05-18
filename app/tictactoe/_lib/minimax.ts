// Minimax AI for Tic-Tac-Toe.
//
// Conventions:
//   - The board is a flat 9-element array; indices map to a 3×3 grid:
//       0 | 1 | 2
//       ---------
//       3 | 4 | 5
//       ---------
//       6 | 7 | 8
//   - "O" is the maximizing player (AI); "X" is the minimizing player (human).
//   - Scores: O wins → positive, X wins → negative, draw → 0.
//     The `depth` term makes the AI prefer faster wins and slower losses.

export type Board = (string | null)[];

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

export function getWinner(board: Board): string | null {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

// Returns the winning line's indices so the UI can highlight them.
export function getWinningLine(board: Board): number[] | null {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return line;
  }
  return null;
}

export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

// Terminal score from O's perspective.
function score(board: Board, depth: number): number {
  const winner = getWinner(board);
  if (winner === "O") return 10 - depth; // prefer faster wins
  if (winner === "X") return depth - 10; // prefer slower losses
  return 0;
}

// Standard minimax — O maximizes, X minimizes.
// Mutates board in-place during recursion and restores it (no allocations).
function minimax(board: Board, depth: number, isMaximizing: boolean): number {
  const winner = getWinner(board);
  if (winner || isBoardFull(board)) return score(board, depth);

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, depth + 1, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, depth + 1, true));
        board[i] = null;
      }
    }
    return best;
  }
}

// Returns the index of the best move for O, or -1 if the board is full.
export function getBestMove(board: Board): number {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const s = minimax(board, 0, false);
      board[i] = null;
      if (s > bestScore) {
        bestScore = s;
        bestMove = i;
      }
    }
  }
  return bestMove;
}
