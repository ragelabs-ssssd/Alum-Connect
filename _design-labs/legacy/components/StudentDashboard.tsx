'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import ProductCard from './ProductCard';
import CenterFeed from './CenterFeed';
import {
  Rocket,
  PlusCircle,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Users,
  Briefcase,
  Compass,
  Sparkles,
  Code2,
  Play,
  Award,
  Clock,
} from 'lucide-react';
import { CampusProduct } from '../types';

const ROLE_OPTIONS = [
  'Frontend Dev',
  'Backend / Cloud',
  'AI / ML Engineer',
  'UI/UX Designer',
  '1st Yr Beta Scout',
  'Mobile Dev',
];

export default function StudentDashboard() {
  const {
    currentUser,
    products,
    bounties,
    addNewProductShip,
    toggleRoastResolved,
    openLiveDemoModal,
    applyToBounty,
  } = useApp();

  const [subView, setSubView] = useState<'studio' | 'feed'>('studio');
  const [showBuilderForm, setShowBuilderForm] = useState(true);
  const [appliedBounties, setAppliedBounties] = useState<Record<string, boolean>>({});
  const [shipSuccess, setShipSuccess] = useState<string | null>(null);

  // Future Product Builder state
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [category, setCategory] = useState<CampusProduct['category']>('web_app');
  const [hiringStatus, setHiringStatus] = useState<CampusProduct['hiringStatus']>('Looking for 1st Yr Scouts');
  const [techInput, setTechInput] = useState('Next.js, TypeScript, Tailwind, PostgreSQL');
  const [rolesNeeded, setRolesNeeded] = useState<string[]>(['Backend / Cloud', '1st Yr Beta Scout']);
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');

  const myBuilds = products.filter((p) =>
    p.squadMembers.some((m) => m.name.toLowerCase() === currentUser.name.toLowerCase())
  );

  const cohortBounties = bounties.filter(
    (b) => b.targetCohort === 'All' || b.targetCohort === currentUser.cohort
  );

  const unresolvedRoastsCount = myBuilds.reduce(
    (sum, p) => sum + p.roasts.filter((r) => !r.resolved).length,
    0
  );

  const toggleRoleNeeded = (role: string) => {
    setRolesNeeded((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleLaunchProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addNewProductShip({
      title: title.trim(),
      tagline: tagline.trim() || 'Student-built solution for campus & industry needs',
      description:
        problemStatement.trim() ||
        tagline.trim() ||
        'Built in the ITER Student Builder Studio.',
      problemStatement: problemStatement.trim() || undefined,
      rolesNeeded: rolesNeeded.length > 0 ? rolesNeeded : undefined,
      category,
      hiringStatus,
      tags: tags.length > 0 ? tags : ['Next.js', 'TypeScript'],
      githubUrl: githubUrl.trim() || 'https://github.com/iter-builders',
      liveDemoUrl: liveDemoUrl.trim() || 'https://demo.soa.ac.in',
      userTraction: 1,
    });

    setShipSuccess(title.trim());
    setTitle('');
    setTagline('');
    setProblemStatement('');
    setGithubUrl('');
    setLiveDemoUrl('');
    setTimeout(() => setShipSuccess(null), 4000);
  };

  return (
    <main className="flex-1 min-w-0 space-y-4">
      {/* Student Dashboard Hero */}
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-500/20 border border-blue-400/40 px-2.5 py-0.5 text-[10px] font-mono font-bold text-blue-200 uppercase">
                Student Builder Dashboard • {currentUser.cohortTag || 'Builder'}
              </span>
              {currentUser.squadName && (
                <span className="text-[11px] text-slate-300 font-medium">
                  Squad: {currentUser.squadName}
                </span>
              )}
            </div>
            <h1 className="mt-2 text-xl font-black tracking-tight sm:text-2xl flex items-center gap-2">
              <Rocket className="w-5 h-5 text-blue-400" />
              Build Future Products Around Real Needs
            </h1>
            <p className="mt-1 text-xs text-slate-300 max-w-2xl">
              Define the problem you want to solve, assemble your ITER squad, ship prototypes, and resolve 5-min alumni roasts to earn Verified Vouch Cards.
            </p>
          </div>

          {/* Sub-view switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700 shrink-0">
            <button
              onClick={() => setSubView('studio')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subView === 'studio'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              Builder Studio
            </button>
            <button
              onClick={() => setSubView('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                subView === 'feed'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Campus Feed
            </button>
          </div>
        </div>

        {/* Quick Student Metrics */}
        <div className="mt-4 grid grid-cols-3 gap-2.5">
          <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">My Active Builds</div>
            <div className="text-lg font-black text-white">{myBuilds.length}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Open Roast Items</div>
            <div className="text-lg font-black text-amber-300">{unresolvedRoastsCount}</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
            <div className="text-[10px] font-mono uppercase text-slate-400">Earned Vouches</div>
            <div className="text-lg font-black text-emerald-300">{currentUser.vouchCardsCount || 0}</div>
          </div>
        </div>
      </div>

      {subView === 'feed' ? (
        <CenterFeed />
      ) : (
        <div className="space-y-4">
          {/* Future Product Builder Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  Design & Launch a Future Product
                </h2>
              </div>
              <button
                onClick={() => setShowBuilderForm(!showBuilderForm)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
              >
                {showBuilderForm ? 'Hide Builder' : 'Open Builder'}
              </button>
            </div>

            {shipSuccess && (
              <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>{shipSuccess}</strong> is now live in your builds and visible on the Alumni Marketplace!
                </span>
              </div>
            )}

            {showBuilderForm && (
              <form onSubmit={handleLaunchProduct} className="mt-4 space-y-3.5 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., HostelPulse AI or MessMate"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      One-Line Pitch *
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g., Real-time campus shuttle & mess queue tracker"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student / Campus Need (Problem Statement)
                  </label>
                  <textarea
                    rows={2}
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Describe the exact student or industry need you are solving and how your product addresses it..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as CampusProduct['category'])}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                    >
                      <option value="web_app">Web Application</option>
                      <option value="ai_ml">AI / ML Product</option>
                      <option value="dev_tool">Developer Tool</option>
                      <option value="mobile_app">Mobile App</option>
                      <option value="iot">IoT / Hardware</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Squad Goal</label>
                    <select
                      value={hiringStatus}
                      onChange={(e) =>
                        setHiringStatus(e.target.value as CampusProduct['hiringStatus'])
                      }
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                    >
                      <option value="Looking for 1st Yr Scouts">Looking for 1st Yr Scouts</option>
                      <option value="Open for Internships">Open for Internships</option>
                      <option value="Open for Acqui-hire">Open for Acqui-hire</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    placeholder="Next.js, FastAPI, PostgreSQL, Docker"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    Collaborator Roles Needed
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ROLE_OPTIONS.map((role) => {
                      const active = rolesNeeded.includes(role);
                      return (
                        <button
                          type="button"
                          key={role}
                          onClick={() => toggleRoleNeeded(role)}
                          className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all ${
                            active
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {active ? '✓ ' : '+ '}
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">GitHub URL</label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      value={liveDemoUrl}
                      onChange={(e) => setLiveDemoUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-sm transition-colors"
                  >
                    <Rocket className="w-3.5 h-3.5" />
                    Ship Product to Campus & Alumni Marketplace
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* My Builds & Roast Action Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-blue-600" />
                My Squad Builds & Alumni Feedback ({myBuilds.length})
              </h2>
            </div>

            {myBuilds.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-xs text-slate-500">
                You haven&apos;t shipped a build under your name yet. Use the Builder above to launch your first product!
              </div>
            ) : (
              myBuilds.map((product) => (
                <div key={product.id} className="space-y-2">
                  {(product.problemStatement || (product.rolesNeeded && product.rolesNeeded.length > 0)) && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-2.5 text-xs space-y-1">
                      {product.problemStatement && (
                        <p className="text-slate-700">
                          <span className="font-bold text-blue-900">Need Solved:</span>{' '}
                          {product.problemStatement}
                        </p>
                      )}
                      {product.rolesNeeded && product.rolesNeeded.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-bold text-blue-900">Recruiting:</span>
                          {product.rolesNeeded.map((r) => (
                            <span
                              key={r}
                              className="rounded-full bg-white border border-blue-200 px-2 py-0.5 text-[10px] font-semibold text-blue-800"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <ProductCard product={product} />

                  {/* Actionable Roast Checklist for Student */}
                  {product.roasts.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-3 space-y-2">
                      <div className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Alumni Roast Action Items ({product.roasts.filter((r) => !r.resolved).length} pending)
                      </div>
                      {product.roasts.map((roast) => (
                        <div
                          key={roast.id}
                          className="flex items-start justify-between gap-3 rounded-lg bg-white border border-amber-100 p-2.5 text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">
                              {roast.alumName}{' '}
                              <span className="text-[10px] text-slate-500 font-normal">
                                ({roast.alumCompany}) • {roast.category.replace('_', ' ')}
                              </span>
                            </div>
                            <p className={`mt-0.5 text-slate-600 ${roast.resolved ? 'line-through opacity-60' : ''}`}>
                              {roast.feedback}
                            </p>
                          </div>
                          <button
                            onClick={() => toggleRoastResolved(product.id, roast.id)}
                            className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition-colors ${
                              roast.resolved
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-600 text-white hover:bg-amber-500'
                            }`}
                          >
                            {roast.resolved ? '✓ Resolved' : 'Mark Resolved'}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Bounties Matched to Student Cohort */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Open Alumni Bounties for Your Cohort ({cohortBounties.length})
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Paid 10-day sprints & QA</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {cohortBounties.map((bounty) => {
                const isApplied = appliedBounties[bounty.id];
                return (
                  <div
                    key={bounty.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{bounty.title}</div>
                        <div className="text-[11px] text-slate-500">
                          {bounty.company} • Posted by {bounty.alumName} (Batch &apos;{String(bounty.alumBatch).slice(-2)})
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[11px] font-bold shrink-0">
                        {bounty.stipend}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{bounty.description}</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {bounty.duration}
                        </span>
                        <span>• {bounty.appliedSquadsCount} squads applied</span>
                      </div>
                      <button
                        disabled={isApplied}
                        onClick={() => {
                          applyToBounty(bounty.id);
                          setAppliedBounties((prev) => ({ ...prev, [bounty.id]: true }));
                        }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                          isApplied
                            ? 'bg-emerald-100 text-emerald-800 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isApplied ? '✓ Squad Applied' : 'Apply with My Squad'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
