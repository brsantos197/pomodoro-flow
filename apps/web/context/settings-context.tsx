'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/use-local-storage';

export interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
}

const DEFAULT_SETTINGS: PomodoroSettings = {
  workDuration: 25,
  breakDuration: 5,
};

interface SettingsContextType {
  settings: PomodoroSettings;
  updateSettings: (settings: PomodoroSettings) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<PomodoroSettings>(
    '@pomodoro-flow:settings',
    DEFAULT_SETTINGS
  );

  const updateSettings = (newSettings: PomodoroSettings) => {
    setSettings(newSettings);
    // Dispatch event for other listeners
    window.dispatchEvent(new CustomEvent('settings-updated', { detail: newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
