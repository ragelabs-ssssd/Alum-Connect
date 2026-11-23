'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code2,
  GraduationCap,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { HIRING_COMPANIES } from '../../data/hiringCompanies';
import {
  ALUMNI_DATA,
  OFFERS_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
  STUDENTS_DATA,
} from '../../data/alumConnectData';

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
      accentText: 'text-[#00d3e6]',
      accentBg: 'bg-[#0088e6]/15 border-[#00d3e6]/30',
      topBar: 'bg-gradient-to-r from-[#00d3e6] to-[#0088e6]',
    },
    {
      href: '/alumni',
      title: 'Alumni & Hiring',
      desc: 'Inspect live student codebases, leave 5-minute architecture roasts, issue Vouch Cards, and fast-track hire.',
      cta: 'Open Alumni Marketplace',
      icon: <Briefcase className="w-5 h-5" />,
      badge: 'For Recruiters',
      accentText: 'text-[#38bdf8]',
      accentBg: 'bg-[#0088e6]/15 border-[#38bdf8]/30',
      topBar: 'bg-gradient-to-r from-[#0088e6] to-[#38bdf8]',
    },
    {
      href: '/dean',
      title: 'Dean & T&P Cell',
      desc: 'Monitor verified campus placement outcomes, sprint velocity, alumni engagement, and institutional audit trails.',
      cta: 'Open Placement Telemetry',
      icon: <GraduationCap className="w-5 h-5" />,
      badge: 'For Leadership',
      accentText: 'text-[#00c8e6]',
      accentBg: 'bg-[#00c8e6]/15 border-[#00c8e6]/30',
      topBar: 'bg-gradient-to-r from-[#00c8e6] to-[#00d3e6]',
    },
  ];

  return (
    <div
      className="font-luma-body relative h-dvh w-full overflow-hidden text-white grid grid-rows-[auto_1fr_auto]"
      style={{
        background:
          'radial-gradient(1100px 620px at 12% 18%, rgba(16, 134, 168, 0.42) 0%, transparent 62%), radial-gradient(900px 600px at 78% 28%, rgba(12, 108, 138, 0.36) 0%, transparent 60%), radial-gradient(950px 560px at 52% 88%, rgba(9, 88, 114, 0.42) 0%, transparent 62%), linear-gradient(135deg, #021c29 0%, #053447 42%, #07465d 68%, #021a26 100%)',
      }}
    >
      {/* Fine stippled shader grain matching Luma Ocean screenshot */}
      <svg
        className="pointer-events-none fixed inset-0 h-full w-full opacity-[0.18] mix-blend-overlay"
        aria-hidden="true"
      >
        <filter id="luma-ocean-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#luma-ocean-grain)" />
      </svg>

      {/* NAV 4: Brand + Quick Jump Bar + Live Status + ThemeToggle */}
      <header className="relative z-10 border-b border-white/[0.1] bg-[#042433]/60 backdrop-blur-xl">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white/[0.08] border border-white/[0.14] flex items-center justify-center p-1 shadow-xs overflow-hidden">
              <img
                src="/logo.png"
                alt="AlmaConnect"
                className="h-full w-full object-contain invert"
              />
            </div>
            <div className="leading-tight">
              <span className="font-luma-title text-sm text-white">
                AlmaConnect
              </span>
              <p className="text-[11px] text-[#9ec7d6] hidden lg:block">
                Institute of Technical Education &amp; Research • Siksha &apos;O&apos; Anusandhan
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.06] backdrop-blur-md px-3.5 py-1 text-xs text-[#c7e4ee]">
            <span>Quick Jump:</span>
            <Link
              href="/student"
              className="font-mono text-[#7ce8ff] hover:underline"
            >
              /student
            </Link>
            <span className="text-white/30">•</span>
            <Link
              href="/alumni"
              className="font-mono text-[#7ce8ff] hover:underline"
            >
              /alumni
            </Link>
            <span className="text-white/30">•</span>
            <Link
              href="/dean"
              className="font-mono text-[#7ce8ff] hover:underline"
            >
              /dean
            </Link>
            <span className="text-white/30">•</span>
            <Link
              href="/login"
              className="font-mono text-[#7ce8ff] hover:underline"
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
      <main className="relative z-10 min-h-0 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-4 grid grid-rows-[minmax(0,1.45fr)_minmax(0,0.9fr)] gap-4">
        {/* HERO 1: Constellation Hero + 2x2 Telemetry */}
        <section className="relative h-full overflow-hidden rounded-2xl border border-white/[0.13] bg-[#062d3d]/55 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
            viewBox="0 0 1200 420"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <line
              x1="180"
              y1="90"
              x2="560"
              y2="210"
              stroke="#7ce8ff"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
            <line
              x1="560"
              y1="210"
              x2="940"
              y2="95"
              stroke="#38bdf8"
              strokeWidth="1.5"
            />
            <line
              x1="560"
              y1="210"
              x2="980"
              y2="310"
              stroke="#7ce8ff"
              strokeWidth="1.5"
            />
            <line
              x1="940"
              y1="95"
              x2="980"
              y2="310"
              stroke="#38bdf8"
              strokeWidth="1.25"
              strokeDasharray="4 4"
            />
            <line
              x1="180"
              y1="90"
              x2="300"
              y2="330"
              stroke="#9ec7d6"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <line
              x1="300"
              y1="330"
              x2="560"
              y2="210"
              stroke="#7ce8ff"
              strokeWidth="1.25"
            />
            <circle cx="180" cy="90" r="7" fill="#7ce8ff" />
            <circle cx="300" cy="330" r="6" fill="#38bdf8" />
            <circle cx="560" cy="210" r="11" fill="#7ce8ff" />
            <circle cx="560" cy="210" r="26" stroke="#7ce8ff" strokeOpacity="0.28" />
            <circle cx="940" cy="95" r="8" fill="#38bdf8" />
            <circle cx="980" cy="310" r="9" fill="#7ce8ff" />
          </svg>

          <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <h1 className="font-luma-title text-3xl sm:text-[42px] xl:text-[46px] text-white leading-[1.15]">
                A living graph of campus{' '}
                <span className="text-[#7ce8ff]">
                  engineering talent.
                </span>
              </h1>

              <p className="text-[14px] sm:text-[15px] text-white/85 max-w-2xl leading-[1.6]">
                Connecting{' '}
                <span className="font-semibold text-white">
                  {projectCount} verified student builds
                </span>{' '}
                directly to alumni mentors, 5-minute architecture roasts, and{' '}
                <span className="font-semibold text-[#7ce8ff]">
                  {dealCount} active hiring deals
                </span>{' '}
                across ITER.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/student"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-[#042433] hover:bg-[#e2f6fc] px-5 py-2.5 text-[13px] font-semibold transition-colors"
                >
                  Join the Graph <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/alumni"
                  className="inline-flex items-center gap-2 rounded-full border border-white/[0.18] bg-white/[0.08] hover:bg-white/[0.14] text-white px-5 py-2.5 text-[13px] font-semibold transition-colors backdrop-blur-md"
                >
                  Explore Talent Nodes
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3 h-full max-h-[250px]">
              <div className="rounded-xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-md p-5 flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#9ec7d6]">
                  Repositories
                </span>
                <div>
                  <div className="font-luma-title text-3xl text-white">{projectCount}</div>
                  <div className="text-xs text-[#b7dbe7] mt-0.5">Live Campus Builds</div>
                </div>
              </div>
              <div className="rounded-xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-md p-5 flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#9ec7d6]">
                  Marketplace
                </span>
                <div>
                  <div className="font-luma-title text-3xl text-[#7ce8ff]">
                    {dealCount}
                  </div>
                  <div className="text-xs text-[#b7dbe7] mt-0.5">
                    Deals &amp; Paid Bounties
                  </div>
                </div>
              </div>
              <div className="col-span-2 rounded-xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-md px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-white">
                    Real-Time Proof-of-Work Sync
                  </div>
                  <div className="text-xs text-[#b7dbe7]">
                    {STUDENTS_DATA.length} Students ↔ {ALUMNI_DATA.length} Alumni ↔ {OFFERS_DATA.length} Offers
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.1] border border-white/[0.16] px-3 py-1 text-xs font-semibold text-[#7ce8ff]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 mt-4 border-t border-white/[0.1] flex items-center gap-4 text-xs text-[#9ec7d6]">
            <span className="font-medium shrink-0">
              Alumni Reviewing &amp; Hiring From:
            </span>
            <div className="flex-1 min-w-0 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
              <div className="animate-marquee-left gap-8 items-center text-xs sm:text-sm font-medium text-white/90">
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
              className="group relative overflow-hidden rounded-2xl border border-white/[0.13] bg-[#062d3d]/55 hover:bg-[#08384c]/70 hover:border-white/[0.25] backdrop-blur-xl p-5 sm:p-6 transition-all flex flex-col justify-between h-full"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${p.topBar}`} />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`h-10 w-10 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}
                  >
                    {p.icon}
                  </div>
                  <span className="rounded-full bg-white/[0.08] border border-white/[0.1] px-2.5 py-0.5 text-[11px] font-medium text-[#c7e4ee]">
                    {p.badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-luma-title text-base sm:text-[18px] text-white">
                    {p.title}
                  </h3>
                  <p className="text-[13px] text-white/80 mt-1 leading-[1.55] line-clamp-2">
                    {p.desc}
                  </p>
                </div>
              </div>

              <div
                className={`pt-3 mt-3 border-t border-white/[0.1] flex items-center justify-between text-xs font-semibold ${p.accentText}`}
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
        <footer className="max-w-[1440px] mx-auto rounded-full border border-white/[0.12] bg-[#062d3d]/60 backdrop-blur-xl px-5 py-2 flex items-center justify-between text-xs text-[#9ec7d6]">
          <span className="font-luma-title text-white">
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
