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
import AlumConnectLogo from '../components/AlumConnectLogo';
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
      primaryHex: '#22D3EE',
      secondaryHex: '#2563EB',
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
      primaryHex: '#34D399',
      secondaryHex: '#0891B2',
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
      primaryHex: '#38BDF8',
      secondaryHex: '#818CF8',
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

      {/* NAV 10: Dual-Row Micro Ribbon + Nav */}
      <div className="relative z-10">
        <div className="bg-gradient-to-r from-[#0891B2] via-[#2563EB] to-emerald-500 text-white text-[11px] font-medium py-1 px-4 text-center">
          Proof-of-Work Network • Ship builds, get 5-min alumni roasts &amp; unlock fast-track interviews
        </div>
        <header className="border-b border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-[#0B0D12]/90 backdrop-blur-xl">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-13 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06] border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] flex items-center justify-center p-1 shadow-xs overflow-hidden shrink-0">
                <AlumConnectLogo className="h-6 w-6" />
              </div>
              <span className="font-luma-title text-lg sm:text-xl leading-none tracking-tight text-[#0F172A] dark:text-white inline-flex items-center translate-y-[0.5px]">
                AlmaConnect
              </span>
            </Link>

            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:hover:brightness-110 dark:text-[#041E24] transition-all shadow-xs"
              >
                Sign Up
              </Link>
              <ThemeToggle compact />
            </div>
          </div>
        </header>
      </div>

      {/* FULL-VIEWPORT PROPORTIONAL MAIN */}
      <main className="relative z-10 min-h-0 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-3 grid grid-rows-[auto_auto] lg:grid-rows-[minmax(0,1.28fr)_minmax(0,0.82fr)] gap-3.5">
        {/* HERO 1: Liquid Chrome + Panning Isometric Mesh Hero + Telemetry & CTAs */}
        <section className="relative lg:h-full min-h-0 overflow-hidden rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/65 dark:bg-[#14171E]/68 backdrop-blur-xl p-5 sm:p-6 lg:p-7 shadow-2xs flex flex-col justify-between gap-3">
          <div className="relative z-10 flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-3">
              <h1 className="font-luma-title text-2xl sm:text-4xl xl:text-[42px] tracking-tight text-[#0F172A] dark:text-white leading-[1.12]">
                <span className="block lg:whitespace-nowrap">A living graph of campus</span>
                <span className="block text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
              </h1>

              <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
                Connecting{' '}
                <span className="font-semibold text-[#0F172A] dark:text-white">
                  {projectCount} verified student builds
                </span>{' '}
                directly to alumni mentors, 5-minute architecture roasts, and{' '}
                <span className="font-semibold text-[#0891B2] dark:text-[#22D3EE]">
                  {dealCount} active hiring deals
                </span>.
              </p>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center lg:self-center">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/student"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:hover:brightness-110 dark:text-[#041E24] px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-xs"
                >
                  Join the Graph <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
                <Link
                  href="/alumni"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06] hover:border-[#0891B2] dark:hover:border-[#22D3EE] px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors text-center"
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
              <div className={`absolute top-0 left-0 right-0 h-1 z-20 ${p.topBar}`} />
              {/* Merged #5 Dot-Matrix Spotlight + #6 Holographic Iridescent Wash */}
              <div
                className="pointer-events-none absolute inset-0 opacity-25 dark:opacity-35 transition-opacity group-hover:opacity-45"
                style={{
                  backgroundImage: `radial-gradient(at 90% 10%, ${p.primaryHex}55 0px, transparent 55%), radial-gradient(at 10% 90%, ${p.secondaryHex}55 0px, transparent 55%)`,
                }}
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-35"
                style={{
                  backgroundImage: `radial-gradient(${p.primaryHex} 1.2px, transparent 1.2px)`,
                  backgroundSize: '16px 16px',
                  maskImage: 'radial-gradient(circle at 85% 20%, black, transparent 70%)',
                  WebkitMaskImage:
                    'radial-gradient(circle at 85% 20%, black, transparent 70%)',
                }}
                aria-hidden="true"
              />
              <div className="relative z-10 space-y-3">
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
                className={`relative z-10 pt-3 mt-3 border-t border-[rgba(100,116,139,0.16)] dark:border-[rgba(226,232,240,0.14)] flex items-center justify-between text-xs font-semibold ${p.accentText}`}
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
            Institute of Technical Education &amp; Research • Siksha &apos;O&apos; Anusandhan (Deemed to be University)
          </span>
        </footer>
      </div>
    </div>
  );
}
