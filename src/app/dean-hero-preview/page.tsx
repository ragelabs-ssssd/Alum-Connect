'use client';

import React from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  CheckCircle2,
  Download,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

function OptionHeader({ num, title, desc }: { num: number; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-2.5">
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#18181B] text-xs font-bold text-white shrink-0">
        {num}
      </span>
      <div>
        <h2 className="text-sm font-bold text-[#18181B]">{title}</h2>
        <p className="text-[11px] text-[#52525B]">{desc}</p>
      </div>
    </div>
  );
}

export default function DeanHeroPreviewPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B]">
      <header className="sticky top-0 z-20 border-b border-[#E4E4E7] bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <h1 className="text-lg font-bold tracking-tight">
            Dean Overview Hero — 10 Layout &amp; Content Options (Local Review)
          </h1>
          <p className="text-xs text-[#52525B]">
            Reply with your chosen option number (1–10) and I will make it live on `/dean`.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8 space-y-10">
        {/* Option 1 */}
        <section>
          <OptionHeader
            num={1}
            title="Placement & Package Executive Brief"
            desc="Leads with verified compensation packages, PPOs & alumni hiring velocity"
          />
          <div className="rounded-3xl bg-[#111318] text-white p-6 space-y-4 border border-zinc-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                <TrendingUp className="w-3.5 h-3.5" />
                Placement &amp; Referral Velocity • 2026
              </span>
              <span className="text-xs font-semibold text-zinc-400">6 PPOs (₹22–36 LPA) • 4 Internships</span>
            </div>
            <h3 className="text-2xl font-bold leading-snug">
              10 Verified Offers &amp; 32 Active Alumni Openings Driven by Live Student Builds.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300">
              Every placement and internship offer is backed by verified GitHub codebases, live deployments, and alumni endorsements across HyperScale Labs, Google, Microsoft, Razorpay, AWS &amp; Cisco.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-500 text-zinc-950 px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" /> Check Proper Report
              </span>
              <span className="rounded-full border border-white/25 px-4 py-2 text-xs font-semibold">
                Placement Audit (10)
              </span>
            </div>
          </div>
        </section>

        {/* Option 2 */}
        <section>
          <OptionHeader
            num={2}
            title="NAAC / NBA Accreditation & Outcome Card"
            desc="Clean light executive card tailored for institutional accreditation & academic audits"
          />
          <div className="rounded-3xl border border-[#E4E4E7] border-l-4 border-l-[#2563EB] bg-white p-6 space-y-4 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold text-[#2563EB]">
                <ShieldCheck className="w-3.5 h-3.5" />
                ITER, Siksha &apos;O&apos; Anusandhan • Accreditation &amp; Outcome Audit
              </span>
              <span className="text-xs font-bold text-emerald-700">Avg Cohort CGPA: 9.06 / 10</span>
            </div>
            <h3 className="text-xl font-bold">
              31 Verified Builders • 45 Production Projects • 5 Peer-Reviewed Research Papers
            </h3>
            <p className="text-xs sm:text-sm text-[#52525B]">
              Auditable proof-of-work portfolio linking undergraduate coursework, IEEE/ACM/NeurIPS research output, and 14 verified alumni mentors.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#18181B] text-white px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5" /> Check Proper Report
              </span>
              <span className="rounded-full border border-[#E4E4E7] px-4 py-2 text-xs font-semibold">
                Placement Audit (10)
              </span>
            </div>
          </div>
        </section>

        {/* Option 3 */}
        <section>
          <OptionHeader
            num={3}
            title="Split Stat-Matrix Hero"
            desc="Left narrative + CTAs, right 2x2 live metric grid inside the hero itself"
          />
          <div className="rounded-3xl bg-[#0F172A] text-white p-6 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            <div className="md:col-span-7 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                Dean &amp; T&amp;P Command
              </span>
              <h3 className="text-xl font-bold leading-snug">
                Institutional Proof-of-Work &amp; Placement Intelligence
              </h3>
              <p className="text-xs text-slate-300">
                Track top-performing students, alumni mentorship time, research publications, and direct hiring outcomes in one view.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="rounded-full bg-emerald-500 text-zinc-950 px-4 py-1.5 text-xs font-bold">
                  Check Proper Report
                </span>
                <span className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold">
                  Placement Audit (10)
                </span>
              </div>
            </div>
            <div className="md:col-span-5 grid grid-cols-2 gap-2.5 text-center">
              {[
                { val: '45 + 5', lbl: 'Projects & Papers' },
                { val: '9.06', lbl: 'Avg Cohort CGPA' },
                { val: '131 Yrs', lbl: 'Alumni Exp' },
                { val: '₹36 LPA', lbl: 'Highest PPO' },
              ].map((m) => (
                <div key={m.lbl} className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <div className="text-base font-bold">{m.val}</div>
                  <div className="text-[10px] text-slate-300">{m.lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Option 4 */}
        <section>
          <OptionHeader
            num={4}
            title="Campus Innovation Photo Banner"
            desc="Uses the Indian engineering campus & AI lab photo behind a sleek dark overlay"
          />
          <div className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-6 space-y-4">
            <img
              src="/images/indian-campus-lab.jpg"
              alt="ITER Campus Lab"
              className="absolute inset-0 h-full w-full object-cover opacity-30"
            />
            <div className="relative z-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur px-3 py-1 text-[11px] font-semibold">
                <GraduationCap className="w-3.5 h-3.5" />
                ITER Innovation &amp; Placement Snapshot
              </span>
              <h3 className="text-2xl font-bold">
                From Campus Labs to Global Engineering Teams.
              </h3>
              <p className="text-xs sm:text-sm text-zinc-200 max-w-xl">
                45 student builds, 5 IEEE/NeurIPS/ACM papers, and 14 alumni leaders mentoring 31 verified ITER engineers.
              </p>
              <div className="flex gap-2">
                <span className="rounded-full bg-white text-zinc-950 px-4 py-2 text-xs font-bold">
                  Check Proper Report
                </span>
                <span className="rounded-full bg-white/15 backdrop-blur px-4 py-2 text-xs font-semibold">
                  Placement Audit (10)
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Option 5 */}
        <section>
          <OptionHeader
            num={5}
            title="4-Stage Conversion Funnel Banner"
            desc="Shows the end-to-end campus pipeline: Builders → Builds → Mentors → Offers"
          />
          <div className="rounded-3xl border border-[#E4E4E7] bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold">Campus-to-Offer Conversion Pipeline</h3>
              <span className="rounded-full bg-emerald-500 text-zinc-950 px-3.5 py-1.5 text-xs font-bold">
                Check Proper Report
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {[
                { step: '1. Cohort', val: '31 Students', sub: '9.06 Avg CGPA' },
                { step: '2. Output', val: '50 Builds', sub: '45 Projects + 5 Papers' },
                { step: '3. Mentorship', val: '14 Alumni', sub: '32 Direct Openings' },
                { step: '4. Outcomes', val: '10 Offers', sub: '6 PPOs • 4 Interns' },
              ].map((f) => (
                <div key={f.step} className="rounded-2xl bg-[#F4F4F5] p-3 space-y-0.5">
                  <div className="text-[10px] font-bold text-[#2563EB] uppercase">{f.step}</div>
                  <div className="text-sm font-bold">{f.val}</div>
                  <div className="text-[10px] text-[#52525B]">{f.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Option 6 */}
        <section>
          <OptionHeader
            num={6}
            title="Minimalist White Apple-Style Header"
            desc="Ultra-clean light card with crisp typography and zero dark block heaviness"
          />
          <div className="rounded-3xl border border-[#E4E4E7] bg-white p-6 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
              ITER • Cohort 2026 Executive Brief
            </div>
            <h3 className="text-2xl font-bold tracking-tight">
              Student Craft, Research &amp; Alumni Hiring at a Glance.
            </h3>
            <p className="text-xs sm:text-sm text-[#52525B] max-w-2xl">
              Review top-performing students, alumni mentorship hours, project domain distribution, and verified PPO/internship offers.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-full bg-[#18181B] text-white px-4 py-2 text-xs font-semibold">
                Check Proper Report
              </span>
              <span className="rounded-full border border-[#E4E4E7] px-4 py-2 text-xs font-semibold">
                Placement Audit (10)
              </span>
            </div>
          </div>
        </section>

        {/* Option 7 */}
        <section>
          <OptionHeader
            num={7}
            title="Quarterly Dean's Scorecard Strip"
            desc="Compact executive strip maximizing above-the-fold space for charts below"
          />
          <div className="rounded-2xl border border-[#E4E4E7] bg-[#18181B] text-white p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Placement Season 2026 • Live Scorecard
              </div>
              <div className="text-base font-bold">
                50 Verified Builds • 14 Alumni Leaders • 10 Confirmed Offers
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-500 text-zinc-950 px-4 py-1.5 text-xs font-bold">
                Check Proper Report
              </span>
              <span className="rounded-full border border-white/25 px-3.5 py-1.5 text-xs font-semibold">
                Audit (10)
              </span>
            </div>
          </div>
        </section>

        {/* Option 8 */}
        <section>
          <OptionHeader
            num={8}
            title="Actionable Attention & Pipeline Banner"
            desc="Highlights items needing Dean/T&P focus (papers under review, open slots, unplaced builders)"
          />
          <div className="rounded-3xl border border-amber-200 bg-amber-50/60 p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                T&amp;P Action Summary
              </span>
              <span className="rounded-full bg-[#18181B] text-white px-3.5 py-1.5 text-xs font-semibold">
                Check Proper Report
              </span>
            </div>
            <h3 className="text-lg font-bold text-[#18181B]">
              21 Active Builders Ready for 32 Open Alumni Referral Slots
            </h3>
            <p className="text-xs text-[#52525B]">
              10 students already placed (6 PPOs, 4 Interns). 1 research paper (RP-02) under peer review at ACM CCS.
            </p>
          </div>
        </section>

        {/* Option 9 */}
        <section>
          <OptionHeader
            num={9}
            title="Dual-Spotlight Hero (Top Student + Top Alumnus)"
            desc="Highlights the #1 performing student and #1 contributing alumnus right in the header"
          />
          <div className="rounded-3xl bg-[#111318] text-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-lg font-bold">Cohort Leaders &amp; Institutional Telemetry</h3>
              <span className="rounded-full bg-emerald-500 text-zinc-950 px-4 py-1.5 text-xs font-bold">
                Check Proper Report
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl bg-white/10 p-3 flex items-center gap-3">
                <img src="/images/avatars/male-a-1.jpg" alt="Vikramaditya" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="text-[10px] text-sky-300 font-bold">TOP STUDENT</div>
                  <div className="font-bold">Vikramaditya Sen • 9.68 CGPA</div>
                  <div className="text-[11px] text-zinc-300">Microsoft ₹32 LPA PPO • RP-04</div>
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 flex items-center gap-3">
                <img src="/images/avatars/alum-m-0.jpg" alt="Rajesh" className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="text-[10px] text-emerald-300 font-bold">TOP HIRING ALUMNUS</div>
                  <div className="font-bold">Rajesh Kumar Mohanty &apos;15</div>
                  <div className="text-[11px] text-zinc-300">Razorpay • 6 Direct Openings</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Option 10 */}
        <section>
          <OptionHeader
            num={10}
            title="Boardroom Presentation Summary Card"
            desc="Structured 3-pillar executive summary with direct CSV & Report triggers"
          />
          <div className="rounded-3xl border border-[#E4E4E7] bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">ITER Annual Innovation &amp; Placement Summary</h3>
                <p className="text-xs text-[#52525B]">Prepared for Dean, Academic Council &amp; T&amp;P Cell</p>
              </div>
              <div className="flex gap-2">
                <span className="rounded-full bg-[#2563EB] text-white px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5" /> Check Proper Report
                </span>
                <span className="rounded-full border border-[#E4E4E7] px-3.5 py-2 text-xs font-semibold inline-flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> CSV
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-[#F4F4F5] p-3">
                <div className="font-bold">1. Research &amp; Builds</div>
                <div className="text-[#52525B] mt-0.5">45 deployed projects + 5 papers (IEEE, NeurIPS, ICSE, ACM).</div>
              </div>
              <div className="rounded-xl bg-[#F4F4F5] p-3">
                <div className="font-bold">2. Placement Velocity</div>
                <div className="text-[#52525B] mt-0.5">6 PPOs (₹22–36 LPA) + 4 Internships (₹50k–80k/mo).</div>
              </div>
              <div className="rounded-xl bg-[#F4F4F5] p-3">
                <div className="font-bold">3. Alumni Network</div>
                <div className="text-[#52525B] mt-0.5">14 mentors • 131 yrs collective exp • 32 open roles.</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
