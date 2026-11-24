'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';

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
const THEME_CHANGE_EVENT = 'alma-theme-mode-change';

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
    const now = new Date();
    const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const istHour = Math.floor(((utcMinutes + 330) % 1440) / 60);
    return istHour >= 6 && istHour < 18 ? 'light' : 'dark';
  }
}

function subscribeThemeMode(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => onStoreChange();
  window.addEventListener('storage', handler);
  window.addEventListener(THEME_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener(THEME_CHANGE_EVENT, handler);
  };
}

function getThemeModeSnapshot(): ThemeMode {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'auto' || saved === 'light' || saved === 'dark') {
      return saved;
    }
  } catch {
    // ignore storage errors
  }
  return 'auto';
}

function getServerThemeMode(): ThemeMode {
  return 'auto';
}

function subscribeIstTheme(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const interval = window.setInterval(onStoreChange, 60_000);
  return () => window.clearInterval(interval);
}

function getServerIstTheme(): 'light' | 'dark' {
  return 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const mode = useSyncExternalStore(
    subscribeThemeMode,
    getThemeModeSnapshot,
    getServerThemeMode,
  );
  const istTheme = useSyncExternalStore(
    subscribeIstTheme,
    getIndiaTimeTheme,
    getServerIstTheme,
  );

  const resolvedTheme: 'light' | 'dark' = mode === 'auto' ? istTheme : mode;

  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  const setMode = useCallback((next: ThemeMode) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
    } catch {
      // ignore storage errors
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
