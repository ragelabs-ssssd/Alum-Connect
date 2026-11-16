'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Code2,
  GraduationCap,
} from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

interface GatewaySummary {
  status: string;
  db1Count: number;
  db2Count: number;
  db3Status: string;
}

export default function HomePage() {
  const [summary, setSummary] = useState<GatewaySummary | null>(null);

  useEffect(() => {
    fetch('/api/gateway')
      .then((r) => r.json())
      .then((d: GatewaySummary) => {
        if (d?.status === 'ok') setSummary(d);
      })
      .catch(() => {});
  }, []);

  const projectCount = summary?.db1Count ?? 18;
  const dealCount = summary?.db2Count ?? 9;

  const portals = [
    {
      href: '/student',
      title: 'Student Network',
      desc: 'Publish GitHub repository showcases, track sprint tasks, and follow what campus squads are shipping.',
      cta: 'Open Student Feed',
      icon: <Code2 className="w-5 h-5" />,
      badge: 'For Builders',
      accentText: 'text-[#0A66C2] dark:text-sky-400',
      accentBg:
        'bg-blue-50 dark:bg-sky-500/10 border-blue-200/80 dark:border-sky-500/25',
      topBar: 'bg-[#0A66C2]',
    },
    {
      href: '/alumni',
      title: 'Alumni & Hiring',
      desc: 'Inspect live student codebases, leave 5-minute architecture roasts, issue Vouch Cards, and fast-track hire.',
      cta: 'Open Alumni Marketplace',
      icon: <Briefcase className="w-5 h-5" />,
      badge: 'For Recruiters',
      accentText: 'text-indigo-600 dark:text-indigo-400',
      accentBg:
        'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200/80 dark:border-indigo-500/25',
      topBar: 'bg-indigo-600',
    },
    {
      href: '/dean',
      title: 'Dean & T&P Cell',
      desc: 'Monitor verified campus placement outcomes, sprint velocity, alumni engagement, and institutional audit trails.',
      cta: 'Open Placement Telemetry',
      icon: <GraduationCap className="w-5 h-5" />,
      badge: 'For Leadership',
      accentText: 'text-emerald-700 dark:text-emerald-400',
      accentBg:
        'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200/80 dark:border-emerald-500/25',
      topBar: 'bg-emerald-600',
    },
  ];

  return (
    <div className="h-dvh w-full overflow-hidden bg-[#F4F2EE] dark:bg-[#0B0F17] text-[#191919] dark:text-slate-100 grid grid-rows-[auto_1fr_auto] transition-colors">
      {/* NAV 4: Brand + Quick Jump Bar + Live Status + ThemeToggle */}
      <header className="border-b border-stone-200/90 dark:border-slate-800/80 bg-white/95 dark:bg-[#131A26]/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 flex items-center justify-center p-1 shadow-xs overflow-hidden">
              <img
                src="/logo.png"
                alt="ITER Alum Connect"
                className="h-full w-full object-contain dark:invert"
              />
            </div>
            <div className="leading-tight">
              <span className="font-bold text-sm tracking-tight text-[#191919] dark:text-white">
                ITER Alum Connect
              </span>
              <p className="text-[11px] text-stone-500 dark:text-slate-400 hidden lg:block">
                Institute of Technical Education &amp; Research • Siksha &apos;O&apos; Anusandhan
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2.5 rounded-full border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 px-3.5 py-1 text-xs text-stone-500 dark:text-slate-400">
            <span>Quick Jump:</span>
            <Link
              href="/student"
              className="font-mono text-[#0A66C2] dark:text-sky-400 hover:underline"
            >
              /student
            </Link>
            <span>•</span>
            <Link
              href="/alumni"
              className="font-mono text-[#0A66C2] dark:text-sky-400 hover:underline"
            >
              /alumni
            </Link>
            <span>•</span>
            <Link
              href="/dean"
              className="font-mono text-[#0A66C2] dark:text-sky-400 hover:underline"
            >
              /dean
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <ThemeToggle compact />
          </div>
        </div>
      </header>

      {/* FULL-VIEWPORT PROPORTIONAL MAIN */}
      <main className="min-h-0 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-4 grid grid-rows-[minmax(0,1.45fr)_minmax(0,0.9fr)] gap-4">
        {/* HERO 1: Constellation Hero + 2x2 Telemetry */}
        <section className="relative h-full overflow-hidden rounded-3xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-6 sm:p-8 lg:p-10 shadow-2xs flex flex-col justify-between">
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full opacity-20 dark:opacity-25"
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
              stroke="#0A66C2"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
            <line
              x1="560"
              y1="210"
              x2="940"
              y2="95"
              stroke="#0A66C2"
              strokeWidth="1.5"
            />
            <line
              x1="560"
              y1="210"
              x2="980"
              y2="310"
              stroke="#10B981"
              strokeWidth="1.5"
            />
            <line
              x1="940"
              y1="95"
              x2="980"
              y2="310"
              stroke="#6366F1"
              strokeWidth="1.25"
              strokeDasharray="4 4"
            />
            <line
              x1="180"
              y1="90"
              x2="300"
              y2="330"
              stroke="#64748B"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <line
              x1="300"
              y1="330"
              x2="560"
              y2="210"
              stroke="#0A66C2"
              strokeWidth="1.25"
            />
            <circle cx="180" cy="90" r="7" fill="#0A66C2" />
            <circle cx="300" cy="330" r="6" fill="#38BDF8" />
            <circle cx="560" cy="210" r="11" fill="#0A66C2" />
            <circle cx="560" cy="210" r="26" stroke="#0A66C2" strokeOpacity="0.22" />
            <circle cx="940" cy="95" r="8" fill="#6366F1" />
            <circle cx="980" cy="310" r="9" fill="#10B981" />
          </svg>

          <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50/80 dark:bg-sky-500/10 border border-blue-200/80 dark:border-sky-500/25 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-[#0A66C2] dark:text-sky-400 font-bold">
                Student → GitHub Repo → Alumni Vouch → Offer
              </div>

              <h1 className="text-3xl sm:text-5xl xl:text-[54px] font-bold tracking-tight text-[#191919] dark:text-white leading-[1.08]">
                A living graph of campus{' '}
                <span className="text-[#0A66C2] dark:text-sky-400">engineering talent.</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                Connecting{' '}
                <span className="font-semibold text-[#191919] dark:text-white">
                  {projectCount} verified student builds
                </span>{' '}
                directly to alumni mentors, 5-minute architecture roasts, and{' '}
                <span className="font-semibold text-[#0A66C2] dark:text-sky-400">
                  {dealCount} active hiring deals
                </span>{' '}
                across ITER.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/student"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-2.5 text-sm font-semibold transition-colors shadow-xs"
                >
                  Join the Graph <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/alumni"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 hover:border-[#0A66C2] px-6 py-2.5 text-sm font-semibold transition-colors"
                >
                  Explore Talent Nodes
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-3 h-full max-h-[250px]">
              <div className="rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/95 dark:bg-[#0B111D]/95 p-5 flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase text-stone-400">
                  Repositories
                </span>
                <div>
                  <div className="text-3xl font-bold">{projectCount}</div>
                  <div className="text-xs text-stone-500 mt-0.5">Live Campus Builds</div>
                </div>
              </div>
              <div className="rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/95 dark:bg-[#0B111D]/95 p-5 flex flex-col justify-between">
                <span className="text-[11px] font-mono uppercase text-stone-400">
                  Marketplace
                </span>
                <div>
                  <div className="text-3xl font-bold text-[#0A66C2] dark:text-sky-400">
                    {dealCount}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Deals &amp; Paid Bounties
                  </div>
                </div>
              </div>
              <div className="col-span-2 rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/95 dark:bg-[#0B111D]/95 px-5 py-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#191919] dark:text-white">
                    Real-Time Proof-of-Work Sync
                  </div>
                  <div className="text-xs text-stone-500 dark:text-slate-400">
                    Student ↔ Alumni ↔ Dean Telemetry
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 mt-4 border-t border-stone-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500 dark:text-slate-400">
            <span className="font-medium">
              Alumni Engineers Reviewing &amp; Hiring From:
            </span>
            <div className="flex flex-wrap items-center gap-5 font-semibold text-[#191919] dark:text-slate-200">
              <span>Razorpay</span>
              <span>Atlassian</span>
              <span>Microsoft</span>
              <span>Zoho</span>
              <span>Swiggy</span>
            </div>
          </div>
        </section>

        {/* CARD 3: Elevated Accent Workspace Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
          {portals.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className="group relative overflow-hidden rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] hover:border-[#0A66C2] dark:hover:border-sky-500/60 p-5 sm:p-6 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between h-full"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 ${p.topBar}`} />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`h-10 w-10 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}
                  >
                    {p.icon}
                  </div>
                  <span className="rounded-full bg-stone-100 dark:bg-slate-800 px-2.5 py-0.5 text-[11px] font-semibold text-stone-600 dark:text-slate-300">
                    {p.badge}
                  </span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#191919] dark:text-white">
                    {p.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-slate-400 mt-1 leading-relaxed line-clamp-2">
                    {p.desc}
                  </p>
                </div>
              </div>

              <div
                className={`pt-3 mt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold ${p.accentText}`}
              >
                <span>{p.cta}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* FOOT 4: Floating Glass Pill Footer */}
      <div className="px-4 sm:px-6 pb-3">
        <footer className="max-w-[1440px] mx-auto rounded-full border border-stone-200 dark:border-slate-800 bg-white/95 dark:bg-[#131A26]/95 backdrop-blur px-5 py-2 flex items-center justify-between text-xs text-stone-500 dark:text-slate-400">
          <span className="font-semibold text-[#191919] dark:text-white">
            ITER Alum Connect
          </span>
          <span>
            Institute of Technical Education &amp; Research • Siksha &apos;O&apos; Anusandhan
          </span>
        </footer>
      </div>
    </div>
  );
}
