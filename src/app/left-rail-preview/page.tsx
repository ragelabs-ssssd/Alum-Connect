'use client';

import React, { useState } from 'react';
import {
  Compass,
  FlaskConical,
  Newspaper,
  Calendar,
  Cpu,
  Bookmark,
  Trophy,
  Map,
  GitPullRequest,
  MessageSquarePlus,
  Briefcase,
  Filter,
  CheckSquare,
  Building2,
  Ticket,
  BookOpen,
  Clock,
  IndianRupee,
  Video,
  Sparkles,
  Bell,
  SlidersHorizontal,
  Pin,
  Users,
  ListTodo,
  FileCheck2,
  Megaphone,
  Flame,
  CheckCircle2,
  ArrowUpRight,
  BarChart3,
  Headphones,
  HardDrive,
  Cloud,
  GitFork,
  Layers,
} from 'lucide-react';

type TabKey = 'explore2' | 'explore' | 'jobs' | 'notifications';

function OptionShell({
  num,
  title,
  subtitle,
  children,
}: {
  num: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">
            {num}
          </span>
          <div>
            <h2 className="text-sm font-bold text-[#18181B]">{title}</h2>
            <p className="text-[11px] text-[#52525B]">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[320px]">{children}</div>
    </div>
  );
}

export default function LeftRailPreviewPage() {
  const [tab, setTab] = useState<TabKey>('explore2');

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <header className="sticky top-0 z-20 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Left-Rail Options Preview (Local Review)
            </h1>
            <p className="text-xs text-[#52525B]">
              Pick your favorite option number(s) for Explore, Alumni Jobs, and Notifications.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'explore2', label: 'Explore — 10 New Options' },
                { id: 'explore', label: '1. Explore Batch 1 (10)' },
                { id: 'jobs', label: '2. Alumni Jobs (10)' },
                { id: 'notifications', label: '3. Notifications (10)' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  tab === t.id
                    ? 'bg-[#18181B] text-white'
                    : 'border border-[#E4E4E7] bg-white text-[#52525B] hover:bg-[#F4F4F5]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {tab === 'explore2' && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* New 1 */}
            <OptionShell
              num={1}
              title="Alumni Tech Stack Polls"
              subtitle="Live weekly engineering vote"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#2563EB]" />
                  Alum Poll • Backend 2026
                </h3>
                <p className="text-xs font-semibold">Best queue for student FinTech apps?</p>
                {[
                  { label: 'Postgres SKIP LOCKED', pct: '64%' },
                  { label: 'Redis Streams', pct: '36%' },
                ].map((opt) => (
                  <div key={opt.label} className="rounded-xl bg-[#F4F4F5] p-2.5 space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span>{opt.label}</span>
                      <span className="text-[#2563EB]">{opt.pct}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#E4E4E7]">
                      <div className="h-1.5 rounded-full bg-[#2563EB]" style={{ width: opt.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* New 2 */}
            <OptionShell
              num={2}
              title="Paper Reading Group"
              subtitle="Weekly SOA + Alumni breakdown"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                  Paper Club • Thu 8 PM
                </h3>
                <div className="rounded-xl border border-[#E4E4E7] bg-white p-3 space-y-1.5">
                  <div className="text-xs font-bold">DeepSeek-R1 &amp; Reasoning RL</div>
                  <div className="text-[10px] text-[#52525B]">Hosted by Ankit &apos;19 • 34 attending</div>
                  <button
                    type="button"
                    className="mt-1 rounded-full bg-[#18181B] px-3 py-1 text-[10px] font-semibold text-white"
                  >
                    RSVP Seat
                  </button>
                </div>
              </div>
            </OptionShell>

            {/* New 3 */}
            <OptionShell
              num={3}
              title="Demo Day Spotlight"
              subtitle="Featured student build of the week"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#2563EB]" />
                  Demo Spotlight
                </h3>
                <div className="rounded-xl bg-[#F4F4F5] p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">PayFlow UPI Ledger</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      9.8/10
                    </span>
                  </div>
                  <div className="text-[10px] text-[#52525B]">90s walkthrough + live sandbox</div>
                </div>
              </div>
            </OptionShell>

            {/* New 4 */}
            <OptionShell
              num={4}
              title="Tech Podcast & Talk Picks"
              subtitle="15-min listens curated by alumni"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Headphones className="w-3.5 h-3.5 text-[#2563EB]" />
                  Alum Audio Picks
                </h3>
                {[
                  { title: 'Scaling UPI to 10B Txns', dur: '14 min' },
                  { title: 'Inside Atlassian’s Edge Router', dur: '18 min' },
                ].map((p) => (
                  <div
                    key={p.title}
                    className="rounded-xl bg-[#F4F4F5] p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold truncate">{p.title}</span>
                    <span className="text-[10px] font-bold text-[#2563EB] shrink-0">{p.dur}</span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* New 5 */}
            <OptionShell
              num={5}
              title="Campus Dev Clubs & Chapters"
              subtitle="Active ITER / SOA tech communities"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                  Campus Chapters
                </h3>
                {[
                  { club: 'GDG On Campus ITER', next: 'Next.js Jam • Sat' },
                  { club: 'IEEE Computer Society', next: 'Paper Clinic • Wed' },
                ].map((c) => (
                  <div key={c.club} className="rounded-xl bg-white border border-[#E4E4E7] p-2.5 text-xs">
                    <div className="font-bold">{c.club}</div>
                    <div className="text-[10px] text-[#52525B]">{c.next}</div>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* New 6 */}
            <OptionShell
              num={6}
              title="Hardware & IoT Lab Kits"
              subtitle="Bookable campus lab equipment"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-[#2563EB]" />
                  Lab Hardware Kits
                </h3>
                {[
                  { kit: 'NVIDIA Jetson Orin Nano', status: '2 Free' },
                  { kit: 'ESP32-S3 Sensor Pack', status: '5 Free' },
                ].map((k) => (
                  <div
                    key={k.kit}
                    className="rounded-xl bg-[#F4F4F5] p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold truncate">{k.kit}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 shrink-0">
                      {k.status}
                    </span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* New 7 */}
            <OptionShell
              num={7}
              title="Cloud & GPU Credits"
              subtitle="Student perks & alumni compute grants"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-[#2563EB]" />
                  Free Compute Perks
                </h3>
                {[
                  { perk: 'Alumni GPU Grant (A10G)', val: '20 hrs' },
                  { perk: 'Vercel Pro Student Pass', val: 'Active' },
                ].map((g) => (
                  <div
                    key={g.perk}
                    className="rounded-xl border border-[#E4E4E7] p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold truncate">{g.perk}</span>
                    <span className="text-[10px] font-bold text-[#2563EB] shrink-0">{g.val}</span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* New 8 */}
            <OptionShell
              num={8}
              title="Trending Repos @ SOA"
              subtitle="Fastest-growing student GitHub repos"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <GitFork className="w-3.5 h-3.5 text-[#2563EB]" />
                  Trending Student Repos
                </h3>
                {[
                  { repo: 'soa-campus/rag-notes', stars: '★ 142' },
                  { repo: 'iter-labs/upi-sim', stars: '★ 98' },
                ].map((r) => (
                  <div
                    key={r.repo}
                    className="rounded-xl bg-white border border-[#E4E4E7] p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-[#2563EB] truncate">{r.repo}</span>
                    <span className="text-[10px] font-bold text-[#18181B] shrink-0">{r.stars}</span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* New 9 */}
            <OptionShell
              num={9}
              title="Tech Office Hours"
              subtitle="15-min architecture & paper clinics"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                  Tech Clinics Today
                </h3>
                <div className="rounded-xl bg-[#F4F4F5] p-3 space-y-1 text-xs">
                  <div className="font-bold">Distributed Systems Clinic</div>
                  <div className="text-[10px] text-[#52525B]">Priya Nair &apos;16 • 7:30 PM IST</div>
                  <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    2 slots open
                  </span>
                </div>
              </div>
            </OptionShell>

            {/* New 10 */}
            <OptionShell
              num={10}
              title="Explore Feed Mode"
              subtitle="Switch Explore lens & sort order"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
                  Explore Mode
                </h3>
                {['Most Endorsed', 'Research Papers Only', 'Live Demos Only'].map((m, i) => (
                  <div
                    key={m}
                    className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                      i === 0 ? 'bg-[#18181B] text-white' : 'bg-[#F4F4F5] text-[#52525B]'
                    }`}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </OptionShell>
          </div>
        )}

        {tab === 'explore' && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Explore 1 */}
            <OptionShell
              num={1}
              title="Tech Stack Filter Tree"
              subtitle="Filter Explore feed by stack"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
                    Filter By Stack
                  </h3>
                  <span className="text-[10px] font-semibold text-[#2563EB]">Reset</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['Next.js', 'PyTorch', 'Rust', 'System Design', 'Cloud / K8s', 'FinTech'].map(
                    (tag, i) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          i < 2
                            ? 'bg-[#18181B] text-white'
                            : 'bg-[#F4F4F5] text-[#52525B]'
                        }`}
                      >
                        {tag}
                      </span>
                    )
                  )}
                </div>
              </div>
            </OptionShell>

            {/* Explore 2 */}
            <OptionShell
              num={2}
              title="Campus Research & Lab Radar"
              subtitle="Open SOA / ITER labs & groups"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <FlaskConical className="w-3.5 h-3.5 text-[#2563EB]" />
                  Campus Lab Radar
                </h3>
                {[
                  { lab: 'ITER Applied AI Lab', lead: "Dr. Pattnaik + Vikram '18", open: '2 spots' },
                  { lab: 'FinTech Systems Group', lead: "Prof. Mishra + Priya '16", open: 'Open' },
                ].map((item) => (
                  <div
                    key={item.lab}
                    className="rounded-xl border border-[#E4E4E7] bg-white p-3 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{item.lab}</div>
                      <div className="text-[10px] text-[#52525B] truncate">{item.lead}</div>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                      {item.open}
                    </span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Explore 3 */}
            <OptionShell
              num={3}
              title="Weekly Tech Briefings (TL;DR)"
              subtitle="Alumni-curated 60s summaries"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Newspaper className="w-3.5 h-3.5 text-[#2563EB]" />
                  Weekly Tech TL;DR
                </h3>
                {[
                  { title: 'Why Teams Move to Postgres Queues', meta: "Vikram '18 • 2m read" },
                  { title: 'Small Language Models in Prod', meta: "Ankit '19 • 3m read" },
                ].map((b) => (
                  <div key={b.title} className="rounded-xl bg-[#F4F4F5] p-3 space-y-1">
                    <div className="text-xs font-semibold leading-snug">{b.title}</div>
                    <div className="text-[10px] text-[#52525B]">{b.meta}</div>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Explore 4 */}
            <OptionShell
              num={4}
              title="Live Hackathons & CFPs"
              subtitle="Upcoming deadlines & demo days"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                  Hackathons & CFPs
                </h3>
                {[
                  { name: 'SOA FinTech Buildathon', due: '3d left', tag: '₹50k Prize' },
                  { name: 'IEEE Student Paper CFP', due: '11d left', tag: 'Abstract' },
                ].map((h) => (
                  <div
                    key={h.name}
                    className="rounded-xl border border-[#E4E4E7] p-3 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{h.name}</div>
                      <div className="text-[10px] text-[#52525B]">{h.tag}</div>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                      {h.due}
                    </span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Explore 5 */}
            <OptionShell
              num={5}
              title="Alumni Tech Radar"
              subtitle="What alums recommend adopting"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#2563EB]" />
                  Alumni Tech Radar
                </h3>
                {[
                  { tech: 'Next.js App Router + RSC', ring: 'Adopt', color: 'bg-emerald-100 text-emerald-700' },
                  { tech: 'pgvector + Hybrid Search', ring: 'Trial', color: 'bg-blue-50 text-[#2563EB]' },
                ].map((r) => (
                  <div
                    key={r.tech}
                    className="rounded-xl bg-white border border-[#E4E4E7] p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold truncate">{r.tech}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.color}`}>
                      {r.ring}
                    </span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Explore 6 */}
            <OptionShell
              num={6}
              title="Saved Tech Reads"
              subtitle="Bookmarked Explore articles & papers"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#2563EB]" />
                  Saved Reads (2)
                </h3>
                {[
                  'Latency Numbers Every SDE Should Know',
                  'Attention Is All You Need — Annotated',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-[#F4F4F5] p-2.5 flex items-center justify-between gap-2 text-xs"
                  >
                    <span className="font-medium truncate">{item}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-[#52525B]" />
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Explore 7 */}
            <OptionShell
              num={7}
              title="Top Student Builders"
              subtitle="Most alumni-endorsed this week"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#2563EB]" />
                  Top Builders This Week
                </h3>
                {[
                  { name: 'Rohan Das', meta: '3rd Yr • 18 endorsements', rank: '#1' },
                  { name: 'Sneha Patnaik', meta: '4th Yr • 14 endorsements', rank: '#2' },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="rounded-xl bg-[#F4F4F5] p-2.5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold">{s.name}</div>
                      <div className="text-[10px] text-[#52525B]">{s.meta}</div>
                    </div>
                    <span className="rounded-full bg-[#18181B] text-white px-2 py-0.5 text-[10px] font-bold">
                      {s.rank}
                    </span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Explore 8 */}
            <OptionShell
              num={8}
              title="Learning Roadmaps"
              subtitle="Track-based milestone starters"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Map className="w-3.5 h-3.5 text-[#2563EB]" />
                  Learning Roadmaps
                </h3>
                {[
                  { track: 'Backend SDE Track', pct: '72%' },
                  { track: 'Applied AI & RAG', pct: '45%' },
                ].map((t) => (
                  <div key={t.track} className="rounded-xl bg-white border border-[#E4E4E7] p-3 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{t.track}</span>
                      <span className="text-[#2563EB]">{t.pct}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#E4E4E7]">
                      <div className="h-1.5 rounded-full bg-[#2563EB]" style={{ width: t.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Explore 9 */}
            <OptionShell
              num={9}
              title="Open-Source Good First Issues"
              subtitle="Alumni-maintained repos for PRs"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <GitPullRequest className="w-3.5 h-3.5 text-[#2563EB]" />
                  Alumni OSS Issues
                </h3>
                {[
                  { repo: 'fin-ledger-sdk', issue: 'Add webhook retry test (#42)' },
                  { repo: 'iter-campus-map', issue: 'Dark mode contrast fix (#19)' },
                ].map((o) => (
                  <div key={o.repo} className="rounded-xl bg-[#F4F4F5] p-2.5 text-xs">
                    <div className="font-bold text-[#2563EB]">{o.repo}</div>
                    <div className="text-[11px] text-[#52525B] truncate">{o.issue}</div>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Explore 10 */}
            <OptionShell
              num={10}
              title="Ask-an-Alum Tech Q&A"
              subtitle="Post quick architecture questions"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <MessageSquarePlus className="w-3.5 h-3.5 text-[#2563EB]" />
                  Ask an Alum
                </h3>
                <textarea
                  rows={2}
                  readOnly
                  value="Should I use Redis Streams or Kafka for our hackathon payment queue?"
                  className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-2.5 text-[11px] text-[#18181B]"
                />
                <button
                  type="button"
                  className="w-full rounded-full bg-[#18181B] py-2 text-xs font-semibold text-white"
                >
                  Ask Verified Alumni
                </button>
              </div>
            </OptionShell>
          </div>
        )}

        {tab === 'jobs' && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Jobs 1 */}
            <OptionShell
              num={1}
              title="Job Filters & Preferences"
              subtitle="Filter by role, location & mode"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#2563EB]" />
                  Job Filters
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {['Internship', 'SDE-1', 'Remote', 'Bangalore', 'Hyderabad'].map((f, i) => (
                    <span
                      key={f}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        i === 0 ? 'bg-[#18181B] text-white' : 'bg-[#F4F4F5] text-[#52525B]'
                      }`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </OptionShell>

            {/* Jobs 2 */}
            <OptionShell
              num={2}
              title="Saved Jobs & Shortlist"
              subtitle="Bookmarked roles to apply next"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#2563EB]" />
                  Saved Roles (2)
                </h3>
                {[
                  { co: 'Razorpay', role: 'Product Eng Intern' },
                  { co: 'Atlassian', role: 'SDE-1 Cloud' },
                ].map((j) => (
                  <div
                    key={j.co}
                    className="rounded-xl bg-white border border-[#E4E4E7] p-2.5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold">{j.co}</div>
                      <div className="text-[10px] text-[#52525B]">{j.role}</div>
                    </div>
                    <span className="rounded-full bg-[#2563EB] px-2.5 py-0.5 text-[10px] font-semibold text-white">
                      Apply
                    </span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Jobs 3 */}
            <OptionShell
              num={3}
              title="Pre-Referral Checklist"
              subtitle="Verify before requesting referral"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-[#2563EB]" />
                  Pre-Referral Checklist
                </h3>
                {[
                  { label: 'Live Demo URL attached', done: true },
                  { label: 'GitHub README updated', done: true },
                  { label: '1-page ATS Resume PDF', done: false },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="flex items-center justify-between rounded-xl bg-[#F4F4F5] px-3 py-2 text-xs"
                  >
                    <span className={c.done ? 'font-semibold' : 'text-[#52525B]'}>{c.label}</span>
                    <span className={c.done ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                      {c.done ? '✓' : 'Todo'}
                    </span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Jobs 4 */}
            <OptionShell
              num={4}
              title="Hiring Companies Directory"
              subtitle="Alumni teams actively hiring"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  Alumni Hiring Teams
                </h3>
                {[
                  { co: 'Razorpay', alums: '6 alums', roles: '3 roles' },
                  { co: 'Atlassian', alums: '4 alums', roles: '2 roles' },
                  { co: 'Microsoft', alums: '9 alums', roles: '2 roles' },
                ].map((c) => (
                  <div
                    key={c.co}
                    className="rounded-xl bg-[#F4F4F5] px-3 py-2 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold">{c.co}</div>
                      <div className="text-[10px] text-[#52525B]">{c.alums}</div>
                    </div>
                    <span className="rounded-full bg-white border border-[#E4E4E7] px-2 py-0.5 text-[10px] font-semibold">
                      {c.roles}
                    </span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Jobs 5 */}
            <OptionShell
              num={5}
              title="Referral Quota & Tips"
              subtitle="Monthly referral tokens & note guide"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5 text-[#2563EB]" />
                  Referral Quota
                </h3>
                <div className="rounded-xl bg-white border border-[#E4E4E7] p-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold">3 / 4 Left</div>
                    <div className="text-[10px] text-[#52525B]">Resets 1st of month</div>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-[#2563EB]">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-[#52525B]">
                  Tip: Link a live project + 2-line impact summary to 3x referral replies.
                </p>
              </div>
            </OptionShell>

            {/* Jobs 6 */}
            <OptionShell
              num={6}
              title="Interview Prep Bank"
              subtitle="Alumni-shared OA & round notes"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                  Interview Prep Bank
                </h3>
                {[
                  { co: 'Razorpay OA', topic: 'Rate Limiter + SQL Joins' },
                  { co: 'Atlassian LLD', topic: 'Middleware Router Design' },
                ].map((p) => (
                  <div key={p.co} className="rounded-xl bg-[#F4F4F5] p-2.5 text-xs">
                    <div className="font-bold">{p.co}</div>
                    <div className="text-[10px] text-[#52525B]">{p.topic}</div>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Jobs 7 */}
            <OptionShell
              num={7}
              title="Application Deadlines"
              subtitle="Closing dates for active drives"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                  Closing Soon
                </h3>
                {[
                  { role: 'Razorpay Intern', due: 'Closes in 2d' },
                  { role: 'Flipkart Grid Referral', due: 'Closes in 5d' },
                ].map((d) => (
                  <div
                    key={d.role}
                    className="rounded-xl border border-[#E4E4E7] p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold">{d.role}</span>
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                      {d.due}
                    </span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Jobs 8 */}
            <OptionShell
              num={8}
              title="Compensation Benchmarks"
              subtitle="Verified stipend & SDE-1 ranges"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5 text-[#2563EB]" />
                  Pay Benchmarks
                </h3>
                {[
                  { tier: 'Product Interns', pay: '₹40k – ₹65k / mo' },
                  { tier: 'SDE-1 (Alumni Refs)', pay: '₹18 – ₹28 LPA' },
                ].map((b) => (
                  <div
                    key={b.tier}
                    className="rounded-xl bg-white border border-[#E4E4E7] p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold">{b.tier}</span>
                    <span className="font-bold text-emerald-700">{b.pay}</span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Jobs 9 */}
            <OptionShell
              num={9}
              title="Mock Interview Slots"
              subtitle="30-min DSA & System Design mocks"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-[#2563EB]" />
                  Mock Interviews
                </h3>
                <div className="rounded-xl bg-[#F4F4F5] p-3 space-y-1.5 text-xs">
                  <div className="font-bold">DSA + Resume Roast (30m)</div>
                  <div className="text-[10px] text-[#52525B]">With Sidharth &apos;19 • SDE-2 @ Microsoft</div>
                  <button
                    type="button"
                    className="mt-1 rounded-full bg-[#18181B] px-3 py-1 text-[10px] font-semibold text-white"
                  >
                    Book Mock Slot
                  </button>
                </div>
              </div>
            </OptionShell>

            {/* Jobs 10 */}
            <OptionShell
              num={10}
              title="Skill Gap Matcher"
              subtitle="Match your stack vs open roles"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  Skill Match Score
                </h3>
                <div className="rounded-xl bg-[#F4F4F5] p-3 space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold">
                    <span>Razorpay Intern Match</span>
                    <span className="text-emerald-700">88%</span>
                  </div>
                  <div className="text-[10px] text-[#52525B]">
                    Missing boost: Add Redis / Rate-limiting demo
                  </div>
                </div>
              </div>
            </OptionShell>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Notifications 1 */}
            <OptionShell
              num={1}
              title="Category Filters"
              subtitle="Filter inbox by notification type"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#2563EB]" />
                  Filter Inbox
                </h3>
                {[
                  { label: 'All Alerts', count: 6, active: true },
                  { label: 'Referrals & Jobs', count: 2, active: false },
                  { label: 'Paper / Project Reviews', count: 3, active: false },
                  { label: 'Mentor Replies', count: 1, active: false },
                ].map((c) => (
                  <div
                    key={c.label}
                    className={`rounded-xl px-3 py-2 flex items-center justify-between text-xs font-semibold ${
                      c.active ? 'bg-[#18181B] text-white' : 'bg-[#F4F4F5] text-[#52525B]'
                    }`}
                  >
                    <span>{c.label}</span>
                    <span className="text-[10px]">{c.count}</span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Notifications 2 */}
            <OptionShell
              num={2}
              title="Unread Summary & Clear"
              subtitle="Counts by priority + mark all read"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  Unread Summary
                </h3>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-xl bg-white border border-[#E4E4E7] p-2.5">
                    <div className="text-base font-bold">4</div>
                    <div className="text-[10px] text-[#52525B]">Unread</div>
                  </div>
                  <div className="rounded-xl bg-white border border-[#E4E4E7] p-2.5">
                    <div className="text-base font-bold text-[#2563EB]">2</div>
                    <div className="text-[10px] text-[#52525B]">Urgent</div>
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full rounded-full bg-[#18181B] py-1.5 text-xs font-semibold text-white"
                >
                  Mark All as Read
                </button>
              </div>
            </OptionShell>

            {/* Notifications 3 */}
            <OptionShell
              num={3}
              title="Preferences & Quiet Hours"
              subtitle="Manage push, email & focus mode"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#2563EB]" />
                  Alert Controls
                </h3>
                {[
                  { name: 'Email Digest (Daily)', state: 'On' },
                  { name: 'Exam Quiet Hours', state: 'Paused' },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="rounded-xl bg-[#F4F4F5] p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold">{p.name}</span>
                    <span className="rounded-full bg-white border border-[#E4E4E7] px-2 py-0.5 text-[10px] font-bold">
                      {p.state}
                    </span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Notifications 4 */}
            <OptionShell
              num={4}
              title="Pinned / Starred Alerts"
              subtitle="Keep critical invites at hand"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5 text-[#2563EB]" />
                  Pinned Alerts
                </h3>
                <div className="rounded-xl bg-[#F4F4F5] p-3 text-xs space-y-1">
                  <div className="font-bold">Razorpay Referral Code Ready</div>
                  <div className="text-[10px] text-[#52525B]">Pinned from Vikram Senapati &apos;18</div>
                </div>
              </div>
            </OptionShell>

            {/* Notifications 5 */}
            <OptionShell
              num={5}
              title="Recent Alumni Interactions"
              subtitle="Alums who engaged with you"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                  Recent Alumni
                </h3>
                {[
                  { name: 'Vikram Senapati', act: 'Endorsed PayFlow API' },
                  { name: 'Priya Nair', act: 'Replied to your portfolio' },
                ].map((a) => (
                  <div key={a.name} className="rounded-xl bg-white border border-[#E4E4E7] p-2.5 text-xs">
                    <div className="font-bold">{a.name}</div>
                    <div className="text-[10px] text-[#52525B]">{a.act}</div>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Notifications 6 */}
            <OptionShell
              num={6}
              title="Pending Action Items"
              subtitle="Follow-ups extracted from alerts"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <ListTodo className="w-3.5 h-3.5 text-[#2563EB]" />
                  Action Items (2)
                </h3>
                {[
                  'Reply to Vikram’s architecture note',
                  'Upload updated resume for Atlassian',
                ].map((t) => (
                  <div key={t} className="rounded-xl bg-[#F4F4F5] p-2.5 text-xs font-medium">
                    • {t}
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Notifications 7 */}
            <OptionShell
              num={7}
              title="Upcoming Coffee Chats"
              subtitle="Booked 15-min mentor sessions"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                  Booked Chats
                </h3>
                <div className="rounded-xl bg-[#F4F4F5] p-3 text-xs space-y-1">
                  <div className="font-bold">Vikram Senapati • Sat 11:00 AM</div>
                  <div className="text-[10px] text-[#2563EB] font-semibold">Join Google Meet →</div>
                </div>
              </div>
            </OptionShell>

            {/* Notifications 8 */}
            <OptionShell
              num={8}
              title="Submission Status Feed"
              subtitle="Review progress of your uploads"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#2563EB]" />
                  Submission Status
                </h3>
                {[
                  { item: 'FinTech UPI Fraud Paper', st: 'Under Review' },
                  { item: 'PayFlow Ledger API', st: 'Endorsed ✓' },
                ].map((s) => (
                  <div
                    key={s.item}
                    className="rounded-xl bg-white border border-[#E4E4E7] p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold truncate">{s.item}</span>
                    <span className="text-[10px] font-bold text-[#2563EB] shrink-0">{s.st}</span>
                  </div>
                ))}
              </div>
            </OptionShell>

            {/* Notifications 9 */}
            <OptionShell
              num={9}
              title="Campus Announcements"
              subtitle="Official SOA & placement notices"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Megaphone className="w-3.5 h-3.5 text-[#2563EB]" />
                  Campus Notices
                </h3>
                <div className="rounded-xl bg-[#F4F4F5] p-3 text-xs space-y-1">
                  <div className="font-bold">Alumni Townhall • Nov 22</div>
                  <div className="text-[10px] text-[#52525B]">ITER Auditorium + Live Stream</div>
                </div>
              </div>
            </OptionShell>

            {/* Notifications 10 */}
            <OptionShell
              num={10}
              title="Weekly Engagement Stats"
              subtitle="Views, replies & endorsements"
            >
              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-[#2563EB]" />
                  7-Day Activity
                </h3>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-[#F4F4F5] p-2.5">
                    <div className="font-bold text-sm">48</div>
                    <div className="text-[10px] text-[#52525B]">Alum Views</div>
                  </div>
                  <div className="rounded-xl bg-[#F4F4F5] p-2.5">
                    <div className="font-bold text-sm text-emerald-700">+3</div>
                    <div className="text-[10px] text-[#52525B]">Endorsements</div>
                  </div>
                </div>
              </div>
            </OptionShell>
          </div>
        )}
      </main>
    </div>
  );
}
