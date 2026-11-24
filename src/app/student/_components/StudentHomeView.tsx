'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Bookmark,
  Briefcase,
  Coffee,
  Filter,
  Layers,
  Plus,
  Rocket,
  Sparkles,
} from 'lucide-react';
import { BuildCaseStudyCard } from '@/components/shared/BuildCaseStudyCard';
import type {
  CoffeeChatDTO,
  FeedBuildItem,
  JobApplicationDTO,
  SessionUser,
} from '@/types/domain';

interface StudentHomeViewProps {
  student: SessionUser;
  builds: FeedBuildItem[];
  hasMore: boolean;
  loadingMore: boolean;
  applications: JobApplicationDTO[];
  coffeeChats: CoffeeChatDTO[];
  onLoadMore: () => void;
  onInspectBuild: (item: FeedBuildItem) => void;
  onToggleLike: (item: FeedBuildItem) => void;
  onToggleSave: (item: FeedBuildItem) => void;
  onOpenQuickPublish: () => void;
  onNavigateTab: (tab: 'explore' | 'jobs' | 'chat') => void;
}

type FeedFilterTab = 'all' | 'projects' | 'papers' | 'saved' | 'mine';

export function StudentHomeView({
  student,
  builds,
  hasMore,
  loadingMore,
  applications,
  coffeeChats,
  onLoadMore,
  onInspectBuild,
  onToggleLike,
  onToggleSave,
  onOpenQuickPublish,
  onNavigateTab,
}: StudentHomeViewProps) {
  const router = useRouter();
  const [filterTab, setFilterTab] = useState<FeedFilterTab>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');

  const domains = useMemo(() => {
    const set = new Set<string>();
    for (const item of builds) {
      if (item.domain) set.add(item.domain);
    }
    return ['All', ...Array.from(set)];
  }, [builds]);

  const filteredBuilds = useMemo(() => {
    return builds.filter((item) => {
      if (filterTab === 'projects' && item.isPaper) return false;
      if (filterTab === 'papers' && !item.isPaper) return false;
      if (filterTab === 'saved' && !item.savedByMe) return false;
      if (filterTab === 'mine' && !item.isMine) return false;
      if (selectedDomain !== 'All' && item.domain !== selectedDomain) {
        return false;
      }
      return true;
    });
  }, [builds, filterTab, selectedDomain]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Main Feed Column */}
      <div className="lg:col-span-8 space-y-4">
        {/* Filter Bar */}
        <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { id: 'all', label: 'All Builds' },
                  { id: 'projects', label: 'Projects' },
                  { id: 'papers', label: 'Research Papers' },
                  { id: 'mine', label: 'My Builds' },
                  { id: 'saved', label: 'Saved' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterTab(tab.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    filterTab === tab.id
                      ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24]'
                      : 'border border-slate-200 dark:border-white/10 text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#64748B]" />
              <select
                aria-label="Filter by domain"
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-1.5 text-xs font-medium text-[#0F172A] dark:text-white"
              >
                {domains.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Feed Cards */}
        {filteredBuilds.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-white/15 bg-white/70 dark:bg-[#14171E]/60 p-10 text-center space-y-3">
            <Layers className="w-8 h-8 text-[#0891B2] dark:text-[#22D3EE] mx-auto" />
            <div className="text-sm font-bold">
              No builds match this filter yet
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Switch filters or ship a new project/paper to inspire the campus
              feed.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setFilterTab('all');
                  setSelectedDomain('All');
                }}
                className="rounded-full border border-slate-300 dark:border-white/20 px-4 py-1.5 text-xs font-semibold cursor-pointer"
              >
                Reset Filters
              </button>
              <button
                type="button"
                onClick={onOpenQuickPublish}
                className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-4 py-1.5 text-xs font-semibold cursor-pointer"
              >
                Quick Publish
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBuilds.map((item) => (
              <BuildCaseStudyCard
                key={`${item.isPaper ? 'paper' : 'project'}-${item.id}`}
                item={item}
                liked={item.likedByMe}
                saved={item.savedByMe}
                onInspect={onInspectBuild}
                onAuthorClick={(authorId) =>
                  router.push(`/u/${encodeURIComponent(authorId)}`)
                }
                onAlumClick={(alumId) =>
                  router.push(`/u/${encodeURIComponent(alumId)}`)
                }
                onToggleLike={onToggleLike}
                onToggleSave={onToggleSave}
                extraActions={
                  <Link
                    href={`/projects/${encodeURIComponent(item.slug)}`}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 dark:border-white/15 px-2.5 py-1 text-[11px] font-semibold text-[#475569] dark:text-[#94A3B8] hover:border-[#0891B2] hover:text-[#0891B2] dark:hover:text-[#22D3EE]"
                  >
                    Case Study <ArrowUpRight className="w-3 h-3" />
                  </Link>
                }
              />
            ))}
          </div>
        )}

        {/* Load More Cursor Pagination */}
        {hasMore && (
          <div className="flex justify-center pt-2">
            <button
              type="button"
              disabled={loadingMore}
              onClick={onLoadMore}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(100,116,139,0.28)] dark:border-[rgba(226,232,240,0.20)] bg-white/85 dark:bg-white/[0.05] hover:border-[#0891B2] dark:hover:border-[#22D3EE] px-6 py-2.5 text-xs font-semibold transition-all cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
              <span>{loadingMore ? 'Loading more...' : 'Load More Builds'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Sidebar Column */}
      <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
        {/* Student Identity Snapshot */}
        <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 space-y-4">
          <div className="flex items-center gap-3">
            {student.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                className="h-12 w-12 rounded-2xl object-cover border border-[#0891B2]/30"
              />
            ) : (
              <div className="h-12 w-12 rounded-2xl bg-[#0891B2]/15 text-[#0891B2] flex items-center justify-center font-bold">
                {student.fullName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <Link
                href={`/u/${encodeURIComponent(student.id)}`}
                className="font-luma-title text-sm hover:text-[#0891B2] dark:hover:text-[#22D3EE] truncate block"
              >
                {student.fullName}
              </Link>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                {student.academicYear ?? 'ITER'} • {student.branch ?? 'CSE'} •{' '}
                {student.regNo ?? ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-2.5 border border-slate-200/70 dark:border-white/10">
              <div className="text-sm font-bold">
                {builds.filter((b) => b.isMine).length}
              </div>
              <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                My Builds
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-2.5 border border-slate-200/70 dark:border-white/10">
              <div className="text-sm font-bold">{applications.length}</div>
              <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                Applied
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 dark:bg-white/[0.04] p-2.5 border border-slate-200/70 dark:border-white/10">
              <div className="text-sm font-bold">{coffeeChats.length}</div>
              <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                Coffee Chats
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/share-project"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0F172A] hover:bg-[#1E293B] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] py-2 px-4 text-xs font-semibold transition-all"
            >
              <Rocket className="w-3.5 h-3.5" />
              Ship Full Project / Paper
            </Link>
            <button
              type="button"
              onClick={onOpenQuickPublish}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 dark:border-white/20 hover:border-[#0891B2] dark:hover:border-[#22D3EE] py-2 px-4 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Quick Publish Build
            </button>
          </div>
        </div>

        {/* Active Applications & Coffee Chats */}
        <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
              Career &amp; Mentorship Pulse
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTab('jobs')}
              className="text-[11px] font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline cursor-pointer"
            >
              View Deals →
            </button>
          </div>

          {applications.slice(0, 3).map((app) => (
            <div
              key={app.id}
              className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-3 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">{app.jobTitle}</div>
                <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                  {app.company}
                </div>
              </div>
              <span className="rounded-full bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#0891B2] dark:text-[#22D3EE] shrink-0">
                {app.status.replace('_', ' ')}
              </span>
            </div>
          ))}

          {coffeeChats.slice(0, 2).map((chat) => (
            <div
              key={chat.id}
              className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-3 flex items-center justify-between gap-2"
            >
              <div className="min-w-0">
                <div className="text-xs font-bold truncate flex items-center gap-1">
                  <Coffee className="w-3 h-3 text-amber-500 shrink-0" />
                  {chat.alumniName}
                </div>
                <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                  {chat.topic}
                </div>
              </div>
              <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300 shrink-0">
                {chat.status}
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between pt-1 border-t border-slate-200/70 dark:border-white/10 text-[11px]">
            <button
              type="button"
              onClick={() => onNavigateTab('explore')}
              className="font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline cursor-pointer"
            >
              Book Alumni Coffee Chat
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('saved')}
              className="inline-flex items-center gap-1 font-semibold text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white cursor-pointer"
            >
              <Bookmark className="w-3 h-3" />
              Saved ({builds.filter((b) => b.savedByMe).length})
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
