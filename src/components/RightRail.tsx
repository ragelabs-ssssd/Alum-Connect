'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Zap,
  Briefcase,
  Users,
  CheckCircle,
  ExternalLink,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Mail,
  Flame,
} from 'lucide-react';

export default function RightRail() {
  const {
    products,
    dealRooms,
    openRoastModal,
    openDealRoomModal,
    openLiveDemoModal,
    setActiveTab,
  } = useApp();

  // Top squads for Talent Radar
  const topSquads = products.slice(0, 3);

  // Products with roasts or awaiting roast
  const roastQueue = products.filter((p) => p.status === 'in_review' || p.roasts.length < 3);

  return (
    <aside className="w-full lg:w-80 space-y-4 shrink-0">
      {/* 1. Vouched Talent Radar (For Founders / CHROs) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Vouched Talent Radar</span>
          </div>
          <span className="rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold px-1.5 py-0.5 border border-emerald-200">
            Top Squads
          </span>
        </div>

        <p className="text-[11px] text-slate-500 leading-tight">
          Verified squads ready for Summer 2026 internships, paid freelance modules, or direct acqui-hire.
        </p>

        <div className="space-y-2.5">
          {topSquads.map((product) => (
            <div
              key={product.id}
              className="group rounded-xl border border-slate-100 bg-slate-50/70 p-2.5 hover:border-blue-300 hover:bg-white transition-all text-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 group-hover:text-blue-700">
                  {product.title}
                </span>
                <span className="text-[10px] font-mono text-emerald-600 font-bold">
                  {product.userTraction}+ users
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Squad Lead: {product.squadMembers[0]?.name}</span>
                <span className="font-mono text-[10px] text-slate-400">
                  {product.commitsCount} commits
                </span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                <span className="text-[10px] font-medium text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                  {product.hiringStatus}
                </span>
                <button
                  onClick={() => openDealRoomModal(product, 'acqui_hire')}
                  className="text-[10px] font-bold text-slate-700 hover:text-blue-600 flex items-center gap-0.5"
                >
                  Deal Room →
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setActiveTab('radar')}
          className="w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 py-1"
        >
          View Full Talent Radar Directory →
        </button>
      </div>

      {/* 2. 5-Minute Async Roast Queue (For Busy Alumni) */}
      <div className="rounded-2xl border border-pink-200 bg-gradient-to-br from-pink-50/40 via-white to-slate-50 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-pink-100 pb-2.5">
          <div className="flex items-center gap-1.5 font-bold text-xs text-pink-950">
            <Flame className="w-4 h-4 text-pink-600" />
            <span>5-Min Async Roast Queue</span>
          </div>
          <span className="rounded bg-pink-100 text-pink-800 font-mono text-[10px] font-bold px-1.5 py-0.5">
            Zero-Meeting
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-tight">
          Drop a quick 2-line critique on student API architectures, UI responsiveness, or roadmaps.
        </p>

        <div className="space-y-2">
          {roastQueue.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl p-2.5 border border-pink-100 shadow-2xs space-y-1.5 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{product.title}</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" /> ~3 mins
                </span>
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {product.squadMembers.map((m) => m.name.split(' ')[0]).join(', ')} ({product.squadMembers[0]?.year})
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-pink-700 bg-pink-50 px-1.5 py-0.2 rounded">
                  {product.roasts.length} reviews logged
                </span>
                <button
                  onClick={() => openRoastModal(product)}
                  className="inline-flex items-center gap-1 rounded bg-pink-600 hover:bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs"
                >
                  <Zap className="w-3 h-3" />
                  Roast Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Friday Digest Preview */}
      <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-white shadow-xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Mail className="w-4 h-4 text-amber-400" />
            <span>Friday Digest System</span>
          </div>
          <span className="text-[9px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
            Bandwidth Shielded
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Instead of spamming alumni inboxes with raw emails, the platform aggregates the top 3 Vouched builds every Friday afternoon matched to their tech stack.
        </p>
        <div className="rounded-lg bg-slate-800/80 p-2 text-[10px] font-mono text-emerald-300 border border-slate-700">
          ✓ Next Dispatch: Friday 4:00 PM IST (Curated 3 projects)
        </div>
      </div>

      {/* 4. Live Deal Room Activity Ticker */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            <span>Recent Deal Room Signals</span>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
        </div>

        <div className="space-y-2 text-xs">
          {dealRooms.slice(0, 3).map((deal) => (
            <div key={deal.id} className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[11px] space-y-1">
              <div className="flex items-center justify-between font-semibold text-slate-900">
                <span>{deal.senderCompany}</span>
                <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1 rounded">
                  {deal.actionType.replace('_', ' ')}
                </span>
              </div>
              <p className="text-slate-600 text-[10px] truncate">{deal.message}</p>
              <div className="text-[9px] text-slate-400 font-mono text-right">{deal.timestamp}</div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
