'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  Briefcase,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Command,
  Flame,
  GitBranch,
  GraduationCap,
  Grid3X3,
  Maximize2,
  Quote,
  Rocket,
  Search,
  Sparkles,
  Star,
  Terminal,
  Zap,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import { HIRING_COMPANIES } from '../../data/hiringCompanies';
import {
  ALUMNI_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
} from '../../data/alumConnectData';

interface HeroOption {
  id: number;
  name: string;
  structure: string;
  render: (projectCount: number, dealCount: number) => React.ReactNode;
}

export default function HeroPreviewPage() {
  const projectCount = PROJECTS_DATA.length + RESEARCH_PAPERS_DATA.length;
  const dealCount = ALUMNI_DATA.reduce(
    (sum, a) => sum + a.activeJobOpeningsCount,
    0
  );

  const [viewMode, setViewMode] = useState<'single' | 'grid'>('single');
  const [selectedId, setSelectedId] = useState<number>(1);
  const [starred, setStarred] = useState<number[]>([1, 2, 4, 10]);
  const [heroTab20, setHeroTab20] = useState<'students' | 'alumni' | 'dean'>(
    'students'
  );

  const toggleStar = (id: number) => {
    setStarred((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const featured = PROJECTS_DATA[0];

  const options: HeroOption[] = [
    {
      id: 1,
      name: 'Centered Editorial Monument',
      structure: 'Centered pill badge, oversized headline, centered CTAs & 3 inline stats',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-8 sm:p-10 text-center space-y-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-[#22D3EE]">
            <Sparkles className="w-3.5 h-3.5" /> Proof-of-Work Talent Network
          </span>
          <h1 className="font-luma-title text-3xl sm:text-5xl max-w-3xl mx-auto leading-[1.1]">
            A living graph of campus{' '}
            <span className="text-[#22D3EE]">engineering talent.</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto">
            Connecting <strong>{p} verified student builds</strong> directly to alumni mentors, 5-minute architecture roasts, and{' '}
            <span className="text-[#22D3EE] font-semibold">{d} active hiring deals</span>.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-6 py-2.5 text-sm font-bold inline-flex items-center gap-2">
              Join the Graph <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/alumni" className="rounded-full border border-white/20 bg-white/[0.05] px-6 py-2.5 text-sm font-semibold">
              Explore Talent Nodes
            </Link>
          </div>
          <div className="pt-4 border-t border-white/10 flex flex-wrap justify-center gap-6 text-xs text-zinc-400">
            <span><strong className="text-white font-luma-title text-base mr-1">{p}</strong> Live Builds</span>
            <span><strong className="text-[#22D3EE] font-luma-title text-base mr-1">{d}</strong> Active Deals</span>
            <span><strong className="text-emerald-400 font-luma-title text-base mr-1">5 min</strong> Async Roasts</span>
          </div>
        </section>
      ),
    },
    {
      id: 2,
      name: 'Bento Asymmetric 4-Tile Mosaic',
      structure: 'Left narrative + CTAs, Right 2x2 mosaic (Builds, Deals, Featured MVP, Roast Pulse)',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-mono text-[#22D3EE]">
              ALMACONNECT OS
            </span>
            <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.1]">
              Ship real code. <span className="text-[#22D3EE]">Get vouched by alumni.</span>
            </h1>
            <p className="text-sm text-zinc-300">
              Skip cold applications—turn your live repos and 10-day builds into verified engineering interviews.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-5 py-2.5 text-xs font-bold inline-flex items-center gap-1.5">
                Join the Graph <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">
                Explore Talent Nodes
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[10px] font-mono text-zinc-400">REPOSITORIES</div>
              <div className="font-luma-title text-2xl mt-1">{p}</div>
              <div className="text-[11px] text-zinc-400">Verified Builds</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[10px] font-mono text-zinc-400">MARKETPLACE</div>
              <div className="font-luma-title text-2xl mt-1 text-[#22D3EE]">{d}</div>
              <div className="text-[11px] text-zinc-400">Deals &amp; Bounties</div>
            </div>
            <div className="col-span-2 rounded-2xl border border-cyan-500/25 bg-cyan-500/10 p-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono text-[#22D3EE]">FEATURED BUILD</div>
                <div className="font-semibold text-sm">{featured?.name || 'CampusCart v2.0'}</div>
              </div>
              <span className="rounded-full bg-emerald-400/20 text-emerald-300 px-2.5 py-0.5 text-[11px] font-semibold">
                Live Demo
              </span>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 3,
      name: 'Interactive Terminal + Split Pitch',
      structure: 'Left pitch & CTAs, Right developer terminal showing live network graph telemetry',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#0D1017]/95 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <Terminal className="w-4 h-4" /> alma-connect --live
            </div>
            <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.1]">
              Commits over <span className="text-[#22D3EE]">cover letters.</span>
            </h1>
            <p className="text-sm text-zinc-300">
              {p} campus builds connected to {d} active alumni hiring deals and 5-minute architecture roasts.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/student" className="rounded-xl bg-[#22D3EE] text-[#041E24] px-5 py-2.5 text-xs font-bold">
                Launch Student Studio →
              </Link>
              <Link href="/alumni" className="rounded-xl border border-white/20 px-5 py-2.5 text-xs font-semibold">
                Inspect Repos
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 rounded-2xl border border-zinc-800 bg-black/80 p-5 font-mono text-xs space-y-2 text-zinc-300">
            <div className="flex gap-1.5 pb-2 border-b border-zinc-800">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div><span className="text-emerald-400">$</span> alma graph --summary</div>
            <div className="text-zinc-400">→ verified_builds: <span className="text-white">{p}</span></div>
            <div className="text-zinc-400">→ active_deals: <span className="text-[#22D3EE]">{d}</span></div>
            <div className="text-zinc-400">→ top_partners: Intel, NVIDIA, Qualcomm, Atlassian</div>
            <div className="text-emerald-400">✓ Ready for student &amp; alumni connections_</div>
          </div>
        </section>
      ),
    },
    {
      id: 4,
      name: '3-Step Flywheel Pipeline',
      structure: 'Headline top, horizontal 3-stage connected flow (Build → Roast → Hire) + action bar',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-luma-title text-3xl sm:text-4xl leading-tight">
                From campus repo to <span className="text-[#22D3EE]">engineering offer.</span>
              </h1>
              <p className="text-sm text-zinc-300">
                {p} verified builds • {d} active hiring deals • 5-min async alumni feedback.
              </p>
            </div>
            <div className="flex gap-2.5 shrink-0">
              <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-5 py-2.5 text-xs font-bold">
                Join the Graph →
              </Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">
                Explore Nodes
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { n: '01', title: 'Ship Live Build', desc: 'Publish GitHub repo + walkthrough demo.' },
              { n: '02', title: '5-Min Alum Roast', desc: 'Get surgical architecture & UX feedback.' },
              { n: '03', title: 'Vouch & Fast-Track', desc: 'Unlock Deal Rooms & direct interviews.' },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 space-y-1">
                <div className="text-xs font-mono text-[#22D3EE]">STEP {s.n}</div>
                <div className="font-bold text-sm">{s.title}</div>
                <p className="text-xs text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      ),
    },
    {
      id: 5,
      name: 'Dual-Track Split Cards (Student vs Alum)',
      structure: 'Compact headline above two interactive side-by-side persona track cards',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-6 sm:p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="font-luma-title text-2xl sm:text-3xl">
              Two sides of <span className="text-[#22D3EE]">one talent graph.</span>
            </h1>
            <span className="text-xs font-mono text-zinc-400">{p} Builds • {d} Deals</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5 space-y-3">
              <div className="text-xs font-mono text-[#22D3EE]">FOR STUDENT BUILDERS</div>
              <div className="text-lg font-bold">Publish proof. Earn Vouch Cards.</div>
              <Link href="/student" className="inline-flex items-center gap-1.5 rounded-full bg-[#22D3EE] text-[#041E24] px-4 py-2 text-xs font-bold">
                Join as Student <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3">
              <div className="text-xs font-mono text-emerald-400">FOR ALUMNI &amp; HIRING</div>
              <div className="text-lg font-bold">5-min roasts. Fast-track hire.</div>
              <Link href="/alumni" className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400 text-[#041E24] px-4 py-2 text-xs font-bold">
                Explore Talent Nodes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 6,
      name: 'Spotlight Featured Build Theater',
      structure: 'Left bold typography + CTAs, Right live featured student build preview card',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.1]">
              Inspect real code before <span className="text-[#22D3EE]">you even sign in.</span>
            </h1>
            <p className="text-sm text-zinc-300">
              {p} verified campus projects and {d} active alumni hiring deals live right now.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-5 py-2.5 text-xs font-bold">
                Join the Graph →
              </Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">
                Explore Talent Nodes
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 rounded-2xl border border-white/15 bg-black/40 p-5 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#22D3EE]">FEATURED REPO</span>
              <span className="text-emerald-400">● Live</span>
            </div>
            <div className="font-bold text-base">{featured?.name || 'CampusCart v2.0'}</div>
            <p className="text-xs text-zinc-400 line-clamp-2">{featured?.pitch}</p>
            <div className="flex flex-wrap gap-1.5">
              {(featured?.techStack || ['Next.js', 'FastAPI']).slice(0, 3).map((t) => (
                <span key={t} className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-mono">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 7,
      name: 'Command-Bar Launcher Hero',
      structure: 'Centered headline + interactive ⌘K search bar + quick-tag chips + stats',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-7 sm:p-9 text-center space-y-5">
          <h1 className="font-luma-title text-3xl sm:text-4xl">
            Search the <span className="text-[#22D3EE]">campus talent graph.</span>
          </h1>
          <div className="max-w-xl mx-auto rounded-2xl border border-white/20 bg-black/50 px-4 py-3 flex items-center justify-between gap-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#22D3EE]" />
              <span>Find {p} student builds, {d} deals, or alumni mentors...</span>
            </div>
            <span className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-0.5 font-mono text-[10px]">
              <Command className="w-3 h-3" />K
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <Link href="/student" className="rounded-full bg-[#22D3EE] text-[#041E24] px-4 py-1.5 font-bold">Join the Graph →</Link>
            <Link href="/alumni" className="rounded-full border border-white/20 px-4 py-1.5 font-semibold">Explore Talent Nodes</Link>
            <Link href="/dean" className="rounded-full border border-white/20 px-4 py-1.5 font-semibold">Dean Telemetry</Link>
          </div>
        </section>
      ),
    },
    {
      id: 8,
      name: 'Vertical Timeline Spine',
      structure: 'Left glowing vertical milestone spine, Right hero copy & CTAs',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-5 space-y-4 border-l-2 border-cyan-500/40 pl-5">
            {[
              { t: 'Day 01 — Ship Repo', s: `${p} campus builds live` },
              { t: 'Day 05 — Alum Roast', s: '5-min async feedback' },
              { t: 'Day 10 — Deal Room', s: `${d} active hiring deals` },
            ].map((item) => (
              <div key={item.t} className="relative">
                <span className="absolute -left-[25px] top-1 h-2.5 w-2.5 rounded-full bg-[#22D3EE]" />
                <div className="text-xs font-bold text-white">{item.t}</div>
                <div className="text-[11px] text-zinc-400">{item.s}</div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-7 space-y-4">
            <h1 className="font-luma-title text-3xl sm:text-4xl leading-tight">
              A living graph of campus <span className="text-[#22D3EE]">engineering talent.</span>
            </h1>
            <p className="text-sm text-zinc-300">
              Built for speed—turn semester builds into verified alumni endorsements and fast-track interviews.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-5 py-2.5 text-xs font-bold">
                Join the Graph →
              </Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">
                Explore Talent Nodes
              </Link>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 9,
      name: 'Stat-First KPI Banner',
      structure: 'Giant typographic KPI counters across top, crisp pitch & CTAs anchored below',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="font-luma-title text-4xl sm:text-5xl text-white">{p}</div>
              <div className="text-xs text-zinc-400 mt-1">Live Campus Builds</div>
            </div>
            <div>
              <div className="font-luma-title text-4xl sm:text-5xl text-[#22D3EE]">{d}</div>
              <div className="text-xs text-zinc-400 mt-1">Deals &amp; Paid Bounties</div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <div className="font-luma-title text-4xl sm:text-5xl text-emerald-400">5m</div>
              <div className="text-xs text-zinc-400 mt-1">Async Alum Roasts</div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <h1 className="font-luma-title text-2xl sm:text-3xl max-w-xl">
              A living graph of campus <span className="text-[#22D3EE]">engineering talent.</span>
            </h1>
            <div className="flex flex-wrap gap-3">
              <Link href="/student" className="rounded-full bg-[#22D3EE] text-[#041E24] px-5 py-2.5 text-xs font-bold">Join the Graph →</Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">Explore Talent Nodes</Link>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 10,
      name: 'Orbital Node Topology Hero',
      structure: 'Left pitch & CTAs, Right 4-node connected topology diagram (Students ↔ Repos ↔ Alums ↔ Offers)',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.1]">
              A living graph of campus <span className="text-[#22D3EE]">engineering talent.</span>
            </h1>
            <p className="text-sm text-zinc-300">
              Connecting {p} student builds directly to alumni mentors, architecture roasts, and {d} active hiring deals.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-5 py-2.5 text-xs font-bold">
                Join the Graph →
              </Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">
                Explore Talent Nodes
              </Link>
            </div>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-3">
            {[
              { label: 'Student Squads', val: '1st–4th Yr', icon: Code2, color: 'text-[#22D3EE]' },
              { label: 'Live Repos', val: `${p} Verified`, icon: GitBranch, color: 'text-emerald-400' },
              { label: 'Alumni Mentors', val: '5-Min Roast', icon: Award, color: 'text-sky-400' },
              { label: 'Hiring Deals', val: `${d} Open`, icon: Briefcase, color: 'text-indigo-400' },
            ].map((n) => (
              <div key={n.label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 flex items-center gap-3">
                <n.icon className={`w-5 h-5 shrink-0 ${n.color}`} />
                <div>
                  <div className="text-xs font-bold">{n.label}</div>
                  <div className="text-[11px] font-mono text-zinc-400">{n.val}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ),
    },
    {
      id: 11,
      name: 'Swiss Magazine Asymmetric Grid',
      structure: 'Crisp hairline dividers, oversized left headline, right-aligned metadata column',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/20 bg-[#0B0D12] p-6 sm:p-8 space-y-5">
          <div className="flex justify-between text-[11px] font-mono uppercase tracking-wider text-zinc-400 border-b border-white/10 pb-3">
            <span>ALMACONNECT • PROOF OF WORK</span>
            <span>{p} REPOS / {d} DEALS</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <h1 className="lg:col-span-8 font-luma-title text-3xl sm:text-5xl leading-[1.06]">
              Where campus code becomes <span className="text-[#22D3EE]">career proof.</span>
            </h1>
            <div className="lg:col-span-4 space-y-3">
              <p className="text-xs text-zinc-400">
                Direct 5-minute roasts, verified Vouch Cards, and fast-track alumni hiring.
              </p>
              <div className="flex gap-2">
                <Link href="/student" className="rounded-lg bg-[#22D3EE] text-[#041E24] px-4 py-2 text-xs font-bold">Join →</Link>
                <Link href="/alumni" className="rounded-lg border border-white/20 px-4 py-2 text-xs font-semibold">Explore</Link>
              </div>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 12,
      name: 'Marquee-Top Double-Decker Hero',
      structure: 'Hiring partners ribbon across the top, split headline + CTAs in the middle',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 overflow-hidden">
          <div className="border-b border-white/10 bg-white/[0.03] px-6 py-2.5 flex items-center gap-4 text-xs text-zinc-400 overflow-hidden whitespace-nowrap">
            <span className="font-mono text-[#22D3EE] shrink-0">HIRING NOW:</span>
            {HIRING_COMPANIES.slice(0, 7).map((c) => (
              <span key={c.name} className="font-semibold text-zinc-200">{c.name}</span>
            ))}
          </div>
          <div className="p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h1 className="font-luma-title text-3xl sm:text-4xl leading-tight">
                A living graph of campus <span className="text-[#22D3EE]">engineering talent.</span>
              </h1>
              <p className="text-sm text-zinc-300">
                {p} verified student builds • {d} active alumni hiring deals &amp; paid bounties.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-5 py-2.5 text-xs font-bold">
                Join the Graph →
              </Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">
                Explore Talent Nodes
              </Link>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 13,
      name: 'Vouch Quote Proof Hero',
      structure: 'Left headline & CTAs, Right alumni Vouch endorsement quote card',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h1 className="font-luma-title text-3xl sm:text-4xl leading-[1.1]">
              Backed by alumni who <span className="text-[#22D3EE]">vouch for your code.</span>
            </h1>
            <p className="text-sm text-zinc-300">
              {p} verified student builds and {d} active hiring deals.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/student" className="rounded-full bg-[#22D3EE] text-[#041E24] px-5 py-2.5 text-xs font-bold">Join the Graph →</Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">Explore Nodes</Link>
            </div>
          </div>
          <div className="lg:col-span-5 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-5 space-y-3">
            <Quote className="w-5 h-5 text-indigo-400" />
            <p className="text-xs sm:text-sm italic text-zinc-200">
              &ldquo;Cleanest FastAPI + Redis architecture I&apos;ve seen from campus. Fast-tracked the squad to SDE-1 interviews.&rdquo;
            </p>
            <div className="text-[11px] font-mono text-indigo-300">
              — Alumni Reviewer • Microsoft &apos;19
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 14,
      name: 'Floating Glass Dock Hero',
      structure: 'Minimalist centered headline with an elevated bottom glass dock for stats + CTAs',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-7 sm:p-9 space-y-6">
          <h1 className="font-luma-title text-3xl sm:text-5xl text-center leading-[1.08]">
            A living graph of campus <span className="text-[#22D3EE]">engineering talent.</span>
          </h1>
          <div className="rounded-2xl border border-white/15 bg-black/45 backdrop-blur-md p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6 text-xs">
              <div><span className="font-luma-title text-lg text-white">{p}</span> <span className="text-zinc-400">Builds</span></div>
              <div><span className="font-luma-title text-lg text-[#22D3EE]">{d}</span> <span className="text-zinc-400">Deals</span></div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-5 py-2 text-xs font-bold">Join the Graph →</Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold">Explore Talent Nodes</Link>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 15,
      name: 'Split Contrast Studio',
      structure: 'Left obsidian pitch panel, Right cyan-tinted live metrics & partner showcase',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 bg-[#0E1118] p-6 sm:p-8 space-y-4">
            <h1 className="font-luma-title text-3xl sm:text-4xl leading-tight">
              A living graph of campus <span className="text-[#22D3EE]">engineering talent.</span>
            </h1>
            <p className="text-sm text-zinc-300">
              Connecting student builders directly to alumni mentors and fast-track hiring.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/student" className="rounded-full bg-[#22D3EE] text-[#041E24] px-5 py-2.5 text-xs font-bold">Join the Graph →</Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">Explore Nodes</Link>
            </div>
          </div>
          <div className="lg:col-span-5 bg-gradient-to-br from-cyan-500/20 via-emerald-500/10 to-[#0E1118] p-6 sm:p-8 flex flex-col justify-between gap-4 border-t lg:border-t-0 lg:border-l border-white/10">
            <div className="grid grid-cols-2 gap-3">
              <div><div className="text-[10px] font-mono text-zinc-400">BUILDS</div><div className="font-luma-title text-3xl">{p}</div></div>
              <div><div className="text-[10px] font-mono text-zinc-400">DEALS</div><div className="font-luma-title text-3xl text-[#22D3EE]">{d}</div></div>
            </div>
            <div className="text-xs text-zinc-300">
              Active reviewers from <strong>Intel, NVIDIA, Qualcomm, Atlassian, Flipkart</strong>.
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 16,
      name: '4-Cohort Progression Ladder',
      structure: 'Shows 1st Yr Scout → 2nd Yr Builder → 3rd Yr Sprinter → 4th Yr Lead beside pitch',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h1 className="font-luma-title text-3xl sm:text-4xl leading-tight">
              Start in Year 1. <span className="text-[#22D3EE]">Lead by Year 4.</span>
            </h1>
            <p className="text-sm text-zinc-300">
              {p} verified builds and {d} active hiring deals across every campus batch.
            </p>
            <div className="flex gap-3">
              <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-5 py-2.5 text-xs font-bold">Join the Graph →</Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">Explore Nodes</Link>
            </div>
          </div>
          <div className="lg:col-span-6 grid grid-cols-2 gap-2.5 text-xs">
            {[
              '1st Yr • Beta Scout',
              '2nd Yr • Core Builder',
              '3rd Yr • Bounty Sprinter',
              '4th Yr • Squad Lead',
            ].map((c) => (
              <div key={c} className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-3 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22D3EE] shrink-0" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </section>
      ),
    },
    {
      id: 17,
      name: 'Minimalist Manifesto (Zero Stat Boxes)',
      structure: 'Pure high-impact typography + 2 sleek buttons + subtle partner strip, zero box clutter',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#0C0F16]/90 p-7 sm:p-10 space-y-6">
          <div className="max-w-3xl space-y-3">
            <h1 className="font-luma-title text-3xl sm:text-5xl leading-[1.08]">
              A living graph of campus{' '}
              <span className="text-[#22D3EE]">engineering talent.</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-300">
              Connecting {p} verified student builds to alumni mentors, 5-minute roasts, and {d} active hiring deals.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
            <div className="flex gap-3">
              <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-5 py-2.5 text-xs font-bold">Join the Graph →</Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">Explore Talent Nodes</Link>
            </div>
            <div className="text-xs text-zinc-400">
              Reviewers from <strong className="text-zinc-200">Intel · NVIDIA · Atlassian · Flipkart</strong>
            </div>
          </div>
        </section>
      ),
    },
    {
      id: 18,
      name: 'Live Activity Stream Hero',
      structure: 'Left pitch + CTAs, Right live-styled campus activity feed (Vouches, MVPs, Deals)',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-4">
            <h1 className="font-luma-title text-3xl sm:text-4xl leading-tight">
              Real-time proof across <span className="text-[#22D3EE]">the entire campus.</span>
            </h1>
            <p className="text-sm text-zinc-300">
              {p} live builds and {d} active deals updating continuously.
            </p>
            <div className="flex gap-3">
              <Link href="/student" className="rounded-full bg-[#22D3EE] text-[#041E24] px-5 py-2.5 text-xs font-bold">Join the Graph →</Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">Explore Nodes</Link>
            </div>
          </div>
          <div className="lg:col-span-6 space-y-2 text-xs">
            {[
              { tag: 'VOUCH', text: 'Microsoft SDE-2 endorsed CampusCart v2.0', color: 'text-emerald-400' },
              { tag: 'DEAL', text: 'Razorpay opened 3 fast-track SDE-1 slots', color: 'text-[#22D3EE]' },
              { tag: 'SHIP', text: 'HostelBite Squad pushed 14 new commits', color: 'text-sky-400' },
            ].map((ev) => (
              <div key={ev.tag} className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 flex items-center gap-3">
                <span className={`font-mono text-[10px] font-bold ${ev.color}`}>{ev.tag}</span>
                <span className="text-zinc-200 truncate">{ev.text}</span>
              </div>
            ))}
          </div>
        </section>
      ),
    },
    {
      id: 19,
      name: 'Glow-Framed Nested Spotlight',
      structure: 'Gradient outer border framing a sleek centered hero + 3-column stat & partner bar',
      render: (p, d) => (
        <div className="rounded-3xl p-[1px] bg-gradient-to-r from-cyan-500/40 via-blue-500/30 to-emerald-500/40">
          <section className="rounded-3xl bg-[#0B0E15] p-6 sm:p-8 space-y-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-2 max-w-2xl">
                <h1 className="font-luma-title text-3xl sm:text-4xl leading-tight">
                  A living graph of campus <span className="text-[#22D3EE]">engineering talent.</span>
                </h1>
                <p className="text-sm text-zinc-300">
                  Connecting {p} student builds to alumni mentors and {d} active hiring deals.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5 shrink-0">
                <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-5 py-2.5 text-xs font-bold">Join the Graph →</Link>
                <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">Explore Nodes</Link>
              </div>
            </div>
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
              <span>{p} Builds · {d} Deals · 5-Min Roasts</span>
              <span className="text-zinc-200 font-semibold">Intel · NVIDIA · Qualcomm · Atlassian</span>
            </div>
          </section>
        </div>
      ),
    },
    {
      id: 20,
      name: 'Interactive Tabbed Hero Switcher',
      structure: 'Hero with clickable Student / Alumni / Dean tabs that swap the right-side preview live',
      render: (p, d) => (
        <section className="rounded-3xl border border-white/15 bg-[#121620]/90 p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex rounded-full border border-white/15 bg-black/40 p-1 text-xs">
              {(
                [
                  { id: 'students', label: 'Students' },
                  { id: 'alumni', label: 'Alumni' },
                  { id: 'dean', label: 'Dean T&P' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setHeroTab20(t.id)}
                  className={`rounded-full px-3 py-1 font-semibold transition-colors ${
                    heroTab20 === t.id ? 'bg-[#22D3EE] text-[#041E24]' : 'text-zinc-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <h1 className="font-luma-title text-3xl sm:text-4xl leading-tight">
              A living graph of campus <span className="text-[#22D3EE]">engineering talent.</span>
            </h1>
            <div className="flex gap-3">
              <Link href="/student" className="rounded-full bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-[#041E24] px-5 py-2.5 text-xs font-bold">Join the Graph →</Link>
              <Link href="/alumni" className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-semibold">Explore Nodes</Link>
            </div>
          </div>
          <div className="lg:col-span-6 rounded-2xl border border-white/15 bg-black/40 p-5 space-y-2">
            {heroTab20 === 'students' && (
              <>
                <div className="flex items-center gap-2 text-xs font-mono text-[#22D3EE]"><Rocket className="w-4 h-4" /> STUDENT BUILDERS</div>
                <div className="text-base font-bold">{p} Verified Campus Repositories</div>
                <p className="text-xs text-zinc-400">Ship live demos, get 5-minute alumni roasts, and earn verified Vouch Cards.</p>
              </>
            )}
            {heroTab20 === 'alumni' && (
              <>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400"><Zap className="w-4 h-4" /> ALUMNI &amp; HIRING</div>
                <div className="text-base font-bold">{d} Active Deals &amp; Paid Bounties</div>
                <p className="text-xs text-zinc-400">Inspect student codebases in 5 minutes and fast-track hire top squads.</p>
              </>
            )}
            {heroTab20 === 'dean' && (
              <>
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400"><GraduationCap className="w-4 h-4" /> DEAN &amp; T&amp;P CELL</div>
                <div className="text-base font-bold">100% Audited Placement Telemetry</div>
                <p className="text-xs text-zinc-400">Track sprint velocity, alumni endorsements, and verified offers in real time.</p>
              </>
            )}
          </div>
        </section>
      ),
    },
  ];

  const active = options.find((o) => o.id === selectedId) || options[0];

  const step = (dir: -1 | 1) => {
    const idx = options.findIndex((o) => o.id === active.id);
    const next = (idx + dir + options.length) % options.length;
    setSelectedId(options[next].id);
  };

  return (
    <div className="min-h-screen bg-[#06080D] text-white pb-16">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0B0D12]/90 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-cyan-500"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Gateway
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#22D3EE]" />
                <h1 className="text-sm font-bold">
                  Gateway Hero Structure Lab — 20 Creative Layouts
                </h1>
              </div>
              <p className="text-[11px] text-zinc-400">
                20 distinct structural layouts for the main Gateway Hero section
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded-full border border-zinc-800 p-0.5 bg-zinc-900">
              <button
                type="button"
                onClick={() => setViewMode('single')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  viewMode === 'single' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                }`}
              >
                <Maximize2 className="w-3 h-3" /> Full Stage
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  viewMode === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
                }`}
              >
                <Grid3X3 className="w-3 h-3" /> All 20 Stacked
              </button>
            </div>
            <ThemeToggle compact />
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto px-4 sm:px-8 py-6 space-y-6">
        {viewMode === 'single' ? (
          <>
            <div className="rounded-2xl border border-zinc-800 bg-[#0E1015] p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="rounded-md bg-[#22D3EE] text-[#041E24] px-2 py-0.5 text-xs font-mono font-bold">
                  HERO #{String(active.id).padStart(2, '0')}
                </span>
                <h2 className="font-bold text-sm sm:text-base">{active.name}</h2>
                <span className="text-xs text-zinc-400 hidden sm:inline">
                  — {active.structure}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleStar(active.id)}
                  className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    starred.includes(active.id)
                      ? 'border-amber-400 bg-amber-500/15 text-amber-400'
                      : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  <Star className="w-3.5 h-3.5" />
                  {starred.includes(active.id) ? 'Starred' : 'Star'}
                </button>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-cyan-500"
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Prev
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-800 px-3 py-1.5 text-xs font-medium hover:border-cyan-500"
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {active.render(projectCount, dealCount)}

            <div className="rounded-2xl border border-zinc-800 bg-[#0E1015] p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold">Quick-Jump (20 Hero Structures)</span>
                <span>Click any number to preview</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {options.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedId(opt.id)}
                    title={`${opt.id}. ${opt.name}`}
                    className={`relative h-8 min-w-[2.25rem] px-2 rounded-lg text-xs font-mono font-semibold ${
                      opt.id === active.id
                        ? 'bg-[#22D3EE] text-[#041E24]'
                        : 'border border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-cyan-500'
                    }`}
                  >
                    {String(opt.id).padStart(2, '0')}
                    {starred.includes(opt.id) && (
                      <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-8">
            {options.map((opt) => (
              <div key={opt.id} className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-zinc-800 text-cyan-300 px-2 py-0.5 text-xs font-mono font-bold">
                      #{String(opt.id).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-bold">{opt.name}</span>
                    <span className="text-xs text-zinc-400 hidden sm:inline">
                      — {opt.structure}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(opt.id);
                      setViewMode('single');
                    }}
                    className="text-xs font-semibold text-[#22D3EE] hover:underline inline-flex items-center gap-1"
                  >
                    Focus <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                {opt.render(projectCount, dealCount)}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
