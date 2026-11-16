'use client';

import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { ThemeMode, useTheme } from '../context/ThemeContext';

const OPTIONS: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
  { value: 'auto', label: 'Auto', icon: <Monitor className="w-3.5 h-3.5" /> },
  { value: 'light', label: 'Light', icon: <Sun className="w-3.5 h-3.5" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="w-3.5 h-3.5" /> },
];

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode } = useTheme();

  return (
    <div
      className="inline-flex items-center rounded-full border border-[#E4E4E7] dark:border-slate-700/80 bg-[#F4F4F5]/90 dark:bg-slate-800/80 p-0.5"
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
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
              active
                ? 'bg-white dark:bg-slate-950 text-[#2563EB] dark:text-sky-400 shadow-xs'
                : 'text-[#52525B] dark:text-slate-400 hover:text-stone-900 dark:hover:text-slate-200'
            }`}
          >
            {opt.icon}
            {!compact && <span className="hidden sm:inline">{opt.label}</span>}
          </button>
        );
      })}
    </div>
  );
}
