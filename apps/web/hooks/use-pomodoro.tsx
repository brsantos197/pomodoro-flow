'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSettings } from '../context/settings-context';
import useLocalStorage from './use-local-storage';
import { useNotifications } from './use-notifications';

export type PomodoroPhase = 'work' | 'break';

interface UsePomodoroReturn {
  phase: PomodoroPhase;
  isRunning: boolean;
  timeLeft: number;
  completedCycles: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  switchPhase: (phase: PomodoroPhase) => void;
}

export function usePomodoro(): UsePomodoroReturn {
  const { settings } = useSettings();
  const { showNotification } = useNotifications();
  const [phase, setPhase] = useLocalStorage<PomodoroPhase>('@pomodoro-flow:phase', 'work');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(settings.workDuration); // in minutes
  const [completedCycles, setCycles] = useLocalStorage<number>('@pomodoro-flow:cycles', 0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize timer on mount
  useEffect(() => {
    setTimeLeft(phase === 'work' ? settings.workDuration : settings.breakDuration);
    setIsInitialized(true);
  }, [settings, phase]);

  // Listen for settings changes
  useEffect(() => {
    if (isInitialized) {
      setTimeLeft(phase === 'work' ? settings.workDuration : settings.breakDuration);
    }
  }, [settings, phase, isInitialized]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          // Decrease by 1 second (1/60 minute)
          const newTime = prev - 1 / 60;

          // When timer ends
          if (newTime <= 0) {
            if (phase === 'work') {
              console.log('⏱️ Work cycle completed!');
              setCycles((prev) => prev + 1);
              // Show notification for completed work cycle
              showNotification('🎉 Ciclo de foco concluído!', {
                body: 'Hora de tirar um descanso. Você conseguiu!',
                tag: 'pomodoro-work-complete',
              });
              // Switch to break and continue running
              setPhase('break');
              setTimeLeft(settings.breakDuration);
            } else {
              console.log('☕ Break cycle completed!');
              // Show notification for completed break
              showNotification('⏰ Intervalo terminado!', {
                body: 'Vamos voltar ao trabalho?',
                tag: 'pomodoro-break-complete',
              });
              // Switch back to work and continue running
              setPhase('work');
              setTimeLeft(settings.workDuration);
            }
          }

          return newTime;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, phase, settings, setPhase, setCycles, showNotification]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(phase === 'work' ? settings.workDuration : settings.breakDuration);
  }, [phase, settings]);

  const switchPhase = useCallback((newPhase: PomodoroPhase) => {
    setPhase(newPhase);
    setIsRunning(false);
    setTimeLeft(newPhase === 'work' ? settings.workDuration : settings.breakDuration);
  }, [settings, setPhase]);

  return {
    phase,
    isRunning,
    timeLeft,
    completedCycles,
    start,
    pause,
    reset,
    switchPhase,
  };
}
