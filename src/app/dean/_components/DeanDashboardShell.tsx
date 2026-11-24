'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Award,
  BarChart3,
  Download,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { BuildCaseStudyModal } from '@/components/shared/BuildCaseStudyModal';
import { PortalNavbar } from '@/components/shared/PortalNavbar';
import { loadMoreBuildsAction } from '@/modules/builds/actions';
import {
  createAuditLogAction,
  reviewAlumniVerificationAction,
  verifyPlacementOfferAction,
} from '@/modules/governance/actions';
import {
  signOutAction,
  switchDemoPersonaAction,
} from '@/modules/identity/actions';
import type { NetworkDirectoryEntry } from '@/modules/identity/queries';
import { unifiedSearchAction } from '@/modules/search/actions';
import type {
  CursorPage,
  DeanAnalyticsDTO,
  FeedBuildItem,
  InstitutionalAuditLogDTO,
  PlacementOfferDTO,
  SearchHitDTO,
  SessionUser,
  VerificationRequestDTO,
} from '@/types/domain';
import { DeanFeedsView } from './DeanFeedsView';
import { DeanOverviewView } from './DeanOverviewView';
import { DeanPlacementsView } from './DeanPlacementsView';
import { DeanVerificationQueueView } from './DeanVerificationQueueView';

type DeanTab = 'overview' | 'verifications' | 'placements' | 'feeds';

interface DeanDashboardShellProps {
  dean: SessionUser;
  isPreviewMode: boolean;
  demoEnabled: boolean;
  initialAnalytics: DeanAnalyticsDTO;
  initialVerifications: VerificationRequestDTO[];
  initialOffers: PlacementOfferDTO[];
  initialAuditLogs: InstitutionalAuditLogDTO[];
  initialBuildsPage: CursorPage<FeedBuildItem>;
  initialDirectory: NetworkDirectoryEntry[];
}

export function DeanDashboardShell({
  dean,
  isPreviewMode,
  demoEnabled,
  initialAnalytics,
  initialVerifications,
  initialOffers,
  initialAuditLogs,
  initialBuildsPage,
  initialDirectory,
}: DeanDashboardShellProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<DeanTab>('overview');
  const [analytics, setAnalytics] =
    useState<DeanAnalyticsDTO>(initialAnalytics);
  const [verifications, setVerifications] =
    useState<VerificationRequestDTO[]>(initialVerifications);
  const [offers, setOffers] = useState<PlacementOfferDTO[]>(initialOffers);
  const [auditLogs, setAuditLogs] =
    useState<InstitutionalAuditLogDTO[]>(initialAuditLogs);

  const [builds, setBuilds] = useState<FeedBuildItem[]>(initialBuildsPage.items);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialBuildsPage.nextCursor,
  );
  const [hasMore, setHasMore] = useState<boolean>(initialBuildsPage.hasMore);
  const [loadingMore, setLoadingMore] = useState(false);

  const [inspectedBuild, setInspectedBuild] = useState<FeedBuildItem | null>(
    null,
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchHits, setSearchHits] = useState<SearchHitDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) return;
    let active = true;
    const timer = setTimeout(async () => {
      try {
        const hits = await unifiedSearchAction({ q, scope: 'all', limit: 10 });
        if (active) setSearchHits(hits);
      } finally {
        if (active) setIsSearching(false);
      }
    }, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchHits([]);
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  };

  const pendingCount = useMemo(
    () => verifications.filter((v) => v.status === 'pending').length,
    [verifications],
  );

  const handleActivateDeanDemo = async () => {
    const res = await switchDemoPersonaAction(dean.id);
    if (res.ok) {
      showToast(`Signed in as ${dean.fullName}`);
      router.refresh();
    } else {
      showToast(res.error);
    }
  };

  const handleSignOut = async () => {
    await signOutAction();
    router.push('/login');
    router.refresh();
  };

  const handleReviewVerification = async (input: {
    requestId: string;
    decision: 'approved' | 'rejected';
    reviewNote?: string;
  }) => {
    const res = await reviewAlumniVerificationAction(input);
    if (!res.ok) {
      showToast(res.error);
      return;
    }

    setVerifications((prev) =>
      prev.map((r) => (r.id === input.requestId ? res.data : r)),
    );

    setAnalytics((prev) => ({
      ...prev,
      pendingVerificationsCount: Math.max(0, prev.pendingVerificationsCount - 1),
      verifiedAlumniCount:
        input.decision === 'approved'
          ? prev.verifiedAlumniCount + 1
          : prev.verifiedAlumniCount,
    }));

    setAuditLogs((prev) => [
      {
        id: `audit_ui_${Date.now()}`,
        actorUserId: dean.id,
        actorName: dean.fullName,
        category: 'verification',
        title:
          input.decision === 'approved'
            ? `Verified Alumnus: ${res.data.alumniName} (${res.data.company})`
            : `Rejected Alumni Request: ${res.data.alumniName}`,
        impact: res.data.reviewNote ?? 'Processed via Dean T&P Governance Queue.',
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    showToast(
      input.decision === 'approved'
        ? `Approved ${res.data.alumniName} — Alumni Portal unlocked!`
        : `Rejected ${res.data.alumniName}'s verification request.`,
    );
    router.refresh();
  };

  const handleVerifyOffer = async (offerId: string) => {
    const res = await verifyPlacementOfferAction(offerId);
    if (!res.ok) {
      showToast(res.error);
      return;
    }

    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? res.data : o)),
    );

    setAuditLogs((prev) => [
      {
        id: `audit_ui_${Date.now()}`,
        actorUserId: dean.id,
        actorName: dean.fullName,
        category: 'offer_verified',
        title: `Verified ${res.data.company} ${res.data.offerType} (${res.data.packageStr})`,
        impact: `Confirmed offer ${res.data.code} for ${res.data.studentName}.`,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    showToast(`Verified placement offer ${res.data.code}!`);
    router.refresh();
  };

  const handleCreateAuditLog = async (input: {
    category: InstitutionalAuditLogDTO['category'];
    title: string;
    impact: string;
  }): Promise<boolean> => {
    const res = await createAuditLogAction(input);
    if (!res.ok) {
      showToast(res.error);
      return false;
    }

    setAuditLogs((prev) => [res.data, ...prev]);
    showToast('Audit log entry recorded.');
    router.refresh();
    return true;
  };

  const handleLoadMoreBuilds = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await loadMoreBuildsAction({
        cursor: nextCursor,
        limit: 20,
      });
      if (res.ok) {
        setBuilds((prev) => [...prev, ...res.data.items]);
        setNextCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);
      } else {
        showToast(res.error);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const searchDropdown =
    searchFocused && searchQuery.trim().length > 0 ? (
      <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#121620] shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
        {isSearching ? (
          <div className="p-4 text-xs text-[#64748B] dark:text-[#94A3B8]">
            Searching campus network…
          </div>
        ) : searchHits.length === 0 ? (
          <div className="p-4 text-xs text-[#64748B] dark:text-[#94A3B8]">
            No matches for &ldquo;{searchQuery}&rdquo;
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-white/10">
            {searchHits.map((hit) => (
              <Link
                key={`${hit.kind}-${hit.id}`}
                href={hit.href}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSearchFocused(false);
                  router.push(hit.href);
                }}
                className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-white/[0.05] text-xs"
              >
                <div className="min-w-0">
                  <div className="font-bold truncate">{hit.title}</div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                    {hit.subtitle}
                  </div>
                </div>
                <span className="rounded-full bg-[#0891B2]/10 px-2 py-0.5 text-[10px] font-semibold text-[#0891B2] dark:text-[#22D3EE] uppercase shrink-0">
                  {hit.kind}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    ) : null;

  return (
    <div className="font-luma-body min-h-dvh bg-[linear-gradient(135deg,#F8FAFC_0%,#E2E8F0_100%)] dark:bg-[radial-gradient(900px_500px_at_15%_5%,rgba(34,211,238,0.10)_0%,transparent_60%),linear-gradient(135deg,#07080A_0%,#121620_55%,#090A0E_100%)] text-[#0F172A] dark:text-white">
      <PortalNavbar
        portalLabel="Dean & T&P Governance"
        tabs={[
          {
            id: 'overview',
            label: 'Overview',
            icon: <BarChart3 className="w-3.5 h-3.5" />,
          },
          {
            id: 'verifications',
            label: 'Verification Queue',
            icon: <ShieldCheck className="w-3.5 h-3.5" />,
            badge: pendingCount,
          },
          {
            id: 'placements',
            label: 'Placements & Audit',
            icon: <Award className="w-3.5 h-3.5" />,
          },
          {
            id: 'feeds',
            label: 'Campus Feeds',
            icon: <Layers className="w-3.5 h-3.5" />,
          },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as DeanTab)}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search students, alumni, builds, offers..."
        searchDropdown={searchDropdown}
        onSearchFocus={() => setSearchFocused(true)}
        onSearchBlur={() => setTimeout(() => setSearchFocused(false), 180)}
        user={{
          fullName: dean.fullName,
          avatarUrl: dean.avatarUrl,
          role: dean.role,
          verificationStatus: dean.verificationStatus,
          subtitle: 'Dean of Placements & Industry Relations',
        }}
        onSignOut={handleSignOut}
        switchPersonaHref="/login"
        rightActions={
          <a
            href="/api/dean/export"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-3.5 py-1.5 text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </a>
        }
      />

      {isPreviewMode && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-4">
          <div className="rounded-2xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold">Read-Only Dean Preview:</span> Activate
              the Dean T&amp;P session to approve alumni verifications, verify
              offers, and export CSV reports.
            </div>
            <div className="flex items-center gap-2">
              {demoEnabled && (
                <button
                  type="button"
                  onClick={handleActivateDeanDemo}
                  className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-3.5 py-1.5 font-semibold cursor-pointer"
                >
                  Activate {dean.fullName} Session
                </button>
              )}
              <Link
                href="/login"
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 dark:border-white/20 px-3.5 py-1.5 font-semibold"
              >
                Sign In <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <DeanOverviewView
            analytics={analytics}
            onJumpToVerifications={() => setActiveTab('verifications')}
            onJumpToPlacements={() => setActiveTab('placements')}
          />
        )}

        {activeTab === 'verifications' && (
          <DeanVerificationQueueView
            requests={verifications}
            isPreviewMode={isPreviewMode}
            onReview={handleReviewVerification}
          />
        )}

        {activeTab === 'placements' && (
          <DeanPlacementsView
            offers={offers}
            auditLogs={auditLogs}
            isPreviewMode={isPreviewMode}
            onVerifyOffer={handleVerifyOffer}
            onCreateAuditLog={handleCreateAuditLog}
          />
        )}

        {activeTab === 'feeds' && (
          <DeanFeedsView
            builds={builds}
            hasMore={hasMore}
            loadingMore={loadingMore}
            directory={initialDirectory}
            onLoadMore={handleLoadMoreBuilds}
            onInspectBuild={setInspectedBuild}
          />
        )}
      </main>

      <BuildCaseStudyModal
        item={inspectedBuild}
        onClose={() => setInspectedBuild(null)}
        onAuthorClick={(id) => router.push(`/u/${encodeURIComponent(id)}`)}
        onAlumClick={(id) => router.push(`/u/${encodeURIComponent(id)}`)}
      />

      {toastMsg && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-full border border-[#0891B2]/40 bg-[#0F172A] text-white dark:bg-[#14171E] px-5 py-2.5 text-xs font-semibold shadow-xl">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
