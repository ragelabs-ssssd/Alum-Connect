'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusProduct, StudentCohort, UserProfile } from '../../types';
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
  Rocket,
  Sparkles,
  UserCheck,
  Wrench,
} from 'lucide-react';

interface StudentPortalProps {
  onBackToGateway?: () => void;
}

const COHORT_OPTIONS: { value: StudentCohort; label: string }[] = [
  { value: '1st_year', label: '1st Year (Batch 2028) • Campus Ops & Beta Scout' },
  { value: '2nd_year', label: '2nd Year (Batch 2027) • Core Squad Builder' },
  { value: '3rd_year', label: '3rd Year (Batch 2026) • 10-Day Bounty Sprinter' },
  { value: '4th_year', label: '4th Year (Batch 2025) • Lead / Off-Campus' },
];

const CATEGORY_OPTIONS: { value: CampusProduct['category']; label: string }[] = [
  { value: 'web_app', label: 'Web App' },
  { value: 'mobile_app', label: 'Mobile App' },
  { value: 'ai_ml', label: 'AI / ML' },
  { value: 'dev_tool', label: 'Dev Tool' },
  { value: 'iot', label: 'IoT / Hardware' },
];

const HIRING_STATUS_OPTIONS: CampusProduct['hiringStatus'][] = [
  'Open for Internships',
  'Looking for 1st Yr Scouts',
  'Open for Acqui-hire',
  'Funded & Scaling',
];

const ROLE_CHIPS = [
  'Frontend (Next.js/React)',
  'Backend (FastAPI/Go)',
  'AI/ML Engineer',
  'UI/UX Designer',
  '1st Yr Beta Scout',
  'DevOps & Cloud',
];

export default function StudentPortal({ onBackToGateway }: StudentPortalProps) {
  const {
    currentUser,
    setCurrentUser,
    allPresetUsers,
    products,
    bounties,
    addNewProductShip,
    toggleRoastResolved,
    applyToBounty,
    openLiveDemoModal,
    openVouchCardViewModal,
  } = useApp();

  const presetStudents = useMemo(
    () => allPresetUsers.filter((u) => u.role === 'student'),
    [allPresetUsers]
  );

  // If current user is already a student, start directly inside Builder Studio
  const [isSignedIn, setIsSignedIn] = useState(currentUser.role === 'student');
  const [emailInput, setEmailInput] = useState('');
  const [cohortInput, setCohortInput] = useState<StudentCohort>('2nd_year');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'studio' | 'builds' | 'bounties'>('studio');

  // Builder Studio Form State
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [category, setCategory] = useState<CampusProduct['category']>('web_app');
  const [hiringStatus, setHiringStatus] =
    useState<CampusProduct['hiringStatus']>('Open for Internships');
  const [techStackInput, setTechStackInput] = useState(
    'Next.js, TypeScript, Tailwind CSS, FastAPI'
  );
  const [rolesNeeded, setRolesNeeded] = useState<string[]>([
    'Backend (FastAPI/Go)',
    '1st Yr Beta Scout',
  ]);
  const [githubUrl, setGithubUrl] = useState('https://github.com/iter-builders/');
  const [liveDemoUrl, setLiveDemoUrl] = useState('https://iter-build.vercel.app');
  const [shipStatusMessage, setShipStatusMessage] = useState('');
  const [appliedBountyIds, setAppliedBountyIds] = useState<Record<string, boolean>>({});

  const activeStudent =
    currentUser.role === 'student' ? currentUser : presetStudents[0] || currentUser;

  const studentBuilds = useMemo(() => {
    const firstName = activeStudent.name.split(' ')[0]?.toLowerCase() ?? '';
    const matched = products.filter(
      (p) =>
        p.squadMembers.some(
          (m) =>
            m.name.toLowerCase() === activeStudent.name.toLowerCase() ||
            (firstName && m.name.toLowerCase().includes(firstName))
        ) ||
        p.recentCommits.some((c) =>
          c.author.toLowerCase().includes(activeStudent.name.toLowerCase())
        )
    );
    return matched.length > 0 ? matched : products;
  }, [products, activeStudent.name]);

  const handleLoginSubmit = async (
    identifier: string,
    cohort: StudentCohort,
    fallbackUser?: UserProfile
  ) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const response = await fetch('/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', identifier, cohort }),
      });
      const data = await response.json();
      if (!response.ok || !data.user) {
        throw new Error(data.message || 'Unable to authenticate student account');
      }
      setCurrentUser(data.user);
      setIsSignedIn(true);
    } catch (err) {
      if (fallbackUser) {
        setCurrentUser(fallbackUser);
        setIsSignedIn(true);
      } else {
        setAuthError(err instanceof Error ? err.message : 'Sign-in failed');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const toggleRoleChip = (role: string) => {
    setRolesNeeded((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleShipProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !tagline.trim()) {
      setShipStatusMessage('Please enter both a project title and tagline.');
      return;
    }

    const parsedTags = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addNewProductShip({
      title: title.trim(),
      tagline: tagline.trim(),
      description: problemStatement.trim() || tagline.trim(),
      problemStatement: problemStatement.trim(),
      category,
      hiringStatus,
      tags: parsedTags.length > 0 ? parsedTags : ['Next.js', 'TypeScript'],
      rolesNeeded,
      githubUrl: githubUrl.trim() || 'https://github.com/iter-builders',
      liveDemoUrl: liveDemoUrl.trim() || 'https://demo.soa.ac.in',
    });

    setTitle('');
    setTagline('');
    setProblemStatement('');
    setShipStatusMessage('Published to Social Feed! Switched to My Squad Builds.');
    setActiveTab('builds');
  };

  const handleApplyBounty = (bountyId: string) => {
    if (appliedBountyIds[bountyId]) return;
    const ok = applyToBounty(bountyId);
    if (ok) {
      setAppliedBountyIds((prev) => ({ ...prev, [bountyId]: true }));
    }
  };

  if (!isSignedIn) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-sky-500/10 border border-blue-200 dark:border-sky-500/25 px-3 py-1 text-xs font-semibold text-[#0A66C2] dark:text-sky-400">
              <Wrench className="w-3.5 h-3.5" />
              Builder Studio Sign-In
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
              Sign in as an ITER Builder
            </h1>
            <p className="text-xs text-stone-500 dark:text-slate-400 mt-1">
              Use your <span className="font-mono">@soa.ac.in</span> email to publish GitHub showcases and apply to alumni bounties.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLoginSubmit(emailInput, cohortInput);
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                University Email
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="sneha.2341019042@soa.ac.in"
                className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                Cohort
              </label>
              <select
                value={cohortInput}
                onChange={(e) => setCohortInput(e.target.value as StudentCohort)}
                className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
              >
                {COHORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
              {authLoading ? 'Signing in...' : 'Enter Builder Studio'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-6 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-6 shadow-2xs space-y-3">
          <h2 className="text-sm font-bold text-[#191919] dark:text-white">
            Quick Demo Personas
          </h2>
          <div className="space-y-2.5">
            {presetStudents.map((student) => (
              <button
                key={student.id}
                type="button"
                onClick={() =>
                  handleLoginSubmit(
                    student.email,
                    student.cohort || '2nd_year',
                    student
                  )
                }
                className="w-full text-left rounded-xl border border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-900/60 hover:border-[#0A66C2] p-3 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="h-10 w-10 rounded-full object-cover border border-stone-200 dark:border-slate-700"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#191919] dark:text-white truncate">
                      {student.name}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-slate-400 truncate">
                      {student.headline}
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

  const previewTags = techStackInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* LinkedIn-style Builder Studio Header Card */}
      <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-4 sm:p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <img
            src={activeStudent.avatar}
            alt={activeStudent.name}
            className="h-12 w-12 rounded-full object-cover border border-stone-200 dark:border-slate-700"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-[#191919] dark:text-white">
                {activeStudent.name} — Builder Studio
              </h1>
              <span className="rounded-full bg-blue-50 dark:bg-sky-500/10 border border-blue-200 dark:border-sky-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-[#0A66C2] dark:text-sky-400">
                {activeStudent.studentYearLabel || 'ITER Builder'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-slate-400">
              {activeStudent.headline} • Publish project updates with GitHub repo showcases
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-full bg-stone-100 dark:bg-slate-800/90 p-1 border border-stone-200 dark:border-slate-700/80">
            <button
              type="button"
              onClick={() => setActiveTab('studio')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'studio'
                  ? 'bg-white dark:bg-slate-950 text-[#0A66C2] dark:text-sky-400 shadow-2xs'
                  : 'text-stone-600 dark:text-slate-400'
              }`}
            >
              Publish Project
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('builds')}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'builds'
                  ? 'bg-white dark:bg-slate-950 text-[#0A66C2] dark:text-sky-400 shadow-2xs'
                  : 'text-stone-600 dark:text-slate-400'
              }`}
            >
              My Squad Builds ({studentBuilds.length})
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
              Open Bounties ({bounties.length})
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsSignedIn(false)}
            className="rounded-full border border-stone-200 dark:border-slate-700 px-3 py-1.5 text-xs font-semibold text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
          >
            Switch Student
          </button>
        </div>
      </div>

      {shipStatusMessage && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-3 text-xs font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{shipStatusMessage}</span>
        </div>
      )}

      {/* TAB 1: PUBLISH PROJECT + LIVE LINKEDIN+GITHUB PREVIEW */}
      {activeTab === 'studio' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleShipProduct}
            className="lg:col-span-7 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-5 sm:p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#191919] dark:text-white flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-[#0A66C2] dark:text-sky-400" />
                  Create Project Post
                </h2>
                <p className="text-xs text-stone-500 dark:text-slate-400">
                  Posts immediately to Student Feed and Alumni Hiring Feed.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., CampusPulse AI"
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  One-Line Tagline *
                </label>
                <input
                  type="text"
                  required
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Real-time placement readiness tracker"
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                What did you build &amp; what problem does it solve?
              </label>
              <textarea
                rows={3}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="Share your architecture, latency improvements, or user traction..."
                className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value as CampusProduct['category'])
                  }
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Hiring / Opportunity Signal
                </label>
                <select
                  value={hiringStatus}
                  onChange={(e) =>
                    setHiringStatus(e.target.value as CampusProduct['hiringStatus'])
                  }
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                >
                  {HIRING_STATUS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                Tech Stack (comma-separated)
              </label>
              <input
                type="text"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1.5">
                Roles Open in Squad
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ROLE_CHIPS.map((role) => {
                  const selected = rolesNeeded.includes(role);
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => toggleRoleChip(role)}
                      className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                        selected
                          ? 'bg-[#0A66C2] text-white border-[#0A66C2]'
                          : 'bg-stone-50 dark:bg-slate-900 text-stone-600 dark:text-slate-300 border-stone-200 dark:border-slate-700'
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-slate-300 mb-1">
                  Live Demo URL
                </label>
                <input
                  type="url"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full rounded-lg border border-stone-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono text-[#191919] dark:text-white focus:border-[#0A66C2] focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-2.5 text-sm font-semibold transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Publish to Feed
              </button>
            </div>
          </form>

          {/* Live LinkedIn + GitHub Card Preview */}
          <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-20">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
              Live Feed Post Preview
            </div>

            <div className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-4 shadow-2xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={activeStudent.avatar}
                  alt={activeStudent.name}
                  className="h-10 w-10 rounded-full object-cover border border-stone-200 dark:border-slate-700"
                />
                <div>
                  <div className="text-sm font-semibold text-[#191919] dark:text-white">
                    {activeStudent.name}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-slate-400">
                    {hiringStatus} • Just now
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-sm font-bold text-[#191919] dark:text-white">
                  {title.trim() || 'Your Project Title'} —{' '}
                  <span className="font-normal text-stone-600 dark:text-slate-300">
                    {tagline.trim() || 'One-line value proposition'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed">
                  {problemStatement.trim() ||
                    'Your engineering story and problem statement will appear here for alumni and peers.'}
                </p>
              </div>

              {/* Embedded GitHub Card Preview */}
              <div className="rounded-xl border border-stone-200 dark:border-slate-700/80 bg-[#F8FAFC] dark:bg-[#0D1422] p-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-6 w-6 rounded bg-stone-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0">
                      <GitBranch className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#191919] dark:text-slate-100 truncate">
                      {githubUrl.replace('https://github.com/', '') || 'iter-builders/project'}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#0A66C2] dark:text-sky-400">
                    GitHub Showcase
                  </span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {previewTags.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-white dark:bg-slate-800 border border-stone-200 dark:border-slate-700 px-2 py-0.5 text-[10px] text-stone-600 dark:text-slate-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY SQUAD BUILDS + ALUMNI ROAST RESOLUTION */}
      {activeTab === 'builds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {studentBuilds.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-5 shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-[#191919] dark:text-white">
                    {product.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5">
                    {product.tagline}
                  </p>
                </div>
                <span className="rounded-full bg-blue-50 dark:bg-sky-500/10 border border-blue-200 dark:border-sky-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-[#0A66C2] dark:text-sky-400 shrink-0">
                  {product.hiringStatus}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <a
                  href={product.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full border border-stone-300 dark:border-slate-700 px-3 py-1 font-semibold text-stone-700 dark:text-slate-200 hover:bg-stone-50 dark:hover:bg-slate-800"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  Repo
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => openLiveDemoModal(product)}
                  className="inline-flex items-center gap-1 rounded-full bg-[#0A66C2] hover:bg-[#004182] text-white px-3 py-1 font-semibold"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Live Demo
                </button>
                {product.vouches[0] && (
                  <button
                    type="button"
                    onClick={() => openVouchCardViewModal(product.vouches[0], product)}
                    className="inline-flex items-center gap-1 rounded-full border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-3 py-1 font-semibold"
                  >
                    <Award className="w-3.5 h-3.5" />
                    {product.vouches.length} Vouch
                  </button>
                )}
              </div>

              {/* Alumni Roasts */}
              <div className="pt-3 border-t border-stone-100 dark:border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-stone-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Alumni Architecture Roasts ({product.roasts.length})
                </div>
                {product.roasts.length === 0 ? (
                  <p className="text-xs text-stone-400 dark:text-slate-500">
                    No alumni roasts yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {product.roasts.map((roast) => (
                      <div
                        key={roast.id}
                        className="rounded-lg border border-stone-200 dark:border-slate-800 bg-stone-50/70 dark:bg-slate-900/60 p-3 flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="text-xs font-semibold text-[#191919] dark:text-white">
                            {roast.alumName} • {roast.alumCompany}
                          </div>
                          <p className="text-xs text-stone-600 dark:text-slate-300">
                            {roast.feedback}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleRoastResolved(product.id, roast.id)}
                          className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                            roast.resolved
                              ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                              : 'border border-stone-300 dark:border-slate-700 text-stone-700 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          <UserCheck className="w-3 h-3" />
                          {roast.resolved ? 'Resolved' : 'Mark Resolved'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: OPEN ALUMNI BOUNTIES */}
      {activeTab === 'bounties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bounties.map((bounty) => {
            const isApplied = !!appliedBountyIds[bounty.id];
            return (
              <div
                key={bounty.id}
                className="rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-[#131A26] p-5 shadow-2xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A66C2] dark:text-sky-400">
                      <Briefcase className="w-3.5 h-3.5" />
                      {bounty.company}
                    </span>
                    <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                      {bounty.stipend}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#191919] dark:text-white">
                    {bounty.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-slate-400 leading-relaxed">
                    {bounty.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 dark:text-slate-500">
                    {bounty.appliedSquadsCount} squads applied
                  </span>
                  <button
                    type="button"
                    disabled={isApplied}
                    onClick={() => handleApplyBounty(bounty.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                      isApplied
                        ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        : 'bg-[#0A66C2] hover:bg-[#004182] text-white'
                    }`}
                  >
                    {isApplied ? 'Applied' : 'Apply Squad'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
