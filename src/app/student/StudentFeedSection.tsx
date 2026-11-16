'use client';

import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CampusProduct } from '../../types';
import {
  Award,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  ExternalLink,
  Eye,
  GitBranch,
  GitCommit,
  Globe,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  ThumbsUp,
  Users,
} from 'lucide-react';

interface StudentFeedSectionProps {
  onOpenBuilderStudio?: () => void;
}

const TECH_FILTERS = ['All', 'Next.js', 'TypeScript', 'Python', 'FastAPI', 'AI/ML', 'IoT'];

export default function StudentFeedSection({
  onOpenBuilderStudio,
}: StudentFeedSectionProps) {
  const {
    currentUser,
    allPresetUsers,
    products,
    bounties,
    openLiveDemoModal,
    openVouchCardViewModal,
    applyToBounty,
    endorseUserSkill,
  } = useApp();

  const [scope, setScope] = useState<'for_you' | 'for_all'>('for_all');
  const [search, setSearch] = useState('');
  const [techFilter, setTechFilter] = useState<string>('All');
  const [expandedTasksId, setExpandedTasksId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [appliedBounties, setAppliedBounties] = useState<Record<string, boolean>>({});

  const studentPeers = useMemo(
    () => allPresetUsers.filter((u) => u.role === 'student'),
    [allPresetUsers]
  );

  const myProducts = useMemo(() => {
    const firstName = currentUser.name.split(' ')[0]?.toLowerCase() ?? '';
    return products.filter((p) =>
      p.squadMembers.some(
        (m) =>
          m.name.toLowerCase() === currentUser.name.toLowerCase() ||
          (firstName && m.name.toLowerCase().includes(firstName))
      )
    );
  }, [products, currentUser.name]);

  const visibleProducts = useMemo(() => {
    const base = scope === 'for_you' ? myProducts : products;
    const q = search.trim().toLowerCase();

    return base.filter((p) => {
      const matchesTech =
        techFilter === 'All' ||
        p.tags.some((t) => t.toLowerCase().includes(techFilter.toLowerCase())) ||
        p.category.toLowerCase().includes(techFilter.toLowerCase());

      if (!matchesTech) return false;
      if (!q) return true;

      return (
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.squadMembers.some((m) => m.name.toLowerCase().includes(q))
      );
    });
  }, [scope, myProducts, products, search, techFilter]);

  const totalVouches = useMemo(
    () => myProducts.reduce((acc, p) => acc + p.vouches.length, 0),
    [myProducts]
  );

  const toggleLike = (id: string) => {
    setLikedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApplyBounty = (bountyId: string) => {
    const ok = applyToBounty(bountyId);
    if (ok) {
      setAppliedBounties((prev) => ({ ...prev, [bountyId]: true }));
    }
  };

  const renderRepoSlug = (githubUrl: string, title: string) => {
    try {
      const url = new URL(githubUrl);
      const clean = url.pathname.replace(/^\/|\/$/g, '');
      return clean || `iter-labs/${title.toLowerCase().replace(/\s+/g, '-')}`;
    } catch {
      return `iter-labs/${title.toLowerCase().replace(/\s+/g, '-')}`;
    }
  };

  const renderFeedCard = (product: CampusProduct) => {
    const lead = product.squadMembers[0];
    const latestCommit = product.recentCommits[0];
    const tasks = product.tasks ?? [];
    const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
    const progressPct = tasks.length
      ? Math.round((completedTasks / tasks.length) * 100)
      : product.status === 'verified'
      ? 100
      : 68;
    const isExpanded = expandedTasksId === product.id;
    const isLiked = !!likedIds[product.id];
    const repoSlug = renderRepoSlug(product.githubUrl, product.title);

    return (
      <article
        key={product.id}
        className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] shadow-2xs transition-colors overflow-hidden"
      >
        {/* LinkedIn Author Header */}
        <div className="p-4 pb-3 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <img
              src={lead?.avatar || currentUser.avatar}
              alt={lead?.name || 'Student Builder'}
              className="h-11 w-11 rounded-full object-cover border border-[#E4E4E7] dark:border-slate-700"
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-sm font-semibold text-[#09090B] dark:text-white">
                  {lead?.name || 'Campus Squad'}
                </span>
                {product.status === 'verified' && (
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-[#2563EB] dark:text-sky-400 shrink-0"
                    aria-label="Verified Build"
                  />
                )}
                {product.squadMembers.length > 1 && (
                  <span className="text-xs text-[#52525B] dark:text-slate-400">
                    + {product.squadMembers.length - 1} squadmates
                  </span>
                )}
              </div>
              <p className="text-xs text-[#52525B] dark:text-slate-400 truncate">
                {lead?.role || 'Full-Stack Builder'} • {lead?.year || 'ITER'} ({lead?.branch || 'CSE'})
              </p>
              <p className="text-[11px] text-stone-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                <span>{product.publishedAt}</span>
                <span>•</span>
                <Globe className="w-3 h-3" />
                <span>{product.hiringStatus}</span>
              </p>
            </div>
          </div>

          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
              product.status === 'verified'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/25'
                : 'bg-blue-50 dark:bg-sky-500/10 text-[#2563EB] dark:text-sky-300 border-blue-200 dark:border-sky-500/25'
            }`}
          >
            {product.status === 'verified' ? 'Alumni Verified' : 'Actively Shipping'}
          </span>
        </div>

        {/* LinkedIn Narrative Commentary */}
        <div className="px-4 pb-3 space-y-2">
          <h3 className="text-base font-bold text-[#09090B] dark:text-white leading-snug">
            {product.title} —{' '}
            <span className="font-normal text-[#52525B] dark:text-slate-300">
              {product.tagline}
            </span>
          </h3>
          <p className="text-[13.5px] text-stone-700 dark:text-slate-300 leading-relaxed">
            {product.problemStatement || product.description}
          </p>

          {/* Skill Hashtags */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.tags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setTechFilter(tag)}
                className="text-xs font-medium text-[#2563EB] dark:text-sky-400 hover:underline"
              >
                #{tag.replace(/\s+/g, '')}
              </button>
            ))}
          </div>
        </div>

        {/* Embedded GitHub Repository Showcase Card (LinkedIn rich media style) */}
        <div className="mx-4 mb-3 rounded-xl border border-[#E4E4E7] dark:border-slate-700/80 bg-[#F8FAFC] dark:bg-[#0D1422] p-3.5 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-md bg-stone-900 dark:bg-slate-800 text-white flex items-center justify-center shrink-0">
                <GitBranch className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-mono font-semibold text-[#09090B] dark:text-slate-100 truncate">
                  {repoSlug}
                </div>
                <div className="text-[11px] text-[#52525B] dark:text-slate-400">
                  {product.commitsCount} commits • {product.tractionLabel}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={product.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-[#F4F4F5] dark:hover:bg-slate-800 px-2.5 py-1 text-[11px] font-semibold text-stone-700 dark:text-slate-200 transition-colors"
              >
                <Code2 className="w-3 h-3" />
                Repo
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <button
                type="button"
                onClick={() => openLiveDemoModal(product)}
                className="inline-flex items-center gap-1 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 px-2.5 py-1 text-[11px] font-semibold transition-colors"
              >
                <Eye className="w-3 h-3" />
                Live Demo
              </button>
            </div>
          </div>

          {latestCommit && (
            <div className="flex items-center justify-between gap-2 rounded-lg bg-white dark:bg-slate-900/70 border border-[#E4E4E7]/80 dark:border-slate-800 px-2.5 py-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 min-w-0 text-stone-700 dark:text-slate-300">
                <GitCommit className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="font-mono text-stone-400 dark:text-slate-500">
                  {latestCommit.hash.slice(0, 7)}
                </span>
                <span className="truncate">{latestCommit.message}</span>
              </div>
              <span className="text-stone-400 dark:text-slate-500 shrink-0">
                {latestCommit.timeAgo}
              </span>
            </div>
          )}

          {/* Compact Sprint Progress */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-[#52525B] dark:text-slate-400">
              <span>Sprint Delivery</span>
              <span className="font-semibold text-[#09090B] dark:text-slate-200">
                {progressPct}% ({completedTasks}/{tasks.length || 1} milestones)
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-stone-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#2563EB] dark:bg-sky-400 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Expandable Sprint Tasks */}
        {isExpanded && tasks.length > 0 && (
          <div className="mx-4 mb-3 rounded-lg border border-[#E4E4E7] dark:border-slate-800 bg-[#F4F4F5]/70 dark:bg-slate-900/50 p-3 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#52525B] dark:text-slate-400">
              Active Sprint Tasks
            </div>
            <div className="space-y-1.5">
              {tasks.map((task, idx) => (
                <div
                  key={`${product.id}-task-${idx}`}
                  className="flex items-center justify-between gap-2 text-xs py-1 border-b last:border-b-0 border-[#E4E4E7]/60 dark:border-slate-800"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-[#09090B] dark:text-slate-200">
                      {task.name}
                    </span>
                    <span className="text-[#52525B] dark:text-slate-400 ml-2 text-[11px]">
                      • {task.assignee}
                    </span>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      task.status === 'Completed'
                        ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                        : task.status === 'In Progress'
                        ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300'
                        : 'bg-stone-200 dark:bg-slate-800 text-[#52525B] dark:text-slate-400'
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LinkedIn Social Proof Summary */}
        <div className="px-4 py-2 flex items-center justify-between text-[11px] text-[#52525B] dark:text-slate-400 border-t border-stone-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <span>{product.vouches.length} Verified Vouches</span>
            <span>•</span>
            <span>{product.roasts.length} Alumni Reviews</span>
          </div>
          <span>{product.viewsCount} profile impressions</span>
        </div>

        {/* LinkedIn Action Bar */}
        <div className="px-2 py-1.5 border-t border-stone-100 dark:border-slate-800/80 grid grid-cols-4 gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => toggleLike(product.id)}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-colors ${
              isLiked
                ? 'text-[#2563EB] dark:text-sky-400 bg-blue-50/70 dark:bg-sky-500/10'
                : 'text-[#52525B] dark:text-slate-400 hover:bg-[#F4F4F5] dark:hover:bg-slate-800/70'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span className="hidden sm:inline">{isLiked ? 'Appreciated' : 'Appreciate'}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              setExpandedTasksId((prev) => (prev === product.id ? null : product.id))
            }
            className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-[#52525B] dark:text-slate-400 hover:bg-[#F4F4F5] dark:hover:bg-slate-800/70 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">Tasks ({tasks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => openLiveDemoModal(product)}
            className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-[#52525B] dark:text-slate-400 hover:bg-[#F4F4F5] dark:hover:bg-slate-800/70 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Roasts ({product.roasts.length})</span>
          </button>

          {product.vouches[0] ? (
            <button
              type="button"
              onClick={() => openVouchCardViewModal(product.vouches[0], product)}
              className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-[#2563EB] dark:text-sky-400 hover:bg-blue-50/70 dark:hover:bg-sky-500/10 transition-colors"
            >
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Vouch Card</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => openLiveDemoModal(product)}
              className="flex items-center justify-center gap-1.5 rounded-lg py-2 text-[#52525B] dark:text-slate-400 hover:bg-[#F4F4F5] dark:hover:bg-slate-800/70 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Inspect</span>
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT RAIL: LinkedIn Profile Card */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
          <div className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] overflow-hidden shadow-2xs">
            {/* Subtle LinkedIn Profile Banner */}
            <div className="h-16 bg-gradient-to-r from-[#2563EB] via-blue-600 to-indigo-600" />
            <div className="px-4 pb-4 -mt-8">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-16 w-16 rounded-full object-cover border-2 border-white dark:border-[#18181B] shadow-xs"
              />
              <div className="mt-2.5">
                <h2 className="text-base font-bold text-[#09090B] dark:text-white">
                  {currentUser.name}
                </h2>
                <p className="text-xs text-[#52525B] dark:text-slate-400 mt-0.5 leading-snug">
                  {currentUser.headline}
                </p>
                <p className="text-[11px] text-stone-400 dark:text-slate-500 mt-1">
                  {currentUser.squadName || 'ITER Campus Builder'} • {currentUser.branch || 'CSE'}
                </p>
              </div>

              {/* Profile Metrics */}
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#52525B] dark:text-slate-400">Shipped Projects</span>
                  <span className="font-bold text-[#2563EB] dark:text-sky-400">
                    {myProducts.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#52525B] dark:text-slate-400">Alumni Vouches</span>
                  <span className="font-bold text-[#2563EB] dark:text-sky-400">
                    {totalVouches}
                  </span>
                </div>
              </div>

              {/* Endorsed Skills */}
              {currentUser.techStack && currentUser.techStack.length > 0 && (
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-slate-800">
                  <div className="text-[11px] font-semibold text-[#52525B] dark:text-slate-400 mb-2">
                    Top Verified Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentUser.techStack.slice(0, 6).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-[#F4F4F5] dark:bg-slate-800 border border-[#E4E4E7] dark:border-slate-700 px-2.5 py-0.5 text-[11px] font-medium text-stone-700 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={onOpenBuilderStudio}
                className="mt-4 w-full inline-flex items-center justify-center gap-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 py-2 px-4 text-xs font-semibold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Share a Project Update
              </button>
            </div>
          </div>
        </aside>

        {/* CENTER STREAM: LinkedIn Feed + GitHub Showcases */}
        <section className="lg:col-span-6 space-y-4">
          {/* Start a Post Composer */}
          <div className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] p-4 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-10 w-10 rounded-full object-cover border border-[#E4E4E7] dark:border-slate-700"
              />
              <button
                type="button"
                onClick={onOpenBuilderStudio}
                className="flex-1 text-left rounded-full border border-[#E4E4E7] dark:border-slate-700 bg-[#F4F4F5] dark:bg-slate-900/70 hover:bg-[#F4F4F5] dark:hover:bg-slate-800 px-4 py-2.5 text-xs sm:text-sm text-[#52525B] dark:text-slate-400 transition-colors"
              >
                Shipped a new feature or GitHub repo? Share it with alumni...
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100 dark:border-slate-800">
              {/* For You / For All Switcher */}
              <div className="flex items-center gap-1 rounded-full bg-[#F4F4F5] dark:bg-slate-800/80 p-0.5">
                <button
                  type="button"
                  onClick={() => setScope('for_you')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    scope === 'for_you'
                      ? 'bg-white dark:bg-slate-950 text-[#2563EB] dark:text-sky-400 shadow-2xs'
                      : 'text-[#52525B] dark:text-slate-400'
                  }`}
                >
                  For You ({myProducts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setScope('for_all')}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                    scope === 'for_all'
                      ? 'bg-white dark:bg-slate-950 text-[#2563EB] dark:text-sky-400 shadow-2xs'
                      : 'text-[#52525B] dark:text-slate-400'
                  }`}
                >
                  For All ({products.length})
                </button>
              </div>

              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search builds, skills, peers..."
                  className="w-full rounded-full border border-[#E4E4E7] dark:border-slate-700 bg-[#F4F4F5] dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-[#09090B] dark:text-slate-100 placeholder:text-stone-400 focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Tech Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {TECH_FILTERS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTechFilter(tag)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                    techFilter === tag
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-white dark:bg-slate-900 text-[#52525B] dark:text-slate-300 border-[#E4E4E7] dark:border-slate-700 hover:border-[#E4E4E7]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Feed Cards */}
          {visibleProducts.length === 0 ? (
            <div className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] p-8 text-center space-y-2">
              <Sparkles className="w-6 h-6 text-[#2563EB] mx-auto" />
              <p className="text-sm font-semibold text-[#09090B] dark:text-white">
                No matching builds found
              </p>
              <p className="text-xs text-[#52525B] dark:text-slate-400">
                Try switching to &quot;For All&quot; or clearing your search filter.
              </p>
            </div>
          ) : (
            <div className="space-y-4">{visibleProducts.map(renderFeedCard)}</div>
          )}
        </section>

        {/* RIGHT RAIL: Campus Builders & Open Alumni Bounties */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
          {/* Builders to Follow */}
          <div className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#2563EB] dark:text-sky-400" />
                Campus Builders
              </h3>
            </div>
            <div className="space-y-3">
              {studentPeers.slice(0, 4).map((peer) => (
                <div key={peer.id} className="flex items-start justify-between gap-2.5">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <img
                      src={peer.avatar}
                      alt={peer.name}
                      className="h-9 w-9 rounded-full object-cover border border-[#E4E4E7] dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-[#09090B] dark:text-white truncate">
                        {peer.name}
                      </div>
                      <div className="text-[11px] text-[#52525B] dark:text-slate-400 truncate">
                        {peer.headline}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      endorseUserSkill(peer.id, peer.techStack?.[0] || 'Engineering')
                    }
                    className="shrink-0 rounded-full border border-[#2563EB] dark:border-sky-500/60 text-[#2563EB] dark:text-sky-400 hover:bg-blue-50 dark:hover:bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-semibold transition-colors"
                  >
                    Endorse
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Open Alumni Bounties */}
          <div className="rounded-xl border border-[#E4E4E7] dark:border-slate-800 bg-white dark:bg-[#18181B] p-4 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Open Alumni Bounties
            </h3>
            <div className="space-y-3">
              {bounties.slice(0, 3).map((bounty) => {
                const isApplied = !!appliedBounties[bounty.id];
                return (
                  <div
                    key={bounty.id}
                    className="rounded-lg border border-[#E4E4E7] dark:border-slate-800 bg-[#F4F4F5]/70 dark:bg-slate-900/60 p-3 space-y-1.5"
                  >
                    <div className="text-xs font-semibold text-[#09090B] dark:text-white">
                      {bounty.title}
                    </div>
                    <div className="text-[11px] text-[#52525B] dark:text-slate-400">
                      {bounty.company} • {bounty.stipend}
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] font-medium text-stone-400 dark:text-slate-500">
                        Due {bounty.deadline}
                      </span>
                      <button
                        type="button"
                        disabled={isApplied}
                        onClick={() => handleApplyBounty(bounty.id)}
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold transition-colors ${
                          isApplied
                            ? 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                            : 'bg-[#18181B] hover:bg-[#27272A] text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950'
                        }`}
                      >
                        {isApplied ? 'Applied' : 'Apply'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
