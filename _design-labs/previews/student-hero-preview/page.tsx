'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  ChevronLeft,
  ChevronRight,
  Flame,
  Grid3X3,
  Maximize2,
  Play,
  Quote,
  Search,
  Star,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { HIRING_COMPANIES } from '../../data/hiringCompanies';
import {
  STORY_CARD_CATEGORIES,
  STORY_HERO_OPTIONS,
  StoryCardCategory,
  StoryHeroOption,
} from './storyHeroOptions';

const ACCENTS: Record<
  StoryHeroOption['accent'],
  {
    text: string;
    pill: string;
    primaryBtn: string;
    topBar: string;
    glow: string;
  }
> = {
  cyan: {
    text: 'text-[#22D3EE]',
    pill: 'bg-cyan-500/15 text-[#22D3EE] border-cyan-500/30',
    primaryBtn:
      'bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] hover:brightness-110 text-[#041E24]',
    topBar: 'bg-gradient-to-r from-[#22D3EE] to-[#34D399]',
    glow: 'from-cyan-500/20 via-emerald-500/10 to-transparent',
  },
  blue: {
    text: 'text-sky-400',
    pill: 'bg-blue-500/15 text-sky-300 border-blue-500/30',
    primaryBtn: 'bg-[#2563EB] hover:bg-blue-500 text-white',
    topBar: 'bg-gradient-to-r from-[#2563EB] to-sky-400',
    glow: 'from-blue-600/25 via-sky-500/10 to-transparent',
  },
  emerald: {
    text: 'text-emerald-400',
    pill: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    primaryBtn: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950',
    topBar: 'bg-gradient-to-r from-emerald-400 to-teal-400',
    glow: 'from-emerald-500/20 via-teal-500/10 to-transparent',
  },
  indigo: {
    text: 'text-indigo-400',
    pill: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    topBar: 'bg-gradient-to-r from-indigo-500 to-violet-400',
    glow: 'from-indigo-500/25 via-violet-500/10 to-transparent',
  },
  amber: {
    text: 'text-amber-400',
    pill: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    primaryBtn: 'bg-amber-400 hover:bg-amber-300 text-zinc-950',
    topBar: 'bg-gradient-to-r from-amber-400 to-orange-400',
    glow: 'from-amber-500/20 via-orange-500/10 to-transparent',
  },
};

function StoryHeroCardRenderer({
  option,
  compact = false,
}: {
  option: StoryHeroOption;
  compact?: boolean;
}) {
  const a = ACCENTS[option.accent];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-[rgba(226,232,240,0.18)] bg-[#14171E]/95 text-white shadow-sm backdrop-blur-xl ${
        compact ? 'p-5 space-y-3' : 'p-6 sm:p-7 space-y-4'
      }`}
    >
      {/* Top accent stripe for editorial_minimal */}
      {option.style === 'editorial_minimal' && (
        <div className={`absolute top-0 left-0 right-0 h-1 ${a.topBar}`} />
      )}

      {/* Subtle Gateway-style ambient glow */}
      <div
        className={`pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-gradient-to-br ${a.glow} blur-3xl`}
      />

      <div className="relative z-10 space-y-3.5">
        {/* Badge Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${a.pill}`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>{option.badge}</span>
          </div>
          <span className="font-mono text-[11px] text-zinc-400">
            {option.stat1Label}: <strong className="text-white">{option.stat1Value}</strong>
          </span>
        </div>

        {/* Style-specific Layouts */}
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
                  {option.stat1Label}
                </div>
                <div className="font-luma-title text-lg text-white mt-0.5">
                  {option.stat1Value}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                <div className="text-[10px] font-mono uppercase text-zinc-400">
                  {option.stat2Label}
                </div>
                <div className={`font-luma-title text-lg mt-0.5 ${a.text}`}>
                  {option.stat2Value}
                </div>
              </div>
            </div>
          </div>
        ) : option.style === 'sprint_pipeline' ? (
          <div className="space-y-3">
            <h2 className="font-luma-title text-xl sm:text-2xl leading-snug">
              {option.headline} <span className={a.text}>{option.highlight}</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {option.subtext}
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { step: '01 Build', sub: 'Ship Repo' },
                { step: '02 Roast', sub: '5-Min Alum' },
                { step: '03 Offer', sub: 'Fast-Track' },
              ].map((s) => (
                <div
                  key={s.step}
                  className="rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2"
                >
                  <div className={`text-[11px] font-mono font-semibold ${a.text}`}>
                    {s.step}
                  </div>
                  <div className="text-[11px] text-zinc-300">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        ) : option.style === 'terminal_proof' ? (
          <div className="space-y-3">
            <h2 className="font-luma-title text-xl sm:text-2xl leading-snug">
              {option.headline} <span className={a.text}>{option.highlight}</span>
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-black/70 p-3 font-mono text-[11px] text-zinc-300 space-y-1">
              <div>
                <span className="text-emerald-400">$</span> git commit -m &quot;feat: ship campus mvp&quot;
              </div>
              <div className="text-zinc-400">
                → {option.stat1Label}: {option.stat1Value} • {option.stat2Label}:{' '}
                <span className={a.text}>{option.stat2Value}</span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {option.subtext}
            </p>
          </div>
        ) : option.style === 'vouch_quote' ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2.5">
              <Quote className={`w-6 h-6 shrink-0 mt-1 ${a.text}`} />
              <h2 className="font-luma-title text-xl sm:text-2xl leading-snug">
                {option.headline} <span className={a.text}>{option.highlight}</span>
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {option.subtext}
            </p>
          </div>
        ) : option.style === 'bento_stats' ? (
          <div className="space-y-3">
            <h2 className="font-luma-title text-xl sm:text-2xl leading-snug">
              {option.headline} <span className={a.text}>{option.highlight}</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {option.subtext}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">{option.stat1Label}</span>
                <span className="font-luma-title text-sm text-white">
                  {option.stat1Value}
                </span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.05] px-3.5 py-2.5 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">{option.stat2Label}</span>
                <span className={`font-luma-title text-sm ${a.text}`}>
                  {option.stat2Value}
                </span>
              </div>
            </div>
          </div>
        ) : option.style === 'demo_theater' ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Play className={`w-4 h-4 ${a.text}`} />
                </span>
                <div>
                  <div className="text-xs font-semibold">Live Walkthrough Ready</div>
                  <div className="text-[11px] text-zinc-400">
                    {option.stat1Value} demo • {option.stat2Value}
                  </div>
                </div>
              </div>
              <span className="rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] font-mono text-zinc-300">
                HD
              </span>
            </div>
            <h2 className="font-luma-title text-xl sm:text-2xl leading-snug">
              {option.headline} <span className={a.text}>{option.highlight}</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {option.subtext}
            </p>
          </div>
        ) : option.style === 'flywheel_badge' ? (
          <div className="space-y-3">
            <h2 className="font-luma-title text-xl sm:text-2xl leading-snug">
              {option.headline} <span className={a.text}>{option.highlight}</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {option.subtext}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              {['Build', 'Roast', 'Vouch', 'Hire', 'Mentor'].map((node, i) => (
                <React.Fragment key={node}>
                  <span className="rounded-full border border-white/15 bg-white/[0.05] px-2.5 py-0.5 text-zinc-200">
                    {node}
                  </span>
                  {i < 4 && <span className={a.text}>→</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          /* gateway_chrome, marquee_partner, editorial_minimal */
          <div className="space-y-2.5">
            <h2 className="font-luma-title text-xl sm:text-2xl leading-snug tracking-tight">
              {option.headline} <span className={a.text}>{option.highlight}</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {option.subtext}
            </p>
          </div>
        )}

        {/* CTAs */}
        <div className="pt-1 flex flex-wrap items-center gap-2.5">
          <Link
            href="/share-project"
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all shadow-xs ${a.primaryBtn}`}
          >
            {option.primaryCta}
          </Link>
          <Link
            href="/alumni"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.05] hover:bg-white/10 px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            {option.secondaryCta}
          </Link>
        </div>

        {/* Optional Marquee Footer for marquee_partner / gateway_chrome */}
        {(option.style === 'marquee_partner' || option.style === 'gateway_chrome') && (
          <div className="pt-2.5 border-t border-white/10 flex items-center gap-3 text-[11px] text-zinc-400">
            <span className="shrink-0 font-medium">Reviewing:</span>
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

export default function StudentHeroPreviewPage() {
  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [selectedId, setSelectedId] = useState<number>(1);
  const [category, setCategory] = useState<StoryCardCategory>('All');
  const [search, setSearch] = useState('');
  const [onlyStarred, setOnlyStarred] = useState(false);
  const [starredIds, setStarredIds] = useState<number[]>([1, 6, 11]);

  const toggleStar = (id: number) => {
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return STORY_HERO_OPTIONS.filter((opt) => {
      if (category !== 'All' && opt.category !== category) return false;
      if (onlyStarred && !starredIds.includes(opt.id)) return false;
      if (!q) return true;
      return (
        opt.title.toLowerCase().includes(q) ||
        opt.headline.toLowerCase().includes(q) ||
        opt.highlight.toLowerCase().includes(q) ||
        opt.growthNote.toLowerCase().includes(q) ||
        String(opt.id) === q
      );
    });
  }, [category, onlyStarred, search, starredIds]);

  const active =
    STORY_HERO_OPTIONS.find((o) => o.id === selectedId) || STORY_HERO_OPTIONS[0];

  const stepOption = (dir: -1 | 1) => {
    const list = filtered.length > 0 ? filtered : STORY_HERO_OPTIONS;
    const idx = list.findIndex((o) => o.id === active.id);
    const nextIdx = idx === -1 ? 0 : (idx + dir + list.length) % list.length;
    setSelectedId(list[nextIdx].id);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050608] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-[#0B0D12]/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-blue-500 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Feed
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
                <h1 className="text-sm font-bold tracking-tight">
                  Student Story Card Lab — 30 Gateway-Style Options
                </h1>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                30 creative edits for your &quot;Student Story of the Week&quot; card aligned with growth &amp; vision
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
                placeholder="Search 30 card options..."
                className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-cyan-500 w-44 sm:w-56"
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
                <Grid3X3 className="w-3 h-3" /> All 30 Grid
              </button>
            </div>

            <ThemeToggle compact />
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-2.5 flex items-center gap-2 overflow-x-auto">
          {STORY_CARD_CATEGORIES.map((cat) => (
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
        {viewMode === 'single' ? (
          <div className="max-w-3xl mx-auto space-y-5">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0E1015] p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-[#0891B2] text-white px-2 py-0.5 text-xs font-mono font-bold">
                    OPTION #{String(active.id).padStart(2, '0')}
                  </span>
                  <h2 className="font-bold text-sm sm:text-base">{active.title}</h2>
                  <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium text-zinc-500">
                    {active.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  {active.growthNote}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleStar(active.id)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    starredIds.includes(active.id)
                      ? 'border-amber-400 bg-amber-500/15 text-amber-500'
                      : 'border-zinc-200 dark:border-zinc-800'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  {starredIds.includes(active.id) ? 'Starred' : 'Star'}
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

            {/* Exact Student Feed Center Column Width Preview */}
            <StoryHeroCardRenderer option={active} />

            {/* 01..30 Quick Switcher */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0E1015] p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-zinc-500">
                <span className="font-semibold">
                  Quick-Jump ({filtered.length} options)
                </span>
                <span>Click any number to preview</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {filtered.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedId(opt.id)}
                    title={`${opt.id}. ${opt.title}`}
                    className={`relative h-8 min-w-[2.25rem] px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                      opt.id === active.id
                        ? 'bg-[#0891B2] text-white'
                        : 'border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:border-cyan-500'
                    }`}
                  >
                    {String(opt.id).padStart(2, '0')}
                    {starredIds.includes(opt.id) && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filtered.map((opt) => (
              <div key={opt.id} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-zinc-900 dark:bg-zinc-800 text-white px-2 py-0.5 text-[11px] font-mono font-bold">
                      #{String(opt.id).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold">{opt.title}</span>
                    <span className="text-[11px] text-zinc-500">• {opt.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleStar(opt.id)}
                      className={
                        starredIds.includes(opt.id)
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
                <StoryHeroCardRenderer option={opt} compact />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
