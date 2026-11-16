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
  Home,
  Layers,
  MapPin,
  Megaphone,
  MessageSquare,
  Newspaper,
  Plus,
  Search,
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
} from '../../data/alumConnectData';

type MainSection = 'home' | 'explore' | 'jobs' | 'notifications' | 'profile';

interface NotificationItem {
  id: string;
  category: 'Endorsements' | 'Jobs' | 'Mentorship' | 'Squads';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  targetSection: MainSection;
  actionLabel: string;
}

interface StudentBuildCard {
  id: string;
  isMine: boolean;
  title: string;
  subtitle: string;
  story: string;
  impactMetric: string;
  author: string;
  batch: string;
  domain: string;
  coverGradient: string;
  coverImage?: string;
  tags: string[];
  demoUrl: string;
  repoUrl: string;
  endorsement?: {
    alumName: string;
    alumRole: string;
    quote: string;
  };
  openRole?: string;
  likes: number;
}

interface TechNewsItem {
  id: string;
  category: 'AI & LLMs' | 'Engineering' | 'Indian Startups' | 'Career & Hiring';
  title: string;
  summary: string;
  source: string;
  readTime: string;
  published: string;
  takeaway: string;
  url: string;
}

interface AlumniJobItem {
  id: string;
  role: string;
  company: string;
  type: 'Internship' | 'Full-Time' | 'Paid Bounty';
  location: string;
  compensation: string;
  postedBy: string;
  alumRole: string;
  skills: string[];
  slotsLeft: number;
  description: string;
}

const COVER_GRADIENTS = [
  'from-zinc-900 via-zinc-800 to-blue-900',
  'from-blue-950 via-indigo-900 to-zinc-900',
  'from-emerald-950 via-zinc-900 to-zinc-800',
  'from-zinc-800 via-slate-900 to-blue-950',
  'from-slate-900 via-blue-950 to-indigo-950',
];

const inferProjectDomain = (stack: string[], pitch: string): string => {
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

const STUDENT_BUILDS: StudentBuildCard[] = [
  ...PROJECTS_DATA.map((p, idx) => {
    const linkedAlum = ALUMNI_DATA.find((a) => a.linkedProjectIds.includes(p.id));
    const isMine =
      p.leadName === 'Ananya Dash' || p.coContributorsNames.includes('Ananya Dash');
    const contributors = [p.leadName, ...p.coContributorsNames].join(' & ');
    return {
      id: p.id,
      isMine,
      title: p.name,
      subtitle: p.pitch,
      story: p.detailedDesc,
      impactMetric: p.linkedPaperId
        ? `${p.hostingPlatform} • Linked ${p.linkedPaperId}`
        : `${p.collaborationMode} (${p.teamSize}) • ${p.hostingPlatform}`,
      author: contributors,
      batch: `${p.academicYears} • ITER`,
      domain: inferProjectDomain(p.techStack, p.pitch),
      coverGradient: COVER_GRADIENTS[idx % COVER_GRADIENTS.length],
      coverImage: p.coverImage || INDIAN_GENERAL_IMAGES[idx % 3],
      tags: p.techStack.slice(0, 4),
      demoUrl: p.liveUrl,
      repoUrl: p.githubUrl,
      endorsement: linkedAlum
        ? {
            alumName: linkedAlum.fullName,
            alumRole: `${linkedAlum.designation} @ ${linkedAlum.company} • Batch '${String(linkedAlum.batchYear).slice(-2)}`,
            quote: `Verified ${linkedAlum.mentorshipScope.toLowerCase()} review — strong production readiness and architecture.`,
          }
        : undefined,
      openRole:
        !linkedAlum && p.collaborationMode === 'Solo'
          ? 'Open for 1 Co-Builder / Alumni Review'
          : undefined,
      likes: 42 + ((idx * 13) % 75),
    };
  }),
  ...RESEARCH_PAPERS_DATA.map((rp, idx) => {
    const linkedAlum = ALUMNI_DATA.find((a) => a.linkedPaperIds.includes(rp.id));
    const isMine =
      rp.leadAuthorName === 'Ananya Dash' || rp.coAuthorName === 'Ananya Dash';
    const authors = rp.coAuthorName
      ? `${rp.leadAuthorName} & ${rp.coAuthorName}`
      : rp.leadAuthorName;
    return {
      id: rp.id,
      isMine,
      title: rp.topic,
      subtitle: `Research Paper • ${rp.venue} (${rp.status})`,
      story: rp.abstract,
      impactMetric: `${rp.status} • ${rp.venue}`,
      author: authors,
      batch: `${rp.leadAuthorYearBranch} • ITER`,
      domain: 'Research Papers',
      coverGradient: COVER_GRADIENTS[(idx + 2) % COVER_GRADIENTS.length],
      coverImage: rp.coverImage,
      tags: ['Research Paper', rp.domain, ...rp.techStack.slice(0, 2)],
      demoUrl: rp.preprintUrl,
      repoUrl: rp.codeRepoUrl,
      endorsement: linkedAlum
        ? {
            alumName: linkedAlum.fullName,
            alumRole: `${linkedAlum.designation} @ ${linkedAlum.company} • Batch '${String(linkedAlum.batchYear).slice(-2)}`,
            quote: `Strong experimental rigor for ${rp.venue}. Ready for alumni benchmark & citation amplification.`,
          }
        : undefined,
      openRole:
        rp.status === 'Under Peer Review'
          ? 'Seeking Alumni Peer Review / Co-Author Feedback'
          : undefined,
      likes: 68 + idx * 11,
    };
  }),
];

const TECH_NEWS: TechNewsItem[] = [
  {
    id: 'tn-1',
    category: 'AI & LLMs',
    title: 'Multi-Agent Coding Workflows Are Replacing Boilerplate Pull Requests',
    summary:
      'Engineering teams across Bangalore and San Francisco are adopting tool-calling agent pipelines for automated test generation and PR triage.',
    source: 'The Pragmatic Engineer',
    readTime: '4 min read',
    published: '2h ago',
    takeaway: 'Build 1 end-to-end AI agent project with evals to stand out in 2026 interviews.',
    url: 'https://news.ycombinator.com',
  },
  {
    id: 'tn-2',
    category: 'Indian Startups',
    title: 'FinTech & Infra Startups Step Up Campus Hiring for Full-Stack Generalists',
    summary:
      'Series A–C startups in Bangalore and Hyderabad are prioritizing students with live deployed products over pure competitive-programming scores.',
    source: 'Inc42 Tech Dispatch',
    readTime: '3 min read',
    published: '5h ago',
    takeaway: 'Keep 2 live product URLs and clear architecture READMEs on your profile.',
    url: 'https://inc42.com',
  },
  {
    id: 'tn-3',
    category: 'Engineering',
    title: 'Why TypeScript + Edge Postgres Became the Default Stack for Fast MVPs',
    summary:
      'Unified type-safety from database schema to React UI cuts student hackathon and startup shipping cycles in half.',
    source: 'Vercel Engineering Blog',
    readTime: '5 min read',
    published: '8h ago',
    takeaway: 'Master end-to-end TypeScript + SQL query optimization for backend rounds.',
    url: 'https://vercel.com/blog',
  },
  {
    id: 'tn-4',
    category: 'Career & Hiring',
    title: 'Alumni Referrals Convert 6× Higher Than Cold Job Portal Applications',
    summary:
      'Hiring managers report that a 2-sentence endorsement from an internal engineer with a working demo link bypasses initial ATS filters.',
    source: 'Alum Connect Insights',
    readTime: '2 min read',
    published: '1d ago',
    takeaway: 'Request a 5-minute alumni review on your best case study before applying.',
    url: 'https://alum-connect-soa.vercel.app',
  },
];

const ALUMNI_JOBS: AlumniJobItem[] = ALUMNI_DATA.filter((a) => a.canPostJobs).map((alum, idx) => {
  const matchedOffer = OFFERS_DATA.find((o) => o.referringAlumniId === alum.id);
  return {
    id: `job-${alum.id.toLowerCase()}`,
    role: matchedOffer ? matchedOffer.jobRole : `${alum.mentorshipScope.split(',')[0]} Engineer`,
    company: alum.company,
    type:
      matchedOffer?.offerType === 'Internship'
        ? 'Internship'
        : idx % 3 === 2
          ? 'Paid Bounty'
          : 'Full-Time',
    location: idx % 2 === 0 ? 'Bangalore (Hybrid)' : 'Hyderabad / Remote',
    compensation: matchedOffer
      ? matchedOffer.packageStr
      : idx % 2 === 0
        ? '₹24 – 32 LPA'
        : '₹60,000 / month',
    postedBy: alum.fullName,
    alumRole: `${alum.designation} • Batch '${String(alum.batchYear).slice(-2)}`,
    skills: alum.techStackExpertise.slice(0, 4),
    slotsLeft: alum.activeJobOpeningsCount || 2,
    description: `${alum.personaCategory} opening at ${alum.company} focusing on ${alum.mentorshipScope}.`,
  };
});

const MENTOR_CHATS = ALUMNI_DATA.slice(0, 4).map((alum, idx) => ({
  id: `mc-${alum.id.toLowerCase()}`,
  name: alum.fullName,
  role: `${alum.designation} @ ${alum.company} • '${String(alum.batchYear).slice(-2)}`,
  topic: alum.mentorshipScope,
  time: ['Sat, 11:00 AM', 'Sun, 5:00 PM', 'Wed, 7:30 PM', 'Fri, 6:00 PM'][idx % 4],
  avatar: INDIAN_GENERAL_IMAGES[3],
}));

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    category: 'Endorsements',
    title: 'Debadatta Rath endorsed FinAudit Multi-Agent (PRJ-01)',
    message:
      "Co-Founder & CTO @ HyperScale Labs (Batch '16) endorsed PRJ-01 & RP-01 for Capstone & Startup Incubation.",
    time: '12m ago',
    unread: true,
    targetSection: 'home',
    actionLabel: 'View Endorsement',
  },
  {
    id: 'n-2',
    category: 'Jobs',
    title: '6 Direct Openings at Razorpay via Rajesh Kumar Mohanty',
    message:
      "Head of Talent Acquisition & HR (Batch '15) opened SDE-1 (₹22 LPA) and internship referral slots.",
    time: '45m ago',
    unread: true,
    targetSection: 'jobs',
    actionLabel: 'Open Job',
  },
  {
    id: 'n-3',
    category: 'Mentorship',
    title: 'Anindita Pattnaik opened Deep Learning Office Hours',
    message:
      'Founder & CAIO @ NeuroLink AI is reviewing VaniSetu Odia ASR (PRJ-08) & RP-01/RP-03 preprints.',
    time: '2h ago',
    unread: true,
    targetSection: 'home',
    actionLabel: 'Book Slot',
  },
  {
    id: 'n-4',
    category: 'Squads',
    title: 'RP-02 Post-Quantum Cryptography Under Peer Review',
    message:
      'Rohan Patnaik & Sneha Mishra (KyberMed Edge Vault) are mentoring junior ECE/CSIT builders.',
    time: '5h ago',
    unread: false,
    targetSection: 'explore',
    actionLabel: 'Inspect Paper',
  },
  {
    id: 'n-5',
    category: 'Jobs',
    title: '32 Direct Alumni Openings & 6 Confirmed PPOs Live',
    message:
      'HyperScale Labs, Google, Microsoft India, AWS & Cisco Systems have active ITER referral tracks.',
    time: '1d ago',
    unread: false,
    targetSection: 'jobs',
    actionLabel: 'Apply Now',
  },
];

export default function StudentStudioPage() {
  const [section, setSection] = useState<MainSection>('home');
  const [search, setSearch] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [newsCategory, setNewsCategory] = useState<string>('All');
  const [jobTypeFilter, setJobTypeFilter] = useState<string>('All');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [notifFilter, setNotifFilter] = useState<string>('All');

  const [builds, setBuilds] = useState<StudentBuildCard[]>(STUDENT_BUILDS);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});
  const [bookedChats, setBookedChats] = useState<Record<string, boolean>>({});
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});
  const [rsvpPaperClub, setRsvpPaperClub] = useState(false);

  const [caseStudyItem, setCaseStudyItem] = useState<StudentBuildCard | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Share Build form
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newStory, setNewStory] = useState('');
  const [newTags, setNewTags] = useState('Next.js, TypeScript, Tailwind');
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const domains = ['All', 'Research Papers', 'Product & FinTech', 'Applied AI', 'IoT & Systems', 'Consumer FinTech'];
  const newsCategories = ['All', 'AI & LLMs', 'Engineering', 'Indian Startups', 'Career & Hiring'];
  const jobTypes = ['All', 'Internship', 'Full-Time', 'Paid Bounty'];

  const visibleBuilds = useMemo(() => {
    const q = search.trim().toLowerCase();
    return builds.filter((b) => {
      if (selectedDomain !== 'All' && b.domain !== selectedDomain) return false;
      if (!q) return true;
      return (
        b.title.toLowerCase().includes(q) ||
        b.subtitle.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [builds, selectedDomain, search]);

  const visibleNews = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TECH_NEWS.filter((n) => {
      if (newsCategory !== 'All' && n.category !== newsCategory) return false;
      if (!q) return true;
      return (
        n.title.toLowerCase().includes(q) ||
        n.summary.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
      );
    });
  }, [newsCategory, search]);

  const visibleJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALUMNI_JOBS.filter((j) => {
      if (jobTypeFilter !== 'All' && j.type !== jobTypeFilter) return false;
      if (!q) return true;
      return (
        j.role.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.postedBy.toLowerCase().includes(q) ||
        j.skills.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [jobTypeFilter, search]);

  const myBuilds = useMemo(() => builds.filter((b) => b.isMine), [builds]);

  const handlePublishBuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSubtitle.trim()) return;
    const created: StudentBuildCard = {
      id: `sb-${Date.now()}`,
      isMine: true,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim(),
      story: newStory.trim() || newSubtitle.trim(),
      impactMetric: 'Just Shipped • Ready for Review',
      author: 'Ananya Mohanty',
      batch: "3rd Yr CSE '26",
      domain: 'Product & FinTech',
      coverGradient: 'from-zinc-900 via-blue-950 to-zinc-800',
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      demoUrl: 'https://alum-connect-soa.vercel.app',
      repoUrl: 'https://github.com/ragelabs-ssssd/Alum-Connect',
      likes: 1,
    };
    setBuilds((prev) => [created, ...prev]);
    setNewTitle('');
    setNewSubtitle('');
    setNewStory('');
    setShareModalOpen(false);
    setSection('profile');
    notify(`Published "${created.title}" to your Profile & Home Feed!`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-[#09090B] dark:text-zinc-50 transition-colors">
      {/* ==================== TOP HEADER WITH 4-TAB BAR ==================== */}
      <header className="sticky top-0 z-40 border-b border-[#E4E4E7] dark:border-zinc-800 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-15 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center gap-3">
          {/* 1. Logo + 2. Search grouped tightly */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center shrink-0" aria-label="Alum Connect Home">
              <div className="h-9 w-9 rounded-lg bg-[#F4F4F5] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 flex items-center justify-center p-1 overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Alum Connect"
                  className="h-full w-full object-contain dark:invert"
                />
              </div>
            </Link>

            <div className="relative hidden md:block w-52 lg:w-64">
              <Search className="w-3.5 h-3.5 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* 3. 5-Tab Bar (Home Feed | Explore Tech News | Alumni Jobs | Notifications | My Profile) */}
          <nav
            aria-label="Student workspace sections"
            className="hidden lg:flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-1"
          >
            {[
              { id: 'home' as MainSection, label: 'Home Feed', icon: <Home className="w-3.5 h-3.5" /> },
              { id: 'explore' as MainSection, label: 'Explore Tech News', icon: <Newspaper className="w-3.5 h-3.5" /> },
              { id: 'jobs' as MainSection, label: 'Alumni Jobs', icon: <Briefcase className="w-3.5 h-3.5" /> },
              {
                id: 'notifications' as MainSection,
                label: 'Notifications',
                icon: <Bell className="w-3.5 h-3.5" />,
                badge: notifications.filter((n) => n.unread).length,
              },
              { id: 'profile' as MainSection, label: 'My Profile', icon: <User className="w-3.5 h-3.5" /> },
            ].map((tab) => {
              const active = section === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSection(tab.id)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${active
                    ? 'bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950 shadow-2xs'
                    : 'text-[#52525B] dark:text-zinc-400 hover:text-[#09090B] dark:hover:text-white'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${active
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#2563EB] text-white'
                        }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* 4. Contribute (Home Feed only) + 5. Modes */}
          <div className="flex items-center gap-2 shrink-0 lg:justify-self-end">
            {section === 'home' && (
              <Link
                href="/share-project"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-white px-3.5 py-1.5 text-xs font-semibold transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Contribute</span>
              </Link>
            )}
            <ThemeToggle compact />
          </div>
        </div>

        {/* Mobile / Tablet 5-Tab Subbar */}
        <div className="lg:hidden border-t border-[#E4E4E7] dark:border-zinc-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'home' as MainSection, label: 'Home Feed' },
            { id: 'explore' as MainSection, label: 'Explore Tech News' },
            { id: 'jobs' as MainSection, label: 'Alumni Jobs' },
            { id: 'notifications' as MainSection, label: `Notifications (${notifications.filter((n) => n.unread).length})` },
            { id: 'profile' as MainSection, label: 'My Profile' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSection(tab.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${section === tab.id
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
        {/* LEFT RAIL: Per-Page Contextual Rail (Hidden on My Profile tab so main profile expands) */}
        {section !== 'profile' && (
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
            {/* 1. HOME FEED -> Mini Profile Card + Quick Saved */}
            {section === 'home' && (
              <>
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs">
                  {/* Back Banner */}
                  <div className="h-16 bg-gradient-to-r from-[#18181B] via-zinc-800 to-[#2563EB]" />

                  <div className="px-5 pb-5 -mt-8 space-y-3.5">
                    <div className="h-14 w-14 rounded-2xl bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 border-4 border-white dark:border-zinc-900 flex items-center justify-center font-bold text-sm shadow-xs">
                      AM
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-sm font-bold">Ananya Mohanty</h2>
                      <p className="text-xs text-[#52525B] dark:text-zinc-400">
                        3rd Year CSE • ITER Bhubaneswar
                      </p>
                      <p className="text-xs text-[#09090B] dark:text-zinc-200 leading-relaxed pt-0.5">
                        Building FinTech &amp; Next.js products • Open to SDE Internships
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Secured Internship • Razorpay (PPO Track)
                      </span>
                    </div>

                    {/* Working On vs Pushed Live + Alumni Rating */}
                    <div className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-3 space-y-2.5 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="rounded-lg bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 p-2">
                          <div className="text-sm font-bold">2</div>
                          <div className="text-[10px] text-[#52525B] dark:text-zinc-400">
                            Working On
                          </div>
                        </div>
                        <div className="rounded-lg bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 p-2">
                          <div className="text-sm font-bold text-[#2563EB]">
                            {myBuilds.length}
                          </div>
                          <div className="text-[10px] text-[#52525B] dark:text-zinc-400">
                            Pushed Live
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E7] dark:border-zinc-800">
                        <span className="inline-flex items-center gap-1 font-bold text-[#09090B] dark:text-white">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          4.9 / 5.0
                        </span>
                        <span className="text-[11px] font-medium text-[#52525B] dark:text-zinc-400">
                          Rated by 12 Alums
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSection('profile')}
                      className="w-full rounded-full bg-[#18181B] hover:bg-[#27272A] dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-white py-2 text-xs font-semibold transition-colors"
                    >
                      Open Full Profile
                    </button>
                  </div>
                </div>

                {/* Quick Saved under Profile Section */}
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-[#2563EB]" />
                    Quick Saved ({Object.values(savedIds).filter(Boolean).length})
                  </h3>
                  {builds.filter((b) => savedIds[b.id]).length === 0 ? (
                    <p className="text-[11px] text-[#52525B] dark:text-zinc-400">
                      Bookmark any project or research paper to pin it here.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {builds
                        .filter((b) => savedIds[b.id])
                        .map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setCaseStudyItem(b)}
                            className="w-full text-left rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-2.5 hover:border-[#2563EB] border border-transparent transition-colors"
                          >
                            <div className="text-xs font-semibold truncate">{b.title}</div>
                            <div className="text-[10px] text-[#52525B] dark:text-zinc-400">
                              {b.domain}
                            </div>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 2. EXPLORE TECH NOW -> Option 1 (Tech Stack Filter Tree) then Option 4 (Live Hackathons & CFPs) */}
            {/* 2. EXPLORE TECH NOW -> Paper Reading Group + Live Hackathons & CFPs */}
            {section === 'explore' && (
              <>
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
                      Filter By Stack
                    </h3>
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch('')}
                        className="text-[10px] font-semibold text-[#2563EB] hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Next.js', 'PyTorch', 'Rust', 'System Design', 'Cloud', 'FinTech'].map(
                      (tag) => {
                        const active = search.toLowerCase() === tag.toLowerCase();
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setSearch(active ? '' : tag)}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors ${active
                              ? 'bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950'
                              : 'bg-[#F4F4F5] dark:bg-zinc-800 text-[#52525B] dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                              }`}
                          >
                            {tag}
                          </button>
                        );
                      }
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E7] dark:border-zinc-800">
                    <span className="inline-flex items-center gap-1 font-bold text-[#09090B] dark:text-white">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      4.9 / 5.0
                    </span>
                    <span className="text-[11px] font-medium text-[#52525B] dark:text-zinc-400">
                      Rated by 12 Alums
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                    Paper Club • Thu 8 PM
                  </h3>
                  <div className="rounded-xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 space-y-1.5">
                    <div className="text-xs font-bold">DeepSeek-R1 &amp; Reasoning RL</div>
                    <div className="text-[10px] text-[#52525B] dark:text-zinc-400">
                      Hosted by Ankit &apos;19 • {rsvpPaperClub ? 35 : 34} attending
                    </div>
                    <button
                      type="button"
                      disabled={rsvpPaperClub}
                      onClick={() => {
                        setRsvpPaperClub(true);
                        notify("RSVP'd for Paper Club: DeepSeek-R1 & Reasoning RL!");
                      }}
                      className={`mt-1 rounded-full px-3 py-1 text-[10px] font-semibold ${rsvpPaperClub
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 hover:bg-[#27272A]'
                        }`}
                    >
                      {rsvpPaperClub ? "RSVP'd ✓" : 'RSVP Seat'}
                    </button>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                    Hackathons &amp; CFPs
                  </h3>
                  {[
                    { name: 'SOA FinTech Buildathon', due: '3d left', tag: '₹50k Prize' },
                    { name: 'IEEE Student Paper CFP', due: '11d left', tag: 'Abstract' },
                  ].map((h) => (
                    <button
                      key={h.name}
                      type="button"
                      onClick={() => notify(`Opened details for ${h.name} (${h.due})`)}
                      className="w-full text-left rounded-xl border border-[#E4E4E7] dark:border-zinc-800 p-3 flex items-center justify-between gap-2 hover:border-[#2563EB] transition-colors"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{h.name}</div>
                        <div className="text-[10px] text-[#52525B] dark:text-zinc-400">{h.tag}</div>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                        {h.due}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* 3. ALUMNI JOBS -> Option 2 (Saved Jobs & Shortlist) then Option 6 (Interview Prep Bank) */}
            {section === 'jobs' && (
              <>
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <Bookmark className="w-3.5 h-3.5 text-[#2563EB]" />
                    Saved Roles ({ALUMNI_JOBS.slice(0, 2).length})
                  </h3>
                  {ALUMNI_JOBS.slice(0, 2).map((job) => {
                    const applied = !!appliedJobs[job.id];
                    return (
                      <div
                        key={job.id}
                        className="rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-2.5 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-bold truncate">{job.company}</div>
                          <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                            {job.role}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={applied}
                          onClick={() => {
                            setAppliedJobs((prev) => ({ ...prev, [job.id]: true }));
                            notify(`Referral request sent for ${job.company}!`);
                          }}
                          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${applied
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-[#2563EB] text-white hover:bg-blue-700'
                            }`}
                        >
                          {applied ? 'Applied ✓' : 'Apply'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                    Interview Prep Bank
                  </h3>
                  {[
                    { co: 'Razorpay OA', topic: 'Rate Limiter + SQL Joins' },
                    { co: 'Atlassian LLD', topic: 'Middleware Router Design' },
                    { co: 'Microsoft SDE', topic: 'Trees, Graphs & Concurrency' },
                  ].map((p) => (
                    <button
                      key={p.co}
                      type="button"
                      onClick={() => notify(`Loaded prep notes for ${p.co}: ${p.topic}`)}
                      className="w-full text-left rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-2.5 text-xs hover:border-[#2563EB] border border-transparent transition-colors"
                    >
                      <div className="font-bold">{p.co}</div>
                      <div className="text-[10px] text-[#52525B] dark:text-zinc-400">{p.topic}</div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* 4. NOTIFICATIONS -> Option 7 (Upcoming Coffee Chats) then Option 9 (Campus Announcements) then Option 8 (Submission Status Feed) */}
            {section === 'notifications' && (
              <>
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                    Booked Chats
                  </h3>
                  {MENTOR_CHATS.slice(0, 1).map((m) => {
                    const booked = !!bookedChats[m.id];
                    return (
                      <div
                        key={m.id}
                        className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-3 text-xs space-y-1"
                      >
                        <div className="font-bold">
                          {m.name} • {m.time}
                        </div>
                        <div className="text-[10px] text-[#52525B] dark:text-zinc-400">
                          {m.topic}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!booked) {
                              setBookedChats((b) => ({ ...b, [m.id]: true }));
                              notify(`Booked 15-min chat with ${m.name}!`);
                            } else {
                              notify(`Joining Google Meet with ${m.name}...`);
                            }
                          }}
                          className="text-[10px] text-[#2563EB] font-semibold hover:underline"
                        >
                          {booked ? 'Join Google Meet →' : 'Book 15m Slot →'}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <Megaphone className="w-3.5 h-3.5 text-[#2563EB]" />
                    Campus Notices
                  </h3>
                  {[
                    { title: 'Alumni Townhall • Nov 22', sub: 'ITER Auditorium + Live Stream' },
                    { title: 'Winter Internship Drive • Nov 25', sub: 'Placement Cell • Pre-register' },
                  ].map((n) => (
                    <div
                      key={n.title}
                      className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-3 text-xs space-y-0.5"
                    >
                      <div className="font-bold">{n.title}</div>
                      <div className="text-[10px] text-[#52525B] dark:text-zinc-400">{n.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    Submission Status
                  </h3>
                  {myBuilds.slice(0, 2).map((b, idx) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setCaseStudyItem(b)}
                      className="w-full text-left rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-2.5 flex items-center justify-between gap-2 text-xs hover:border-[#2563EB] transition-colors"
                    >
                      <span className="font-semibold truncate">{b.title}</span>
                      <span
                        className={`text-[10px] font-bold shrink-0 ${b.endorsement || idx === 0 ? 'text-emerald-600' : 'text-[#2563EB]'
                          }`}
                      >
                        {b.endorsement || idx === 0 ? 'Endorsed ✓' : 'Under Review'}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </aside>
        )}

        {/* CENTER STAGE: 5-TAB CONTENT */}
        <main className={section === 'profile' ? 'lg:col-span-9 space-y-5' : 'lg:col-span-6 space-y-5'}>
          {/* ---------- TAB 1: HOME FEED ---------- */}
          {section === 'home' && (
            <>
              <div className="rounded-3xl bg-[#18181B] dark:bg-zinc-900 text-white p-6 sm:p-7 space-y-3 border border-zinc-800">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-sky-300">
                  <Award className="w-3.5 h-3.5" />
                  Student Story of the Week
                </div>
                <h1 className="text-xl sm:text-2xl font-bold leading-snug">
                  From a 10-day campus build to a direct Razorpay engineering interview.
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  Share your product story, attach a live walkthrough, and let ITER alumni endorse your real engineering craft.
                </p>
                <div className="pt-1 flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShareModalOpen(true)}
                    className="rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    Publish Your Case Study
                  </button>
                  <button
                    type="button"
                    onClick={() => setSection('jobs')}
                    className="rounded-full border border-white/20 hover:bg-white/10 px-4 py-2 text-xs font-semibold transition-colors"
                  >
                    Browse Alumni Jobs →
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {domains.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDomain(d)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${selectedDomain === d
                        ? 'bg-[#18181B] text-white border-[#18181B] dark:bg-zinc-100 dark:text-zinc-950'
                        : 'bg-[#F4F4F5] dark:bg-zinc-900 text-[#52525B] dark:text-zinc-300 border-[#E4E4E7] dark:border-zinc-800 hover:border-[#2563EB]'
                        }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                {visibleBuilds.map((build) => {
                  const isLiked = !!likedIds[build.id];
                  const isSaved = !!savedIds[build.id];
                  return (
                    <article
                      key={build.id}
                      className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs hover:shadow-md transition-all"
                    >
                      <div
                        className={`relative overflow-hidden bg-gradient-to-br ${build.coverGradient} p-5 text-white flex flex-col justify-between min-h-[144px]`}
                      >
                        {build.coverImage && (
                          <img
                            src={build.coverImage}
                            alt={build.title}
                            className="absolute inset-0 h-full w-full object-cover opacity-30"
                          />
                        )}
                        <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                          <span className="rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 font-medium">
                            {build.domain}
                          </span>
                          <span className="rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[11px] font-semibold">
                            {build.impactMetric}
                          </span>
                        </div>
                        <div className="relative z-10 pt-4 flex items-end justify-between gap-3">
                          <div>
                            <h2 className="text-lg font-bold leading-tight">{build.title}</h2>
                            <p className="text-xs text-white/80 mt-0.5">{build.subtitle}</p>
                          </div>
                          <a
                            href={build.demoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white text-[#09090B] px-3 py-1.5 text-[11px] font-bold hover:bg-zinc-100"
                          >
                            Live Preview <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-xs">
                            <span className="font-bold">{build.author}</span>{' '}
                            <span className="text-[#52525B] dark:text-zinc-400">
                              • {build.batch}
                            </span>
                          </div>
                          {build.openRole && (
                            <span className="rounded-full bg-blue-50 dark:bg-sky-500/10 text-[#2563EB] dark:text-sky-400 px-2.5 py-0.5 text-[11px] font-semibold">
                              {build.openRole}
                            </span>
                          )}
                        </div>

                        <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-300 leading-relaxed">
                          {build.story}
                        </p>

                        {build.endorsement && (
                          <div className="rounded-2xl bg-[#F4F4F5] dark:bg-zinc-800/80 border border-[#E4E4E7] dark:border-zinc-700 p-3.5 space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#2563EB] dark:text-sky-400">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Alumni Endorsement • {build.endorsement.alumName} (
                              {build.endorsement.alumRole})
                            </div>
                            <p className="text-xs italic text-[#09090B] dark:text-zinc-200">
                              &ldquo;{build.endorsement.quote}&rdquo;
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-1.5">
                            {build.tags.map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 px-2.5 py-0.5 text-[11px] font-medium"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                          <a
                            href={build.repoUrl}
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
                              onClick={() =>
                                setLikedIds((p) => ({ ...p, [build.id]: !p[build.id] }))
                              }
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-semibold transition-colors ${isLiked
                                ? 'border-[#2563EB] bg-blue-50 dark:bg-sky-500/10 text-[#2563EB]'
                                : 'border-[#E4E4E7] dark:border-zinc-700 text-[#52525B]'
                                }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              {build.likes + (isLiked ? 1 : 0)}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setSavedIds((p) => ({ ...p, [build.id]: !p[build.id] }))
                              }
                              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-semibold transition-colors ${isSaved
                                ? 'border-[#2563EB] text-[#2563EB]'
                                : 'border-[#E4E4E7] dark:border-zinc-700 text-[#52525B]'
                                }`}
                            >
                              <Bookmark className="w-3.5 h-3.5" />
                              {isSaved ? 'Saved' : 'Save'}
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setCaseStudyItem(build)}
                              className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-3 py-1 font-semibold hover:bg-[#F4F4F5] dark:hover:bg-zinc-800"
                            >
                              Read Case Study
                            </button>
                            {build.openRole ? (
                              <button
                                type="button"
                                onClick={() =>
                                  notify(`Sent squad join request to ${build.author}!`)
                                }
                                className="inline-flex items-center gap-1 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-3.5 py-1 font-semibold"
                              >
                                <UserPlus className="w-3.5 h-3.5" /> Join Squad
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  notify(`Requested mentor review for "${build.title}"!`)
                                }
                                className="inline-flex items-center gap-1 rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-3.5 py-1 font-semibold"
                              >
                                <MessageSquare className="w-3.5 h-3.5" /> Request Review
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}

          {/* ---------- TAB 2: EXPLORE FEED (TOP TECH NEWS) ---------- */}
          {section === 'explore' && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-6 space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
                  <Compass className="w-4 h-4" />
                  EXPLORE TECH NEWS
                </div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Top engineering, AI &amp; startup briefings for ITER builders.
                </h1>
                <p className="text-xs text-[#52525B] dark:text-zinc-400">
                  Stay sharp on what top tech teams are shipping and what hiring managers value right now.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {newsCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setNewsCategory(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${newsCategory === cat
                      ? 'bg-[#18181B] text-white border-[#18181B] dark:bg-zinc-100 dark:text-zinc-950'
                      : 'bg-white dark:bg-zinc-900 text-[#52525B] dark:text-zinc-300 border-[#E4E4E7] dark:border-zinc-800'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {visibleNews.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3 hover:border-[#2563EB] transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="rounded-full bg-blue-50 dark:bg-sky-500/10 text-[#2563EB] dark:text-sky-400 px-2.5 py-0.5 font-semibold">
                        {item.category}
                      </span>
                      <span className="text-[#52525B] dark:text-zinc-400">
                        {item.source} • {item.readTime} • {item.published}
                      </span>
                    </div>
                    <h2 className="text-base font-bold leading-snug">{item.title}</h2>
                    <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-300 leading-relaxed">
                      {item.summary}
                    </p>
                    <div className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-800/80 border border-[#E4E4E7] dark:border-zinc-700 p-3 text-xs">
                      <strong className="text-[#2563EB] dark:text-sky-400">Builder Takeaway: </strong>
                      {item.takeaway}
                    </div>
                    <div className="flex items-center justify-end pt-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-1.5 text-xs font-semibold"
                      >
                        Read Full Story <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* ---------- TAB 3: ALUMNI JOBS & INTERNSHIPS ---------- */}
          {section === 'jobs' && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-6 space-y-2">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
                  <Briefcase className="w-4 h-4" />
                  ALUMNI JOB BOARD
                </div>
                <h1 className="text-xl sm:text-2xl font-bold">
                  Apply directly to internships, full-time roles &amp; bounties posted by ITER alumni.
                </h1>
                <p className="text-xs text-[#52525B] dark:text-zinc-400">
                  Every application automatically attaches your published Student Studio projects.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {jobTypes.map((jt) => (
                  <button
                    key={jt}
                    type="button"
                    onClick={() => setJobTypeFilter(jt)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${jobTypeFilter === jt
                      ? 'bg-[#18181B] text-white border-[#18181B] dark:bg-zinc-100 dark:text-zinc-950'
                      : 'bg-white dark:bg-zinc-900 text-[#52525B] dark:text-zinc-300 border-[#E4E4E7] dark:border-zinc-800'
                      }`}
                  >
                    {jt}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {visibleJobs.map((job) => {
                  const applied = !!appliedJobs[job.id];
                  return (
                    <article
                      key={job.id}
                      className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3.5"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 font-bold text-[#2563EB]">
                              <Building2 className="w-3.5 h-3.5" /> {job.company}
                            </span>
                            <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-semibold">
                              {job.type}
                            </span>
                          </div>
                          <h2 className="text-base font-bold mt-1">{job.role}</h2>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          {job.compensation}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-300">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map((s) => (
                          <span
                            key={s}
                            className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 px-2.5 py-0.5 text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-[#E4E4E7] dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="text-[#52525B] dark:text-zinc-400 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {job.location}
                          </span>
                          <span>•</span>
                          <span>
                            Posted by <strong>{job.postedBy}</strong> ({job.alumRole})
                          </span>
                        </div>

                        <button
                          type="button"
                          disabled={applied}
                          onClick={() => {
                            setAppliedJobs((p) => ({ ...p, [job.id]: true }));
                            notify(
                              `Applied to ${job.role} at ${job.company} with your portfolio!`
                            );
                          }}
                          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${applied
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                            }`}
                        >
                          {applied ? 'Applied with Portfolio ✓' : 'Apply Now'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------- TAB 4: NOTIFICATIONS ---------- */}
          {section === 'notifications' && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-6 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB]">
                    <Bell className="w-4 h-4" />
                    NOTIFICATIONS CENTER
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold">
                    Every endorsement, referral &amp; mentor update in one place.
                  </h1>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, unread: false }))
                    );
                    notify('All notifications marked as read');
                  }}
                  className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-1.5 text-xs font-semibold hover:border-[#2563EB]"
                >
                  Mark all as read
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {['All', 'Unread', 'Endorsements', 'Jobs', 'Mentorship', 'Squads'].map(
                  (f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setNotifFilter(f)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold border transition-colors ${notifFilter === f
                        ? 'bg-[#18181B] text-white border-[#18181B] dark:bg-zinc-100 dark:text-zinc-950'
                        : 'bg-white dark:bg-zinc-900 text-[#52525B] dark:text-zinc-300 border-[#E4E4E7] dark:border-zinc-800'
                        }`}
                    >
                      {f}
                    </button>
                  )
                )}
              </div>

              <div className="space-y-3">
                {notifications
                  .filter((n) => {
                    if (notifFilter === 'Unread') return n.unread;
                    if (notifFilter !== 'All') return n.category === notifFilter;
                    return true;
                  })
                  .map((n) => (
                    <div
                      key={n.id}
                      onClick={() =>
                        setNotifications((prev) =>
                          prev.map((item) =>
                            item.id === n.id ? { ...item, unread: false } : item
                          )
                        )
                      }
                      className={`rounded-2xl border p-4 sm:p-5 transition-all cursor-pointer space-y-2 ${n.unread
                        ? 'border-[#2563EB]/50 bg-blue-50/30 dark:bg-sky-500/5'
                        : 'border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900'
                        }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          {n.unread && (
                            <span className="h-2 w-2 rounded-full bg-[#2563EB]" />
                          )}
                          <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-semibold text-[#2563EB] dark:text-sky-400">
                            {n.category}
                          </span>
                        </div>
                        <span className="text-[#52525B] dark:text-zinc-400">
                          {n.time}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold">{n.title}</h3>
                      <p className="text-xs text-[#52525B] dark:text-zinc-300 leading-relaxed">
                        {n.message}
                      </p>

                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setNotifications((prev) =>
                              prev.map((item) =>
                                item.id === n.id ? { ...item, unread: false } : item
                              )
                            );
                            setSection(n.targetSection);
                          }}
                          className="rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-3.5 py-1 text-[11px] font-semibold"
                        >
                          {n.actionLabel} →
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ---------- TAB 5: MY PROFILE ---------- */}
          {section === 'profile' && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-[#18181B] via-zinc-800 to-[#2563EB]" />
                <div className="px-6 pb-6 -mt-10 space-y-4">
                  <div className="h-20 w-20 rounded-2xl bg-[#18181B] text-white border-4 border-white dark:border-zinc-900 flex items-center justify-center text-xl font-bold shadow-sm">
                    AM
                  </div>

                  <div>
                    <h1 className="text-xl font-bold">Ananya Mohanty</h1>
                    <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-400">
                      3rd Year Computer Science &amp; Engineering • ITER, Siksha &apos;O&apos; Anusandhan
                    </p>
                    <p className="text-xs text-[#52525B] dark:text-zinc-300 mt-2 leading-relaxed">
                      Building full-stack FinTech and developer tools. Exploring Summer 2027 product engineering internships with ITER alumni teams.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {['Next.js', 'TypeScript', 'React', 'PostgreSQL', 'Tailwind CSS', 'Product UI'].map(
                      (skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 px-3 py-1 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold">
                    My Published Case Studies ({myBuilds.length})
                  </h2>
                  <Link
                    href="/share-project"
                    className="rounded-full bg-[#18181B] hover:bg-[#27272A] dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-white px-4 py-1.5 text-xs font-semibold transition-colors"
                  >
                    + Contribute
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {myBuilds.map((b) => (
                    <div
                      key={b.id}
                      className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2"
                    >
                      <div className="text-xs font-semibold text-[#2563EB]">{b.domain}</div>
                      <h3 className="text-sm font-bold">{b.title}</h3>
                      <p className="text-xs text-[#52525B] dark:text-zinc-400 line-clamp-2">
                        {b.subtitle}
                      </p>
                      <div className="pt-2 flex items-center justify-between text-xs">
                        <span className="text-[#52525B]">{b.impactMetric}</span>
                        <button
                          type="button"
                          onClick={() => setCaseStudyItem(b)}
                          className="font-semibold text-[#2563EB] hover:underline"
                        >
                          Open →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT RAIL: Dynamic Per-Page Contextual Rail */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20">
          {/* 1. HOME FEED -> Option 1 (Mentor Chats + Latest Jobs) + Option 6 (Quick Saved) */}
          {section === 'home' && (
            <>
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                  Mentor Coffee Chats
                </h3>
                <div className="space-y-2.5">
                  {MENTOR_CHATS.map((m) => {
                    const booked = !!bookedChats[m.id];
                    return (
                      <div
                        key={m.id}
                        className="rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-3 space-y-1.5"
                      >
                        <div className="text-xs font-bold">{m.name}</div>
                        <div className="text-[11px] text-[#52525B] dark:text-zinc-400">
                          {m.role}
                        </div>
                        <div className="text-[11px] font-medium">{m.topic}</div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-[#52525B]">{m.time}</span>
                          <button
                            type="button"
                            disabled={booked}
                            onClick={() => {
                              setBookedChats((b) => ({ ...b, [m.id]: true }));
                              notify(`Booked 15-min chat with ${m.name}!`);
                            }}
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${booked
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950'
                              }`}
                          >
                            {booked ? 'Booked ✓' : 'Book 15m'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-[#2563EB]" />
                    Latest Alumni Jobs
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSection('jobs')}
                    className="text-[11px] font-semibold text-[#2563EB] hover:underline"
                  >
                    See all
                  </button>
                </div>
                <div className="space-y-2.5">
                  {ALUMNI_JOBS.slice(0, 2).map((job) => {
                    const applied = !!appliedJobs[job.id];
                    return (
                      <div
                        key={job.id}
                        className="rounded-xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-800/70 p-3 space-y-1.5"
                      >
                        <div className="text-xs font-bold">{job.role}</div>
                        <div className="text-[11px] text-[#52525B] dark:text-zinc-400">
                          {job.company} • {job.location}
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            {job.compensation}
                          </span>
                          <button
                            type="button"
                            disabled={applied}
                            onClick={() => {
                              setAppliedJobs((a) => ({ ...a, [job.id]: true }));
                              notify(`Applied to ${job.company} with your portfolio!`);
                            }}
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${applied
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-[#2563EB] text-white'
                              }`}
                          >
                            {applied ? 'Applied ✓' : 'Apply'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* 2. EXPLORE TECH NEWS -> Option 1 (Trending Topics + Alumni Reading Picks) */}
          {section === 'explore' && (
            <>
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#2563EB]" />
                  Trending Tech Topics
                </h3>
                {[
                  { tag: '#MultiAgentSystems', sub: '42 discussions this week', q: 'AI' },
                  { tag: '#EdgePostgres', sub: '28 student builds', q: 'TypeScript' },
                  { tag: '#FinTechHiring', sub: '19 alumni briefings', q: 'FinTech' },
                ].map((topic) => (
                  <div
                    key={topic.tag}
                    className="rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-3 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{topic.tag}</div>
                      <div className="text-[10px] text-[#52525B] truncate">{topic.sub}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSearch(topic.q)}
                      className="shrink-0 rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-2.5 py-1 text-[10px] font-semibold"
                    >
                      Filter
                    </button>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                  Alumni Reading Picks
                </h3>
                {[
                  { title: 'Pragmatic Engineer Dispatch', sub: "Recommended by Vikram '18", badge: '4m' },
                  { title: 'System Design Primer', sub: "Recommended by Priya '16", badge: '6m' },
                ].map((pick) => (
                  <div
                    key={pick.title}
                    className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-2.5 flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{pick.title}</div>
                      <div className="text-[10px] text-[#52525B] truncate">{pick.sub}</div>
                    </div>
                    <span className="rounded-full bg-blue-50 dark:bg-sky-500/10 text-[#2563EB] px-2 py-0.5 text-[10px] font-bold">
                      {pick.badge}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 3. ALUMNI JOBS -> Option 1 (Application Tracker + Referral Readiness) */}
          {section === 'jobs' && (
            <>
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#2563EB]" />
                  Your Application Tracker
                </h3>
                {ALUMNI_JOBS.slice(0, 2).map((job) => {
                  const applied = !!appliedJobs[job.id];
                  return (
                    <div
                      key={job.id}
                      className="rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-3 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold truncate">{job.company}</div>
                        <div className="text-[10px] text-[#52525B] truncate">{job.role}</div>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${applied
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-[#F4F4F5] dark:bg-zinc-800 text-[#52525B]'
                          }`}
                      >
                        {applied ? 'Applied ✓' : `${job.slotsLeft} slots`}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
                  Mentor Coffee Chats
                </h3>
                <div className="space-y-2.5">
                  {MENTOR_CHATS.map((m) => {
                    const booked = !!bookedChats[m.id];
                    return (
                      <div
                        key={m.id}
                        className="rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-3 space-y-1.5"
                      >
                        <div className="text-xs font-bold">{m.name}</div>
                        <div className="text-[11px] text-[#52525B] dark:text-zinc-400">
                          {m.role}
                        </div>
                        <div className="text-[11px] font-medium">{m.topic}</div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-[#52525B]">{m.time}</span>
                          <button
                            type="button"
                            disabled={booked}
                            onClick={() => {
                              setBookedChats((b) => ({ ...b, [m.id]: true }));
                              notify(`Booked 15-min chat with ${m.name}!`);
                            }}
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${booked
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950'
                              }`}
                          >
                            {booked ? 'Booked ✓' : 'Book 15m'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* 4. NOTIFICATIONS -> Option 6 (Quick Priority Channels & Saved) */}
          {section === 'notifications' && (
            <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-[#2563EB]" />
                Priority Alert Channels
              </h3>
              {[
                { label: 'Alumni Referral Drops', sub: 'Instant push enabled' },
                { label: 'Research Guidance Replies', sub: 'Instant push enabled' },
                { label: 'Mentor Office Hours', sub: 'Sunday 9:00 AM digest' },
              ].map((ch) => (
                <div
                  key={ch.label}
                  className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-3 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold">{ch.label}</div>
                    <div className="text-[10px] text-[#52525B] dark:text-zinc-400">
                      {ch.sub}
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                    On
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 5. MY PROFILE -> Option 1 (Profile Strength + Endorsed By Alumni) */}
          {section === 'profile' && (
            <>
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[#2563EB]" />
                  Profile Strength &amp; Reach
                </h3>
                <div className="rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-3 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold">92% Complete</div>
                    <div className="text-[10px] text-[#52525B]">Add 1 preprint for 100%</div>
                  </div>
                  <Link
                    href="/share-project"
                    className="rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-2.5 py-1 text-[10px] font-semibold"
                  >
                    Boost
                  </Link>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* CASE STUDY MODAL */}
      {caseStudyItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold text-[#2563EB]">
                  {caseStudyItem.domain}
                </span>
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

      {/* SHARE PROJECT MODAL */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handlePublishBuild}
            className="w-full max-w-md rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Share a Student Project</h3>
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Project Name"
              className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
            />
            <input
              type="text"
              required
              value={newSubtitle}
              onChange={(e) => setNewSubtitle(e.target.value)}
              placeholder="One-line value proposition"
              className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
            />
            <textarea
              rows={3}
              value={newStory}
              onChange={(e) => setNewStory(e.target.value)}
              placeholder="Tell alumni what problem you solved & what feedback you want..."
              className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
            />
            <input
              type="text"
              value={newTags}
              onChange={(e) => setNewTags(e.target.value)}
              placeholder="Skills (comma-separated)"
              className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-1.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-5 py-1.5 text-xs font-semibold"
              >
                Publish
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
