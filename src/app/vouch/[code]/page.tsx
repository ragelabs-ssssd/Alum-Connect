import React, { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Building2,
  Calendar,
  CheckCircle2,
  ShieldAlert,
  ShieldCheck,
  Users,
} from 'lucide-react';
import AlumConnectLogo from '@/components/AlumConnectLogo';
import ThemeToggle from '@/components/ThemeToggle';
import { formatShortDate } from '@/components/shared/DomainUtils';
import { AlumniVerificationBadge } from '@/components/shared/VerificationBadge';
import { verifyVouchByCodeQuery } from '@/modules/endorsements/queries';
import { VouchCertificateActions } from './VouchCertificateActions';

export const metadata: Metadata = {
  title: 'Vouch Certificate Verification • AlmaConnect',
  description:
    'Recruiter-verifiable cryptographic AlmaConnect Vouch Certificate backed by verified ITER alumni.',
};

function VouchLoadingSkeleton() {
  return (
    <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white/80 dark:bg-[#14171E]/85 p-8 space-y-5 animate-pulse">
      <div className="h-6 w-48 rounded-full bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-8 w-3/4 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-24 w-full rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      <div className="h-12 w-1/2 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
    </div>
  );
}

async function VouchCertificateContent({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const decodedCode = decodeURIComponent(code).trim();
  const certificate = await verifyVouchByCodeQuery(decodedCode);

  if (!certificate) {
    return (
      <div className="rounded-3xl border border-rose-500/35 bg-white/95 dark:bg-[#14171E]/95 p-8 sm:p-10 shadow-xl space-y-5 text-center">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-rose-500/35 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300">
          <ShieldAlert className="w-4 h-4" />
          <span>Invalid / Not Found</span>
        </div>

        <h1 className="font-luma-title text-xl sm:text-2xl text-[#0F172A] dark:text-white">
          Vouch Certificate Not Found
        </h1>

        <p className="text-sm text-[#52525B] dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
          No verified AlmaConnect certificate matches code{' '}
          <span className="font-mono font-semibold text-[#0F172A] dark:text-zinc-200">
            {decodedCode || '—'}
          </span>
          . Confirm the code with the candidate or inspect the live student portfolio.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] px-5 py-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to AlmaConnect</span>
          </Link>
          <Link
            href="/student"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-2 text-xs font-semibold hover:border-[#0891B2]"
          >
            Explore Student Builds
          </Link>
        </div>
      </div>
    );
  }

  const projectHref = certificate.projectCode || certificate.projectId
    ? `/projects/${encodeURIComponent(
        certificate.projectCode || certificate.projectId || ''
      )}`
    : null;

  return (
    <article className="relative overflow-hidden rounded-3xl border border-[rgba(100,116,139,0.25)] dark:border-[rgba(226,232,240,0.18)] bg-white/95 dark:bg-[#14171E]/95 shadow-2xl print:shadow-none print:border-zinc-300">
      {/* Top Liquid Chrome Ribbon */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#0891B2] via-[#22D3EE] to-[#34D399]" />

      {/* Header */}
      <div className="bg-[#0C0F16] text-white p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {certificate.valid ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3.5 py-1 text-xs font-semibold text-[#34D399]">
              <ShieldCheck className="w-4 h-4" />
              <span>Valid &amp; Verified • HMAC-SHA256</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/15 px-3.5 py-1 text-xs font-semibold text-rose-300">
              <ShieldAlert className="w-4 h-4" />
              <span>Signature Verification Failed</span>
            </span>
          )}

          <span className="font-luma-title text-xs sm:text-sm rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-[#22D3EE]">
            {certificate.vouchCode}
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#22D3EE]" />
            <span>Official ITER Alumni Proof-of-Work Vouch</span>
          </div>

          {projectHref ? (
            <Link
              href={projectHref}
              className="group inline-flex items-center gap-2 hover:text-[#22D3EE] transition-colors"
            >
              <h1 className="font-luma-title text-xl sm:text-2xl leading-snug tracking-tight">
                {certificate.projectTitle}
              </h1>
              <ArrowUpRight className="w-5 h-5 shrink-0 text-[#22D3EE] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          ) : (
            <h1 className="font-luma-title text-xl sm:text-2xl leading-snug tracking-tight">
              {certificate.projectTitle}
            </h1>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 pt-1">
            {certificate.studentNames.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Built by {certificate.studentNames.join(', ')}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#34D399]" />
              <span>Issued {formatShortDate(certificate.issuedAt)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Certificate Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {/* Endorsement Quote */}
        <section className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5]/75 dark:bg-zinc-900/80 p-5 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
            Endorsing Alumni Evaluation
          </div>
          <blockquote className="text-sm sm:text-base italic text-[#09090B] dark:text-zinc-100 leading-relaxed">
            &ldquo;{certificate.quote}&rdquo;
          </blockquote>
        </section>

        {/* Certified Skills */}
        {certificate.certifiedSkills.length > 0 && (
          <section className="space-y-2.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
              Certified Engineering Competencies
            </h2>
            <div className="flex flex-wrap gap-2">
              {certificate.certifiedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 dark:border-[#34D399]/35 dark:bg-[#34D399]/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-[#34D399]"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Issuing Alumnus Card */}
        <section className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-950/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {certificate.alumAvatar ? (
              <img
                src={certificate.alumAvatar}
                alt={certificate.alumName}
                className="h-12 w-12 rounded-2xl object-cover border border-[#E4E4E7] dark:border-zinc-700 shrink-0"
              />
            ) : (
              <div className="h-12 w-12 rounded-2xl bg-[#0891B2]/15 text-[#0891B2] dark:text-[#22D3EE] font-bold text-sm flex items-center justify-center shrink-0">
                {certificate.alumName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/u/${encodeURIComponent(certificate.alumUserId)}`}
                  className="text-sm font-bold text-[#0F172A] dark:text-white hover:text-[#0891B2] dark:hover:text-[#22D3EE] hover:underline truncate"
                >
                  {certificate.alumName}
                </Link>
                <AlumniVerificationBadge
                  status={certificate.alumVerified ? 'verified' : 'pending_review'}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#52525B] dark:text-zinc-400">
                <span className="inline-flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
                  <span>
                    {certificate.alumDesignation} @ {certificate.alumCompany}
                  </span>
                </span>
                <span>•</span>
                <span>ITER Batch {certificate.alumBatch}</span>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              href={`/u/${encodeURIComponent(certificate.alumUserId)}`}
              className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-3.5 py-1.5 text-xs font-semibold hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors"
            >
              <span>Alumnus Profile</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Cryptographic Digest & Actions */}
        <section className="pt-4 border-t border-[#E4E4E7] dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
              Cryptographic Signature Digest
            </div>
            <div className="font-mono text-[11px] text-[#09090B] dark:text-zinc-300 break-all">
              {certificate.signatureDigest}
            </div>
          </div>

          <VouchCertificateActions vouchCode={certificate.vouchCode} />
        </section>
      </div>
    </article>
  );
}

export default function VouchVerificationPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#F8FAFC_0%,#E2E8F0_100%)] dark:bg-[linear-gradient(135deg,#07080A_0%,#14171F_55%,#090A0E_100%)] text-[#0F172A] dark:text-zinc-50 flex flex-col">
      <header className="sticky top-0 z-30 border-b border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#0B0D12]/90 backdrop-blur-xl print:hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06] border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] flex items-center justify-center p-1">
              <AlumConnectLogo className="h-5 w-5" />
            </div>
            <span className="font-luma-title text-base tracking-tight">
              AlmaConnect
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/student"
              className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-800 px-3 py-1 text-xs font-semibold hover:border-[#0891B2]"
            >
              Student Portal
            </Link>
            <Link
              href="/alumni"
              className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-800 px-3 py-1 text-xs font-semibold hover:border-[#059669]"
            >
              Alumni Portal
            </Link>
            <ThemeToggle compact />
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <Suspense fallback={<VouchLoadingSkeleton />}>
          <VouchCertificateContent params={params} />
        </Suspense>
      </main>
    </div>
  );
}
