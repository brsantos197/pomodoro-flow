'use client';

import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { resolvedTheme, setTheme } = useNextTheme();

  return {
    theme: resolvedTheme,
    setTheme,
  };
};

