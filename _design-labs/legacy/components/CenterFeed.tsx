'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import {
  Compass,
  PlusCircle,
  Briefcase,
  Award,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Layers,
  Terminal,
} from 'lucide-react';
import { StudentCohort } from '../types';

export default function CenterFeed() {
  const {
    products,
    bounties,
    spotlights,
    currentUser,
    feedFilter,
    setFeedFilter,
    selectedCohortFilter,
    setSelectedCohortFilter,
    searchQuery,
    applyToBounty,
    addNewProductShip,
    openDealRoomModal,
  } = useApp();

  const [isShippingNew, setIsShippingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTagline, setNewTagline] = useState('');
  const [newCategory, setNewCategory] = useState<'web_app' | 'mobile_app' | 'ai_ml' | 'dev_tool' | 'iot'>('web_app');
  const [newGithub, setNewGithub] = useState('');
  const [newTraction, setNewTraction] = useState('25');
  const [appliedBounties, setAppliedBounties] = useState<Record<string, boolean>>({});

  const handleApplyBounty = (bountyId: string) => {
    applyToBounty(bountyId);
    setAppliedBounties((prev) => ({ ...prev, [bountyId]: true }));
  };

  const handleShipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addNewProductShip({
      title: newTitle.trim(),
      tagline: newTagline.trim() || 'New campus build shipped on SOA Alum Connect',
      category: newCategory,
      githubUrl: newGithub.trim() || 'https://github.com/iter-builders',
      userTraction: Number(newTraction) || 15,
      previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    });

    setNewTitle('');
    setNewTagline('');
    setNewGithub('');
    setIsShippingNew(false);
  };

  // Filter products by search and cohort
  const filteredProducts = products.filter((p) => {
    if (selectedCohortFilter !== 'all') {
      const hasCohortMember = p.squadMembers.some((m) => m.cohort === selectedCohortFilter);
      if (!hasCohortMember) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      const matchSquad = p.squadMembers.some((m) => m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchTags && !matchSquad) return false;
    }
    return true;
  });

  return (
    <div className="flex-1 space-y-4 max-w-2xl w-full">
      {/* Ship MVP / Publish Build Bar for Students */}
      {currentUser.role === 'student' && (
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white p-4 shadow-xs">
          {!isShippingNew ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Ready to showcase a campus MVP, {currentUser.name.split(' ')[0]}?
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Publish your GitHub repo & live demo link to receive 5-min alumni roasts & vouch cards.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsShippingNew(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                Ship MVP Card
              </button>
            </div>
          ) : (
            <form onSubmit={handleShipSubmit} className="space-y-3 pt-1">
              <div className="flex items-center justify-between border-b border-blue-200 pb-2">
                <span className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  Publish New Campus Product Ship
                </span>
                <button
                  type="button"
                  onClick={() => setIsShippingNew(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Cancel ✕
                </button>
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder="Project Name (e.g. NoteShare SOA, FoodFleet ITER)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <input
                  type="text"
                  required
                  placeholder="One-line Tagline (e.g. Distributed hostel food deliveries run by student couriers)"
                  value={newTagline}
                  onChange={(e) => setNewTagline(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="url"
                  placeholder="GitHub Repo URL (https://github.com/...)"
                  value={newGithub}
                  onChange={(e) => setNewGithub(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                />
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs focus:border-blue-500 focus:outline-none"
                >
                  <option value="web_app">Web Application (Next.js/React)</option>
                  <option value="mobile_app">Mobile App (React Native/Flutter)</option>
                  <option value="ai_ml">AI / ML Tool</option>
                  <option value="iot">IoT & Hardware Lab Project</option>
                  <option value="dev_tool">Developer Tool</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">
                  Will be credited to your squad: <strong className="text-slate-800">{currentUser.name}</strong>
                </span>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-1.5 text-xs font-bold text-white shadow-xs"
                >
                  Publish to Proof-of-Work Feed →
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Feed Filter Header Tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 px-1">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFeedFilter('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                feedFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Activity ({products.length + bounties.length + spotlights.length})
            </button>
            <button
              onClick={() => setFeedFilter('products')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                feedFilter === 'products'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Campus Ships ({products.length})
            </button>
            <button
              onClick={() => setFeedFilter('bounties')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                feedFilter === 'bounties'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Alum Bounties ({bounties.length})
            </button>
            <button
              onClick={() => setFeedFilter('spotlights')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                feedFilter === 'spotlights'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Alum Spotlights ({spotlights.length})
            </button>
          </div>

          <div className="hidden sm:flex items-center text-[11px] text-slate-500 font-mono">
            <span>Live SOA Stream</span>
          </div>
        </div>

        {/* Cohort Filter Chips */}
        <div className="pt-2 px-1 flex items-center gap-1.5 overflow-x-auto text-[11px] pb-1">
          <span className="font-semibold text-slate-400 text-[10px] uppercase font-mono mr-1">
            Cohort:
          </span>
          {[
            { id: 'all', label: 'All Cohorts' },
            { id: '1st_year', label: '1st Yr: Beta Scouts' },
            { id: '2nd_year', label: '2nd Yr: Core Builders' },
            { id: '3rd_year', label: '3rd Yr: Bounty Sprinters' },
            { id: '4th_year', label: '4th Yr: Leads & Career' },
          ].map((chip) => {
            const isSelected = selectedCohortFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedCohortFilter(chip.id as any)}
                className={`rounded-full px-2.5 py-0.5 font-medium whitespace-nowrap transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Feed Content List */}
      <div className="space-y-4">
        {/* 1. Campus Product Cards */}
        {(feedFilter === 'all' || feedFilter === 'products') && (
          <>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </>
        )}

        {/* 2. Alum Bounties & Tasks Cards */}
        {(feedFilter === 'all' || feedFilter === 'bounties') && (
          <>
            {bounties.map((bounty) => (
              <div
                key={bounty.id}
                className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={bounty.alumAvatar}
                      alt={bounty.alumName}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{bounty.alumName}</span>
                        <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded font-semibold">
                          ITER '{String(bounty.alumBatch).slice(2)} • {bounty.company}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">Posted Paid Engineering Bounty</div>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-1 text-xs font-extrabold font-mono border border-emerald-300">
                    {bounty.stipend}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">{bounty.title}</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{bounty.description}</p>
                </div>

                {/* Deliverables Checklist */}
                <div className="bg-white p-3 rounded-xl border border-indigo-100 text-xs space-y-1">
                  <div className="font-bold text-slate-800 text-[11px] font-mono uppercase">
                    Deliverables & Scope ({bounty.duration}):
                  </div>
                  {bounty.deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                      <span>{del}</span>
                    </div>
                  ))}
                </div>

                {/* Skills tags and apply action */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-indigo-100">
                  <div className="flex flex-wrap gap-1">
                    {bounty.skillsRequired.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-mono text-indigo-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleApplyBounty(bounty.id)}
                    disabled={appliedBounties[bounty.id]}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all shadow-xs ${
                      appliedBounties[bounty.id]
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {appliedBounties[bounty.id] ? (
                      <>Applied as Squad ✓</>
                    ) : (
                      <>Apply as Squad ({bounty.appliedSquadsCount} Applied)</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}

        {/* 3. Alum Spotlights & Job Switch */}
        {(feedFilter === 'all' || feedFilter === 'spotlights') && (
          <>
            {spotlights.map((spotlight) => (
              <div
                key={spotlight.id}
                className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50/30 via-white to-slate-50 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={spotlight.avatar}
                      alt={spotlight.alumName}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{spotlight.alumName}</span>
                        <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                          ITER '{String(spotlight.batch).slice(2)} • {spotlight.currentCompany}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">{spotlight.currentRole}</div>
                    </div>
                  </div>

                  <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 text-[10px] font-bold uppercase font-mono">
                    {spotlight.type.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{spotlight.headline}</h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{spotlight.details}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-amber-100 text-xs">
                  <span className="text-slate-400 text-[11px] font-mono">{spotlight.date}</span>
                  <button className="text-xs font-bold text-amber-800 hover:underline">
                    Connect / Request Slot →
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
