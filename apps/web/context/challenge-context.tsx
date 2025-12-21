'use client';

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { getRandomChallenge, type Challenge } from '../lib/challenges';
import { useSettings } from './settings-context';
import { usePomodoroContext } from './pomodoro-context';

interface ChallengeContextType {
  challenge: Challenge | null;
  showSuccess: boolean;
  isOpen: boolean;
  canCompleteChallenge: boolean;
  openChallenge: () => void;
  closeChallenge: () => void;
  completeChallenge: () => void;
  skipChallenge: () => void;
  showSuccessScreen: () => void;
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined);

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { timeLeft } = usePomodoroContext();
  const { settings } = useSettings();

  // Calculate if 3/4 of break time has passed
  const breakTimePercentage = ((settings.breakDuration - timeLeft) / settings.breakDuration) * 100;
  const canCompleteChallenge = breakTimePercentage >= 75;

  // Definir funções
  const openChallenge = () => {
    const newChallenge = getRandomChallenge();
    setChallenge(newChallenge);
    setShowSuccess(false);
  };

  const closeChallenge = () => {
    setShowSuccess(false);
    setChallenge(null);
  };

  const completeChallenge = () => {
    setShowSuccess(true);
  };

  const skipChallenge = () => {
    closeChallenge();
  };

  const showSuccessScreen = () => {
    setShowSuccess(true);
  };
  return (
    <ChallengeContext.Provider
      value={{
        challenge,
        showSuccess,
        isOpen: false,
        canCompleteChallenge,
        openChallenge,
        closeChallenge,
        completeChallenge,
        skipChallenge,
        showSuccessScreen,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  );
}

export function useChallengeContext() {
  const context = useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error('useChallengeContext must be used within a ChallengeProvider');
  }
  return context;
}
