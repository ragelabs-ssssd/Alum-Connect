'use client';

import React, { useMemo, useState } from 'react';
import { Briefcase, Calendar, CheckCircle2, Plus, XCircle } from 'lucide-react';
import { formatShortDate } from '@/components/shared/DomainUtils';
import { JobOpeningCard } from '@/components/shared/JobOpeningCard';
import type { CoffeeChatDTO, JobPostingDTO } from '@/types/domain';

export interface AlumniJobsManagerViewProps {
  currentAlumId: string;
  isVerified: boolean;
  jobs: JobPostingDTO[];
  coffeeChats: CoffeeChatDTO[];
  onOpenPostJobModal: () => void;
  onManageApplicants: (job: JobPostingDTO) => void;
  onAlumniClick: (alumniId: string, alumniName: string) => void;
  onStudentClick: (studentId: string, studentName: string) => void;
  onRespondCoffeeChat: (
    coffeeChatId: string,
    decision: 'accepted' | 'declined'
  ) => Promise<void>;
}

/**
 * Alumni Hiring & Coffee-Chat Hub: lists openings posted by the alumnus (with
 * Applicants drawer triggers), network openings, and mentorship coffee-chat queue.
 */
export function AlumniJobsManagerView({
  currentAlumId,
  isVerified,
  jobs,
  coffeeChats,
  onOpenPostJobModal,
  onManageApplicants,
  onAlumniClick,
  onStudentClick,
  onRespondCoffeeChat,
}: AlumniJobsManagerViewProps) {
  const [scope, setScope] = useState<'mine' | 'all'>('mine');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('All');
  const [respondingId, setRespondingId] = useState<string | null>(null);

  const myJobs = useMemo(
    () => jobs.filter((j) => j.postedByAlumniId === currentAlumId),
    [jobs, currentAlumId]
  );

  const visibleJobs = useMemo(() => {
    const base = scope === 'mine' ? myJobs : jobs;
    if (jobTypeFilter === 'All') return base;
    return base.filter((j) => j.jobType === jobTypeFilter);
  }, [jobs, jobTypeFilter, myJobs, scope]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-[rgba(226,232,240,0.18)] bg-[#0C0F16] text-white p-6 space-y-3 shadow-md">
        <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-transparent blur-3xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-0.5 text-[11px] font-semibold text-[#34D399]">
              <Briefcase className="w-3.5 h-3.5" />
              <span>REFERRAL &amp; HIRING PIPELINE</span>
            </span>
            <h1 className="font-luma-title text-xl sm:text-2xl tracking-tight">
              Post Openings &amp; Review Applicants
            </h1>
            <p className="text-xs text-zinc-300 max-w-xl">
              Publish direct full-time roles, internships, or paid engineering bounties and review portfolio-backed student applications.
            </p>
          </div>

          <button
            type="button"
            disabled={!isVerified}
            onClick={onOpenPostJobModal}
            className="inline-flex items-center gap-1.5 rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] hover:brightness-110 disabled:opacity-45 disabled:cursor-not-allowed text-[#041E24] px-4 py-2 text-xs font-semibold transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isVerified ? 'Post Opening' : 'Verification Required'}</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setScope('mine')}
            className={`rounded-full px-3 py-1 transition-colors ${
              scope === 'mine'
                ? 'bg-[#0F172A] text-white dark:bg-[#22D3EE] dark:text-[#041E24]'
                : 'text-[#52525B] dark:text-zinc-400'
            }`}
          >
            My Openings ({myJobs.length})
          </button>
          <button
            type="button"
            onClick={() => setScope('all')}
            className={`rounded-full px-3 py-1 transition-colors ${
              scope === 'all'
                ? 'bg-[#0F172A] text-white dark:bg-[#22D3EE] dark:text-[#041E24]'
                : 'text-[#52525B] dark:text-zinc-400'
            }`}
          >
            All Campus Roles ({jobs.length})
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Full-Time', 'Internship', 'Paid Bounty'] as const).map((jt) => (
            <button
              key={jt}
              type="button"
              onClick={() => setJobTypeFilter(jt)}
              className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${
                jobTypeFilter === jt
                  ? 'bg-[#0F172A] text-white border-[#0F172A] dark:bg-zinc-100 dark:text-zinc-950'
                  : 'bg-white dark:bg-zinc-900 text-[#52525B] dark:text-zinc-400 border-[#E4E4E7] dark:border-zinc-800'
              }`}
            >
              {jt}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      {visibleJobs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[#E4E4E7] dark:border-zinc-800 p-8 text-center space-y-2.5">
          <Briefcase className="w-7 h-7 mx-auto text-[#0891B2] dark:text-[#22D3EE]" />
          <p className="text-sm font-semibold">
            {scope === 'mine'
              ? 'You have not posted any openings yet.'
              : 'No openings match this role type.'}
          </p>
          {scope === 'mine' && isVerified && (
            <button
              type="button"
              onClick={onOpenPostJobModal}
              className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-4 py-1.5 text-xs font-semibold"
            >
              + Create Your First Opening
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {visibleJobs.map((job) => {
            const isOwner = job.postedByAlumniId === currentAlumId;
            return (
              <JobOpeningCard
                key={job.id}
                job={job}
                isOwner={isOwner}
                onAlumniClick={onAlumniClick}
                onManageApplicants={isOwner ? onManageApplicants : undefined}
              />
            );
          })}
        </div>
      )}

      {/* Mentorship Coffee Chat Requests */}
      <section className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-5 space-y-3.5 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-luma-title text-sm sm:text-base flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
            <span>15-Minute Coffee Chat Requests ({coffeeChats.length})</span>
          </h2>
        </div>

        {coffeeChats.length === 0 ? (
          <p className="text-xs text-[#52525B] dark:text-zinc-400">
            No student coffee-chat requests at the moment.
          </p>
        ) : (
          <div className="space-y-2.5">
            {coffeeChats.map((chat) => (
              <div
                key={chat.id}
                className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5]/70 dark:bg-zinc-900/75 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onStudentClick(chat.studentUserId, chat.studentName)}
                      className="text-xs font-bold text-[#0F172A] dark:text-white hover:text-[#0891B2] dark:hover:text-[#22D3EE] hover:underline"
                    >
                      {chat.studentName}
                    </button>
                    <span className="text-[11px] text-[#52525B] dark:text-zinc-400">
                      {chat.studentMeta}
                    </span>
                    <span className="text-[10px] text-[#52525B] dark:text-zinc-500">
                      • {formatShortDate(chat.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-[#09090B] dark:text-zinc-200">
                    &ldquo;{chat.topic}&rdquo;
                  </p>
                  {chat.projectTitle && (
                    <p className="text-[11px] text-[#0891B2] dark:text-[#22D3EE] font-medium">
                      Linked Build: {chat.projectTitle}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {chat.status === 'pending' ? (
                    isVerified ? (
                      <>
                        <button
                          type="button"
                          disabled={respondingId === chat.id}
                          onClick={async () => {
                            setRespondingId(chat.id);
                            try {
                              await onRespondCoffeeChat(chat.id, 'accepted');
                            } finally {
                              setRespondingId(null);
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-[11px] font-semibold disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Accept
                        </button>
                        <button
                          type="button"
                          disabled={respondingId === chat.id}
                          onClick={async () => {
                            setRespondingId(chat.id);
                            try {
                              await onRespondCoffeeChat(chat.id, 'declined');
                            } finally {
                              setRespondingId(null);
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-3 py-1 text-[11px] font-semibold text-[#52525B] dark:text-zinc-300 hover:border-rose-500 hover:text-rose-600 disabled:opacity-50"
                        >
                          <XCircle className="w-3 h-3" /> Decline
                        </button>
                      </>
                    ) : (
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                        Pending Verification
                      </span>
                    )
                  ) : (
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${
                        chat.status === 'accepted'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-[#34D399]'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                      }`}
                    >
                      {chat.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
