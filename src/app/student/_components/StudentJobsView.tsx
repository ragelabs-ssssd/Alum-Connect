'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Briefcase, CheckCircle2, FileCheck2, X } from 'lucide-react';
import { JobOpeningCard } from '@/components/shared/JobOpeningCard';
import type {
  JobApplicationDTO,
  JobPostingDTO,
  ProjectCardDTO,
} from '@/types/domain';

interface StudentJobsViewProps {
  jobs: JobPostingDTO[];
  applications: JobApplicationDTO[];
  myProjects: ProjectCardDTO[];
  onToggleSaveJob: (job: JobPostingDTO) => void;
  onApplyJob: (input: {
    jobId: string;
    showcaseProjectId?: string | null;
    note: string;
  }) => Promise<boolean>;
}

type JobFilter = 'All' | 'Full-Time' | 'Internship' | 'Paid Bounty' | 'Saved';

export function StudentJobsView({
  jobs,
  applications,
  myProjects,
  onToggleSaveJob,
  onApplyJob,
}: StudentJobsViewProps) {
  const [filter, setFilter] = useState<JobFilter>('All');
  const [applyingJob, setApplyingJob] = useState<JobPostingDTO | null>(null);
  const [showcaseProjectId, setShowcaseProjectId] = useState<string>(
    myProjects[0]?.id ?? '',
  );
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (filter === 'Saved') return Boolean(job.savedByMe);
      if (filter !== 'All' && job.jobType !== filter) return false;
      return true;
    });
  }, [jobs, filter]);

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;
    setSubmitting(true);
    try {
      const ok = await onApplyJob({
        jobId: applyingJob.id,
        showcaseProjectId: showcaseProjectId || null,
        note: note.trim(),
      });
      if (ok) {
        setApplyingJob(null);
        setNote('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Open Deals & Referrals */}
      <div className="lg:col-span-8 space-y-4">
        <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                'All',
                'Full-Time',
                'Internship',
                'Paid Bounty',
                'Saved',
              ] as const
            ).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  filter === tab
                    ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24]'
                    : 'border border-slate-200 dark:border-white/10 text-[#475569] dark:text-[#94A3B8]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
            {filteredJobs.length} openings
          </span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/15 bg-white/70 dark:bg-[#14171E]/60 p-10 text-center space-y-2">
            <Briefcase className="w-8 h-8 text-[#0891B2] dark:text-[#22D3EE] mx-auto" />
            <div className="text-sm font-bold">No openings in this filter</div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Try viewing all alumni-posted referrals, internships, and paid
              bounties.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <JobOpeningCard
                key={job.id}
                job={job}
                saved={job.savedByMe}
                onToggleSave={onToggleSaveJob}
                onApply={(selected) => {
                  setShowcaseProjectId(myProjects[0]?.id ?? '');
                  setApplyingJob(selected);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: Application Tracker */}
      <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
        <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-luma-title text-sm flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
              Application Tracker
            </h2>
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              {applications.length}
            </span>
          </div>

          {applications.length === 0 ? (
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Apply to any alumni referral or bounty with your showcase build to
              track progress here.
            </p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] p-3.5 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">
                        {app.jobTitle}
                      </div>
                      <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                        {app.company}
                      </div>
                    </div>
                    <span className="rounded-full bg-[#0891B2]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#0891B2] dark:text-[#22D3EE] shrink-0 uppercase">
                      {app.status.replace('_', ' ')}
                    </span>
                  </div>
                  {app.showcaseProjectTitle && (
                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      Showcase: {app.showcaseProjectTitle}
                    </div>
                  )}
                  {app.note && (
                    <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] line-clamp-2">
                      &ldquo;{app.note}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-slate-200/70 dark:border-white/10 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            Want stronger shortlist odds?{' '}
            <Link
              href="/share-project"
              className="font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
            >
              Ship a live build →
            </Link>
          </div>
        </div>
      </aside>

      {/* Portfolio-Backed Job Application Modal */}
      {applyingJob && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setApplyingJob(null);
          }}
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#121620] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-luma-title text-base">
                  Apply to {applyingJob.roleTitle}
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  {applyingJob.company} • {applyingJob.compensation}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label
                  htmlFor="apply-showcase"
                  className="block text-xs font-semibold"
                >
                  Attach Proof-of-Work Build
                </label>
                <select
                  id="apply-showcase"
                  value={showcaseProjectId}
                  onChange={(e) => setShowcaseProjectId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
                >
                  <option value="">Profile &amp; GitHub only</option>
                  {myProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.code} • {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="apply-note"
                  className="block text-xs font-semibold"
                >
                  Short Technical Pitch to {applyingJob.alumniName}
                </label>
                <textarea
                  id="apply-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Share relevant benchmarks, architecture links, or availability..."
                  className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setApplyingJob(null)}
                  className="rounded-full border border-slate-300 dark:border-white/20 px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
