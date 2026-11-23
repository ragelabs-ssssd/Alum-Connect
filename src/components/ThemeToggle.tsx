'use client';

import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { ThemeMode, useTheme } from '../context/ThemeContext';

const OPTIONS: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  {
    value: 'auto',
    label: 'Auto (IST: 6 AM–6 PM Light, 6 PM–6 AM Dark)',
    icon: <Monitor className="w-3.5 h-3.5" />,
  },
  { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
];

export default function ThemeToggle({ compact: _compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useTheme();

  return (
    <div
      className="group inline-flex items-center rounded-full border border-[#E4E4E7] dark:border-slate-700/80 bg-[#F4F4F5]/90 dark:bg-slate-800/80 p-1 transition-all"
      role="group"
      aria-label="Theme mode"
    >
      {OPTIONS.map((opt) => {
        const active = mode === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setMode(opt.value)}
            title={`Theme: ${opt.label}`}
            aria-label={`Theme: ${opt.label}`}
            className={`h-7 rounded-full flex items-center justify-center transition-all duration-200 overflow-hidden ${
              active
                ? 'w-7 bg-white dark:bg-slate-950 text-[#2563EB] dark:text-sky-400 shadow-xs'
                : 'w-0 opacity-0 group-hover:w-7 group-hover:opacity-100 group-focus-within:w-7 group-focus-within:opacity-100 text-[#52525B] dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
            }`}
          >
            {opt.icon}
          </button>
        );
      })}
    </div>
  );
}
