'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Trash2, Plus, CheckCircle2, Circle, PlayCircle, Timer, Edit3 } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from '@workspace/ui/components/form';
import { Badge } from '@workspace/ui/components/badge';
import useLocalStorage from '../hooks/use-local-storage';

const todoSchema = z.object({
  task: z.string().min(1, 'Digite uma tarefa'),
});

type TodoFormData = z.infer<typeof todoSchema>;

interface Todo {
  id: string;
  task: string;
  completed: boolean;
  createdAt: number;
  cycles: number;
}

export function TodoList() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('@pomodoro-flow:todos', []);
  const [activeTodoId, setActiveTodoId] = useLocalStorage<string | null>('@pomodoro-flow:active-todo-id', null);
  const [isMounted, setIsMounted] = useState(false);

  // Editing state
  const [editTodoId, setEditTodoId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Ensure client hydration happens correctly
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Focus the edit input when entering edit mode
  useEffect(() => {
    if (!editTodoId) return;
    const el = document.getElementById(`edit-${editTodoId}`) as HTMLInputElement | null;
    el?.focus();
    el?.select();
  }, [editTodoId]);

  // Listen for updates from pomodoro timer
  useEffect(() => {
    if (!isMounted) return;

    const handleTodoUpdate = () => {
      // Force re-render by reading from localStorage
      const saved = localStorage.getItem('@pomodoro-flow:todos');
      if (saved) {
        try {
          setTodos(JSON.parse(saved));
        } catch (error) {
          console.error('Error loading todos:', error);
        }
      }
    };

    window.addEventListener('todo-updated', handleTodoUpdate);
    return () => window.removeEventListener('todo-updated', handleTodoUpdate);
  }, [setTodos, isMounted]);

  const form = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      task: '',
    },
  });

  const onSubmit = (data: TodoFormData) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      task: data.task,
      completed: false,
      createdAt: Date.now(),
      cycles: 0,
    };
    setTodos([newTodo, ...todos]);
    form.reset();
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    if (activeTodoId === id) {
      setActiveTodoId(null);
    }
    if (editTodoId === id) {
      setEditTodoId(null);
      setEditText('');
    }
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    // If there's an active edit on another todo, try to persist it first.
    if (editTodoId && editTodoId !== todo.id) {
      const trimmed = editText.trim();
      if (trimmed.length > 0) {
        setTodos(todos.map(t => t.id === editTodoId ? { ...t, task: trimmed } : t));
      }
    }
    setEditTodoId(todo.id);
    setEditText(todo.task);
  };

  const cancelEditing = () => {
    setEditTodoId(null);
    setEditText('');
  };

  const saveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (trimmed.length === 0) return;
    setTodos(todos.map(t => t.id === id ? { ...t, task: trimmed } : t));
    setEditTodoId(null);
    setEditText('');
  };

  const setActiveTodo = (id: string) => {
    setActiveTodoId(activeTodoId === id ? null : id);
  };

  const activeTodo = todos.find(t => t.id === activeTodoId);

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Lista de Tarefas
        </CardTitle>
        <CardDescription>
          {!isMounted ? (
            'Carregando tarefas...'
          ) : totalCount === 0
            ? 'Adicione suas tarefas para organizar seu dia'
            : `${completedCount} de ${totalCount} tarefa${totalCount !== 1 ? 's' : ''} concluída${completedCount !== 1 ? 's' : ''}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Task Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
            <FormField
              control={form.control}
              name="task"
              render={({ field }: any) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Adicionar nova tarefa..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </form>
        </Form>

        {/* Todo List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {!isMounted ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Carregando tarefas...</p>
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Circle className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>Nenhuma tarefa adicionada</p>
              <p className="text-sm mt-1">Comece adicionando uma tarefa acima</p>
            </div>
          ) : (
            todos.map((todo) => {
              const isActive = todo.id === activeTodoId;
              return (
                <div
                  key={todo.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors group ${isActive
                    ? 'bg-primary/10 border-primary shadow-sm'
                    : 'bg-card/50 hover:bg-card'
                    }`}
                >
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="flex-shrink-0"
                  />
                  {editTodoId === todo.id ? (
                    <form
                      onSubmit={(e) => { e.preventDefault(); saveEdit(todo.id); }}
                      className="flex-1"
                    >
                      <Input
                        id={`edit-${todo.id}`}
                        value={editText}
                        onChange={(e: any) => setEditText(e.target.value)}
                        onKeyDown={(e: any) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            saveEdit(todo.id);
                          }
                          if (e.key === 'Escape') {
                            cancelEditing();
                          }
                        }}
                        onBlur={() => saveEdit(todo.id)}
                        className="w-full"
                      />
                    </form>
                  ) : (
                    <span
                      className={`flex-1 ${todo.completed
                        ? 'line-through text-muted-foreground'
                        : 'text-foreground'
                        }`}
                      onDoubleClick={() => startEditing(todo)}
                    >
                      {todo.task}
                    </span>
                  )}

                  {/* Cycles Badge */}
                  <Badge variant={isActive ? "default" : "secondary"} className="flex-shrink-0">
                    <Timer className="w-3 h-3 mr-1" />
                    {todo.cycles}
                  </Badge>

                  {/* Active Button */}
                  <Button
                    variant={isActive ? "default" : "outline"}
                    size="icon"
                    onClick={() => setActiveTodo(todo.id)}
                    className="flex-shrink-0"
                    title={isActive ? "Tarefa ativa" : "Ativar tarefa"}
                  >
                    <PlayCircle className="w-4 h-4" />
                  </Button>

                  {/* Edit Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing(todo)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    title="Editar tarefa"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>

                  {/* Delete Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Progress Bar */}
        {isMounted && totalCount > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">
                {Math.round((completedCount / totalCount) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}