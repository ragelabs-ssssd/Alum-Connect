import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Code2,
  ExternalLink,
  FileText,
  GitBranch,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Trophy,
} from 'lucide-react';
import AlumConnectLogo from '@/components/AlumConnectLogo';
import ThemeToggle from '@/components/ThemeToggle';
import {
  AlumniVerificationBadge,
  VouchCodeBadge,
} from '@/components/shared/VerificationBadge';
import { getSessionUser } from '@/lib/auth';
import { getPublicProfileQuery } from '@/modules/identity/queries';
import { FollowProfileButton } from './FollowProfileButton';

function ProfileSkeleton() {
  return (
    <div className="min-h-dvh bg-[#F8FAFC] dark:bg-[#07080A] px-4 sm:px-8 py-10">
      <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
        <div className="h-44 rounded-3xl bg-slate-200/80 dark:bg-white/[0.06]" />
        <div className="h-32 rounded-3xl bg-slate-200/60 dark:bg-white/[0.04]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-56 rounded-3xl bg-slate-200/60 dark:bg-white/[0.04]" />
          <div className="h-56 rounded-3xl bg-slate-200/60 dark:bg-white/[0.04]" />
        </div>
      </div>
    </div>
  );
}

async function PublicProfileView({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const decodedHandle = decodeURIComponent(handle);

  const viewer = await getSessionUser();
  const profile = await getPublicProfileQuery(
    decodedHandle,
    viewer?.id ?? null,
  );

  if (!profile) {
    notFound();
  }

  const {
    user,
    academics,
    career,
    projects,
    papers,
    offers,
    mentorsOrMentees,
    isFollowedByMe,
    followersCount,
  } = profile;

  const backHref =
    viewer?.role === 'dean'
      ? '/dean'
      : viewer?.role === 'alumni'
        ? '/alumni'
        : viewer?.role === 'student'
          ? '/student'
          : '/';

  const roleLabel =
    user.role === 'alumni'
      ? 'ITER Alumnus'
      : user.role === 'dean'
        ? 'Dean & T&P Governance'
        : 'ITER Student Builder';

  const initials =
    user.fullName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'AC';

  return (
    <div className="font-luma-body min-h-dvh bg-[linear-gradient(135deg,#F8FAFC_0%,#E2E8F0_100%)] dark:bg-[radial-gradient(900px_500px_at_20%_10%,rgba(34,211,238,0.12)_0%,transparent_60%),linear-gradient(135deg,#07080A_0%,#121620_55%,#090A0E_100%)] text-[#0F172A] dark:text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 border-b border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.14)] bg-white/85 dark:bg-[#0B0D12]/85 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06] border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] flex items-center justify-center p-1">
                <AlumConnectLogo className="h-5 w-5" />
              </div>
              <span className="font-luma-title text-base tracking-tight">
                AlmaConnect
              </span>
            </Link>
            <span className="text-slate-300 dark:text-zinc-700">/</span>
            <Link
              href={backHref}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#475569] dark:text-[#94A3B8] hover:text-[#0891B2] dark:hover:text-[#22D3EE]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Portal
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            {!viewer && (
              <Link
                href="/login"
                className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-3.5 py-1.5 text-xs font-semibold"
              >
                Sign In
              </Link>
            )}
            <ThemeToggle compact />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Hero Profile Card */}
        <section className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/85 backdrop-blur-xl overflow-hidden shadow-lg">
          {/* Banner */}
          <div className="relative h-36 sm:h-44 w-full bg-[linear-gradient(120deg,#0891B2_0%,#0F172A_55%,#059669_100%)] overflow-hidden">
            {user.bannerUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={user.bannerUrl}
                alt={`${user.fullName} campus banner`}
                className="h-full w-full object-cover opacity-55"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          {/* Identity Header */}
          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12">
              <div className="flex items-end gap-4">
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl border-4 border-white dark:border-[#14171E] bg-slate-100 dark:bg-zinc-900 overflow-hidden shadow-md shrink-0 flex items-center justify-center">
                  {user.avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="font-luma-title text-xl text-[#0891B2]">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="pt-2 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="font-luma-title text-xl sm:text-2xl text-[#0F172A] dark:text-white">
                      {user.fullName}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[#0891B2]/30 dark:border-[#22D3EE]/30 bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#0891B2] dark:text-[#22D3EE]">
                      {user.role === 'alumni' ? (
                        <Briefcase className="w-3 h-3" />
                      ) : (
                        <GraduationCap className="w-3 h-3" />
                      )}
                      {roleLabel}
                    </span>
                    {user.role === 'alumni' && (
                      <AlumniVerificationBadge
                        status={user.verificationStatus}
                      />
                    )}
                    {user.legacyCode && (
                      <span className="rounded-full bg-slate-100 dark:bg-white/[0.07] px-2 py-0.5 text-[10px] font-mono text-[#475569] dark:text-[#94A3B8]">
                        {user.legacyCode}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                    {user.headline}
                  </p>
                </div>
              </div>

              <FollowProfileButton
                targetUserId={user.id}
                initialFollowing={isFollowedByMe}
                initialFollowersCount={followersCount}
                isSelf={viewer?.id === user.id}
                isAuthenticated={Boolean(viewer)}
              />
            </div>

            {/* Bio & Social Links */}
            <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[rgba(100,116,139,0.15)] dark:border-white/10 pt-4">
              <p className="text-xs sm:text-sm text-[#334155] dark:text-zinc-300 max-w-3xl leading-relaxed">
                {user.bio ||
                  (user.role === 'alumni'
                    ? `${user.designation ?? 'Alumni Mentor'} at ${user.company ?? 'Partner Org'} (${user.mentorshipScope ?? 'Mentorship & Campus Hiring'}).`
                    : 'Engineering builder at ITER, Siksha \'O\' Anusandhan.')}
              </p>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {user.linkedinUrl && (
                  <a
                    href={user.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#0A66C2]/30 bg-[#0A66C2]/10 px-3 py-1.5 text-xs font-semibold text-[#0A66C2] dark:text-sky-400 hover:bg-[#0A66C2]/15 transition-colors"
                  >
                    LinkedIn <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {user.githubHandle && (
                  <a
                    href={`https://github.com/${user.githubHandle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(100,116,139,0.25)] dark:border-white/15 bg-white/70 dark:bg-white/[0.05] px-3 py-1.5 text-xs font-semibold hover:border-[#0891B2] transition-colors"
                  >
                    <GitBranch className="w-3.5 h-3.5" />@{user.githubHandle}
                  </a>
                )}
              </div>
            </div>

            {/* Tech Stack */}
            {user.techStack.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {user.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-lg border border-[rgba(100,116,139,0.20)] dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#334155] dark:text-zinc-300"
                  >
                    <Code2 className="w-3 h-3 text-[#0891B2] dark:text-[#22D3EE]" />
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Details Grid: Academics / Career + Placement Offers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            {/* Student Academics OR Alumni Career */}
            {user.role === 'student' ? (
              <section className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/85 backdrop-blur-xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-luma-title text-base flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
                    Academic Credentials &amp; Clubs
                  </h2>
                  {user.cgpa !== null && user.cgpa !== undefined && (
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      CGPA {user.cgpa.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-3 border border-slate-200/70 dark:border-white/10">
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Reg. Number
                    </div>
                    <div className="font-mono font-bold mt-0.5">
                      {user.regNo || 'ITER Verified'}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-3 border border-slate-200/70 dark:border-white/10">
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Department
                    </div>
                    <div className="font-bold mt-0.5">
                      {user.branch || 'CSE'}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-3 border border-slate-200/70 dark:border-white/10">
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Cohort
                    </div>
                    <div className="font-bold mt-0.5">
                      {user.academicYear || '3rd Year'}
                    </div>
                  </div>
                </div>

                {academics && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-200/70 dark:border-white/10 text-xs">
                    <div className="flex items-start gap-2">
                      <Trophy className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Key Highlight:</span>{' '}
                        {academics.achievement}
                      </div>
                    </div>
                    <div className="text-[#475569] dark:text-[#94A3B8]">
                      <span className="font-semibold text-[#0F172A] dark:text-white">
                        Campus Societies:
                      </span>{' '}
                      {academics.primaryClub} ({academics.clubRole}) •{' '}
                      {academics.secondaryClub}
                    </div>
                    <div className="text-[#475569] dark:text-[#94A3B8]">
                      <span className="font-semibold text-[#0F172A] dark:text-white">
                        Pre-College:
                      </span>{' '}
                      12th ({academics.class12Board} {academics.class12Pct}) •{' '}
                      10th ({academics.class10Board} {academics.class10Pct})
                    </div>
                  </div>
                )}
              </section>
            ) : (
              <section className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/85 backdrop-blur-xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-luma-title text-base flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
                    Career Trajectory &amp; Mentorship
                  </h2>
                  {user.batchYear && (
                    <span className="rounded-full bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 px-3 py-0.5 text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE]">
                      ITER Batch &apos;{String(user.batchYear).slice(-2)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-3 border border-slate-200/70 dark:border-white/10">
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Organization
                    </div>
                    <div className="font-bold mt-0.5">
                      {user.company || 'Partner Organization'}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-3 border border-slate-200/70 dark:border-white/10">
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Experience
                    </div>
                    <div className="font-bold mt-0.5">
                      {user.totalExpYears
                        ? `${user.totalExpYears}+ Years`
                        : 'Industry Leader'}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-3 border border-slate-200/70 dark:border-white/10">
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      Bandwidth Shield
                    </div>
                    <div className="font-bold mt-0.5">
                      {user.bandwidthShield || '2 chats / week'}
                    </div>
                  </div>
                </div>

                {career && (
                  <div className="space-y-2 pt-2 border-t border-slate-200/70 dark:border-white/10 text-xs text-[#475569] dark:text-[#94A3B8]">
                    <div>
                      <span className="font-semibold text-[#0F172A] dark:text-white">
                        Stage:
                      </span>{' '}
                      {career.careerStage} ({career.founderStatus})
                    </div>
                    <div>
                      <span className="font-semibold text-[#0F172A] dark:text-white">
                        Mid-Career:
                      </span>{' '}
                      {career.midCareer}
                    </div>
                    <div>
                      <span className="font-semibold text-[#0F172A] dark:text-white">
                        Early Career:
                      </span>{' '}
                      {career.earlyCareer}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Projects & Papers */}
            <section className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/85 backdrop-blur-xl p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-luma-title text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
                  {user.role === 'alumni'
                    ? 'Endorsed Builds & Research'
                    : 'Shipped Projects & Research Papers'}
                </h2>
                <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
                  {projects.length} projects • {papers.length} papers
                </span>
              </div>

              {projects.length === 0 && papers.length === 0 ? (
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8] py-4">
                  No linked builds or research publications recorded yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {projects.map((proj) => {
                    const vouches = proj.endorsements.filter(
                      (e) => e.kind === 'vouch' && e.vouchCode,
                    );
                    return (
                      <div
                        key={proj.id}
                        className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] p-4 space-y-2 hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0891B2]/10 text-[#0891B2] dark:text-[#22D3EE]">
                                {proj.code}
                              </span>
                              <Link
                                href={`/projects/${encodeURIComponent(proj.slug)}`}
                                className="text-sm font-bold hover:text-[#0891B2] dark:hover:text-[#22D3EE] inline-flex items-center gap-1"
                              >
                                {proj.title}
                                <ArrowUpRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                            <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1">
                              {proj.subtitle}
                            </p>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
                            {proj.domain}
                          </span>
                        </div>

                        {vouches.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {vouches.map((v) => (
                              <VouchCodeBadge
                                key={v.id}
                                vouchCode={v.vouchCode!}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {papers.map((paper) => (
                    <div
                      key={paper.id}
                      className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] p-4 space-y-1.5 hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE] shrink-0" />
                          <Link
                            href={`/projects/${encodeURIComponent(paper.slug)}`}
                            className="text-sm font-bold hover:text-[#0891B2] dark:hover:text-[#22D3EE] truncate"
                          >
                            {paper.title}
                          </Link>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-700 dark:text-violet-300 shrink-0">
                          {paper.paperStatus}
                        </span>
                      </div>
                      <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                        <BookOpen className="w-3 h-3 inline mr-1" />
                        {paper.venue} • {paper.domain}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Offers & Mentorship Graph */}
          <div className="lg:col-span-5 space-y-6">
            {/* Placement Offers */}
            <section className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/85 backdrop-blur-xl p-6 space-y-4">
              <h2 className="font-luma-title text-base flex items-center gap-2">
                <Award className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
                {user.role === 'alumni'
                  ? 'Alumni Referral Outcomes'
                  : 'Verified Placement Offers'}
              </h2>

              {offers.length === 0 ? (
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  No recorded placement offers linked to this profile yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-3.5 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold">
                          {offer.company} • {offer.jobRole}
                        </span>
                        <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                          {offer.packageStr}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] flex flex-wrap items-center gap-2">
                        <span>{offer.offerType}</span>
                        <span>•</span>
                        <span>{offer.status}</span>
                        {offer.verifiedByDean && (
                          <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-semibold">
                            <ShieldCheck className="w-3 h-3" /> Dean Verified
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Connected Mentors or Mentees */}
            <section className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/85 backdrop-blur-xl p-6 space-y-4">
              <h2 className="font-luma-title text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
                {user.role === 'alumni'
                  ? 'Mentored & Endorsed Students'
                  : 'Connected Alumni Mentors'}
              </h2>

              {mentorsOrMentees.length === 0 ? (
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  No connected mentors or mentees yet.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {mentorsOrMentees.map((person) => (
                    <Link
                      key={person.id}
                      href={`/u/${encodeURIComponent(person.id)}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-3 hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {person.avatarUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={person.avatarUrl}
                            alt={person.fullName}
                            className="h-9 w-9 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <span className="h-9 w-9 rounded-full bg-[#0891B2]/15 text-[#0891B2] flex items-center justify-center text-xs font-bold shrink-0">
                            {person.fullName.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">
                            {person.fullName}
                          </div>
                          <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] truncate">
                            {person.headline}
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PublicProfilePage(props: {
  params: Promise<{ handle: string }>;
}) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <PublicProfileView params={props.params} />
    </Suspense>
  );
}
