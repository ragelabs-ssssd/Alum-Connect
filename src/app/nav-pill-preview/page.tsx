'use client';

import React, { useState } from 'react';
import {
  ArrowRight,
  Briefcase,
  ChevronDown,
  Code2,
  Command,
  GitBranch,
  GraduationCap,
  LogIn,
  Moon,
  ShieldCheck,
  Sun,
  Terminal,
} from 'lucide-react';

export default function NavPillPreviewPage() {
  const [mode, setMode] = useState<'dark' | 'light'>('dark');
  const isDark = mode === 'dark';

  const border = isDark ? 'border-[rgba(226,232,240,0.18)]' : 'border-[rgba(100,116,139,0.22)]';
  const pillBg = isDark ? 'bg-white/[0.06]' : 'bg-white/75';
  const muted = isDark ? 'text-[#94A3B8]' : 'text-[#475569]';
  const accent = isDark ? 'text-[#22D3EE]' : 'text-[#0891B2]';
  const accent2 = isDark ? 'text-[#34D399]' : 'text-[#059669]';

  const options: { id: number; name: string; el: React.ReactNode }[] = [
    {
      id: 1,
      name: 'Clean Segmented Tabs (Human Labels)',
      el: (
        <div className={`inline-flex items-center gap-1 rounded-full border ${border} ${pillBg} p-1 text-xs font-semibold`}>
          {['Student', 'Alumni', 'Dean', 'Sign In'].map((label, i) => (
            <span key={label} className={`rounded-full px-3.5 py-1 ${i === 3 ? (isDark ? 'bg-[#22D3EE] text-[#041E24]' : 'bg-[#0F172A] text-white') : `${muted} hover:opacity-80`}`}>
              {label}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 2,
      name: 'Command Bar (⌘K + Quick Links)',
      el: (
        <div className={`inline-flex items-center gap-3 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-xs`}>
          <span className={`inline-flex items-center gap-1 font-mono ${muted}`}><Command className="w-3 h-3" />K</span>
          <span className="opacity-30">|</span>
          <span className={`font-medium ${accent}`}>Student</span>
          <span className={`font-medium ${accent}`}>Alumni</span>
          <span className={`font-medium ${accent}`}>Dean</span>
          <span className={`font-medium ${accent2}`}>Login</span>
        </div>
      ),
    },
    {
      id: 3,
      name: 'Live Beacon + Portal Pills',
      el: (
        <div className={`inline-flex items-center gap-3 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-xs`}>
          <span className="inline-flex items-center gap-1.5 font-semibold text-[#34D399]">
            <span className="h-2 w-2 rounded-full bg-[#34D399] animate-pulse" /> Live
          </span>
          <span className={muted}>•</span>
          <span className="font-medium">Student</span>
          <span className="font-medium">Alumni</span>
          <span className="font-medium">Dean</span>
          <span className={`font-semibold ${accent}`}>Login →</span>
        </div>
      ),
    },
    {
      id: 4,
      name: 'Icon + Label Glass Pill',
      el: (
        <div className={`inline-flex items-center gap-3 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-xs font-medium`}>
          <span className="inline-flex items-center gap-1"><Code2 className={`w-3.5 h-3.5 ${accent}`} /> Student</span>
          <span className="inline-flex items-center gap-1"><Briefcase className={`w-3.5 h-3.5 ${accent2}`} /> Alumni</span>
          <span className="inline-flex items-center gap-1"><GraduationCap className={`w-3.5 h-3.5 ${accent}`} /> Dean</span>
          <span className="inline-flex items-center gap-1"><LogIn className={`w-3.5 h-3.5 ${accent2}`} /> Login</span>
        </div>
      ),
    },
    {
      id: 5,
      name: 'Departure Mono CLI Path',
      el: (
        <div className={`font-luma-title inline-flex items-center gap-2.5 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-[11px]`}>
          <span className={muted}>~/iter/</span>
          <span className={accent}>student</span>
          <span className={muted}>/</span>
          <span className={accent}>alumni</span>
          <span className={muted}>/</span>
          <span className={accent}>dean</span>
          <span className={muted}>/</span>
          <span className={accent2}>login</span>
        </div>
      ),
    },
    {
      id: 6,
      name: 'Ultra-Minimal Borderless Links',
      el: (
        <div className="inline-flex items-center gap-6 px-2 py-1.5 text-xs font-semibold">
          <span className="hover:underline">Student Feed</span>
          <span className="hover:underline">Alumni Hub</span>
          <span className="hover:underline">Dean Telemetry</span>
          <span className={`${accent} hover:underline`}>Sign In</span>
        </div>
      ),
    },
    {
      id: 7,
      name: 'Gradient Hairline Border Pill',
      el: (
        <div className="inline-flex rounded-full p-[1px]" style={{ background: 'linear-gradient(90deg, #22D3EE, #34D399)' }}>
          <div className={`inline-flex items-center gap-3 rounded-full px-4 py-1.5 text-xs font-semibold ${isDark ? 'bg-[#0C0F16]' : 'bg-white'}`}>
            <span>Student</span>
            <span className={muted}>·</span>
            <span>Alumni</span>
            <span className={muted}>·</span>
            <span>Dean</span>
            <span className={muted}>·</span>
            <span className={accent}>Login</span>
          </div>
        </div>
      ),
    },
    {
      id: 8,
      name: 'Live Telemetry Counter Nav',
      el: (
        <div className={`inline-flex items-center gap-3 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-xs`}>
          <span><strong className={accent}>50</strong> Builds</span>
          <span className="opacity-30">|</span>
          <span><strong className={accent2}>32</strong> Deals</span>
          <span className="opacity-30">|</span>
          <span>Dean</span>
          <span className="opacity-30">|</span>
          <span className="font-semibold">Login →</span>
        </div>
      ),
    },
    {
      id: 9,
      name: 'Split Portals + Solid Sign In CTA',
      el: (
        <div className={`inline-flex items-center gap-2 rounded-full border ${border} ${pillBg} pl-4 pr-1 py-1 text-xs`}>
          <span className="font-medium">Student</span>
          <span className={muted}>·</span>
          <span className="font-medium">Alumni</span>
          <span className={muted}>·</span>
          <span className="font-medium mr-1">Dean</span>
          <span className="rounded-full px-3 py-1 font-semibold" style={{ background: isDark ? 'linear-gradient(90deg,#22D3EE,#34D399)' : '#0F172A', color: isDark ? '#041E24' : '#fff' }}>
            Sign In →
          </span>
        </div>
      ),
    },
    {
      id: 10,
      name: 'macOS Floating Glass Dock',
      el: (
        <div className={`inline-flex items-center gap-1.5 rounded-2xl border ${border} ${pillBg} backdrop-blur-xl px-2.5 py-1.5 text-xs shadow-lg`}>
          {['Student', 'Alumni', 'Dean', 'Login'].map((l) => (
            <span key={l} className={`rounded-xl px-3 py-1 font-semibold ${isDark ? 'hover:bg-white/10' : 'hover:bg-slate-900/5'}`}>{l}</span>
          ))}
        </div>
      ),
    },
    {
      id: 11,
      name: 'Sharp Pixel-Corner Bar (Departure)',
      el: (
        <div className={`font-luma-title inline-flex items-center gap-3 rounded-lg border ${border} ${pillBg} px-4 py-1.5 text-[11px]`}>
          <span className={accent}>[STUDENT]</span>
          <span className={accent2}>[ALUMNI]</span>
          <span>[DEAN]</span>
          <span>[LOGIN]</span>
        </div>
      ),
    },
    {
      id: 12,
      name: 'Numbered Editorial Index',
      el: (
        <div className={`inline-flex items-center gap-3.5 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-xs`}>
          <span><b className={`font-mono ${accent}`}>01</b> Student</span>
          <span><b className={`font-mono ${accent}`}>02</b> Alumni</span>
          <span><b className={`font-mono ${accent}`}>03</b> Dean</span>
          <span><b className={`font-mono ${accent2}`}>04</b> Login</span>
        </div>
      ),
    },
    {
      id: 13,
      name: 'Compact Portal Dropdown + Login',
      el: (
        <div className="inline-flex items-center gap-2 text-xs">
          <span className={`inline-flex items-center gap-1.5 rounded-full border ${border} ${pillBg} px-3.5 py-1.5 font-semibold`}>
            Portals <ChevronDown className="w-3.5 h-3.5" />
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full border ${border} ${pillBg} px-3.5 py-1.5 font-semibold ${accent}`}>
            Sign In <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      ),
    },
    {
      id: 14,
      name: 'Two-Tone Badge + Route Strip',
      el: (
        <div className={`inline-flex items-center rounded-full border ${border} ${pillBg} overflow-hidden text-xs`}>
          <span className={`px-3 py-1.5 font-bold ${isDark ? 'bg-[#22D3EE] text-[#041E24]' : 'bg-[#0F172A] text-white'}`}>PORTALS</span>
          <div className="px-3.5 py-1.5 flex items-center gap-2.5 font-mono">
            <span>/student</span>
            <span>/alumni</span>
            <span>/dean</span>
            <span className={accent}>/login</span>
          </div>
        </div>
      ),
    },
    {
      id: 15,
      name: 'Keyboard Hotkey Pills',
      el: (
        <div className={`inline-flex items-center gap-3 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-xs`}>
          {[['S', 'Student'], ['A', 'Alumni'], ['D', 'Dean'], ['L', 'Login']].map(([k, lbl]) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <kbd className={`rounded border ${border} px-1.5 py-0.2 font-mono text-[10px] ${accent}`}>{k}</kbd>
              <span className="font-medium">{lbl}</span>
            </span>
          ))}
        </div>
      ),
    },
    {
      id: 16,
      name: 'Tracked Uppercase Monospace',
      el: (
        <div className={`inline-flex items-center gap-3 rounded-full border ${border} ${pillBg} px-5 py-1.5 font-mono text-[11px] uppercase tracking-widest`}>
          <span className={accent}>Student</span>
          <span className={muted}>•</span>
          <span>Alumni</span>
          <span className={muted}>•</span>
          <span>Dean</span>
          <span className={muted}>•</span>
          <span className={accent2}>Login</span>
        </div>
      ),
    },
    {
      id: 17,
      name: 'Active Pill Highlight (Gradient)',
      el: (
        <div className={`inline-flex items-center gap-1 rounded-full border ${border} ${pillBg} p-1 text-xs font-semibold`}>
          <span className="px-3 py-1">Student</span>
          <span className="px-3 py-1">Alumni</span>
          <span className="px-3 py-1">Dean</span>
          <span className="rounded-full px-3.5 py-1" style={{ background: 'linear-gradient(90deg, #22D3EE, #34D399)', color: '#041E24' }}>
            Sign In
          </span>
        </div>
      ),
    },
    {
      id: 18,
      name: 'Git Branch Route Bar',
      el: (
        <div className={`inline-flex items-center gap-2.5 rounded-full border ${border} ${pillBg} px-4 py-1.5 font-mono text-xs`}>
          <GitBranch className={`w-3.5 h-3.5 ${accent2}`} />
          <span className={muted}>main:</span>
          <span className={accent}>student</span>
          <span className={accent}>alumni</span>
          <span className={accent}>dean</span>
          <span className={accent2}>login</span>
        </div>
      ),
    },
    {
      id: 19,
      name: 'Verified ITER Strip + Portals',
      el: (
        <div className={`inline-flex items-center gap-3 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-xs`}>
          <span className={`inline-flex items-center gap-1 font-semibold ${accent2}`}>
            <ShieldCheck className="w-3.5 h-3.5" /> ITER Verified
          </span>
          <span className="opacity-30">|</span>
          <span>Student</span>
          <span>Alumni</span>
          <span>Dean</span>
          <span className={accent}>Login</span>
        </div>
      ),
    },
    {
      id: 20,
      name: 'Ultra-Compact 4-Icon Pill',
      el: (
        <div className={`inline-flex items-center gap-2 rounded-full border ${border} ${pillBg} p-1.5`}>
          <span title="Student" className={`p-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200/70'}`}><Code2 className={`w-4 h-4 ${accent}`} /></span>
          <span title="Alumni" className={`p-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200/70'}`}><Briefcase className={`w-4 h-4 ${accent2}`} /></span>
          <span title="Dean" className={`p-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200/70'}`}><GraduationCap className="w-4 h-4" /></span>
          <span title="Login" className={`p-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-200/70'}`}><LogIn className={`w-4 h-4 ${accent}`} /></span>
        </div>
      ),
    },
    {
      id: 21,
      name: 'Clean Underline Accent Tabs',
      el: (
        <div className="inline-flex items-center gap-5 text-xs font-semibold">
          <span className={`border-b-2 pb-1 ${isDark ? 'border-[#22D3EE] text-[#22D3EE]' : 'border-[#0891B2] text-[#0891B2]'}`}>Student</span>
          <span className={`pb-1 ${muted}`}>Alumni</span>
          <span className={`pb-1 ${muted}`}>Dean</span>
          <span className={`pb-1 ${muted}`}>Login</span>
        </div>
      ),
    },
    {
      id: 22,
      name: 'Action-Driven Labels',
      el: (
        <div className={`inline-flex items-center gap-3 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-xs font-semibold`}>
          <span className={accent}>Build</span>
          <span className={muted}>•</span>
          <span className={accent2}>Hire</span>
          <span className={muted}>•</span>
          <span>Telemetry</span>
          <span className={muted}>•</span>
          <span>Sign In →</span>
        </div>
      ),
    },
    {
      id: 23,
      name: 'Terminal Prompt Pill',
      el: (
        <div className={`inline-flex items-center gap-2.5 rounded-full border ${border} bg-[#090D14] text-slate-200 px-4 py-1.5 font-mono text-xs`}>
          <Terminal className="w-3.5 h-3.5 text-[#34D399]" />
          <span className="text-slate-400">cd</span>
          <span className="text-[#22D3EE]">/student</span>
          <span className="text-[#22D3EE]">/alumni</span>
          <span className="text-[#22D3EE]">/dean</span>
          <span className="text-[#34D399]">/login</span>
        </div>
      ),
    },
    {
      id: 24,
      name: 'Online Network Presence Pill',
      el: (
        <div className={`inline-flex items-center gap-3 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-xs`}>
          <span className={muted}><b className={accent2}>45</b> Online</span>
          <span className="opacity-30">|</span>
          <span>Student</span>
          <span>Alumni</span>
          <span>Dean</span>
          <span className={accent}>Login</span>
        </div>
      ),
    },
    {
      id: 25,
      name: 'Hairline Vertical Divider Capsule',
      el: (
        <div className={`inline-flex items-center rounded-full border ${border} ${pillBg} divide-x ${isDark ? 'divide-white/15' : 'divide-slate-300'} text-xs font-medium`}>
          <span className="px-3.5 py-1.5">Student</span>
          <span className="px-3.5 py-1.5">Alumni</span>
          <span className="px-3.5 py-1.5">Dean</span>
          <span className={`px-3.5 py-1.5 font-semibold ${accent}`}>Login</span>
        </div>
      ),
    },
    {
      id: 26,
      name: 'Role-Colored Status Dots',
      el: (
        <div className={`inline-flex items-center gap-3.5 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-xs font-medium`}>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#22D3EE]" /> Student</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#34D399]" /> Alumni</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-indigo-400" /> Dean</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" /> Login</span>
        </div>
      ),
    },
    {
      id: 27,
      name: 'Explore-Driven Capsule',
      el: (
        <div className={`inline-flex items-center gap-2.5 rounded-full border ${border} ${pillBg} px-4 py-1.5 text-xs`}>
          <span className={muted}>Explore:</span>
          <span className={`font-semibold ${accent}`}>Builds</span>
          <span className={muted}>·</span>
          <span className="font-semibold">Hiring</span>
          <span className={muted}>·</span>
          <span className="font-semibold">Dean</span>
          <span className={muted}>·</span>
          <span className={`font-semibold ${accent2}`}>Sign In</span>
        </div>
      ),
    },
    {
      id: 28,
      name: 'Separated Individual Floating Pills',
      el: (
        <div className="inline-flex items-center gap-2 text-xs font-semibold">
          {['/student', '/alumni', '/dean', '/login'].map((r) => (
            <span key={r} className={`rounded-full border ${border} ${pillBg} px-3 py-1 font-mono ${accent}`}>{r}</span>
          ))}
        </div>
      ),
    },
    {
      id: 29,
      name: 'Minimalist Slash Bar (No Label)',
      el: (
        <div className={`inline-flex items-center gap-3 rounded-full border ${border} ${pillBg} px-4 py-1.5 font-mono text-xs ${accent}`}>
          <span>/student</span>
          <span className={muted}>/</span>
          <span>/alumni</span>
          <span className={muted}>/</span>
          <span>/dean</span>
          <span className={muted}>/</span>
          <span className={accent2}>/login</span>
        </div>
      ),
    },
    {
      id: 30,
      name: 'Flagship Departure Glass Bar + Sign In',
      el: (
        <div className={`inline-flex items-center gap-1.5 rounded-full border ${border} ${pillBg} backdrop-blur-xl p-1 text-xs`}>
          <span className="font-luma-title px-3 py-1">Student</span>
          <span className="font-luma-title px-3 py-1">Alumni</span>
          <span className="font-luma-title px-3 py-1">Dean</span>
          <span className="rounded-full px-3.5 py-1 font-semibold inline-flex items-center gap-1" style={{ background: isDark ? 'linear-gradient(90deg,#22D3EE,#34D399)' : '#0F172A', color: isDark ? '#041E24' : '#fff' }}>
            Login <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Header Quick-Jump Pill — 30 Options (Local Review)
            </h1>
            <p className="text-xs text-[#52525B]">
              Styled in your Liquid Chrome + Cyan/Emerald + Departure Mono theme. Reply with your chosen number (1–30) to apply to `/` and push live!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('light')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
                !isDark ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-white text-zinc-700 border-[#E4E4E7]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Light
            </button>
            <button
              type="button"
              onClick={() => setMode('dark')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border ${
                isDark ? 'bg-[#18181B] text-white border-[#18181B]' : 'bg-white text-zinc-700 border-[#E4E4E7]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Dark
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => (
          <div
            key={opt.id}
            className={`rounded-2xl border p-5 space-y-3 transition-colors ${
              isDark
                ? 'border-[rgba(226,232,240,0.16)] bg-[#0A0D13] text-white'
                : 'border-[rgba(100,116,139,0.22)] bg-[#EEF2F6] text-[#0F172A]'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 min-w-6 px-1.5 items-center justify-center rounded-full bg-[#22D3EE]/15 text-[#22D3EE] text-[11px] font-bold">
                {opt.id}
              </span>
              <span className="text-xs font-bold">{opt.name}</span>
            </div>
            <div className="pt-1 overflow-x-auto">{opt.el}</div>
          </div>
        ))}
      </main>
    </div>
  );
}
