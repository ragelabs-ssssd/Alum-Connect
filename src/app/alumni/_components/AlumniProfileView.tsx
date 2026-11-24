'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Award,
  Briefcase,
  Building2,
  GraduationCap,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react';
import { AlumniVerificationBadge, VouchCodeBadge } from '@/components/shared/VerificationBadge';
import type { EndorsementWithTargetDTO } from '@/modules/endorsements/queries';
import type { PublicProfileDTO } from '@/modules/identity/queries';
import type {
  JobPostingDTO,
  PlacementOfferDTO,
  SessionUser,
} from '@/types/domain';

export interface AlumniProfileViewProps {
  viewer: SessionUser;
  profile: PublicProfileDTO | null;
  endorsements: EndorsementWithTargetDTO[];
  myJobs: JobPostingDTO[];
  referralsGiven: PlacementOfferDTO[];
  onOpenPostJobModal: () => void;
  onOpenFeed: () => void;
  onOpenStudentProfile: (studentId: string, studentName: string) => void;
}

/**
 * Alumni Profile & Impact Dashboard rendered from live session + `getPublicProfileQuery` data.
 */
export function AlumniProfileView({
  viewer,
  profile,
  endorsements,
  myJobs,
  referralsGiven,
  onOpenPostJobModal,
  onOpenFeed,
  onOpenStudentProfile,
}: AlumniProfileViewProps) {
  const career = profile?.career;
  const mentees = profile?.mentorsOrMentees ?? [];
  const vouchCount = endorsements.filter((e) => e.kind === 'vouch').length;
  const projectEndorsementsCount = endorsements.filter(
    (e) => e.targetType === 'project'
  ).length;
  const paperEndorsementsCount = endorsements.filter(
    (e) => e.targetType === 'paper'
  ).length;

  const isVerified = viewer.verificationStatus === 'verified';

  return (
    <div className="space-y-6">
      {/* Profile Hero Card */}
      <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 overflow-hidden shadow-2xs">
        <div className="relative h-32 bg-gradient-to-r from-[#0C0F16] via-slate-800 to-[#0891B2]">
          {viewer.bannerUrl && (
            <img
              src={viewer.bannerUrl}
              alt={`${viewer.fullName} banner`}
              className="h-full w-full object-cover opacity-45"
            />
          )}
        </div>

        <div className="px-6 pb-6 -mt-12 relative z-10 space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            {viewer.avatarUrl ? (
              <img
                src={viewer.avatarUrl}
                alt={viewer.fullName}
                className="h-24 w-24 rounded-2xl object-cover border-4 border-white dark:border-[#14171E] shadow-md bg-[#0C0F16]"
              />
            ) : (
              <div className="h-24 w-24 rounded-2xl border-4 border-white dark:border-[#14171E] bg-[#0891B2]/20 text-[#0891B2] dark:text-[#22D3EE] font-bold text-xl flex items-center justify-center shadow-md">
                {viewer.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/u/${encodeURIComponent(viewer.id)}`}
                className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-3.5 py-1.5 text-xs font-semibold hover:border-[#0891B2] dark:hover:border-[#22D3EE]"
              >
                <span>Public Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              {isVerified && (
                <button
                  type="button"
                  onClick={onOpenPostJobModal}
                  className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-4 py-1.5 text-xs font-semibold"
                >
                  + Post Opening
                </button>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-luma-title text-xl sm:text-2xl tracking-tight text-[#0F172A] dark:text-white">
                {viewer.fullName}
              </h1>
              <AlumniVerificationBadge status={viewer.verificationStatus} />
              {viewer.personaCategory && (
                <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-semibold text-[#52525B] dark:text-zinc-300">
                  {viewer.personaCategory}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-medium text-[#52525B] dark:text-zinc-300 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
                {viewer.designation || 'Industry Mentor'} @ {viewer.company || 'Partner Team'}
              </span>
              {viewer.batchYear && (
                <span>• Batch &apos;{String(viewer.batchYear).slice(-2)} (ITER, SOA)</span>
              )}
            </p>

            {viewer.workEmail && (
              <p className="text-xs text-[#52525B] dark:text-zinc-400 inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Work Email: {viewer.workEmail}</span>
                {viewer.workEmailVerified && (
                  <span className="text-[#059669] dark:text-[#34D399] font-semibold">
                    (Verified)
                  </span>
                )}
              </p>
            )}

            {viewer.mentorshipScope && (
              <p className="text-xs text-[#09090B] dark:text-zinc-200 pt-1">
                Mentorship Scope: {viewer.mentorshipScope}
              </p>
            )}
          </div>

          {viewer.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {viewer.techStack.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 px-3 py-0.5 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 4-Stat Impact Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-4">
          <div className="text-lg font-bold text-[#0891B2] dark:text-[#22D3EE]">
            {projectEndorsementsCount}
          </div>
          <div className="text-[11px] text-[#52525B] dark:text-zinc-400">
            Projects Endorsed
          </div>
        </div>
        <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-4">
          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {paperEndorsementsCount}
          </div>
          <div className="text-[11px] text-[#52525B] dark:text-zinc-400">
            Papers Reviewed
          </div>
        </div>
        <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-4">
          <div className="text-lg font-bold text-[#059669] dark:text-[#34D399]">
            {vouchCount}
          </div>
          <div className="text-[11px] text-[#52525B] dark:text-zinc-400">
            Vouch Cards Issued
          </div>
        </div>
        <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-4">
          <div className="text-lg font-bold text-[#0F172A] dark:text-white">
            {myJobs.length}
          </div>
          <div className="text-[11px] text-[#52525B] dark:text-zinc-400">
            Open Roles Posted
          </div>
        </div>
      </div>

      {/* Career & Education */}
      {career && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
              Career Milestones ({career.totalYears} yrs exp • {career.careerStage})
            </h2>
            <div className="space-y-3 text-xs">
              <div className="border-l-2 border-[#0891B2]/50 pl-3 space-y-0.5">
                <div className="font-bold">Current Role</div>
                <div className="text-[11px] text-[#52525B] dark:text-zinc-400">
                  {viewer.designation || career.careerStage} @ {viewer.company || 'Partner Team'}
                </div>
                <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
                  Track: {career.founderStatus}
                </p>
              </div>
              <div className="border-l-2 border-[#0891B2]/35 pl-3 space-y-0.5">
                <div className="font-bold">Mid Career</div>
                <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
                  {career.midCareer}
                </p>
              </div>
              <div className="border-l-2 border-zinc-400/40 pl-3 space-y-0.5">
                <div className="font-bold">Early Career</div>
                <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
                  {career.earlyCareer}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-4 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
              Education &amp; Credentials
            </h2>
            <div className="space-y-3 text-xs">
              <div className="border-l-2 border-emerald-500/50 pl-3 space-y-0.5">
                <div className="font-bold">
                  B.Tech — ITER, Siksha &apos;O&apos; Anusandhan
                </div>
                <div className="text-[11px] text-[#52525B] dark:text-zinc-400">
                  Class of {viewer.batchYear || 'ITER'}
                </div>
                <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
                  Verified Alumni Mentor • Campus Proof-of-Work Reviewer
                </p>
              </div>
              <div className="border-l-2 border-emerald-500/35 pl-3 space-y-0.5">
                <div className="font-bold">Schooling</div>
                <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
                  {career.schooling}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referrals & Mentored Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
            Verified Offers via My Referrals ({referralsGiven.length})
          </h2>
          {referralsGiven.length === 0 ? (
            <p className="text-xs text-[#52525B] dark:text-zinc-400">
              Verified campus offers linked to your referrals appear here.
            </p>
          ) : (
            <div className="space-y-2">
              {referralsGiven.map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => onOpenStudentProfile(o.studentUserId, o.studentName)}
                  className="w-full text-left rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 flex items-center justify-between gap-2 hover:border-[#0891B2] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{o.studentName}</div>
                    <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                      {o.jobRole} • {o.company}
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full bg-white dark:bg-zinc-900 px-2.5 py-0.5 text-[10px] font-bold text-[#059669] dark:text-[#34D399]">
                    {o.packageStr} ({o.offerType})
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-4 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
            Students Mentored ({mentees.length})
          </h2>
          {mentees.length === 0 ? (
            <p className="text-xs text-[#52525B] dark:text-zinc-400">
              Endorse student builds or accept coffee chats to build your mentee roster.
            </p>
          ) : (
            <div className="space-y-2">
              {mentees.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onOpenStudentProfile(st.id, st.fullName)}
                  className="w-full text-left rounded-xl bg-[#F4F4F5] dark:bg-zinc-900 p-2.5 flex items-center justify-between gap-2 hover:border-[#0891B2] border border-transparent transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {st.avatarUrl && (
                      <img
                        src={st.avatarUrl}
                        alt={st.fullName}
                        className="h-8 w-8 rounded-full object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{st.fullName}</div>
                      <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                        {st.academicYear} {st.branch}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-[#0891B2] dark:text-[#22D3EE] shrink-0">
                    Profile →
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Issued Vouch Certificates */}
      {endorsements.some((e) => Boolean(e.vouchCode)) && (
        <section className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
              Issued Vouch Certificates
            </h2>
            <button
              type="button"
              onClick={onOpenFeed}
              className="text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
            >
              Issue Another Vouch →
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {endorsements
              .filter((e) => Boolean(e.vouchCode))
              .map((e) => (
                <VouchCodeBadge key={e.id} vouchCode={e.vouchCode!} />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
