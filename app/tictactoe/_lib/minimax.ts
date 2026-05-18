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

function score(board: Board, depth: number): number {
  const winner = getWinner(board);
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  return 0;
}

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
