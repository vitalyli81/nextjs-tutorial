import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTodoStore } from "./todoStore";

// Reset Zustand store state before each test so tests are isolated
beforeEach(() => {
  useTodoStore.setState({ todos: [] });
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

// Helper: add a todo and advance the fake clock so Date.now() produces
// a unique id for each item.
type StoreHookResult = { current: ReturnType<typeof useTodoStore> };

function addTodoTick(result: StoreHookResult, text: string) {
  act(() => result.current.addTodo(text));
  vi.advanceTimersByTime(1);
}

describe("addTodo", () => {
  it("adds a todo with the given text", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "Buy milk");
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe("Buy milk");
    expect(result.current.todos[0].completed).toBe(false);
  });

  it("trims whitespace from the text", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "  Walk the dog  ");
    expect(result.current.todos[0].text).toBe("Walk the dog");
  });

  it("does not add a todo when text is blank", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "   ");
    expect(result.current.todos).toHaveLength(0);
  });

  it("adds multiple todos in order", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "First");
    addTodoTick(result, "Second");
    addTodoTick(result, "Third");
    expect(result.current.todos.map((t) => t.text)).toEqual(["First", "Second", "Third"]);
  });
});

describe("toggleTodo", () => {
  it("marks an incomplete todo as completed", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "Write tests");
    const id = result.current.todos[0].id;
    act(() => result.current.toggleTodo(id));
    expect(result.current.todos[0].completed).toBe(true);
  });

  it("marks a completed todo as incomplete", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "Write tests");
    const id = result.current.todos[0].id;
    act(() => result.current.toggleTodo(id)); // → completed
    act(() => result.current.toggleTodo(id)); // → incomplete
    expect(result.current.todos[0].completed).toBe(false);
  });

  it("only toggles the targeted todo", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "A");
    addTodoTick(result, "B");
    const idA = result.current.todos.find((t) => t.text === "A")!.id;
    act(() => result.current.toggleTodo(idA));
    expect(result.current.todos.find((t) => t.text === "A")!.completed).toBe(true);
    expect(result.current.todos.find((t) => t.text === "B")!.completed).toBe(false);
  });
});

describe("editTodo", () => {
  it("updates the text of an existing todo", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "Old text");
    const id = result.current.todos[0].id;
    act(() => result.current.editTodo(id, "New text"));
    expect(result.current.todos[0].text).toBe("New text");
  });

  it("trims whitespace on edit", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "Old text");
    const id = result.current.todos[0].id;
    act(() => result.current.editTodo(id, "  Trimmed  "));
    expect(result.current.todos[0].text).toBe("Trimmed");
  });

  it("deletes the todo when edited text is blank", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "Will be deleted");
    const id = result.current.todos[0].id;
    act(() => result.current.editTodo(id, "   "));
    expect(result.current.todos).toHaveLength(0);
  });
});

describe("deleteTodo", () => {
  it("removes the specified todo", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "Keep me");
    addTodoTick(result, "Delete me");
    const idToDelete = result.current.todos.find((t) => t.text === "Delete me")!.id;
    act(() => result.current.deleteTodo(idToDelete));
    expect(result.current.todos).toHaveLength(1);
    expect(result.current.todos[0].text).toBe("Keep me");
  });

  it("is a no-op for an unknown id", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "Stay");
    act(() => result.current.deleteTodo(999999));
    expect(result.current.todos).toHaveLength(1);
  });
});

describe("remaining count (derived)", () => {
  it("counts only incomplete todos", () => {
    const { result } = renderHook(() => useTodoStore());
    addTodoTick(result, "A");
    addTodoTick(result, "B");
    addTodoTick(result, "C");
    const idA = result.current.todos.find((t) => t.text === "A")!.id;
    act(() => result.current.toggleTodo(idA));
    const remaining = result.current.todos.filter((t) => !t.completed).length;
    expect(remaining).toBe(2);
  });
});
