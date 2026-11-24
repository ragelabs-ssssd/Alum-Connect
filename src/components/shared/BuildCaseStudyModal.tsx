'use client';

import React, { useEffect, useId } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Layers,
  Play,
  Users,
  Video,
  X,
} from 'lucide-react';
import type { FeedBuildItem } from '@/types/domain';
import {
  formatHostLabel,
  formatShortDate,
  getCoverGradient,
  getDomainBadgeClass,
} from './DomainUtils';
import { VouchCodeBadge } from './VerificationBadge';

export interface BuildCaseStudyModalProps {
  item: FeedBuildItem | null;
  open?: boolean;
  onClose: () => void;
  onAuthorClick?: (authorId: string, authorName: string) => void;
  onAlumClick?: (alumId: string, alumName: string) => void;
  actionSlot?: React.ReactNode;
}

/**
 * Accessible detail modal inspecting a full ProjectCardDTO or PaperDTO build story,
 * squad contributors, demo/pitch links, and alumni endorsements/vouches.
 */
export function BuildCaseStudyModal({
  item,
  open,
  onClose,
  onAuthorClick,
  onAlumClick,
  actionSlot,
}: BuildCaseStudyModalProps) {
  const headingId = useId();
  const isOpen = (open ?? Boolean(item)) && Boolean(item);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !item) {
    return null;
  }

  const coverGradient = getCoverGradient(item.id || item.code);
  const combinedTags = Array.from(new Set([...(item.techStack ?? []), ...(item.tags ?? [])]));

  const liveHref = item.isPaper ? item.liveDemoUrl : item.liveUrl;
  const repoHref = item.isPaper ? item.codeRepoUrl : item.githubUrl;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="w-full max-w-2xl max-h-[90vh] rounded-3xl border border-[rgba(100,116,139,0.25)] dark:border-[rgba(226,232,240,0.18)] bg-white dark:bg-[#0E1118] shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header Banner */}
        <div
          className={`relative overflow-hidden bg-gradient-to-br ${coverGradient} p-5 sm:p-6 text-white shrink-0`}
        >
          {item.coverImage && (
            <img
              src={item.coverImage}
              alt={item.title}
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

          <div className="relative z-10 flex items-start justify-between gap-3">
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold backdrop-blur-md ${getDomainBadgeClass(
                    item.domain
                  )}`}
                >
                  {item.domain}
                </span>
                <span className="rounded-full bg-white/15 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-mono text-zinc-100">
                  {item.code}
                </span>
                {item.isPaper ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/25 border border-indigo-300/30 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-100">
                    <BookOpen className="w-3 h-3" /> {item.paperStatus} • {item.venue}
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-300/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-100">
                    {item.collaborationMode} • {item.hostingPlatform}
                  </span>
                )}
              </div>

              <h2
                id={headingId}
                className="font-luma-title text-lg sm:text-xl leading-snug tracking-tight text-white"
              >
                {item.title}
              </h2>
              {item.subtitle && (
                <p className="text-xs sm:text-sm text-zinc-200/90 leading-relaxed">
                  {item.subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close build inspection modal"
              className="shrink-0 rounded-full bg-white/15 hover:bg-white/25 p-2 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-5">
          {/* Case Study Story */}
          <section className="space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
              {item.isPaper ? 'Research Abstract & Contributions' : 'Engineering Case Study'}
            </h3>
            <p className="text-xs sm:text-sm text-[#09090B] dark:text-zinc-200 leading-relaxed whitespace-pre-line">
              {item.story}
            </p>
          </section>

          {/* Squad / Authors */}
          <section className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5]/70 dark:bg-zinc-900/70 p-4 space-y-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
              {item.isPaper ? 'Research Authors' : `Squad Contributors (${item.teamSize})`}
            </h3>

            {item.isPaper ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onAuthorClick?.(item.leadAuthorId, item.leadAuthorName)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors text-left"
                >
                  <div>
                    <div className="font-bold text-[#09090B] dark:text-white">
                      {item.leadAuthorName}
                    </div>
                    <div className="text-[10px] text-[#52525B] dark:text-zinc-400 font-mono">
                      Reg {item.leadAuthorRegNo} • {item.leadAuthorYearBranch}
                    </div>
                  </div>
                </button>
                {item.coAuthorName && (
                  <div className="inline-flex items-center gap-2 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs">
                    <div>
                      <div className="font-bold text-[#09090B] dark:text-white">
                        {item.coAuthorName}
                      </div>
                      {item.coAuthorRegNo && (
                        <div className="text-[10px] text-[#52525B] dark:text-zinc-400 font-mono">
                          Reg {item.coAuthorRegNo}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(item.contributors.length > 0
                  ? item.contributors
                  : [
                      {
                        userId: item.leadId,
                        name: item.leadName,
                        regNo: item.leadRegNo,
                        academicYear: item.academicYears,
                      },
                    ]
                ).map((member) => (
                  <button
                    key={`${member.regNo}-${member.name}`}
                    type="button"
                    onClick={() =>
                      onAuthorClick?.(member.userId || item.leadId, member.name)
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors text-left"
                  >
                    <div>
                      <div className="font-bold text-[#09090B] dark:text-white">{member.name}</div>
                      <div className="text-[10px] text-[#52525B] dark:text-zinc-400 font-mono">
                        {member.regNo} • {member.academicYear}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Links: Live Demo, GitHub, Preprint, 2-min Demo & Pitch Videos */}
          <section className="space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
              Artifacts &amp; Walkthroughs
            </h3>
            <div className="flex flex-wrap gap-2">
              {liveHref && liveHref !== '#' && (
                <a
                  href={liveHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] px-3.5 py-1.5 text-xs font-semibold transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo ({formatHostLabel(liveHref) || 'Open'})</span>
                </a>
              )}

              {repoHref && repoHref !== '#' && (
                <a
                  href={repoHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-[#0891B2] dark:hover:border-[#22D3EE] px-3.5 py-1.5 text-xs font-semibold text-[#09090B] dark:text-zinc-100 transition-colors"
                >
                  <GitBranch className="w-3.5 h-3.5" />
                  <span>Codebase ({formatHostLabel(repoHref) || 'Repo'})</span>
                </a>
              )}

              {item.isPaper && item.preprintUrl && item.preprintUrl !== '#' && (
                <a
                  href={item.preprintUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/35 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 px-3.5 py-1.5 text-xs font-semibold hover:bg-indigo-500/20 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Read Preprint</span>
                </a>
              )}

              {!item.isPaper && item.demoVideoUrl && item.demoVideoUrl !== '#' && (
                <a
                  href={item.demoVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#0891B2]/35 dark:border-[#22D3EE]/35 bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 text-[#0891B2] dark:text-[#22D3EE] px-3.5 py-1.5 text-xs font-semibold hover:brightness-110 transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>2-Min Demo Video</span>
                </a>
              )}

              {!item.isPaper && item.pitchVideoUrl && item.pitchVideoUrl !== '#' && (
                <a
                  href={item.pitchVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 dark:border-[#34D399]/35 bg-emerald-500/10 dark:bg-[#34D399]/15 text-emerald-700 dark:text-[#34D399] px-3.5 py-1.5 text-xs font-semibold hover:brightness-110 transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Founder Pitch Video</span>
                </a>
              )}
            </div>
          </section>

          {/* Tech Stack */}
          {combinedTags.length > 0 && (
            <section className="space-y-2">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                Stack &amp; Topics
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {combinedTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 px-2.5 py-0.5 text-[11px] font-medium text-[#09090B] dark:text-zinc-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Endorsements & Vouches */}
          <section className="space-y-2.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
              Alumni Endorsements &amp; Roasts ({item.endorsements.length})
            </h3>

            {item.endorsements.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E4E4E7] dark:border-zinc-800 p-4 text-xs text-[#52525B] dark:text-zinc-400">
                No alumni endorsements or architecture roasts yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {item.endorsements.map((end) => (
                  <div
                    key={end.id}
                    className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5]/70 dark:bg-zinc-900/75 p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onAlumClick?.(end.alumniUserId, end.alumName)}
                        className="flex items-center gap-2 text-xs font-bold text-[#0891B2] dark:text-[#22D3EE] hover:underline text-left"
                      >
                        {end.alumAvatar && (
                          <img
                            src={end.alumAvatar}
                            alt={end.alumName}
                            className="h-6 w-6 rounded-full object-cover border border-[#E4E4E7] dark:border-zinc-700 shrink-0"
                          />
                        )}
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399] shrink-0" />
                        <span>
                          {end.alumName} • {end.alumRole} @ {end.alumCompany} (&apos;
                          {String(end.alumBatch).slice(-2)})
                        </span>
                      </button>

                      <div className="flex items-center gap-2">
                        {end.vouchCode && <VouchCodeBadge vouchCode={end.vouchCode} />}
                        <span className="text-[10px] text-[#52525B] dark:text-zinc-400">
                          {formatShortDate(end.createdAt)}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#09090B] dark:text-zinc-200 leading-relaxed italic">
                      &ldquo;{end.quote}&rdquo;
                    </p>

                    {end.certifiedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {end.certifiedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-[#34D399]"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Footer with Optional Action Slot */}
        <div className="border-t border-[#E4E4E7] dark:border-zinc-800 px-5 sm:px-6 py-3.5 bg-[#F4F4F5]/60 dark:bg-[#0B0D12] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex flex-wrap items-center gap-2">{actionSlot}</div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-[#09090B] dark:text-zinc-100 hover:border-[#0891B2] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
