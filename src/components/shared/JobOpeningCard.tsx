'use client';

import React from 'react';
import {
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  MapPin,
  Users,
} from 'lucide-react';
import type { JobApplicationDTO, JobPostingDTO } from '@/types/domain';
import { formatShortDate } from './DomainUtils';
import { AlumniVerificationBadge } from './VerificationBadge';

export interface JobOpeningCardProps {
  job: JobPostingDTO;
  saved?: boolean;
  isOwner?: boolean;
  applying?: boolean;
  onAlumniClick?: (alumniId: string, alumniName: string) => void;
  onToggleSave?: (job: JobPostingDTO) => void;
  onApply?: (job: JobPostingDTO) => void;
  onManageApplicants?: (job: JobPostingDTO) => void;
  className?: string;
}

const JOB_TYPE_STYLES: Record<JobPostingDTO['jobType'], string> = {
  'Full-Time':
    'border-[#0891B2]/30 bg-[#0891B2]/10 text-[#0891B2] dark:border-[#22D3EE]/35 dark:bg-[#22D3EE]/15 dark:text-[#22D3EE]',
  Internship:
    'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:border-[#34D399]/35 dark:bg-[#34D399]/15 dark:text-[#34D399]',
  'Paid Bounty':
    'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/35 dark:bg-amber-400/15 dark:text-amber-300',
};

const APPLICATION_STATUS_META: Record<
  JobApplicationDTO['status'],
  { label: string; className: string }
> = {
  applied: {
    label: 'Applied ✓',
    className:
      'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:bg-[#34D399]/15 dark:text-[#34D399] dark:border-[#34D399]/30',
  },
  under_review: {
    label: 'Under Review',
    className:
      'bg-[#0891B2]/15 text-[#0891B2] border-[#0891B2]/30 dark:bg-[#22D3EE]/15 dark:text-[#22D3EE] dark:border-[#22D3EE]/30',
  },
  shortlisted: {
    label: 'Shortlisted ★',
    className:
      'bg-indigo-500/15 text-indigo-700 border-indigo-500/30 dark:bg-indigo-400/15 dark:text-indigo-300 dark:border-indigo-400/30',
  },
  offered: {
    label: 'Offer Extended',
    className:
      'bg-emerald-500/20 text-emerald-800 border-emerald-500/40 dark:bg-emerald-400/20 dark:text-emerald-200 dark:border-emerald-400/40',
  },
  rejected: {
    label: 'Not Selected',
    className:
      'bg-rose-500/10 text-rose-700 border-rose-500/30 dark:bg-rose-400/15 dark:text-rose-300 dark:border-rose-400/30',
  },
};

/**
 * Compact hiring card for JobPostingDTO supporting both Student apply/save flows
 * and Alumni owner applicant management.
 */
export function JobOpeningCard({
  job,
  saved,
  isOwner = false,
  applying = false,
  onAlumniClick,
  onToggleSave,
  onApply,
  onManageApplicants,
  className = '',
}: JobOpeningCardProps) {
  const isSaved = saved ?? Boolean(job.savedByMe);
  const isApplied = Boolean(job.appliedByMe || job.myApplicationStatus);
  const appMeta = job.myApplicationStatus
    ? APPLICATION_STATUS_META[job.myApplicationStatus]
    : APPLICATION_STATUS_META.applied;

  return (
    <article
      className={`rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-5 space-y-3.5 shadow-2xs hover:border-[#0891B2]/50 dark:hover:border-[#22D3EE]/40 transition-colors ${className}`}
    >
      {/* Top Header: Company, Job Type, Role & Compensation */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 font-bold text-[#0891B2] dark:text-[#22D3EE]">
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span>{job.company}</span>
            </span>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${JOB_TYPE_STYLES[job.jobType]}`}
            >
              {job.jobType}
            </span>
            {job.status === 'closed' && (
              <span className="rounded-full bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400">
                Closed
              </span>
            )}
          </div>
          <h3 className="font-luma-title text-base leading-snug text-[#09090B] dark:text-white">
            {job.roleTitle}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="rounded-full bg-emerald-500/10 border border-emerald-500/25 dark:border-[#34D399]/30 px-2.5 py-1 text-xs font-bold text-[#059669] dark:text-[#34D399]">
            {job.compensation}
          </span>
          {onToggleSave && (
            <button
              type="button"
              onClick={() => onToggleSave(job)}
              aria-pressed={isSaved}
              aria-label={isSaved ? 'Remove job from saved' : 'Save job'}
              className={`rounded-full border p-1.5 transition-colors ${
                isSaved
                  ? 'border-[#0891B2] bg-[#0891B2]/10 text-[#0891B2] dark:border-[#22D3EE] dark:bg-[#22D3EE]/15 dark:text-[#22D3EE]'
                  : 'border-[#E4E4E7] dark:border-zinc-700 text-[#52525B] dark:text-zinc-400 hover:border-[#0891B2]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Meta Strip: Location, Slots, Deadline, Eligibility */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#52525B] dark:text-zinc-400">
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span>{job.location}</span>
        </span>
        <span className="inline-flex items-center gap-1">
          <Users className="w-3.5 h-3.5 shrink-0" />
          <span>
            {job.slots} {job.slots === 1 ? 'slot' : 'slots'}
          </span>
        </span>
        {job.deadline && (
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>Apply by {formatShortDate(job.deadline)}</span>
          </span>
        )}
        {job.eligibility && (
          <span className="inline-flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 shrink-0" />
            <span>{job.eligibility}</span>
          </span>
        )}
      </div>

      {/* Job Description */}
      <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-300 leading-relaxed line-clamp-3">
        {job.jdText}
      </p>

      {/* Required Skills */}
      {job.skillsRequired.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skillsRequired.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800/80 border border-[#E4E4E7] dark:border-zinc-700 px-2.5 py-0.5 text-[11px] font-medium text-[#09090B] dark:text-zinc-200"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Footer: Verified Alumni Poster + Action */}
      <div className="pt-3 border-t border-[#E4E4E7] dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <button
          type="button"
          onClick={() => onAlumniClick?.(job.postedByAlumniId, job.alumniName)}
          className="inline-flex items-center gap-2 min-w-0 text-left hover:text-[#0891B2] dark:hover:text-[#22D3EE] transition-colors"
        >
          {job.alumniAvatar ? (
            <img
              src={job.alumniAvatar}
              alt={job.alumniName}
              className="h-6 w-6 rounded-full object-cover border border-[#E4E4E7] dark:border-zinc-700 shrink-0"
            />
          ) : (
            <span className="h-6 w-6 rounded-full bg-[#0891B2]/15 text-[#0891B2] dark:text-[#22D3EE] font-bold text-[10px] flex items-center justify-center shrink-0">
              {job.alumniName.slice(0, 2).toUpperCase()}
            </span>
          )}
          <span className="truncate text-[#52525B] dark:text-zinc-400">
            <strong className="text-[#09090B] dark:text-zinc-100 hover:underline">
              {job.alumniName}
            </strong>{' '}
            • {job.alumniRole}
          </span>
          <AlumniVerificationBadge
            status={job.alumniVerified ? 'verified' : 'pending_review'}
            compact
          />
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {isOwner || onManageApplicants ? (
            <button
              type="button"
              onClick={() => onManageApplicants?.(job)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] px-3.5 py-1.5 text-xs font-semibold transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Manage Applicants ({job.applicationsCount})</span>
            </button>
          ) : isApplied ? (
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${appMeta.className}`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{appMeta.label}</span>
            </span>
          ) : (
            <button
              type="button"
              disabled={job.status === 'closed' || applying || !onApply}
              onClick={() => onApply?.(job)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] disabled:opacity-50 disabled:cursor-not-allowed text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:hover:brightness-110 dark:text-[#041E24] px-4 py-1.5 text-xs font-semibold transition-all shadow-2xs"
            >
              {applying
                ? 'Submitting...'
                : job.status === 'closed'
                  ? 'Applications Closed'
                  : 'Apply with Portfolio'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
