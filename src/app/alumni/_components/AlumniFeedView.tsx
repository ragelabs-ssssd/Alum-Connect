'use client';

import React, { useMemo, useState } from 'react';
import { Award, Compass, Flame, Loader2, ShieldCheck, ThumbsUp } from 'lucide-react';
import { BuildCaseStudyCard } from '@/components/shared/BuildCaseStudyCard';
import { DOMAIN_OPTIONS } from '@/components/shared/DomainUtils';
import type { FeedBuildItem } from '@/types/domain';

export type EndorseActionKind = 'endorsement' | 'roast' | 'vouch';

export interface AlumniFeedViewProps {
  builds: FeedBuildItem[];
  hasMore: boolean;
  loadingMore: boolean;
  isVerified: boolean;
  totalBuildersCount: number;
  onLoadMore: () => Promise<void>;
  onInspect: (item: FeedBuildItem) => void;
  onAuthorClick: (authorId: string, authorName: string) => void;
  onAlumClick: (alumId: string, alumName: string) => void;
  onToggleLike: (item: FeedBuildItem) => void;
  onToggleSave: (item: FeedBuildItem) => void;
  onOpenEndorseModal: (item: FeedBuildItem, defaultKind: EndorseActionKind) => void;
  onOpenPostJobTab: () => void;
  onOpenDirectory: () => void;
}

/**
 * Alumni Talent & Proof-of-Work Feed view with domain filters, cursor pagination,
 * likes/saves, and Endorse / 5-Min Roast / Issue Vouch triggers.
 */
export function AlumniFeedView({
  builds,
  hasMore,
  loadingMore,
  isVerified,
  totalBuildersCount,
  onLoadMore,
  onInspect,
  onAuthorClick,
  onAlumClick,
  onToggleLike,
  onToggleSave,
  onOpenEndorseModal,
  onOpenPostJobTab,
  onOpenDirectory,
}: AlumniFeedViewProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [kindFilter, setKindFilter] = useState<'all' | 'projects' | 'papers'>('all');

  const visibleBuilds = useMemo(() => {
    return builds.filter((b) => {
      if (kindFilter === 'projects' && b.isPaper) return false;
      if (kindFilter === 'papers' && !b.isPaper) return false;
      if (selectedDomain === 'All') return true;
      if (selectedDomain === 'Research Papers') return b.isPaper;
      return b.domain === selectedDomain;
    });
  }, [builds, kindFilter, selectedDomain]);

  return (
    <div className="space-y-5">
      {/* Liquid Chrome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0C0F16] text-white p-6 sm:p-7 space-y-4 shadow-md border border-[rgba(226,232,240,0.16)]">
        <div className="pointer-events-none absolute -top-24 -right-24 h-60 w-60 rounded-full bg-gradient-to-br from-cyan-500/20 via-emerald-500/10 to-transparent blur-3xl" />
        <div className="relative z-10 space-y-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-1 text-[11px] font-semibold text-[#22D3EE]">
            <Compass className="w-3.5 h-3.5" />
            Alumni Talent &amp; Proof-of-Work Feed
          </span>
          <h1 className="font-luma-title text-xl sm:text-2xl leading-snug tracking-tight">
            Discover <span className="text-[#22D3EE]">{builds.length} live student builds</span> &amp; research papers across ITER.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
            Inspect live codebases, leave 5-minute architecture roasts, issue cryptographic{' '}
            <span className="font-mono text-[#34D399]">SOA-VOUCH</span> certificates, and fast-track high-signal students to your team&apos;s interview loop.
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              type="button"
              onClick={onOpenPostJobTab}
              className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] hover:brightness-110 text-[#041E24] px-5 py-2 text-xs font-semibold transition-all shadow-xs"
            >
              {isVerified ? 'Post Referral Opening' : 'View Referral Openings'}
            </button>
            <button
              type="button"
              onClick={onOpenDirectory}
              className="rounded-full border border-white/25 hover:bg-white/10 text-white px-5 py-2 text-xs font-semibold transition-colors"
            >
              Browse {totalBuildersCount} Network Profiles →
            </button>
          </div>
        </div>
      </div>

      {/* Domain & Type Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {DOMAIN_OPTIONS.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                selectedDomain === dom
                  ? 'bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24]'
                  : 'bg-[#F4F4F5] dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 text-[#52525B] dark:text-zinc-400 hover:border-[#0891B2]'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-0.5 text-[11px] font-semibold">
          {(['all', 'projects', 'papers'] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKindFilter(k)}
              className={`rounded-full px-2.5 py-0.5 capitalize transition-colors ${
                kindFilter === k
                  ? 'bg-white dark:bg-zinc-800 text-[#0F172A] dark:text-white shadow-2xs'
                  : 'text-[#52525B] dark:text-zinc-400'
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Cards */}
      {visibleBuilds.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#E4E4E7] dark:border-zinc-800 p-8 text-center space-y-2">
          <p className="text-sm font-semibold text-[#0F172A] dark:text-white">
            No builds match this filter yet.
          </p>
          <p className="text-xs text-[#52525B] dark:text-zinc-400">
            Try switching to All domains or loading more builds from the campus stream.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleBuilds.map((item) => (
            <BuildCaseStudyCard
              key={item.id}
              item={item}
              onInspect={onInspect}
              onAuthorClick={onAuthorClick}
              onAlumClick={onAlumClick}
              onToggleLike={onToggleLike}
              onToggleSave={onToggleSave}
              extraActions={
                isVerified ? (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenEndorseModal(item, 'endorsement')}
                      className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-[#0891B2] px-3 py-1 text-xs font-semibold text-[#09090B] dark:text-zinc-100 transition-colors"
                    >
                      <ThumbsUp className="w-3 h-3 text-[#0891B2] dark:text-[#22D3EE]" />
                      <span>Endorse</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenEndorseModal(item, 'roast')}
                      className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 transition-colors"
                    >
                      <Flame className="w-3 h-3" />
                      <span>5m Roast</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpenEndorseModal(item, 'vouch')}
                      className="inline-flex items-center gap-1 rounded-full bg-[#0F172A] hover:bg-[#1E293B] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-3 py-1 text-xs font-semibold transition-all"
                    >
                      <ShieldCheck className="w-3 h-3" />
                      <span>Issue Vouch</span>
                    </button>
                  </div>
                ) : (
                  <span
                    title="Verification required to endorse or issue Vouch cards"
                    className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300"
                  >
                    <Award className="w-3 h-3" /> Read-Only Preview
                  </span>
                )
              }
            />
          ))}
        </div>
      )}

      {/* Cursor Pagination Load More */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            disabled={loadingMore}
            onClick={() => void onLoadMore()}
            className="inline-flex items-center gap-2 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-[#0891B2] dark:hover:border-[#22D3EE] px-5 py-2 text-xs font-semibold text-[#0F172A] dark:text-white disabled:opacity-50 transition-colors"
          >
            {loadingMore && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{loadingMore ? 'Loading more builds...' : 'Load More Builds'}</span>
          </button>
        </div>
      )}
    </div>
  );
}
