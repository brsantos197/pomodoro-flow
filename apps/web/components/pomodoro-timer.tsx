'use client';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { CheckCircle2, Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePomodoroContext } from '../context/pomodoro-context';
import { formatTime } from '../lib/utils';
import { SettingsDialog } from './settings-dialog';
import { useSettings } from '../context/settings-context';
import useLocalStorage from '../hooks/use-local-storage';

export function PomodoroTimer() {
  const { phase, isRunning, timeLeft, completedCycles, start, pause, reset, switchPhase } = usePomodoroContext();
  const [activeTodoId] = useLocalStorage<string | null>('@pomodoro-flow:active-todo-id', null);
  const [todos] = useLocalStorage<any[]>('@pomodoro-flow:todos', []);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const updateActiveTask = () => {
      if (activeTodoId) {
        const todo = todos.find((t: any) => t.id === activeTodoId);
        setActiveTask(todo?.task || null);
      } else {
        setActiveTask(null);
      }
    };

    updateActiveTask();
    window.addEventListener('storage', updateActiveTask);
    window.addEventListener('todo-updated', updateActiveTask);

    return () => {
      window.removeEventListener('storage', updateActiveTask);
      window.removeEventListener('todo-updated', updateActiveTask);
    };
  }, [activeTodoId, todos, isMounted]);

  const { settings } = useSettings();
  const progress = phase === 'work'
    ? (1 - timeLeft / settings.workDuration) * 100
    : (1 - timeLeft / settings.breakDuration) * 100;

  if (!isMounted) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-6">
            {/* Indicador de fase */}
            <div className="flex gap-2 justify-center items-center">
              <Badge variant="default">Foco</Badge>
              <Badge variant="outline">Intervalo</Badge>
              <SettingsDialog />
            </div>

            {/* Timer circular skeleton */}
            <div className="relative w-64 h-64">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-secondary"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45}`}
                  className="text-primary"
                />
              </svg>

              {/* Timer display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-mono">25:00</span>
                <span className="text-muted-foreground mt-2">Tempo de Foco</span>
              </div>
            </div>

            {/* Controles */}
            <div className="flex gap-3">
              <Button size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Iniciar
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <RotateCcw className="w-5 h-5" />
                Resetar
              </Button>
            </div>

            {/* Ciclos completados */}
            <div className="text-center">
              <p className="text-muted-foreground">Ciclos Completados Hoje</p>
              <p className="text-3xl mt-1">0</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-6">
          {/* Active Task Display */}
          {isMounted && activeTask && (
            <div className="w-full p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 justify-center">
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm truncate">{activeTask}</span>
              </div>
            </div>
          )}

          {/* Indicador de fase */}
          <div className="flex gap-2 justify-center items-center">
            <Badge
              variant={phase === 'work' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => switchPhase('work')}
            >
              Foco
            </Badge>
            <Badge
              variant={phase === 'break' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => switchPhase('break')}
            >
              Intervalo
            </Badge>
            <SettingsDialog />
          </div>

          {/* Timer circular */}
          <div className="relative w-64 h-64">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-secondary"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-1000"
              />
            </svg>

            {/* Timer display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-mono">{formatTime(timeLeft)}</span>
              <span className="text-muted-foreground mt-2">
                {phase === 'work' ? 'Tempo de Foco' : 'Intervalo'}
              </span>
            </div>
          </div>

          {/* Controles */}
          <div className="flex gap-3">
            {!isRunning ? (
              <Button onClick={start} size="lg" className="gap-2">
                <Play className="w-5 h-5" />
                Iniciar
              </Button>
            ) : (
              <Button onClick={pause} size="lg" variant="secondary" className="gap-2">
                <Pause className="w-5 h-5" />
                Pausar
              </Button>
            )}
            <Button onClick={reset} size="lg" variant="outline" className="gap-2">
              <RotateCcw className="w-5 h-5" />
              Resetar
            </Button>
          </div>

          {/* Ciclos completados */}
          <div className="text-center">
            <p className="text-muted-foreground">Ciclos Completados Hoje</p>
            <p className="text-3xl mt-1">{completedCycles}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}