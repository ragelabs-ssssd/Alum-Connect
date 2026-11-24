'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import { formatShortDate } from '@/components/shared/DomainUtils';
import type {
  InstitutionalAuditLogDTO,
  PlacementOfferDTO,
} from '@/types/domain';

interface DeanPlacementsViewProps {
  offers: PlacementOfferDTO[];
  auditLogs: InstitutionalAuditLogDTO[];
  isPreviewMode: boolean;
  onVerifyOffer: (offerId: string) => Promise<void>;
  onCreateAuditLog: (input: {
    category: InstitutionalAuditLogDTO['category'];
    title: string;
    impact: string;
  }) => Promise<boolean>;
}

export function DeanPlacementsView({
  offers,
  auditLogs,
  isPreviewMode,
  onVerifyOffer,
  onCreateAuditLog,
}: DeanPlacementsViewProps) {
  const [offerFilter, setOfferFilter] = useState<'All' | 'PPO' | 'Internship'>(
    'All',
  );
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const [auditCategory, setAuditCategory] =
    useState<InstitutionalAuditLogDTO['category']>('offer_verified');
  const [auditTitle, setAuditTitle] = useState('');
  const [auditImpact, setAuditImpact] = useState('');
  const [submittingAudit, setSubmittingAudit] = useState(false);

  const filteredOffers = useMemo(() => {
    if (offerFilter === 'All') return offers;
    return offers.filter((o) => o.offerType === offerFilter);
  }, [offers, offerFilter]);

  const handleVerify = async (offerId: string) => {
    setVerifyingId(offerId);
    try {
      await onVerifyOffer(offerId);
    } finally {
      setVerifyingId(null);
    }
  };

  const handleAuditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditTitle.trim() || !auditImpact.trim()) return;
    setSubmittingAudit(true);
    try {
      const ok = await onCreateAuditLog({
        category: auditCategory,
        title: auditTitle.trim(),
        impact: auditImpact.trim(),
      });
      if (ok) {
        setAuditTitle('');
        setAuditImpact('');
      }
    } finally {
      setSubmittingAudit(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Placement Offers Table */}
      <div className="lg:col-span-7 space-y-4">
        <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-luma-title text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
              Placement Offers ({filteredOffers.length})
            </h2>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Confirm PPO &amp; internship outcomes for NAAC/NIRF reporting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'PPO', 'Internship'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setOfferFilter(tab)}
                className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer ${
                  offerFilter === tab
                    ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24]'
                    : 'border border-slate-200 dark:border-white/10 text-[#475569] dark:text-[#94A3B8]'
                }`}
              >
                {tab}
              </button>
            ))}

            <a
              href="/api/dean/export"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0891B2]/35 bg-[#0891B2]/10 px-3.5 py-1 text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE]"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </a>
          </div>
        </div>

        <div className="space-y-3">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              className="rounded-2xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-slate-100 dark:bg-white/10 px-2 py-0.5 text-[10px] font-mono">
                    {offer.code}
                  </span>
                  <Link
                    href={`/u/${encodeURIComponent(offer.studentUserId)}`}
                    className="text-sm font-bold hover:text-[#0891B2] dark:hover:text-[#22D3EE]"
                  >
                    {offer.studentName}
                  </Link>
                  <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    ({offer.academicYearBranch})
                  </span>
                </div>
                <div className="text-xs font-semibold">
                  {offer.company} • {offer.jobRole}
                </div>
                <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] flex flex-wrap items-center gap-2">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">
                    {offer.packageStr}
                  </span>
                  <span>• {offer.offerType}</span>
                  <span>• {offer.status}</span>
                  {offer.referringAlumniName && offer.referringAlumniId && (
                    <span>
                      • Referred by{' '}
                      <Link
                        href={`/u/${encodeURIComponent(offer.referringAlumniId)}`}
                        className="text-[#0891B2] dark:text-[#22D3EE] hover:underline"
                      >
                        {offer.referringAlumniName}
                      </Link>
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                {offer.verifiedByDean ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="w-3.5 h-3.5" /> Dean Verified
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={verifyingId === offer.id || isPreviewMode}
                    onClick={() => handleVerify(offer.id)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-3.5 py-1.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {verifyingId === offer.id ? 'Verifying...' : 'Verify Offer'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Institutional Audit Ledger */}
      <aside className="lg:col-span-5 space-y-4">
        <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-luma-title text-sm flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
              Institutional Audit Ledger
            </h3>
            <span className="text-[11px] font-mono text-[#64748B]">
              {auditLogs.length} entries
            </span>
          </div>

          <form onSubmit={handleAuditSubmit} className="space-y-2.5 pb-3 border-b border-slate-200/70 dark:border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={auditCategory}
                onChange={(e) =>
                  setAuditCategory(
                    e.target.value as InstitutionalAuditLogDTO['category'],
                  )
                }
                className="rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-1.5 text-xs"
              >
                <option value="offer_verified">Offer Verified</option>
                <option value="verification">Alumni Verification</option>
                <option value="vouch">Vouch Milestone</option>
                <option value="job_post">Campus Hiring Drive</option>
                <option value="mvp_ship">MVP Ship Milestone</option>
              </select>
              <input
                type="text"
                required
                minLength={3}
                value={auditTitle}
                onChange={(e) => setAuditTitle(e.target.value)}
                placeholder="Audit milestone title..."
                className="rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-1.5 text-xs"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                required
                minLength={3}
                value={auditImpact}
                onChange={(e) => setAuditImpact(e.target.value)}
                placeholder="Institutional impact summary..."
                className="flex-1 rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-1.5 text-xs"
              />
              <button
                type="submit"
                disabled={submittingAudit || isPreviewMode}
                className="inline-flex items-center gap-1 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-3.5 py-1.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" /> Log
              </button>
            </div>
          </form>

          <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-3 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-[#0891B2]/10 px-2 py-0.5 text-[10px] font-semibold uppercase text-[#0891B2] dark:text-[#22D3EE]">
                    {log.category.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] text-[#64748B]">
                    {formatShortDate(log.createdAt)}
                  </span>
                </div>
                <div className="text-xs font-bold">{log.title}</div>
                <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
                  {log.impact}
                </p>
                <div className="text-[10px] text-[#64748B]">
                  Actor: {log.actorName}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
