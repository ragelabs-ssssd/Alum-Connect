'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Briefcase,
  Code2,
  GitBranch,
  GraduationCap,
  ShieldCheck,
  Users,
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

  return (
    <div className="min-h-screen bg-[#F4F2EE] dark:bg-[#0B0F17] text-[#191919] dark:text-slate-100 flex flex-col justify-between transition-colors">
      {/* Top LinkedIn-style Clean Header */}
      <header className="sticky top-0 z-30 border-b border-stone-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-[#131A26]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              in
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-[#191919] dark:text-white">
                  ITER Alum Connect
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-sky-500/10 border border-blue-200/80 dark:border-sky-500/25 px-2 py-0.5 text-[10px] font-semibold text-[#0A66C2] dark:text-sky-400">
                  <GitBranch className="w-3 h-3" />
                  Proof-of-Work Network
                </span>
              </div>
              <p className="text-[11px] text-stone-500 dark:text-slate-400 hidden sm:block">
                Siksha &apos;O&apos; Anusandhan • Engineering Talent &amp; Alumni Network
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {summary ? `${summary.db1Count} Active Projects` : 'Network Online'}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero + Portal Selection */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#191919] dark:text-white leading-[1.12]">
              Turn every student build into a{' '}
              <span className="text-[#0A66C2] dark:text-sky-400">verified career signal.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              A professional social platform built for IT builders and alumni. Students share project milestones with live GitHub repository showcases; alumni review architecture, endorse real skills, and hire directly.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/student"
                className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow-xs"
              >
                Enter Student Feed
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/alumni"
                className="inline-flex items-center gap-2 rounded-full border border-[#0A66C2] dark:border-sky-500/60 bg-white dark:bg-transparent hover:bg-blue-50 dark:hover:bg-sky-500/10 text-[#0A66C2] dark:text-sky-400 px-5 py-2.5 text-sm font-semibold transition-colors"
              >
                Explore Alumni Hiring
              </Link>
            </div>
          </div>

          {/* Right Preview Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#0A66C2] to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                    SA
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#191919] dark:text-white">
                      Campus Proof-of-Work Stream
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-slate-400">
                      Live sync across Student, Alumni &amp; Dean
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
                  Live
                </span>
              </div>

              <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50/80 dark:bg-[#0B111D] p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-[#191919] dark:text-slate-200">
                    <Code2 className="w-3.5 h-3.5 text-[#0A66C2] dark:text-sky-400" />
                    iter-labs/ragelabs-tracker
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-slate-400">main</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-slate-400">
                  Embedded GitHub repo cards inside clean LinkedIn-style project updates.
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-500 dark:text-slate-400">
                  <span className="rounded bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-2 py-0.5">
                    Next.js
                  </span>
                  <span className="rounded bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-2 py-0.5">
                    TypeScript
                  </span>
                  <span className="ml-auto font-medium text-[#0A66C2] dark:text-sky-400">
                    Verified Vouch Ready
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="rounded-xl bg-stone-50 dark:bg-slate-900/70 border border-stone-100 dark:border-slate-800 p-2.5">
                  <div className="text-base font-bold text-[#191919] dark:text-white">
                    {summary?.db1Count ?? 10}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400">Projects</div>
                </div>
                <div className="rounded-xl bg-stone-50 dark:bg-slate-900/70 border border-stone-100 dark:border-slate-800 p-2.5">
                  <div className="text-base font-bold text-[#0A66C2] dark:text-sky-400">
                    {summary?.db2Count ?? 9}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400">Deals &amp; Gigs</div>
                </div>
                <div className="rounded-xl bg-stone-50 dark:bg-slate-900/70 border border-stone-100 dark:border-slate-800 p-2.5">
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    100%
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400">Verified</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Role Portals */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Choose your workspace
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Student Portal */}
            <Link
              href="/student"
              className="group rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] hover:border-[#0A66C2] dark:hover:border-sky-500/60 p-6 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-blue-50 dark:bg-sky-500/10 border border-blue-200/80 dark:border-sky-500/25 flex items-center justify-center text-[#0A66C2] dark:text-sky-400">
                    <Code2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-stone-400 dark:text-slate-500">
                    /student
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#191919] dark:text-white">
                    Student Network
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Share project updates, attach GitHub repos, highlight verified skills, and discover what campus squads are building.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#0A66C2] dark:text-sky-400">
                <span>Open Student Feed</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Alumni Portal */}
            <Link
              href="/alumni"
              className="group rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] hover:border-[#0A66C2] dark:hover:border-sky-500/60 p-6 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/25 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-stone-400 dark:text-slate-500">
                    /alumni
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#191919] dark:text-white">
                    Alumni &amp; Hiring
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Review student repositories, leave 5-minute architecture roasts, endorse skills with Vouches, and fast-track hire.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Open Alumni Marketplace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Dean Portal */}
            <Link
              href="/dean"
              className="group rounded-2xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] hover:border-emerald-600 dark:hover:border-emerald-500/60 p-6 transition-all shadow-2xs hover:shadow-md flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/25 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono text-stone-400 dark:text-slate-500">
                    /dean
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#191919] dark:text-white">
                    Dean &amp; T&amp;P Cell
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Track verified campus placement outcomes, sprint velocity, alumni engagement, and institutional audit trails.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                <span>Open Placement Telemetry</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/90 dark:border-slate-800/80 bg-white/60 dark:bg-[#131A26]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Verified Campus Identity
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#0A66C2] dark:text-sky-400" />
              Skill Endorsements
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Squad Collaboration
            </span>
          </div>
          <span>ITER • Siksha &apos;O&apos; Anusandhan</span>
        </div>
      </footer>
    </div>
  );
}
