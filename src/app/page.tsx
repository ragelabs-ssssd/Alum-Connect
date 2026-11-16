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

  const projectCount = summary?.db1Count ?? 18;
  const dealCount = summary?.db2Count ?? 9;

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

      {/* Main Content: Option 3 — Interactive Network Constellation */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        <section className="relative overflow-hidden rounded-3xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-7 sm:p-12 shadow-xs">
          {/* Interactive Network Constellation SVG */}
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full opacity-25 dark:opacity-30"
            viewBox="0 0 900 360"
            fill="none"
            aria-hidden="true"
          >
            <line
              x1="160"
              y1="95"
              x2="440"
              y2="175"
              stroke="#0A66C2"
              strokeWidth="1.5"
              strokeDasharray="5 5"
            />
            <line
              x1="440"
              y1="175"
              x2="720"
              y2="85"
              stroke="#0A66C2"
              strokeWidth="1.5"
            />
            <line
              x1="440"
              y1="175"
              x2="745"
              y2="255"
              stroke="#10B981"
              strokeWidth="1.5"
            />
            <line
              x1="720"
              y1="85"
              x2="745"
              y2="255"
              stroke="#6366F1"
              strokeWidth="1.25"
              strokeDasharray="4 4"
            />
            <line
              x1="160"
              y1="95"
              x2="230"
              y2="275"
              stroke="#64748B"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <line
              x1="230"
              y1="275"
              x2="440"
              y2="175"
              stroke="#0A66C2"
              strokeWidth="1.25"
            />

            <circle cx="160" cy="95" r="7" fill="#0A66C2" />
            <circle cx="160" cy="95" r="15" stroke="#0A66C2" strokeOpacity="0.25" />

            <circle cx="230" cy="275" r="6" fill="#38BDF8" />

            <circle cx="440" cy="175" r="10" fill="#0A66C2" />
            <circle cx="440" cy="175" r="22" stroke="#0A66C2" strokeOpacity="0.25" />

            <circle cx="720" cy="85" r="8" fill="#6366F1" />
            <circle cx="720" cy="85" r="18" stroke="#6366F1" strokeOpacity="0.25" />

            <circle cx="745" cy="255" r="9" fill="#10B981" />
            <circle cx="745" cy="255" r="20" stroke="#10B981" strokeOpacity="0.25" />
          </svg>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-5">
              <div className="text-xs font-mono uppercase tracking-widest text-[#0A66C2] dark:text-sky-400 font-bold">
                Student → GitHub Repo → Alumni Vouch → Offer
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#191919] dark:text-white leading-[1.12]">
                A living graph of campus{' '}
                <span className="text-[#0A66C2] dark:text-sky-400">engineering talent.</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                Connecting <span className="font-semibold text-[#191919] dark:text-white">{projectCount} student builds</span> directly to alumni mentors, architecture roasts, and <span className="font-semibold text-[#0A66C2] dark:text-sky-400">{dealCount} active hiring opportunities</span> across ITER.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/student"
                  className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-2.5 text-sm font-semibold transition-colors shadow-xs"
                >
                  Join the Graph
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/alumni"
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:border-[#0A66C2] text-[#191919] dark:text-white px-6 py-2.5 text-sm font-semibold transition-colors"
                >
                  Explore Talent Nodes
                </Link>
              </div>
            </div>

            {/* Right Constellation Telemetry */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/90 dark:bg-[#0B111D]/90 backdrop-blur p-4">
                <div className="text-2xl font-bold text-[#191919] dark:text-white">
                  {projectCount}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
                  Active Repos
                </div>
              </div>
              <div className="rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/90 dark:bg-[#0B111D]/90 backdrop-blur p-4">
                <div className="text-2xl font-bold text-[#0A66C2] dark:text-sky-400">
                  {dealCount}
                </div>
                <div className="text-[11px] text-stone-500 dark:text-slate-400 mt-0.5">
                  Deals &amp; Bounties
                </div>
              </div>
              <div className="col-span-2 rounded-2xl border border-stone-200 dark:border-slate-800 bg-stone-50/90 dark:bg-[#0B111D]/90 backdrop-blur p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#191919] dark:text-white">
                    Live Proof-of-Work Sync
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400">
                    Student ↔ Alumni ↔ Dean
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  100% Verified
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 3 Role Portals */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
            Choose your workspace
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
