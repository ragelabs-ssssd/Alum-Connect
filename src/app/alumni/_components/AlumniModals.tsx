'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Award,
  Check,
  Copy,
  ExternalLink,
  Flame,
  Loader2,
  ShieldCheck,
  ThumbsUp,
  Users,
  X,
} from 'lucide-react';
import { formatShortDate } from '@/components/shared/DomainUtils';
import { JobOpeningCard } from '@/components/shared/JobOpeningCard';
import { VouchCodeBadge } from '@/components/shared/VerificationBadge';
import type { CreateJobPostingInput } from '@/modules/hiring/validators';
import type {
  FeedBuildItem,
  JobApplicationDTO,
  JobPostingDTO,
  SessionUser,
  VouchCertificateDTO,
} from '@/types/domain';
import type { EndorseActionKind } from './AlumniFeedView';

// ============================================================================
// 1. Endorse / 5-Min Roast / Issue Vouch Modal
// ============================================================================

interface EndorseVouchModalProps {
  item: FeedBuildItem | null;
  defaultKind: EndorseActionKind;
  onClose: () => void;
  onNavigateOut?: () => void;
  onSubmit: (payload: {
    targetType: 'project' | 'paper';
    targetId: string;
    kind: EndorseActionKind;
    category: string;
    quote: string;
    certifiedSkills: string[];
    rating: number;
  }) => Promise<{ ok: boolean; error?: string; vouchCertificate?: VouchCertificateDTO }>;
}

const SUGGESTED_SKILLS = [
  'Production Next.js',
  'FastAPI Microservices',
  'PostgreSQL Tuning',
  'Distributed Systems',
  'LangGraph / RAG',
  'Rust / Systems',
  'Clean Component Architecture',
  'High Coachability',
];

export function EndorseVouchModal({
  item,
  defaultKind,
  onClose,
  onNavigateOut,
  onSubmit,
}: EndorseVouchModalProps) {
  const [kind, setKind] = useState<EndorseActionKind>(defaultKind);
  const [category, setCategory] = useState(
    defaultKind === 'roast'
      ? 'Architecture & Latency Review'
      : defaultKind === 'vouch'
        ? 'Production Engineering Vouch'
        : 'System Design Endorsement'
  );
  const [quote, setQuote] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    item?.techStack.slice(0, 3) ?? ['System Design']
  );
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [issuedCert, setIssuedCert] = useState<VouchCertificateDTO | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  useEffect(() => {
    if (!item) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [item, onClose]);

  if (!item) return null;

  const skillPool = Array.from(
    new Set([...(item.techStack ?? []), ...SUGGESTED_SKILLS])
  ).slice(0, 12);

  const toggleSkill = (s: string) => {
    setSelectedSkills((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim() || submitting) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await onSubmit({
        targetType: item.isPaper ? 'paper' : 'project',
        targetId: item.id,
        kind,
        category: category.trim() || 'Engineering Review',
        quote: quote.trim(),
        certifiedSkills: selectedSkills,
        rating,
      });
      if (!res.ok) {
        setErrorMsg(res.error ?? 'Failed to submit review.');
        return;
      }
      if (res.vouchCertificate) {
        setIssuedCert(res.vouchCertificate);
      } else {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#0E1118] shadow-2xl overflow-hidden"
      >
        <div className="bg-[#0C0F16] text-white px-6 py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#22D3EE]">
              {issuedCert ? 'Vouch Certificate Issued' : `${item.code} • Alumni Review`}
            </div>
            <h2 className="font-luma-title text-base truncate">{item.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full bg-white/10 hover:bg-white/20 p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {issuedCert ? (
          <div className="p-6 space-y-5">
            <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-[#34D399]">
                  <ShieldCheck className="w-4 h-4" />
                  Cryptographic HMAC-SHA256 Vouch Active
                </span>
                <VouchCodeBadge vouchCode={issuedCert.vouchCode} />
              </div>
              <p className="text-xs italic text-[#09090B] dark:text-zinc-200 leading-relaxed">
                &ldquo;{issuedCert.quote}&rdquo;
              </p>
              <div className="font-mono text-[10px] text-[#52525B] dark:text-zinc-400 break-all">
                Digest: {issuedCert.signatureDigest}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/vouch/${encodeURIComponent(issuedCert.vouchCode)}`}
                  onClick={() => {
                    if (onNavigateOut) onNavigateOut();
                    else onClose();
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-4 py-2 text-xs font-semibold"
                >
                  <span>Open /vouch/{issuedCert.vouchCode}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={async () => {
                    const url = `${window.location.origin}/vouch/${encodeURIComponent(
                      issuedCert.vouchCode
                    )}`;
                    await navigator.clipboard?.writeText(url);
                    setCopiedUrl(true);
                    setTimeout(() => setCopiedUrl(false), 1800);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-3.5 py-2 text-xs font-semibold"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied Link' : 'Copy Share Link'}</span>
                </button>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-2 text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Mode Switcher */}
            <div className="grid grid-cols-3 gap-2">
              {(
                [
                  {
                    id: 'endorsement',
                    label: 'Endorse',
                    icon: <ThumbsUp className="w-3.5 h-3.5" />,
                  },
                  {
                    id: 'roast',
                    label: '5-Min Roast',
                    icon: <Flame className="w-3.5 h-3.5" />,
                  },
                  {
                    id: 'vouch',
                    label: 'Issue Vouch',
                    icon: <Award className="w-3.5 h-3.5" />,
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setKind(opt.id)}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors ${
                    kind === opt.id
                      ? 'border-[#0891B2] bg-[#0891B2]/15 text-[#0891B2] dark:border-[#22D3EE] dark:bg-[#22D3EE]/15 dark:text-[#22D3EE]'
                      : 'border-[#E4E4E7] dark:border-zinc-800 text-[#52525B] dark:text-zinc-400'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                  Review Category
                </label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                  Engineering Signal Rating
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 text-xs"
                >
                  <option value={5}>5 / 5 — L4 Industry Ready</option>
                  <option value={4}>4 / 5 — Strong Execution</option>
                  <option value={3}>3 / 5 — Promising Prototype</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                {kind === 'roast'
                  ? '5-Minute Architecture Critique (actionable bottlenecks / trade-offs)'
                  : kind === 'vouch'
                    ? 'Official Vouch Statement (appears on public /vouch/[code] certificate)'
                    : 'Endorsement Quote'}
              </label>
              <textarea
                rows={4}
                required
                minLength={10}
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                placeholder={
                  kind === 'roast'
                    ? 'e.g. Move queue polling to Redis pub/sub + SSE and add circuit breakers on external webhook retries...'
                    : 'e.g. Inspected the repository and live deployment. Clean architecture, strong error handling, and ready for direct engineering interviews...'
                }
                className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 p-3 text-xs leading-relaxed"
              />
              <div className="flex items-center justify-between text-[10px] text-[#52525B] dark:text-zinc-400">
                <span>
                  {quote.trim().length < 10
                    ? `Minimum 10 characters required (${quote.trim().length}/10)`
                    : 'Ready to publish'}
                </span>
                <span>{quote.trim().length} chars</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                Certified Skills
              </label>
              <div className="flex flex-wrap gap-1.5">
                {skillPool.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        active
                          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-[#34D399]'
                          : 'border-[#E4E4E7] dark:border-zinc-700 text-[#52525B] dark:text-zinc-400'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
                {errorMsg}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-1.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || quote.trim().length < 10}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] disabled:opacity-50 px-5 py-1.5 text-xs font-semibold"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>
                  {kind === 'vouch'
                    ? 'Sign & Issue Vouch Card'
                    : kind === 'roast'
                      ? 'Publish 5-Min Roast'
                      : 'Publish Endorsement'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 2. Post Job Opening Modal
// ============================================================================

interface PostJobModalProps {
  open: boolean;
  viewer: SessionUser;
  onClose: () => void;
  onSubmit: (
    payload: CreateJobPostingInput
  ) => Promise<{ ok: boolean; error?: string }>;
}

export function PostJobModal({
  open,
  viewer,
  onClose,
  onSubmit,
}: PostJobModalProps) {
  const [roleTitle, setRoleTitle] = useState('');
  const [company, setCompany] = useState(viewer.company || '');
  const [jobType, setJobType] = useState<'Full-Time' | 'Internship' | 'Paid Bounty'>(
    'Full-Time'
  );
  const [location, setLocation] = useState('Bengaluru / Hybrid');
  const [compensation, setCompensation] = useState('₹22–28 LPA');
  const [slots, setSlots] = useState(2);
  const [eligibility, setEligibility] = useState('2026 / 2027 Batch • CGPA ≥ 7.5');
  const [skillsText, setSkillsText] = useState(
    viewer.techStack.slice(0, 4).join(', ') || 'TypeScript, PostgreSQL, Distributed Systems'
  );
  const [deadline, setDeadline] = useState('2026-12-15');
  const [jdText, setJdText] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const parsedSkills = skillsText
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const previewJob: JobPostingDTO = {
    id: 'preview',
    postedByAlumniId: viewer.id,
    alumniName: viewer.fullName,
    alumniRole: `${viewer.designation || 'Alumni'} @ ${company || viewer.company || 'Partner'}`,
    alumniAvatar: viewer.avatarUrl,
    alumniVerified: viewer.verificationStatus === 'verified',
    roleTitle: roleTitle.trim() || 'Backend Systems Engineer',
    company: company.trim() || viewer.company || 'Partner Team',
    jobType,
    location: location.trim() || 'Bengaluru',
    compensation: compensation.trim() || 'Competitive',
    slots,
    eligibility: eligibility.trim() || 'All Eligible Batches',
    skillsRequired: parsedSkills.length > 0 ? parsedSkills : ['TypeScript'],
    jdText:
      jdText.trim() ||
      'Switch back to Edit to add role responsibilities and interview expectations.',
    deadline,
    status: 'open',
    applicationsCount: 0,
    createdAt: new Date().toISOString(),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await onSubmit({
        roleTitle: roleTitle.trim(),
        company: company.trim(),
        jobType,
        location: location.trim(),
        compensation: compensation.trim(),
        slots,
        eligibility: eligibility.trim(),
        skillsRequired: parsedSkills,
        jdText: jdText.trim(),
        deadline,
      });
      if (!res.ok) {
        setErrorMsg(res.error ?? 'Failed to publish opening.');
        return;
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#0E1118] p-6 space-y-4 shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-luma-title text-base text-[#0F172A] dark:text-white">
              Create Alumni Referral Opening
            </h2>
            <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
              Published directly to the ITER Student Jobs &amp; Portfolio Tracker
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close job modal"
            className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {previewMode ? (
          <JobOpeningCard job={previewJob} />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={roleTitle}
                  onChange={(e) => setRoleTitle(e.target.value)}
                  placeholder="e.g. Backend Systems Engineer"
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                  Company *
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                  Role Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) =>
                    setJobType(
                      e.target.value as 'Full-Time' | 'Internship' | 'Paid Bounty'
                    )
                  }
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 text-xs"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Paid Bounty">Paid Bounty</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                  Compensation / Stipend
                </label>
                <input
                  type="text"
                  required
                  value={compensation}
                  onChange={(e) => setCompensation(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                  Deadline
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                  Eligibility
                </label>
                <input
                  type="text"
                  required
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                  Referral Slots
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={slots}
                  onChange={(e) => setSlots(Number(e.target.value) || 1)}
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                Required Skills (comma-separated)
              </label>
              <input
                type="text"
                required
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#52525B] dark:text-zinc-400">
                Job Description &amp; Interview Process *
              </label>
              <textarea
                rows={4}
                required
                minLength={15}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Describe technical ownership, required portfolio proof, and interview loop..."
                className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 p-3 text-xs"
              />
            </div>
          </>
        )}

        {errorMsg && (
          <div className="rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <button
            type="button"
            onClick={() => setPreviewMode((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#0891B2] text-[#0891B2] dark:text-[#22D3EE] px-4 py-1.5 text-xs font-semibold"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{previewMode ? 'Back to Edit' : 'Preview Card'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-1.5 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] disabled:opacity-50 px-5 py-1.5 text-xs font-semibold"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Publish Opening</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// 3. Job Applicants Pipeline Modal
// ============================================================================

interface ApplicantsDrawerModalProps {
  job: JobPostingDTO | null;
  applicants: JobApplicationDTO[];
  loading: boolean;
  onClose: () => void;
  onUpdateStatus: (
    applicationId: string,
    status: JobApplicationDTO['status']
  ) => Promise<void>;
  onStudentClick: (studentId: string, studentName: string) => void;
}

const PIPELINE_STAGES: JobApplicationDTO['status'][] = [
  'applied',
  'under_review',
  'shortlisted',
  'offered',
  'rejected',
];

export function ApplicantsDrawerModal({
  job,
  applicants,
  loading,
  onClose,
  onUpdateStatus,
  onStudentClick,
}: ApplicantsDrawerModalProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!job) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [job, onClose]);

  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-2xl max-h-[88vh] flex flex-col rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#0E1118] shadow-2xl overflow-hidden"
      >
        <div className="bg-[#0C0F16] text-white px-6 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#22D3EE] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Applicants Pipeline • {job.company}</span>
            </div>
            <h2 className="font-luma-title text-base truncate">{job.roleTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close applicants modal"
            className="rounded-full bg-white/10 hover:bg-white/20 p-1.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-5 space-y-3">
          {loading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-xs text-[#52525B] dark:text-zinc-400">
              <Loader2 className="w-4 h-4 animate-spin text-[#0891B2] dark:text-[#22D3EE]" />
              <span>Loading portfolio applications...</span>
            </div>
          ) : applicants.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#52525B] dark:text-zinc-400">
              No student applications received for this opening yet.
            </div>
          ) : (
            applicants.map((app) => (
              <div
                key={app.id}
                className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5]/70 dark:bg-zinc-900/80 p-4 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onStudentClick(app.studentUserId, app.studentName)}
                    className="flex items-center gap-2.5 text-left hover:text-[#0891B2] dark:hover:text-[#22D3EE]"
                  >
                    {app.studentAvatar && (
                      <img
                        src={app.studentAvatar}
                        alt={app.studentName}
                        className="h-9 w-9 rounded-full object-cover border border-[#E4E4E7] dark:border-zinc-700 shrink-0"
                      />
                    )}
                    <div>
                      <div className="text-xs font-bold hover:underline">
                        {app.studentName}
                      </div>
                      <div className="text-[11px] text-[#52525B] dark:text-zinc-400 font-mono">
                        {app.studentRegNo} • {app.studentBranch}
                        {app.studentCgpa ? ` • CGPA ${app.studentCgpa}` : ''}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <select
                      aria-label={`Application status for ${app.studentName}`}
                      disabled={updatingId === app.id}
                      value={app.status}
                      onChange={async (e) => {
                        const nextStatus = e.target.value as JobApplicationDTO['status'];
                        setUpdatingId(app.id);
                        try {
                          await onUpdateStatus(app.id, nextStatus);
                        } finally {
                          setUpdatingId(null);
                        }
                      }}
                      className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1 text-[11px] font-semibold capitalize"
                    >
                      {PIPELINE_STAGES.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {app.showcaseProjectTitle && (
                  <div className="text-[11px] font-semibold text-[#0891B2] dark:text-[#22D3EE]">
                    Showcased Build: {app.showcaseProjectTitle}
                  </div>
                )}

                {app.note && (
                  <p className="text-xs text-[#09090B] dark:text-zinc-200 leading-relaxed">
                    {app.note}
                  </p>
                )}

                <div className="text-[10px] text-[#52525B] dark:text-zinc-400">
                  Applied {formatShortDate(app.createdAt)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
