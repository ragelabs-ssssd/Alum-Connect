'use client';

import React, { useState } from 'react';
import {
  ArrowUpRight,
  AtSign,
  BadgeCheck,
  Briefcase,
  Calendar,
  Check,
  CheckCheck,
  Code2,
  ExternalLink,
  FileCode2,
  FolderGit2,
  Hash,
  MessageSquare,
  Minimize2,
  Paperclip,
  Search,
  Send,
  Sparkles,
  UserCheck,
  Users,
  Video,
  X,
} from 'lucide-react';

type Msg = {
  id: string;
  sender: 'me' | 'them';
  author: string;
  time: string;
  text: string;
  attachment?: string;
};

const INITIAL_THREADS = [
  {
    id: 't1',
    name: 'Debadatta Rath',
    role: 'Alumni • CTO @ HyperScale Labs',
    batch: "ITER '18",
    avatar: 'DR',
    online: true,
    unread: 2,
    topic: 'PRJ-01 • Distributed Raft KV Store',
    lastMsg: 'Your Raft leader election benchmark looks solid. Free for a 15-min systems chat?',
    time: '2m',
  },
  {
    id: 't2',
    name: 'Soumya Ranjan Panigrahi',
    role: 'Alumni • Staff SWE @ Google',
    batch: "ITER '17",
    avatar: 'SR',
    online: true,
    unread: 1,
    topic: 'Referral • L4 Backend / Infra',
    lastMsg: 'Drop your GitHub + PRJ-04 link here, I have 2 referral slots left this cycle.',
    time: '18m',
  },
  {
    id: 't3',
    name: 'Ananya Senapati',
    role: 'Student • CSE 4th Year (9.4 CGPA)',
    batch: '2026 Batch',
    avatar: 'AS',
    online: false,
    unread: 0,
    topic: 'RP-01 • Federated Healthcare Co-Author',
    lastMsg: 'Pushed the PyTorch differential privacy ablation table to the repo.',
    time: '1h',
  },
  {
    id: 't4',
    name: 'Priya Das',
    role: 'Alumni • Senior ML @ Razorpay',
    batch: "ITER '20",
    avatar: 'PD',
    online: true,
    unread: 0,
    topic: 'Mock Interview & Resume Critique',
    lastMsg: 'Highlight latency numbers (p99 < 18ms) right at the top of your project bullet.',
    time: '3h',
  },
];

const INITIAL_MESSAGES: Record<string, Msg[]> = {
  t1: [
    {
      id: 'm1',
      sender: 'me',
      author: 'Aarav Mohanty (You)',
      time: '11:40 AM',
      text: 'Hi Debadatta sir! I just shipped PRJ-01 (Raft KV Store in Rust) with Jepsen-style partition tests. Would love your feedback on the log compaction path.',
      attachment: 'github.com/aarav-iter/raft-kv-rust',
    },
    {
      id: 'm2',
      sender: 'them',
      author: 'Debadatta Rath',
      time: '11:44 AM',
      text: 'Checked your repo—clean snapshot chunking. Your Raft leader election benchmark looks solid. Free for a 15-min systems chat?',
    },
  ],
  t2: [
    {
      id: 'm3',
      sender: 'them',
      author: 'Soumya Ranjan Panigrahi',
      time: '11:20 AM',
      text: 'Drop your GitHub + PRJ-04 link here, I have 2 referral slots left this cycle.',
    },
  ],
  t3: [
    {
      id: 'm4',
      sender: 'them',
      author: 'Ananya Senapati',
      time: '10:15 AM',
      text: 'Pushed the PyTorch differential privacy ablation table to the repo.',
    },
  ],
  t4: [
    {
      id: 'm5',
      sender: 'them',
      author: 'Priya Das',
      time: '08:30 AM',
      text: 'Highlight latency numbers (p99 < 18ms) right at the top of your project bullet.',
    },
  ],
};

function OptionHeader({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 mb-3">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white shrink-0 mt-0.5">
        {num}
      </span>
      <div>
        <h2 className="text-base font-bold text-[#18181B]">{title}</h2>
        <p className="text-xs text-[#52525B]">{desc}</p>
      </div>
    </div>
  );
}

export default function ChatPreviewPage() {
  // Interactive state for Option 1
  const [opt1Active, setOpt1Active] = useState('t1');
  const [opt1Messages, setOpt1Messages] = useState(INITIAL_MESSAGES);
  const [opt1Draft, setOpt1Draft] = useState('');

  // Interactive state for Option 2 (Floating Dock)
  const [dockOpen, setDockOpen] = useState(true);
  const [dockThread, setDockThread] = useState('t2');

  // Interactive state for Option 4 (Channels + DMs)
  const [channel, setChannel] = useState('#referral-ask');

  // Interactive state for Option 6 (Slide-over Drawer)
  const [drawerPerson, setDrawerPerson] = useState<string | null>('Debadatta Rath');

  // Interactive state for Option 8 (Referral Action)
  const [referralStatus, setReferralStatus] = useState<'pending' | 'approved' | 'call'>('pending');

  // Interactive state for Option 9 (Tabbed)
  const [tabFilter, setTabFilter] = useState<'All' | 'Mentors' | 'Recruiters' | 'Co-Builders'>('All');

  const sendOpt1 = () => {
    const trimmed = opt1Draft.trim();
    if (!trimmed) return;
    setOpt1Messages((prev) => ({
      ...prev,
      [opt1Active]: [
        ...(prev[opt1Active] || []),
        {
          id: String(Date.now()),
          sender: 'me',
          author: 'Aarav Mohanty (You)',
          time: 'Just now',
          text: trimmed,
        },
      ],
    }));
    setOpt1Draft('');
  };

  const activeThread1 = INITIAL_THREADS.find((t) => t.id === opt1Active) || INITIAL_THREADS[0];

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <header className="sticky top-0 z-30 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Alumni ↔ Student Chat — 10 UI/UX &amp; Content Options (Local Review)
            </h1>
            <p className="text-xs text-[#52525B]">
              Try clicking threads, sending a message, or switching tabs below. Reply with your chosen option number (1–10) to make it live across Student &amp; Alumni portals.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700">
            <MessageSquare className="w-3.5 h-3.5" /> Interactive Local Preview
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 space-y-12">
        {/* OPTION 1 */}
        <section>
          <OptionHeader
            num={1}
            title="Classic Two-Pane Split Inbox (LinkedIn × Linear Style)"
            desc="Best all-rounder: searchable thread list on the left with unread badges & role pills, live conversation on the right with quick-reply chips. (Try sending a message!)"
          />
          <div className="rounded-2xl border border-[#E4E4E7] bg-white shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[420px]">
            <div className="md:col-span-4 border-r border-[#E4E4E7] flex flex-col bg-[#FCFCFD]">
              <div className="p-3 border-b border-[#E4E4E7]">
                <div className="flex items-center gap-2 rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1.5 text-xs">
                  <Search className="w-3.5 h-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search alumni, students, projects..."
                    className="w-full bg-transparent outline-none text-xs"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-[#F4F4F5]">
                {INITIAL_THREADS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setOpt1Active(t.id)}
                    className={`w-full text-left p-3 flex items-start gap-2.5 transition-colors ${
                      opt1Active === t.id ? 'bg-blue-50/70' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className="relative h-9 w-9 rounded-full bg-[#18181B] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {t.avatar}
                      {t.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate">{t.name}</span>
                        <span className="text-[10px] text-zinc-400">{t.time}</span>
                      </div>
                      <p className="text-[10px] font-medium text-blue-600 truncate">{t.role}</p>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">{t.lastMsg}</p>
                    </div>
                    {t.unread > 0 && (
                      <span className="h-4 min-w-4 px-1 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center">
                        {t.unread}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col bg-white">
              <div className="px-4 py-3 border-b border-[#E4E4E7] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold">{activeThread1.name}</span>
                    <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[10px] rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-600">
                      {activeThread1.batch}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500">{activeThread1.topic}</p>
                </div>
                <button className="inline-flex items-center gap-1 rounded-lg border border-[#E4E4E7] px-2.5 py-1 text-[11px] font-semibold hover:bg-zinc-50">
                  <Video className="w-3.5 h-3.5 text-blue-600" /> 15m Call
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAFA]/60">
                {(opt1Messages[opt1Active] || []).map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.sender === 'me' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        m.sender === 'me'
                          ? 'bg-[#18181B] text-white rounded-br-sm'
                          : 'bg-white border border-[#E4E4E7] text-[#18181B] rounded-bl-sm'
                      }`}
                    >
                      <p>{m.text}</p>
                      {m.attachment && (
                        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-white/10 px-2.5 py-1 text-[10px] font-mono">
                          <FolderGit2 className="w-3 h-3" /> {m.attachment}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 px-1 flex items-center gap-1">
                      {m.time} {m.sender === 'me' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 border-t border-[#E4E4E7] space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {['Share Project Link', 'Request Referral', 'Book 15-Min Office Hours'].map((chip) => (
                    <button
                      key={chip}
                      onClick={() => setOpt1Draft(chip === 'Share Project Link' ? 'Here is my live demo & GitHub repo: ' : `Hi! I'd like to ${chip.toLowerCase()}.`)}
                      className="rounded-full border border-[#E4E4E7] bg-zinc-50 hover:bg-zinc-100 px-2.5 py-0.5 text-[10px] font-medium text-zinc-700"
                    >
                      + {chip}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={opt1Draft}
                    onChange={(e) => setOpt1Draft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendOpt1()}
                    placeholder={`Message ${activeThread1.name}...`}
                    className="flex-1 rounded-xl border border-[#E4E4E7] px-3 py-2 text-xs outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={sendOpt1}
                    className="inline-flex items-center gap-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 text-xs font-semibold"
                  >
                    <Send className="w-3.5 h-3.5" /> Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OPTION 2 */}
        <section>
          <OptionHeader
            num={2}
            title="Persistent Floating Bottom-Right Chat Dock (Zero Page Switch)"
            desc="Always accessible from any feed or profile via a floating pill (`Messages (3)`). Expands into a compact messenger without leaving the current page."
          />
          <div className="relative rounded-2xl border border-[#E4E4E7] bg-zinc-100/70 p-6 h-[320px] overflow-hidden flex items-center justify-center">
            <p className="text-xs text-zinc-500 max-w-md text-center">
              Simulated Student / Alumni Feed Background — users keep browsing projects &amp; openings while chatting in the bottom-right dock.
            </p>
            {dockOpen ? (
              <div className="absolute bottom-4 right-4 w-80 rounded-2xl border border-[#E4E4E7] bg-white shadow-xl overflow-hidden">
                <div className="bg-[#18181B] text-white px-3.5 py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold">Alum Connect Chat</span>
                  </div>
                  <button onClick={() => setDockOpen(false)} className="text-zinc-300 hover:text-white">
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex border-b border-[#E4E4E7] bg-zinc-50 px-2 py-1.5 gap-1 overflow-x-auto">
                  {INITIAL_THREADS.slice(0, 3).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setDockThread(t.id)}
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap ${
                        dockThread === t.id ? 'bg-blue-600 text-white' : 'bg-white border border-[#E4E4E7] text-zinc-700'
                      }`}
                    >
                      {t.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
                <div className="p-3 h-36 overflow-y-auto space-y-2 text-xs">
                  <div className="rounded-xl bg-zinc-100 p-2.5 text-zinc-800">
                    {INITIAL_THREADS.find((t) => t.id === dockThread)?.lastMsg}
                  </div>
                </div>
                <div className="p-2 border-t border-[#E4E4E7] flex gap-1.5">
                  <input
                    placeholder="Quick reply..."
                    className="flex-1 rounded-lg border border-[#E4E4E7] px-2.5 py-1.5 text-xs outline-none"
                  />
                  <button className="rounded-lg bg-[#18181B] text-white px-2.5 py-1.5 text-xs font-semibold">
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setDockOpen(true)}
                className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-[#18181B] text-white px-4 py-2.5 text-xs font-bold shadow-lg"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Messages (3)
              </button>
            )}
          </div>
        </section>

        {/* OPTION 3 */}
        <section>
          <OptionHeader
            num={3}
            title="Project-Anchored Proof-of-Work Chat (GitHub PR Review Style)"
            desc="Every conversation is tied directly to a Student Build or Research Paper (`PRJ-01`, `RP-01`). Shows repo, live demo & tech stack pinned in the chat header."
          />
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-zinc-950 text-white p-3">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold">PRJ-01 • Distributed Raft KV Store (Rust + Tokio)</p>
                  <p className="text-[10px] text-zinc-400">Thread between Aarav Mohanty (CSE &apos;26) &amp; Debadatta Rath (CTO @ HyperScale Labs)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-mono">Vercel Live</span>
                <span className="rounded-md bg-emerald-500/20 text-emerald-300 px-2 py-1 text-[10px] font-semibold">Endorsed</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-[#E4E4E7] p-3 bg-[#FAFAFA]">
                <p className="font-bold text-zinc-800 mb-1">Debadatta Rath • Alumni Code Critique</p>
                <p className="text-zinc-600">
                  Line 142 in <code className="font-mono bg-zinc-200/70 px-1 rounded">raft_node.rs</code>: consider batching AppendEntries RPCs under high write contention.
                </p>
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3">
                <p className="font-bold text-blue-900 mb-1">Aarav Mohanty • Student Reply</p>
                <p className="text-blue-800">
                  Done sir! Batched 64 entries per tick — throughput jumped from 14k to 41k ops/sec. Ready for final review.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* OPTION 4 */}
        <section>
          <OptionHeader
            num={4}
            title="Channel-Based Campus Hub + DMs (Slack / Discord Style)"
            desc="Combines public topic channels (`#referral-ask`, `#system-design`, `#research-papers`) with 1-on-1 DMs so alumni can answer 20 students at once or go private."
          />
          <div className="rounded-2xl border border-[#E4E4E7] bg-white overflow-hidden grid grid-cols-1 md:grid-cols-12 h-[290px]">
            <div className="md:col-span-3 bg-[#111318] text-zinc-300 p-3 space-y-3 text-xs">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Campus Channels</p>
                {['#referral-ask', '#system-design', '#research-papers', '#hackathon-squads'].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setChannel(ch)}
                    className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-1.5 ${
                      channel === ch ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-white/5'
                    }`}
                  >
                    <Hash className="w-3.5 h-3.5" /> {ch.slice(1)}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Direct Messages</p>
                <p className="px-2 py-1 text-[11px] text-zinc-400">● Debadatta Rath</p>
                <p className="px-2 py-1 text-[11px] text-zinc-400">● Soumya Ranjan</p>
              </div>
            </div>
            <div className="md:col-span-9 p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2">
                  <span className="text-sm font-bold flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-blue-600" /> {channel.slice(1)}
                  </span>
                  <span className="text-[11px] text-zinc-500">45 Students • 14 Alumni Online</span>
                </div>
                <div className="text-xs space-y-2.5">
                  <div>
                    <span className="font-bold">Soumya Ranjan</span>{' '}
                    <span className="text-[10px] rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 font-semibold">Google • ITER &apos;17</span>
                    <p className="text-zinc-600 mt-0.5">
                      Posting in <span className="font-semibold">{channel}</span>: If anyone built a distributed cache or compiler project this sem, tag me with your live URL!
                    </p>
                  </div>
                  <div>
                    <span className="font-bold">Rohan Mishra</span>{' '}
                    <span className="text-[10px] rounded bg-zinc-100 text-zinc-700 px-1.5 py-0.5">CSE 3rd Yr</span>
                    <p className="text-zinc-600 mt-0.5">Shared PRJ-12 (Go Redis-compatible cache with LRU + RESP3 parser).</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <input
                  placeholder={`Message ${channel}...`}
                  className="flex-1 rounded-xl border border-[#E4E4E7] px-3 py-1.5 text-xs outline-none"
                />
                <button className="rounded-xl bg-[#18181B] text-white px-3 py-1.5 text-xs font-semibold">Post</button>
              </div>
            </div>
          </div>
        </section>

        {/* OPTION 5 */}
        <section>
          <OptionHeader
            num={5}
            title="Mentorship & Office-Hours Structured Chat"
            desc="Includes inline interactive action cards inside the chat (`Book 15-Min Mock Interview`, `Request Resume Review`, `Share Referral Link`) for high-signal exchanges."
          />
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="md:col-span-2 space-y-2.5 text-xs">
              <div className="rounded-xl bg-zinc-100 p-3">
                <p className="font-bold">Priya Das (Senior ML @ Razorpay)</p>
                <p className="text-zinc-600 mt-0.5">I opened 3 fifteen-minute slots this Saturday for ITER 2026 ML portfolio reviews.</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <div>
                    <p className="font-bold text-emerald-950">Saturday, 6:30 PM IST • 15-Min 1:1</p>
                    <p className="text-[11px] text-emerald-700">Topic: ML System Design &amp; Resume Audit</p>
                  </div>
                </div>
                <button className="rounded-lg bg-emerald-600 text-white px-3 py-1.5 text-[11px] font-bold">
                  Confirm Slot
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-3 space-y-2 text-xs">
              <p className="font-bold">One-Click Chat Templates</p>
              <button className="w-full text-left rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1.5 hover:border-blue-500">
                Ask for 15-min Code Review
              </button>
              <button className="w-full text-left rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1.5 hover:border-blue-500">
                Request Referral with Proof-of-Work
              </button>
              <button className="w-full text-left rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1.5 hover:border-blue-500">
                Invite Co-Author for Research Paper
              </button>
            </div>
          </div>
        </section>

        {/* OPTION 6 */}
        <section>
          <OptionHeader
            num={6}
            title="People Directory Cards → Slide-Over Chat Drawer"
            desc="Browse online Alumni & Student Builders as cards with `Message` CTA; clicking opens a focused slide-over chat drawer without cluttering the main feed."
          />
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {INITIAL_THREADS.map((t) => (
                <div key={t.id} className="rounded-xl border border-[#E4E4E7] p-3 flex flex-col justify-between gap-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{t.name}</span>
                      <span className={`h-2 w-2 rounded-full ${t.online ? 'bg-emerald-500' : 'bg-zinc-300'}`} />
                    </div>
                    <p className="text-[11px] text-blue-600 font-medium">{t.role}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">{t.topic}</p>
                  </div>
                  <button
                    onClick={() => setDrawerPerson(t.name)}
                    className="w-full rounded-lg bg-[#18181B] hover:bg-zinc-800 text-white py-1.5 text-[11px] font-semibold"
                  >
                    Open Chat Drawer
                  </button>
                </div>
              ))}
            </div>
            <div className="md:col-span-5 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2">
                <span className="text-xs font-bold">Chatting with {drawerPerson}</span>
                <X className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="py-4 text-xs text-zinc-600">
                &ldquo;Hey {drawerPerson?.split(' ')[0]}, saw your active opening on Alum Connect — would love to share my latest build!&rdquo;
              </div>
              <div className="flex gap-1.5">
                <input placeholder="Write message..." className="flex-1 rounded-lg border border-[#E4E4E7] bg-white px-2.5 py-1.5 text-xs" />
                <button className="rounded-lg bg-blue-600 text-white px-3 py-1.5 text-xs font-semibold">Send</button>
              </div>
            </div>
          </div>
        </section>

        {/* OPTION 7 */}
        <section>
          <OptionHeader
            num={7}
            title="3-Pane Executive Workspace (Threads + Chat + Live Profile/Build Context)"
            desc="Power-user layout: right rail automatically surfaces the person's ITER Reg. No., CGPA/Company, GitHub projects, and verified offers while you chat."
          />
          <div className="rounded-2xl border border-[#E4E4E7] bg-white overflow-hidden grid grid-cols-1 md:grid-cols-12 text-xs">
            <div className="md:col-span-3 border-r border-[#E4E4E7] p-3 bg-[#FCFCFD] space-y-2">
              <p className="font-bold text-zinc-500 text-[10px] uppercase">Active Chats</p>
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-2 font-semibold">Aarav Mohanty • CSE</div>
              <div className="rounded-lg p-2 hover:bg-zinc-100">Debadatta Rath • CTO</div>
              <div className="rounded-lg p-2 hover:bg-zinc-100">Ananya Senapati • AI</div>
            </div>
            <div className="md:col-span-5 border-r border-[#E4E4E7] p-3 flex flex-col justify-between min-h-[180px]">
              <div className="space-y-2">
                <div className="rounded-xl bg-zinc-100 p-2.5">Aarav: Sharing my 2-min demo walkthrough for HyperScale Labs backend role.</div>
                <div className="rounded-xl bg-[#18181B] text-white p-2.5 ml-6">You: Looks sharp! Moving you to technical round.</div>
              </div>
              <input placeholder="Reply in thread..." className="rounded-lg border border-[#E4E4E7] px-2.5 py-1.5 mt-3" />
            </div>
            <div className="md:col-span-4 p-3 bg-[#FAFAFA] space-y-2">
              <p className="font-bold text-sm">Aarav Mohanty</p>
              <p className="font-mono text-[10px] text-zinc-500">REG: 2241016421 • CGPA 9.18</p>
              <div className="flex flex-wrap gap-1">
                <span className="rounded bg-white border border-[#E4E4E7] px-1.5 py-0.5 text-[10px]">Rust</span>
                <span className="rounded bg-white border border-[#E4E4E7] px-1.5 py-0.5 text-[10px]">Distributed Systems</span>
              </div>
              <p className="text-[11px] text-emerald-700 font-semibold pt-1">3 Live Builds • 1 IEEE Paper</p>
            </div>
          </div>
        </section>

        {/* OPTION 8 */}
        <section>
          <OptionHeader
            num={8}
            title="Referral Fast-Track Chat (Structured Proof-of-Work Pitch Card)"
            desc="Eliminates vague 'hi sir pls refer' messages. Students send a structured Pitch Card; Alumni click `Approve Referral` or `Schedule Call` right inside the chat."
          />
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-3">
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  <Briefcase className="w-3 h-3" /> Structured Referral Request • Google L3/SWE
                </span>
                <p className="text-xs font-bold">Aarav Mohanty (2026 Batch • 9.18 CGPA)</p>
                <p className="text-[11px] text-zinc-600">
                  Proof-of-Work: <strong>PRJ-01 Distributed Raft KV Store</strong> + <strong>RP-01 IEEE Paper</strong>
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setReferralStatus('approved')}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold inline-flex items-center gap-1 ${
                    referralStatus === 'approved' ? 'bg-emerald-600 text-white' : 'bg-[#18181B] text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  {referralStatus === 'approved' ? 'Referral Approved ✓' : 'Approve Referral'}
                </button>
                <button
                  onClick={() => setReferralStatus('call')}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                    referralStatus === 'call' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-[#E4E4E7]'
                  }`}
                >
                  {referralStatus === 'call' ? 'Call Requested ✓' : 'Schedule 15m Screen'}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* OPTION 9 */}
        <section>
          <OptionHeader
            num={9}
            title="Role-Filtered Inbox Tabs (All / Mentors / Recruiters / Co-Builders)"
            desc="Designed to drop cleanly as a dedicated `Chat` section inside Student & Alumni portals with instant role-based segmentation."
          />
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {(['All', 'Mentors', 'Recruiters', 'Co-Builders'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTabFilter(tab)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                    tabFilter === tab ? 'bg-[#18181B] text-white' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="divide-y divide-[#F4F4F5] border border-[#E4E4E7] rounded-xl">
              {INITIAL_THREADS.map((t) => (
                <div key={t.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <p className="font-bold">
                      {t.name} <span className="text-[11px] font-normal text-zinc-500">• {t.role}</span>
                    </p>
                    <p className="text-zinc-500 mt-0.5">{t.lastMsg}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-lg border border-[#E4E4E7] px-2.5 py-1 font-semibold shrink-0">
                    Open <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OPTION 10 */}
        <section>
          <OptionHeader
            num={10}
            title="Minimalist Clean Bubble Chat (iMessage / WhatsApp Web Aesthetic)"
            desc="Ultra-clean, distraction-free messaging focused purely on fast back-and-forth conversations with file/code attachments and read receipts."
          />
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 max-w-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-[#F4F4F5] pb-2.5">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  SR
                </div>
                <div>
                  <p className="text-xs font-bold">Soumya Ranjan Panigrahi</p>
                  <p className="text-[10px] text-emerald-600 font-medium">Active now</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="space-y-2 text-xs">
              <div className="bg-zinc-100 rounded-2xl rounded-bl-sm px-3.5 py-2 max-w-[80%]">
                Hey! Saw your PRJ-04 build. Send your resume PDF here and I&apos;ll push your referral tonight.
              </div>
              <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-3.5 py-2 max-w-[80%] ml-auto flex items-center gap-2">
                <FileCode2 className="w-3.5 h-3.5 shrink-0" />
                <span>Aarav_Mohanty_ITER26_Resume.pdf</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500">
                <Paperclip className="w-4 h-4" />
              </button>
              <input
                placeholder="iMessage-style quick reply..."
                className="flex-1 rounded-full border border-[#E4E4E7] bg-zinc-50 px-4 py-1.5 text-xs outline-none"
              />
              <button className="rounded-full bg-blue-600 text-white p-2">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
