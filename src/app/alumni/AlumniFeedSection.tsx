'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusProduct } from '../../types';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  Eye,
  Flame,
  GitBranch,
  GitCommit,
  Globe,
  Plus,
  Search,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface AlumniFeedSectionProps {
  onOpenPortal?: () => void;
}

const HIRING_FILTERS = [
  'All',
  'Open for Acqui-hire',
  'Open for Internships',
  'Funded & Scaling',
  'Research Papers',
] as const;

interface AlumniResearchPaper {
  id: string;
  title: string;
  authors: string;
  venue: string;
  abstract: string;
  guidanceNeeded: string;
  guidanceNotes: { alum: string; note: string }[];
}

const INITIAL_RESEARCH_PAPERS: AlumniResearchPaper[] = [
  {
    id: 'arp-1',
    title: 'Low-Latency RAG Evaluation for Indian Legal Corpora',
    authors: "Ananya Mohanty & Rohan Das • CSE '26/'25",
    venue: 'IEEE Access / arXiv Preprint',
    abstract:
      'Quantized retrieval-reranking pipeline cutting hallucination rates by 31% on multi-lingual Indian court judgments.',
    guidanceNeeded: 'Methodology Review • Venue Selection',
    guidanceNotes: [
      {
        alum: "Dr. Anirban Panda (Google DeepMind '15)",
        note: 'Add latency-vs-recall Pareto curves in Section 4 before IEEE submission.',
      },
    ],
  },
  {
    id: 'arp-2',
    title: 'Federated Anomaly Detection on Edge Smart-Grid Nodes',
    authors: "Debasis Nayak • ECE '26",
    venue: 'ACM SenSys Workshop',
    abstract:
      'Lightweight TinyML federated averaging across campus power sensors without sharing raw telemetry.',
    guidanceNeeded: 'Co-Author Mentorship • Dataset Scaling',
    guidanceNotes: [],
  },
];

export default function AlumniFeedSection({ onOpenPortal }: AlumniFeedSectionProps) {
  const {
    currentUser,
    products,
    bounties,
    dealRooms,
    openRoastModal,
    openVouchModal,
    openDealRoomModal,
    openLiveDemoModal,
  } = useApp();

  const [scope, setScope] = useState<'for_you' | 'for_all'>('for_all');
  const [search, setSearch] = useState('');
  const [hiringFilter, setHiringFilter] = useState<string>('All');
  const [papers, setPapers] = useState<AlumniResearchPaper[]>(INITIAL_RESEARCH_PAPERS);
  const [guidanceDraft, setGuidanceDraft] = useState<Record<string, string>>({});

  const myEngagedProducts = useMemo(() => {
    const alumName = currentUser.name.toLowerCase();
    return products.filter(
      (p) =>
        p.roasts.some((r) => r.alumName.toLowerCase() === alumName) ||
        p.vouches.some((v) => v.alumName.toLowerCase() === alumName) ||
        dealRooms.some(
          (d) =>
            d.productId === p.id && d.senderName.toLowerCase() === alumName
        )
    );
  }, [products, dealRooms, currentUser.name]);

  const visibleProducts = useMemo(() => {
    const base = scope === 'for_you' ? myEngagedProducts : products;
    const q = search.trim().toLowerCase();

    return base.filter((p) => {
      const matchesHiring =
        hiringFilter === 'All' || p.hiringStatus === hiringFilter;
      if (!matchesHiring) return false;
      if (!q) return true;

      return (
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.squadMembers.some((m) => m.name.toLowerCase().includes(q))
      );
    });
  }, [scope, myEngagedProducts, products, search, hiringFilter]);

  const stats = useMemo(() => {
    const alumName = currentUser.name.toLowerCase();
    const roastsCount = products.reduce(
      (acc, p) =>
        acc + p.roasts.filter((r) => r.alumName.toLowerCase() === alumName).length,
      0
    );
    const vouchesCount = products.reduce(
      (acc, p) =>
        acc + p.vouches.filter((v) => v.alumName.toLowerCase() === alumName).length,
      0
    );
    return {
      roastsCount,
      vouchesCount,
      dealRoomsCount: dealRooms.length,
    };
  }, [products, dealRooms, currentUser.name]);

  const renderRepoSlug = (githubUrl: string, title: string) => {
    try {
      const url = new URL(githubUrl);
      const clean = url.pathname.replace(/^\/|\/$/g, '');
      return clean || `iter-labs/${title.toLowerCase().replace(/\s+/g, '-')}`;
    } catch {
      return `iter-labs/${title.toLowerCase().replace(/\s+/g, '-')}`;
    }
  };

  const renderTalentCard = (product: CampusProduct) => {
    const lead = product.squadMembers[0];
    const latestCommit = product.recentCommits[0];
    const repoSlug = renderRepoSlug(product.githubUrl, product.title);

    return (
      <article
        key={product.id}
        className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] shadow-2xs transition-colors overflow-hidden"
      >
        {/* LinkedIn Talent Header */}
        <div className="p-4 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <img
              src={lead?.avatar || currentUser.avatar}
              alt={lead?.name || 'Student Lead'}
              className="h-11 w-11 rounded-full object-cover border border-[#E4E4E7] dark:border-slate-700"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-semibold text-[#09090B] dark:text-white">
                  {lead?.name || 'Campus Squad'}
                </span>
                {product.status === 'verified' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-sky-400 shrink-0" />
                )}
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  {product.hiringStatus}
                </span>
              </div>
              <p className="text-xs text-[#52525B] dark:text-slate-400 truncate">
                {lead?.role || 'Engineering Lead'} • {lead?.year || 'ITER'} ({lead?.branch || 'CSE'})
              </p>
              <p className="text-[11px] text-stone-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                <span>Published {product.publishedAt}</span>
                <span>•</span>
                <Globe className="w-3 h-3" />
                <span>{product.squadMembers.length} Squad Members</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openLiveDemoModal(product)}
            className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-slate-700 bg-[#F4F4F5] dark:bg-slate-800 hover:bg-[#F4F4F5] dark:hover:bg-slate-700 px-3 py-1 text-[11px] font-semibold text-stone-700 dark:text-slate-200 transition-colors"
          >
            <Eye className="w-3 h-3" />
            Inspect
          </button>
        </div>

        {/* Project Summary */}
        <div className="px-4 pb-3 space-y-2">
          <h3 className="text-base font-bold text-[#09090B] dark:text-white leading-snug">
            {product.title} —{' '}
            <span className="font-normal text-[#52525B] dark:text-slate-300">
              {product.tagline}
            </span>
          </h3>
          <p className="text-[13.5px] text-stone-700 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.tags.slice(0, 6).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F4F4F5] dark:bg-slate-800 border border-[#E4E4E7] dark:border-slate-700 px-2.5 py-0.5 text-[11px] font-medium text-stone-700 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Embedded GitHub Repository Showcase */}
        <div className="mx-4 mb-3 rounded-xl border border-[#E4E4E7] dark:border-slate-700/80 bg-[#F8FAFC] dark:bg-[#0D1422] p-3.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-md bg-stone-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0">
                <GitBranch className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-mono font-semibold text-[#09090B] dark:text-slate-100 truncate">
                  {repoSlug}
                </div>
                <div className="text-[11px] text-[#52525B] dark:text-slate-400">
                  {product.commitsCount} commits • {product.tractionLabel}
                </div>
              </div>
            </div>

            <a
              href={product.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-[#F4F4F5] dark:hover:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-stone-700 dark:text-slate-200 transition-colors"
            >
              <Code2 className="w-3 h-3" />
              Source Code
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          {latestCommit && (
            <div className="flex items-center justify-between gap-2 rounded-lg bg-white dark:bg-slate-900/70 border border-[#E4E4E7]/80 dark:border-slate-800 px-2.5 py-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0 text-stone-700 dark:text-slate-300">
                <GitCommit className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-mono text-stone-400 dark:text-slate-500">
                  {latestCommit.hash.slice(0, 7)}
                </span>
                <span className="truncate">{latestCommit.message}</span>
              </div>
              <span className="text-stone-400 dark:text-slate-500 shrink-0">
                {latestCommit.timeAgo}
              </span>
            </div>
          )}
        </div>

        {/* Social Proof Footer */}
        <div className="px-4 py-2 flex items-center justify-between text-[11px] text-[#52525B] dark:text-slate-400 border-t border-stone-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <span>{product.vouches.length} Vouches</span>
            <span>•</span>
            <span>{product.roasts.length} Reviews</span>
          </div>
          <span>{product.viewsCount} views</span>
        </div>

        {/* 3-Button LinkedIn Alumni Action Bar */}
        <div className="p-2.5 border-t border-stone-100 dark:border-slate-800/80 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => openRoastModal(product)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-slate-700 hover:bg-[#F4F4F5] dark:hover:bg-slate-800 py-2 px-3 text-xs font-semibold text-stone-700 dark:text-slate-200 transition-colors"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>5-Min Roast</span>
          </button>

          <button
            type="button"
            onClick={() => openVouchModal(product)}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#2563EB] dark:border-sky-500/60 hover:bg-blue-50 dark:hover:bg-sky-500/10 py-2 px-3 text-xs font-semibold text-[#2563EB] dark:text-sky-400 transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Issue Vouch</span>
          </button>

          <button
            type="button"
            onClick={() => openDealRoomModal(product, 'fast_track_interview')}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 py-2 px-3 text-xs font-semibold transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Hire / Connect</span>
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT RAIL: Alumni Profile Card */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
          <div className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] overflow-hidden shadow-2xs">
            <div className="h-16 bg-gradient-to-r from-indigo-600 via-[#2563EB] to-sky-600" />
            <div className="px-4 pb-4 -mt-8">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-[#18181B] shadow-xs"
              />
              <div className="mt-2.5">
                <h2 className="text-base font-bold text-[#09090B] dark:text-white">
                  {currentUser.name}
                </h2>
                <p className="text-xs text-[#52525B] dark:text-slate-400 mt-0.5 leading-snug">
                  {currentUser.headline}
                </p>
                <p className="text-[11px] text-stone-400 dark:text-slate-500 mt-1">
                  {currentUser.company || 'ITER Alumni'} • Batch &apos;
                  {currentUser.batchYear ? String(currentUser.batchYear).slice(-2) : '19'}
                </p>
              </div>

              {currentUser.bandwidthShield && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{currentUser.bandwidthShield}</span>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#52525B] dark:text-slate-400">Vouches Issued</span>
                  <span className="font-bold text-[#2563EB] dark:text-sky-400">
                    {stats.vouchesCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#52525B] dark:text-slate-400">5-Min Roasts</span>
                  <span className="font-bold text-[#2563EB] dark:text-sky-400">
                    {stats.roastsCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#52525B] dark:text-slate-400">Active Deal Rooms</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {stats.dealRoomsCount}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenPortal}
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 py-2 px-4 text-xs font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Commission Bounty / Switch Alum
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER STREAM: Talent Discovery + GitHub Showcases */}
        <section className="lg:col-span-6 space-y-4">
          {/* Feed Controls */}
          <div className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] p-4 shadow-2xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 rounded-full bg-[#F4F4F5] dark:bg-slate-800/80 p-0.5">
                <button
                  type="button"
                  onClick={() => setScope('for_you')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    scope === 'for_you'
                      ? 'bg-white dark:bg-slate-950 text-[#2563EB] dark:text-sky-400 shadow-2xs'
                      : 'text-[#52525B] dark:text-slate-400'
                  }`}
                >
                  For You ({myEngagedProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScope('for_all')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    scope === 'for_all'
                      ? 'bg-white dark:bg-slate-950 text-[#2563EB] dark:text-sky-400 shadow-2xs'
                      : 'text-[#52525B] dark:text-slate-400'
                  }`}
                >
                  For All ({products.length})
                </button>
              </div>

              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search builders, stack, projects..."
                  className="w-full rounded-full border border-[#E4E4E7] dark:border-slate-700 bg-[#F4F4F5] dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-[#09090B] dark:text-slate-100 placeholder:text-stone-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {HIRING_FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setHiringFilter(status)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                    hiringFilter === status
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-white dark:bg-slate-900 text-[#52525B] dark:text-slate-300 border-[#E4E4E7] dark:border-slate-700 hover:border-[#E4E4E7]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {hiringFilter === 'Research Papers' ? (
            <div className="space-y-4">
              {papers.map((paper) => (
                <article
                  key={paper.id}
                  className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] p-5 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-sky-500/10 text-[#2563EB] dark:text-sky-400 px-2.5 py-0.5 text-[11px] font-semibold">
                        <BookOpen className="w-3 h-3" /> {paper.venue}
                      </span>
                      <h3 className="text-base font-bold mt-1.5 text-[#09090B] dark:text-white">
                        {paper.title}
                      </h3>
                      <p className="text-xs text-[#52525B] dark:text-slate-400">
                        {paper.authors} • Seeking: {paper.guidanceNeeded}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#52525B] dark:text-slate-300 leading-relaxed">
                    {paper.abstract}
                  </p>

                  {paper.guidanceNotes.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t border-[#E4E4E7] dark:border-slate-800">
                      {paper.guidanceNotes.map((g, idx) => (
                        <div
                          key={idx}
                          className="rounded-lg bg-[#F4F4F5] dark:bg-slate-900 px-3 py-2 text-xs"
                        >
                          <strong className="text-[#2563EB] dark:text-sky-400">
                            {g.alum}:{' '}
                          </strong>
                          <span>{g.note}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const text = (guidanceDraft[paper.id] || '').trim();
                      if (!text) return;
                      setPapers((prev) =>
                        prev.map((p) =>
                          p.id === paper.id
                            ? {
                                ...p,
                                guidanceNotes: [
                                  ...p.guidanceNotes,
                                  { alum: currentUser.name, note: text },
                                ],
                              }
                            : p
                        )
                      );
                      setGuidanceDraft((d) => ({ ...d, [paper.id]: '' }));
                    }}
                    className="flex gap-2 pt-2 border-t border-[#E4E4E7] dark:border-slate-800"
                  >
                    <input
                      type="text"
                      value={guidanceDraft[paper.id] || ''}
                      onChange={(e) =>
                        setGuidanceDraft((d) => ({
                          ...d,
                          [paper.id]: e.target.value,
                        }))
                      }
                      placeholder="Contribute methodology advice, dataset tip, or co-author offer..."
                      className="flex-1 rounded-full border border-[#E4E4E7] dark:border-slate-700 bg-[#F4F4F5] dark:bg-slate-900 px-3.5 py-1.5 text-xs focus:outline-none focus:border-[#2563EB]"
                    />
                    <button
                      type="submit"
                      className="rounded-full bg-[#18181B] hover:bg-[#27272A] dark:bg-zinc-100 dark:text-zinc-950 text-white px-4 py-1.5 text-xs font-semibold shrink-0"
                    >
                      Contribute &amp; Guide
                    </button>
                  </form>
                </article>
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] p-8 text-center space-y-2">
              <p className="text-sm font-semibold text-[#09090B] dark:text-white">
                {scope === 'for_you'
                  ? 'No reviews or deal rooms under this persona yet'
                  : 'No projects match your current filter'}
              </p>
              <p className="text-xs text-[#52525B] dark:text-slate-400">
                Switch to &quot;For All&quot; to inspect campus builds and issue your first Vouch or Roast.
              </p>
            </div>
          ) : (
            <div className="space-y-4">{visibleProducts.map(renderTalentCard)}</div>
          )}
        </section>

        {/* RIGHT RAIL: Active Deal Rooms & Live Bounties */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
          <div className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#2563EB] dark:text-sky-400" />
              Active Deal Rooms
            </h3>
            <div className="space-y-2.5">
              {dealRooms.slice(0, 4).map((deal) => (
                <div
                  key={deal.id}
                  className="rounded-lg border border-[#E4E4E7] dark:border-slate-800 bg-[#F4F4F5]/70 dark:bg-slate-900/60 p-3 space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#09090B] dark:text-white truncate">
                      {deal.productTitle}
                    </span>
                    <span className="shrink-0 rounded-full bg-blue-50 dark:bg-sky-500/10 text-[#2563EB] dark:text-sky-400 px-2 py-0.5 text-[10px] font-semibold">
                      {deal.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#52525B] dark:text-slate-400">
                    {deal.senderName} • {deal.senderCompany}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Live Bounties
            </h3>
            <div className="space-y-2.5">
              {bounties.slice(0, 3).map((bounty) => (
                <div
                  key={bounty.id}
                  className="rounded-lg border border-[#E4E4E7] dark:border-slate-800 bg-[#F4F4F5]/70 dark:bg-slate-900/60 p-3 space-y-1"
                >
                  <div className="text-xs font-semibold text-[#09090B] dark:text-white">
                    {bounty.title}
                  </div>
                  <div className="text-[11px] text-[#52525B] dark:text-slate-400">
                    {bounty.stipend} • {bounty.appliedSquadsCount} squads applied
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
