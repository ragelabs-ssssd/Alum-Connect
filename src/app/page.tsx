'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  Code2,
  GraduationCap,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';
import { HIRING_COMPANIES } from '../data/hiringCompanies';
import {
  ALUMNI_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
} from '../data/alumConnectData';

export default function HomePage() {
  const projectCount = PROJECTS_DATA.length + RESEARCH_PAPERS_DATA.length;
  const dealCount = ALUMNI_DATA.reduce((sum, a) => sum + a.activeJobOpeningsCount, 0);

  const portals = [
    {
      href: '/student',
      title: 'Student Network',
      desc: 'Publish GitHub repository showcases, track sprint tasks, and follow what campus squads are shipping.',
      cta: 'Open Student Feed',
      icon: <Code2 className="w-5 h-5" />,
      badge: 'For Builders',
      accentText: 'text-[#0891B2] dark:text-[#22D3EE]',
      accentBg:
        'bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 border-[#0891B2]/25 dark:border-[#22D3EE]/30',
      topBar: 'bg-gradient-to-r from-[#0891B2] to-[#059669] dark:from-[#22D3EE] dark:to-[#34D399]',
    },
    {
      href: '/alumni',
      title: 'Alumni & Hiring',
      desc: 'Inspect live student codebases, leave 5-minute architecture roasts, issue Vouch Cards, and fast-track hire.',
      cta: 'Open Alumni Marketplace',
      icon: <Briefcase className="w-5 h-5" />,
      badge: 'For Recruiters',
      accentText: 'text-[#059669] dark:text-[#34D399]',
      accentBg:
        'bg-[#059669]/10 dark:bg-[#34D399]/15 border-[#059669]/25 dark:border-[#34D399]/30',
      topBar: 'bg-gradient-to-r from-[#059669] to-[#0891B2] dark:from-[#34D399] dark:to-[#22D3EE]',
    },
    {
      href: '/dean',
      title: 'Dean & T&P Cell',
      desc: 'Monitor verified campus placement outcomes, sprint velocity, alumni engagement, and institutional audit trails.',
      cta: 'Open Placement Telemetry',
      icon: <GraduationCap className="w-5 h-5" />,
      badge: 'For Leadership',
      accentText: 'text-[#0891B2] dark:text-[#22D3EE]',
      accentBg:
        'bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 border-[#0891B2]/25 dark:border-[#22D3EE]/30',
      topBar: 'bg-gradient-to-r from-[#0891B2] to-[#059669] dark:from-[#22D3EE] dark:to-[#34D399]',
    },
  ];

  return (
    <div className="font-luma-body relative min-h-dvh lg:h-dvh w-full overflow-x-hidden lg:overflow-hidden bg-[linear-gradient(135deg,#F8FAFC_0%,#E2E8F0_100%)] dark:bg-[radial-gradient(800px_500px_at_25%_20%,rgba(148,163,184,0.22)_0%,transparent_60%),linear-gradient(135deg,#07080A_0%,#14171F_55%,#090A0E_100%)] text-[#0F172A] dark:text-white grid grid-rows-[auto_1fr_auto] transition-colors">
      {/* Option 18: Panning Isometric Diamond Mesh Full-Background Animation */}
      <div
        className="pointer-events-none fixed -inset-12 opacity-20 dark:opacity-20 animate-iso-drift hidden dark:block"
        style={{
          backgroundImage:
            'linear-gradient(30deg, #22D3EE 1px, transparent 1px), linear-gradient(150deg, #34D399 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed -inset-12 opacity-40 animate-iso-drift dark:hidden"
        style={{
          backgroundImage:
            'linear-gradient(30deg, #0891B2 1px, transparent 1px), linear-gradient(150deg, #059669 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      {/* NAV 4: Brand + Quick Jump Bar + Live Status + ThemeToggle */}
      <header className="relative z-10 border-b border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-[#0C0E12]/78 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06] border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] flex items-center justify-center p-1 shadow-xs overflow-hidden">
              <img
                src="/logo.png"
                alt="AlmaConnect"
                className="h-full w-full object-contain dark:invert"
              />
            </div>
            <div className="leading-tight">
              <span className="font-luma-title text-sm tracking-tight text-[#0F172A] dark:text-white">
                AlmaConnect
              </span>
              <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] hidden lg:block">
                Institute of Technical Education &amp; Research • Siksha &apos;O&apos; Anusandhan
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2.5 rounded-full border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 px-3.5 py-1 text-xs text-[#475569] dark:text-[#94A3B8]">
            <span>Quick Jump:</span>
            <Link
              href="/student"
              className="font-mono text-[#0891B2] dark:text-[#22D3EE] hover:underline"
            >
              /student
            </Link>
            <span>•</span>
            <Link
              href="/alumni"
              className="font-mono text-[#0891B2] dark:text-[#22D3EE] hover:underline"
            >
              /alumni
            </Link>
            <span>•</span>
            <Link
              href="/dean"
              className="font-mono text-[#0891B2] dark:text-[#22D3EE] hover:underline"
            >
              /dean
            </Link>
            <span>•</span>
            <Link
              href="/login"
              className="font-mono text-[#0891B2] dark:text-[#22D3EE] hover:underline"
            >
              /login
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle compact />
          </div>
        </div>
      </header>

      {/* FULL-VIEWPORT PROPORTIONAL MAIN */}
      <main className="relative z-10 min-h-0 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-3 grid grid-rows-[auto_auto] lg:grid-rows-[minmax(0,1.28fr)_minmax(0,0.82fr)] gap-3.5">
        {/* HERO 1: Liquid Chrome + Panning Isometric Mesh Hero + Telemetry & CTAs */}
        <section className="relative lg:h-full min-h-0 overflow-hidden rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/65 dark:bg-[#14171E]/68 backdrop-blur-xl p-5 sm:p-6 lg:p-7 shadow-2xs flex flex-col justify-between gap-3">
          <div className="relative z-10 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 space-y-3">
              <h1 className="font-luma-title text-3xl sm:text-5xl xl:text-[52px] tracking-tight text-[#0F172A] dark:text-white leading-[1.08]">
                A living graph of campus{' '}
                <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
                Connecting{' '}
                <span className="font-semibold text-[#0F172A] dark:text-white">
                  {projectCount} verified student builds
                </span>{' '}
                directly to alumni mentors, 5-minute architecture roasts, and{' '}
                <span className="font-semibold text-[#0891B2] dark:text-[#22D3EE]">
                  {dealCount} active hiring deals
                </span>{' '}
                across ITER.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06] p-4 sm:p-5 min-h-[118px] flex flex-col justify-between">
                  <span className="text-[11px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">
                    Repositories
                  </span>
                  <div>
                    <div className="font-luma-title text-3xl text-[#0F172A] dark:text-white">{projectCount}</div>
                    <div className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">Live Campus Builds</div>
                  </div>
                </div>
                <div className="rounded-2xl border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06] p-4 sm:p-5 min-h-[118px] flex flex-col justify-between">
                  <span className="text-[11px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">
                    Marketplace
                  </span>
                  <div>
                    <div className="font-luma-title text-3xl text-[#0891B2] dark:text-[#22D3EE]">
                      {dealCount}
                    </div>
                    <div className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                      Deals &amp; Paid Bounties
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/student"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:hover:brightness-110 dark:text-[#041E24] px-5 py-2 text-xs sm:text-sm font-semibold transition-all shadow-xs"
                >
                  Join the Graph <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/alumni"
                  className="inline-flex items-center gap-2 rounded-full border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06] hover:border-[#0891B2] dark:hover:border-[#22D3EE] px-5 py-2 text-xs sm:text-sm font-semibold transition-colors"
                >
                  Explore Talent Nodes
                </Link>
              </div>
            </div>
          </div>

          <div className="relative z-10 shrink-0 pt-3 border-t border-[rgba(100,116,139,0.16)] dark:border-[rgba(226,232,240,0.14)] flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs text-[#475569] dark:text-[#94A3B8]">
            <span className="font-medium shrink-0">
              Alumni Reviewing &amp; Hiring From:
            </span>
            <div className="w-full sm:flex-1 min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <div className="animate-marquee-left gap-8 items-center text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white">
                {[...HIRING_COMPANIES, ...HIRING_COMPANIES].map((c, i) => (
                  <span key={`${c.name}-${i}`} className="shrink-0">
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CARD 3: Elevated Accent Workspace Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {portals.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group relative overflow-hidden rounded-2xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/65 dark:bg-[#14171E]/68 hover:border-[#0891B2] dark:hover:border-[#22D3EE]/60 backdrop-blur-xl p-5 sm:p-6 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between h-full"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${p.topBar}`} />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`h-10 w-10 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}
                  >
                    {p.icon}
                  </div>
                  <span className="rounded-full bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-semibold text-[#475569] dark:text-[#94A3B8]">
                    {p.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-luma-title text-base sm:text-lg text-[#0F172A] dark:text-white">
                    {p.title}
                  </h3>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 leading-relaxed line-clamp-2">
                    {p.desc}
                  </p>
                </div>
              </div>

              <div
                className={`pt-3 mt-3 border-t border-[rgba(100,116,139,0.16)] dark:border-[rgba(226,232,240,0.14)] flex items-center justify-between text-xs font-semibold ${p.accentText}`}
              >
                <span>{p.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* FOOT 4: Floating Glass Pill Footer */}
      <div className="relative z-10 px-4 sm:px-6 pb-3">
        <footer className="max-w-[1440px] mx-auto rounded-full border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-[#0C0E12]/78 backdrop-blur-xl px-5 py-2 flex items-center justify-between text-xs text-[#475569] dark:text-[#94A3B8]">
          <span className="font-luma-title text-[#0F172A] dark:text-white">
            AlmaConnect
          </span>
          <span>
            Institute of Technical Education &amp; Research • Siksha &apos;O&apos; Anusandhan
          </span>
        </footer>
      </div>
    </div>
  );
}
