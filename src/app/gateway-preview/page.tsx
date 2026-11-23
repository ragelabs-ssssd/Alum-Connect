'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Compass,
  Flame,
  GitBranch,
  GraduationCap,
  Grid3X3,
  Layers,
  Maximize2,
  Rocket,
  Search,
  Sparkles,
  Star,
  Terminal,
  Zap,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { HIRING_COMPANIES } from '../../data/hiringCompanies';
import {
  ALUMNI_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
} from '../../data/alumConnectData';
import {
  GATEWAY_OPTIONS,
  GatewayOption,
  OPTION_CATEGORIES,
  OptionCategory,
} from './gatewayOptions';

const ACCENT_MAP: Record<
  string,
  { pill: string; text: string; button: string; border: string; glow: string }
> = {
  blue: {
    pill: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    text: 'text-[#2563EB] dark:text-blue-400',
    button: 'bg-[#2563EB] hover:bg-blue-600 text-white',
    border: 'border-blue-500/40',
    glow: 'from-blue-600/20 via-indigo-500/10 to-transparent',
  },
  cyan: {
    pill: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    text: 'text-[#0891B2] dark:text-[#22D3EE]',
    button:
      'bg-[#0891B2] hover:bg-[#0E7490] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24]',
    border: 'border-cyan-500/40',
    glow: 'from-cyan-500/20 via-sky-500/10 to-transparent',
  },
  emerald: {
    pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    text: 'text-emerald-600 dark:text-emerald-400',
    button: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    border: 'border-emerald-500/40',
    glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
  },
  indigo: {
    pill: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    text: 'text-indigo-600 dark:text-indigo-400',
    button: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    border: 'border-indigo-500/40',
    glow: 'from-indigo-500/20 via-violet-500/10 to-transparent',
  },
  amber: {
    pill: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    text: 'text-amber-600 dark:text-amber-400',
    button: 'bg-amber-500 hover:bg-amber-400 text-zinc-950',
    border: 'border-amber-500/40',
    glow: 'from-amber-500/20 via-orange-500/10 to-transparent',
  },
};

function PortalDoorsRow({ compact = false }: { compact?: boolean }) {
  const portals = [
    {
      href: '/student',
      title: 'Student Network',
      desc: 'Publish GitHub repository showcases, track sprint tasks, and ship with campus squads.',
      cta: 'Open Student Feed',
      icon: <Code2 className="w-4 h-4" />,
      badge: 'For Builders',
      bar: 'bg-[#2563EB]',
      accent: 'text-[#2563EB] dark:text-sky-400',
    },
    {
      href: '/alumni',
      title: 'Alumni & Hiring',
      desc: 'Inspect live student codebases, leave 5-min roasts, issue Vouch Cards & hire fast.',
      cta: 'Open Alumni Marketplace',
      icon: <Briefcase className="w-4 h-4" />,
      badge: 'For Recruiters',
      bar: 'bg-indigo-600',
      accent: 'text-indigo-600 dark:text-indigo-400',
    },
    {
      href: '/dean',
      title: 'Dean & T&P Cell',
      desc: 'Monitor verified campus placement outcomes, sprint velocity & institutional audit trails.',
      cta: 'Open Placement Telemetry',
      icon: <GraduationCap className="w-4 h-4" />,
      badge: 'For Leadership',
      bar: 'bg-emerald-600',
      accent: 'text-emerald-600 dark:text-emerald-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {portals.map((p) => (
        <Link
          key={p.href}
          href={p.href}
          className={`group relative overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111318] hover:border-blue-500/50 dark:hover:border-cyan-400/50 ${
            compact ? 'p-4' : 'p-5'
          } transition-all shadow-xs hover:shadow-md flex flex-col justify-between`}
        >
          <div className={`absolute top-0 left-0 right-0 h-1 ${p.bar}`} />
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-white">
                {p.icon}
              </span>
              <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                {p.badge}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-base text-zinc-900 dark:text-white">
                {p.title}
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                {p.desc}
              </p>
            </div>
          </div>
          <div
            className={`pt-3 mt-3 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold ${p.accent}`}
          >
            <span>{p.cta}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      ))}
    </div>
  );
}

function GatewayOptionStage({
  option,
  projectCount,
  dealCount,
}: {
  option: GatewayOption;
  projectCount: number;
  dealCount: number;
}) {
  const accent = ACCENT_MAP[option.accentColor] || ACCENT_MAP.blue;
  const featuredProject = PROJECTS_DATA[0];
  const featuredAlum = ALUMNI_DATA[0];

  const surfaceClass = option.darkSurface
    ? 'bg-[#09090B] text-white border-zinc-800'
    : 'bg-white dark:bg-[#0E1015] text-zinc-900 dark:text-white border-zinc-200 dark:border-zinc-800';

  const mutedText = option.darkSurface
    ? 'text-zinc-400'
    : 'text-zinc-600 dark:text-zinc-400';

  return (
    <div className="space-y-4">
      {/* Main Hero Canvas */}
      <section
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-10 transition-all ${surfaceClass}`}
      >
        <div
          className={`pointer-events-none absolute -top-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br ${accent.glow} blur-3xl`}
        />

        {/* Archetype 1: Story Hero (Inspired by uploaded Razorpay card) */}
        {option.archetype === 'story_hero' && (
          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-700/50 bg-zinc-800/60 px-3.5 py-1 text-xs font-medium text-cyan-300">
              <Award className="w-3.5 h-3.5" />
              <span>{option.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.12]">
              {option.headline}{' '}
              <span className={accent.text}>{option.highlight}</span>
            </h1>

            <p className={`text-base sm:text-lg max-w-2xl leading-relaxed ${mutedText}`}>
              {option.subheadline}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href={option.primaryHref}
                className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all shadow-sm ${accent.button}`}
              >
                {option.primaryCta}
              </Link>
              <Link
                href={option.secondaryHref}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700/60 bg-zinc-900/60 hover:bg-zinc-800 text-white px-6 py-3 text-sm font-semibold transition-colors"
              >
                {option.secondaryCta} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <div className={`font-mono uppercase ${mutedText}`}>Verified Builds</div>
                <div className="text-lg font-bold mt-0.5">{projectCount} Live</div>
              </div>
              <div>
                <div className={`font-mono uppercase ${mutedText}`}>Hiring Deals</div>
                <div className="text-lg font-bold mt-0.5">{dealCount} Open</div>
              </div>
              <div>
                <div className={`font-mono uppercase ${mutedText}`}>
                  {option.growthMetricLabel}
                </div>
                <div className={`text-lg font-bold mt-0.5 ${accent.text}`}>
                  {option.growthMetricValue}
                </div>
              </div>
              <div>
                <div className={`font-mono uppercase ${mutedText}`}>Top Reviewer</div>
                <div className="text-lg font-bold mt-0.5 truncate">
                  {featuredAlum?.company || 'Microsoft'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Archetype 2: Manifesto + Hiring Marquee */}
        {option.archetype === 'manifesto_ticker' && (
          <div className="relative z-10 space-y-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${accent.pill}`}
              >
                <Sparkles className="w-3.5 h-3.5" /> {option.badge}
              </span>
              <span className="text-xs font-mono text-zinc-500">
                {projectCount} Repos • {dealCount} Active Deals
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08]">
                  {option.headline}{' '}
                  <span className={accent.text}>{option.highlight}</span>
                </h1>
                <p className={`text-sm sm:text-base max-w-2xl leading-relaxed ${mutedText}`}>
                  {option.subheadline}
                </p>
              </div>
              <div className="lg:col-span-4 flex flex-col gap-3">
                <Link
                  href={option.primaryHref}
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all ${accent.button}`}
                >
                  {option.primaryCta} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={option.secondaryHref}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-300 dark:border-zinc-700 px-5 py-3.5 text-sm font-semibold hover:border-blue-500 transition-colors"
                >
                  {option.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-3 text-xs">
              <span className={`font-semibold ${mutedText}`}>Hiring Partners:</span>
              {HIRING_COMPANIES.slice(0, 7).map((c) => (
                <span
                  key={c.name}
                  className="rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1 font-medium"
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Archetype 3: Timeline Sprint */}
        {option.archetype === 'timeline_sprint' && (
          <div className="relative z-10 space-y-6">
            <div className="max-w-3xl space-y-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${accent.pill}`}
              >
                <Zap className="w-3.5 h-3.5" /> {option.badge}
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                {option.headline}{' '}
                <span className={accent.text}>{option.highlight}</span>
              </h1>
              <p className={`text-sm sm:text-base leading-relaxed ${mutedText}`}>
                {option.subheadline}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: 'Day 01–04',
                  title: 'Ship Working Prototype',
                  detail: 'Push GitHub repo + live URL to ITER Student Studio.',
                },
                {
                  step: 'Day 05–07',
                  title: '5-Min Alumni Roast',
                  detail: 'Seniors at Razorpay & Microsoft review architecture.',
                },
                {
                  step: 'Day 08–10',
                  title: 'Vouch Card & Interview',
                  detail: 'Earn verified skill endorsement & fast-track invite.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 space-y-1.5"
                >
                  <div className={`text-xs font-mono font-semibold ${accent.text}`}>
                    {item.step}
                  </div>
                  <div className="font-semibold text-sm text-white">{item.title}</div>
                  <p className="text-xs text-zinc-400">{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={option.primaryHref}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${accent.button}`}
              >
                {option.primaryCta} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={option.secondaryHref}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800"
              >
                {option.secondaryCta}
              </Link>
            </div>
          </div>
        )}

        {/* Archetype 4: Bento Grid */}
        {option.archetype === 'bento_grid' && (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 rounded-2xl border border-zinc-200/20 bg-zinc-900/5 dark:bg-white/[0.04] p-6 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${accent.pill}`}
                >
                  <Layers className="w-3.5 h-3.5" /> {option.badge}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                  {option.headline}{' '}
                  <span className={accent.text}>{option.highlight}</span>
                </h1>
                <p className={`text-sm leading-relaxed ${mutedText}`}>
                  {option.subheadline}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={option.primaryHref}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold ${accent.button}`}
                >
                  {option.primaryCta} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={option.secondaryHref}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 px-5 py-2.5 text-xs sm:text-sm font-semibold"
                >
                  {option.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-zinc-200/20 bg-zinc-900/5 dark:bg-white/[0.04] p-4 flex flex-col justify-between">
                <span className={`text-[11px] font-mono uppercase ${mutedText}`}>
                  Campus Repos
                </span>
                <div className="text-3xl font-bold mt-2">{projectCount}</div>
              </div>
              <div className="rounded-2xl border border-zinc-200/20 bg-zinc-900/5 dark:bg-white/[0.04] p-4 flex flex-col justify-between">
                <span className={`text-[11px] font-mono uppercase ${mutedText}`}>
                  Active Deals
                </span>
                <div className={`text-3xl font-bold mt-2 ${accent.text}`}>
                  {dealCount}
                </div>
              </div>
              <div className="col-span-2 rounded-2xl border border-zinc-200/20 bg-zinc-900/5 dark:bg-white/[0.04] p-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">Featured Build</span>
                  <span className={`font-mono ${accent.text}`}>
                    {option.growthMetricValue}
                  </span>
                </div>
                <div className="text-sm font-bold">
                  {featuredProject?.name || 'CampusCart v2.0'}
                </div>
                <p className={`text-xs line-clamp-2 ${mutedText}`}>
                  {featuredProject?.pitch || 'Live campus engineering showcase.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Archetype 5: Split Dual Persona */}
        {option.archetype === 'split_dual' && (
          <div className="relative z-10 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${accent.pill}`}
              >
                {option.badge}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {option.headline}{' '}
                <span className={accent.text}>{option.highlight}</span>
              </h1>
              <p className={`text-sm ${mutedText}`}>{option.subheadline}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-blue-500/30 bg-blue-50/60 dark:bg-blue-950/25 p-6 space-y-4">
                <div className="text-xs font-mono uppercase text-blue-600 dark:text-blue-400">
                  Track 01 • Student Builders
                </div>
                <h2 className="text-xl font-bold">Ship Proof. Earn Vouches.</h2>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Publish live GitHub demos, get 5-minute architecture roasts, and apply to paid alumni bounties.
                </p>
                <Link
                  href={option.primaryHref}
                  className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] text-white px-5 py-2.5 text-xs font-semibold"
                >
                  {option.primaryCta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900 text-white p-6 space-y-4">
                <div className="text-xs font-mono uppercase text-cyan-400">
                  Track 02 • ITER Alumni
                </div>
                <h2 className="text-xl font-bold">Roast Code. Fast-Track Hire.</h2>
                <p className="text-xs text-zinc-400">
                  Set your Bandwidth Shield, inspect vetted student repos, and open direct Deal Rooms.
                </p>
                <Link
                  href={option.secondaryHref}
                  className="inline-flex items-center gap-2 rounded-full bg-white text-zinc-950 px-5 py-2.5 text-xs font-semibold"
                >
                  {option.secondaryCta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Archetype 6: Terminal / CLI */}
        {option.archetype === 'terminal_cli' && (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono ${accent.pill}`}
              >
                <Terminal className="w-3.5 h-3.5" /> {option.badge}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {option.headline}{' '}
                <span className={accent.text}>{option.highlight}</span>
              </h1>
              <p className={`text-sm leading-relaxed ${mutedText}`}>
                {option.subheadline}
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Link
                  href={option.primaryHref}
                  className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs sm:text-sm font-semibold ${accent.button}`}
                >
                  {option.primaryCta} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={option.secondaryHref}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white"
                >
                  {option.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 rounded-2xl border border-zinc-800 bg-black/90 p-5 font-mono text-xs text-zinc-300 space-y-2 shadow-inner">
              <div className="flex items-center gap-1.5 pb-2 border-b border-zinc-800">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-zinc-500">alma-connect-gateway</span>
              </div>
              <div>
                <span className="text-emerald-400">$</span> alma status --campus=ITER
              </div>
              <div className="text-zinc-400">
                → DB1_STUDENTS: {projectCount} verified builds &amp; papers
              </div>
              <div className="text-zinc-400">
                → DB2_ALUMNI: {dealCount} active hiring deals &amp; bounties
              </div>
              <div className="text-zinc-400">
                → DB3_DEAN: institutional T&amp;P audit stream online
              </div>
              <div className="pt-1 text-cyan-400">
                ✓ Ready: choose a portal below to launch session_
              </div>
            </div>
          </div>
        )}

        {/* Archetype 7: Flywheel Loop */}
        {option.archetype === 'flywheel_loop' && (
          <div className="relative z-10 space-y-6">
            <div className="max-w-3xl space-y-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${accent.pill}`}
              >
                <Rocket className="w-3.5 h-3.5" /> {option.badge}
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
                {option.headline}{' '}
                <span className={accent.text}>{option.highlight}</span>
              </h1>
              <p className={`text-sm sm:text-base ${mutedText}`}>{option.subheadline}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { n: '01', label: 'Build', desc: 'Students ship live repos' },
                { n: '02', label: 'Roast', desc: '5-min alumni feedback' },
                { n: '03', label: 'Vouch', desc: 'Verified skill cards' },
                { n: '04', label: 'Hire & Return', desc: 'Offers → future mentors' },
              ].map((step) => (
                <div
                  key={step.n}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4"
                >
                  <div className={`text-xs font-mono ${accent.text}`}>{step.n}</div>
                  <div className="font-bold text-base mt-1 text-white">{step.label}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{step.desc}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href={option.primaryHref}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${accent.button}`}
              >
                {option.primaryCta} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={option.secondaryHref}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-white"
              >
                {option.secondaryCta}
              </Link>
            </div>
          </div>
        )}

        {/* Archetype 8: Command Center */}
        {option.archetype === 'command_center' && (
          <div className="relative z-10 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${accent.pill}`}
                >
                  <Compass className="w-3.5 h-3.5" /> {option.badge}
                </span>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {option.headline}{' '}
                  <span className={accent.text}>{option.highlight}</span>
                </h1>
                <p className={`text-sm ${mutedText}`}>{option.subheadline}</p>
              </div>
              <div className="flex gap-2.5">
                <Link
                  href={option.primaryHref}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold ${accent.button}`}
                >
                  {option.primaryCta}
                </Link>
                <Link
                  href={option.secondaryHref}
                  className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white"
                >
                  {option.secondaryCta}
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-zinc-400 px-2">
                <Search className="w-4 h-4 text-zinc-500" />
                <span>Quick Jump: Next.js • FastAPI • Razorpay Alumni • Bounties</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono">
                <span className="rounded-lg bg-zinc-800 px-2 py-1 text-zinc-300">
                  {projectCount} Builds
                </span>
                <span className="rounded-lg bg-zinc-800 px-2 py-1 text-cyan-400">
                  {dealCount} Deals
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Archetype 9: Swiss Minimal */}
        {option.archetype === 'swiss_minimal' && (
          <div className="relative z-10 space-y-6">
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4 flex items-center justify-between text-xs font-mono uppercase tracking-wider">
              <span>{option.badge}</span>
              <span>SOA • ITER</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter leading-none">
              {option.headline}{' '}
              <span className={accent.text}>{option.highlight}</span>
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end pt-2">
              <p className={`md:col-span-7 text-sm sm:text-base ${mutedText}`}>
                {option.subheadline}
              </p>
              <div className="md:col-span-5 flex flex-wrap md:justify-end gap-3">
                <Link
                  href={option.primaryHref}
                  className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold ${accent.button}`}
                >
                  {option.primaryCta} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={option.secondaryHref}
                  className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 dark:border-zinc-700 px-5 py-2.5 text-sm font-semibold"
                >
                  {option.secondaryCta}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Archetype 10: Graph Nodes */}
        {option.archetype === 'graph_nodes' && (
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono ${accent.pill}`}
              >
                <GitBranch className="w-3.5 h-3.5" /> {option.badge}
              </span>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
                {option.headline}{' '}
                <span className={accent.text}>{option.highlight}</span>
              </h1>
              <p className={`text-sm sm:text-base ${mutedText}`}>{option.subheadline}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={option.primaryHref}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${accent.button}`}
                >
                  {option.primaryCta} <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={option.secondaryHref}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  {option.secondaryCta}
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              {[
                { node: 'Student Squad', stat: `${projectCount} Repos` },
                { node: 'Alum Reviewer', stat: '5-Min Roast' },
                { node: 'Vouch Card', stat: 'Verified Skill' },
                { node: 'Deal Room', stat: `${dealCount} Open` },
              ].map((n) => (
                <div
                  key={n.node}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 flex flex-col justify-between"
                >
                  <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>NODE</span>
                  </div>
                  <div className="mt-2">
                    <div className="font-semibold text-sm text-white">{n.node}</div>
                    <div className="text-xs text-zinc-400">{n.stat}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Portal Cards Row */}
      <PortalDoorsRow compact />
    </div>
  );
}

export default function GatewayPreviewPage() {
  const projectCount = PROJECTS_DATA.length + RESEARCH_PAPERS_DATA.length;
  const dealCount = ALUMNI_DATA.reduce(
    (sum, a) => sum + a.activeJobOpeningsCount,
    0
  );

  const [viewMode, setViewMode] = useState<'preview' | 'gallery'>('preview');
  const [selectedId, setSelectedId] = useState<number>(1);
  const [category, setCategory] = useState<OptionCategory>('All');
  const [search, setSearch] = useState('');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [starredIds, setStarredIds] = useState<number[]>([1, 6, 11]);

  const toggleStar = (id: number) => {
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredOptions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return GATEWAY_OPTIONS.filter((opt) => {
      if (category !== 'All' && opt.category !== category) return false;
      if (onlyStarred && !starredIds.includes(opt.id)) return false;
      if (!q) return true;
      return (
        opt.title.toLowerCase().includes(q) ||
        opt.headline.toLowerCase().includes(q) ||
        opt.highlight.toLowerCase().includes(q) ||
        opt.visionNote.toLowerCase().includes(q) ||
        String(opt.id) === q
      );
    });
  }, [category, onlyStarred, search, starredIds]);

  const activeOption =
    GATEWAY_OPTIONS.find((o) => o.id === selectedId) || GATEWAY_OPTIONS[0];

  const handleStep = (dir: -1 | 1) => {
    const list = filteredOptions.length > 0 ? filteredOptions : GATEWAY_OPTIONS;
    const idx = list.findIndex((o) => o.id === activeOption.id);
    const nextIdx =
      idx === -1 ? 0 : (idx + dir + list.length) % list.length;
    setSelectedId(list[nextIdx].id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050608] text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Top Studio Control Bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#0B0D12]/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-blue-500 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Current Gateway
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#2563EB] dark:text-cyan-400" />
                <h1 className="text-sm font-bold tracking-tight">
                  Gateway Creative Lab — 30 Vision &amp; Growth Options
                </h1>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Compare 30 concepts tailored to AlmaConnect&apos;s Proof-of-Work &amp; Campus Growth
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 30 options..."
                className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500 w-44 sm:w-56"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyStarred((v) => !v)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                onlyStarred
                  ? 'border-amber-400 bg-amber-500/15 text-amber-500'
                  : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Shortlist ({starredIds.length})</span>
            </button>

            <div className="inline-flex rounded-full border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'preview'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                    : 'text-zinc-500'
                }`}
              >
                <Maximize2 className="w-3 h-3" /> Live Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode('gallery')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'gallery'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                    : 'text-zinc-500'
                }`}
              >
                <Grid3X3 className="w-3 h-3" /> All 30 Grid
              </button>
            </div>

            <ThemeToggle compact />
          </div>
        </div>

        {/* Category Filter Strip */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-2.5 flex items-center gap-2 overflow-x-auto">
          {OPTION_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                category === cat
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 space-y-6">
        {viewMode === 'preview' ? (
          <>
            {/* Selected Option Meta Bar */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0E1015] p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md bg-blue-600 text-white px-2 py-0.5 text-xs font-mono font-bold">
                    OPTION #{String(activeOption.id).padStart(2, '0')}
                  </span>
                  <h2 className="font-bold text-base">{activeOption.title}</h2>
                  <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    {activeOption.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  <strong className="text-zinc-800 dark:text-zinc-200">Vision &amp; Growth Fit:</strong>{' '}
                  {activeOption.visionNote}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleStar(activeOption.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    starredIds.includes(activeOption.id)
                      ? 'border-amber-400 bg-amber-500/15 text-amber-500'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-amber-400'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  {starredIds.includes(activeOption.id) ? 'Shortlisted' : 'Shortlist'}
                </button>
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-blue-500"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-blue-500"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Full-Width Preview */}
            <GatewayOptionStage
              option={activeOption}
              projectCount={projectCount}
              dealCount={dealCount}
            />

            {/* Quick 1..30 Number Strip */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0E1015] p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-semibold">
                  Jump to any of the {filteredOptions.length} matching options:
                </span>
                <span>Click a number to preview live</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filteredOptions.map((opt) => {
                  const isActive = opt.id === activeOption.id;
                  const isStarred = starredIds.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedId(opt.id)}
                      title={`${opt.id}. ${opt.title}`}
                      className={`relative h-8 min-w-[2.25rem] px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                        isActive
                          ? 'bg-[#2563EB] text-white shadow-xs'
                          : 'border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-blue-500'
                      }`}
                    >
                      {String(opt.id).padStart(2, '0')}
                      {isStarred && (
                        <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          /* All 30 Gallery Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredOptions.map((opt) => {
              const accent = ACCENT_MAP[opt.accentColor] || ACCENT_MAP.blue;
              const isStarred = starredIds.includes(opt.id);
              return (
                <div
                  key={opt.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0E1015] p-5 flex flex-col justify-between gap-4 hover:border-blue-500/60 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-zinc-900 dark:bg-zinc-800 text-white px-2 py-0.5 text-[11px] font-mono font-bold">
                        #{String(opt.id).padStart(2, '0')}
                      </span>
                      <span className="text-[11px] font-medium text-zinc-500">
                        {opt.category}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleStar(opt.id)}
                        className={`p-1 rounded-full ${
                          isStarred ? 'text-amber-400' : 'text-zinc-400 hover:text-amber-400'
                        }`}
                        aria-label={`Shortlist option ${opt.id}`}
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    </div>

                    <div
                      className={`rounded-xl border p-3.5 space-y-1.5 ${
                        opt.darkSurface
                          ? 'bg-[#09090B] text-white border-zinc-800'
                          : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      <div className="text-[10px] font-mono uppercase opacity-75">
                        {opt.badge}
                      </div>
                      <div className="text-sm font-bold leading-snug">
                        {opt.headline}{' '}
                        <span className={accent.text}>{opt.highlight}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm">{opt.title}</h3>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                        {opt.visionNote}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500">
                      {opt.growthMetricLabel}: {opt.growthMetricValue}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(opt.id);
                        setViewMode('preview');
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] dark:text-cyan-400 hover:underline"
                    >
                      Preview Live <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
