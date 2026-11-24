'use client';

import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

type FinishMode = 'accent' | 'mono' | 'badge';

interface MonogramDef {
  id: number;
  name: string;
  desc: string;
  render: (primary: string, accent: string, accent2: string, bg: string) => React.ReactNode;
}

const MONOGRAMS: MonogramDef[] = [
  {
    id: 1,
    name: 'Slashed Minimal A',
    desc: 'Crisp A without a crossbar, sliced by a diagonal gap.',
    render: (p, a) => (
      <g>
        <polygon points="18,4 7,31 12.5,31 20.5,11" fill={p} />
        <polygon points="21,13 29,31 23.5,31 18,18.5" fill={a} />
      </g>
    ),
  },
  {
    id: 2,
    name: 'Stenciled A + Core Dot',
    desc: 'Two clean angled blades anchored by a floating dot.',
    render: (p, a, a2) => (
      <g>
        <polygon points="16.5,5 5,31 11,31 18,14" fill={p} />
        <polygon points="19.5,5 31,31 25,31 18,14" fill={a} />
        <circle cx="18" cy="26" r="2.8" fill={a2} />
      </g>
    ),
  },
  {
    id: 3,
    name: 'Continuous AC Ligature',
    desc: 'Single fluid geometric stroke flowing from A into C.',
    render: (p, a) => (
      <g>
        <path d="M5 29 L12.5 8 L20 29" stroke={p} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M30 13 A7.5 7.5 0 1 0 30 25" stroke={a} strokeWidth="3.6" strokeLinecap="round" fill="none" />
        <line x1="8.5" y1="22" x2="16.5" y2="22" stroke={a} strokeWidth="3" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: 4,
    name: 'Interlocked A & C',
    desc: 'Bold C wrapping cleanly around a sharp A spine.',
    render: (p, a) => (
      <g>
        <path d="M27 10 A11.5 11.5 0 1 0 27 26" stroke={a} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M13 28 L19 9 L25 28" stroke={p} strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    ),
  },
  {
    id: 5,
    name: 'Ribbon-Fold A',
    desc: 'Two folded geometric planes forming a sculptural A.',
    render: (p, a) => (
      <g>
        <polygon points="18,4 24,4 11,31 5,31" fill={p} />
        <polygon points="18,4 24,4 31,31 25,31" fill={a} />
        <rect x="12" y="20" width="12" height="3.8" rx="1.9" fill={p} />
      </g>
    ),
  },
  {
    id: 6,
    name: 'Negative-Space A in C',
    desc: 'Heavy C-disc whose carved center forms an A.',
    render: (p, a, _a2, bg) => (
      <g>
        <path d="M28 10 A13 13 0 1 0 28 26 L23 22 A7 7 0 1 1 23 14 Z" fill={p} />
        <polygon points="18,11 24,25 20.5,25 18,18.5 15.5,25 12,25" fill={a} />
        <rect x="15.5" y="21" width="5" height="2" fill={bg} />
      </g>
    ),
  },
  {
    id: 7,
    name: 'Departure Pixel A',
    desc: 'Architectural stepped pixel A echoing your Departure Mono font.',
    render: (p, a, a2) => (
      <g>
        <rect x="14" y="5" width="8" height="5" fill={a} />
        <rect x="8" y="10" width="6" height="6" fill={p} />
        <rect x="22" y="10" width="6" height="6" fill={p} />
        <rect x="8" y="16" width="20" height="5" fill={a2} />
        <rect x="6" y="21" width="6" height="10" fill={p} />
        <rect x="24" y="21" width="6" height="10" fill={p} />
      </g>
    ),
  },
  {
    id: 8,
    name: 'Split-Apex A',
    desc: 'Symmetrical twin blades separated by a razor-thin gap.',
    render: (p, a) => (
      <g>
        <polygon points="17,5 5,31 11.5,31 17,18" fill={p} />
        <polygon points="19,5 31,31 24.5,31 19,18" fill={a} />
      </g>
    ),
  },
  {
    id: 9,
    name: 'Italic Velocity A',
    desc: 'Forward-leaning A conveying startup speed.',
    render: (p, a) => (
      <g>
        <polygon points="19,6 25,6 11,30 5,30" fill={p} />
        <polygon points="22,6 27,6 29,30 23.5,30" fill={a} />
        <polygon points="13,20 26,20 25,24 11,24" fill={p} />
      </g>
    ),
  },
  {
    id: 10,
    name: 'Double-Contour A',
    desc: 'Nested monoline A inside a bold outer A frame.',
    render: (p, a) => (
      <g>
        <path d="M6 30 L18 6 L30 30" stroke={p} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M12 30 L18 16 L24 30" stroke={a} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
    ),
  },
  {
    id: 11,
    name: 'Compact AC Block',
    desc: 'Balanced geometric A and C locked side by side.',
    render: (p, a) => (
      <g>
        <path d="M5 27 L11 9 L17 27" stroke={p} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="7.5" y1="21.5" x2="14.5" y2="21.5" stroke={p} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M31 12 A7.5 8.5 0 1 0 31 24" stroke={a} strokeWidth="3.6" strokeLinecap="round" fill="none" />
      </g>
    ),
  },
  {
    id: 12,
    name: 'Delta A + C Arc Cut',
    desc: 'Solid triangular A carved by a clean sweeping C arc.',
    render: (p, a, _a2, bg) => (
      <g>
        <polygon points="18,4 32,31 4,31" fill={p} />
        <path d="M27 17 A9 9 0 1 0 27 27" stroke={bg} strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="18" cy="22" r="2.8" fill={a} />
      </g>
    ),
  },
  {
    id: 13,
    name: 'Open-Top A Spire',
    desc: 'Two rising strokes topped with a floating apex dot.',
    render: (p, a, a2) => (
      <g>
        <path d="M7 30 L15 11" stroke={p} strokeWidth="4" strokeLinecap="round" />
        <path d="M29 30 L21 11" stroke={p} strokeWidth="4" strokeLinecap="round" />
        <circle cx="18" cy="6" r="2.8" fill={a} />
        <line x1="12" y1="23" x2="24" y2="23" stroke={a2} strokeWidth="3.2" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: 14,
    name: 'Rounded Capsule A',
    desc: 'Smooth friendly capsule strokes forming a modern A.',
    render: (p, a) => (
      <g>
        <path d="M8 29 L18 7 L28 29" stroke={p} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <rect x="13" y="21" width="10" height="4.5" rx="2.25" fill={a} />
      </g>
    ),
  },
  {
    id: 15,
    name: 'Parallel Rail AC',
    desc: 'Architectural dual-rail lines forming A and C.',
    render: (p, a) => (
      <g>
        <path d="M6 28 L14 8 L22 28" stroke={p} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M11 28 L15 17 L19 28" stroke={a} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M30 12 A7 8 0 1 0 30 24" stroke={a} strokeWidth="2.8" strokeLinecap="round" fill="none" />
      </g>
    ),
  },
  {
    id: 16,
    name: 'Diamond-Counter A',
    desc: 'Bold A with a sharp diamond negative-space center.',
    render: (p, a, _a2, bg) => (
      <g>
        <polygon points="18,4 32,31 24,31 18,22 12,31 4,31" fill={p} />
        <polygon points="18,11 22,17 18,23 14,17" fill={bg} />
        <polygon points="18,13 20.5,17 18,21 15.5,17" fill={a} />
      </g>
    ),
  },
  {
    id: 17,
    name: 'Modern Lowercase a',
    desc: 'Geometric lowercase a with a clean detached stem.',
    render: (p, a) => (
      <g>
        <circle cx="15.5" cy="20" r="8" stroke={p} strokeWidth="4.2" fill="none" />
        <rect x="23" y="10" width="4.5" height="20" rx="2.25" fill={a} />
      </g>
    ),
  },
  {
    id: 18,
    name: 'Asymmetric Wing A',
    desc: 'Vertical pillar on the left paired with a sweeping right wing.',
    render: (p, a) => (
      <g>
        <rect x="7" y="6" width="5" height="24" rx="2.5" fill={p} />
        <path d="M12 8 C23 8, 29 17, 29 30" stroke={a} strokeWidth="4.5" strokeLinecap="round" fill="none" />
        <line x1="12" y1="21" x2="23" y2="21" stroke={p} strokeWidth="3.5" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: 19,
    name: 'Hex-Framed AC',
    desc: 'Minimalist AC monogram framed inside a clean hexagon.',
    render: (p, a) => (
      <g>
        <polygon points="18,3 31,10.5 31,25.5 18,33 5,25.5 5,10.5" stroke={p} strokeWidth="2.4" fill="none" />
        <path d="M11 24 L16 11 L21 24" stroke={p} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M26 14 A4.5 5 0 1 0 26 22" stroke={a} strokeWidth="2.6" strokeLinecap="round" fill="none" />
      </g>
    ),
  },
  {
    id: 20,
    name: 'Parabolic Arch A',
    desc: 'Smooth architectural arch with a floating cyan crossbar.',
    render: (p, a) => (
      <g>
        <path d="M7 30 C7 8, 29 8, 29 30" stroke={p} strokeWidth="4.6" strokeLinecap="round" fill="none" />
        <rect x="13" y="21" width="10" height="4" rx="2" fill={a} />
      </g>
    ),
  },
  {
    id: 21,
    name: 'Isometric Folded A',
    desc: 'Three-plane 3D folded letter A.',
    render: (p, a, a2) => (
      <g>
        <polygon points="18,5 12,30 6,30 14,5" fill={p} />
        <polygon points="18,5 22,5 30,30 24,30" fill={a} />
        <polygon points="13,20 23,20 24.5,24.5 11.5,24.5" fill={a2} />
      </g>
    ),
  },
  {
    id: 22,
    name: 'Code Slash A/',
    desc: 'Sharp A paired with an adjacent developer slash.',
    render: (p, a) => (
      <g>
        <path d="M5 29 L13 8 L21 29" stroke={p} strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <line x1="9" y1="22" x2="17" y2="22" stroke={p} strokeWidth="3.2" strokeLinecap="round" />
        <line x1="29" y1="7" x2="22" y2="30" stroke={a} strokeWidth="3.8" strokeLinecap="round" />
      </g>
    ),
  },
  {
    id: 23,
    name: 'Solid A in C-Orbit',
    desc: 'Sharp solid A triangle nestled inside a crisp C arc.',
    render: (p, a) => (
      <g>
        <path d="M27 8 A13 13 0 1 0 27 28" stroke={p} strokeWidth="3.8" strokeLinecap="round" fill="none" />
        <polygon points="19,11 26,25 12,25" fill={a} />
      </g>
    ),
  },
  {
    id: 24,
    name: 'Flagship AC Monogram',
    desc: 'Balanced geometric A+C lockup built to scale from 16px to 120px.',
    render: (p, a, a2) => (
      <g>
        <polygon points="15,6 4,30 9.5,30 15,17 20.5,30 26,30" fill={p} />
        <path d="M31 12 A9 9 0 1 0 31 24" stroke={a} strokeWidth="3.6" strokeLinecap="round" fill="none" />
        <circle cx="15" cy="26" r="2.4" fill={a2} />
      </g>
    ),
  },
];

export default function LogoPreviewPage() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const [finish, setFinish] = useState<FinishMode>('accent');
  const isDark = mode === 'dark';

  const getColors = () => {
    if (finish === 'mono') {
      return isDark
        ? { p: '#FFFFFF', a: '#E2E8F0', a2: '#94A3B8', bg: '#0C0F16', wrapBg: 'transparent' }
        : { p: '#0F172A', a: '#334155', a2: '#64748B', bg: '#FFFFFF', wrapBg: 'transparent' };
    }
    if (finish === 'badge') {
      return {
        p: '#FFFFFF',
        a: '#041E24',
        a2: '#FFFFFF',
        bg: '#0891B2',
        wrapBg: 'linear-gradient(135deg, #22D3EE 0%, #34D399 100%)',
      };
    }
    return isDark
      ? { p: '#FFFFFF', a: '#22D3EE', a2: '#34D399', bg: '#0C0F16', wrapBg: 'transparent' }
      : { p: '#0F172A', a: '#0891B2', a2: '#059669', bg: '#FFFFFF', wrapBg: 'transparent' };
  };

  const cols = getColors();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Alum Connect — 24 Minimal &ldquo;A&rdquo; / &ldquo;AC&rdquo; Lettermark Monograms
            </h1>
            <p className="text-xs text-[#52525B]">
              Switch between all 3 finishes (Cyan/Emerald Accent, Pure Monochrome, Gradient Badge) + Light/Dark, then reply with your pick (1–24) + finish!
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full border border-[#E4E4E7] bg-zinc-100 p-0.5 text-xs font-semibold">
              {[
                { id: 'accent' as FinishMode, label: '1. Cyan/Emerald' },
                { id: 'mono' as FinishMode, label: '2. Monochrome' },
                { id: 'badge' as FinishMode, label: '3. Gradient Badge' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFinish(f.id)}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    finish === f.id ? 'bg-[#18181B] text-white' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] bg-white px-3.5 py-1.5 text-xs font-semibold hover:bg-zinc-50"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {isDark ? 'Light' : 'Dark'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {MONOGRAMS.map((logo) => (
          <div
            key={logo.id}
            className={`rounded-2xl border p-5 flex flex-col justify-between gap-4 transition-colors ${
              isDark
                ? 'border-[rgba(226,232,240,0.16)] bg-[#0C0F16] text-white'
                : 'border-[rgba(100,116,139,0.22)] bg-white text-[#0F172A]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex h-6 min-w-6 px-1.5 items-center justify-center rounded-full text-[11px] font-bold ${
                  isDark ? 'bg-white/10 text-[#22D3EE]' : 'bg-slate-100 text-[#0891B2]'
                }`}
              >
                {logo.id}
              </span>
              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                MONOGRAM
              </span>
            </div>

            <div
              className={`h-24 rounded-xl border flex items-center justify-center ${
                isDark ? 'border-white/10 bg-white/[0.03]' : 'border-slate-200 bg-slate-50/70'
              }`}
            >
              <div
                className="h-14 w-14 rounded-2xl flex items-center justify-center"
                style={{ background: cols.wrapBg }}
              >
                <svg width="42" height="42" viewBox="0 0 36 36">
                  {logo.render(cols.p, cols.a, cols.a2, cols.bg)}
                </svg>
              </div>
            </div>

            <div
              className={`rounded-xl border px-3 py-2 flex items-center gap-2.5 ${
                isDark ? 'border-white/10 bg-white/[0.04]' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div
                className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: cols.wrapBg }}
              >
                <svg width="20" height="20" viewBox="0 0 36 36">
                  {logo.render(cols.p, cols.a, cols.a2, cols.bg)}
                </svg>
              </div>
              <span className="font-luma-title text-xs truncate">AlmaConnect</span>
            </div>

            <div>
              <h2 className="text-xs font-bold">{logo.name}</h2>
              <p className={`text-[11px] mt-0.5 leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {logo.desc}
              </p>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
