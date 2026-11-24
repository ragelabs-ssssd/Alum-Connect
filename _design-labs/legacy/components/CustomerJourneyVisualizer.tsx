'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { GithubIcon } from './BrandIcons';
import {
  Search,
  Compass,
  Users,
  Rocket,
  Zap,
  Code2,
  Star,
  Briefcase,
  Play,
  Award,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Eye,
  GitBranch,
} from 'lucide-react';

export default function CustomerJourneyVisualizer() {
  const {
    products,
    openLiveDemoModal,
    openRoastModal,
    openVouchModal,
    openDealRoomModal,
    setSelectedCohortFilter,
    setActiveTab,
    setCurrentUser,
    allPresetUsers,
  } = useApp();

  const featuredProduct = products[0]; // CampusCart v2.0

  const handleCohortClick = (cohortKey: any, studentIndex: number) => {
    setSelectedCohortFilter(cohortKey);
    const student = allPresetUsers.filter((u) => u.role === 'student')[studentIndex];
    if (student) setCurrentUser(student);
    setActiveTab('feed');
  };

  const handleAlumniClick = (alumniPersona: string) => {
    const alum = allPresetUsers.find((u) => u.alumniPersona === alumniPersona);
    if (alum) setCurrentUser(alum);
    setActiveTab('feed');
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-6 text-white shadow-2xl relative overflow-hidden my-4">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl"></div>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-3 py-1 font-mono text-xs font-bold text-blue-300 border border-blue-500/30">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping"></span>
              VISUAL CUSTOMER JOURNEY
            </span>
            <span className="text-xs text-slate-400 font-mono">Cohort-to-Outcome Engine</span>
          </div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
            ITER <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">Alum Connect</span> Map
          </h2>
          <p className="mt-1 text-xs text-slate-300 max-w-2xl">
            How @soa.ac.in students progress from 1st-year campus beta testers into 4th-year acqui-hired squads via real GitHub builds and bandwidth-shielded alumni verification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('feed')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all"
          >
            Go to Live Feed <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3-Column Diagram Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Student Progression (4 Cohorts) */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-blue-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-400"></span>
              Student Progression
            </span>
            <span className="text-[10px] text-slate-400 font-mono">@soa.ac.in Verified</span>
          </div>

          {/* 1st Yr */}
          <div
            onClick={() => handleCohortClick('1st_year', 1)}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-blue-300">
                1st Yr: Scout & Beta Tester
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                Batch 2028
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-blue-300">
                <Search className="w-3 h-3" /> Search
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-blue-300">
                <Compass className="w-3 h-3" /> Explore Campus Beta
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Logs campus user traction, conducts hostel testing runs, claims discovery bounties.
            </p>
          </div>

          {/* 2nd Yr */}
          <div
            onClick={() => handleCohortClick('2nd_year', 0)}
            className="group cursor-pointer rounded-xl border border-blue-500/40 bg-gradient-to-r from-blue-950/40 to-slate-900/80 p-3.5 hover:border-blue-400 hover:bg-slate-800/80 transition-all shadow-md ring-1 ring-blue-500/20"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-blue-300 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400"></span>
                2nd Yr: Core MVP Builder Squad
              </span>
              <span className="text-[10px] font-mono text-blue-300 bg-blue-900/50 px-1.5 py-0.5 rounded">
                Batch 2027
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 bg-blue-900/40 px-2 py-0.5 rounded text-blue-200">
                <Users className="w-3 h-3" /> Collaborate
              </span>
              <span className="inline-flex items-center gap-1 bg-blue-900/40 px-2 py-0.5 rounded text-blue-200">
                <Rocket className="w-3 h-3" /> Ship Full Stack MVP
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-300">
              Forms 3-person squads, ships working prototypes, publishes GitHub repos & live demo links.
            </p>
          </div>

          {/* 3rd Yr */}
          <div
            onClick={() => handleCohortClick('3rd_year', 2)}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-amber-300">
                3rd Yr: 10-Day Bounty Sprinter
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                Batch 2026
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-amber-300">
                <Zap className="w-3 h-3" /> Sprint
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-amber-300">
                <Code2 className="w-3 h-3" /> Paid Code Bounty
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Solves industry-grade microservice tasks, tunes database indexes, earns paid stipends.
            </p>
          </div>

          {/* 4th Yr */}
          <div
            onClick={() => handleCohortClick('4th_year', 3)}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-emerald-300">
                4th Yr: Campus Lead & Off-Campus Switch
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                Batch 2025
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-emerald-300">
                <Star className="w-3 h-3" /> Squad Lead
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded text-emerald-300">
                <Briefcase className="w-3 h-3" /> MNC Referral / Acqui-hire
              </span>
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Direct resume screen bypass via Vouch Cards, fast-tracked final round interviews.
            </p>
          </div>
        </div>

        {/* Center Column: The Hub — Product Demo & Vouch Feed */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="rounded-2xl border-2 border-indigo-500/50 bg-slate-900/90 p-4 shadow-xl shadow-indigo-500/10 relative overflow-hidden flex-1 flex flex-col justify-between">
            {/* Pulsing Corner Hub Tag */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 animate-pulse"></div>
                <span className="text-xs uppercase font-mono font-bold tracking-wider text-pink-300">
                  The Hub — Proof-of-Work
                </span>
              </div>
              <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-mono text-indigo-300 border border-indigo-500/30">
                Live Feed Card
              </span>
            </div>

            {/* Step 1: Live MVP Demo */}
            <div className="mt-3 rounded-xl border border-slate-700 bg-slate-950/80 p-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span>1. Live MVP Interactive Demo</span>
                <span className="text-[10px] text-emerald-400 font-mono">● 60s Video / Web Player</span>
              </div>
              <div className="mt-2 relative rounded-lg bg-slate-900 h-24 overflow-hidden flex items-center justify-center group cursor-pointer border border-slate-800"
                onClick={() => openLiveDemoModal(featuredProduct)}
              >
                <img
                  src={featuredProduct.previewImage}
                  alt={featuredProduct.title}
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="h-4 w-4 ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1 right-2 text-[10px] bg-black/80 px-1.5 py-0.5 rounded text-slate-300 font-mono">
                  Inspect Live Build
                </span>
              </div>
            </div>

            {/* Step 2: Building Squad */}
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">2. Building Squad</span>
                <div className="flex -space-x-1.5">
                  {featuredProduct.squadMembers.map((m, i) => (
                    <img
                      key={i}
                      src={m.avatar}
                      alt={m.name}
                      title={`${m.name} (${m.role})`}
                      className="h-6 w-6 rounded-full border border-slate-800 object-cover"
                    />
                  ))}
                </div>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="rounded bg-blue-900/50 px-1.5 py-0.5 text-[9px] font-mono text-blue-200">Sneha (2nd Yr, React)</span>
                <span className="rounded bg-purple-900/50 px-1.5 py-0.5 text-[9px] font-mono text-purple-200">Rohan (3rd Yr, Go)</span>
                <span className="rounded bg-emerald-900/50 px-1.5 py-0.5 text-[9px] font-mono text-emerald-200">Kabir (1st Yr, Ops)</span>
              </div>
            </div>

            {/* Step 3: Campus Product Card */}
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="text-blue-400 font-black">iT</span> CampusCart v2.0
                  </div>
                  <div className="text-[10px] text-slate-400">Hyperlocal 15-Min Delivery</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-bold text-emerald-400 font-mono">420+ Users</div>
                  <div className="text-[9px] text-slate-400">Hostel 1 to 12</div>
                </div>
              </div>
            </div>

            {/* Step 4: GitHub Commits Stream */}
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1">
                  <GitBranch className="w-3.5 h-3.5 text-indigo-400" /> 4. GitHub Commits
                </span>
                <span className="font-mono text-[10px] text-blue-400">148 Commits</span>
              </div>
              <div className="mt-1.5 font-mono text-[10px] text-slate-400 bg-slate-900/90 p-1.5 rounded border border-slate-800 truncate">
                branch: main • <span className="text-emerald-400">e83a9f1</span> redis geo-radius courier matching
              </div>
            </div>

            {/* Step 5: Alumni Vouch Stamp */}
            <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-300 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> 5. Alumni Vouch Stamp
                </span>
                <span className="font-mono text-[9px] bg-emerald-900/60 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-700">
                  Verified
                </span>
              </div>
              <p className="mt-1 text-[10px] text-slate-300 italic">
                "Clean React Server Components & FastAPI microservice on par with L4 industry standards."
              </p>
              <div className="mt-1 text-[10px] text-emerald-400 font-medium">
                — Vouched by Ankit Mohanty ('19, Microsoft)
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Bandwidth-Aware Alumni & Industry Router */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs uppercase tracking-wider font-mono font-bold text-indigo-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
              Alumni & Industry Router
            </span>
            <span className="text-[10px] text-slate-400 font-mono">LinkedIn Verified</span>
          </div>

          {/* Tier 1: 0-5 Yrs */}
          <div
            onClick={() => handleAlumniClick('ic')}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 hover:border-indigo-500/50 hover:bg-slate-800/80 transition-all shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-indigo-300">
                1st Tier: 0–5 Yrs Alumni
              </span>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-900/40 px-1.5 py-0.5 rounded">
                MNC IC / SDE-2
              </span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded bg-indigo-900/30 px-2 py-1 text-[10px] text-indigo-200 font-medium border border-indigo-700/50">
              <Award className="w-3 h-3 text-indigo-400" />
              Async Mock & Internal MNC Referral
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Issues "Verified Vouch Card", submits internal referrals at Microsoft, Amazon, Oracle.
            </p>
          </div>

          {/* Tier 2: 5-25 Yrs */}
          <div
            onClick={() => handleAlumniClick('manager')}
            className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/80 p-3.5 hover:border-pink-500/50 hover:bg-slate-800/80 transition-all shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-pink-300">
                2nd Tier: 5–25 Yrs Alumni
              </span>
              <span className="text-[10px] font-mono text-pink-300 bg-pink-900/40 px-1.5 py-0.5 rounded">
                Managers & Tech Leads
              </span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded bg-pink-900/30 px-2 py-1 text-[10px] text-pink-200 font-medium border border-pink-700/50">
              <Zap className="w-3 h-3 text-pink-400" />
              5-Min Async Roast, Freelance Task & Keynote
            </div>
            <p className="mt-2 text-[11px] text-slate-400">
              Drops pinned annotations on architecture, bypasses resume screening for top squads.
            </p>
          </div>

          {/* Tier 3: Founders & CHROs */}
          <div
            onClick={() => handleAlumniClick('founder')}
            className="group cursor-pointer rounded-xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 to-slate-900/80 p-3.5 hover:border-emerald-400 hover:bg-slate-800/80 transition-all shadow-md ring-1 ring-emerald-500/20"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-emerald-300">
                3rd Tier: Founders & CHROs
              </span>
              <span className="text-[10px] font-mono text-emerald-300 bg-emerald-900/40 px-1.5 py-0.5 rounded">
                Decision Leads
              </span>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded bg-emerald-900/30 px-2 py-1 text-[10px] text-emerald-200 font-medium border border-emerald-700/50">
              <Briefcase className="w-3 h-3 text-emerald-400" />
              Direct Squad Hire & Vouched Talent Radar
            </div>
            <p className="mt-2 text-[11px] text-slate-300">
              Opens Deal Room: Acqui-hires pre-built 3-person squads or rolls out campus drive slots.
            </p>
          </div>

          {/* Bandwidth Shield Highlight */}
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-400 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Zero-Spam Bandwidth Shield:</span>
              <p className="mt-0.5">
                Alumni only see Friday Digest of top 3 vouched projects in their domain. No cold messages.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Tagline from Graphic */}
      <div className="mt-8 pt-5 border-t border-slate-800/80 text-center">
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Build products. Showcase skills. Connect with alumni. Unlock opportunities.
        </p>
      </div>
    </div>
  );
}
