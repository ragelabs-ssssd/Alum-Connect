'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'auto',
  resolvedTheme: 'light',
  setMode: () => {},
});

const STORAGE_KEY = 'iter-alum-theme';

function getIndiaTimeTheme(): 'light' | 'dark' {
  try {
    const hourStr = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      hour12: false,
    }).format(new Date());
    const istHour = Number(hourStr) % 24;
    // Light mode from 6:00 AM to 5:59 PM IST; Dark mode from 6:00 PM to 5:59 AM IST
    return istHour >= 6 && istHour < 18 ? 'light' : 'dark';
  } catch {
    // Fallback UTC+5:30 calculation
    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const istHour = Math.floor(((utcMinutes + 330) % 1440) / 60);
    return istHour >= 6 && istHour < 18 ? 'light' : 'dark';
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('auto');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved === 'auto' || saved === 'light' || saved === 'dark') {
        setModeState(saved);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    const applyTheme = () => {
      const nextResolved: 'light' | 'dark' =
        mode === 'auto' ? getIndiaTimeTheme() : mode;
      setResolvedTheme(nextResolved);

      const root = document.documentElement;
      if (nextResolved === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    if (mode !== 'auto') return;

    const interval = window.setInterval(applyTheme, 60_000);
    return () => window.clearInterval(interval);
  }, [mode]);

  const setMode = (next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
