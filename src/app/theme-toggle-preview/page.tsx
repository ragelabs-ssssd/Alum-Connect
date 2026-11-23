'use client';

import React, { useState } from 'react';
import {
  Check,
  ChevronDown,
  Monitor,
  Moon,
  Palette,
  SlidersHorizontal,
  Sun,
  SunMoon,
} from 'lucide-react';

type Mode = 'system' | 'light' | 'dark';

function ModeIcon({ mode, className = 'w-4 h-4' }: { mode: Mode; className?: string }) {
  if (mode === 'light') return <Sun className={className} />;
  if (mode === 'dark') return <Moon className={className} />;
  return <Monitor className={className} />;
}

export default function ThemeTogglePreviewPage() {
  const [modes, setModes] = useState<Record<number, Mode>>({
    1: 'system',
    2: 'system',
    3: 'light',
    4: 'system',
    5: 'system',
    6: 'system',
    7: 'system',
    8: 'light',
    9: 'light',
    10: 'system',
  });
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const cycle = (id: number) => {
    const order: Mode[] = ['system', 'light', 'dark'];
    setModes((prev) => {
      const cur = prev[id] ?? 'system';
      return { ...prev, [id]: order[(order.indexOf(cur) + 1) % 3] };
    });
  };

  const setMode = (id: number, m: Mode) => {
    setModes((prev) => ({ ...prev, [id]: m }));
    setOpenMenu(null);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <header className="sticky top-0 z-20 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <h1 className="text-lg font-bold tracking-tight">
            Theme Toggle Options — 10 Designs (Local Review)
          </h1>
          <p className="text-xs text-[#52525B]">
            Click any control below to test it. Reply with your chosen option number (1–10) and I will apply it live to the navbar.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1 */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">1</span>
            <div>
              <h2 className="text-sm font-bold">Single Icon Cycler</h2>
              <p className="text-[11px] text-[#52525B]">Shows only the active icon; click to cycle System → Light → Dark.</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#F4F4F5] p-4 flex items-center justify-between">
            <span className="text-xs font-medium text-[#52525B]">Navbar Preview</span>
            <button
              type="button"
              onClick={() => cycle(1)}
              title={`Theme: ${modes[1]}`}
              className="h-9 w-9 rounded-full border border-[#E4E4E7] bg-white flex items-center justify-center text-[#18181B] hover:border-[#2563EB] transition-colors shadow-2xs"
            >
              <ModeIcon mode={modes[1]} className="w-4 h-4 text-[#2563EB]" />
            </button>
          </div>
        </div>

        {/* Option 2 */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">2</span>
            <div>
              <h2 className="text-sm font-bold">Compact Dropdown Menu</h2>
              <p className="text-[11px] text-[#52525B]">Single icon button; opens a clean 3-item popover only when clicked.</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#F4F4F5] p-4 flex items-center justify-between relative">
            <span className="text-xs font-medium text-[#52525B]">Navbar Preview</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 2 ? null : 2)}
                className="h-9 px-2.5 rounded-full border border-[#E4E4E7] bg-white flex items-center gap-1 text-xs font-medium hover:border-[#2563EB]"
              >
                <ModeIcon mode={modes[2]} className="w-4 h-4 text-[#2563EB]" />
                <ChevronDown className="w-3 h-3 text-[#52525B]" />
              </button>
              {openMenu === 2 && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl border border-[#E4E4E7] bg-white p-1.5 shadow-lg z-10">
                  {(['system', 'light', 'dark'] as Mode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(2, m)}
                      className="w-full flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs capitalize hover:bg-[#F4F4F5]"
                    >
                      <span className="flex items-center gap-2">
                        <ModeIcon mode={m} className="w-3.5 h-3.5" />
                        {m}
                      </span>
                      {modes[2] === m && <Check className="w-3.5 h-3.5 text-[#2563EB]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Option 3 */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">3</span>
            <div>
              <h2 className="text-sm font-bold">2-State Sliding Switch (Light / Dark)</h2>
              <p className="text-[11px] text-[#52525B]">Minimalist pill switch without the 3rd System icon.</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#F4F4F5] p-4 flex items-center justify-between">
            <span className="text-xs font-medium text-[#52525B]">Navbar Preview</span>
            <button
              type="button"
              onClick={() => setMode(3, modes[3] === 'dark' ? 'light' : 'dark')}
              className={`relative inline-flex h-7 w-13 items-center rounded-full p-0.5 transition-colors ${
                modes[3] === 'dark' ? 'bg-[#18181B]' : 'bg-zinc-300'
              }`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow transition-transform ${
                  modes[3] === 'dark' ? 'translate-x-6' : 'translate-x-0'
                }`}
              >
                {modes[3] === 'dark' ? (
                  <Moon className="w-3.5 h-3.5 text-[#18181B]" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Option 4 */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">4</span>
            <div>
              <h2 className="text-sm font-bold">Hover-Expand Pill</h2>
              <p className="text-[11px] text-[#52525B]">Shows only 1 icon at rest; smoothly reveals all 3 on hover.</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#F4F4F5] p-4 flex items-center justify-between">
            <span className="text-xs font-medium text-[#52525B]">Hover the icon →</span>
            <div className="group inline-flex items-center rounded-full border border-[#E4E4E7] bg-white p-1 transition-all">
              {(['system', 'light', 'dark'] as Mode[]).map((m) => {
                const active = modes[4] === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(4, m)}
                    className={`h-7 rounded-full flex items-center justify-center transition-all overflow-hidden ${
                      active
                        ? 'w-7 bg-[#F4F4F5] text-[#2563EB]'
                        : 'w-0 opacity-0 group-hover:w-7 group-hover:opacity-100 text-[#52525B]'
                    }`}
                  >
                    <ModeIcon mode={m} className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Option 5 */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">5</span>
            <div>
              <h2 className="text-sm font-bold">Labeled Mini Chip</h2>
              <p className="text-[11px] text-[#52525B]">Compact pill showing active mode label (`Auto` / `Light` / `Dark`).</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#F4F4F5] p-4 flex items-center justify-between">
            <span className="text-xs font-medium text-[#52525B]">Navbar Preview</span>
            <button
              type="button"
              onClick={() => cycle(5)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3 py-1.5 text-xs font-semibold hover:border-[#2563EB]"
            >
              <ModeIcon mode={modes[5]} className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="capitalize">{modes[5] === 'system' ? 'Auto' : modes[5]}</span>
            </button>
          </div>
        </div>

        {/* Option 6 */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">6</span>
            <div>
              <h2 className="text-sm font-bold">Appearance Sliders Popover</h2>
              <p className="text-[11px] text-[#52525B]">Subtle palette/sliders icon in navbar; opens segmented picker on click.</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#F4F4F5] p-4 flex items-center justify-between relative">
            <span className="text-xs font-medium text-[#52525B]">Navbar Preview</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 6 ? null : 6)}
                className="h-9 w-9 rounded-full border border-[#E4E4E7] bg-white flex items-center justify-center hover:border-[#2563EB]"
              >
                <Palette className="w-4 h-4 text-[#52525B]" />
              </button>
              {openMenu === 6 && (
                <div className="absolute right-0 mt-2 rounded-2xl border border-[#E4E4E7] bg-white p-2 shadow-lg z-10 flex items-center gap-1">
                  {(['system', 'light', 'dark'] as Mode[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(6, m)}
                      className={`rounded-xl px-2.5 py-1.5 text-[11px] font-semibold capitalize ${
                        modes[6] === m ? 'bg-[#18181B] text-white' : 'text-[#52525B] hover:bg-[#F4F4F5]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Option 7 */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">7</span>
            <div>
              <h2 className="text-sm font-bold">Inside Profile Avatar Menu</h2>
              <p className="text-[11px] text-[#52525B]">Zero extra navbar icons — theme lives inside your avatar dropdown.</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#F4F4F5] p-4 flex items-center justify-between relative">
            <span className="text-xs font-medium text-[#52525B]">Click Avatar →</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpenMenu(openMenu === 7 ? null : 7)}
                className="h-9 w-9 rounded-full border-2 border-white shadow-xs overflow-hidden"
              >
                <img src="/images/avatar-female-1.jpg" alt="Profile" className="h-full w-full object-cover" />
              </button>
              {openMenu === 7 && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-[#E4E4E7] bg-white p-2 shadow-lg z-10 space-y-1.5">
                  <div className="px-2 py-1 text-[11px] font-bold text-[#52525B]">Appearance</div>
                  <div className="grid grid-cols-3 gap-1 bg-[#F4F4F5] p-1 rounded-xl">
                    {(['system', 'light', 'dark'] as Mode[]).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(7, m)}
                        className={`rounded-lg py-1 text-[10px] font-semibold capitalize ${
                          modes[7] === m ? 'bg-white text-[#18181B] shadow-2xs' : 'text-[#52525B]'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Option 8 */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">8</span>
            <div>
              <h2 className="text-sm font-bold">Discreet Bottom-Right Corner Button</h2>
              <p className="text-[11px] text-[#52525B]">Removed from the top navbar; tucked quietly in the bottom-right corner.</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#F4F4F5] p-4 flex items-end justify-between h-20">
            <span className="text-xs font-medium text-[#52525B]">Bottom-right corner →</span>
            <button
              type="button"
              onClick={() => setMode(8, modes[8] === 'dark' ? 'light' : 'dark')}
              className="h-8 w-8 rounded-full bg-[#18181B] text-white flex items-center justify-center shadow-md hover:scale-105 transition-transform"
            >
              {modes[8] === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Option 9 */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">9</span>
            <div>
              <h2 className="text-sm font-bold">Minimalist Sun/Moon Square Button</h2>
              <p className="text-[11px] text-[#52525B]">Clean 36px rounded-xl icon button matching Apple/Vercel headers.</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#F4F4F5] p-4 flex items-center justify-between">
            <span className="text-xs font-medium text-[#52525B]">Navbar Preview</span>
            <button
              type="button"
              onClick={() => setMode(9, modes[9] === 'dark' ? 'light' : 'dark')}
              className="h-9 w-9 rounded-xl border border-[#E4E4E7] bg-white flex items-center justify-center hover:bg-zinc-50"
            >
              <SunMoon className="w-4 h-4 text-[#18181B]" />
            </button>
          </div>
        </div>

        {/* Option 10 */}
        <div className="rounded-2xl border border-[#E4E4E7] bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">10</span>
            <div>
              <h2 className="text-sm font-bold">Ghost Text + Shortcut Hint</h2>
              <p className="text-[11px] text-[#52525B]">Ultra-clean subtle button with no pill border until hovered.</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#F4F4F5] p-4 flex items-center justify-between">
            <span className="text-xs font-medium text-[#52525B]">Navbar Preview</span>
            <button
              type="button"
              onClick={() => cycle(10)}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[#52525B] hover:bg-white hover:text-[#18181B] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="capitalize">{modes[10]}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
