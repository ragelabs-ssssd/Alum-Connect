'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  ChevronDown,
  FileText,
  Layers,
  MapPin,
  Plus,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

export default function PostJobPreviewPage() {
  const [opt1Open, setOpt1Open] = useState(false);
  const [opt2Step, setOpt2Step] = useState<1 | 2>(1);
  const [opt3Section, setOpt3Section] = useState<string>('jd');
  const [opt4Title, setOpt4Title] = useState('Backend Systems Engineer (SDE-1)');
  const [opt4LastDate, setOpt4LastDate] = useState('2026-12-05');
  const [opt6Tab, setOpt6Tab] = useState<'role' | 'jd' | 'deadline'>('role');
  const [opt7Modal, setOpt7Modal] = useState(false);
  const [opt8Title, setOpt8Title] = useState('');

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <header className="sticky top-0 z-20 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <h1 className="text-lg font-bold tracking-tight">
            Post Alumni Job / Referral — 10 Detailed Form Options (Local Review)
          </h1>
          <p className="text-xs text-[#52525B]">
            Test each option interactively below. Reply with your chosen option number (1–10) and I will make it live in `/alumni`.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Option 1 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">1</span>
            <div>
              <h2 className="text-sm font-bold">LinkedIn-Style Click-to-Expand Composer</h2>
              <p className="text-[11px] text-[#52525B]">Compact 1-line bar in feed; expands into full JD, Last Date &amp; Eligibility on click.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-3">
            {!opt1Open ? (
              <button
                type="button"
                onClick={() => setOpt1Open(true)}
                className="w-full flex items-center justify-between rounded-full border border-[#E4E4E7] bg-[#F4F4F5] px-4 py-2.5 text-xs text-[#52525B] hover:border-[#2563EB]"
              >
                <span>Post a job or referral at HyperScale Labs (click to expand)...</span>
                <span className="rounded-full bg-[#2563EB] text-white px-3 py-1 text-[10px] font-semibold">+ Add Details</span>
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">New Detailed Job Opening</span>
                  <button type="button" onClick={() => setOpt1Open(false)} className="text-[11px] text-[#52525B] hover:text-[#18181B]">Collapse</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Job Title *" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
                  <input defaultValue="HyperScale Labs" placeholder="Company *" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
                  <input placeholder="Location / Remote" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
                  <input type="date" aria-label="Last Date" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
                </div>
                <textarea rows={3} placeholder="Full Job Description (JD), responsibilities & min qualifications..." className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-3 text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Eligible Batch (e.g. 2025/2026)" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
                  <input placeholder="Referral Slots (e.g. 3)" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Option 2 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">2</span>
            <div>
              <h2 className="text-sm font-bold">2-Step Wizard (Role Basics → Full JD &amp; Deadline)</h2>
              <p className="text-[11px] text-[#52525B]">Keeps initial form compact, then transitions to JD, Last Date &amp; Eligibility.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className={opt2Step === 1 ? 'text-[#2563EB]' : 'text-[#52525B]'}>1. Role &amp; Pay</span>
              <span className={opt2Step === 2 ? 'text-[#2563EB]' : 'text-[#52525B]'}>2. JD, Last Date &amp; Criteria</span>
            </div>
            {opt2Step === 1 ? (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Job Title" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
                  <input defaultValue="₹24 – 30 LPA" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
                </div>
                <button type="button" onClick={() => setOpt2Step(2)} className="rounded-full bg-[#18181B] text-white px-4 py-1.5 text-xs font-semibold">
                  Next: Add JD &amp; Last Date →
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <textarea rows={2} placeholder="Detailed Job Description (JD)..." className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-2.5 text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-1.5 text-xs" />
                  <input placeholder="Min CGPA / Batch" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-1.5 text-xs" />
                </div>
                <div className="flex justify-between">
                  <button type="button" onClick={() => setOpt2Step(1)} className="text-xs font-semibold text-[#52525B]">← Back</button>
                  <button type="button" className="rounded-full bg-[#2563EB] text-white px-4 py-1.5 text-xs font-semibold">Publish Opening</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Option 3 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">3</span>
            <div>
              <h2 className="text-sm font-bold">Accordion Sections Form</h2>
              <p className="text-[11px] text-[#52525B]">Compact core fields + expandable JD, Deadline &amp; Interview Process sections.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2">
            <input placeholder="Job Title & Company" className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
            {[
              { id: 'jd', label: 'Job Description & Responsibilities' },
              { id: 'deadline', label: 'Last Date, Slots & Eligibility' },
              { id: 'rounds', label: 'Interview Rounds & Apply Link' },
            ].map((sec) => (
              <div key={sec.id} className="rounded-xl border border-[#E4E4E7] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpt3Section(opt3Section === sec.id ? '' : sec.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold bg-[#FAFAFA]"
                >
                  <span>{sec.label}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {opt3Section === sec.id && (
                  <div className="p-3 bg-white text-xs space-y-2">
                    <textarea rows={2} placeholder={`Enter ${sec.label.toLowerCase()}...`} className="w-full rounded-lg border border-[#E4E4E7] bg-[#F4F4F5] p-2 text-xs" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Option 4 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">4</span>
            <div>
              <h2 className="text-sm font-bold">Live Split Preview (Form + Student Card)</h2>
              <p className="text-[11px] text-[#52525B]">Fill detailed JD &amp; deadline on the left; preview how students see it on the right.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <input value={opt4Title} onChange={(e) => setOpt4Title(e.target.value)} className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-2.5 py-1.5 text-xs" />
              <input type="date" value={opt4LastDate} onChange={(e) => setOpt4LastDate(e.target.value)} className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-2.5 py-1.5 text-xs" />
              <textarea rows={2} placeholder="JD summary..." className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-2 text-xs" />
            </div>
            <div className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-3 space-y-1.5 text-xs">
              <div className="text-[10px] font-bold text-[#2563EB]">STUDENT VIEW PREVIEW</div>
              <div className="font-bold">{opt4Title || 'Untitled Role'}</div>
              <div className="text-[10px] text-[#52525B]">Last Date: {opt4LastDate} • HyperScale Labs</div>
            </div>
          </div>
        </div>

        {/* Option 5 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">5</span>
            <div>
              <h2 className="text-sm font-bold">Template-First Quick Starter</h2>
              <p className="text-[11px] text-[#52525B]">1-click presets auto-fill full JD, interview rounds &amp; last date.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
            <div className="flex flex-wrap gap-1.5">
              {['SDE-1 Full-Time', 'Summer Intern', 'AI Research Bounty'].map((preset) => (
                <span key={preset} className="rounded-full bg-blue-50 text-[#2563EB] px-2.5 py-1 text-[11px] font-semibold">
                  + {preset}
                </span>
              ))}
            </div>
            <textarea rows={2} defaultValue="JD: Own core backend APIs, distributed queues & observability. 2 DSA + 1 System Design round. Last Date: Dec 10." className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-2.5 text-xs" />
          </div>
        </div>

        {/* Option 6 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">6</span>
            <div>
              <h2 className="text-sm font-bold">Tabbed Detail Composer</h2>
              <p className="text-[11px] text-[#52525B]">Compact box with 3 tabs: Role Basics | Full JD | Deadline &amp; Eligibility.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-3">
            <div className="flex gap-1 rounded-full bg-[#F4F4F5] p-1 w-fit">
              {(['role', 'jd', 'deadline'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setOpt6Tab(t)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${
                    opt6Tab === t ? 'bg-[#18181B] text-white' : 'text-[#52525B]'
                  }`}
                >
                  {t === 'jd' ? 'Full JD' : t === 'deadline' ? 'Last Date & Rules' : 'Role Info'}
                </button>
              ))}
            </div>
            {opt6Tab === 'role' && <input placeholder="Job Title, Company & CTC" className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />}
            {opt6Tab === 'jd' && <textarea rows={2} placeholder="Detailed Job Description, Tech Stack & Responsibilities..." className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-2.5 text-xs" />}
            {opt6Tab === 'deadline' && <input type="date" className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />}
          </div>
        </div>

        {/* Option 7 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">7</span>
            <div>
              <h2 className="text-sm font-bold">Compact Card + Full Detailed Modal</h2>
              <p className="text-[11px] text-[#52525B]">Stays short in feed; clicking opens a spacious modal with all 10+ fields.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold">Post a Detailed Alumni Opening</div>
              <div className="text-[11px] text-[#52525B]">Add Job Title, full JD, Last Date, CGPA &amp; Referral Slots</div>
            </div>
            <button type="button" onClick={() => setOpt7Modal(true)} className="rounded-full bg-[#2563EB] text-white px-4 py-2 text-xs font-semibold shrink-0">
              + Create Opening
            </button>
          </div>
        </div>

        {/* Option 8 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">8</span>
            <div>
              <h2 className="text-sm font-bold">Focus-Driven Progressive Form</h2>
              <p className="text-[11px] text-[#52525B]">Shows only Job Title first; start typing to reveal JD, Last Date, Mode &amp; Slots.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
            <input
              value={opt8Title}
              onChange={(e) => setOpt8Title(e.target.value)}
              placeholder="Start typing Job Title to reveal full options..."
              className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs"
            />
            {opt8Title.trim().length > 0 && (
              <div className="space-y-2 pt-1">
                <textarea rows={2} placeholder="Full Job Description (JD)..." className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-2.5 text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-1.5 text-xs" />
                  <input placeholder="Batch / Min CGPA" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-1.5 text-xs" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Option 9 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">9</span>
            <div>
              <h2 className="text-sm font-bold">Structured 3-Block Bento Form</h2>
              <p className="text-[11px] text-[#52525B]">Cleanly separates Role &amp; Pay, Full JD, and Deadline &amp; Eligibility.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5 text-xs">
            <div className="rounded-xl bg-[#F4F4F5] p-2.5 font-semibold">1. Role Title, Company, Location &amp; CTC</div>
            <div className="rounded-xl bg-[#F4F4F5] p-2.5 font-semibold">2. Detailed JD, Skills &amp; Interview Process</div>
            <div className="rounded-xl bg-[#F4F4F5] p-2.5 font-semibold">3. Last Date to Apply, Slots &amp; Batch Cutoff</div>
          </div>
        </div>

        {/* Option 10 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white">10</span>
            <div>
              <h2 className="text-sm font-bold">AI-Drafted JD + Checklist Builder</h2>
              <p className="text-[11px] text-[#52525B]">1-click JD drafting + Last Date, Referral Note &amp; CGPA/Branch toggles.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-[#E4E4E7] bg-white p-4 space-y-2.5">
            <div className="flex gap-2">
              <input placeholder="Job Title (e.g. AI Systems Intern)" className="flex-1 rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-1.5 text-xs" />
              <button type="button" className="rounded-xl bg-blue-50 text-[#2563EB] px-3 py-1.5 text-[11px] font-semibold">✨ Auto-Draft JD</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-1.5 text-xs" />
              <input placeholder="Branches (CSE / CSIT / ECE)" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-1.5 text-xs" />
            </div>
          </div>
        </div>
      </main>

      {opt7Modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Create Detailed Alumni Opening</h3>
              <button type="button" onClick={() => setOpt7Modal(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input placeholder="Job Title *" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
              <input defaultValue="HyperScale Labs" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
              <input placeholder="Compensation" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
              <input type="date" className="rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] px-3 py-2 text-xs" />
            </div>
            <textarea rows={3} placeholder="Full Job Description (JD)..." className="w-full rounded-xl border border-[#E4E4E7] bg-[#F4F4F5] p-3 text-xs" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpt7Modal(false)} className="rounded-full border px-4 py-1.5 text-xs font-semibold">Close</button>
              <button type="button" onClick={() => setOpt7Modal(false)} className="rounded-full bg-[#2563EB] text-white px-4 py-1.5 text-xs font-semibold">Publish</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
