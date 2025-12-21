'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { usePomodoro } from '../hooks/use-pomodoro';
import useLocalStorage from '../hooks/use-local-storage';

interface PomodoroContextType {
  phase: 'work' | 'break';
  isRunning: boolean;
  timeLeft: number;
  completedCycles: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  switchPhase: (phase: 'work' | 'break') => void;
  isModalOpen: boolean;
  closeModal: () => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const pomodoroHook = usePomodoro();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [lastShownCycle, setLastShownCycle] = useLocalStorage<number>('@pomodoro-flow:last-shown-cycle', -1);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Trigger modal when work cycle completes (entering break phase)
  useEffect(() => {
    if (!isClient) return;

    // Quando entra em break e é um novo ciclo
    if (pomodoroHook.phase === 'break' && pomodoroHook.completedCycles > lastShownCycle) {
      setLastShownCycle(pomodoroHook.completedCycles);
      setIsModalOpen(true);
    }
  }, [pomodoroHook.phase, pomodoroHook.completedCycles, isClient, lastShownCycle, setLastShownCycle]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <PomodoroContext.Provider
      value={{
        phase: pomodoroHook.phase,
        isRunning: pomodoroHook.isRunning,
        timeLeft: pomodoroHook.timeLeft,
        completedCycles: pomodoroHook.completedCycles,
        start: pomodoroHook.start,
        pause: pomodoroHook.pause,
        reset: pomodoroHook.reset,
        switchPhase: pomodoroHook.switchPhase,
        isModalOpen,
        closeModal,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoroContext() {
  const context = useContext(PomodoroContext);
  if (context === undefined) {
    throw new Error('usePomodoroContext must be used within a PomodoroProvider');
  }
  return context;
}
