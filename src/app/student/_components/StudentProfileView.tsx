'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Award,
  Code2,
  ExternalLink,
  GitBranch,
  GraduationCap,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { VouchCodeBadge } from '@/components/shared/VerificationBadge';
import type { PublicProfileDTO } from '@/modules/identity/queries';
import type { CoffeeChatDTO, SessionUser } from '@/types/domain';

interface StudentProfileViewProps {
  student: SessionUser;
  publicProfile: PublicProfileDTO | null;
  coffeeChats: CoffeeChatDTO[];
}

export function StudentProfileView({
  student,
  publicProfile,
  coffeeChats,
}: StudentProfileViewProps) {
  const user = publicProfile?.user ?? student;
  const academics = publicProfile?.academics ?? null;
  const projects = publicProfile?.projects ?? [];
  const papers = publicProfile?.papers ?? [];
  const offers = publicProfile?.offers ?? [];
  const mentors = publicProfile?.mentorsOrMentees ?? [];
  const followersCount = publicProfile?.followersCount ?? 0;

  return (
    <div className="space-y-6">
      {/* Header Banner Card */}
      <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 overflow-hidden">
        <div className="relative h-36 bg-[linear-gradient(120deg,#0891B2_0%,#0F172A_55%,#059669_100%)]">
          {user.bannerUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={user.bannerUrl}
              alt={user.fullName}
              className="h-full w-full object-cover opacity-50"
            />
          )}
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10">
            <div className="flex items-end gap-4">
              {user.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="h-20 w-20 rounded-2xl object-cover border-4 border-white dark:border-[#14171E] shadow-md"
                />
              ) : (
                <div className="h-20 w-20 rounded-2xl border-4 border-white dark:border-[#14171E] bg-[#0891B2]/20 text-[#0891B2] flex items-center justify-center font-bold text-xl">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="space-y-1 pt-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-luma-title text-xl">{user.fullName}</h2>
                  {user.legacyCode && (
                    <span className="rounded-full bg-slate-100 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-mono">
                      {user.legacyCode}
                    </span>
                  )}
                  <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                    {followersCount} Followers
                  </span>
                </div>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  {user.headline}
                </p>
              </div>
            </div>

            <Link
              href={`/u/${encodeURIComponent(user.id)}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-4 py-2 text-xs font-semibold shrink-0"
            >
              Public Portfolio URL <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="mt-4 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] max-w-3xl">
            {user.bio || 'Engineering builder at ITER, Siksha \'O\' Anusandhan.'}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {user.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium"
              >
                <Code2 className="w-3 h-3 text-[#0891B2] dark:text-[#22D3EE]" />
                {tech}
              </span>
            ))}
            {user.githubHandle && (
              <a
                href={`https://github.com/${user.githubHandle}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/15 px-3 py-1 text-[11px] font-semibold"
              >
                <GitBranch className="w-3 h-3" />@{user.githubHandle}
              </a>
            )}
            {user.linkedinUrl && (
              <a
                href={user.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-[#0A66C2]/30 bg-[#0A66C2]/10 px-3 py-1 text-[11px] font-semibold text-[#0A66C2] dark:text-sky-400"
              >
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Two-Column Portfolio Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          {/* Academics */}
          <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-luma-title text-sm flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
                Academic Record
              </h3>
              {user.cgpa !== null && user.cgpa !== undefined && (
                <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  CGPA {user.cgpa.toFixed(2)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-3">
                <div className="text-[10px] text-[#64748B]">Reg No</div>
                <div className="font-mono font-bold mt-0.5">
                  {user.regNo || '—'}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-3">
                <div className="text-[10px] text-[#64748B]">Branch</div>
                <div className="font-bold mt-0.5">{user.branch || 'CSE'}</div>
              </div>
              <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-3">
                <div className="text-[10px] text-[#64748B]">Cohort</div>
                <div className="font-bold mt-0.5">
                  {user.academicYear || '3rd Year'}
                </div>
              </div>
            </div>
            {academics && (
              <div className="text-xs text-[#475569] dark:text-[#94A3B8] space-y-1.5 pt-2 border-t border-slate-200/70 dark:border-white/10">
                <div className="flex items-center gap-1.5 text-[#0F172A] dark:text-white font-semibold">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  {academics.achievement}
                </div>
                <div>
                  Clubs: {academics.primaryClub} ({academics.clubRole}) •{' '}
                  {academics.secondaryClub}
                </div>
              </div>
            )}
          </div>

          {/* Projects & Vouch Certificates */}
          <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 space-y-3">
            <h3 className="font-luma-title text-sm">
              My Projects ({projects.length}) &amp; Papers ({papers.length})
            </h3>
            <div className="space-y-2.5">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/projects/${encodeURIComponent(p.slug)}`}
                      className="text-xs font-bold hover:text-[#0891B2] dark:hover:text-[#22D3EE]"
                    >
                      {p.code} • {p.title}
                    </Link>
                    <span className="text-[10px] font-semibold text-[#0891B2] dark:text-[#22D3EE]">
                      {p.domain}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.endorsements
                      .filter((e) => e.vouchCode)
                      .map((e) => (
                        <VouchCodeBadge key={e.id} vouchCode={e.vouchCode!} />
                      ))}
                  </div>
                </div>
              ))}
              {papers.map((rp) => (
                <div
                  key={rp.id}
                  className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-3.5"
                >
                  <Link
                    href={`/projects/${encodeURIComponent(rp.slug)}`}
                    className="text-xs font-bold hover:text-[#0891B2] dark:hover:text-[#22D3EE]"
                  >
                    {rp.code} • {rp.title}
                  </Link>
                  <div className="text-[11px] text-[#64748B] mt-0.5">
                    {rp.venue} • {rp.paperStatus}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Offers, Coffee Chats, Mentors */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 space-y-3">
            <h3 className="font-luma-title text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
              Placement Outcomes ({offers.length})
            </h3>
            {offers.length === 0 ? (
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                No recorded offers yet—apply via Jobs &amp; Deals to connect
                with hiring alumni.
              </p>
            ) : (
              offers.map((o) => (
                <div
                  key={o.id}
                  className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-3 text-xs space-y-1"
                >
                  <div className="flex justify-between font-bold">
                    <span>
                      {o.company} • {o.jobRole}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-300">
                      {o.packageStr}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {o.offerType} • {o.status}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 space-y-3">
            <h3 className="font-luma-title text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
              Mentors ({mentors.length}) &amp; Coffee Chats ({coffeeChats.length})
            </h3>
            {mentors.map((m) => (
              <Link
                key={m.id}
                href={`/u/${encodeURIComponent(m.id)}`}
                className="flex items-center justify-between rounded-2xl border border-slate-200/80 dark:border-white/10 p-3 text-xs hover:border-[#0891B2]"
              >
                <span className="font-bold">{m.fullName}</span>
                <span className="text-[11px] text-[#64748B] truncate max-w-[160px]">
                  {m.company}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
