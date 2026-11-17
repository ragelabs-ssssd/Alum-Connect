'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  Bell,
  BookOpen,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Compass,
  ExternalLink,
  FileCheck2,
  GitBranch,
  GraduationCap,
  Layers,
  MapPin,
  Megaphone,
  MessageSquare,
  Plus,
  Search,
  Sparkles,
  Star,
  ThumbsUp,
  User,
  UserPlus,
  X,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import {
  ALUMNI_DATA,
  INDIAN_GENERAL_IMAGES,
  OFFERS_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
  STUDENTS_DATA,
  getAlumniEducation,
  getAlumniExperience,
  getIndianAvatar,
  getIndianBanner,
} from '../../data/alumConnectData';
import {
  PeopleDirectoryModal,
  PublicProfileModal,
  SelectedProfileTarget,
  findProfileByName,
} from '../../components/ProfileDirectoryModal';

type AlumSection = 'feed' | 'endorsements' | 'post-job' | 'notifications' | 'profile';

interface TalentCard {
  id: string;
  title: string;
  subtitle: string;
  story: string;
  impactMetric: string;
  author: string;
  batch: string;
  domain: string;
  coverGradient: string;
  coverImage: string;
  authorAvatar: string;
  tags: string[];
  demoUrl: string;
  repoUrl: string;
  isPaper: boolean;
  endorsedByMe: boolean;
  endorsementNote?: string;
  likes: number;
}

interface AlumJobPost {
  id: string;
  role: string;
  company: string;
  type: 'Full-Time' | 'Internship' | 'Paid Bounty';
  location: string;
  compensation: string;
  slots: number;
  lastDate?: string;
  eligibility?: string;
  skills: string[];
  description: string;
}

const COVER_GRADIENTS = [
  'from-zinc-900 via-zinc-800 to-blue-900',
  'from-blue-950 via-indigo-900 to-zinc-900',
  'from-emerald-950 via-zinc-900 to-zinc-800',
  'from-zinc-800 via-slate-900 to-blue-950',
  'from-slate-900 via-blue-950 to-indigo-950',
];

const inferDomain = (stack: string[], pitch: string): string => {
  const hay = `${stack.join(' ')} ${pitch}`.toLowerCase();
  if (hay.includes('fintech') || hay.includes('upi') || hay.includes('equity') || hay.includes('ledger')) {
    return 'Product & FinTech';
  }
  if (hay.includes('langgraph') || hay.includes('whisper') || hay.includes('yolo') || hay.includes('pytorch') || hay.includes('rag') || hay.includes('llm')) {
    return 'Applied AI';
  }
  if (hay.includes('esp') || hay.includes('ebpf') || hay.includes('rust') || hay.includes('arm') || hay.includes('iot') || hay.includes('mqtt')) {
    return 'IoT & Systems';
  }
  return 'Full-Stack & Cloud';
};

const CURRENT_ALUM = ALUMNI_DATA[0]; // Debadatta Rath (ALUM-01)

const INITIAL_TALENT_CARDS: TalentCard[] = [
  ...PROJECTS_DATA.map((p, idx) => {
    const linked = CURRENT_ALUM.linkedProjectIds.includes(p.id);
    const contributors = [p.leadName, ...p.coContributorsNames].join(' & ');
    return {
      id: p.id,
      title: p.name,
      subtitle: p.pitch,
      story: p.detailedDesc,
      impactMetric: p.linkedPaperId
        ? `${p.hostingPlatform} • Linked ${p.linkedPaperId}`
        : `${p.collaborationMode} (${p.teamSize}) • ${p.hostingPlatform}`,
      author: contributors,
      batch: `${p.academicYears} • ITER`,
      domain: inferDomain(p.techStack, p.pitch),
      coverGradient: COVER_GRADIENTS[idx % COVER_GRADIENTS.length],
      coverImage: p.coverImage || INDIAN_GENERAL_IMAGES[idx % 3],
      authorAvatar: getIndianAvatar(p.leadName),
      tags: p.techStack.slice(0, 4),
      demoUrl: p.liveUrl,
      repoUrl: p.githubUrl,
      isPaper: false,
      endorsedByMe: linked,
      endorsementNote: linked
        ? `Endorsed for ${CURRENT_ALUM.mentorshipScope.toLowerCase()} — production-ready architecture.`
        : undefined,
      likes: 42 + ((idx * 13) % 75),
    };
  }),
  ...RESEARCH_PAPERS_DATA.map((rp, idx) => {
    const linked = CURRENT_ALUM.linkedPaperIds.includes(rp.id);
    const authors = rp.coAuthorName
      ? `${rp.leadAuthorName} & ${rp.coAuthorName}`
      : rp.leadAuthorName;
    return {
      id: rp.id,
      title: rp.topic,
      subtitle: `Research Paper • ${rp.venue} (${rp.status})`,
      story: rp.abstract,
      impactMetric: `${rp.status} • ${rp.venue}`,
      author: authors,
      batch: `${rp.leadAuthorYearBranch} • ITER`,
      domain: 'Research Papers',
      coverGradient: COVER_GRADIENTS[(idx + 2) % COVER_GRADIENTS.length],
      coverImage: rp.coverImage,
      authorAvatar: getIndianAvatar(rp.leadAuthorName),
      tags: ['Research Paper', rp.domain, ...rp.techStack.slice(0, 2)],
      demoUrl: rp.preprintUrl,
      repoUrl: rp.codeRepoUrl,
      isPaper: true,
      endorsedByMe: linked,
      endorsementNote: linked ? `Reviewed for ${rp.venue} methodology & evals.` : undefined,
      likes: 68 + idx * 11,
    };
  }),
];

const INITIAL_ALUM_JOBS: AlumJobPost[] = ALUMNI_DATA.filter((a) => a.canPostJobs).map((a, idx) => {
  const offer = OFFERS_DATA.find((o) => o.referringAlumniId === a.id);
  return {
    id: `aj-${a.id.toLowerCase()}`,
    role: offer ? offer.jobRole : `${a.mentorshipScope.split(',')[0]} Engineer`,
    company: a.company,
    type: offer?.offerType === 'Internship' ? 'Internship' : idx % 3 === 2 ? 'Paid Bounty' : 'Full-Time',
    location: idx % 2 === 0 ? 'Bangalore (Hybrid)' : 'Hyderabad / Remote',
    compensation: offer ? offer.packageStr : '₹24 – 32 LPA',
    slots: a.activeJobOpeningsCount || 2,
    skills: a.techStackExpertise.slice(0, 4),
    description: `Posted by ${a.fullName} (${a.designation}). Direct ITER alumni referral track.`,
  };
});

const INITIAL_ALUM_NOTIFICATIONS = [
  {
    id: 'an-1',
    category: 'Referrals',
    title: 'Aarav Mohanty requested a FinAudit review (PRJ-01)',
    message: '4th Year CSE • 9.42 CGPA • SIH 2024 Grand Winner linked live LangGraph demo + RP-01.',
    time: '15m ago',
    unread: true,
    target: 'feed' as AlumSection,
    action: 'Inspect Build',
  },
  {
    id: 'an-2',
    category: 'Papers',
    title: 'RP-02 Post-Quantum Cryptography needs peer review',
    message: 'Rohan Patnaik & Sneha Mishra submitted ACM CCS draft for alumni feedback.',
    time: '1h ago',
    unread: true,
    target: 'endorsements' as AlumSection,
    action: 'Review Paper',
  },
  {
    id: 'an-3',
    category: 'Coffee Chats',
    title: 'Siddharth Nayak requested 15m Cloud Systems chat',
    message: '3rd Year CSE • CampusFed GPU Mesh (PRJ-03) • AWS Certified Solutions Architect.',
    time: '3h ago',
    unread: true,
    target: 'feed' as AlumSection,
    action: 'View Student',
  },
  {
    id: 'an-4',
    category: 'Placements',
    title: '6 PPOs & 4 Internships verified across ITER cohort',
    message: 'HyperScale Labs, Google, Microsoft, Razorpay, AWS & Adobe offers confirmed.',
    time: '1d ago',
    unread: false,
    target: 'post-job' as AlumSection,
    action: 'View Summary',
  },
];

export default function AlumniFeedPage() {
  const [section, setSection] = useState<AlumSection>('feed');
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchScope, setSearchScope] = useState<'all' | 'students' | 'alumni'>('all');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [cards, setCards] = useState<TalentCard[]>(INITIAL_TALENT_CARDS);
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});
  const [acceptedChats, setAcceptedChats] = useState<Record<string, boolean>>({});
  const [showAllRequests, setShowAllRequests] = useState(false);

  const [jobs, setJobs] = useState<AlumJobPost[]>(INITIAL_ALUM_JOBS);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState(CURRENT_ALUM.company);
  const [jobLocation, setJobLocation] = useState('Bangalore (Hybrid)');
  const [jobComp, setJobComp] = useState('₹24 – 30 LPA');
  const [jobType, setJobType] = useState<'Full-Time' | 'Internship' | 'Paid Bounty'>('Full-Time');
  const [jobLastDate, setJobLastDate] = useState('2026-12-10');
  const [jobSlots, setJobSlots] = useState('3');
  const [jobEligibility, setJobEligibility] = useState('2025 / 2026 Batch • 7.5+ CGPA');
  const [jobSkills, setJobSkills] = useState('Python, Rust, Distributed Systems');
  const [jobJD, setJobJD] = useState('');

  const [notifications, setNotifications] = useState(INITIAL_ALUM_NOTIFICATIONS);
  const [caseStudyItem, setCaseStudyItem] = useState<TalentCard | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<SelectedProfileTarget | null>(null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const toggleFollow = (id: string, name: string) => {
    setFollowedIds((prev) => {
      const next = !prev[id];
      notify(next ? `Following ${name}` : `Unfollowed ${name}`);
      return { ...prev, [id]: next };
    });
  };

  const openProfileByName = (name: string) => {
    const found = findProfileByName(name);
    if (found) {
      setSelectedProfile(found);
    } else {
      notify(`Profile for ${name} not found.`);
    }
  };

  const toggleEndorse = (card: TalentCard) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === card.id
          ? {
              ...c,
              endorsedByMe: !c.endorsedByMe,
              endorsementNote: !c.endorsedByMe
                ? `Endorsed by ${CURRENT_ALUM.fullName} (${CURRENT_ALUM.company}) for production readiness.`
                : undefined,
            }
          : c
      )
    );
    notify(
      card.endorsedByMe
        ? `Removed endorsement on ${card.title}`
        : `Endorsed "${card.title}" — now visible on Student Feed!`
    );
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim()) return;
    const created: AlumJobPost = {
      id: `aj-${Date.now()}`,
      role: jobTitle.trim(),
      company: jobCompany.trim() || CURRENT_ALUM.company,
      type: jobType,
      location: jobLocation.trim() || 'Bangalore (Hybrid)',
      compensation: jobComp.trim() || 'Competitive',
      slots: Math.max(1, parseInt(jobSlots, 10) || 3),
      lastDate: jobLastDate || undefined,
      eligibility: jobEligibility.trim() || undefined,
      skills: jobSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      description:
        jobJD.trim() ||
        `Posted by ${CURRENT_ALUM.fullName} (${CURRENT_ALUM.designation}). Direct ITER referral track.`,
    };
    setJobs((prev) => [created, ...prev]);
    setJobTitle('');
    setJobJD('');
    setJobModalOpen(false);
    setSection('post-job');
    notify(`Published "${created.role}" at ${created.company} to Student Jobs!`);
  };

  const quickPeopleMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rankName = (name: string) => {
      if (!q) return 2;
      const lower = name.toLowerCase();
      if (lower.startsWith(q)) return 0;
      if (lower.includes(q)) return 1;
      return 2;
    };
    const students =
      searchScope === 'alumni'
        ? []
        : STUDENTS_DATA.filter((s) =>
            !q
              ? true
              : `${s.fullName} ${s.branch} ${s.academicYear} ${s.regNo} ${s.techStack.join(' ')}`
                  .toLowerCase()
                  .includes(q)
          )
            .sort((a, b) => rankName(a.fullName) - rankName(b.fullName))
            .slice(0, searchScope === 'students' ? 6 : 4)
            .map((student) => ({ kind: 'student' as const, student }));
    const alumni =
      searchScope === 'students'
        ? []
        : ALUMNI_DATA.filter((a) =>
            !q
              ? true
              : `${a.fullName} ${a.company} ${a.designation} ${a.techStackExpertise.join(' ')}`
                  .toLowerCase()
                  .includes(q)
          )
            .sort((a, b) => rankName(a.fullName) - rankName(b.fullName))
            .slice(0, searchScope === 'alumni' ? 6 : 4)
            .map((alumni) => ({ kind: 'alumni' as const, alumni }));
    return [...students, ...alumni].slice(0, 6);
  }, [search, searchScope]);

  const quickBuildMatches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return cards
      .filter((b) =>
        `${b.title} ${b.subtitle} ${b.author} ${b.tags.join(' ')}`.toLowerCase().includes(q)
      )
      .slice(0, 3);
  }, [search, cards]);

  const renderHighlighted = (text: string) => {
    const q = search.trim();
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="text-[#2563EB] dark:text-sky-400 underline decoration-[#2563EB]/40">
          {text.slice(idx, idx + q.length)}
        </span>
        {text.slice(idx + q.length)}
      </>
    );
  };

  const domains = ['All', 'Research Papers', 'Product & FinTech', 'Applied AI', 'IoT & Systems', 'Full-Stack & Cloud'];

  const visibleCards = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cards.filter((c) => {
      if (selectedDomain !== 'All' && c.domain !== selectedDomain) return false;
      if (!q) return true;
      return `${c.title} ${c.subtitle} ${c.story} ${c.author} ${c.tags.join(' ')}`
        .toLowerCase()
        .includes(q);
    });
  }, [cards, selectedDomain, search]);

  const endorsedCards = useMemo(() => cards.filter((c) => c.endorsedByMe), [cards]);
  const alumExperiences = getAlumniExperience(CURRENT_ALUM);
  const alumEducations = getAlumniEducation(CURRENT_ALUM);

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#09090B] text-[#09090B] dark:text-zinc-100 transition-colors">
      {/* ==================== STICKY TOP NAVBAR (MATCHES STUDENT FEED) ==================== */}
      <header className="sticky top-0 z-40 border-b border-[#E4E4E7] dark:border-zinc-800 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-15 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center gap-3">
          {/* 1. Logo + 2. LinkedIn-style Global Search */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center shrink-0" aria-label="Alum Connect Home">
              <div className="h-9 w-9 rounded-lg bg-[#F4F4F5] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 flex items-center justify-center p-1 overflow-hidden">
                <img src="/logo.png" alt="Alum Connect" className="h-full w-full object-contain dark:invert" />
              </div>
            </Link>

            <div className="relative hidden md:block w-56 lg:w-64">
              <Search className="w-3.5 h-3.5 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 180)}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSearchFocused(true);
                }}
                placeholder="Search people, projects, skills..."
                className="w-full rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 pl-8 pr-7 py-1.5 text-xs focus:outline-none focus:border-[#2563EB]"
              />
              {search && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setSearch('');
                  }}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#18181B]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
              {searchFocused && (
                <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl p-2.5 z-50 space-y-2">
                  <div className="flex items-center justify-between gap-1 px-1 pb-1.5 border-b border-[#E4E4E7] dark:border-zinc-800">
                    <div className="flex items-center gap-1">
                      {(
                        [
                          { id: 'all', label: 'All' },
                          { id: 'students', label: 'Students' },
                          { id: 'alumni', label: 'Alumni' },
                        ] as const
                      ).map((chip) => (
                        <button
                          key={chip.id}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchScope(chip.id);
                          }}
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors ${
                            searchScope === chip.id
                              ? 'bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950'
                              : 'bg-[#F4F4F5] dark:bg-zinc-800 text-[#52525B] dark:text-zinc-300'
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-[#52525B]">
                      {STUDENTS_DATA.length + ALUMNI_DATA.length} Profiles
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                      {search.trim() ? 'People Matching Name / Skill' : 'Suggested Students & Alumni'}
                    </div>
                    {quickPeopleMatches.length === 0 ? (
                      <div className="px-2 py-2 text-xs text-[#52525B]">
                        No people matched &ldquo;{search}&rdquo;
                      </div>
                    ) : (
                      quickPeopleMatches.map((item) => {
                        const name =
                          item.kind === 'student' ? item.student.fullName : item.alumni.fullName;
                        const sub =
                          item.kind === 'student'
                            ? `${item.student.academicYear} ${item.student.branch} • ${item.student.totalProjectsCount} Projects`
                            : `${item.alumni.designation} @ ${item.alumni.company}`;
                        const key = item.kind === 'student' ? item.student.id : item.alumni.id;
                        return (
                          <button
                            key={key}
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSelectedProfile(item);
                              setSearchFocused(false);
                            }}
                            className="w-full flex items-center gap-2.5 rounded-xl px-2 py-1.5 text-left hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 transition-colors"
                          >
                            <img
                              src={getIndianAvatar(name)}
                              alt={name}
                              className="h-8 w-8 rounded-full object-cover shrink-0 border border-[#E4E4E7] dark:border-zinc-700"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold truncate">
                                {renderHighlighted(name)}
                              </div>
                              <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                                {sub}
                              </div>
                            </div>
                            <span className="shrink-0 rounded-full bg-blue-50 dark:bg-sky-500/10 text-[#2563EB] px-2 py-0.5 text-[9px] font-bold">
                              {item.kind === 'alumni' ? 'Alum' : 'Student'}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>

                  {quickBuildMatches.length > 0 && (
                    <div className="space-y-0.5 pt-1 border-t border-[#E4E4E7] dark:border-zinc-800">
                      <div className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                        Projects &amp; Papers
                      </div>
                      {quickBuildMatches.map((b) => (
                        <button
                          key={b.id}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setCaseStudyItem(b);
                            setSearchFocused(false);
                          }}
                          className="w-full flex items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-left hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 transition-colors"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate">
                              {renderHighlighted(b.title)}
                            </div>
                            <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                              By {b.author} • {b.domain}
                            </div>
                          </div>
                          <ArrowUpRight className="w-3.5 h-3.5 shrink-0 text-[#52525B]" />
                        </button>
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
                    className="w-full rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 py-1.5 text-[11px] font-semibold text-[#2563EB] text-center"
                  >
                    See all results in Network Directory →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. 5-Tab Bar (Talent Feed | Endorsements | Post Job | Notifications | My Profile) */}
          <nav
            aria-label="Alumni workspace sections"
            className="hidden lg:flex items-center justify-self-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-1"
          >
            {[
              { id: 'feed' as AlumSection, label: 'Talent Feed', icon: <Compass className="w-3.5 h-3.5" /> },
              { id: 'endorsements' as AlumSection, label: 'My Endorsements', icon: <Award className="w-3.5 h-3.5" /> },
              { id: 'post-job' as AlumSection, label: 'Post Job & Offers', icon: <Briefcase className="w-3.5 h-3.5" /> },
              {
                id: 'notifications' as AlumSection,
                label: 'Notifications',
                icon: <Bell className="w-3.5 h-3.5" />,
                badge: notifications.filter((n) => n.unread).length,
              },
              { id: 'profile' as AlumSection, label: 'My Profile', icon: <User className="w-3.5 h-3.5" /> },
            ].map((tab) => {
              const active = section === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSection(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs'
                      : 'text-[#52525B] dark:text-zinc-400 hover:text-[#09090B] dark:hover:text-white'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span className="rounded-full px-1.5 py-0.2 text-[10px] font-bold bg-[#2563EB] text-white">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 4. People + Post Opening + ThemeToggle */}
          <div className="flex items-center gap-2 shrink-0 lg:justify-self-end">
            <button
              type="button"
              onClick={() => setDirectoryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#2563EB] px-3 py-1.5 text-xs font-semibold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="hidden sm:inline">People</span>
            </button>
            {section === 'feed' && (
              <button
                type="button"
                onClick={() => setJobModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-white px-3.5 py-1.5 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Post Opening</span>
              </button>
            )}
            <ThemeToggle compact />
          </div>
        </div>

        {/* Mobile / Tablet 5-Tab Subbar */}
        <div className="lg:hidden border-t border-[#E4E4E7] dark:border-zinc-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'feed' as AlumSection, label: 'Talent Feed' },
            { id: 'endorsements' as AlumSection, label: 'My Endorsements' },
            { id: 'post-job' as AlumSection, label: 'Post Job & Offers' },
            { id: 'notifications' as AlumSection, label: `Notifications (${notifications.filter((n) => n.unread).length})` },
            { id: 'profile' as AlumSection, label: 'My Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                section === tab.id
                  ? 'bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950'
                  : 'bg-[#F4F4F5] dark:bg-zinc-900 text-[#52525B] dark:text-zinc-400'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ==================== MAIN 3-COLUMN SHELL ==================== */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT RAIL (Hidden on My Profile tab so main profile expands) */}
        {section !== 'profile' && (
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {section === 'feed' && (
              <>
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
                  className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs cursor-pointer hover:border-[#2563EB] transition-colors"
                >
                  <div className="relative h-16 overflow-hidden bg-gradient-to-r from-[#09090B] via-slate-800 to-[#2563EB]">
                    <img
                      src={getIndianBanner(1)}
                      alt="Alumni banner"
                      className="h-full w-full object-cover opacity-45"
                    />
                  </div>
                  <div className="px-5 pb-5 -mt-8 space-y-3 relative z-10">
                    <img
                      src={getIndianAvatar(CURRENT_ALUM.fullName)}
                      alt={CURRENT_ALUM.fullName}
                      className="h-14 w-14 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-xs bg-[#18181B]"
                    />
                    <div className="space-y-0.5">
                      <h2 className="text-sm font-bold">{CURRENT_ALUM.fullName}</h2>
                      <p className="text-xs text-[#52525B] dark:text-zinc-400">
                        {CURRENT_ALUM.designation} @ {CURRENT_ALUM.company} • &apos;{String(CURRENT_ALUM.batchYear).slice(-2)}
                      </p>
                      <p className="text-xs text-[#09090B] dark:text-zinc-200 pt-0.5">
                        {CURRENT_ALUM.mentorshipScope}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-3 grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="rounded-lg bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 p-2">
                        <div className="text-sm font-bold text-[#2563EB]">{endorsedCards.length}</div>
                        <div className="text-[10px] text-[#52525B]">Endorsed</div>
                      </div>
                      <div className="rounded-lg bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 p-2">
                        <div className="text-sm font-bold">{CURRENT_ALUM.activeJobOpeningsCount}</div>
                        <div className="text-[10px] text-[#52525B]">Open Roles</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-[#2563EB]" />
                    Shortlisted Builds ({Object.values(savedIds).filter(Boolean).length})
                  </h3>
                  {cards.filter((c) => savedIds[c.id]).length === 0 ? (
                    <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
                      Bookmark any student project or paper to shortlist candidates here.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {cards
                        .filter((c) => savedIds[c.id])
                        .map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setCaseStudyItem(c)}
                            className="w-full text-left rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-2.5 hover:border-[#2563EB] border border-transparent transition-colors"
                          >
                            <div className="text-xs font-semibold truncate">{c.title}</div>
                            <div className="text-[10px] text-[#52525B] truncate">By {c.author}</div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {section === 'endorsements' && (
              <>
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                    Papers Awaiting Review
                  </h3>
                  {RESEARCH_PAPERS_DATA.slice(0, 3).map((rp) => (
                    <div
                      key={rp.id}
                      className="rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-3 space-y-1 text-xs"
                    >
                      <div className="font-bold truncate">{rp.topic}</div>
                      <div className="text-[10px] text-[#52525B]">
                        {rp.leadAuthorName} • {rp.venue}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {section === 'post-job' && (
              <>
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    Network Hiring Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-2.5">
                      <div className="text-base font-bold text-[#2563EB]">32</div>
                      <div className="text-[10px] text-[#52525B]">Direct Openings</div>
                    </div>
                    <div className="rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-2.5">
                      <div className="text-base font-bold text-emerald-600">{OFFERS_DATA.length}</div>
                      <div className="text-[10px] text-[#52525B]">Confirmed Offers</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                    Recent Verified Offers
                  </h3>
                  {OFFERS_DATA.slice(0, 4).map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => openProfileByName(o.studentName)}
                      className="w-full text-left rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-2.5 flex items-center justify-between gap-2 text-xs hover:border-[#2563EB] border border-transparent"
                    >
                      <div className="min-w-0">
                        <div className="font-bold truncate">{o.studentName}</div>
                        <div className="text-[10px] text-[#52525B] truncate">{o.company}</div>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                        {o.packageStr}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {section === 'notifications' && (
              <>
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <Megaphone className="w-3.5 h-3.5 text-[#2563EB]" />
                    ITER Placement Notices
                  </h3>
                  <div className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-3 text-xs space-y-0.5">
                    <div className="font-bold">Alumni Townhall • Nov 22</div>
                    <div className="text-[10px] text-[#52525B]">ITER Auditorium + Live Stream</div>
                  </div>
                </div>
              </>
            )}
          </aside>
        )}

        {/* CENTER STAGE */}
        <main className={section === 'profile' ? 'lg:col-span-9 space-y-5' : 'lg:col-span-6 space-y-5'}>
          {section === 'feed' && (
            <>
              {/* Hero Card */}
              <div className="rounded-3xl bg-[#111318] text-white p-6 sm:p-7 space-y-4 shadow-md border border-zinc-800">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] font-semibold text-sky-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  Alumni Talent &amp; Proof-of-Work Feed
                </span>
                <h1 className="text-xl sm:text-2xl font-bold leading-snug">
                  Discover {PROJECTS_DATA.length} live student builds &amp; {RESEARCH_PAPERS_DATA.length} research papers across ITER.
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                  Endorse engineering craft, review research preprints, and fast-track high-signal students straight to your team&apos;s interview loop.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setSection('post-job')}
                    className="rounded-full bg-[#2563EB] hover:bg-blue-500 text-white px-5 py-2 text-xs font-semibold transition-colors"
                  >
                    Post Referral Opening
                  </button>
                  <button
                    type="button"
                    onClick={() => setDirectoryOpen(true)}
                    className="rounded-full border border-white/25 hover:bg-white/10 text-white px-5 py-2 text-xs font-semibold transition-colors"
                  >
                    Browse All {STUDENTS_DATA.length} Students →
                  </button>
                </div>
              </div>

              {/* Domain Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {domains.map((dom) => (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => setSelectedDomain(dom)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      selectedDomain === dom
                        ? 'bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950'
                        : 'bg-[#F4F4F5] dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 text-[#52525B] dark:text-zinc-400'
                    }`}
                  >
                    {dom}
                  </button>
                ))}
              </div>

              {/* Talent Cards */}
              <div className="space-y-4">
                {visibleCards.map((card) => {
                  const isSaved = !!savedIds[card.id];
                  return (
                    <article
                      key={card.id}
                      className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs hover:shadow-md transition-all"
                    >
                      <div
                        className={`relative overflow-hidden bg-gradient-to-br ${card.coverGradient} p-5 text-white flex flex-col justify-between min-h-[144px]`}
                      >
                        <img
                          src={card.coverImage}
                          alt={card.title}
                          className="absolute inset-0 h-full w-full object-cover opacity-30"
                        />
                        <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                          <span className="rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 font-medium">
                            {card.domain}
                          </span>
                          <span className="rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[11px] font-semibold">
                            {card.impactMetric}
                          </span>
                        </div>
                        <div className="relative z-10 pt-4 flex items-end justify-between gap-3">
                          <div>
                            <h2 className="text-lg font-bold leading-tight">{card.title}</h2>
                            <p className="text-xs text-white/80 mt-0.5">{card.subtitle}</p>
                          </div>
                          <a
                            href={card.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white text-[#09090B] px-3 py-1.5 text-[11px] font-bold hover:bg-zinc-100"
                          >
                            Live Preview <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => openProfileByName(card.author)}
                            className="flex items-center gap-2.5 text-xs min-w-0 text-left hover:text-[#2563EB] transition-colors"
                          >
                            <img
                              src={card.authorAvatar}
                              alt={card.author}
                              className="h-7 w-7 rounded-full object-cover border border-[#E4E4E7] dark:border-zinc-700 shrink-0"
                            />
                            <div className="truncate">
                              <span className="font-bold hover:underline">{card.author}</span>{' '}
                              <span className="text-[#52525B] dark:text-zinc-400">• {card.batch}</span>
                            </div>
                          </button>
                          {card.endorsedByMe && (
                            <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[11px] font-semibold">
                              Endorsed ✓
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-300 leading-relaxed">
                          {card.story}
                        </p>

                        {card.endorsementNote && (
                          <div className="rounded-2xl bg-[#F4F4F5] dark:bg-zinc-800/80 border border-[#E4E4E7] dark:border-zinc-700 p-3 text-xs">
                            <span className="font-bold text-[#2563EB]">Your Endorsement: </span>
                            {card.endorsementNote}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1.5">
                            {card.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 px-2.5 py-0.5 text-[11px] font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          <a
                            href={card.repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#52525B] hover:text-[#2563EB]"
                          >
                            <GitBranch className="w-3 h-3" /> Source
                          </a>
                        </div>

                        <div className="pt-3 border-t border-[#E4E4E7] dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleEndorse(card)}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-semibold transition-colors ${
                                card.endorsedByMe
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                  : 'border-[#E4E4E7] dark:border-zinc-700 bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950'
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              {card.endorsedByMe ? 'Endorsed ✓' : 'Endorse Build'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setSavedIds((p) => ({ ...p, [card.id]: !p[card.id] }))}
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-semibold transition-colors ${
                                isSaved
                                  ? 'border-[#2563EB] bg-blue-50 dark:bg-sky-500/10 text-[#2563EB]'
                                  : 'border-[#E4E4E7] dark:border-zinc-700 text-[#52525B]'
                              }`}
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              {isSaved ? 'Shortlisted' : 'Shortlist'}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => setCaseStudyItem(card)}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB] hover:underline"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Inspect Case Study →
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {section === 'endorsements' && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-6 space-y-1">
                <h1 className="text-lg font-bold">My Endorsed Builds &amp; Papers ({endorsedCards.length})</h1>
                <p className="text-xs text-[#52525B] dark:text-zinc-400">
                  Every endorsement you issue appears on the Student Feed and boosts referral readiness.
                </p>
              </div>
              {endorsedCards.map((c) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-[#2563EB]">{c.domain}</span>
                    <button
                      type="button"
                      onClick={() => openProfileByName(c.author)}
                      className="text-xs font-semibold hover:text-[#2563EB]"
                    >
                      By {c.author} →
                    </button>
                  </div>
                  <h2 className="text-base font-bold">{c.title}</h2>
                  <p className="text-xs text-[#52525B] dark:text-zinc-400">{c.subtitle}</p>
                </div>
              ))}
            </div>
          )}

          {section === 'post-job' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-sm font-bold">Post a Detailed Alumni Opening</h1>
                  <p className="text-xs text-[#52525B] dark:text-zinc-400">
                    Add Job Title, full JD, Last Date to apply, CGPA/Batch eligibility &amp; Referral Slots.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setJobModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Create Opening
                </button>
              </div>

              <div className="space-y-3">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-bold text-[#2563EB]">{job.company} • {job.type}</div>
                        <h3 className="text-sm font-bold">{job.role}</h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">{job.compensation}</span>
                    </div>
                    <p className="text-xs text-[#52525B] dark:text-zinc-400">{job.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#52525B] dark:text-zinc-400">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {job.location}
                      </span>
                      <span>• {job.slots} referral slots</span>
                      {job.lastDate && <span>• Last Date: <strong>{job.lastDate}</strong></span>}
                      {job.eligibility && <span>• {job.eligibility}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.map((s) => (
                        <span key={s} className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'notifications' && (
            <div className="space-y-3">
              <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-5 flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold">Alumni Notifications</h1>
                  <p className="text-xs text-[#52525B]">Referral requests, paper reviews &amp; student chat bookings.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Mark all read
                </button>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`rounded-2xl border p-4 space-y-1.5 ${
                    n.unread
                      ? 'border-[#2563EB]/40 bg-blue-50/40 dark:bg-sky-500/5'
                      : 'border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#2563EB]">{n.category}</span>
                    <span className="text-[#52525B]">{n.time}</span>
                  </div>
                  <div className="text-sm font-bold">{n.title}</div>
                  <p className="text-xs text-[#52525B] dark:text-zinc-400">{n.message}</p>
                </div>
              ))}
            </div>
          )}

          {section === 'profile' && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="relative h-28 overflow-hidden bg-gradient-to-r from-[#09090B] via-slate-800 to-[#2563EB]">
                  <img
                    src={getIndianBanner(1)}
                    alt="Alumni profile banner"
                    className="h-full w-full object-cover opacity-45"
                  />
                </div>
                <div className="px-6 pb-6 -mt-10 space-y-4 relative z-10">
                  <img
                    src={getIndianAvatar(CURRENT_ALUM.fullName)}
                    alt={CURRENT_ALUM.fullName}
                    className="h-20 w-20 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-sm bg-[#18181B]"
                  />
                  <div>
                    <h1 className="text-xl font-bold">{CURRENT_ALUM.fullName}</h1>
                    <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-400">
                      {CURRENT_ALUM.designation} @ {CURRENT_ALUM.company} • Batch &apos;{String(CURRENT_ALUM.batchYear).slice(-2)} (ITER, SOA)
                    </p>
                    <p className="text-xs text-[#52525B] dark:text-zinc-300 mt-2">
                      Mentorship Scope: {CURRENT_ALUM.mentorshipScope}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CURRENT_ALUM.techStackExpertise.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 px-3 py-1 text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#2563EB]" />
                    Work Experience
                  </h2>
                  <div className="space-y-3">
                    {alumExperiences.map((exp) => (
                      <div key={exp.company} className="border-l-2 border-[#2563EB]/40 pl-3 space-y-0.5 text-xs">
                        <div className="font-bold">{exp.role}</div>
                        <div className="text-[11px] text-[#52525B]">{exp.company} • {exp.period}</div>
                        <p className="text-[11px] text-[#52525B]">{exp.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
                    Education Qualifications
                  </h2>
                  <div className="space-y-3">
                    {alumEducations.map((edu) => (
                      <div key={edu.degree} className="border-l-2 border-emerald-500/40 pl-3 space-y-0.5 text-xs">
                        <div className="font-bold">{edu.degree}</div>
                        <div className="text-[11px] text-[#52525B]">{edu.institution} • {edu.period}</div>
                        <p className="text-[11px] text-[#52525B]">{edu.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT RAIL */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {section === 'profile' ? (
            <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-gradient-to-b from-[#09090B] via-[#111827] to-[#1E293B] text-white p-4 space-y-3 shadow-2xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[10px] font-semibold text-sky-300">
                <Award className="w-3 h-3" />
                Alumni Impact
              </span>
              <h4 className="text-sm font-bold leading-snug">
                Mentor ITER&apos;s top 31 builders &amp; fast-track verified talent.
              </h4>
              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSection('post-job')}
                  className="w-full rounded-full bg-[#2563EB] hover:bg-blue-500 text-white py-2 text-xs font-semibold"
                >
                  Post Referral Opening
                </button>
                <button
                  type="button"
                  onClick={() => setDirectoryOpen(true)}
                  className="w-full rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white py-1.5 text-xs font-semibold"
                >
                  Browse Student Profiles →
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Student Coffee Chat Requests (2 by default + See all) */}
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                    Student Chat Requests
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowAllRequests((p) => !p)}
                    className="text-[11px] font-semibold text-[#2563EB] hover:underline"
                  >
                    {showAllRequests ? 'Show less' : 'See all'}
                  </button>
                </div>
                <div className="space-y-2.5">
                  {STUDENTS_DATA.slice(0, showAllRequests ? 8 : 2).map((st) => {
                    const accepted = !!acceptedChats[st.id];
                    return (
                      <div
                        key={st.id}
                        className="rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-3 space-y-1.5"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedProfile({ kind: 'student', student: st })}
                          className="flex items-center gap-2.5 w-full text-left hover:text-[#2563EB] transition-colors"
                        >
                          <img
                            src={getIndianAvatar(st.fullName)}
                            alt={st.fullName}
                            className="h-8 w-8 rounded-full object-cover border border-[#E4E4E7] dark:border-zinc-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold truncate hover:underline">{st.fullName}</div>
                            <div className="text-[11px] text-[#52525B] truncate">
                              {st.academicYear} {st.branch} • {st.totalProjectsCount} Projects
                            </div>
                          </div>
                        </button>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-[#52525B]">15m Portfolio Review</span>
                          <button
                            type="button"
                            disabled={accepted}
                            onClick={() => {
                              setAcceptedChats((p) => ({ ...p, [st.id]: true }));
                              notify(`Accepted 15-min coffee chat with ${st.fullName}!`);
                            }}
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                              accepted
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950'
                            }`}
                          >
                            {accepted ? 'Accepted ✓' : 'Accept 15m'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top ITER Builders */}
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                    Top ITER Builders
                  </h3>
                  <button
                    type="button"
                    onClick={() => setDirectoryOpen(true)}
                    className="text-[11px] font-semibold text-[#2563EB] hover:underline"
                  >
                    See all
                  </button>
                </div>
                {STUDENTS_DATA.slice(0, 3).map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedProfile({ kind: 'student', student: st })}
                    className="w-full text-left rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-2.5 flex items-center gap-2.5 hover:border-[#2563EB] border border-transparent transition-colors"
                  >
                    <img
                      src={getIndianAvatar(st.fullName)}
                      alt={st.fullName}
                      className="h-7 w-7 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{st.fullName}</div>
                      <div className="text-[10px] text-[#52525B] truncate">
                        {st.academicYear} {st.branch} • {st.projectIds[0]}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>

      {/* CASE STUDY MODAL */}
      {caseStudyItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-[#2563EB]">{caseStudyItem.domain}</span>
                <h3 className="text-lg font-bold">{caseStudyItem.title}</h3>
                <p className="text-xs text-[#52525B] dark:text-zinc-400">
                  By {caseStudyItem.author} • {caseStudyItem.batch}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCaseStudyItem(null)}
                className="rounded-lg border border-[#E4E4E7] dark:border-zinc-700 p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-[#52525B] dark:text-zinc-300 leading-relaxed">
              {caseStudyItem.story}
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <a
                href={caseStudyItem.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2 text-xs font-semibold"
              >
                Open Live Demo <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a
                href={caseStudyItem.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-2 text-xs font-semibold"
              >
                <Layers className="w-3.5 h-3.5" /> View Codebase
              </a>
            </div>
          </div>
        </div>
      )}

      {/* PUBLIC PROFILE MODAL */}
      {selectedProfile && (
        <PublicProfileModal
          target={selectedProfile}
          followedIds={followedIds}
          onToggleFollow={toggleFollow}
          onSelectProfile={(next) => setSelectedProfile(next)}
          onOpenProject={(projectId) => {
            const match = cards.find((c) => c.id === projectId);
            if (match) setCaseStudyItem(match);
          }}
          onGoToJobs={() => setSection('post-job')}
          onNotify={notify}
          onClose={() => setSelectedProfile(null)}
        />
      )}

      {/* NETWORK DIRECTORY MODAL */}
      {directoryOpen && (
        <PeopleDirectoryModal
          initialQuery={search}
          followedIds={followedIds}
          onToggleFollow={toggleFollow}
          onSelectProfile={(next) => setSelectedProfile(next)}
          onClose={() => setDirectoryOpen(false)}
        />
      )}

      {/* CREATE DETAILED JOB OPENING MODAL (OPTION 7) */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handlePostJob}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Create Detailed Alumni Opening</h3>
                <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
                  Published directly to ITER Student Jobs &amp; Referral Tracker
                </p>
              </div>
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                className="rounded-lg border border-[#E4E4E7] dark:border-zinc-700 p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B]">Job Title *</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Backend Systems Engineer"
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B]">Company *</label>
                <input
                  type="text"
                  required
                  value={jobCompany}
                  onChange={(e) => setJobCompany(e.target.value)}
                  placeholder="Company Name"
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B]">Role Type</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as 'Full-Time' | 'Internship' | 'Paid Bounty')}
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Paid Bounty">Paid Bounty</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B]">Location / Work Mode</label>
                <input
                  type="text"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  placeholder="e.g. Bangalore (Hybrid) / Remote"
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B]">Compensation / Stipend</label>
                <input
                  type="text"
                  value={jobComp}
                  onChange={(e) => setJobComp(e.target.value)}
                  placeholder="e.g. ₹24 – 30 LPA or ₹65k/mo"
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B]">Last Date to Apply</label>
                <input
                  type="date"
                  value={jobLastDate}
                  onChange={(e) => setJobLastDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B]">Eligible Batch &amp; Min CGPA</label>
                <input
                  type="text"
                  value={jobEligibility}
                  onChange={(e) => setJobEligibility(e.target.value)}
                  placeholder="e.g. 2025 / 2026 • 7.5+ CGPA"
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#52525B]">Referral Slots</label>
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={jobSlots}
                  onChange={(e) => setJobSlots(e.target.value)}
                  className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#52525B]">Required Tech Stack (comma-separated)</label>
              <input
                type="text"
                value={jobSkills}
                onChange={(e) => setJobSkills(e.target.value)}
                className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#52525B]">Full Job Description (JD) &amp; Interview Rounds *</label>
              <textarea
                rows={4}
                required
                value={jobJD}
                onChange={(e) => setJobJD(e.target.value)}
                placeholder="Describe responsibilities, tech stack expectations, and interview rounds (e.g. OA + 2 Technical + HM)..."
                className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 p-3 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setJobModalOpen(false)}
                className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-1.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-1.5 text-xs font-semibold"
              >
                Publish Opening
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2.5 text-xs font-semibold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
