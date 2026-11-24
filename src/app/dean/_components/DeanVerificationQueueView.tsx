'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  ShieldCheck,
  ShieldX,
  XCircle,
} from 'lucide-react';
import { formatShortDate } from '@/components/shared/DomainUtils';
import type { VerificationRequestDTO } from '@/types/domain';

interface DeanVerificationQueueViewProps {
  requests: VerificationRequestDTO[];
  isPreviewMode: boolean;
  onReview: (input: {
    requestId: string;
    decision: 'approved' | 'rejected';
    reviewNote?: string;
  }) => Promise<void>;
}

export function DeanVerificationQueueView({
  requests,
  isPreviewMode,
  onReview,
}: DeanVerificationQueueViewProps) {
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return requests;
    return requests.filter((r) => r.status === statusFilter);
  }, [requests, statusFilter]);

  const pendingCount = useMemo(
    () => requests.filter((r) => r.status === 'pending').length,
    [requests],
  );

  const handleDecision = async (
    requestId: string,
    decision: 'approved' | 'rejected',
  ) => {
    setBusyId(requestId);
    try {
      await onReview({
        requestId,
        decision,
        reviewNote: notesById[requestId]?.trim() || undefined,
      });
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Status Filters */}
      <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-luma-title text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
            Alumni Verification Queue
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            {pendingCount} pending review • Approving unlocks Vouch Cards, job
            postings, and mentorship chats.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-all cursor-pointer ${
                statusFilter === tab
                  ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24]'
                  : 'border border-slate-200 dark:border-white/10 text-[#475569] dark:text-[#94A3B8]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Queue List */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/15 bg-white/70 dark:bg-[#14171E]/60 p-10 text-center space-y-2">
          <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
          <div className="text-sm font-bold">
            No verification requests in &ldquo;{statusFilter}&rdquo;
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            New alumni sign-ups without a matching corporate work email appear
            here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <article
              key={req.id}
              className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  {req.alumniAvatar ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={req.alumniAvatar}
                      alt={req.alumniName}
                      className="h-12 w-12 rounded-2xl object-cover border border-slate-200 dark:border-white/15 shrink-0"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-2xl bg-[#0891B2]/15 text-[#0891B2] flex items-center justify-center font-bold shrink-0">
                      {req.alumniName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/u/${encodeURIComponent(req.alumniUserId)}`}
                        className="font-luma-title text-sm hover:text-[#0891B2] dark:hover:text-[#22D3EE]"
                      >
                        {req.alumniName}
                      </Link>
                      <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold">
                        Batch &apos;{String(req.batchYear).slice(-2)}
                      </span>
                      {req.domainAutoMatched ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-3 h-3" /> Domain Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                          <Clock className="w-3 h-3" /> Manual Verification
                        </span>
                      )}
                    </div>

                    <div className="text-xs font-semibold text-[#334155] dark:text-zinc-300">
                      {req.designation} @ {req.company}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        Login: {req.alumniEmail}
                      </span>
                      {req.workEmail && (
                        <span className="inline-flex items-center gap-1 text-[#0891B2] dark:text-[#22D3EE]">
                          Work: {req.workEmail}
                        </span>
                      )}
                      {req.linkedinUrl && (
                        <a
                          href={req.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-[#0A66C2] dark:text-sky-400 hover:underline"
                        >
                          LinkedIn <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <span>Submitted {formatShortDate(req.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase shrink-0 ${
                    req.status === 'approved'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                      : req.status === 'rejected'
                        ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                  }`}
                >
                  {req.status}
                </span>
              </div>

              {req.proofNote && (
                <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/70 dark:border-white/10 px-4 py-2.5 text-xs text-[#334155] dark:text-zinc-300">
                  <span className="font-semibold">Alumni Proof Note:</span>{' '}
                  {req.proofNote}
                </div>
              )}

              {req.status === 'pending' ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-1">
                  <input
                    type="text"
                    value={notesById[req.id] ?? ''}
                    onChange={(e) =>
                      setNotesById((prev) => ({
                        ...prev,
                        [req.id]: e.target.value,
                      }))
                    }
                    placeholder="Optional Dean review note (visible to alumnus)..."
                    className="flex-1 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3.5 py-2 text-xs"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={busyId === req.id || isPreviewMode}
                      onClick={() => handleDecision(req.id, 'rejected')}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/35 bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                    <button
                      type="button"
                      disabled={busyId === req.id || isPreviewMode}
                      onClick={() => handleDecision(req.id, 'approved')}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {busyId === req.id ? 'Saving...' : 'Approve Alumni'}
                    </button>
                  </div>
                </div>
              ) : (
                req.reviewNote && (
                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1.5">
                    {req.status === 'approved' ? (
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <ShieldX className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    <span>Review Note: {req.reviewNote}</span>
                  </div>
                )
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
