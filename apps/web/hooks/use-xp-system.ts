'use client';

import { useCallback } from 'react';
import useLocalStorage from './use-local-storage';

interface UseXpSystemReturn {
  level: number;
  currentXp: number;
  xpForNext: number;
  percentage: number;
  addXp: (amount: number) => void;
  getLevelXp: (level: number) => number;
}

export function useXpSystem(): UseXpSystemReturn {
  const [level, setLevel] = useLocalStorage<number>('@pomodoro-flow:xp-level', 1);
  const [currentXp, setCurrentXp] = useLocalStorage<number>('@pomodoro-flow:xp-current', 0);

  // XP required for each level (increases exponentially)
  const getLevelXp = useCallback((lvl: number): number => {
    return Math.floor(100 * Math.pow(1.15, lvl - 1));
  }, []);

  const xpForNext = getLevelXp(level);
  const percentage = (currentXp / xpForNext) * 100;

  const addXp = useCallback((amount: number) => {
    setCurrentXp((prevXp) => {
      let newXp = prevXp + amount;
      let newLevel = level;

      // Check for level ups
      while (newXp >= getLevelXp(newLevel)) {
        newXp -= getLevelXp(newLevel);
        newLevel += 1;
      }

      setLevel(newLevel);
      return newXp;
    });
  }, [level, getLevelXp, setLevel, setCurrentXp]);

  return {
    level,
    currentXp,
    xpForNext,
    percentage,
    addXp,
    getLevelXp,
  };
}
