'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  Bell,
  Briefcase,
  Compass,
  Home,
  MessageSquare,
  Plus,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import AlumStudentChatSection, {
  type ChatPeerOption,
} from '@/components/AlumStudentChatSection';
import FloatingChatToast from '@/components/FloatingChatToast';
import { BuildCaseStudyModal } from '@/components/shared/BuildCaseStudyModal';
import { PortalNavbar } from '@/components/shared/PortalNavbar';
import {
  loadMoreBuildsAction,
  publishBuildAction,
  toggleLikeBuildAction,
  toggleSaveItemAction,
} from '@/modules/builds/actions';
import {
  applyToJobAction,
  requestCoffeeChatAction,
} from '@/modules/hiring/actions';
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
  ProjectCardDTO,
  SearchHitDTO,
  SessionUser,
} from '@/types/domain';
import { StudentExploreView } from './StudentExploreView';
import { StudentHomeView } from './StudentHomeView';
import { StudentJobsView } from './StudentJobsView';
import { StudentNotificationsView } from './StudentNotificationsView';
import { StudentProfileView } from './StudentProfileView';

type StudentTab =
  | 'home'
  | 'explore'
  | 'jobs'
  | 'chat'
  | 'notifications'
  | 'profile';

interface StudentStudioShellProps {
  student: SessionUser;
  isPreviewMode: boolean;
  demoEnabled: boolean;
  initialBuildsPage: CursorPage<FeedBuildItem>;
  initialJobs: JobPostingDTO[];
  initialApplications: JobApplicationDTO[];
  initialCoffeeChats: CoffeeChatDTO[];
  initialThreads: ChatThreadDTO[];
  initialNotifications: NotificationDTO[];
  initialDirectory: NetworkDirectoryEntry[];
  initialPublicProfile: PublicProfileDTO | null;
}

export function StudentStudioShell({
  student,
  isPreviewMode,
  demoEnabled,
  initialBuildsPage,
  initialJobs,
  initialApplications,
  initialCoffeeChats,
  initialThreads,
  initialNotifications,
  initialDirectory,
  initialPublicProfile,
}: StudentStudioShellProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<StudentTab>('home');
  const [prevInitialBuildsPage, setPrevInitialBuildsPage] =
    useState<CursorPage<FeedBuildItem>>(initialBuildsPage);
  const [builds, setBuilds] = useState<FeedBuildItem[]>(initialBuildsPage.items);
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialBuildsPage.nextCursor,
  );
  const [hasMore, setHasMore] = useState<boolean>(initialBuildsPage.hasMore);
  const [loadingMore, setLoadingMore] = useState(false);

  if (prevInitialBuildsPage !== initialBuildsPage) {
    setPrevInitialBuildsPage(initialBuildsPage);
    setBuilds(initialBuildsPage.items);
    setNextCursor(initialBuildsPage.nextCursor);
    setHasMore(initialBuildsPage.hasMore);
  }

  const [prevInitialJobs, setPrevInitialJobs] =
    useState<JobPostingDTO[]>(initialJobs);
  const [jobs, setJobs] = useState<JobPostingDTO[]>(initialJobs);
  if (prevInitialJobs !== initialJobs) {
    setPrevInitialJobs(initialJobs);
    setJobs(initialJobs);
  }

  const [prevInitialApplications, setPrevInitialApplications] =
    useState<JobApplicationDTO[]>(initialApplications);
  const [applications, setApplications] =
    useState<JobApplicationDTO[]>(initialApplications);
  if (prevInitialApplications !== initialApplications) {
    setPrevInitialApplications(initialApplications);
    setApplications(initialApplications);
  }

  const [prevInitialCoffeeChats, setPrevInitialCoffeeChats] =
    useState<CoffeeChatDTO[]>(initialCoffeeChats);
  const [coffeeChats, setCoffeeChats] =
    useState<CoffeeChatDTO[]>(initialCoffeeChats);
  if (prevInitialCoffeeChats !== initialCoffeeChats) {
    setPrevInitialCoffeeChats(initialCoffeeChats);
    setCoffeeChats(initialCoffeeChats);
  }

  const [prevInitialNotifications, setPrevInitialNotifications] =
    useState<NotificationDTO[]>(initialNotifications);
  const [notifications, setNotifications] =
    useState<NotificationDTO[]>(initialNotifications);
  if (prevInitialNotifications !== initialNotifications) {
    setPrevInitialNotifications(initialNotifications);
    setNotifications(initialNotifications);
  }

  const [prevInitialDirectory, setPrevInitialDirectory] =
    useState<NetworkDirectoryEntry[]>(initialDirectory);
  const [directory, setDirectory] =
    useState<NetworkDirectoryEntry[]>(initialDirectory);
  if (prevInitialDirectory !== initialDirectory) {
    setPrevInitialDirectory(initialDirectory);
    setDirectory(initialDirectory);
  }

  const [inspectedBuild, setInspectedBuild] = useState<FeedBuildItem | null>(
    null,
  );
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Navbar search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchHits, setSearchHits] = useState<SearchHitDTO[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Chat focus state
  const [chatTargetName, setChatTargetName] = useState<string | null>(null);
  const [chatThreadId, setChatThreadId] = useState<string | null>(null);

  // Quick Publish modal state
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishType, setPublishType] = useState<'project' | 'paper'>(
    'project',
  );
  const [publishTitle, setPublishTitle] = useState('');
  const [publishSubtitle, setPublishSubtitle] = useState('');
  const [publishStory, setPublishStory] = useState('');
  const [publishDomain, setPublishDomain] = useState('Applied AI');
  const [publishTechStack, setPublishTechStack] = useState(
    'Next.js, TypeScript, PostgreSQL',
  );
  const [publishLiveUrl, setPublishLiveUrl] = useState('');
  const [publishRepoUrl, setPublishRepoUrl] = useState('');
  const [publishVenue, setPublishVenue] = useState('ITER Research Symposium');
  const [publishing, setPublishing] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Debounced live search
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

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications],
  );

  const unreadChatCount = useMemo(
    () =>
      initialThreads.reduce((sum, t) => sum + (t.studentUnreadCount ?? 0), 0),
    [initialThreads],
  );

  const myProjects = useMemo(
    () =>
      builds.filter(
        (b): b is ProjectCardDTO => !b.isPaper && b.leadId === student.id,
      ),
    [builds, student.id],
  );

  const alumniPeers = useMemo<ChatPeerOption[]>(
    () =>
      directory
        .filter((d) => d.user.role === 'alumni')
        .map((d) => ({
          userId: d.user.id,
          name: d.user.fullName,
          meta: d.user.headline,
          avatarUrl: d.user.avatarUrl,
        })),
    [directory],
  );

  const handleActivateStudentDemo = async () => {
    const res = await switchDemoPersonaAction(student.id);
    if (res.ok) {
      showToast(`Signed in as ${student.fullName}`);
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

  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await loadMoreBuildsAction({
        cursor: nextCursor,
        limit: 15,
      });
      if (res.ok) {
        setBuilds((prev) => {
          const existingKeys = new Set(
            prev.map((p) => `${p.isPaper ? 'p' : 'j'}:${p.id}`),
          );
          const fresh = res.data.items.filter(
            (i) => !existingKeys.has(`${i.isPaper ? 'p' : 'j'}:${i.id}`),
          );
          return [...prev, ...fresh];
        });
        setNextCursor(res.data.nextCursor);
        setHasMore(res.data.hasMore);
      } else {
        showToast(res.error);
      }
    } finally {
      setLoadingMore(false);
    }
  };

  const handleToggleLike = (item: FeedBuildItem) => {
    const targetType = item.isPaper ? 'paper' : 'project';
    startTransition(async () => {
      const res = await toggleLikeBuildAction(targetType, item.id);
      if (!res.ok) {
        if (res.code === 'UNAUTHORIZED') {
          showToast('Sign in to like builds.');
        } else {
          showToast(res.error);
        }
        return;
      }
      setBuilds((prev) =>
        prev.map((b) =>
          b.id === item.id && b.isPaper === item.isPaper
            ? {
                ...b,
                likedByMe: res.data.liked,
                likesCount: res.data.likesCount,
              }
            : b,
        ),
      );
    });
  };

  const handleToggleSaveBuild = (item: FeedBuildItem) => {
    const itemType = item.isPaper ? 'paper' : 'project';
    startTransition(async () => {
      const res = await toggleSaveItemAction(itemType, item.id);
      if (!res.ok) {
        showToast(
          res.code === 'UNAUTHORIZED' ? 'Sign in to bookmark builds.' : res.error,
        );
        return;
      }
      setBuilds((prev) =>
        prev.map((b) =>
          b.id === item.id && b.isPaper === item.isPaper
            ? { ...b, savedByMe: res.data.saved }
            : b,
        ),
      );
    });
  };

  const handleToggleSaveJob = (job: JobPostingDTO) => {
    startTransition(async () => {
      const res = await toggleSaveItemAction('job', job.id);
      if (!res.ok) {
        showToast(
          res.code === 'UNAUTHORIZED' ? 'Sign in to save openings.' : res.error,
        );
        return;
      }
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id ? { ...j, savedByMe: res.data.saved } : j,
        ),
      );
    });
  };

  const handleApplyJob = async (input: {
    jobId: string;
    showcaseProjectId?: string | null;
    note: string;
  }): Promise<boolean> => {
    const res = await applyToJobAction(input);
    if (!res.ok) {
      showToast(res.error);
      return false;
    }
    setApplications((prev) => [res.data, ...prev]);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === input.jobId
          ? {
              ...j,
              appliedByMe: true,
              myApplicationStatus: res.data.status,
              applicationsCount: j.applicationsCount + 1,
            }
          : j,
      ),
    );
    showToast(`Application submitted for ${res.data.jobTitle}!`);
    return true;
  };

  const handleRequestCoffeeChat = async (input: {
    alumniUserId: string;
    projectId?: string | null;
    topic: string;
  }): Promise<boolean> => {
    const res = await requestCoffeeChatAction(input);
    if (!res.ok) {
      showToast(res.error);
      return false;
    }
    setCoffeeChats((prev) => [res.data, ...prev]);
    showToast(`Coffee chat request sent to ${res.data.alumniName}!`);
    return true;
  };

  const handleToggleFollow = (targetUserId: string) => {
    startTransition(async () => {
      const res = await toggleFollowUserAction(targetUserId);
      if (!res.ok) {
        showToast(res.error);
        return;
      }
      setDirectory((prev) =>
        prev.map((entry) =>
          entry.user.id === targetUserId
            ? {
                ...entry,
                isFollowedByMe: res.data.following,
                followersCount: res.data.following
                  ? entry.followersCount + 1
                  : Math.max(0, entry.followersCount - 1),
              }
            : entry,
        ),
      );
    });
  };

  const handleMarkNotificationRead = (notificationId: string) => {
    startTransition(async () => {
      const res = await markNotificationReadAction({ notificationId });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n,
          ),
        );
      }
    });
  };

  const handleMarkAllNotificationsRead = () => {
    startTransition(async () => {
      const res = await markAllNotificationsReadAction();
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    });
  };

  const handleQuickPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    try {
      const stack = publishTechStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await publishBuildAction({
        buildType: publishType,
        status: 'published',
        title: publishTitle.trim(),
        subtitle: publishSubtitle.trim(),
        shortDesc: publishSubtitle.trim(),
        story: publishStory.trim(),
        domain: publishDomain,
        techStack: stack,
        academicYears: student.academicYear ?? '3rd Year',
        liveUrl: publishLiveUrl.trim(),
        githubUrl: publishRepoUrl.trim(),
        codeRepoUrl: publishRepoUrl.trim(),
        liveDemoUrl: publishLiveUrl.trim(),
        venue: publishVenue.trim(),
      });

      if (!res.ok) {
        showToast(res.error);
        return;
      }

      setBuilds((prev) => [res.data, ...prev]);
      setPublishOpen(false);
      setPublishTitle('');
      setPublishSubtitle('');
      setPublishStory('');
      setPublishLiveUrl('');
      setPublishRepoUrl('');
      showToast('Published to campus proof-of-work feed!');
      router.refresh();
    } finally {
      setPublishing(false);
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
                  if (hit.kind === 'job') {
                    setActiveTab('jobs');
                  } else {
                    router.push(hit.href);
                  }
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
        portalLabel="Student Studio"
        tabs={[
          { id: 'home', label: 'Feed', icon: <Home className="w-3.5 h-3.5" /> },
          {
            id: 'explore',
            label: 'Mentors',
            icon: <Compass className="w-3.5 h-3.5" />,
          },
          {
            id: 'jobs',
            label: 'Jobs & Deals',
            icon: <Briefcase className="w-3.5 h-3.5" />,
            badge: jobs.filter((j) => j.status === 'open').length,
          },
          {
            id: 'chat',
            label: 'Chat',
            icon: <MessageSquare className="w-3.5 h-3.5" />,
            badge: unreadChatCount,
          },
          {
            id: 'notifications',
            label: 'Alerts',
            icon: <Bell className="w-3.5 h-3.5" />,
            badge: unreadNotificationsCount,
          },
          {
            id: 'profile',
            label: 'Profile',
            icon: <User className="w-3.5 h-3.5" />,
          },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as StudentTab)}
        searchValue={searchQuery}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search students, alumni, builds, jobs..."
        searchDropdown={searchDropdown}
        onSearchFocus={() => setSearchFocused(true)}
        onSearchBlur={() => setTimeout(() => setSearchFocused(false), 180)}
        user={{
          fullName: student.fullName,
          avatarUrl: student.avatarUrl,
          role: student.role,
          verificationStatus: student.verificationStatus,
          subtitle: `${student.academicYear ?? 'ITER'} ${student.branch ?? 'CSE'}`,
        }}
        onProfileClick={() => setActiveTab('profile')}
        onSignOut={handleSignOut}
        switchPersonaHref="/login"
        rightActions={
          <div className="flex items-center gap-2">
            <Link
              href="/share-project"
              className="hidden sm:inline-flex items-center gap-1 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-3 py-1.5 text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5" /> Contribute
            </Link>
            <button
              type="button"
              onClick={() => setPublishOpen(true)}
              className="inline-flex items-center gap-1 rounded-full border border-[#0891B2]/35 dark:border-[#22D3EE]/35 bg-[#0891B2]/10 dark:bg-[#22D3EE]/15 px-3 py-1.5 text-xs font-semibold text-[#0891B2] dark:text-[#22D3EE] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Quick Ship
            </button>
          </div>
        }
      />

      {/* Preview Mode Banner */}
      {isPreviewMode && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-4">
          <div className="rounded-2xl border border-[#0891B2]/35 dark:border-[#22D3EE]/30 bg-[#0891B2]/10 dark:bg-[#22D3EE]/10 px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-bold">Demo Preview Mode:</span> Viewing
              Student Studio as{' '}
              <span className="font-semibold">{student.fullName}</span>. Sign in
              or activate the demo session to persist likes, applications, and
              builds.
            </div>
            <div className="flex items-center gap-2">
              {demoEnabled && (
                <button
                  type="button"
                  onClick={handleActivateStudentDemo}
                  className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-3.5 py-1.5 font-semibold cursor-pointer"
                >
                  Activate {student.fullName} Session
                </button>
              )}
              <Link
                href="/login"
                className="inline-flex items-center gap-1 rounded-full border border-slate-300 dark:border-white/20 px-3.5 py-1.5 font-semibold"
              >
                Switch / Sign In <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'home' && (
          <StudentHomeView
            student={student}
            builds={builds}
            hasMore={hasMore}
            loadingMore={loadingMore}
            applications={applications}
            coffeeChats={coffeeChats}
            onLoadMore={handleLoadMore}
            onInspectBuild={setInspectedBuild}
            onToggleLike={handleToggleLike}
            onToggleSave={handleToggleSaveBuild}
            onOpenQuickPublish={() => setPublishOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'explore' && (
          <StudentExploreView
            directory={directory}
            myProjects={myProjects}
            onToggleFollow={handleToggleFollow}
            onRequestCoffeeChat={handleRequestCoffeeChat}
            onMessageMentor={(alumniName) => {
              setChatTargetName(alumniName);
              setActiveTab('chat');
            }}
          />
        )}

        {activeTab === 'jobs' && (
          <StudentJobsView
            jobs={jobs}
            applications={applications}
            myProjects={myProjects}
            onToggleSaveJob={handleToggleSaveJob}
            onApplyJob={handleApplyJob}
          />
        )}

        {activeTab === 'chat' && (
          <AlumStudentChatSection
            viewerRole="student"
            viewerName={student.fullName}
            currentUserId={student.id}
            initialThreads={initialThreads}
            availablePeers={alumniPeers}
            initialTargetName={chatTargetName}
            initialThreadId={chatThreadId}
          />
        )}

        {activeTab === 'notifications' && (
          <StudentNotificationsView
            notifications={notifications}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onOpenTarget={(section) => {
              if (
                section === 'jobs' ||
                section === 'chat' ||
                section === 'explore' ||
                section === 'profile'
              ) {
                setActiveTab(section);
              } else {
                setActiveTab('home');
              }
            }}
          />
        )}

        {activeTab === 'profile' && (
          <StudentProfileView
            student={student}
            publicProfile={initialPublicProfile}
            coffeeChats={coffeeChats}
          />
        )}
      </main>

      {/* Build Inspection Modal */}
      <BuildCaseStudyModal
        item={inspectedBuild}
        onClose={() => setInspectedBuild(null)}
        onAuthorClick={(authorId) =>
          router.push(`/u/${encodeURIComponent(authorId)}`)
        }
        onAlumClick={(alumId) =>
          router.push(`/u/${encodeURIComponent(alumId)}`)
        }
      />

      {/* Quick Publish Modal */}
      {publishOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPublishOpen(false);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#121620] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-luma-title text-base">
                  Quick Publish Build
                </h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                  Need multi-contributor reg numbers or PDF uploads?{' '}
                  <Link
                    href="/share-project"
                    className="text-[#0891B2] dark:text-[#22D3EE] underline"
                  >
                    Open full studio →
                  </Link>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPublishOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleQuickPublish} className="space-y-3">
              <div className="grid grid-cols-2 gap-1 rounded-xl border border-slate-200 dark:border-white/15 p-1">
                {(['project', 'paper'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPublishType(t)}
                    className={`rounded-lg py-1.5 text-xs font-semibold cursor-pointer ${
                      publishType === t
                        ? 'bg-[#0F172A] text-white dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] dark:text-[#041E24]'
                        : 'text-[#64748B]'
                    }`}
                  >
                    {t === 'project' ? 'Engineering Project' : 'Research Paper'}
                  </button>
                ))}
              </div>

              <input
                type="text"
                required
                minLength={3}
                value={publishTitle}
                onChange={(e) => setPublishTitle(e.target.value)}
                placeholder={
                  publishType === 'project'
                    ? 'Project Title (e.g. Distributed Raft KV Store)'
                    : 'Paper Title'
                }
                className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
              />

              <input
                type="text"
                value={publishSubtitle}
                onChange={(e) => setPublishSubtitle(e.target.value)}
                placeholder="One-line pitch / benchmark summary"
                className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
              />

              <textarea
                rows={3}
                required
                minLength={10}
                value={publishStory}
                onChange={(e) => setPublishStory(e.target.value)}
                placeholder="Architecture, key benchmarks, or abstract (min 10 chars)..."
                className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={publishDomain}
                  onChange={(e) => setPublishDomain(e.target.value)}
                  placeholder="Domain (e.g. Applied AI)"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  value={publishTechStack}
                  onChange={(e) => setPublishTechStack(e.target.value)}
                  placeholder="Tech stack (comma separated)"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="url"
                  value={publishLiveUrl}
                  onChange={(e) => setPublishLiveUrl(e.target.value)}
                  placeholder="Live URL (optional)"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
                />
                <input
                  type="url"
                  value={publishRepoUrl}
                  onChange={(e) => setPublishRepoUrl(e.target.value)}
                  placeholder="GitHub Repo URL (optional)"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
                />
              </div>

              {publishType === 'paper' && (
                <input
                  type="text"
                  value={publishVenue}
                  onChange={(e) => setPublishVenue(e.target.value)}
                  placeholder="Venue (e.g. IEEE / Interspeech)"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#0D1017] px-3 py-2 text-xs"
                />
              )}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setPublishOpen(false)}
                  className="rounded-full border border-slate-300 dark:border-white/20 px-4 py-2 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={publishing}
                  className="rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-5 py-2 text-xs font-semibold cursor-pointer disabled:opacity-60"
                >
                  {publishing ? 'Publishing...' : 'Publish Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Chat Toast */}
      <FloatingChatToast
        viewerRole="student"
        viewerName={student.fullName}
        currentUserId={student.id}
        initialThreads={initialThreads}
        isChatOpen={activeTab === 'chat'}
        onExpandToChat={(threadId) => {
          if (threadId) setChatThreadId(threadId);
          setActiveTab('chat');
        }}
      />

      {/* Action Feedback Toast */}
      {toastMsg && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 rounded-full border border-[#0891B2]/40 bg-[#0F172A] text-white dark:bg-[#14171E] px-5 py-2.5 text-xs font-semibold shadow-xl">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
