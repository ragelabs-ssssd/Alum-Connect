'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Layers, Search, Sparkles, Users } from 'lucide-react';
import { BuildCaseStudyCard } from '@/components/shared/BuildCaseStudyCard';
import { AlumniVerificationBadge } from '@/components/shared/VerificationBadge';
import type { NetworkDirectoryEntry } from '@/modules/identity/queries';
import type { FeedBuildItem } from '@/types/domain';

interface DeanFeedsViewProps {
  builds: FeedBuildItem[];
  hasMore: boolean;
  loadingMore: boolean;
  directory: NetworkDirectoryEntry[];
  onLoadMore: () => void;
  onInspectBuild: (item: FeedBuildItem) => void;
}

export function DeanFeedsView({
  builds,
  hasMore,
  loadingMore,
  directory,
  onLoadMore,
  onInspectBuild,
}: DeanFeedsViewProps) {
  const router = useRouter();
  const [subTab, setSubTab] = useState<'builds' | 'roster'>('builds');
  const [rosterScope, setRosterScope] = useState<'all' | 'students' | 'alumni'>(
    'all',
  );
  const [rosterQuery, setRosterQuery] = useState('');

  const filteredRoster = useMemo(() => {
    const q = rosterQuery.trim().toLowerCase();
    return directory.filter((entry) => {
      if (rosterScope === 'students' && entry.user.role !== 'student') {
        return false;
      }
      if (rosterScope === 'alumni' && entry.user.role !== 'alumni') {
        return false;
      }
      if (!q) return true;
      return [
        entry.user.fullName,
        entry.user.headline,
        entry.user.company ?? '',
        entry.user.branch ?? '',
        entry.user.regNo ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
  }, [directory, rosterScope, rosterQuery]);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('builds')}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer ${
              subTab === 'builds'
                ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24]'
                : 'border border-slate-200 dark:border-white/10 text-[#475569] dark:text-[#94A3B8]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Student Builds &amp; Papers ({builds.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab('roster')}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold cursor-pointer ${
              subTab === 'roster'
                ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24]'
                : 'border border-slate-200 dark:border-white/10 text-[#475569] dark:text-[#94A3B8]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Campus Roster ({directory.length})
          </button>
        </div>

        {subTab === 'roster' && (
          <div className="flex flex-wrap items-center gap-2">
            {(['all', 'students', 'alumni'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRosterScope(s)}
                className={`rounded-full px-3 py-1 text-xs font-semibold capitalize cursor-pointer ${
                  rosterScope === s
                    ? 'bg-[#0891B2]/15 text-[#0891B2] dark:text-[#22D3EE]'
                    : 'text-[#64748B]'
                }`}
              >
                {s}
              </button>
            ))}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rosterQuery}
                onChange={(e) => setRosterQuery(e.target.value)}
                placeholder="Search roster..."
                className="rounded-full border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] pl-8 pr-3 py-1.5 text-xs"
              />
            </div>
          </div>
        )}
      </div>

      {subTab === 'builds' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {builds.map((item) => (
              <BuildCaseStudyCard
                key={`${item.isPaper ? 'p' : 'j'}-${item.id}`}
                item={item}
                onInspect={onInspectBuild}
                onAuthorClick={(id) =>
                  router.push(`/u/${encodeURIComponent(id)}`)
                }
                onAlumClick={(id) =>
                  router.push(`/u/${encodeURIComponent(id)}`)
                }
              />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                disabled={loadingMore}
                onClick={onLoadMore}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 dark:border-white/20 px-6 py-2 text-xs font-semibold cursor-pointer disabled:opacity-60"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
                {loadingMore ? 'Loading...' : 'Load More Campus Builds'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredRoster.map(({ user, projectsCount, papersCount, offersCount }) => (
            <Link
              key={user.id}
              href={`/u/${encodeURIComponent(user.id)}`}
              className="rounded-2xl border border-[rgba(100,116,139,0.22)] dark:border-[rgba(226,232,240,0.16)] bg-white/85 dark:bg-[#14171E]/90 p-4 flex items-center justify-between gap-3 hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {user.avatarUrl && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="h-10 w-10 rounded-xl object-cover shrink-0"
                  />
                )}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold truncate">
                      {user.fullName}
                    </span>
                    {user.role === 'alumni' && (
                      <AlumniVerificationBadge
                        status={user.verificationStatus}
                        compact
                      />
                    )}
                  </div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                    {user.headline}
                  </div>
                  <div className="text-[10px] font-mono text-[#64748B] mt-0.5">
                    {projectsCount}P • {papersCount}R • {offersCount} Offers
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#64748B] shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
