'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Code2,
  Command,
  Flame,
  GraduationCap,
  Lock,
  Sparkles,
  Star,
  Terminal,
  Zap,
} from 'lucide-react';
import AlumConnectLogo from '../../components/AlumConnectLogo';
import ThemeToggle from '../../components/ThemeToggle';

interface NavOption {
  id: number;
  name: string;
  vibe: string;
  render: () => React.ReactNode;
}

const PORTAL_LINKS = [
  { href: '/student', label: 'Student Network', short: 'Students', icon: Code2 },
  { href: '/alumni', label: 'Alumni & Hiring', short: 'Alumni', icon: Briefcase },
  { href: '/dean', label: 'Dean & T&P', short: 'Dean', icon: GraduationCap },
];

export default function NavbarPreviewPage() {
  const [starred, setStarred] = useState<number[]>([1, 5, 12]);
  const [onlyStarred, setOnlyStarred] = useState(false);

  const toggleStar = (id: number) => {
    setStarred((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const options: NavOption[] = [
    {
      id: 1,
      name: 'Floating Glass Island',
      vibe: 'Centered floating pill with clean icon links + Sign In CTA',
      render: () => (
        <div className="px-4 py-3">
          <header className="max-w-[1440px] mx-auto rounded-full border border-zinc-200/80 dark:border-white/15 bg-white/85 dark:bg-[#11141B]/85 backdrop-blur-xl px-4 sm:px-6 h-14 flex items-center justify-between gap-4 shadow-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-zinc-100 dark:bg-white/[0.06] border border-zinc-200 dark:border-white/15 flex items-center justify-center">
                <AlumConnectLogo className="h-5 w-5" />
              </div>
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1 rounded-full bg-zinc-100/80 dark:bg-white/[0.05] p-1">
              {PORTAL_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-full px-3.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-white/10 hover:text-zinc-950 dark:hover:text-white transition-all"
                >
                  {l.short}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-4 py-1.5 text-xs font-semibold"
              >
                Sign In
              </Link>
              <ThemeToggle compact />
            </div>
          </header>
        </div>
      ),
    },
    {
      id: 2,
      name: 'Linear Precision Bar',
      vibe: 'Ultra-clean monochrome bar with subtle live pulse & action buttons',
      render: () => (
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090B]">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5">
                <AlumConnectLogo className="h-6 w-6" />
                <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
              </Link>
              <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {PORTAL_LINKS.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="hover:text-zinc-950 dark:hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
              <Link
                href="/login"
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-semibold hover:border-cyan-500 transition-colors"
              >
                Portal Login
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 3,
      name: '⌘K Command Launcher',
      vibe: 'Center command-palette pill for power users + portal quick links',
      render: () => (
        <header className="border-b border-zinc-200 dark:border-white/10 bg-white/90 dark:bg-[#0C0E12]/90 backdrop-blur-xl">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-zinc-900 dark:bg-white/[0.06] flex items-center justify-center">
                <AlumConnectLogo className="h-5 w-5" />
              </div>
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
            </Link>
            <div className="hidden md:flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-white/15 bg-zinc-50 dark:bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              <Command className="w-3.5 h-3.5 text-[#22D3EE]" />
              <span>Jump to:</span>
              {PORTAL_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-md bg-white dark:bg-white/10 px-2 py-0.5 text-[11px] font-medium text-zinc-800 dark:text-zinc-100 hover:text-[#22D3EE]"
                >
                  {l.short}
                </Link>
              ))}
              <kbd className="ml-1 rounded border border-zinc-300 dark:border-zinc-700 px-1.5 py-0.5 text-[10px] font-mono">
                ⌘K
              </kbd>
            </div>
            <div className="flex items-center gap-2.5">
              <Link href="/login" className="text-xs font-semibold hover:text-[#22D3EE]">
                Sign In
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 4,
      name: 'Neon Horizon Accent',
      vibe: 'Glowing cyan-emerald bottom hairline with sleek dark chrome pills',
      render: () => (
        <header className="relative border-b border-cyan-500/30 bg-white dark:bg-[#090B10]">
          <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE] to-transparent" />
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <AlumConnectLogo className="h-7 w-7" />
              <span className="font-luma-title text-xl leading-none">AlmaConnect</span>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              {PORTAL_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-white/10 px-3.5 py-1 text-xs font-medium hover:border-[#22D3EE] hover:text-[#22D3EE] transition-colors"
                >
                  <l.icon className="w-3.5 h-3.5" />
                  {l.short}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/share-project"
                className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-4 py-1.5 text-xs font-bold"
              >
                + Ship Build
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 5,
      name: 'Split Dual-Action Header',
      vibe: 'Brand left, clean portal tabs center, Ship + Sign In right',
      render: () => (
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0D1017]/95 backdrop-blur-md">
          <div className="max-w-[1440px] mx-auto px-6 h-15 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <AlumConnectLogo className="h-5 w-5" />
              </div>
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
              <Link href="/student" className="text-zinc-600 dark:text-zinc-300 hover:text-[#22D3EE]">
                Student Studio
              </Link>
              <Link href="/alumni" className="text-zinc-600 dark:text-zinc-300 hover:text-[#22D3EE]">
                Alumni Marketplace
              </Link>
              <Link href="/dean" className="text-zinc-600 dark:text-zinc-300 hover:text-[#22D3EE]">
                Placement Telemetry
              </Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full border border-zinc-300 dark:border-zinc-700 px-3.5 py-1.5 text-xs font-semibold"
              >
                Log in
              </Link>
              <Link
                href="/share-project"
                className="rounded-full bg-[#2563EB] text-white px-4 py-1.5 text-xs font-semibold"
              >
                Publish Build
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 6,
      name: 'Terminal Breadcrumb Bar',
      vibe: 'Developer-native ~/almaconnect/ path navigation',
      render: () => (
        <header className="border-b border-zinc-800 bg-[#09090B] text-white">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3 font-mono text-xs">
              <AlumConnectLogo className="h-6 w-6" />
              <span className="font-luma-title text-base">AlmaConnect</span>
              <span className="text-zinc-600 hidden sm:inline">/</span>
              <div className="hidden sm:flex items-center gap-2 text-zinc-400">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <Link href="/student" className="hover:text-cyan-400">students</Link>
                <span className="text-zinc-700">|</span>
                <Link href="/alumni" className="hover:text-cyan-400">alumni</Link>
                <span className="text-zinc-700">|</span>
                <Link href="/dean" className="hover:text-cyan-400">dean</Link>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-xs text-cyan-300 hover:border-cyan-400"
              >
                ssh login →
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 7,
      name: 'Minimalist Wordmark + 2 Buttons',
      vibe: 'Zero clutter center—only logo left, Get Started & Theme right',
      render: () => (
        <header className="border-b border-zinc-200/70 dark:border-white/10 bg-white/80 dark:bg-[#0B0D12]/80 backdrop-blur-md">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <AlumConnectLogo className="h-7 w-7" />
              <span className="font-luma-title text-xl leading-none">AlmaConnect</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/alumni"
                className="hidden sm:inline-flex text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-white"
              >
                For Recruiters
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-4 py-1.5 text-xs font-semibold"
              >
                Enter Network <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 8,
      name: 'Centered Brand Dock',
      vibe: 'Portals left, AlmaConnect centered, Actions right',
      render: () => (
        <header className="border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0D1017]">
          <div className="max-w-[1440px] mx-auto px-6 h-14 grid grid-cols-3 items-center">
            <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {PORTAL_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-[#22D3EE]">
                  {l.short}
                </Link>
              ))}
            </nav>
            <div className="md:hidden" />
            <Link href="/" className="flex items-center justify-center gap-2.5">
              <AlumConnectLogo className="h-6 w-6" />
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
            </Link>
            <div className="flex items-center justify-end gap-2.5">
              <Link
                href="/login"
                className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE]"
              >
                Sign In
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 9,
      name: 'Status-Driven Telemetry Bar',
      vibe: 'Live network pulse + portal pills + quick login',
      render: () => (
        <header className="border-b border-zinc-200 dark:border-white/15 bg-white dark:bg-[#0A0D14]">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlumConnectLogo className="h-6 w-6" />
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
              <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-[10px] font-mono text-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                3 Portals Online
              </span>
            </div>
            <div className="flex items-center gap-2">
              {PORTAL_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="hidden sm:inline-flex rounded-lg px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/[0.06]"
                >
                  {l.short}
                </Link>
              ))}
              <Link
                href="/login"
                className="rounded-lg bg-[#2563EB] text-white px-3.5 py-1.5 text-xs font-semibold"
              >
                Access
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 10,
      name: 'Dual-Row Micro Ribbon + Nav',
      vibe: 'Thin announcement ribbon above a crisp 1-line navbar',
      render: () => (
        <div>
          <div className="bg-gradient-to-r from-[#0891B2] via-[#2563EB] to-emerald-500 text-white text-[11px] font-medium py-1 px-4 text-center">
            Proof-of-Work Network • Ship builds, get 5-min alumni roasts &amp; unlock fast-track interviews
          </div>
          <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0B0D12]">
            <div className="max-w-[1440px] mx-auto px-6 h-13 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <AlumConnectLogo className="h-6 w-6" />
                <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
                {PORTAL_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className="hover:text-[#22D3EE]">
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-xs font-semibold px-3 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700">
                  Sign In
                </Link>
                <ThemeToggle compact />
              </div>
            </div>
          </header>
        </div>
      ),
    },
    {
      id: 11,
      name: 'Swiss Grid Editorial Bar',
      vibe: 'Sharp borders, uppercase monospace links, surgical blue button',
      render: () => (
        <header className="border-b-2 border-zinc-900 dark:border-zinc-700 bg-white dark:bg-[#09090B]">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <AlumConnectLogo className="h-6 w-6" />
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 font-mono text-[11px] uppercase tracking-wider">
              {PORTAL_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-[#2563EB] dark:hover:text-[#22D3EE]">
                  {l.short}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="bg-[#2563EB] text-white px-4 py-1.5 text-xs font-mono uppercase tracking-wider"
              >
                Login
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 12,
      name: 'Liquid Chrome Segmented Dock',
      vibe: 'Icon + label segmented tabs inside a frosted chrome container',
      render: () => (
        <header className="border-b border-white/15 bg-white/70 dark:bg-[#0C0E12]/80 backdrop-blur-xl">
          <div className="max-w-[1440px] mx-auto px-6 h-15 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center">
                <AlumConnectLogo className="h-5 w-5" />
              </div>
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
            </Link>
            <div className="hidden md:flex items-center gap-1 rounded-2xl border border-zinc-200 dark:border-white/15 bg-zinc-100/70 dark:bg-white/[0.04] p-1">
              {PORTAL_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  <l.icon className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
                  {l.short}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 dark:border-white/15 px-3.5 py-1.5 text-xs font-semibold hover:border-[#22D3EE]"
              >
                <Lock className="w-3.5 h-3.5" /> Sign In
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 13,
      name: 'Action-First Builder Bar',
      vibe: 'Highlights "Publish Build" & "Hire Talent" right in the header',
      render: () => (
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0D1017]">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <AlumConnectLogo className="h-6 w-6" />
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/share-project"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 px-3.5 py-1.5 text-xs font-semibold hover:border-cyan-400"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Ship Project
              </Link>
              <Link
                href="/alumni"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-700 px-3.5 py-1.5 text-xs font-semibold hover:border-indigo-400"
              >
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Hire Talent
              </Link>
              <Link
                href="/login"
                className="rounded-full bg-[#0F172A] dark:bg-white text-white dark:text-zinc-950 px-4 py-1.5 text-xs font-semibold"
              >
                Sign In
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 14,
      name: 'Transparent Floating Overlay',
      vibe: 'Borderless top bar that blends directly into the hero canvas',
      render: () => (
        <header className="bg-transparent">
          <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <AlumConnectLogo className="h-7 w-7" />
              <span className="font-luma-title text-xl leading-none">AlmaConnect</span>
            </Link>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {PORTAL_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className="hover:text-[#22D3EE]">
                    {l.short}
                  </Link>
                ))}
                <Link href="/login" className="hover:text-[#22D3EE]">
                  Login
                </Link>
              </nav>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 15,
      name: 'Role Badge Switcher Bar',
      vibe: 'Color-coded role pills (Blue Student, Indigo Alum, Emerald Dean)',
      render: () => (
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0B0D12]">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <AlumConnectLogo className="h-6 w-6" />
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <Link href="/student" className="rounded-full bg-blue-500/15 text-blue-500 border border-blue-500/30 px-3 py-1 text-xs font-semibold">
                ● Students
              </Link>
              <Link href="/alumni" className="rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 px-3 py-1 text-xs font-semibold">
                ● Alumni
              </Link>
              <Link href="/dean" className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 text-xs font-semibold">
                ● Dean T&amp;P
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/login" className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 px-3.5 py-1.5 text-xs font-semibold">
                Sign In
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 16,
      name: 'Compact Split Capsule',
      vibe: 'Two balanced floating glass capsules (Brand left, Nav+Theme right)',
      render: () => (
        <div className="px-6 py-3">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-full border border-zinc-200 dark:border-white/15 bg-white/85 dark:bg-[#11141B]/85 backdrop-blur-md px-4 py-2 shadow-xs"
            >
              <AlumConnectLogo className="h-5 w-5" />
              <span className="font-luma-title text-base leading-none">AlmaConnect</span>
            </Link>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-white/15 bg-white/85 dark:bg-[#11141B]/85 backdrop-blur-md px-3 py-1.5 shadow-xs">
              {PORTAL_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="hidden sm:inline-flex rounded-full px-3 py-1 text-xs font-medium hover:bg-zinc-100 dark:hover:bg-white/10"
                >
                  {l.short}
                </Link>
              ))}
              <Link
                href="/login"
                className="rounded-full bg-[#0891B2] dark:bg-[#22D3EE] text-white dark:text-[#041E24] px-3.5 py-1 text-xs font-semibold"
              >
                Login
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 17,
      name: 'Sparkle Vision Header',
      vibe: 'Subtle tagline pill beside AlmaConnect + clean right-aligned links',
      render: () => (
        <header className="border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-[#0A0C10]">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlumConnectLogo className="h-6 w-6" />
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
              <span className="hidden lg:inline-flex items-center gap-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 text-[10px] font-medium text-[#0891B2] dark:text-[#22D3EE]">
                <Sparkles className="w-3 h-3" /> Proof-of-Work Network
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              {PORTAL_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hidden md:inline hover:text-[#22D3EE]">
                  {l.short}
                </Link>
              ))}
              <Link
                href="/login"
                className="rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 px-3.5 py-1.5 font-semibold"
              >
                Get Started
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 18,
      name: 'Underline Tab Strip',
      vibe: 'Clean active-style underline navigation for portals',
      render: () => (
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090B]">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <AlumConnectLogo className="h-6 w-6" />
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
            </Link>
            <nav className="hidden md:flex items-center h-full gap-6 text-xs font-semibold">
              <Link href="/" className="h-full inline-flex items-center border-b-2 border-[#22D3EE] text-zinc-950 dark:text-white">
                Overview
              </Link>
              {PORTAL_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="h-full inline-flex items-center border-b-2 border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  {l.short}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-2.5">
              <Link href="/login" className="text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE]">
                Sign In →
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
    {
      id: 19,
      name: 'Glow Frame Pill Bar',
      vibe: 'Subtle gradient border framing the entire top navigation',
      render: () => (
        <div className="px-4 sm:px-8 py-2.5">
          <div className="max-w-[1440px] mx-auto rounded-2xl p-[1px] bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-emerald-500/40">
            <header className="rounded-2xl bg-white dark:bg-[#0C0F16] px-5 h-13 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2.5">
                <AlumConnectLogo className="h-6 w-6" />
                <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
              </Link>
              <div className="hidden md:flex items-center gap-5 text-xs font-medium text-zinc-600 dark:text-zinc-300">
                {PORTAL_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className="hover:text-[#22D3EE]">
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  className="rounded-xl bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-3.5 py-1.5 text-xs font-bold"
                >
                  Open App
                </Link>
                <ThemeToggle compact />
              </div>
            </header>
          </div>
        </div>
      ),
    },
    {
      id: 20,
      name: 'Architectural Minimal Bar',
      vibe: 'Ultra-refined brand + subtle dot-separated links + compact toggle',
      render: () => (
        <header className="border-b border-zinc-200/80 dark:border-white/10 bg-white/90 dark:bg-[#09090B]/90 backdrop-blur-md">
          <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg border border-zinc-200 dark:border-white/15 flex items-center justify-center">
                <AlumConnectLogo className="h-5 w-5" />
              </div>
              <span className="font-luma-title text-lg leading-none">AlmaConnect</span>
            </Link>
            <div className="flex items-center gap-3">
              <nav className="hidden md:flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                <Link href="/student" className="hover:text-white">Students</Link>
                <span>·</span>
                <Link href="/alumni" className="hover:text-white">Alumni</Link>
                <span>·</span>
                <Link href="/dean" className="hover:text-white">Dean</Link>
                <span>·</span>
                <Link href="/login" className="text-[#0891B2] dark:text-[#22D3EE] font-semibold">Login</Link>
              </nav>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      ),
    },
  ];

  const visible = onlyStarred
    ? options.filter((o) => starred.includes(o.id))
    : options;

  return (
    <div className="min-h-screen bg-[#F4F6FA] dark:bg-[#050608] text-zinc-900 dark:text-zinc-100 transition-colors pb-16">
      <div className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0B0D12]/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-cyan-500"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Gateway
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
                <h1 className="text-sm font-bold">
                  Gateway Navbar Lab — 20 Creative Options
                </h1>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Compare all 20 full-width navbars and tell me which number to apply
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyStarred((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${
                onlyStarred
                  ? 'border-amber-400 bg-amber-500/15 text-amber-500'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-500'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              Shortlist ({starred.length})
            </button>
            <ThemeToggle compact />
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {visible.map((opt) => {
          const isStarred = starred.includes(opt.id);
          return (
            <section
              key={opt.id}
              className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-[#0D1016] overflow-hidden shadow-xs"
            >
              <div className="px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 bg-white dark:bg-[#12151E]">
                <div className="flex items-center gap-2.5">
                  <span className="rounded-md bg-[#0891B2] dark:bg-[#22D3EE] text-white dark:text-[#041E24] px-2 py-0.5 text-xs font-mono font-bold">
                    #{String(opt.id).padStart(2, '0')}
                  </span>
                  <h2 className="text-xs sm:text-sm font-bold">{opt.name}</h2>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                    — {opt.vibe}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStar(opt.id)}
                  className={`inline-flex items-center gap-1 text-xs font-medium ${
                    isStarred ? 'text-amber-400' : 'text-zinc-400 hover:text-amber-400'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  {isStarred ? 'Shortlisted' : 'Shortlist'}
                </button>
              </div>
              <div className="py-2">{opt.render()}</div>
            </section>
          );
        })}
      </main>
    </div>
  );
}
