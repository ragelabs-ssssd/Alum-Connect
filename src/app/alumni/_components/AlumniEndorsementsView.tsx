'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  Flame,
  ShieldCheck,
  ThumbsUp,
} from 'lucide-react';
import { formatShortDate, getDomainBadgeClass } from '@/components/shared/DomainUtils';
import { VouchCodeBadge } from '@/components/shared/VerificationBadge';
import type { EndorsementWithTargetDTO } from '@/modules/endorsements/queries';

export interface AlumniEndorsementsViewProps {
  endorsements: EndorsementWithTargetDTO[];
  onToggleRoastResolved: (endorsementId: string) => Promise<void>;
  onOpenBuildById: (targetType: 'project' | 'paper', targetId: string) => void;
  onExploreFeed: () => void;
}

/**
 * Displays all endorsements, 5-minute architecture roasts, and cryptographic
 * Vouch certificates issued by the signed-in alumnus.
 */
export function AlumniEndorsementsView({
  endorsements,
  onToggleRoastResolved,
  onOpenBuildById,
  onExploreFeed,
}: AlumniEndorsementsViewProps) {
  const [kindFilter, setKindFilter] = useState<'all' | 'vouch' | 'endorsement' | 'roast'>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const visible = endorsements.filter((e) =>
    kindFilter === 'all' ? true : e.kind === kindFilter
  );

  const vouchCount = endorsements.filter((e) => e.kind === 'vouch').length;
  const roastCount = endorsements.filter((e) => e.kind === 'roast').length;

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-[#14171E]/95 p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="space-y-1">
            <h1 className="font-luma-title text-xl sm:text-2xl leading-snug tracking-tight">
              My Endorsements &amp; Vouch Ledger ({endorsements.length})
            </h1>
            <p className="text-xs text-[#52525B] dark:text-zinc-400">
              Every endorsement, 5-minute roast, and cryptographic Vouch Card boosts student referral readiness across ITER.
            </p>
          </div>
          <button
            type="button"
            onClick={onExploreFeed}
            className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-4 py-2 text-xs font-semibold"
          >
            Review Talent Feed →
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {(
            [
              { id: 'all', label: `All (${endorsements.length})` },
              { id: 'vouch', label: `Vouch Cards (${vouchCount})` },
              {
                id: 'endorsement',
                label: `Endorsements (${endorsements.length - vouchCount - roastCount})`,
              },
              { id: 'roast', label: `5m Roasts (${roastCount})` },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setKindFilter(tab.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                kindFilter === tab.id
                  ? 'bg-[#0F172A] text-white dark:bg-[#22D3EE] dark:text-[#041E24]'
                  : 'bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 text-[#52525B] dark:text-zinc-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#E4E4E7] dark:border-zinc-800 p-8 text-center space-y-2.5">
          <Award className="w-7 h-7 mx-auto text-[#0891B2] dark:text-[#22D3EE]" />
          <p className="text-sm font-semibold">No reviews in this category yet.</p>
          <p className="text-xs text-[#52525B] dark:text-zinc-400">
            Inspect any student build or research paper on the Talent Feed to issue your first Vouch Card or 5-minute roast.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {visible.map((end) => (
            <article
              key={end.id}
              className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-5 space-y-3 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${
                      end.kind === 'vouch'
                        ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-[#34D399]'
                        : end.kind === 'roast'
                          ? 'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                          : 'border-[#0891B2]/35 bg-[#0891B2]/10 text-[#0891B2] dark:text-[#22D3EE]'
                    }`}
                  >
                    {end.kind === 'vouch' ? (
                      <ShieldCheck className="w-3 h-3" />
                    ) : end.kind === 'roast' ? (
                      <Flame className="w-3 h-3" />
                    ) : (
                      <ThumbsUp className="w-3 h-3" />
                    )}
                    <span className="capitalize">{end.kind}</span>
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${getDomainBadgeClass(
                      end.targetDomain
                    )}`}
                  >
                    {end.targetDomain}
                  </span>
                  <span className="text-[11px] font-mono text-[#52525B] dark:text-zinc-400">
                    {end.targetCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {end.vouchCode && <VouchCodeBadge vouchCode={end.vouchCode} />}
                  <span className="text-[11px] text-[#52525B] dark:text-zinc-400">
                    {formatShortDate(end.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-luma-title text-base text-[#09090B] dark:text-white">
                  {end.targetTitle}
                </h2>
                <span className="text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE]">
                  {end.category} • {end.rating}/5
                </span>
              </div>

              <p className="text-xs sm:text-sm italic text-[#09090B] dark:text-zinc-200 leading-relaxed bg-[#F4F4F5] dark:bg-zinc-900 rounded-xl p-3.5 border border-[#E4E4E7] dark:border-zinc-800">
                &ldquo;{end.quote}&rdquo;
              </p>

              {end.certifiedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {end.certifiedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-[#34D399]"
                    >
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-[#E4E4E7] dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {end.kind === 'roast' && (
                    <button
                      type="button"
                      disabled={togglingId === end.id}
                      onClick={async () => {
                        setTogglingId(end.id);
                        try {
                          await onToggleRoastResolved(end.id);
                        } finally {
                          setTogglingId(null);
                        }
                      }}
                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors ${
                        end.resolved
                          ? 'border-emerald-500/35 bg-emerald-500/10 text-emerald-700 dark:text-[#34D399]'
                          : 'border-amber-500/35 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {end.resolved ? 'Roast Resolved ✓' : 'Mark Roast Resolved'}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {end.targetCode && (
                    <Link
                      href={`/projects/${encodeURIComponent(end.targetCode)}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
                    >
                      <span>Project Page</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => onOpenBuildById(end.targetType, end.targetId)}
                    className="text-xs font-semibold text-[#0F172A] dark:text-zinc-200 hover:underline"
                  >
                    Inspect Case Study →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
