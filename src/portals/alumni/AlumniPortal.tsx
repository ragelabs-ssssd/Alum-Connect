'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlumniPersona,
  BandwidthShield,
  CampusProduct,
  StudentCohort,
  UserProfile,
} from '../../types';
import {
  ArrowLeft,
  Award,
  Briefcase,
  CheckCircle2,
  Code2,
  ExternalLink,
  Eye,
  Flame,
  GitBranch,
  LogIn,
  PlusCircle,
  Search,
  ShieldCheck,
  Store,
  UserCheck,
} from 'lucide-react';

interface AlumniPortalProps {
  onBackToGateway?: () => void;
}

type PortalTab = 'marketplace' | 'bounties' | 'deal_rooms';

const PERSONA_OPTIONS: Array<{
  value: AlumniPersona;
  label: string;
  sublabel: string;
}> = [
  { value: 'ic', label: 'MNC IC (0–5 Yrs)', sublabel: 'Vouch & Internal Referrals' },
  { value: 'manager', label: 'Hiring Manager (5–15 Yrs)', sublabel: '5-Min Roast & Fast-Track' },
  { value: 'founder', label: 'Startup Founder (10–25 Yrs)', sublabel: 'Acqui-Hire & Paid Bounties' },
  { value: 'chro', label: 'CHRO / Recruiter', sublabel: 'Verified Campus Shortlist' },
];

const SHIELD_OPTIONS: BandwidthShield[] = [
  '2 async reviews/mo',
  '5-min async roast',
  '1 session/quarter',
  'Direct deal room only',
];

const DEAL_STATUS_FILTERS: Array<'all' | CampusProduct['hiringStatus']> = [
  'all',
  'Open for Acqui-hire',
  'Open for Internships',
  'Looking for 1st Yr Scouts',
  'Funded & Scaling',
];

const CATEGORY_FILTERS: Array<{ value: 'all' | CampusProduct['category']; label: string }> = [
  { value: 'all', label: 'All Categories' },
  { value: 'web_app', label: 'Web Apps' },
  { value: 'mobile_app', label: 'Mobile Apps' },
  { value: 'ai_ml', label: 'AI / ML' },
  { value: 'dev_tool', label: 'Dev Tools' },
  { value: 'iot', label: 'IoT & Hardware' },
];

const COHORT_OPTIONS: Array<{ value: StudentCohort | 'All'; label: string }> = [
  { value: 'All', label: 'All Cohorts (1st–4th Yr)' },
  { value: '1st_year', label: '1st Year (Beta Scouts)' },
  { value: '2nd_year', label: '2nd Year (Core Builders)' },
  { value: '3rd_year', label: '3rd Year (Bounty Sprinters)' },
  { value: '4th_year', label: '4th Year (Campus Leads)' },
];

export default function AlumniPortal({ onBackToGateway }: AlumniPortalProps) {
  const {
    currentUser,
    setCurrentUser,
    allPresetUsers,
    products,
    bounties,
    dealRooms,
    searchQuery,
    setSearchQuery,
    addBounty,
    openRoastModal,
    openVouchModal,
    openDealRoomModal,
    openLiveDemoModal,
  } = useApp();

  const presetAlumni = useMemo(
    () => allPresetUsers.filter((u) => u.role === 'alumni'),
    [allPresetUsers]
  );

  // Start directly inside Hiring Portal when an alumni persona is already active
  const [isSignedIn, setIsSignedIn] = useState(currentUser.role === 'alumni');
  const [identifier, setIdentifier] = useState('');
  const [selectedPersona, setSelectedPersona] = useState<AlumniPersona>('founder');
  const [selectedShield, setSelectedShield] =
    useState<BandwidthShield>('Direct deal room only');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<PortalTab>('marketplace');
  const [dealStatusFilter, setDealStatusFilter] =
    useState<'all' | CampusProduct['hiringStatus']>('all');
  const [categoryFilter, setCategoryFilter] =
    useState<'all' | CampusProduct['category']>('all');
  const [vouchedOnly, setVouchedOnly] = useState(false);

  // Bounty form state
  const [bountyTitle, setBountyTitle] = useState('');
  const [bountyStipend, setBountyStipend] = useState('₹25,000');
  const [bountyDuration, setBountyDuration] = useState('10-Day Sprint');
  const [bountyCohort, setBountyCohort] = useState<StudentCohort | 'All'>('3rd_year');
  const [bountySkills, setBountySkills] = useState('Next.js, TypeScript, REST APIs');
  const [bountyDeliverables, setBountyDeliverables] = useState(
    'Production PR + Unit Tests, 5-min Loom Walkthrough'
  );
  const [bountyDeadline, setBountyDeadline] = useState('Nov 30, 2026');
  const [bountyDescription, setBountyDescription] = useState('');
  const [bountySubmitting, setBountySubmitting] = useState(false);
  const [bountySuccess, setBountySuccess] = useState<string | null>(null);

  const activeAlum =
    currentUser.role === 'alumni' ? currentUser : presetAlumni[0] || currentUser;

  const performAlumniLogin = async (
    loginId: string,
    persona: AlumniPersona,
    shield: BandwidthShield,
    fallbackAlum?: UserProfile
  ) => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      const res = await fetch('/api/alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          payload: {
            identifier: loginId.trim(),
            persona,
            shield,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'ok' || !data.user) {
        throw new Error(data?.message || 'Unable to authenticate alumni account');
      }
      setCurrentUser(data.user);
      setIsSignedIn(true);
    } catch (err: unknown) {
      if (fallbackAlum) {
        setCurrentUser(fallbackAlum);
        setIsSignedIn(true);
      } else {
        setAuthError(err instanceof Error ? err.message : 'Alumni authentication failed');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setAuthError('Please enter your work email or full name.');
      return;
    }
    await performAlumniLogin(identifier, selectedPersona, selectedShield);
  };

  const handleDemoLogin = async (alum: UserProfile) => {
    const persona = alum.alumniPersona || 'ic';
    const shield = alum.bandwidthShield || '2 async reviews/mo';
    setIdentifier(alum.email);
    setSelectedPersona(persona);
    setSelectedShield(shield);
    await performAlumniLogin(alum.email, persona, shield, alum);
  };

  const handleCreateBounty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bountyTitle.trim()) return;

    setBountySubmitting(true);
    const parsedSkills = bountySkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedDeliverables = bountyDeliverables
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const bountyInput = {
      title: bountyTitle.trim(),
      stipend: bountyStipend.trim() || '₹25,000',
      duration: bountyDuration.trim() || '10-Day Sprint',
      targetCohort: bountyCohort,
      description:
        bountyDescription.trim() ||
        'Commissioned 10-day sprint module via Alumni Hiring Portal.',
      deliverables:
        parsedDeliverables.length > 0
          ? parsedDeliverables
          : ['Production PR + Unit Tests', '5-min Loom Walkthrough'],
      skillsRequired:
        parsedSkills.length > 0 ? parsedSkills : ['Next.js', 'TypeScript'],
      deadline: bountyDeadline.trim() || 'Nov 30, 2026',
    };

    addBounty(bountyInput);
    setBountySubmitting(false);
    setBountySuccess(bountyInput.title);
    setBountyTitle('');
    setBountyDescription('');
    setTimeout(() => setBountySuccess(null), 4000);
  };

  const filteredProducts = products.filter((p) => {
    if (dealStatusFilter !== 'all' && p.hiringStatus !== dealStatusFilter) return false;
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (vouchedOnly && p.vouches.length === 0 && p.status !== 'verified') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.squadMembers.some((m) => m.name.toLowerCase().includes(q));
      if (!matches) return false;
    }
    return true;
  });

  if (!isSignedIn) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-sky-500/10 border border-blue-200 dark:border-sky-500/25 px-3 py-1 text-xs font-semibold text-[#0A66C2] dark:text-sky-400">
              <Store className="w-3.5 h-3.5" />
              Alumni Hiring Sign-In
            </span>
            {onBackToGateway && (
              <button
                type="button"
                onClick={onBackToGateway}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 dark:text-slate-400 hover:text-[#0A66C2]"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Gateway
              </button>
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#191919] dark:text-white">
              Sign in as an ITER Alumnus / Recruiter
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
              Review student GitHub builds, commission paid bounties, and fast-track hire squads.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                Work Email or Name
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="vikram@razorpay.com"
                className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Hiring Persona
                </label>
                <select
                  value={selectedPersona}
                  onChange={(e) => setSelectedPersona(e.target.value as AlumniPersona)}
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                >
                  {PERSONA_OPTIONS.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Bandwidth Shield
                </label>
                <select
                  value={selectedShield}
                  onChange={(e) => setSelectedShield(e.target.value as BandwidthShield)}
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                >
                  {SHIELD_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {authError && (
              <div className="rounded-lg border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white py-2.5 px-4 text-sm font-semibold transition-colors disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              {authLoading ? 'Signing in...' : 'Enter Hiring Portal'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-6 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-6 shadow-2xs space-y-3">
          <h2 className="text-sm font-bold text-[#191919] dark:text-white">
            Quick Alumni Personas
          </h2>
          <div className="space-y-2.5">
            {presetAlumni.map((alum) => (
              <button
                key={alum.id}
                type="button"
                onClick={() => handleDemoLogin(alum)}
                className="w-full text-left rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-900/60 hover:border-[#0A66C2] p-3 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={alum.avatar}
                    alt={alum.name}
                    className="h-10 w-10 rounded-full object-cover border border-stone-200 dark:border-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#191919] dark:text-white truncate">
                      {alum.name}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-slate-400 truncate">
                      {alum.headline} • {alum.company}
                    </div>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-semibold text-[#0A66C2] dark:text-sky-400">
                  Use →
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* LinkedIn-style Hiring Portal Header */}
      <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={activeAlum.avatar}
            alt={activeAlum.name}
            className="h-12 w-12 rounded-full object-cover border border-stone-200 dark:border-slate-700"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#191919] dark:text-white">
                {activeAlum.name} — Hiring Portal
              </h1>
              {activeAlum.bandwidthShield && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="w-3 h-3" />
                  {activeAlum.bandwidthShield}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              {activeAlum.headline} • {activeAlum.company || 'ITER Alumni'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-stone-100 dark:bg-slate-800/90 p-1 border border-stone-200 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setActiveTab('marketplace')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-white dark:bg-slate-950 text-[#0A66C2] dark:text-sky-400 shadow-2xs'
                  : 'text-stone-600 dark:text-slate-400'
              }`}
            >
              Talent Marketplace ({filteredProducts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bounties')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'bounties'
                  ? 'bg-white dark:bg-slate-950 text-[#0A66C2] dark:text-sky-400 shadow-2xs'
                  : 'text-stone-600 dark:text-slate-400'
              }`}
            >
              Bounties &amp; Gigs ({bounties.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('deal_rooms')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'deal_rooms'
                  ? 'bg-white dark:bg-slate-950 text-[#0A66C2] dark:text-sky-400 shadow-2xs'
                  : 'text-stone-600 dark:text-slate-400'
              }`}
            >
              Deal Rooms ({dealRooms.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsSignedIn(false)}
            className="rounded-full border border-stone-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
          >
            Switch Alum
          </button>
        </div>
      </div>

      {/* TAB 1: TALENT MARKETPLACE */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student builds, tech stack, or squad members..."
                className="w-full rounded-full border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-[#191919] dark:text-slate-100 focus:border-[#0A66C2] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={dealStatusFilter}
                onChange={(e) =>
                  setDealStatusFilter(
                    e.target.value as 'all' | CampusProduct['hiringStatus']
                  )
                }
                className="rounded-full border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 px-3 py-1.5 text-xs text-[#191919] dark:text-slate-200 focus:outline-none"
              >
                {DEAL_STATUS_FILTERS.map((s) => (
                  <option key={s} value={s}>
                    {s === 'all' ? 'All Hiring Signals' : s}
                  </option>
                ))}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(
                    e.target.value as 'all' | CampusProduct['category']
                  )
                }
                className="rounded-full border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-slate-900 px-3 py-1.5 text-xs text-[#191919] dark:text-slate-200 focus:outline-none"
              >
                {CATEGORY_FILTERS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setVouchedOnly((v) => !v)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors ${
                  vouchedOnly
                    ? 'bg-[#0A66C2] text-white border-[#0A66C2]'
                    : 'bg-white dark:bg-slate-900 text-stone-600 dark:text-slate-300 border-stone-200 dark:border-slate-700'
                }`}
              >
                Verified Only
              </button>
            </div>
          </div>

          {/* Marketplace Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProducts.map((product) => {
              const lead = product.squadMembers[0];
              return (
                <div
                  key={product.id}
                  className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-4 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={lead?.avatar || activeAlum.avatar}
                          alt={lead?.name || 'Lead'}
                          className="h-10 w-10 rounded-full object-cover border border-stone-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-bold text-[#191919] dark:text-white truncate">
                            {product.title}
                          </h3>
                          <p className="text-[11px] text-stone-500 dark:text-slate-400 truncate">
                            {lead?.name || 'Campus Squad'} • {product.hiringStatus}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => openLiveDemoModal(product)}
                        className="shrink-0 inline-flex items-center gap-1 rounded-full border border-stone-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-semibold text-stone-700 dark:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800"
                      >
                        <Eye className="w-3 h-3" />
                        Inspect
                      </button>
                    </div>

                    <p className="text-xs text-stone-600 dark:text-slate-300 leading-relaxed">
                      {product.tagline}
                    </p>

                    {/* Compact GitHub Repo Bar */}
                    <div className="rounded-lg border border-stone-200 dark:border-slate-700/80 bg-[#F8FAFC] dark:bg-[#0D1422] px-3 py-2 flex items-center justify-between gap-2 text-[11px]">
                      <span className="inline-flex items-center gap-1.5 font-mono text-stone-700 dark:text-slate-200 truncate">
                        <GitBranch className="w-3.5 h-3.5 text-[#0A66C2] dark:text-sky-400 shrink-0" />
                        {product.commitsCount} commits • {product.vouches.length} vouches
                      </span>
                      <a
                        href={product.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-[#0A66C2] dark:text-sky-400 hover:underline shrink-0"
                      >
                        <Code2 className="w-3 h-3" />
                        Repo
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 dark:border-slate-800 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => openRoastModal(product)}
                      className="inline-flex items-center justify-center gap-1 rounded-full border border-stone-200 dark:border-slate-700 hover:bg-stone-100 dark:hover:bg-slate-800 py-1.5 text-xs font-semibold text-stone-700 dark:text-slate-200"
                    >
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      Roast
                    </button>
                    <button
                      type="button"
                      onClick={() => openVouchModal(product)}
                      className="inline-flex items-center justify-center gap-1 rounded-full border border-[#0A66C2] dark:border-sky-500/60 hover:bg-blue-50 dark:hover:bg-sky-500/10 py-1.5 text-xs font-semibold text-[#0A66C2] dark:text-sky-400"
                    >
                      <Award className="w-3.5 h-3.5" />
                      Vouch
                    </button>
                    <button
                      type="button"
                      onClick={() => openDealRoomModal(product, 'fast_track_interview')}
                      className="inline-flex items-center justify-center gap-1 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white py-1.5 text-xs font-semibold"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Hire
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BOUNTIES & GIGS */}
      {activeTab === 'bounties' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleCreateBounty}
            className="lg:col-span-5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-5 shadow-2xs space-y-3.5"
          >
            <h2 className="text-sm font-bold text-[#191919] dark:text-white flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-[#0A66C2] dark:text-sky-400" />
              Commission Paid Sprint Bounty
            </h2>

            {bountySuccess && (
              <div className="rounded-lg border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Published &quot;{bountySuccess}&quot; to student feeds!
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                Bounty Title *
              </label>
              <input
                type="text"
                required
                value={bountyTitle}
                onChange={(e) => setBountyTitle(e.target.value)}
                placeholder="e.g., Build Webhook Retry Queue"
                className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Stipend
                </label>
                <input
                  type="text"
                  value={bountyStipend}
                  onChange={(e) => setBountyStipend(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Target Cohort
                </label>
                <select
                  value={bountyCohort}
                  onChange={(e) =>
                    setBountyCohort(e.target.value as StudentCohort | 'All')
                  }
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                >
                  {COHORT_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={bountyDuration}
                  onChange={(e) => setBountyDuration(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Deadline
                </label>
                <input
                  type="text"
                  value={bountyDeadline}
                  onChange={(e) => setBountyDeadline(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                Required Skills
              </label>
              <input
                type="text"
                value={bountySkills}
                onChange={(e) => setBountySkills(e.target.value)}
                className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                Deliverables
              </label>
              <input
                type="text"
                value={bountyDeliverables}
                onChange={(e) => setBountyDeliverables(e.target.value)}
                className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                Scope &amp; Expectations
              </label>
              <textarea
                rows={2}
                value={bountyDescription}
                onChange={(e) => setBountyDescription(e.target.value)}
                placeholder="Describe acceptance criteria and evaluation rubric..."
                className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={bountySubmitting}
              className="w-full rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white py-2.5 px-4 text-xs font-semibold transition-colors"
            >
              Publish Paid Bounty
            </button>
          </form>

          <div className="lg:col-span-7 space-y-3">
            {bounties.map((bounty) => (
              <div
                key={bounty.id}
                className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-4 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#191919] dark:text-white">
                      {bounty.title}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-slate-400">
                      {bounty.company} • {bounty.duration} • Due {bounty.deadline}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                    {bounty.stipend}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-slate-300">
                  {bounty.description}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-stone-500 dark:text-slate-400">
                  <span>{bounty.appliedSquadsCount} squads applied</span>
                  <span className="font-semibold text-[#0A66C2] dark:text-sky-400">
                    {bounty.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DEAL ROOMS */}
      {activeTab === 'deal_rooms' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dealRooms.map((deal) => (
            <div
              key={deal.id}
              className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-5 shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#0A66C2] dark:text-sky-400" />
                  <h3 className="text-sm font-bold text-[#191919] dark:text-white">
                    {deal.productTitle}
                  </h3>
                </div>
                <span className="rounded-full bg-blue-50 dark:bg-sky-500/10 border border-blue-200 dark:border-sky-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-[#0A66C2] dark:text-sky-400">
                  {deal.status}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-slate-300">{deal.message}</p>
              <div className="pt-2 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-stone-500 dark:text-slate-400">
                <span>
                  {deal.senderName} • {deal.senderCompany}
                </span>
                <span>{deal.proposedCompensation || deal.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
