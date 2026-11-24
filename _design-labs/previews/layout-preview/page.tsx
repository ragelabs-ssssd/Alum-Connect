'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  Award,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Code2,
  Flame,
  GitBranch,
  GraduationCap,
  Layers,
  Sparkles,
  Terminal,
  TrendingUp,
  Users,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import AlumConnectLogo from '../../components/AlumConnectLogo';
import { HIRING_COMPANIES } from '../../data/hiringCompanies';
import {
  ALUMNI_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
} from '../../data/alumConnectData';

interface LayoutOption {
  id: number;
  name: string;
  tag: string;
  summary: string;
}

const LAYOUT_OPTIONS: LayoutOption[] = [
  { id: 1, name: 'Asymmetric Bento Grid', tag: 'Bento', summary: 'Tall hero + stacked KPI/spotlight + 3-tile portal dock' },
  { id: 2, name: '55/45 Split + Vertical Stack', tag: 'Split', summary: 'Left hero & marquee, right 3 horizontal portal strips' },
  { id: 3, name: 'Interactive Role Stage', tag: 'Tabbed', summary: 'Compact hero + clickable Student/Alumni/Dean live stage' },
  { id: 4, name: 'Command Telemetry Grid', tag: 'Data', summary: 'Top 4-KPI ribbon + Hero/Live Repo Feed + bottom portal bar' },
  { id: 5, name: '3-Column Editorial Spread', tag: 'Editorial', summary: 'Hero left, live student repo feed center, portals right' },
  { id: 6, name: 'Spotlight Build + Portal Rail', tag: 'Showcase', summary: 'Hero + Featured Build of the Week + right portal stack' },
  { id: 7, name: '3-Step Proof Pipeline', tag: 'Flow', summary: 'Hero + 01 Ship -> 02 Roast -> 03 Hire pipeline + portals' },
  { id: 8, name: 'Glass Terminal + Portal Dock', tag: 'Dev', summary: 'Hero + live campus CLI terminal + portal & company grid' },
  { id: 9, name: 'Portals-First Inverted', tag: 'Reversed', summary: '3 tall portal cards on top, sleek hero CTA bar below' },
  { id: 10, name: 'Staggered Mosaic 7/5 + 5/7', tag: 'Mosaic', summary: 'Hero + live hiring deals top, campus squads + portals bottom' },
  { id: 11, name: '60/40 + Campus Leaderboard', tag: 'Social', summary: 'Left hero & compact portals, right top builders & mentors' },
  { id: 12, name: 'Centered Hero + 2x2 Matrix', tag: 'Quadrant', summary: 'Centered hero over a balanced 2x2 portal & deals quadrant' },
  { id: 13, name: 'Left Portal Rail + Canvas', tag: 'Sidebar', summary: 'Left slim 3-portal rail, right expansive hero & repo grid' },
  { id: 14, name: 'Live Repo Cards + Role Strip', tag: 'Projects', summary: 'Hero + 3 real student projects + compact 3-portal footer bar' },
  { id: 15, name: 'Stepped Diagonal Cascade', tag: 'Dynamic', summary: 'Tall hero paired with descending stepped portal cards' },
  { id: 16, name: '4-Column Swiss Grid', tag: 'Swiss', summary: '2-col hero + 1-col stacked portals + 1-col tall alumni card' },
  { id: 17, name: 'Open Poster + Unified Bar', tag: 'Minimal', summary: 'Borderless poster typography + floating 3-portal dock' },
  { id: 18, name: 'Live Activity Stream + Hero', tag: 'Live', summary: 'Left campus activity feed, right hero + 3 portal cards' },
  { id: 19, name: 'Preview Window + Hero Split', tag: 'Product', summary: 'Left hero + CTAs, right interactive portal preview frame' },
  { id: 20, name: '2-Tier Bento (8/4 + 3/6/3)', tag: 'Bento', summary: '8/4 hero+stats top, Student / Marquee+Deals / Alumni+Dean bottom' },
  { id: 21, name: 'Hairline Swiss Matrix', tag: 'Grid', summary: 'Architectural 1px-divided matrix with zero loose cards' },
  { id: 22, name: 'Story Left + Interactive Accordion', tag: 'Interactive', summary: 'Left hero & marquee, right expandable role panels' },
  { id: 23, name: 'Top Deals Ticker + 2x2 Grid', tag: 'Ticker', summary: 'Top hiring ticker + left hero + right 2x2 portal/stats grid' },
  { id: 24, name: 'Dual Builder/Recruiter Split', tag: 'Dual', summary: 'Two giant Student vs Alumni hero halves + Dean telemetry bar' },
  { id: 25, name: 'Connected Node Constellation', tag: 'Graph', summary: 'Hero + connected staggered role nodes + bottom telemetry bar' },
];

export default function LayoutPreviewPage() {
  const [selected, setSelected] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'student' | 'alumni' | 'dean'>('student');
  const [expandedRole, setExpandedRole] = useState<number>(0);

  const projectCount = PROJECTS_DATA.length + RESEARCH_PAPERS_DATA.length;
  const dealCount = ALUMNI_DATA.reduce((sum, a) => sum + a.activeJobOpeningsCount, 0);
  const topProjects = PROJECTS_DATA.slice(0, 3);
  const topAlumni = ALUMNI_DATA.slice(0, 3);

  const portals = [
    {
      id: 'student' as const,
      href: '/student',
      title: 'Student Network',
      shortTitle: 'Students',
      desc: 'Publish GitHub repository showcases, track sprint tasks, and follow what campus squads are shipping.',
      cta: 'Open Student Feed',
      metric: `${projectCount} Builds`,
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
      id: 'alumni' as const,
      href: '/alumni',
      title: 'Alumni & Hiring',
      shortTitle: 'Alumni',
      desc: 'Inspect live student codebases, leave 5-minute architecture roasts, issue Vouch Cards, and fast-track hire.',
      cta: 'Open Alumni Marketplace',
      metric: `${dealCount} Deals`,
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
      id: 'dean' as const,
      href: '/dean',
      title: 'Dean & T&P Cell',
      shortTitle: 'Dean & T&P',
      desc: 'Monitor verified campus placement outcomes, sprint velocity, alumni engagement, and institutional audit trails.',
      cta: 'Open Placement Telemetry',
      metric: '94% Verified',
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

  const currentOpt = LAYOUT_OPTIONS.find((o) => o.id === selected) ?? LAYOUT_OPTIONS[0];

  const glassCard =
    'rounded-2xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.18)] bg-white/65 dark:bg-[#14171E]/68 backdrop-blur-xl shadow-2xs';

  const MarqueeStrip = ({ compact = false }: { compact?: boolean }) => (
    <div
      className={`flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 text-xs text-[#475569] dark:text-[#94A3B8] ${
        compact ? '' : 'pt-3 border-t border-[rgba(100,116,139,0.16)] dark:border-[rgba(226,232,240,0.14)]'
      }`}
    >
      <span className="font-medium shrink-0">Alumni Reviewing &amp; Hiring From:</span>
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
  );

  const CtaPair = ({ small = false }: { small?: boolean }) => (
    <div className="flex flex-wrap items-center gap-2.5">
      <Link
        href="/student"
        className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:hover:brightness-110 dark:text-[#041E24] font-semibold transition-all shadow-xs ${
          small ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-xs sm:text-sm'
        }`}
      >
        Join the Graph <ArrowRight className="w-4 h-4 shrink-0" />
      </Link>
      <Link
        href="/alumni"
        className={`inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-[rgba(15,23,42,0.05)] dark:bg-white/[0.06] hover:border-[#0891B2] dark:hover:border-[#22D3EE] font-semibold transition-colors ${
          small ? 'px-4 py-2 text-xs' : 'px-5 py-2.5 text-xs sm:text-sm'
        }`}
      >
        Explore Talent Nodes
      </Link>
    </div>
  );

  const renderMiddle = () => {
    switch (selected) {
      case 1:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 h-full min-h-0">
            <div className={`lg:col-span-7 ${glassCard} p-6 flex flex-col justify-between gap-4`}>
              <div className="space-y-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#0891B2]/30 bg-[#0891B2]/10 dark:bg-[#22D3EE]/10 px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-[#0891B2] dark:text-[#22D3EE]">
                  <Sparkles className="w-3.5 h-3.5" /> ITER × SOA Proof-of-Work Graph
                </span>
                <h1 className="font-luma-title text-3xl sm:text-4xl xl:text-[46px] leading-[1.08] tracking-tight">
                  A living graph of campus{' '}
                  <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] max-w-xl leading-relaxed">
                  Connecting <strong className="text-[#0F172A] dark:text-white">{projectCount} verified student builds</strong> directly to alumni mentors, 5-minute architecture roasts, and{' '}
                  <strong className="text-[#0891B2] dark:text-[#22D3EE]">{dealCount} active hiring deals</strong>.
                </p>
                <CtaPair />
              </div>
              <MarqueeStrip />
            </div>

            <div className="lg:col-span-5 grid grid-rows-[auto_1fr] gap-3.5 min-h-0">
              <div className="grid grid-cols-2 gap-3.5">
                <div className={`${glassCard} p-4 flex flex-col justify-between`}>
                  <span className="text-[11px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">Verified Builds</span>
                  <div className="font-luma-title text-3xl mt-1">{projectCount}</div>
                  <span className="text-xs text-[#0891B2] dark:text-[#22D3EE]">Live campus repos</span>
                </div>
                <div className={`${glassCard} p-4 flex flex-col justify-between`}>
                  <span className="text-[11px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">Hiring Deals</span>
                  <div className="font-luma-title text-3xl mt-1 text-[#059669] dark:text-[#34D399]">{dealCount}</div>
                  <span className="text-xs text-[#475569] dark:text-[#94A3B8]">48h fast-track</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2.5 min-h-0">
                {portals.map((p) => (
                  <Link key={p.id} href={p.href} className={`${glassCard} p-4 hover:border-[#0891B2] dark:hover:border-[#22D3EE]/60 transition-all flex items-center justify-between gap-3 group`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${p.accentBg} ${p.accentText}`}>{p.icon}</div>
                      <div className="min-w-0">
                        <div className="font-luma-title text-sm">{p.title}</div>
                        <div className="text-xs text-[#475569] dark:text-[#94A3B8] truncate">{p.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform ${p.accentText}`} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center h-full min-h-0">
            <div className="lg:col-span-7 space-y-5 pr-0 lg:pr-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(100,116,139,0.25)] bg-white/60 dark:bg-white/[0.05] px-3 py-1 text-xs font-mono text-[#0891B2] dark:text-[#22D3EE]">
                LIVE CAMPUS GRAPH • ITER SOA
              </div>
              <h1 className="font-luma-title text-3xl sm:text-5xl leading-[1.08] tracking-tight">
                A living graph of campus{' '}
                <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] max-w-xl leading-relaxed">
                Skip static resumes. Ship real repositories, receive 5-minute alumni architecture roasts, and unlock {dealCount} fast-track hiring deals across {projectCount} campus builds.
              </p>
              <CtaPair />
              <MarqueeStrip />
            </div>
            <div className="lg:col-span-5 flex flex-col gap-3">
              {portals.map((p, idx) => (
                <Link key={p.id} href={p.href} className={`${glassCard} relative overflow-hidden p-5 hover:border-[#0891B2] dark:hover:border-[#22D3EE]/60 transition-all group`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${p.topBar}`} />
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}>{p.icon}</div>
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">0{idx + 1} • {p.badge}</div>
                        <h3 className="font-luma-title text-base">{p.title}</h3>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold inline-flex items-center gap-1 ${p.accentText}`}>
                      Enter <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-2.5 leading-relaxed">{p.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        );

      case 3: {
        const activePortal = portals.find((p) => p.id === activeTab) ?? portals[0];
        return (
          <div className="grid grid-rows-[auto_1fr] gap-3.5 h-full min-h-0">
            <div className={`${glassCard} p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4`}>
              <div className="space-y-1.5">
                <h1 className="font-luma-title text-2xl sm:text-4xl tracking-tight">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
                  {projectCount} verified student builds • {dealCount} active hiring deals • 5-min alumni architecture roasts
                </p>
              </div>
              <div className="flex items-center gap-1.5 p-1 rounded-full border border-[rgba(100,116,139,0.22)] bg-white/60 dark:bg-white/[0.05] shrink-0">
                {portals.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setActiveTab(p.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      activeTab === p.id
                        ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24]'
                        : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                    }`}
                  >
                    {p.shortTitle}
                  </button>
                ))}
              </div>
            </div>

            <div className={`${glassCard} p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center min-h-0`}>
              <div className="lg:col-span-6 space-y-4">
                <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${activePortal.accentBg} ${activePortal.accentText}`}>
                  {activePortal.icon} {activePortal.badge}
                </span>
                <h2 className="font-luma-title text-2xl sm:text-3xl">{activePortal.title}</h2>
                <p className="text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">{activePortal.desc}</p>
                <div className="flex items-center gap-3">
                  <Link href={activePortal.href} className="inline-flex items-center gap-2 rounded-full bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] px-5 py-2.5 text-xs sm:text-sm font-semibold">
                    {activePortal.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-xs font-mono text-[#475569] dark:text-[#94A3B8]">{activePortal.metric}</span>
                </div>
              </div>
              <div className="lg:col-span-6 space-y-2.5">
                <div className="text-[11px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">Live Graph Snapshot</div>
                {topProjects.map((proj) => (
                  <div key={proj.id} className="rounded-xl border border-[rgba(100,116,139,0.18)] bg-white/50 dark:bg-white/[0.04] p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{proj.name}</div>
                      <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] truncate">{proj.leadName} • {proj.techStack.slice(0, 3).join(', ')}</div>
                    </div>
                    <span className="text-[11px] font-mono text-[#0891B2] dark:text-[#22D3EE] shrink-0">{proj.hostingPlatform}</span>
                  </div>
                ))}
                <MarqueeStrip compact />
              </div>
            </div>
          </div>
        );
      }

      case 4:
        return (
          <div className="grid grid-rows-[auto_1fr_auto] gap-3 h-full min-h-0">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Verified Builds', val: `${projectCount}`, sub: 'GitHub linked' },
                { label: 'Active Hiring Deals', val: `${dealCount}`, sub: 'Direct referrals' },
                { label: 'Avg. Hire Time', val: '48h', sub: 'Repo to interview' },
                { label: 'Alumni Mentors', val: `${ALUMNI_DATA.length}+`, sub: 'Top tech leads' },
              ].map((s) => (
                <div key={s.label} className={`${glassCard} px-4 py-3 flex items-center justify-between`}>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">{s.label}</div>
                    <div className="text-[11px] text-[#475569] dark:text-[#94A3B8]">{s.sub}</div>
                  </div>
                  <div className="font-luma-title text-2xl text-[#0891B2] dark:text-[#22D3EE]">{s.val}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
              <div className={`lg:col-span-7 ${glassCard} p-6 flex flex-col justify-between gap-3`}>
                <h1 className="font-luma-title text-2xl sm:text-4xl leading-[1.1]">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                  Connecting {projectCount} verified student builds directly to alumni mentors, 5-minute architecture roasts, and {dealCount} active hiring deals.
                </p>
                <div className="space-y-3">
                  <CtaPair />
                  <MarqueeStrip />
                </div>
              </div>
              <div className={`lg:col-span-5 ${glassCard} p-4 flex flex-col justify-between gap-2`}>
                <div className="flex items-center justify-between text-xs font-mono uppercase text-[#475569] dark:text-[#94A3B8]">
                  <span>Latest Verified Repos</span>
                  <GitBranch className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
                </div>
                {topProjects.map((proj) => (
                  <div key={proj.id} className="rounded-xl border border-[rgba(100,116,139,0.18)] bg-white/50 dark:bg-white/[0.04] p-2.5 flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{proj.name}</div>
                      <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] truncate">{proj.hostingPlatform} • {proj.techStack.slice(0, 2).join(' · ')}</div>
                    </div>
                    <span className="text-[11px] font-mono text-[#0891B2] dark:text-[#22D3EE]">{proj.hostingPlatform}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {portals.map((p) => (
                <Link key={p.id} href={p.href} className={`${glassCard} px-4 py-3 flex items-center justify-between hover:border-[#0891B2] transition-all`}>
                  <div className="flex items-center gap-2.5">
                    <span className={p.accentText}>{p.icon}</span>
                    <span className="font-luma-title text-sm">{p.title}</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 ${p.accentText}`} />
                </Link>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 h-full min-h-0">
            <div className={`lg:col-span-4 ${glassCard} p-6 flex flex-col justify-between`}>
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase text-[#0891B2] dark:text-[#22D3EE]">Edition 2026 • ITER SOA</span>
                <h1 className="font-luma-title text-3xl leading-[1.1]">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  {projectCount} verified builds, 5-minute architecture roasts, and {dealCount} direct hiring deals without resume filtering.
                </p>
              </div>
              <CtaPair small />
            </div>

            <div className={`lg:col-span-4 ${glassCard} p-5 flex flex-col justify-between gap-3`}>
              <div className="text-xs font-mono uppercase text-[#475569] dark:text-[#94A3B8] flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" /> Shipping on Campus
              </div>
              <div className="space-y-2.5">
                {topProjects.map((proj) => (
                  <div key={proj.id} className="rounded-xl border border-[rgba(100,116,139,0.18)] bg-white/50 dark:bg-white/[0.04] p-3">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="truncate">{proj.name}</span>
                      <span className="text-[#0891B2] dark:text-[#22D3EE]">{proj.hostingPlatform}</span>
                    </div>
                    <p className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-1 line-clamp-1">{proj.shortDesc}</p>
                  </div>
                ))}
              </div>
              <MarqueeStrip />
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              {portals.map((p) => (
                <Link key={p.id} href={p.href} className={`${glassCard} flex-1 p-4 flex flex-col justify-between hover:border-[#0891B2] transition-all`}>
                  <div className="flex items-center justify-between">
                    <span className="font-luma-title text-base">{p.title}</span>
                    <span className={`text-xs font-mono ${p.accentText}`}>{p.metric}</span>
                  </div>
                  <div className={`text-xs font-semibold flex items-center justify-between mt-2 ${p.accentText}`}>
                    <span>{p.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );

      case 6: {
        const feat = topProjects[0];
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0">
            <div className="lg:col-span-8 grid grid-rows-[1fr_auto] gap-3.5 min-h-0">
              <div className={`${glassCard} p-6 flex flex-col justify-between gap-4`}>
                <div className="space-y-3">
                  <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                    A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                  </h1>
                  <p className="text-sm text-[#475569] dark:text-[#94A3B8] max-w-xl">
                    Connecting {projectCount} verified student builds to alumni mentors and {dealCount} hiring deals.
                  </p>
                  <CtaPair />
                </div>
                <MarqueeStrip />
              </div>
              <div className={`${glassCard} p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#059669] dark:text-[#34D399]">Featured Campus Build</div>
                  <div className="font-luma-title text-base">{feat.name} — <span className="text-xs font-normal text-[#475569] dark:text-[#94A3B8]">{feat.leadName}</span></div>
                </div>
                <Link href="/student" className="text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE] inline-flex items-center gap-1 shrink-0">
                  Inspect Repo <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-3">
              {portals.map((p) => (
                <Link key={p.id} href={p.href} className={`${glassCard} flex-1 p-5 flex flex-col justify-between hover:border-[#0891B2] transition-all`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}>{p.icon}</div>
                    <div>
                      <div className="font-luma-title text-sm">{p.title}</div>
                      <div className="text-[11px] text-[#475569] dark:text-[#94A3B8]">{p.badge}</div>
                    </div>
                  </div>
                  <div className={`text-xs font-semibold flex items-center justify-between pt-2 border-t border-[rgba(100,116,139,0.16)] ${p.accentText}`}>
                    <span>{p.cta}</span><ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );
      }

      case 7:
        return (
          <div className="grid grid-rows-[auto_auto_1fr] gap-3.5 h-full min-h-0">
            <div className={`${glassCard} p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4`}>
              <div>
                <h1 className="font-luma-title text-2xl sm:text-3xl">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] mt-1">
                  {projectCount} verified builds • {dealCount} active hiring deals
                </p>
              </div>
              <CtaPair small />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { step: '01', title: 'Ship Verified Repo', desc: 'Students push live GitHub builds & sprint telemetry.' },
                { step: '02', title: '5-Min Alumni Roast', desc: 'Senior alumni review architecture & leave Vouch Cards.' },
                { step: '03', title: '48h Fast-Track Hire', desc: 'Skip resume screens straight into hiring pipelines.' },
              ].map((s) => (
                <div key={s.step} className={`${glassCard} p-4 flex items-start gap-3`}>
                  <span className="font-luma-title text-lg text-[#0891B2] dark:text-[#22D3EE]">{s.step}</span>
                  <div>
                    <div className="text-xs font-semibold">{s.title}</div>
                    <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 min-h-0">
              {portals.map((p) => (
                <Link key={p.id} href={p.href} className={`${glassCard} p-5 flex flex-col justify-between hover:border-[#0891B2] transition-all`}>
                  <div className="flex items-center justify-between">
                    <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}>{p.icon}</div>
                    <span className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8]">{p.metric}</span>
                  </div>
                  <div>
                    <h3 className="font-luma-title text-base">{p.title}</h3>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 line-clamp-2">{p.desc}</p>
                  </div>
                  <div className={`text-xs font-semibold flex items-center justify-between pt-2 border-t border-[rgba(100,116,139,0.16)] ${p.accentText}`}>
                    <span>{p.cta}</span><ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );

      case 8:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0">
            <div className={`lg:col-span-6 ${glassCard} p-6 flex flex-col justify-between gap-4`}>
              <div className="space-y-3">
                <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                  {projectCount} verified student builds • {dealCount} active hiring deals
                </p>
                <CtaPair />
              </div>
              <div className="rounded-xl bg-[#0B0D12] text-zinc-200 border border-zinc-800 p-4 font-mono text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-[#22D3EE]">
                  <Terminal className="w-3.5 h-3.5" /> $ alma graph --campus iter --live
                </div>
                <div className="text-zinc-400">&gt; {projectCount} student repos verified via GitHub</div>
                <div className="text-emerald-400">&gt; {dealCount} alumni hiring deals open for fast-track</div>
                <div className="text-zinc-400">&gt; avg_interview_turnaround: 48h</div>
              </div>
            </div>
            <div className="lg:col-span-6 flex flex-col justify-between gap-3">
              <div className="grid grid-cols-1 gap-3 flex-1">
                {portals.map((p) => (
                  <Link key={p.id} href={p.href} className={`${glassCard} p-4 flex items-center justify-between hover:border-[#0891B2] transition-all`}>
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}>{p.icon}</div>
                      <div>
                        <div className="font-luma-title text-base">{p.title}</div>
                        <div className="text-xs text-[#475569] dark:text-[#94A3B8] line-clamp-1">{p.desc}</div>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 ${p.accentText}`} />
                  </Link>
                ))}
              </div>
              <div className={`${glassCard} px-4 py-3`}><MarqueeStrip compact /></div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="grid grid-rows-[1fr_auto] gap-4 h-full min-h-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
              {portals.map((p) => (
                <Link key={p.id} href={p.href} className={`${glassCard} relative overflow-hidden p-6 flex flex-col justify-between hover:border-[#0891B2] transition-all`}>
                  <div className={`absolute top-0 left-0 right-0 h-1 ${p.topBar}`} />
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`h-11 w-11 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}>{p.icon}</div>
                      <span className="rounded-full bg-white/60 dark:bg-white/[0.06] px-2.5 py-0.5 text-[11px] font-semibold">{p.badge}</span>
                    </div>
                    <h2 className="font-luma-title text-xl">{p.title}</h2>
                    <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">{p.desc}</p>
                  </div>
                  <div className={`pt-3 border-t border-[rgba(100,116,139,0.16)] flex items-center justify-between text-xs font-semibold ${p.accentText}`}>
                    <span>{p.cta}</span><ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
            <div className={`${glassCard} p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4`}>
              <div className="space-y-1">
                <h1 className="font-luma-title text-xl sm:text-2xl">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <MarqueeStrip compact />
              </div>
              <CtaPair small />
            </div>
          </div>
        );

      case 10:
        return (
          <div className="grid grid-rows-[1.15fr_0.85fr] gap-3.5 h-full min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0">
              <div className={`lg:col-span-7 ${glassCard} p-6 flex flex-col justify-between`}>
                <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                  {projectCount} verified builds connected directly to {dealCount} alumni hiring deals.
                </p>
                <CtaPair />
              </div>
              <div className={`lg:col-span-5 ${glassCard} p-5 flex flex-col justify-between`}>
                <div className="text-xs font-mono uppercase text-[#059669] dark:text-[#34D399]">Active Alumni Hiring Deals</div>
                <div className="space-y-2">
                  {topAlumni.map((a) => (
                    <div key={a.id} className="flex items-center justify-between text-xs rounded-xl bg-white/50 dark:bg-white/[0.04] px-3 py-2 border border-[rgba(100,116,139,0.16)]">
                      <span className="font-semibold truncate">{a.fullName} • {a.company}</span>
                      <span className="text-[#059669] dark:text-[#34D399] font-mono shrink-0">{a.activeJobOpeningsCount} roles</span>
                    </div>
                  ))}
                </div>
                <MarqueeStrip compact />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0">
              <div className={`lg:col-span-5 ${glassCard} p-4 flex items-center justify-between gap-4`}>
                <div>
                  <div className="text-[11px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">Proof Velocity</div>
                  <div className="font-luma-title text-2xl mt-1">48 Hours</div>
                  <div className="text-xs text-[#475569] dark:text-[#94A3B8]">Median repo-to-interview</div>
                </div>
                <TrendingUp className="w-8 h-8 text-[#0891B2] dark:text-[#22D3EE]" />
              </div>
              <div className="lg:col-span-7 grid grid-cols-3 gap-3">
                {portals.map((p) => (
                  <Link key={p.id} href={p.href} className={`${glassCard} p-4 flex flex-col justify-between hover:border-[#0891B2] transition-all`}>
                    <span className={p.accentText}>{p.icon}</span>
                    <div>
                      <div className="font-luma-title text-sm">{p.shortTitle}</div>
                      <div className={`text-[11px] font-semibold mt-0.5 ${p.accentText}`}>Enter →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );

      case 11:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0">
            <div className="lg:col-span-7 flex flex-col justify-between gap-3.5">
              <div className={`${glassCard} p-6 space-y-4`}>
                <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                  Connecting {projectCount} verified student builds to alumni mentors and {dealCount} hiring deals.
                </p>
                <CtaPair />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {portals.map((p) => (
                  <Link key={p.id} href={p.href} className={`${glassCard} p-4 flex flex-col justify-between hover:border-[#0891B2] transition-all`}>
                    <div className="flex items-center justify-between">
                      <span className={p.accentText}>{p.icon}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#475569]" />
                    </div>
                    <div className="font-luma-title text-sm mt-3">{p.title}</div>
                  </Link>
                ))}
              </div>
            </div>
            <div className={`lg:col-span-5 ${glassCard} p-5 flex flex-col justify-between gap-3`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-[#0891B2] dark:text-[#22D3EE]">Top Verified Builders</span>
                <Award className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
              </div>
              <div className="space-y-2.5">
                {topProjects.map((proj, i) => (
                  <div key={proj.id} className="rounded-xl border border-[rgba(100,116,139,0.18)] bg-white/50 dark:bg-white/[0.04] p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-luma-title text-sm text-[#0891B2] dark:text-[#22D3EE]">#{i + 1}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold truncate">{proj.leadName}</div>
                        <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] truncate">{proj.name}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono">{proj.hostingPlatform}</span>
                  </div>
                ))}
              </div>
              <MarqueeStrip />
            </div>
          </div>
        );

      case 12:
        return (
          <div className="grid grid-rows-[auto_1fr] gap-3.5 h-full min-h-0">
            <div className={`${glassCard} p-5 text-center space-y-2.5`}>
              <h1 className="font-luma-title text-2xl sm:text-4xl">
                A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] max-w-2xl mx-auto">
                Connecting {projectCount} verified student builds to alumni mentors, 5-minute roasts, and {dealCount} active hiring deals.
              </p>
              <div className="flex justify-center pt-1"><CtaPair small /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 min-h-0">
              {portals.map((p) => (
                <Link key={p.id} href={p.href} className={`${glassCard} p-5 flex items-center justify-between gap-4 hover:border-[#0891B2] transition-all`}>
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 ${p.accentBg} ${p.accentText}`}>{p.icon}</div>
                    <div className="min-w-0">
                      <h3 className="font-luma-title text-base">{p.title}</h3>
                      <p className="text-xs text-[#475569] dark:text-[#94A3B8] truncate">{p.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 ${p.accentText}`} />
                </Link>
              ))}
              <div className={`${glassCard} p-5 flex flex-col justify-center`}>
                <MarqueeStrip compact />
              </div>
            </div>
          </div>
        );

      case 13:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0">
            <div className="lg:col-span-3 flex flex-col gap-3">
              {portals.map((p) => (
                <Link key={p.id} href={p.href} className={`${glassCard} flex-1 p-4 flex flex-col justify-between hover:border-[#0891B2] transition-all`}>
                  <div className="flex items-center justify-between">
                    <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}>{p.icon}</div>
                    <span className="text-[11px] font-mono">{p.metric}</span>
                  </div>
                  <div>
                    <div className="font-luma-title text-base">{p.title}</div>
                    <div className={`text-xs font-semibold mt-1 inline-flex items-center gap-1 ${p.accentText}`}>
                      {p.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className={`lg:col-span-9 ${glassCard} p-6 flex flex-col justify-between gap-4`}>
              <div className="space-y-3">
                <h1 className="font-luma-title text-3xl sm:text-5xl leading-[1.08]">
                  A living graph of campus{' '}
                  <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] max-w-2xl">
                  Connecting {projectCount} verified student builds directly to alumni mentors, 5-minute architecture roasts, and {dealCount} active hiring deals.
                </p>
                <CtaPair />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {topProjects.map((proj) => (
                  <div key={proj.id} className="rounded-xl border border-[rgba(100,116,139,0.18)] bg-white/50 dark:bg-white/[0.04] p-3">
                    <div className="text-xs font-semibold truncate">{proj.name}</div>
                    <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-1">{proj.leadName} • {proj.hostingPlatform}</div>
                  </div>
                ))}
              </div>
              <MarqueeStrip />
            </div>
          </div>
        );

      case 14:
        return (
          <div className="grid grid-rows-[auto_1fr_auto] gap-3.5 h-full min-h-0">
            <div className={`${glassCard} p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4`}>
              <h1 className="font-luma-title text-2xl sm:text-4xl">
                A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
              </h1>
              <CtaPair small />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 min-h-0">
              {topProjects.map((proj) => (
                <div key={proj.id} className={`${glassCard} p-5 flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-[#0891B2] dark:text-[#22D3EE]">
                      <span>VERIFIED REPO</span><span>{proj.hostingPlatform}</span>
                    </div>
                    <h3 className="font-luma-title text-base mt-2">{proj.name}</h3>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 line-clamp-2">{proj.shortDesc}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-3">
                    {proj.techStack.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-full bg-white/60 dark:bg-white/[0.06] px-2.5 py-0.5 text-[10px] font-mono">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {portals.map((p) => (
                <Link key={p.id} href={p.href} className={`${glassCard} px-4 py-3 flex items-center justify-between hover:border-[#0891B2] transition-all`}>
                  <span className="font-luma-title text-sm">{p.title}</span>
                  <span className={`text-xs font-semibold ${p.accentText}`}>Open →</span>
                </Link>
              ))}
            </div>
          </div>
        );

      case 15:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch h-full min-h-0">
            <div className={`lg:col-span-5 ${glassCard} p-6 flex flex-col justify-between`}>
              <div className="space-y-4">
                <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                  {projectCount} verified builds · {dealCount} active hiring deals
                </p>
                <CtaPair />
              </div>
              <MarqueeStrip />
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              {portals.map((p, i) => (
                <Link
                  key={p.id}
                  href={p.href}
                  className={`${glassCard} p-5 flex flex-col justify-between hover:border-[#0891B2] transition-all ${
                    i === 0 ? 'lg:h-full' : i === 1 ? 'lg:h-[88%]' : 'lg:h-[76%]'
                  }`}
                >
                  <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}>{p.icon}</div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">{p.badge}</div>
                    <h3 className="font-luma-title text-base mt-1">{p.title}</h3>
                    <div className={`text-xs font-semibold mt-2 inline-flex items-center gap-1 ${p.accentText}`}>
                      Enter <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        );

      case 16:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 h-full min-h-0">
            <div className={`lg:col-span-6 ${glassCard} p-6 flex flex-col justify-between`}>
              <div className="space-y-3">
                <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                  Connecting {projectCount} verified student builds to alumni mentors and {dealCount} hiring deals.
                </p>
                <CtaPair />
              </div>
              <MarqueeStrip />
            </div>
            <div className="lg:col-span-3 flex flex-col gap-3.5">
              {[portals[0], portals[2]].map((p) => (
                <Link key={p.id} href={p.href} className={`${glassCard} flex-1 p-5 flex flex-col justify-between hover:border-[#0891B2] transition-all`}>
                  <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}>{p.icon}</div>
                  <div>
                    <h3 className="font-luma-title text-base">{p.title}</h3>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 line-clamp-2">{p.desc}</p>
                  </div>
                  <span className={`text-xs font-semibold ${p.accentText}`}>{p.cta} →</span>
                </Link>
              ))}
            </div>
            <Link href={portals[1].href} className={`lg:col-span-3 ${glassCard} p-5 flex flex-col justify-between hover:border-[#059669] transition-all`}>
              <div className="space-y-3">
                <div className={`h-10 w-10 rounded-xl border flex items-center justify-center ${portals[1].accentBg} ${portals[1].accentText}`}>{portals[1].icon}</div>
                <h3 className="font-luma-title text-xl">{portals[1].title}</h3>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">{portals[1].desc}</p>
              </div>
              <div className="space-y-3">
                <div className="rounded-xl bg-white/50 dark:bg-white/[0.04] p-3 border border-[rgba(100,116,139,0.16)]">
                  <div className="font-luma-title text-2xl text-[#059669] dark:text-[#34D399]">{dealCount} Deals</div>
                  <div className="text-[11px] text-[#475569] dark:text-[#94A3B8]">Fast-track alumni referrals</div>
                </div>
                <div className={`text-xs font-semibold flex items-center justify-between ${portals[1].accentText}`}>
                  <span>{portals[1].cta}</span><ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        );

      case 17:
        return (
          <div className="flex flex-col justify-between h-full min-h-0 py-4 gap-6">
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl mx-auto space-y-5">
              <span className="rounded-full border border-[rgba(100,116,139,0.25)] px-3.5 py-1 text-xs font-mono text-[#0891B2] dark:text-[#22D3EE]">
                {projectCount} VERIFIED BUILDS • {dealCount} HIRING DEALS
              </span>
              <h1 className="font-luma-title text-4xl sm:text-6xl leading-[1.06] tracking-tight">
                A living graph of campus{' '}
                <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
              </h1>
              <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] max-w-xl">
                Ship live repositories, get 5-minute alumni architecture roasts, and unlock fast-track campus hiring.
              </p>
              <CtaPair />
              <div className="w-full max-w-2xl pt-2"><MarqueeStrip compact /></div>
            </div>
            <div className={`${glassCard} p-2 grid grid-cols-1 md:grid-cols-3 gap-2`}>
              {portals.map((p) => (
                <Link key={p.id} href={p.href} className="rounded-xl px-4 py-3 hover:bg-white/60 dark:hover:bg-white/[0.06] transition-all flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={p.accentText}>{p.icon}</span>
                    <span className="font-luma-title text-sm">{p.title}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#475569]" />
                </Link>
              ))}
            </div>
          </div>
        );

      case 18:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0">
            <div className={`lg:col-span-4 ${glassCard} p-5 flex flex-col justify-between gap-3`}>
              <div className="flex items-center justify-between text-xs font-mono uppercase text-[#0891B2] dark:text-[#22D3EE]">
                <span>Live Campus Pulse</span><Activity className="w-4 h-4" />
              </div>
              <div className="space-y-2.5">
                {topProjects.map((proj) => (
                  <div key={proj.id} className="rounded-xl border border-[rgba(100,116,139,0.16)] bg-white/50 dark:bg-white/[0.04] p-3 text-xs">
                    <div className="font-semibold">{proj.leadName} shipped {proj.name}</div>
                    <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">{proj.hostingPlatform} · {proj.techStack.slice(0, 2).join(', ')}</div>
                  </div>
                ))}
                {topAlumni.slice(0, 2).map((a) => (
                  <div key={a.id} className="rounded-xl border border-[rgba(100,116,139,0.16)] bg-white/50 dark:bg-white/[0.04] p-3 text-xs">
                    <div className="font-semibold text-[#059669] dark:text-[#34D399]">{a.fullName} ({a.company})</div>
                    <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">{a.activeJobOpeningsCount} active hiring deals open</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-rows-[1fr_auto] gap-3.5 min-h-0">
              <div className={`${glassCard} p-6 flex flex-col justify-between`}>
                <div className="space-y-3">
                  <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                    A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                  </h1>
                  <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                    Connecting {projectCount} verified builds to alumni mentors and {dealCount} hiring deals.
                  </p>
                  <CtaPair />
                </div>
                <MarqueeStrip />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {portals.map((p) => (
                  <Link key={p.id} href={p.href} className={`${glassCard} p-4 flex items-center justify-between hover:border-[#0891B2] transition-all`}>
                    <span className="font-luma-title text-sm">{p.shortTitle}</span>
                    <ArrowRight className={`w-4 h-4 ${p.accentText}`} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );

      case 19:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center h-full min-h-0">
            <div className="lg:col-span-6 space-y-4">
              <h1 className="font-luma-title text-3xl sm:text-5xl leading-[1.08]">
                A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
              </h1>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                Connecting {projectCount} verified student builds to alumni mentors, 5-minute roasts, and {dealCount} active hiring deals.
              </p>
              <CtaPair />
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {portals.map((p) => (
                  <Link key={p.id} href={p.href} className={`${glassCard} p-3 text-center hover:border-[#0891B2] transition-all`}>
                    <div className={`text-xs font-semibold ${p.accentText}`}>{p.shortTitle} →</div>
                  </Link>
                ))}
              </div>
              <MarqueeStrip />
            </div>
            <div className={`lg:col-span-6 ${glassCard} overflow-hidden`}>
              <div className="px-4 py-2.5 border-b border-[rgba(100,116,139,0.18)] flex items-center justify-between text-[11px] font-mono text-[#475569] dark:text-[#94A3B8]">
                <span>almaconnect.iter.soa / live-graph</span>
                <span className="text-[#059669] dark:text-[#34D399]">● LIVE</span>
              </div>
              <div className="p-5 space-y-3">
                {topProjects.map((proj) => (
                  <div key={proj.id} className="rounded-xl border border-[rgba(100,116,139,0.16)] bg-white/50 dark:bg-white/[0.04] p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-luma-title text-sm">{proj.name}</div>
                      <div className="text-xs text-[#475569] dark:text-[#94A3B8]">{proj.leadName} • {proj.techStack.slice(0, 3).join(' · ')}</div>
                    </div>
                    <span className="rounded-full bg-[#0891B2]/15 text-[#0891B2] dark:text-[#22D3EE] px-2.5 py-0.5 text-xs font-mono">{proj.hostingPlatform}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 20:
        return (
          <div className="grid grid-rows-[1fr_auto] gap-3.5 h-full min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0">
              <div className={`lg:col-span-8 ${glassCard} p-6 flex flex-col justify-between`}>
                <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                  Connecting {projectCount} verified student builds to alumni mentors and {dealCount} active hiring deals.
                </p>
                <CtaPair />
              </div>
              <div className="lg:col-span-4 grid grid-rows-2 gap-3.5">
                <div className={`${glassCard} p-4 flex items-center justify-between`}>
                  <div><div className="text-[11px] font-mono uppercase">Repositories</div><div className="font-luma-title text-3xl">{projectCount}</div></div>
                  <Code2 className="w-7 h-7 text-[#0891B2] dark:text-[#22D3EE]" />
                </div>
                <div className={`${glassCard} p-4 flex items-center justify-between`}>
                  <div><div className="text-[11px] font-mono uppercase">Hiring Deals</div><div className="font-luma-title text-3xl text-[#059669] dark:text-[#34D399]">{dealCount}</div></div>
                  <Briefcase className="w-7 h-7 text-[#059669] dark:text-[#34D399]" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
              <Link href="/student" className={`lg:col-span-3 ${glassCard} p-4 flex items-center justify-between hover:border-[#0891B2]`}>
                <span className="font-luma-title text-sm">Student Network</span><ArrowRight className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
              </Link>
              <div className={`lg:col-span-6 ${glassCard} p-4 flex items-center`}><MarqueeStrip compact /></div>
              <div className="lg:col-span-3 grid grid-cols-2 gap-2.5">
                <Link href="/alumni" className={`${glassCard} p-4 flex items-center justify-between hover:border-[#059669]`}>
                  <span className="font-luma-title text-xs">Alumni</span><ArrowRight className="w-3.5 h-3.5 text-[#059669] dark:text-[#34D399]" />
                </Link>
                <Link href="/dean" className={`${glassCard} p-4 flex items-center justify-between hover:border-[#0891B2]`}>
                  <span className="font-luma-title text-xs">Dean</span><ArrowRight className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
                </Link>
              </div>
            </div>
          </div>
        );

      case 21:
        return (
          <div className="rounded-3xl border border-[rgba(100,116,139,0.28)] dark:border-[rgba(226,232,240,0.20)] bg-white/60 dark:bg-[#12151C]/70 backdrop-blur-xl overflow-hidden grid grid-rows-[1fr_auto_auto] h-full min-h-0 divide-y divide-[rgba(100,116,139,0.22)] dark:divide-[rgba(226,232,240,0.16)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[rgba(100,116,139,0.22)] dark:divide-[rgba(226,232,240,0.16)]">
              <div className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between gap-4">
                <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <CtaPair />
              </div>
              <div className="lg:col-span-4 p-6 flex flex-col justify-center gap-3">
                <div><div className="text-[11px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">Verified Builds</div><div className="font-luma-title text-3xl">{projectCount}</div></div>
                <div><div className="text-[11px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">Active Deals</div><div className="font-luma-title text-3xl text-[#059669] dark:text-[#34D399]">{dealCount}</div></div>
              </div>
            </div>
            <div className="px-6 py-3"><MarqueeStrip compact /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[rgba(100,116,139,0.22)] dark:divide-[rgba(226,232,240,0.16)]">
              {portals.map((p) => (
                <Link key={p.id} href={p.href} className="p-5 hover:bg-white/40 dark:hover:bg-white/[0.04] transition-colors flex flex-col justify-between gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-luma-title text-base">{p.title}</span>
                    <ArrowRight className={`w-4 h-4 ${p.accentText}`} />
                  </div>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] line-clamp-1">{p.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        );

      case 22:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center h-full min-h-0">
            <div className={`lg:col-span-7 ${glassCard} p-6 sm:p-8 space-y-5`}>
              <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
              </h1>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                Connecting {projectCount} verified student builds to alumni mentors, 5-minute roasts, and {dealCount} hiring deals.
              </p>
              <CtaPair />
              <MarqueeStrip />
            </div>
            <div className="lg:col-span-5 space-y-2.5">
              {portals.map((p, idx) => {
                const isOpen = expandedRole === idx;
                return (
                  <div key={p.id} className={`${glassCard} p-4 transition-all ${isOpen ? 'border-[#0891B2] dark:border-[#22D3EE]/60' : ''}`}>
                    <button type="button" onClick={() => setExpandedRole(idx)} className="w-full flex items-center justify-between text-left">
                      <div className="flex items-center gap-3">
                        <span className={p.accentText}>{p.icon}</span>
                        <span className="font-luma-title text-base">{p.title}</span>
                      </div>
                      <span className="text-xs font-mono text-[#475569] dark:text-[#94A3B8]">{p.metric}</span>
                    </button>
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-[rgba(100,116,139,0.16)] space-y-2.5">
                        <p className="text-xs text-[#475569] dark:text-[#94A3B8]">{p.desc}</p>
                        <Link href={p.href} className={`inline-flex items-center gap-1.5 text-xs font-semibold ${p.accentText}`}>
                          {p.cta} <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 23:
        return (
          <div className="grid grid-rows-[auto_1fr] gap-3.5 h-full min-h-0">
            <div className={`${glassCard} px-5 py-2.5`}><MarqueeStrip compact /></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0">
              <div className={`lg:col-span-6 ${glassCard} p-6 flex flex-col justify-between`}>
                <div className="space-y-3">
                  <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                    A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                  </h1>
                  <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                    {projectCount} verified student builds • {dealCount} active hiring deals
                  </p>
                </div>
                <CtaPair />
              </div>
              <div className="lg:col-span-6 grid grid-cols-2 gap-3.5">
                {portals.map((p) => (
                  <Link key={p.id} href={p.href} className={`${glassCard} p-4 flex flex-col justify-between hover:border-[#0891B2]`}>
                    <span className={p.accentText}>{p.icon}</span>
                    <div>
                      <div className="font-luma-title text-sm">{p.title}</div>
                      <div className={`text-[11px] font-semibold mt-1 ${p.accentText}`}>Enter →</div>
                    </div>
                  </Link>
                ))}
                <div className={`${glassCard} p-4 flex flex-col justify-between`}>
                  <span className="text-[10px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">Graph Stats</span>
                  <div>
                    <div className="font-luma-title text-2xl text-[#0891B2] dark:text-[#22D3EE]">{projectCount} / {dealCount}</div>
                    <div className="text-[11px] text-[#475569] dark:text-[#94A3B8]">Builds &amp; Deals</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 24:
        return (
          <div className="grid grid-rows-[1fr_auto_auto] gap-3.5 h-full min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 min-h-0">
              <div className={`${glassCard} p-6 flex flex-col justify-between`}>
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase text-[#0891B2] dark:text-[#22D3EE]">For Student Builders</span>
                  <h2 className="font-luma-title text-2xl sm:text-3xl">Ship code, get 5-min alumni roasts.</h2>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">Showcase {projectCount} verified campus builds &amp; get Vouch Cards.</p>
                </div>
                <Link href="/student" className="inline-flex items-center gap-2 rounded-full bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24] px-5 py-2.5 text-xs font-semibold w-fit">
                  Open Student Feed <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className={`${glassCard} p-6 flex flex-col justify-between`}>
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase text-[#059669] dark:text-[#34D399]">For Alumni &amp; Recruiters</span>
                  <h2 className="font-luma-title text-2xl sm:text-3xl">Inspect live repos &amp; hire in 48h.</h2>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">Skip resume screening across {dealCount} active hiring pipelines.</p>
                </div>
                <Link href="/alumni" className="inline-flex items-center gap-2 rounded-full border border-[#059669]/40 bg-[#059669]/10 text-[#059669] dark:text-[#34D399] px-5 py-2.5 text-xs font-semibold w-fit">
                  Open Alumni Marketplace <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <Link href="/dean" className={`${glassCard} px-5 py-3 flex items-center justify-between hover:border-[#0891B2]`}>
              <div className="flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-[#0891B2] dark:text-[#22D3EE]" />
                <span className="font-luma-title text-sm">Dean &amp; T&amp;P Cell — Institutional Placement Telemetry</span>
              </div>
              <span className="text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE]">Open Telemetry →</span>
            </Link>
            <div className={`${glassCard} px-5 py-2.5`}><MarqueeStrip compact /></div>
          </div>
        );

      case 25:
      default:
        return (
          <div className="grid grid-rows-[1fr_auto] gap-3.5 h-full min-h-0">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center min-h-0">
              <div className={`lg:col-span-6 ${glassCard} p-6 space-y-4`}>
                <div className="inline-flex items-center gap-2 text-xs font-mono text-[#0891B2] dark:text-[#22D3EE]">
                  <Layers className="w-4 h-4" /> NODE GRAPH ARCHITECTURE
                </div>
                <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.08]">
                  A living graph of campus <span className="text-[#0891B2] dark:text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
                  {projectCount} verified student builds connected directly to {dealCount} alumni hiring deals.
                </p>
                <CtaPair />
              </div>
              <div className="lg:col-span-6 flex flex-col gap-3">
                {portals.map((p, i) => (
                  <Link
                    key={p.id}
                    href={p.href}
                    className={`${glassCard} p-4 flex items-center justify-between hover:border-[#0891B2] transition-all ${
                      i === 1 ? 'lg:ml-8' : i === 2 ? 'lg:ml-16' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-9 w-9 rounded-xl border flex items-center justify-center ${p.accentBg} ${p.accentText}`}>{p.icon}</div>
                      <div>
                        <div className="font-luma-title text-sm">{p.title}</div>
                        <div className="text-[11px] text-[#475569] dark:text-[#94A3B8]">{p.badge} · {p.metric}</div>
                      </div>
                    </div>
                    <Users className={`w-4 h-4 ${p.accentText}`} />
                  </Link>
                ))}
              </div>
            </div>
            <div className={`${glassCard} px-5 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3`}>
              <MarqueeStrip compact />
              <span className="text-xs font-mono text-[#0891B2] dark:text-[#22D3EE] shrink-0">{projectCount} Builds · {dealCount} Deals</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="font-luma-body relative min-h-dvh lg:h-dvh w-full overflow-x-hidden lg:overflow-hidden bg-[linear-gradient(135deg,#F8FAFC_0%,#E2E8F0_100%)] dark:bg-[radial-gradient(800px_500px_at_25%_20%,rgba(148,163,184,0.22)_0%,transparent_60%),linear-gradient(135deg,#07080A_0%,#14171F_55%,#090A0E_100%)] text-[#0F172A] dark:text-white grid grid-rows-[auto_1fr_auto] transition-colors">
      {/* Background Mesh */}
      <div
        className="pointer-events-none fixed -inset-12 opacity-20 animate-iso-drift hidden dark:block"
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

      {/* EXACT SAME NAVBAR */}
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

      {/* MIDDLE AREA + COMPACT 1-25 SWITCHER */}
      <main className="relative z-10 min-h-0 max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-3 flex flex-col gap-2.5">
        <div className="rounded-xl border border-[rgba(100,116,139,0.25)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-[#0B0D12]/85 backdrop-blur-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded-md bg-[#0891B2]/15 text-[#0891B2] dark:text-[#22D3EE] px-2 py-0.5 font-mono font-semibold">
              #{currentOpt.id}/25 · {currentOpt.tag}
            </span>
            <span className="font-semibold">{currentOpt.name}</span>
            <span className="hidden xl:inline text-[#475569] dark:text-[#94A3B8]">— {currentOpt.summary}</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={() => setSelected((s) => (s <= 1 ? 25 : s - 1))}
              className="p-1 rounded-md border border-[rgba(100,116,139,0.22)] hover:border-[#0891B2]"
              aria-label="Previous layout"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            {LAYOUT_OPTIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setSelected(o.id)}
                className={`w-6 h-6 rounded-md text-[11px] font-mono font-semibold transition-all ${
                  selected === o.id
                    ? 'bg-[#0F172A] text-white dark:bg-[#22D3EE] dark:text-[#041E24]'
                    : 'hover:bg-black/5 dark:hover:bg-white/10 text-[#475569] dark:text-[#94A3B8]'
                }`}
              >
                {o.id}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSelected((s) => (s >= 25 ? 1 : s + 1))}
              className="p-1 rounded-md border border-[rgba(100,116,139,0.22)] hover:border-[#0891B2]"
              aria-label="Next layout"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0">{renderMiddle()}</div>
      </main>

      {/* EXACT SAME FOOTER */}
      <div className="relative z-10 px-4 sm:px-6 pb-3">
        <footer className="max-w-[1440px] mx-auto rounded-full border border-[rgba(100,116,139,0.20)] dark:border-[rgba(226,232,240,0.18)] bg-white/85 dark:bg-[#0C0E12]/78 backdrop-blur-xl px-5 py-2 flex items-center justify-between text-xs text-[#475569] dark:text-[#94A3B8]">
          <span className="font-luma-title text-[#0F172A] dark:text-white">AlmaConnect</span>
          <span>Institute of Technical Education &amp; Research • Siksha &apos;O&apos; Anusandhan (Deemed to be University)</span>
        </footer>
      </div>
    </div>
  );
}
