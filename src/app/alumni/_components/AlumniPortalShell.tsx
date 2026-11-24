'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Award,
  Bell,
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle2,
  Compass,
  Flame,
  MessageSquare,
  Plus,
  ShieldCheck,
  ThumbsUp,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import AlumStudentChatSection, {
  type ChatPeerOption,
} from '@/components/AlumStudentChatSection';
import FloatingChatToast from '@/components/FloatingChatToast';
import {
  PeopleDirectoryModal,
  PublicProfileModal,
  findProfileByName,
  type SelectedProfileTarget,
} from '@/components/ProfileDirectoryModal';
import { BuildCaseStudyModal } from '@/components/shared/BuildCaseStudyModal';
import { PendingVerificationBanner } from '@/components/shared/PendingVerificationBanner';
import { PortalNavbar, type PortalNavTab } from '@/components/shared/PortalNavbar';
import { AlumniVerificationBadge } from '@/components/shared/VerificationBadge';
import {
  toggleLikeBuildAction,
  toggleSaveItemAction,
} from '@/modules/builds/actions';
import { useInfiniteBuilds } from '@/modules/builds/useInfiniteBuilds';
import {
  endorseOrVouchBuildAction,
  toggleRoastResolvedAction,
} from '@/modules/endorsements/actions';
import type { EndorsementWithTargetDTO } from '@/modules/endorsements/queries';
import {
  createJobPostingAction,
  fetchApplicantsForJobAction,
  respondCoffeeChatAction,
  updateApplicationStatusAction,
} from '@/modules/hiring/actions';
import type { CreateJobPostingInput } from '@/modules/hiring/validators';
import {
  signOutAction,
  switchDemoPersonaAction,
  toggleFollowUserAction,
} from '@/modules/identity/actions';
import type {
  NetworkDirectoryEntry,
  PublicProfileDTO,
} from '@/modules/identity/queries';
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from '@/modules/messaging/actions';
import { unifiedSearchAction } from '@/modules/search/actions';
import type {
  ChatThreadDTO,
  CoffeeChatDTO,
  CursorPage,
  FeedBuildItem,
  JobApplicationDTO,
  JobPostingDTO,
  NotificationDTO,
  PlacementOfferDTO,
  SearchHitDTO,
  SessionUser,
} from '@/types/domain';
import { AlumniEndorsementsView } from './AlumniEndorsementsView';
import { AlumniFeedView, type EndorseActionKind } from './AlumniFeedView';
import { AlumniJobsManagerView } from './AlumniJobsManagerView';
import {
  ApplicantsDrawerModal,
  EndorseVouchModal,
  PostJobModal,
} from './AlumniModals';
import { AlumniNotificationsView } from './AlumniNotificationsView';
import { AlumniProfileView } from './AlumniProfileView';

export type AlumSection =
  | 'feed'
  | 'endorsements'
  | 'post-job'
  | 'chat'
  | 'notifications'
  | 'profile';

export interface AlumniPortalShellProps {
  viewer: SessionUser;
  viewerProfile: PublicProfileDTO | null;
  initialBuildsPage: CursorPage<FeedBuildItem>;
  initialEndorsements: EndorsementWithTargetDTO[];
  initialJobs: JobPostingDTO[];
  initialCoffeeChats: CoffeeChatDTO[];
  initialThreads: ChatThreadDTO[];
  initialNotifications: NotificationDTO[];
  initialOffers: PlacementOfferDTO[];
  directoryEntries: NetworkDirectoryEntry[];
  demoModeEnabled: boolean;
}

export function AlumniPortalShell({
  viewer,
  viewerProfile,
  initialBuildsPage,
  initialEndorsements,
  initialJobs,
  initialCoffeeChats,
  initialThreads,
  initialNotifications,
  initialOffers,
  directoryEntries,
  demoModeEnabled,
}: AlumniPortalShellProps) {
  const router = useRouter();
  const isVerified = viewer.verificationStatus === 'verified';

  const [section, setSection] = useState<AlumSection>('feed');
  const [toast, setToast] = useState<string | null>(null);

  const notify = useCallback((msg: string) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  // Infinite Builds Feed
  const {
    items: builds,
    hasMore,
    loadingMore,
    loadMore,
    updateItem: updateBuildItem,
  } = useInfiniteBuilds({
    initialPage: initialBuildsPage,
    limit: 15,
  });

  // Stateful collections synced with Server Actions
  const [endorsements, setEndorsements] =
    useState<EndorsementWithTargetDTO[]>(initialEndorsements);
  const [jobs, setJobs] = useState<JobPostingDTO[]>(initialJobs);
  const [coffeeChats, setCoffeeChats] =
    useState<CoffeeChatDTO[]>(initialCoffeeChats);
  const [notifications, setNotifications] =
    useState<NotificationDTO[]>(initialNotifications);

  // Follow state map
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const entry of directoryEntries) {
      if (entry.isFollowedByMe) {
        map[entry.user.id] = true;
        if (entry.user.legacyCode) map[entry.user.legacyCode] = true;
      }
    }
    return map;
  });

  // Search state powered by unifiedSearchAction
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchHits, setSearchHits] = useState<SearchHitDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    if (!value.trim()) {
      setSearchHits([]);
      setIsSearching(false);
    } else {
      setIsSearching(true);
    }
  }, []);

  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      unifiedSearchAction({ q: trimmed, scope: 'all', limit: 7 })
        .then((hits) => {
          if (!cancelled) setSearchHits(hits);
        })
        .catch(() => {
          if (!cancelled) setSearchHits([]);
        })
        .finally(() => {
          if (!cancelled) setIsSearching(false);
        });
    }, 180);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Modals & Drawers
  const [caseStudyItem, setCaseStudyItem] = useState<FeedBuildItem | null>(null);
  const [endorseTarget, setEndorseTarget] = useState<{
    item: FeedBuildItem;
    defaultKind: EndorseActionKind;
  } | null>(null);
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [applicantsJob, setApplicantsJob] = useState<JobPostingDTO | null>(null);
  const [applicantsList, setApplicantsList] = useState<JobApplicationDTO[]>([]);
  const [applicantsLoading, setApplicantsLoading] = useState(false);

  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] =
    useState<SelectedProfileTarget | null>(null);
  const [personaModalOpen, setPersonaModalOpen] = useState(false);

  // Chat state
  const [expandThreadId, setExpandThreadId] = useState<string | null>(null);
  const [chatTargetName, setChatTargetName] = useState<string | null>(null);

  const unreadNotifCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const unreadChatCount = useMemo(
    () => initialThreads.reduce((acc, t) => acc + t.alumniUnreadCount, 0),
    [initialThreads]
  );

  const myJobs = useMemo(
    () => jobs.filter((j) => j.postedByAlumniId === viewer.id),
    [jobs, viewer.id]
  );

  const shortlistedBuilds = useMemo(
    () => builds.filter((b) => Boolean(b.savedByMe)),
    [builds]
  );

  const topStudents = useMemo(
    () =>
      directoryEntries
        .filter((e) => e.user.role === 'student')
        .slice(0, 4),
    [directoryEntries]
  );

  const chatPeers = useMemo<ChatPeerOption[]>(
    () =>
      directoryEntries
        .filter((e) => e.user.role === 'student')
        .slice(0, 12)
        .map((e) => ({
          userId: e.user.id,
          name: e.user.fullName,
          meta: `${e.user.academicYear ?? 'ITER'} ${e.user.branch ?? 'CSE'}`,
          avatarUrl: e.user.avatarUrl,
        })),
    [directoryEntries]
  );

  const referralsGiven = useMemo(
    () => initialOffers.filter((o) => o.referringAlumniId === viewer.id),
    [initialOffers, viewer.id]
  );

  const demoPersonas = useMemo(
    () => directoryEntries.map((e) => e.user).slice(0, 12),
    [directoryEntries]
  );

  // Handlers
  const openProfileByName = useCallback(
    (name: string) => {
      const target = findProfileByName(name);
      if (target) {
        setSelectedProfile(target);
      } else {
        setDirectoryOpen(true);
      }
    },
    []
  );

  const handleToggleLike = async (item: FeedBuildItem) => {
    const targetType = item.isPaper ? 'paper' : 'project';
    const prevLiked = Boolean(item.likedByMe);
    const prevCount = item.likesCount;

    updateBuildItem(item.id, (b) => ({
      ...b,
      likedByMe: !prevLiked,
      likesCount: Math.max(0, prevCount + (prevLiked ? -1 : 1)),
    }));

    const res = await toggleLikeBuildAction(targetType, item.id);
    if (!res.ok) {
      updateBuildItem(item.id, (b) => ({
        ...b,
        likedByMe: prevLiked,
        likesCount: prevCount,
      }));
      notify(res.error);
      return;
    }

    updateBuildItem(item.id, (b) => ({
      ...b,
      likedByMe: res.data.liked,
      likesCount: res.data.likesCount,
    }));
  };

  const handleToggleSave = async (item: FeedBuildItem) => {
    const itemType = item.isPaper ? 'paper' : 'project';
    const prevSaved = Boolean(item.savedByMe);

    updateBuildItem(item.id, (b) => ({
      ...b,
      savedByMe: !prevSaved,
    }));

    const res = await toggleSaveItemAction(itemType, item.id);
    if (!res.ok) {
      updateBuildItem(item.id, (b) => ({
        ...b,
        savedByMe: prevSaved,
      }));
      notify(res.error);
      return;
    }

    notify(
      res.data.saved
        ? `Shortlisted "${item.title}" to your candidate list.`
        : `Removed "${item.title}" from shortlist.`
    );
  };

  const handleToggleFollow = async (id: string, name: string) => {
    const matched = directoryEntries.find(
      (e) => e.user.id === id || e.user.legacyCode === id
    );
    const targetUserId = matched?.user.id ?? id;

    setFollowedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
      [targetUserId]: !prev[id],
    }));

    const res = await toggleFollowUserAction(targetUserId);
    if (!res.ok) {
      setFollowedIds((prev) => ({
        ...prev,
        [id]: !prev[id],
        [targetUserId]: !prev[id],
      }));
      notify(res.error);
      return;
    }

    notify(
      res.data.following
        ? `Following ${name}`
        : `Unfollowed ${name}`
    );
  };

  const handleEndorseSubmit = async (payload: {
    targetType: 'project' | 'paper';
    targetId: string;
    kind: EndorseActionKind;
    category: string;
    quote: string;
    certifiedSkills: string[];
    rating: number;
  }) => {
    const res = await endorseOrVouchBuildAction(payload);
    if (!res.ok) {
      return { ok: false, error: res.error };
    }

    const targetBuild = builds.find((b) => b.id === payload.targetId);
    if (targetBuild) {
      updateBuildItem(targetBuild.id, (b) => ({
        ...b,
        endorsements: [res.data.endorsement, ...b.endorsements],
      }));
      if (caseStudyItem?.id === targetBuild.id) {
        setCaseStudyItem((prev) =>
          prev
            ? {
                ...prev,
                endorsements: [res.data.endorsement, ...prev.endorsements],
              }
            : null
        );
      }
      setEndorsements((prev) => [
        {
          ...res.data.endorsement,
          targetType: payload.targetType,
          targetId: targetBuild.id,
          targetCode: targetBuild.code,
          targetTitle: targetBuild.title,
          targetDomain: targetBuild.domain,
        },
        ...prev,
      ]);
    }

    notify(
      res.data.vouchCertificate
        ? `Issued cryptographic Vouch ${res.data.vouchCertificate.vouchCode}!`
        : payload.kind === 'roast'
          ? '5-minute architecture roast published!'
          : 'Endorsement published to campus feed!'
    );

    return {
      ok: true,
      vouchCertificate: res.data.vouchCertificate,
    };
  };

  const handleToggleRoastResolved = async (endorsementId: string) => {
    const res = await toggleRoastResolvedAction({ endorsementId });
    if (!res.ok) {
      notify(res.error);
      return;
    }
    setEndorsements((prev) =>
      prev.map((e) =>
        e.id === endorsementId ? { ...e, resolved: res.data.resolved } : e
      )
    );
    notify(
      res.data.resolved ? 'Marked roast as resolved ✓' : 'Reopened roast feedback.'
    );
  };

  const handleCreateJob = async (payload: CreateJobPostingInput) => {
    const res = await createJobPostingAction(payload);
    if (!res.ok) {
      return { ok: false, error: res.error };
    }
    setJobs((prev) => [res.data, ...prev]);
    notify(`Published "${res.data.roleTitle}" at ${res.data.company}!`);
    return { ok: true };
  };

  const handleManageApplicants = async (job: JobPostingDTO) => {
    setApplicantsJob(job);
    setApplicantsLoading(true);
    setApplicantsList([]);
    try {
      const res = await fetchApplicantsForJobAction(job.id);
      if (!res.ok) {
        notify(res.error);
        setApplicantsJob(null);
        return;
      }
      setApplicantsList(res.data);
    } finally {
      setApplicantsLoading(false);
    }
  };

  const handleUpdateApplicationStatus = async (
    applicationId: string,
    status: JobApplicationDTO['status']
  ) => {
    const res = await updateApplicationStatusAction({ applicationId, status });
    if (!res.ok) {
      notify(res.error);
      return;
    }
    setApplicantsList((prev) =>
      prev.map((a) => (a.id === applicationId ? res.data : a))
    );
    notify(`Updated ${res.data.studentName}'s application to "${status.replace('_', ' ')}".`);
  };

  const handleRespondCoffeeChat = async (
    coffeeChatId: string,
    decision: 'accepted' | 'declined'
  ) => {
    const res = await respondCoffeeChatAction({ coffeeChatId, decision });
    if (!res.ok) {
      notify(res.error);
      return;
    }
    setCoffeeChats((prev) =>
      prev.map((c) => (c.id === coffeeChatId ? res.data : c))
    );
    notify(
      decision === 'accepted'
        ? `Accepted 15-min coffee chat with ${res.data.studentName}!`
        : `Declined coffee chat with ${res.data.studentName}.`
    );
  };

  const handleMarkNotificationRead = async (notificationId: string) => {
    const res = await markNotificationReadAction({ notificationId });
    if (res.ok) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    const res = await markAllNotificationsReadAction();
    if (res.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      notify('All notifications marked read.');
    }
  };

  const handleSignOut = async () => {
    await signOutAction();
    router.push('/login');
    router.refresh();
  };

  const handleSwitchPersona = async (targetUserId: string) => {
    const res = await switchDemoPersonaAction(targetUserId);
    if (!res.ok) {
      notify(res.error);
      return;
    }
    setPersonaModalOpen(false);
    const dest =
      res.data.role === 'dean'
        ? '/dean'
        : res.data.role === 'student'
          ? '/student'
          : '/alumni';
    router.push(dest);
    router.refresh();
  };

  const tabs: PortalNavTab[] = [
    {
      id: 'feed',
      label: 'Talent Feed',
      icon: <Compass className="w-3.5 h-3.5" />,
    },
    {
      id: 'endorsements',
      label: 'My Endorsements',
      icon: <Award className="w-3.5 h-3.5" />,
    },
    {
      id: 'post-job',
      label: 'Post Job & Offers',
      icon: <Briefcase className="w-3.5 h-3.5" />,
    },
    {
      id: 'chat',
      label: 'Chat',
      icon: <MessageSquare className="w-3.5 h-3.5" />,
      badge: unreadChatCount,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Bell className="w-3.5 h-3.5" />,
      badge: unreadNotifCount,
    },
    {
      id: 'profile',
      label: 'My Profile',
      icon: <User className="w-3.5 h-3.5" />,
    },
  ];

  const searchDropdown =
    searchFocused && searchQuery.trim().length > 0 ? (
      <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E] shadow-2xl p-2.5 z-50 space-y-2">
        <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
          Unified Campus Matches
        </div>
        {isSearching ? (
          <div className="px-2 py-2 text-xs text-[#52525B] dark:text-zinc-400">
            Searching campus network…
          </div>
        ) : searchHits.length === 0 ? (
          <div className="px-2 py-2 text-xs text-[#52525B] dark:text-zinc-400">
            No matches for &ldquo;{searchQuery}&rdquo;
          </div>
        ) : (
          <div className="space-y-1">
            {searchHits.map((hit) => (
              <Link
                key={`${hit.kind}-${hit.id}`}
                href={hit.href}
                onMouseDown={(e) => {
                  e.preventDefault();
                  setSearchFocused(false);
                  router.push(hit.href);
                }}
                className="w-full flex items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-left hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-xs font-bold truncate">{hit.title}</div>
                  <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                    {hit.subtitle}
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 px-2 py-0.5 text-[9px] font-bold uppercase text-[#0891B2] dark:text-[#22D3EE]">
                  {hit.badge || hit.kind}
                </span>
              </Link>
            ))}
          </div>
        )}
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            setSearchFocused(false);
            setDirectoryOpen(true);
          }}
          className="w-full rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 py-1.5 text-[11px] font-semibold text-[#0891B2] dark:text-[#22D3EE] text-center"
        >
          See all results in Network Directory →
        </button>
      </div>
    ) : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-[#09090B] dark:text-zinc-50 transition-colors">
      <PortalNavbar
        portalLabel="Alumni"
        tabs={tabs}
        activeTab={section}
        onTabChange={(id) => setSection(id as AlumSection)}
        searchValue={searchQuery}
        onSearchChange={(val) => {
          handleSearchChange(val);
          setSearchFocused(true);
        }}
        searchPlaceholder="Search builders, projects, skills..."
        onSearchFocus={() => setSearchFocused(true)}
        onSearchBlur={() => setTimeout(() => setSearchFocused(false), 180)}
        searchDropdown={searchDropdown}
        user={{
          fullName: viewer.fullName,
          avatarUrl: viewer.avatarUrl,
          role: viewer.role,
          verificationStatus: viewer.verificationStatus,
          subtitle: `${viewer.designation || 'Alumni'} @ ${viewer.company || 'ITER'}`,
        }}
        onProfileClick={() => setSection('profile')}
        onSignOut={() => void handleSignOut()}
        onSwitchPersona={
          demoModeEnabled ? () => setPersonaModalOpen(true) : undefined
        }
        switchPersonaHref={demoModeEnabled ? undefined : '/login'}
        rightActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDirectoryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#0891B2] dark:hover:border-[#22D3EE] px-3 py-1.5 text-xs font-semibold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
              <span className="hidden sm:inline">People</span>
            </button>
            {isVerified && (
              <button
                type="button"
                onClick={() => setPostJobOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] hover:bg-[#1E293B] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-3.5 py-1.5 text-xs font-semibold transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Post Opening</span>
              </button>
            )}
          </div>
        }
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Contextual Pending / Rejected Verification Banner */}
        <PendingVerificationBanner
          status={viewer.verificationStatus}
          workEmail={viewer.workEmail}
          company={viewer.company}
          supportHref="/signup"
        />

        {/* 3-Column Shell */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT RAIL (Hidden on Profile tab so profile expands) */}
          {section !== 'profile' && (
            <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
              {/* Mini Alumni Card */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => setSection('profile')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSection('profile');
                  }
                }}
                className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 overflow-hidden shadow-2xs cursor-pointer hover:border-[#0891B2] dark:hover:border-[#22D3EE] transition-colors"
              >
                <div className="relative h-16 overflow-hidden bg-gradient-to-r from-[#0C0F16] via-slate-800 to-[#0891B2]">
                  {viewer.bannerUrl && (
                    <img
                      src={viewer.bannerUrl}
                      alt="Alumni banner"
                      className="h-full w-full object-cover opacity-45"
                    />
                  )}
                </div>
                <div className="px-5 pb-5 -mt-8 space-y-3 relative z-10">
                  {viewer.avatarUrl ? (
                    <img
                      src={viewer.avatarUrl}
                      alt={viewer.fullName}
                      className="h-14 w-14 rounded-2xl object-cover border-4 border-white dark:border-[#14171E] shadow-xs bg-[#0C0F16]"
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-2xl border-4 border-white dark:border-[#14171E] bg-[#0891B2]/20 text-[#22D3EE] font-bold text-sm flex items-center justify-center">
                      {viewer.fullName.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <h2 className="text-sm font-bold truncate">{viewer.fullName}</h2>
                      <AlumniVerificationBadge status={viewer.verificationStatus} compact />
                    </div>
                    <p className="text-xs text-[#52525B] dark:text-zinc-400">
                      {viewer.designation || 'Alumni Mentor'} @ {viewer.company || 'Partner Team'}
                      {viewer.batchYear ? ` • '${String(viewer.batchYear).slice(-2)}` : ''}
                    </p>
                    {viewer.mentorshipScope && (
                      <p className="text-xs text-[#09090B] dark:text-zinc-200 line-clamp-2">
                        {viewer.mentorshipScope}
                      </p>
                    )}
                  </div>

                  <div className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-2.5 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="rounded-lg bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 p-2">
                      <div className="text-sm font-bold text-[#0891B2] dark:text-[#22D3EE]">
                        {endorsements.length}
                      </div>
                      <div className="text-[10px] text-[#52525B] dark:text-zinc-400">
                        Endorsed
                      </div>
                    </div>
                    <div className="rounded-lg bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 p-2">
                      <div className="text-sm font-bold text-[#059669] dark:text-[#34D399]">
                        {myJobs.length}
                      </div>
                      <div className="text-[10px] text-[#52525B] dark:text-zinc-400">
                        My Openings
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shortlisted Builds */}
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-4 space-y-2.5 shadow-2xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
                  Shortlisted Builds ({shortlistedBuilds.length})
                </h3>
                {shortlistedBuilds.length === 0 ? (
                  <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
                    Save any student project or paper on the Talent Feed to shortlist candidates here.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {shortlistedBuilds.slice(0, 4).map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setCaseStudyItem(b)}
                        className="w-full text-left rounded-xl bg-[#F4F4F5] dark:bg-zinc-900 p-2.5 border border-transparent hover:border-[#0891B2] transition-colors"
                      >
                        <div className="text-xs font-semibold truncate">{b.title}</div>
                        <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                          {b.isPaper ? b.leadAuthorName : b.leadName} • {b.domain}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* CENTER STAGE */}
          <main className={section === 'profile' ? 'lg:col-span-9 space-y-5' : 'lg:col-span-6 space-y-5'}>
            {section === 'feed' && (
              <AlumniFeedView
                builds={builds}
                hasMore={hasMore}
                loadingMore={loadingMore}
                isVerified={isVerified}
                totalBuildersCount={directoryEntries.length}
                onLoadMore={loadMore}
                onInspect={(item) => setCaseStudyItem(item)}
                onAuthorClick={(_id, name) => openProfileByName(name)}
                onAlumClick={(_id, name) => openProfileByName(name)}
                onToggleLike={(item) => void handleToggleLike(item)}
                onToggleSave={(item) => void handleToggleSave(item)}
                onOpenEndorseModal={(item, defaultKind) =>
                  setEndorseTarget({ item, defaultKind })
                }
                onOpenPostJobTab={() => setSection('post-job')}
                onOpenDirectory={() => setDirectoryOpen(true)}
              />
            )}

            {section === 'endorsements' && (
              <AlumniEndorsementsView
                endorsements={endorsements}
                onToggleRoastResolved={handleToggleRoastResolved}
                onOpenBuildById={(_type, id) => {
                  const found = builds.find((b) => b.id === id);
                  if (found) setCaseStudyItem(found);
                  else notify('Open this build from its Project Page link.');
                }}
                onExploreFeed={() => setSection('feed')}
              />
            )}

            {section === 'post-job' && (
              <AlumniJobsManagerView
                currentAlumId={viewer.id}
                isVerified={isVerified}
                jobs={jobs}
                coffeeChats={coffeeChats}
                onOpenPostJobModal={() => setPostJobOpen(true)}
                onManageApplicants={(job) => void handleManageApplicants(job)}
                onAlumniClick={(_id, name) => openProfileByName(name)}
                onStudentClick={(_id, name) => openProfileByName(name)}
                onRespondCoffeeChat={handleRespondCoffeeChat}
              />
            )}

            {section === 'chat' && (
              <AlumStudentChatSection
                viewerRole="alumni"
                viewerName={viewer.fullName}
                currentUserId={viewer.id}
                initialThreads={initialThreads}
                availablePeers={chatPeers}
                initialThreadId={expandThreadId}
                initialTargetName={chatTargetName}
              />
            )}

            {section === 'notifications' && (
              <AlumniNotificationsView
                notifications={notifications}
                onMarkRead={handleMarkNotificationRead}
                onMarkAllRead={handleMarkAllNotificationsRead}
                onNavigateSection={(targetSection, targetEntityId) => {
                  if (targetSection === 'chat') {
                    if (targetEntityId) setExpandThreadId(targetEntityId);
                    setSection('chat');
                  } else if (
                    targetSection === 'post-job' ||
                    targetSection === 'jobs'
                  ) {
                    setSection('post-job');
                  } else {
                    setSection('feed');
                  }
                }}
              />
            )}

            {section === 'profile' && (
              <AlumniProfileView
                viewer={viewer}
                profile={viewerProfile}
                endorsements={endorsements}
                myJobs={myJobs}
                referralsGiven={referralsGiven}
                onOpenPostJobModal={() => setPostJobOpen(true)}
                onOpenFeed={() => setSection('feed')}
                onOpenStudentProfile={(_id, name) => openProfileByName(name)}
              />
            )}
          </main>

          {/* RIGHT RAIL */}
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
            {/* Student Coffee Chat Requests */}
            <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-[#14171E]/95 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
                  Coffee Chats ({coffeeChats.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setSection('post-job')}
                  className="text-[11px] font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
                >
                  Manage
                </button>
              </div>

              {coffeeChats.length === 0 ? (
                <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
                  No incoming coffee chat requests.
                </p>
              ) : (
                <div className="space-y-2.5">
                  {coffeeChats.slice(0, 3).map((chat) => (
                    <div
                      key={chat.id}
                      className="rounded-xl bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 p-3 space-y-2"
                    >
                      <button
                        type="button"
                        onClick={() => openProfileByName(chat.studentName)}
                        className="w-full text-left hover:text-[#0891B2] dark:hover:text-[#22D3EE]"
                      >
                        <div className="text-xs font-bold truncate">
                          {chat.studentName}
                        </div>
                        <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                          {chat.studentMeta}
                        </div>
                      </button>
                      <p className="text-[11px] text-[#09090B] dark:text-zinc-300 line-clamp-2">
                        {chat.topic}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        {chat.status === 'pending' && isVerified ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                void handleRespondCoffeeChat(chat.id, 'accepted')
                              }
                              className="rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-[10px] font-semibold"
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                void handleRespondCoffeeChat(chat.id, 'declined')
                              }
                              className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-2.5 py-0.5 text-[10px] font-semibold"
                            >
                              Decline
                            </button>
                          </div>
                        ) : (
                          <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold capitalize text-[#059669] dark:text-[#34D399]">
                            {chat.status}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setChatTargetName(chat.studentName);
                            setSection('chat');
                          }}
                          className="text-[10px] font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
                        >
                          Message →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top ITER Builders */}
            <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                  Top ITER Builders
                </h3>
                <button
                  type="button"
                  onClick={() => setDirectoryOpen(true)}
                  className="text-[11px] font-semibold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
                >
                  See all
                </button>
              </div>
              {topStudents.map((entry) => (
                <Link
                  key={entry.user.id}
                  href={`/u/${encodeURIComponent(entry.user.legacyCode || entry.user.id)}`}
                  className="w-full text-left rounded-xl bg-[#F4F4F5] dark:bg-zinc-900 p-2.5 flex items-center gap-2.5 border border-transparent hover:border-[#0891B2] transition-colors"
                >
                  {entry.user.avatarUrl && (
                    <img
                      src={entry.user.avatarUrl}
                      alt={entry.user.fullName}
                      className="h-7 w-7 rounded-full object-cover shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">
                      {entry.user.fullName}
                    </div>
                    <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                      {entry.user.academicYear} {entry.user.branch} •{' '}
                      {entry.projectsCount} builds
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#52525B] shrink-0" />
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>

      {/* Build Case Study Modal */}
      <BuildCaseStudyModal
        item={caseStudyItem}
        onClose={() => setCaseStudyItem(null)}
        onAuthorClick={(_id, name) => openProfileByName(name)}
        onAlumClick={(_id, name) => openProfileByName(name)}
        actionSlot={
          caseStudyItem && isVerified ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setEndorseTarget({ item: caseStudyItem, defaultKind: 'endorsement' })
                }
                className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold hover:border-[#0891B2]"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
                <span>Endorse</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setEndorseTarget({ item: caseStudyItem, defaultKind: 'roast' })
                }
                className="inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>5-Min Roast</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  setEndorseTarget({ item: caseStudyItem, defaultKind: 'vouch' })
                }
                className="inline-flex items-center gap-1 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-4 py-1.5 text-xs font-semibold"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Issue Vouch</span>
              </button>
            </>
          ) : null
        }
      />

      {/* Endorse / 5-Min Roast / Issue Vouch Modal */}
      {endorseTarget && (
        <EndorseVouchModal
          item={endorseTarget.item}
          defaultKind={endorseTarget.defaultKind}
          onClose={() => setEndorseTarget(null)}
          onNavigateOut={() => {
            setEndorseTarget(null);
            setCaseStudyItem(null);
          }}
          onSubmit={handleEndorseSubmit}
        />
      )}

      {/* Post Job Opening Modal */}
      <PostJobModal
        open={postJobOpen}
        viewer={viewer}
        onClose={() => setPostJobOpen(false)}
        onSubmit={handleCreateJob}
      />

      {/* Applicants Pipeline Modal */}
      <ApplicantsDrawerModal
        job={applicantsJob}
        applicants={applicantsList}
        loading={applicantsLoading}
        onClose={() => setApplicantsJob(null)}
        onUpdateStatus={handleUpdateApplicationStatus}
        onStudentClick={(_id, name) => openProfileByName(name)}
      />

      {/* Public Profile Modal */}
      {selectedProfile && (
        <PublicProfileModal
          target={selectedProfile}
          followedIds={followedIds}
          onToggleFollow={(id, name) => void handleToggleFollow(id, name)}
          onSelectProfile={(next) => setSelectedProfile(next)}
          onOpenProject={(projectId) => {
            const match = builds.find(
              (b) => b.id === projectId || b.code === projectId
            );
            if (match) setCaseStudyItem(match);
            else router.push(`/projects/${encodeURIComponent(projectId)}`);
          }}
          onGoToJobs={() => setSection('post-job')}
          onNotify={notify}
          onClose={() => setSelectedProfile(null)}
        />
      )}

      {/* Network Directory Modal */}
      {directoryOpen && (
        <PeopleDirectoryModal
          initialQuery={searchQuery}
          followedIds={followedIds}
          onToggleFollow={(id, name) => void handleToggleFollow(id, name)}
          onSelectProfile={(next) => setSelectedProfile(next)}
          onClose={() => setDirectoryOpen(false)}
          onLiveSearch={async (q, scope) => {
            const mappedScope =
              scope === 'students' || scope === 'research'
                ? 'students'
                : scope === 'alumni' || scope === 'hiring'
                  ? 'alumni'
                  : 'all';
            return unifiedSearchAction({ q, scope: mappedScope, limit: 8 });
          }}
        />
      )}

      {/* Demo Persona Switcher Modal */}
      {personaModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPersonaModalOpen(false);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#0E1118] p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-luma-title text-base">Switch Demo Persona</h2>
                <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
                  Preview Verified Alumni, Pending Alumni, Student, or Dean experiences
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPersonaModalOpen(false)}
                className="rounded-full p-1.5 border border-[#E4E4E7] dark:border-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto overscroll-contain space-y-2">
              {demoPersonas.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => void handleSwitchPersona(p.id)}
                  className="w-full text-left rounded-xl border border-[#E4E4E7] dark:border-zinc-800 px-3.5 py-2.5 flex items-center justify-between gap-2 hover:border-[#0891B2] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-bold truncate">{p.fullName}</div>
                    <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                      {p.role.toUpperCase()} • {p.headline || p.company || p.branch}
                    </div>
                  </div>
                  {p.role === 'alumni' && (
                    <AlumniVerificationBadge status={p.verificationStatus} compact />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Quick-Reply Chat Toast */}
      <FloatingChatToast
        viewerRole="alumni"
        viewerName={viewer.fullName}
        currentUserId={viewer.id}
        initialThreads={initialThreads}
        isChatOpen={section === 'chat'}
        onExpandToChat={(threadId) => {
          if (threadId) setExpandThreadId(threadId);
          setSection('chat');
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 left-4 z-50 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#0F172A] dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2.5 text-xs font-semibold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#34D399] dark:text-[#059669] shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
