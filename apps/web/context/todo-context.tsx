'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/use-local-storage';

interface Todo {
  id: string;
  task: string;
  completed: boolean;
  createdAt: number;
  cycles: number;
}

interface TodoContextType {
  todos: Todo[];
  activeTodoId: string | null;
  addTodo: (task: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, task: string) => void;
  setActiveTodoId: (id: string | null) => void;
  incrementCycles: (id: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useLocalStorage<Todo[]>('@pomodoro-flow:todos', []);
  const [activeTodoId, setActiveTodoIdRaw] = useLocalStorage<string | null>('@pomodoro-flow:active-todo-id', null);

  const dispatchUpdate = () => {
    try {
      window.dispatchEvent(new Event('todo-updated'));
      // also write active id explicitly to storage (useLocalStorage already does this)
    } catch (e) {
      // noop
    }
  };

  const addTodo = (task: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      task,
      completed: false,
      createdAt: Date.now(),
      cycles: 0,
    };
    setTodos((prev) => [newTodo, ...prev]);
    dispatchUpdate();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    dispatchUpdate();
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter(t => t.id !== id));
    if (activeTodoId === id) {
      setActiveTodoIdRaw(null);
    }
    dispatchUpdate();
  };

  const editTodo = (id: string, task: string) => {
    setTodos((prev) => prev.map(t => t.id === id ? { ...t, task } : t));
    dispatchUpdate();
  };

  const setActiveTodoId = (id: string | null) => {
    setActiveTodoIdRaw(id);
    dispatchUpdate();
  };

  const incrementCycles = (id: string) => {
    setTodos((prev) => prev.map(t => t.id === id ? { ...t, cycles: (t.cycles || 0) + 1 } : t));
    dispatchUpdate();
  };

  return (
    <TodoContext.Provider value={{ todos, activeTodoId, addTodo, toggleTodo, deleteTodo, editTodo, setActiveTodoId, incrementCycles }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodoContext() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodoContext must be used within TodoProvider');
  return ctx;
}
