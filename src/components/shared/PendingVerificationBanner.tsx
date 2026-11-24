'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, ShieldAlert, ArrowUpRight } from 'lucide-react';
import type { VerificationStatus } from '@/types/domain';
import { AlumniVerificationBadge } from './VerificationBadge';

interface PendingVerificationBannerProps {
  status: VerificationStatus;
  workEmail?: string | null;
  company?: string | null;
  reviewNote?: string | null;
  onResubmit?: () => void;
  supportHref?: string;
  className?: string;
}

/**
 * Contextual banner shown to alumni whose accounts are awaiting corporate work-email
 * or Dean T&P approval (or were rejected), explaining read-only feed access.
 */
export function PendingVerificationBanner({
  status,
  workEmail,
  company,
  reviewNote,
  onResubmit,
  supportHref,
  className = '',
}: PendingVerificationBannerProps) {
  if (status !== 'pending_review' && status !== 'rejected') {
    return null;
  }

  const isRejected = status === 'rejected';

  return (
    <div
      role="status"
      className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 backdrop-blur-md transition-colors ${
        isRejected
          ? 'border-rose-500/35 bg-rose-50/90 dark:border-rose-400/30 dark:bg-rose-950/30 text-rose-950 dark:text-rose-100'
          : 'border-amber-500/35 bg-amber-50/90 dark:border-amber-400/30 dark:bg-[#14171E]/95 text-amber-950 dark:text-zinc-100'
      } ${className}`}
    >
      <div
        className={`pointer-events-none absolute top-0 left-0 right-0 h-0.5 ${
          isRejected
            ? 'bg-gradient-to-r from-rose-500 to-amber-500'
            : 'bg-gradient-to-r from-amber-400 via-[#22D3EE] to-[#34D399]'
        }`}
      />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className={`mt-0.5 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 border ${
              isRejected
                ? 'bg-rose-500/15 border-rose-500/30 text-rose-600 dark:text-rose-300'
                : 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-300'
            }`}
          >
            {isRejected ? <ShieldAlert className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          </div>

          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-luma-title text-xs sm:text-sm tracking-tight">
                {isRejected
                  ? 'Alumni Verification Requires Attention'
                  : 'Read-Only Alumni Preview Mode'}
              </h2>
              <AlumniVerificationBadge status={status} compact />
            </div>

            <p className="text-xs leading-relaxed text-zinc-700 dark:text-zinc-300">
              {isRejected ? (
                <>
                  Your verification request{company ? ` for ${company}` : ''} was not approved
                  yet. You have read-only access to browse student builds and research papers.
                  {reviewNote ? ` Reviewer note: "${reviewNote}"` : ''}
                </>
              ) : (
                <>
                  You currently have <strong className="font-semibold">read-only feed access</strong>{' '}
                  to inspect student builds and research preprints. Posting referral openings,
                  issuing Vouch certificates, and endorsing talent unlock automatically once your
                  {workEmail ? ` corporate work email (${workEmail})` : ' corporate work email'} or{' '}
                  <strong className="font-semibold">Dean T&amp;P approval</strong> completes.
                </>
              )}
            </p>
          </div>
        </div>

        {(onResubmit || supportHref) && (
          <div className="flex items-center gap-2 shrink-0 sm:pl-2">
            {onResubmit && (
              <button
                type="button"
                onClick={onResubmit}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] px-3.5 py-1.5 text-xs font-semibold transition-all"
              >
                {isRejected ? 'Resubmit Proof' : 'Update Work Email'}
              </button>
            )}
            {supportHref && (
              <Link
                href={supportHref}
                className="inline-flex items-center gap-1 rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-semibold hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors"
              >
                Details <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
