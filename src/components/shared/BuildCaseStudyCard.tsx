'use client';

import React from 'react';
import {
  ArrowUpRight,
  Bookmark,
  BookOpen,
  CheckCircle2,
  GitBranch,
  Layers,
  ThumbsUp,
} from 'lucide-react';
import type { FeedBuildItem } from '@/types/domain';
import { formatHostLabel, getCoverGradient, getDomainBadgeClass } from './DomainUtils';
import { VouchCodeBadge } from './VerificationBadge';

export interface BuildCaseStudyCardProps {
  item: FeedBuildItem;
  liked?: boolean;
  saved?: boolean;
  onInspect?: (item: FeedBuildItem) => void;
  onAuthorClick?: (authorId: string, authorName: string) => void;
  onAlumClick?: (alumId: string, alumName: string) => void;
  onToggleLike?: (item: FeedBuildItem) => void;
  onToggleSave?: (item: FeedBuildItem) => void;
  extraActions?: React.ReactNode;
  className?: string;
}

/**
 * Unified proof-of-work feed card for both student projects (ProjectCardDTO)
 * and research papers (PaperDTO).
 */
export function BuildCaseStudyCard({
  item,
  liked,
  saved,
  onInspect,
  onAuthorClick,
  onAlumClick,
  onToggleLike,
  onToggleSave,
  extraActions,
  className = '',
}: BuildCaseStudyCardProps) {
  const isLiked = liked ?? Boolean(item.likedByMe);
  const isSaved = saved ?? Boolean(item.savedByMe);

  const authorId = item.isPaper ? item.leadAuthorId : item.leadId;
  const authorName = item.isPaper ? item.leadAuthorName : item.leadName;
  const authorMeta = item.isPaper
    ? `${item.leadAuthorYearBranch} • ${item.venue}`
    : item.batchLabel || item.academicYears;

  const impactMetric = item.isPaper
    ? `${item.paperStatus} • ${item.venue}`
    : item.linkedPaperCode
      ? `${item.hostingPlatform} • Paper ${item.linkedPaperCode}`
      : `${item.collaborationMode} (${item.teamSize}) • ${item.hostingPlatform}`;

  const liveHref = item.isPaper ? item.liveDemoUrl || item.preprintUrl : item.liveUrl;
  const repoHref = item.isPaper ? item.codeRepoUrl : item.githubUrl;
  const liveHost = formatHostLabel(liveHref);
  const repoHost = formatHostLabel(repoHref);

  const combinedTags = Array.from(new Set([...(item.techStack ?? []), ...(item.tags ?? [])]));
  const visibleTags = combinedTags.slice(0, 5);
  const overflowCount = Math.max(0, combinedTags.length - visibleTags.length);

  const topEndorsement =
    item.endorsements.find((e) => Boolean(e.vouchCode)) ?? item.endorsements[0];

  const coverGradient = getCoverGradient(item.id || item.code);

  return (
    <article
      className={`rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#0891B2]/45 dark:hover:border-[#22D3EE]/40 transition-all ${className}`}
    >
      {/* Cover Header */}
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${coverGradient} p-5 text-white flex flex-col justify-between min-h-[148px]`}
      >
        {item.coverImage && (
          <img
            src={item.coverImage}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-md ${getDomainBadgeClass(
                item.domain
              )}`}
            >
              {item.domain}
            </span>
            {item.isPaper && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white">
                <BookOpen className="w-3 h-3" /> Research Paper
              </span>
            )}
          </div>

          <span className="rounded-full bg-white/15 backdrop-blur-md px-2.5 py-0.5 text-[11px] font-semibold text-zinc-100">
            {impactMetric}
          </span>
        </div>

        <div className="relative z-10 pt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-luma-title text-base sm:text-lg leading-snug tracking-tight text-white">
              {item.title}
            </h2>
            {item.subtitle && (
              <p className="text-xs text-zinc-200/90 mt-0.5 line-clamp-2">{item.subtitle}</p>
            )}
          </div>

          {liveHref && liveHref !== '#' && (
            <a
              href={liveHref}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white text-[#09090B] hover:bg-[#22D3EE] hover:text-[#041E24] px-3 py-1.5 text-[11px] font-bold transition-colors"
            >
              <span>{item.isPaper && !item.liveDemoUrl ? 'Preprint' : 'Live Demo'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {/* Author Row */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => onAuthorClick?.(authorId, authorName)}
            className="flex items-center gap-2.5 text-xs min-w-0 text-left hover:text-[#0891B2] dark:hover:text-[#22D3EE] transition-colors"
          >
            {item.authorAvatar ? (
              <img
                src={item.authorAvatar}
                alt={authorName}
                className="h-7 w-7 rounded-full object-cover border border-[#E4E4E7] dark:border-zinc-700 shrink-0"
              />
            ) : (
              <span className="h-7 w-7 rounded-full bg-[#0891B2]/15 text-[#0891B2] dark:text-[#22D3EE] font-bold text-[10px] flex items-center justify-center shrink-0">
                {authorName.slice(0, 2).toUpperCase()}
              </span>
            )}
            <div className="truncate">
              <span className="font-bold hover:underline">{authorName}</span>{' '}
              <span className="text-[#52525B] dark:text-zinc-400">• {authorMeta}</span>
            </div>
          </button>

          {!item.isPaper && item.openRole && (
            <span className="shrink-0 rounded-full border border-[#0891B2]/30 dark:border-[#22D3EE]/30 bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 text-[#0891B2] dark:text-[#22D3EE] px-2.5 py-0.5 text-[11px] font-semibold">
              {item.openRole}
            </span>
          )}
        </div>

        {/* Story */}
        <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-300 leading-relaxed line-clamp-3">
          {item.story}
        </p>

        {/* Alumni Endorsement Quote + Vouch Link */}
        {topEndorsement && (
          <div className="rounded-2xl bg-[#F4F4F5] dark:bg-zinc-900/90 border border-[#E4E4E7] dark:border-zinc-800 p-3.5 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() =>
                  onAlumClick?.(topEndorsement.alumniUserId, topEndorsement.alumName)
                }
                className="flex items-center gap-2 text-[11px] font-bold text-[#0891B2] dark:text-[#22D3EE] hover:underline text-left min-w-0"
              >
                {topEndorsement.alumAvatar && (
                  <img
                    src={topEndorsement.alumAvatar}
                    alt={topEndorsement.alumName}
                    className="h-5 w-5 rounded-full object-cover border border-[#E4E4E7] dark:border-zinc-700 shrink-0"
                  />
                )}
                <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399] shrink-0" />
                <span className="truncate">
                  {topEndorsement.kind === 'roast'
                    ? 'Architecture Roast'
                    : topEndorsement.kind === 'vouch'
                      ? 'Alumni Vouch'
                      : 'Alumni Endorsement'}
                  {' • '}
                  {topEndorsement.alumName} ({topEndorsement.alumRole} @{' '}
                  {topEndorsement.alumCompany})
                </span>
              </button>

              {topEndorsement.vouchCode && (
                <VouchCodeBadge vouchCode={topEndorsement.vouchCode} compact stopPropagation />
              )}
            </div>

            <p className="text-xs italic text-[#09090B] dark:text-zinc-200 leading-relaxed">
              &ldquo;{topEndorsement.quote}&rdquo;
            </p>
          </div>
        )}

        {/* Tags + Source Host */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800/80 border border-[#E4E4E7] dark:border-zinc-700 px-2.5 py-0.5 text-[11px] font-medium text-[#09090B] dark:text-zinc-200"
              >
                {tag}
              </span>
            ))}
            {overflowCount > 0 && (
              <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-[#52525B] dark:text-zinc-400">
                +{overflowCount}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {repoHref && repoHref !== '#' && (
              <a
                href={repoHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#52525B] dark:text-zinc-400 hover:text-[#0891B2] dark:hover:text-[#22D3EE] transition-colors"
              >
                <GitBranch className="w-3 h-3" />
                <span>{repoHost || 'Source'}</span>
              </a>
            )}
            {liveHref && liveHref !== '#' && liveHost && (
              <a
                href={liveHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#52525B] dark:text-zinc-400 hover:text-[#059669] dark:hover:text-[#34D399] transition-colors"
              >
                <Layers className="w-3 h-3" />
                <span>{liveHost}</span>
              </a>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#E4E4E7] dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            {onToggleLike && (
              <button
                type="button"
                onClick={() => onToggleLike(item)}
                aria-pressed={isLiked}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold transition-colors ${
                  isLiked
                    ? 'border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2] dark:border-[#22D3EE] dark:bg-[#22D3EE]/15 dark:text-[#22D3EE]'
                    : 'border-[#E4E4E7] dark:border-zinc-700 text-[#52525B] dark:text-zinc-300 hover:border-[#0891B2]'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{item.likesCount}</span>
              </button>
            )}

            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(item)}
                aria-pressed={isSaved}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold transition-colors ${
                  isSaved
                    ? 'border-[#059669] bg-emerald-500/10 text-[#059669] dark:border-[#34D399] dark:bg-[#34D399]/15 dark:text-[#34D399]'
                    : 'border-[#E4E4E7] dark:border-zinc-700 text-[#52525B] dark:text-zinc-300 hover:border-[#059669]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onInspect && (
              <button
                type="button"
                onClick={() => onInspect(item)}
                className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-3.5 py-1 font-semibold text-[#09090B] dark:text-zinc-100 hover:border-[#0891B2] dark:hover:border-[#22D3EE] hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 transition-colors"
              >
                Inspect Build
              </button>
            )}
            {extraActions}
          </div>
        </div>
      </div>
    </article>
  );
}
