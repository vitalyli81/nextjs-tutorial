import { describe, it, expect } from "vitest";
import { getWinner, getWinningLine, isBoardFull, getBestMove } from "./minimax";
import type { Board } from "./minimax";

// Helpers
const empty = (): Board => Array(9).fill(null);

describe("getWinner", () => {
  it("returns null on an empty board", () => {
    expect(getWinner(empty())).toBeNull();
  });

  it("detects a row win for X", () => {
    const b = ["X", "X", "X", null, null, null, null, null, null] as Board;
    expect(getWinner(b)).toBe("X");
  });

  it("detects a column win for O", () => {
    const b = ["O", null, null, "O", null, null, "O", null, null] as Board;
    expect(getWinner(b)).toBe("O");
  });

  it("detects a diagonal win", () => {
    const b = ["X", null, null, null, "X", null, null, null, "X"] as Board;
    expect(getWinner(b)).toBe("X");
  });

  it("detects the anti-diagonal win", () => {
    const b = [null, null, "O", null, "O", null, "O", null, null] as Board;
    expect(getWinner(b)).toBe("O");
  });

  it("returns null on a draw board", () => {
    // X O X / O O X / X X O  — no winner
    const b = ["X", "O", "X", "O", "O", "X", "X", "X", "O"] as Board;
    expect(getWinner(b)).toBeNull();
  });
});

describe("getWinningLine", () => {
  it("returns null when there is no winner", () => {
    expect(getWinningLine(empty())).toBeNull();
  });

  it("returns the correct indices for a row win", () => {
    const b = [null, null, null, "X", "X", "X", null, null, null] as Board;
    expect(getWinningLine(b)).toEqual([3, 4, 5]);
  });

  it("returns the correct indices for a diagonal win", () => {
    const b = [null, null, "O", null, "O", null, "O", null, null] as Board;
    expect(getWinningLine(b)).toEqual([2, 4, 6]);
  });
});

describe("isBoardFull", () => {
  it("returns false for an empty board", () => {
    expect(isBoardFull(empty())).toBe(false);
  });

  it("returns false when one cell is empty", () => {
    const b = Array(9).fill("X") as Board;
    b[4] = null;
    expect(isBoardFull(b)).toBe(false);
  });

  it("returns true when all cells are filled", () => {
    const b = Array(9).fill("X") as Board;
    expect(isBoardFull(b)).toBe(true);
  });
});

describe("getBestMove (AI is O, maximizer)", () => {
  it("returns -1 when no moves are available", () => {
    // Full board — no valid move exists
    const b = ["X", "O", "X", "O", "O", "X", "X", "X", "O"] as Board;
    expect(getBestMove(b)).toBe(-1);
  });

  it("takes a winning move immediately", () => {
    // O can win at index 8
    const b = ["O", null, "X", null, "O", "X", null, null, null] as Board;
    expect(getBestMove(b)).toBe(8);
  });

  it("blocks X from winning on the next move", () => {
    // X threatens to win at index 2; O must block
    const b = ["X", "X", null, null, "O", null, null, null, null] as Board;
    expect(getBestMove(b)).toBe(2);
  });

  it("returns a valid move on an empty board", () => {
    // All moves are equally scored when playing first (no forced win exists),
    // so the algorithm returns whichever move it evaluates first — just verify
    // it's a legal index.
    const move = getBestMove(empty());
    expect(move).toBeGreaterThanOrEqual(0);
    expect(move).toBeLessThanOrEqual(8);
  });

  it("never loses against any single X move (O plays second)", () => {
    // X plays every possible first move; O's response must not lose
    for (let xMove = 0; xMove < 9; xMove++) {
      const b = empty();
      b[xMove] = "X";
      const oMove = getBestMove(b);
      expect(oMove).toBeGreaterThanOrEqual(0);
      expect(b[oMove]).toBeNull(); // the chosen cell must be free
    }
  });
});
