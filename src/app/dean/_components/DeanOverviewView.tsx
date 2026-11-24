'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Award,
  BarChart3,
  Briefcase,
  Clock,
  FileText,
  GraduationCap,
  Layers,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import type { DeanAnalyticsDTO } from '@/types/domain';

interface DeanOverviewViewProps {
  analytics: DeanAnalyticsDTO;
  onJumpToVerifications: () => void;
  onJumpToPlacements: () => void;
}

export function DeanOverviewView({
  analytics,
  onJumpToVerifications,
  onJumpToPlacements,
}: DeanOverviewViewProps) {
  const maxBranchCount = Math.max(
    1,
    ...analytics.branchBreakdown.map((b) => b.count),
  );
  const maxDomainCount = Math.max(
    1,
    ...analytics.domainBreakdown.map((d) => d.count),
  );

  const kpiCards = [
    {
      label: 'Campus Students',
      value: analytics.totalStudents,
      sub: `Avg CGPA ${analytics.avgCgpa}`,
      icon: GraduationCap,
      accent: 'text-[#0891B2] dark:text-[#22D3EE]',
    },
    {
      label: 'Verified Alumni',
      value: `${analytics.verifiedAlumniCount} / ${analytics.totalAlumni}`,
      sub: `${analytics.totalAlumExpYears}+ combined exp yrs`,
      icon: ShieldCheck,
      accent: 'text-[#059669] dark:text-[#34D399]',
    },
    {
      label: 'Pending Verifications',
      value: analytics.pendingVerificationsCount,
      sub: 'Click to review queue',
      icon: Clock,
      accent: 'text-amber-600 dark:text-amber-300',
      onClick: onJumpToVerifications,
    },
    {
      label: 'Builds & Papers',
      value: analytics.totalProjects + analytics.totalPapers,
      sub: `${analytics.totalProjects} projects • ${analytics.totalPapers} papers`,
      icon: Layers,
      accent: 'text-indigo-600 dark:text-indigo-300',
    },
    {
      label: 'Active Openings',
      value: analytics.totalOpenings,
      sub: 'Alumni referrals & bounties',
      icon: Briefcase,
      accent: 'text-[#0891B2] dark:text-[#22D3EE]',
    },
    {
      label: 'Placement Offers',
      value: analytics.totalOffers,
      sub: `${analytics.ppoCount} PPO • ${analytics.internshipCount} Internship`,
      icon: Award,
      accent: 'text-[#059669] dark:text-[#34D399]',
      onClick: onJumpToPlacements,
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const body = (
            <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 space-y-2 text-left h-full hover:border-[#0891B2]/50 dark:hover:border-[#22D3EE]/45 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.accent}`} />
              </div>
              <div className="font-luma-title text-2xl">{card.value}</div>
              <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                {card.sub}
              </div>
            </div>
          );

          if (card.onClick) {
            return (
              <button
                key={card.label}
                type="button"
                onClick={card.onClick}
                className="cursor-pointer w-full"
              >
                {body}
              </button>
            );
          }

          return <div key={card.label}>{body}</div>;
        })}
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-6 space-y-4">
          <h2 className="font-luma-title text-base flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
            Department &amp; Branch Distribution
          </h2>
          <div className="space-y-3">
            {analytics.branchBreakdown.map((item) => (
              <div key={item.branch} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{item.branch}</span>
                  <span className="font-mono text-[#64748B] dark:text-[#94A3B8]">
                    {item.count} students
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#0891B2_0%,#059669_100%)] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)]"
                    style={{
                      width: `${Math.max(8, Math.round((item.count / maxBranchCount) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-6 space-y-4">
          <h2 className="font-luma-title text-base flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
            Proof-of-Work Domain Coverage
          </h2>
          <div className="space-y-3">
            {analytics.domainBreakdown.map((item) => (
              <div key={item.domain} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{item.domain}</span>
                  <span className="font-mono text-[#64748B] dark:text-[#94A3B8]">
                    {item.count} builds
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-slate-100 dark:bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#6366F1_0%,#0891B2_100%)] dark:bg-[linear-gradient(90deg,#818CF8_0%,#22D3EE_100%)]"
                    style={{
                      width: `${Math.max(8, Math.round((item.count / maxDomainCount) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Leaderboards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students */}
        <section className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-luma-title text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
              Top Student Builders
            </h2>
            <span className="text-[11px] font-mono text-[#64748B]">
              CGPA + Projects + Papers
            </span>
          </div>

          <div className="space-y-2.5">
            {analytics.topStudents.map((stu, idx) => (
              <Link
                key={stu.userId}
                href={`/u/${encodeURIComponent(stu.userId)}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-3 hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-7 w-7 rounded-lg bg-[#0891B2]/15 text-[#0891B2] dark:text-[#22D3EE] flex items-center justify-center text-xs font-bold shrink-0">
                    #{idx + 1}
                  </span>
                  {stu.avatarUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={stu.avatarUrl}
                      alt={stu.name}
                      className="h-9 w-9 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate flex items-center gap-1.5">
                      {stu.name}
                      <ArrowUpRight className="w-3 h-3 text-[#64748B]" />
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                      {stu.academicYear} {stu.branch} • CGPA {stu.cgpa.toFixed(2)} •{' '}
                      {stu.projectsCount}P / {stu.papersCount}R
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-[#0891B2] dark:text-[#22D3EE]">
                    {stu.score} pts
                  </div>
                  {stu.offerLabel && (
                    <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                      {stu.offerLabel}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Alumni */}
        <section className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-luma-title text-base flex items-center gap-2">
              <Award className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
              Top Alumni Mentors &amp; Recruiters
            </h2>
            <span className="text-[11px] font-mono text-[#64748B]">
              Openings + Vouches + Chats
            </span>
          </div>

          <div className="space-y-2.5">
            {analytics.topAlumni.map((alum, idx) => (
              <Link
                key={alum.userId}
                href={`/u/${encodeURIComponent(alum.userId)}`}
                className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-3 hover:border-[#059669] dark:hover:border-[#34D399] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-7 w-7 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                    #{idx + 1}
                  </span>
                  {alum.avatarUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={alum.avatarUrl}
                      alt={alum.name}
                      className="h-9 w-9 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate flex items-center gap-1.5">
                      {alum.name}
                      <ArrowUpRight className="w-3 h-3 text-[#64748B]" />
                    </div>
                    <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                      {alum.designation} @ {alum.company} • Batch &apos;
                      {String(alum.batchYear).slice(-2)}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                    {alum.impactScore} pts
                  </div>
                  <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                    {alum.endorsedCount} vouches • {alum.openingsCount} jobs
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
