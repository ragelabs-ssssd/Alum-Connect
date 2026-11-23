'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Compass,
  Flame,
  Grid3X3,
  Maximize2,
  Star,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { HIRING_COMPANIES } from '../../data/hiringCompanies';
import {
  EXPLORE_OPTIONS,
  JOBS_OPTIONS,
  NOTIFICATIONS_OPTIONS,
  SectionHeroOption,
  SectionTab,
} from './sectionOptions';

const ACCENTS: Record<
  SectionHeroOption['accent'],
  { text: string; pill: string; topBar: string; glow: string; btn: string }
> = {
  cyan: {
    text: 'text-[#22D3EE]',
    pill: 'bg-cyan-500/15 text-[#22D3EE] border-cyan-500/30',
    topBar: 'bg-gradient-to-r from-[#22D3EE] to-[#34D399]',
    glow: 'from-cyan-500/20 via-emerald-500/10 to-transparent',
    btn: 'bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24]',
  },
  blue: {
    text: 'text-sky-400',
    pill: 'bg-blue-500/15 text-sky-300 border-blue-500/30',
    topBar: 'bg-gradient-to-r from-[#2563EB] to-sky-400',
    glow: 'from-blue-600/25 via-sky-500/10 to-transparent',
    btn: 'bg-[#2563EB] text-white',
  },
  emerald: {
    text: 'text-emerald-400',
    pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    topBar: 'bg-gradient-to-r from-emerald-400 to-teal-400',
    glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    btn: 'bg-emerald-500 text-zinc-950',
  },
  indigo: {
    text: 'text-indigo-400',
    pill: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    topBar: 'bg-gradient-to-r from-indigo-500 to-violet-400',
    glow: 'from-indigo-500/25 via-violet-500/10 to-transparent',
    btn: 'bg-indigo-600 text-white',
  },
  amber: {
    text: 'text-amber-400',
    pill: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    topBar: 'bg-gradient-to-r from-amber-400 to-orange-400',
    glow: 'from-amber-500/20 via-orange-500/10 to-transparent',
    btn: 'bg-amber-400 text-zinc-950',
  },
};

function SectionIcon({ section }: { section: SectionTab }) {
  if (section === 'explore') return <Compass className="w-3.5 h-3.5" />;
  if (section === 'jobs') return <Briefcase className="w-3.5 h-3.5" />;
  return <Bell className="w-3.5 h-3.5" />;
}

function SectionCardRenderer({
  option,
  compact = false,
}: {
  option: SectionHeroOption;
  compact?: boolean;
}) {
  const a = ACCENTS[option.accent];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[rgba(226,232,240,0.18)] bg-[#14171E]/95 text-white shadow-sm backdrop-blur-xl ${
        compact ? 'p-5 space-y-3' : 'p-6 sm:p-7 space-y-4'
      }`}
    >
      {option.style === 'editorial_stripe' && (
        <div className={`absolute top-0 left-0 right-0 h-1 ${a.topBar}`} />
      )}

      <div
        className={`pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br ${a.glow} blur-3xl`}
      />

      <div className="relative z-10 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${a.pill}`}
          >
            <SectionIcon section={option.section} />
            <span>{option.badge}</span>
          </div>
          <span className="font-mono text-[11px] text-zinc-400">
            {option.metaLabel}: <strong className="text-white">{option.metaValue}</strong>
          </span>
        </div>

        {option.style === 'telemetry_split' ? (
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-8 space-y-2">
              <h2 className="font-luma-title text-xl sm:text-2xl leading-snug tracking-tight">
                {option.headline} <span className={a.text}>{option.highlight}</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {option.subtext}
              </p>
            </div>
            <div className="sm:col-span-4 grid grid-cols-2 sm:grid-cols-1 gap-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                <div className="text-[10px] font-mono uppercase text-zinc-400">
                  {option.metaLabel}
                </div>
                <div className="font-luma-title text-base text-white mt-0.5">
                  {option.metaValue}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                <div className="text-[10px] font-mono uppercase text-zinc-400">
                  {option.stat2Label || 'Status'}
                </div>
                <div className={`font-luma-title text-base mt-0.5 ${a.text}`}>
                  {option.stat2Value || 'Online'}
                </div>
              </div>
            </div>
          </div>
        ) : option.style === 'bento_metrics' ? (
          <div className="space-y-3">
            <h2 className="font-luma-title text-xl sm:text-2xl leading-snug tracking-tight">
              {option.headline} <span className={a.text}>{option.highlight}</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {option.subtext}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">{option.metaLabel}</span>
                <span className="font-luma-title text-sm text-white">
                  {option.metaValue}
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  {option.stat2Label || 'Signal'}
                </span>
                <span className={`font-luma-title text-sm ${a.text}`}>
                  {option.stat2Value || 'Verified'}
                </span>
              </div>
            </div>
          </div>
        ) : option.style === 'terminal_bar' ? (
          <div className="space-y-3">
            <h2 className="font-luma-title text-xl sm:text-2xl leading-snug">
              {option.headline} <span className={a.text}>{option.highlight}</span>
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-black/70 p-3 font-mono text-[11px] text-zinc-300 space-y-1">
              <div>
                <span className="text-emerald-400">$</span> alma {option.section} --sync
              </div>
              <div className="text-zinc-400">
                → {option.metaLabel}: <span className={a.text}>{option.metaValue}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {option.subtext}
            </p>
          </div>
        ) : option.style === 'pipeline_steps' ? (
          <div className="space-y-3">
            <h2 className="font-luma-title text-xl sm:text-2xl leading-snug">
              {option.headline} <span className={a.text}>{option.highlight}</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {option.subtext}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(option.section === 'explore'
                ? ['01 Read', '02 Build', '03 Ship']
                : option.section === 'jobs'
                  ? ['01 Attach', '02 Vouch', '03 Interview']
                  : ['01 Alert', '02 Review', '03 Act']
              ).map((step) => (
                <div
                  key={step}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-[11px] font-mono text-zinc-200"
                >
                  <span className={a.text}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            <h2 className="font-luma-title text-xl sm:text-2xl leading-snug tracking-tight">
              {option.headline} <span className={a.text}>{option.highlight}</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {option.subtext}
            </p>
          </div>
        )}

        {option.primaryActionLabel && (
          <div className="pt-1">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold ${a.btn}`}
            >
              {option.primaryActionLabel}
            </span>
          </div>
        )}

        {option.style === 'partner_strip' && (
          <div className="pt-2.5 border-t border-white/10 flex items-center gap-3 text-[11px] text-zinc-400">
            <span className="shrink-0 font-medium">Partner Teams:</span>
            <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
              {HIRING_COMPANIES.slice(0, 5).map((c) => (
                <span key={c.name} className="font-semibold text-zinc-200">
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentSectionsPreviewPage() {
  const [activeTab, setActiveTab] = useState<SectionTab>('explore');
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [selectedByTab, setSelectedByTab] = useState<Record<SectionTab, number>>({
    explore: 1,
    jobs: 1,
    notifications: 1,
  });
  const [starredByTab, setStarredByTab] = useState<Record<SectionTab, number[]>>({
    explore: [1],
    jobs: [1],
    notifications: [1],
  });

  const options = useMemo(() => {
    if (activeTab === 'explore') return EXPLORE_OPTIONS;
    if (activeTab === 'jobs') return JOBS_OPTIONS;
    return NOTIFICATIONS_OPTIONS;
  }, [activeTab]);

  const selectedId = selectedByTab[activeTab];
  const activeOption = options.find((o) => o.id === selectedId) || options[0];
  const starred = starredByTab[activeTab];

  const setSelectedId = (id: number) => {
    setSelectedByTab((prev) => ({ ...prev, [activeTab]: id }));
  };

  const toggleStar = (id: number) => {
    setStarredByTab((prev) => {
      const list = prev[activeTab];
      return {
        ...prev,
        [activeTab]: list.includes(id)
          ? list.filter((x) => x !== id)
          : [...list, id],
      };
    });
  };

  const stepOption = (dir: -1 | 1) => {
    const idx = options.findIndex((o) => o.id === activeOption.id);
    const nextIdx = (idx + dir + options.length) % options.length;
    setSelectedId(options[nextIdx].id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050608] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#0B0D12]/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-cyan-500 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Feed
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
                <h1 className="text-sm font-bold tracking-tight">
                  Student Portal Upper Cards — 15 Options Each (45 Total)
                </h1>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Pick 1 option each for Explore, Alum Jobs, and Notifications
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full border border-zinc-200 dark:border-zinc-800 p-0.5 bg-zinc-100 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'single'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                    : 'text-zinc-500'
                }`}
              >
                <Maximize2 className="w-3 h-3" /> Feed Size Preview
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-2xs'
                    : 'text-zinc-500'
                }`}
              >
                <Grid3X3 className="w-3 h-3" /> All 15 Grid
              </button>
            </div>
            <ThemeToggle compact />
          </div>
        </div>

        {/* Section Switcher Tabs */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-2.5 flex items-center gap-2">
          {(
            [
              { id: 'explore', label: 'Explore Page (15 Options)', icon: <Compass className="w-3.5 h-3.5" /> },
              { id: 'jobs', label: 'Alum Jobs Page (15 Options)', icon: <Briefcase className="w-3.5 h-3.5" /> },
              { id: 'notifications', label: 'Notifications Page (15 Options)', icon: <Bell className="w-3.5 h-3.5" /> },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                activeTab === t.id
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 space-y-6">
        {viewMode === 'single' ? (
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0E1015] p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#0891B2] text-white px-2 py-0.5 text-xs font-mono font-bold">
                  {activeTab.toUpperCase()} #{String(activeOption.id).padStart(2, '0')}
                </span>
                <h2 className="font-bold text-sm sm:text-base">{activeOption.title}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleStar(activeOption.id)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    starred.includes(activeOption.id)
                      ? 'border-amber-400 bg-amber-500/15 text-amber-500'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  {starred.includes(activeOption.id) ? 'Starred' : 'Star'}
                </button>
                <button
                  type="button"
                  onClick={() => stepOption(-1)}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-cyan-500"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  type="button"
                  onClick={() => stepOption(1)}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-cyan-500"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <SectionCardRenderer option={activeOption} />

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0E1015] p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-semibold">Quick-Jump (15 options for {activeTab})</span>
                <span>Click a number to preview</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedId(opt.id)}
                    title={`${opt.id}. ${opt.title}`}
                    className={`relative h-8 min-w-[2.25rem] px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                      opt.id === activeOption.id
                        ? 'bg-[#0891B2] text-white'
                        : 'border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-cyan-500'
                    }`}
                  >
                    {String(opt.id).padStart(2, '0')}
                    {starred.includes(opt.id) && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {options.map((opt) => (
              <div key={opt.id} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-zinc-900 dark:bg-zinc-800 text-white px-2 py-0.5 text-[11px] font-mono font-bold">
                      #{String(opt.id).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold">{opt.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleStar(opt.id)}
                      className={
                        starred.includes(opt.id)
                          ? 'text-amber-400'
                          : 'text-zinc-400 hover:text-amber-400'
                      }
                      aria-label={`Star option ${opt.id}`}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedId(opt.id);
                        setViewMode('single');
                      }}
                      className="text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline inline-flex items-center gap-1"
                    >
                      Focus <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <SectionCardRenderer option={opt} compact />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
