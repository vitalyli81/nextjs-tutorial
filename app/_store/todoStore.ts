import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type TodoStore = {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  editTodo: (id: number, text: string) => void;
  deleteTodo: (id: number) => void;
};

export const useTodoStore = create<TodoStore>()(
  persist(
    (set) => ({
      todos: [],

      addTodo: (text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        set((state) => ({
          todos: [...state.todos, { id: Date.now(), text: trimmed, completed: false }],
        }));
      },

      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        })),

      editTodo: (id, text) => {
        const trimmed = text.trim();
        if (!trimmed) {
          set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }));
          return;
        }
        set((state) => ({
          todos: state.todos.map((t) => (t.id === id ? { ...t, text: trimmed } : t)),
        }));
      },

      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        })),
    }),
    { name: "todos" }
  )
);
