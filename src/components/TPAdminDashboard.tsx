'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TP_ANALYTICS } from '../data/seedData';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Briefcase,
  Building,
  CheckCircle2,
  Download,
  Calendar,
  Layers,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';

export default function TPAdminDashboard() {
  const { products, bounties, dealRooms } = useApp();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportReport = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-mono font-bold">
                PLACEMENT DEAN DASHBOARD • SOA T&P CELL
              </span>
              <span className="text-xs text-slate-500 font-mono">Academic Year 2026–2027</span>
            </div>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              Placement Dean & Institutional Analytics
            </h2>
            <p className="mt-1 text-xs text-slate-600 max-w-2xl">
              Real-time monitoring of campus MVP builds, verified alumni vouch certificates, and direct off-campus/on-campus squad hiring loops.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportReport}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              {downloadSuccess ? 'Report Exported (CSV) ✓' : 'Export T&P Institutional Report'}
            </button>
          </div>
        </div>

        {/* 6 Key Stat Cards */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Total Live MVPs</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{TP_ANALYTICS.totalLiveMVPs}</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> +8 this month
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Alumni Reviews</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{TP_ANALYTICS.alumniReviewsCount}</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> 5-min roasts
            </div>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5">
            <div className="text-[10px] uppercase font-mono font-bold text-emerald-800">Vouch Cards Issued</div>
            <div className="text-2xl font-black text-emerald-950 mt-1">{TP_ANALYTICS.vouchCardsIssued}</div>
            <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
              Recognized certificates
            </div>
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3.5">
            <div className="text-[10px] uppercase font-mono font-bold text-indigo-800">Squads Acqui-Hired</div>
            <div className="text-2xl font-black text-indigo-950 mt-1">{TP_ANALYTICS.squadsHired}</div>
            <div className="text-[10px] text-indigo-700 font-semibold mt-0.5">
              42 students placed
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
            <div className="text-[10px] uppercase font-mono font-bold text-slate-400">Active Companies</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{TP_ANALYTICS.activeCompanies}</div>
            <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
              Alumni employers
            </div>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5">
            <div className="text-[10px] uppercase font-mono font-bold text-blue-800">Conversion Rate</div>
            <div className="text-2xl font-black text-blue-950 mt-1">{TP_ANALYTICS.placementConversionRate}</div>
            <div className="text-[10px] text-blue-700 font-semibold mt-0.5">
              For Vouched squads
            </div>
          </div>
        </div>
      </div>

      {/* Cohort Progression Funnel & Top Hiring Partners */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cohort Funnel */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Cohort Progression Pipeline</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">1st Yr to 4th Yr Funnel</span>
          </div>

          <div className="space-y-3">
            {TP_ANALYTICS.cohortBreakdown.map((cohort, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900 font-mono">
                      {cohort.year}
                    </span>
                    <span className="text-xs font-semibold text-blue-700">{cohort.label}</span>
                  </div>
                  <span className="font-bold text-xs text-slate-800 font-mono">
                    {cohort.activeCount} Active Students
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                    style={{ width: `${(cohort.activeCount / 200) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                  <span>Primary Function: {cohort.role}</span>
                  <span className="text-emerald-700 font-semibold font-mono">
                    {cohort.verifiedBadges} Verified Vouch Cards
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Corporate & Startup Partners */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Top Hiring Alumni Partners</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">2026 Batch</span>
          </div>

          <div className="space-y-2.5">
            {TP_ANALYTICS.topHiringPartners.map((partner, pIdx) => (
              <div
                key={pIdx}
                className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-white font-mono font-bold text-[10px]">
                    {partner.logo}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{partner.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{partner.avgPackage} avg package</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="rounded-full bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-[11px] font-mono">
                    {partner.hires} Hires
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 text-[11px] text-blue-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
              Live Marketplace & Deal Room Pulse
            </div>
            <p className="text-slate-600 leading-snug">
              Tracking <strong>{products.length}</strong> active student products,{' '}
              <strong>{bounties.length}</strong> alumni bounties, and{' '}
              <strong>{dealRooms.length}</strong> live Deal Room offers in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
