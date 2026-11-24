'use client';

import React from 'react';
import Link from 'next/link';
import { Award, Clock, ShieldCheck, ShieldX } from 'lucide-react';
import type { VerificationStatus } from '@/types/domain';

interface AlumniVerificationBadgeProps {
  status: VerificationStatus;
  compact?: boolean;
  showUnverified?: boolean;
  className?: string;
}

/**
 * Renders the verification state of an alumni profile using AlmaConnect's
 * Liquid Chrome Cyan/Emerald verified shield and contextual pending/rejected states.
 */
export function AlumniVerificationBadge({
  status,
  compact = false,
  showUnverified = false,
  className = '',
}: AlumniVerificationBadgeProps) {
  if (status === 'unverified' && !showUnverified) {
    return null;
  }

  if (status === 'verified') {
    return (
      <span
        title="Verified ITER Alumnus (Work Email / Dean T&P Confirmed)"
        className={`inline-flex items-center gap-1 rounded-full border border-[#0891B2]/35 dark:border-[#22D3EE]/35 bg-[linear-gradient(90deg,rgba(8,145,178,0.12)_0%,rgba(5,150,105,0.12)_100%)] dark:bg-[linear-gradient(90deg,rgba(34,211,238,0.16)_0%,rgba(52,211,153,0.16)_100%)] px-2 py-0.5 text-[10px] font-semibold text-[#0E7490] dark:text-[#22D3EE] shrink-0 ${className}`}
      >
        <ShieldCheck className="w-3 h-3 text-[#059669] dark:text-[#34D399] shrink-0" />
        <span>{compact ? 'Verified' : 'Verified Alumnus'}</span>
      </span>
    );
  }

  if (status === 'pending_review') {
    return (
      <span
        title="Verification pending corporate email or Dean T&P approval"
        className={`inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-400/35 dark:bg-amber-400/15 dark:text-amber-300 shrink-0 ${className}`}
      >
        <Clock className="w-3 h-3 shrink-0" />
        <span>{compact ? 'Pending' : 'Pending Review'}</span>
      </span>
    );
  }

  if (status === 'rejected') {
    return (
      <span
        title="Alumni verification rejected by Dean T&P"
        className={`inline-flex items-center gap-1 rounded-full border border-rose-500/35 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:border-rose-400/35 dark:bg-rose-400/15 dark:text-rose-300 shrink-0 ${className}`}
      >
        <ShieldX className="w-3 h-3 shrink-0" />
        <span>{compact ? 'Rejected' : 'Verification Rejected'}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 shrink-0 ${className}`}
    >
      <span>Unverified</span>
    </span>
  );
}

interface VouchCodeBadgeProps {
  vouchCode: string;
  compact?: boolean;
  className?: string;
  stopPropagation?: boolean;
}

/**
 * Clickable cryptographic Vouch Certificate badge routing to /vouch/[code].
 */
export function VouchCodeBadge({
  vouchCode,
  compact = false,
  className = '',
  stopPropagation = false,
}: VouchCodeBadgeProps) {
  if (!vouchCode) return null;

  return (
    <Link
      href={`/vouch/${encodeURIComponent(vouchCode)}`}
      onClick={(e) => {
        if (stopPropagation) {
          e.stopPropagation();
        }
      }}
      title={`Inspect verified vouch certificate ${vouchCode}`}
      className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 dark:border-[#34D399]/35 bg-emerald-500/10 dark:bg-[#34D399]/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-[#34D399] hover:border-[#0891B2] dark:hover:border-[#22D3EE] hover:bg-emerald-500/15 transition-colors shrink-0 ${className}`}
    >
      <Award className="w-3 h-3 shrink-0" />
      {!compact && <span className="uppercase tracking-wider text-[9px] opacity-80">Vouch</span>}
      <span className="font-luma-title tracking-tight">{vouchCode}</span>
    </Link>
  );
}
