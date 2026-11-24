'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import {
  Store,
  Shield,
  PlusCircle,
  Filter,
  Award,
  Briefcase,
  Handshake,
  CheckCircle2,
  Zap,
  Sparkles,
  Clock,
} from 'lucide-react';
import { CampusProduct, StudentCohort } from '../types';

const HIRING_FILTERS: Array<'all' | CampusProduct['hiringStatus']> = [
  'all',
  'Open for Acqui-hire',
  'Open for Internships',
  'Looking for 1st Yr Scouts',
  'Funded & Scaling',
];

export default function AlumniMarketplaceDashboard() {
  const {
    currentUser,
    products,
    bounties,
    dealRooms,
    searchQuery,
    addBounty,
  } = useApp();

  const [hiringFilter, setHiringFilter] = useState<'all' | CampusProduct['hiringStatus']>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | CampusProduct['category']>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showPostBounty, setShowPostBounty] = useState(false);
  const [bountySuccess, setBountySuccess] = useState<string | null>(null);

  // Bounty form state
  const [bTitle, setBTitle] = useState('');
  const [bStipend, setBStipend] = useState('₹25,000');
  const [bDuration, setBDuration] = useState('10-Day Sprint');
  const [bCohort, setBCohort] = useState<StudentCohort | 'All'>('3rd_year');
  const [bDesc, setBDesc] = useState('');
  const [bSkills, setBSkills] = useState('Next.js, TypeScript, REST APIs');

  const filteredProducts = products.filter((p) => {
    if (hiringFilter !== 'all' && p.hiringStatus !== hiringFilter) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (verifiedOnly && p.vouches.length === 0 && p.status !== 'verified') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.squadMembers.some((m) => m.name.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const verifiedCount = products.filter((p) => p.vouches.length > 0 || p.status === 'verified').length;

  const handlePostBounty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bTitle.trim()) return;

    addBounty({
      title: bTitle.trim(),
      stipend: bStipend.trim() || '₹20,000',
      duration: bDuration.trim() || '10-Day Sprint',
      targetCohort: bCohort,
      description: bDesc.trim() || 'Commissioned via ITER Alumni Marketplace.',
      deliverables: ['Production PR + Unit Tests', '5-min Loom Walkthrough'],
      skillsRequired: bSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      deadline: 'Nov 30, 2026',
    });

    setBountySuccess(bTitle.trim());
    setBTitle('');
    setBDesc('');
    setShowPostBounty(false);
    setTimeout(() => setBountySuccess(null), 4000);
  };

  return (
    <main className="flex-1 min-w-0 space-y-4">
      {/* Alumni Marketplace Hero */}
      <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-indigo-500/25 border border-indigo-400/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-indigo-200 uppercase">
                Alumni Talent & Product Marketplace
              </span>
              {currentUser.bandwidthShield && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-200">
                  <Shield className="w-3 h-3" />
                  Shield: {currentUser.bandwidthShield}
                </span>
              )}
            </div>
            <h1 className="mt-2 text-xl font-black tracking-tight sm:text-2xl flex items-center gap-2">
              <Store className="w-5 h-5 text-indigo-400" />
              Discover, Roast, Vouch & Acqui-Hire ITER Squads
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl">
              Browse live student-built MVPs with verified GitHub commits and campus traction. Commission paid 10-day bounties or open direct Deal Rooms.
            </p>
          </div>

          <button
            onClick={() => setShowPostBounty(!showPostBounty)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 transition-colors shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            {showPostBounty ? 'Close Bounty Form' : 'Post Paid Bounty / Gig'}
          </button>
        </div>

        {/* Marketplace KPI Strip */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Listed MVPs</div>
            <div className="text-lg font-black text-white">{products.length}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Verified Vouched</div>
            <div className="text-lg font-black text-emerald-300">{verifiedCount}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Active Deal Rooms</div>
            <div className="text-lg font-black text-indigo-300">{dealRooms.length}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Open Bounties</div>
            <div className="text-lg font-black text-amber-300">{bounties.length}</div>
          </div>
        </div>
      </div>

      {bountySuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Bounty <strong>{bountySuccess}</strong> is now live for ITER student squads!
          </span>
        </div>
      )}

      {/* Post Bounty Drawer */}
      {showPostBounty && (
        <form
          onSubmit={handlePostBounty}
          className="rounded-2xl border border-indigo-200 bg-white p-5 shadow-xs space-y-3 text-xs"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              Commission a Student Squad (New Marketplace Bounty)
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bounty Title *</label>
              <input
                type="text"
                required
                value={bTitle}
                onChange={(e) => setBTitle(e.target.value)}
                placeholder="e.g., Build Webhook Retry Queue in Go"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Stipend / Prize</label>
                <input
                  type="text"
                  value={bStipend}
                  onChange={(e) => setBStipend(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Cohort</label>
                <select
                  value={bCohort}
                  onChange={(e) => setBCohort(e.target.value as StudentCohort | 'All')}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                >
                  <option value="All">All Years</option>
                  <option value="1st_year">1st Year Scouts</option>
                  <option value="2nd_year">2nd Year Builders</option>
                  <option value="3rd_year">3rd Year Sprinters</option>
                  <option value="4th_year">4th Year Leads</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Scope & Deliverables</label>
            <textarea
              rows={2}
              value={bDesc}
              onChange={(e) => setBDesc(e.target.value)}
              placeholder="Describe the engineering task, acceptance criteria, and potential PPO / fast-track upside..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Required Skills</label>
              <input
                type="text"
                value={bSkills}
                onChange={(e) => setBSkills(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration</label>
              <input
                type="text"
                value={bDuration}
                onChange={(e) => setBDuration(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-bold text-white"
            >
              Publish Bounty to Student Marketplace
            </button>
          </div>
        </form>
      )}

      {/* Marketplace Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Filter className="w-3.5 h-3.5 text-indigo-600" />
            Marketplace Filters
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as 'all' | CampusProduct['category'])}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="web_app">Web Apps</option>
              <option value="ai_ml">AI / ML</option>
              <option value="dev_tool">Dev Tools</option>
              <option value="mobile_app">Mobile Apps</option>
              <option value="iot">IoT</option>
            </select>

            <button
              onClick={() => setVerifiedOnly(!verifiedOnly)}
              className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold border transition-colors ${
                verifiedOnly
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Vouched Only
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {HIRING_FILTERS.map((status) => (
            <button
              key={status}
              onClick={() => setHiringFilter(status)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                hiringFilter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status === 'all' ? 'All Deal Types' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Marketplace Product Listings */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs text-slate-500">
            No student products match your current marketplace filters.
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="space-y-1.5">
              {product.problemStatement && (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-2 text-xs text-indigo-950">
                  <span className="font-bold">Student Need Addressed:</span> {product.problemStatement}
                </div>
              )}
              <ProductCard product={product} />
            </div>
          ))
        )}
      </div>

      {/* Active Deal Rooms & Posted Bounties Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Handshake className="w-4 h-4 text-indigo-600" />
            Active Deal Rooms ({dealRooms.length})
          </h3>
          {dealRooms.slice(0, 4).map((deal) => (
            <div key={deal.id} className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{deal.productTitle}</span>
                <span className="rounded-full bg-indigo-100 text-indigo-800 px-2 py-0.5 text-[10px] font-bold">
                  {deal.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {deal.senderName} ({deal.senderCompany}) • {deal.actionType.replace('_', ' ')}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-2.5">
          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Live Marketplace Bounties ({bounties.length})
          </h3>
          {bounties.slice(0, 4).map((b) => (
            <div key={b.id} className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-900 truncate">{b.title}</span>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold shrink-0">
                  {b.stipend}
                </span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5 flex items-center justify-between">
                <span>{b.company}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {b.appliedSquadsCount} squads applied
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
