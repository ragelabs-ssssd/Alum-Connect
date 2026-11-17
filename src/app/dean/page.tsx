'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  Compass,
  ExternalLink,
  FileCheck2,
  GitBranch,
  GraduationCap,
  Layers,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import {
  ALUMNI_CAREER,
  ALUMNI_DATA,
  INDIAN_GENERAL_IMAGES,
  OFFERS_DATA,
  PROJECTS_DATA,
  RESEARCH_PAPERS_DATA,
  STUDENTS_DATA,
  STUDENT_ACADEMICS,
  getIndianAvatar,
  getIndianBanner,
} from '../../data/alumConnectData';
import {
  PeopleDirectoryModal,
  PublicProfileModal,
  SelectedProfileTarget,
  findProfileByName,
} from '../../components/ProfileDirectoryModal';

type DeanSection = 'overview' | 'student-feed' | 'alumni-feed' | 'placements' | 'profile';

interface FeedItem {
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
  endorsedBy?: string;
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

const ALL_STUDENT_BUILDS: FeedItem[] = [
  ...PROJECTS_DATA.map((p, idx) => {
    const alum = ALUMNI_DATA.find((a) => a.linkedProjectIds.includes(p.id));
    return {
      id: p.id,
      title: p.name,
      subtitle: p.pitch,
      story: p.detailedDesc,
      impactMetric: p.linkedPaperId
        ? `${p.hostingPlatform} • Linked ${p.linkedPaperId}`
        : `${p.collaborationMode} (${p.teamSize}) • ${p.hostingPlatform}`,
      author: [p.leadName, ...p.coContributorsNames].join(' & '),
      batch: `${p.academicYears} • ITER`,
      domain: inferDomain(p.techStack, p.pitch),
      coverGradient: COVER_GRADIENTS[idx % COVER_GRADIENTS.length],
      coverImage: p.coverImage || INDIAN_GENERAL_IMAGES[idx % 3],
      authorAvatar: getIndianAvatar(p.leadName),
      tags: p.techStack.slice(0, 4),
      demoUrl: p.liveUrl,
      repoUrl: p.githubUrl,
      isPaper: false,
      endorsedBy: alum ? `${alum.fullName} (${alum.company})` : undefined,
    };
  }),
  ...RESEARCH_PAPERS_DATA.map((rp, idx) => {
    const alum = ALUMNI_DATA.find((a) => a.linkedPaperIds.includes(rp.id));
    return {
      id: rp.id,
      title: rp.topic,
      subtitle: `Research Paper • ${rp.venue} (${rp.status})`,
      story: rp.abstract,
      impactMetric: `${rp.status} • ${rp.venue}`,
      author: rp.coAuthorName ? `${rp.leadAuthorName} & ${rp.coAuthorName}` : rp.leadAuthorName,
      batch: `${rp.leadAuthorYearBranch} • ITER`,
      domain: 'Research Papers',
      coverGradient: COVER_GRADIENTS[(idx + 2) % COVER_GRADIENTS.length],
      coverImage: rp.coverImage,
      authorAvatar: getIndianAvatar(rp.leadAuthorName),
      tags: ['Research Paper', rp.domain, ...rp.techStack.slice(0, 2)],
      demoUrl: rp.preprintUrl,
      repoUrl: rp.codeRepoUrl,
      isPaper: true,
      endorsedBy: alum ? `${alum.fullName} (${alum.company})` : undefined,
    };
  }),
];

export default function DeanDashboardPage() {
  const [section, setSection] = useState<DeanSection>('overview');
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchScope, setSearchScope] = useState<'all' | 'students' | 'alumni'>('all');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [offerFilter, setOfferFilter] = useState<'All' | 'PPO' | 'Internship'>('All');
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});
  const [caseStudyItem, setCaseStudyItem] = useState<FeedItem | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<SelectedProfileTarget | null>(null);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const anyModalOpen = !!(caseStudyItem || selectedProfile || directoryOpen || reportModalOpen);
  useEffect(() => {
    if (!anyModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [anyModalOpen]);

  const toggleFollow = (id: string, name: string) => {
    setFollowedIds((prev) => {
      const next = !prev[id];
      notify(next ? `Following ${name}` : `Unfollowed ${name}`);
      return { ...prev, [id]: next };
    });
  };

  const openProfileByName = (name: string) => {
    const found = findProfileByName(name);
    if (found) setSelectedProfile(found);
  };

  // Institutional KPIs computed directly from actual dataset
  const totalOpenings = ALUMNI_DATA.reduce((sum, a) => sum + a.activeJobOpeningsCount, 0);
  const totalAlumExp = Object.values(ALUMNI_CAREER).reduce((sum, c) => sum + c.totalYears, 0);
  const avgCgpa = (
    Object.values(STUDENT_ACADEMICS).reduce((sum, s) => sum + s.cgpa, 0) / STUDENTS_DATA.length
  ).toFixed(2);
  const ppoCount = OFFERS_DATA.filter((o) => o.offerType === 'PPO').length;
  const internCount = OFFERS_DATA.filter((o) => o.offerType === 'Internship').length;

  const branchBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    STUDENTS_DATA.forEach((s) => {
      counts[s.branch] = (counts[s.branch] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  const topPerformingStudents = useMemo(() => {
    return STUDENTS_DATA.map((s) => {
      const extra = STUDENT_ACADEMICS[s.id];
      const offer = OFFERS_DATA.find((o) => o.studentId === s.id);
      const cgpa = extra?.cgpa ?? 8.8;
      const score = Math.round(
        cgpa * 7 + s.totalProjectsCount * 6 + s.researchPaperIds.length * 8 + (offer ? 12 : 0)
      );
      return { student: s, cgpa, offer, extra, score };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, []);

  const topContributingAlumni = useMemo(() => {
    return ALUMNI_DATA.map((a) => {
      const career = ALUMNI_CAREER[a.id];
      const impactScore =
        a.activeJobOpeningsCount * 10 +
        a.linkedStudentIds.length * 8 +
        a.linkedProjectIds.length * 6 +
        a.linkedPaperIds.length * 8 +
        (career?.totalYears ?? 6);
      return { alumni: a, career, impactScore };
    })
      .sort((a, b) => b.impactScore - a.impactScore)
      .slice(0, 6);
  }, []);

  const projectDomainChart = useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_STUDENT_BUILDS.forEach((b) => {
      counts[b.domain] = (counts[b.domain] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, []);

  const downloadCsvReport = () => {
    const rows = [
      ['Type', 'ID', 'Name', 'Department/Company', 'Metric/Package', 'Projects/Openings'],
      ...STUDENTS_DATA.map((s) => {
        const extra = STUDENT_ACADEMICS[s.id];
        const offer = OFFERS_DATA.find((o) => o.studentId === s.id);
        return [
          'Student',
          s.id,
          s.fullName,
          `${s.academicYear} ${s.branch}`,
          `CGPA ${extra?.cgpa ?? ''} | ${offer ? `${offer.offerType} ${offer.company} (${offer.packageStr})` : 'Active Builder'}`,
          s.projectIds.join(' '),
        ];
      }),
      ...ALUMNI_DATA.map((a) => [
        'Alumni',
        a.id,
        a.fullName,
        `${a.designation} @ ${a.company}`,
        `Batch ${a.batchYear} | ${ALUMNI_CAREER[a.id]?.totalYears ?? 8} yrs`,
        `${a.activeJobOpeningsCount} openings | Mentoring ${a.linkedStudentIds.join(' ')}`,
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ITER-AlumConnect-Executive-Report.csv';
    link.click();
    URL.revokeObjectURL(url);
    notify('Downloaded ITER-AlumConnect-Executive-Report.csv');
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
    return ALL_STUDENT_BUILDS.filter((b) =>
      `${b.title} ${b.subtitle} ${b.author} ${b.tags.join(' ')}`.toLowerCase().includes(q)
    ).slice(0, 3);
  }, [search]);

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

  const visibleBuilds = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ALL_STUDENT_BUILDS.filter((b) => {
      if (selectedDomain !== 'All' && b.domain !== selectedDomain) return false;
      if (!q) return true;
      return `${b.title} ${b.subtitle} ${b.story} ${b.author} ${b.tags.join(' ')}`
        .toLowerCase()
        .includes(q);
    });
  }, [selectedDomain, search]);

  const visibleOffers = useMemo(() => {
    if (offerFilter === 'All') return OFFERS_DATA;
    return OFFERS_DATA.filter((o) => o.offerType === offerFilter);
  }, [offerFilter]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-[#09090B] text-[#09090B] dark:text-zinc-100 transition-colors">
      {/* ==================== STICKY TOP NAVBAR ==================== */}
      <header className="sticky top-0 z-40 border-b border-[#E4E4E7] dark:border-zinc-800 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-15 flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center gap-3">
          {/* 1. Logo + LinkedIn-style Global Search */}
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
                    {quickPeopleMatches.map((item) => {
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
                            <div className="text-xs font-bold truncate">{renderHighlighted(name)}</div>
                            <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                              {sub}
                            </div>
                          </div>
                          <span className="shrink-0 rounded-full bg-blue-50 dark:bg-sky-500/10 text-[#2563EB] px-2 py-0.5 text-[9px] font-bold">
                            {item.kind === 'alumni' ? 'Alum' : 'Student'}
                          </span>
                        </button>
                      );
                    })}
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
                            <div className="text-xs font-semibold truncate">{renderHighlighted(b.title)}</div>
                            <div className="text-[10px] text-[#52525B] truncate">
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

          {/* 3. 5-Tab Bar */}
          <nav
            aria-label="Dean workspace sections"
            className="hidden lg:flex items-center justify-self-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-1"
          >
            {[
              { id: 'overview' as DeanSection, label: 'Executive Overview', icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { id: 'student-feed' as DeanSection, label: 'Student Feed', icon: <Compass className="w-3.5 h-3.5" /> },
              { id: 'alumni-feed' as DeanSection, label: 'Alumni Feed', icon: <Building2 className="w-3.5 h-3.5" /> },
              { id: 'placements' as DeanSection, label: 'Placements & Offers', icon: <Award className="w-3.5 h-3.5" /> },
              { id: 'profile' as DeanSection, label: 'Dean Profile', icon: <User className="w-3.5 h-3.5" /> },
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
                </button>
              );
            })}
          </nav>

          {/* 4. People Directory + ThemeToggle */}
          <div className="flex items-center gap-2 shrink-0 lg:justify-self-end">
            <button
              type="button"
              onClick={() => setDirectoryOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#2563EB] px-3 py-1.5 text-xs font-semibold transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="hidden sm:inline">People</span>
            </button>
            <ThemeToggle compact />
          </div>
        </div>

        {/* Mobile / Tablet 5-Tab Subbar */}
        <div className="lg:hidden border-t border-[#E4E4E7] dark:border-zinc-800 px-3 py-2 flex items-center gap-1.5 overflow-x-auto">
          {[
            { id: 'overview' as DeanSection, label: 'Overview' },
            { id: 'student-feed' as DeanSection, label: 'Student Feed' },
            { id: 'alumni-feed' as DeanSection, label: 'Alumni Feed' },
            { id: 'placements' as DeanSection, label: 'Placements' },
            { id: 'profile' as DeanSection, label: 'Dean Profile' },
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
        {/* LEFT RAIL (Hidden on Dean Profile tab so main expands) */}
        {section !== 'profile' && (
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {/* Clickable Dean Mini Card */}
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
                  src={getIndianBanner(0)}
                  alt="ITER SOA Campus"
                  className="h-full w-full object-cover opacity-45"
                />
              </div>
              <div className="px-5 pb-5 -mt-8 space-y-3 relative z-10">
                <img
                  src="/images/indian-alumni-mentor.jpg"
                  alt="Dean T&P Cell"
                  className="h-14 w-14 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-xs bg-[#18181B]"
                />
                <div className="space-y-0.5">
                  <h2 className="text-sm font-bold">Dean &amp; T&amp;P Cell • ITER</h2>
                  <p className="text-xs text-[#52525B] dark:text-zinc-400">
                    Siksha &apos;O&apos; Anusandhan University
                  </p>
                  <p className="text-xs text-[#09090B] dark:text-zinc-200 pt-0.5">
                    Real-time oversight across {STUDENTS_DATA.length} students &amp; {ALUMNI_DATA.length} alumni mentors
                  </p>
                </div>
                <div className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-3 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="rounded-lg bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 p-2">
                    <div className="text-sm font-bold text-[#2563EB]">{avgCgpa}</div>
                    <div className="text-[10px] text-[#52525B]">Avg CGPA</div>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 p-2">
                    <div className="text-sm font-bold text-emerald-600">{OFFERS_DATA.length}</div>
                    <div className="text-[10px] text-[#52525B]">Verified Offers</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cohort Benchmarks */}
            <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-2.5 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
                Cohort Benchmarks
              </h3>
              {[
                { label: 'Class X / XII Avg', val: '92.7% / 90.8%' },
                { label: 'Alumni Industry Exp', val: `${totalAlumExp} yrs (9.4 avg)` },
                { label: 'Startup Founders', val: '3 Active CTO/CEOs' },
                { label: 'Direct Hiring Leaders', val: '9 Alumni' },
              ].map((b) => (
                <div
                  key={b.label}
                  className="rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-2.5 flex items-center justify-between text-xs"
                >
                  <span className="text-[#52525B] dark:text-zinc-400">{b.label}</span>
                  <span className="font-bold">{b.val}</span>
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* CENTER STAGE */}
        <main className={section === 'profile' ? 'lg:col-span-9 space-y-5' : 'lg:col-span-6 space-y-5'}>
          {section === 'overview' && (
            <>
              {/* Executive Hero */}
              <div className="rounded-3xl bg-[#111318] text-white p-6 sm:p-7 space-y-4 shadow-md border border-zinc-800">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1 text-[11px] font-semibold text-sky-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  Executive Institutional Telemetry
                </span>
                <h1 className="text-xl sm:text-2xl font-bold leading-snug">
                  {PROJECTS_DATA.length} Student Builds, {RESEARCH_PAPERS_DATA.length} Research Papers &amp; {OFFERS_DATA.length} Verified Offers.
                </h1>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
                  High-level campus visibility across every student project, research publication, alumni mentorship thread, and placement outcome. Click any tab or person to drill down.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-2 text-xs font-bold transition-colors"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    Check Proper Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setSection('student-feed')}
                    className="rounded-full bg-[#2563EB] hover:bg-blue-500 text-white px-4 py-2 text-xs font-semibold"
                  >
                    Inspect Student Feed
                  </button>
                  <button
                    type="button"
                    onClick={() => setSection('alumni-feed')}
                    className="rounded-full border border-white/25 hover:bg-white/10 text-white px-4 py-2 text-xs font-semibold"
                  >
                    Inspect Alumni Activity
                  </button>
                  <button
                    type="button"
                    onClick={() => setSection('placements')}
                    className="rounded-full border border-white/25 hover:bg-white/10 text-white px-4 py-2 text-xs font-semibold"
                  >
                    Placement Audit ({OFFERS_DATA.length})
                  </button>
                </div>
              </div>

              {/* 4 High-Level KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                  <div className="text-2xl font-bold text-[#2563EB]">{PROJECTS_DATA.length}</div>
                  <div className="text-xs font-semibold mt-0.5">Live Projects</div>
                  <div className="text-[10px] text-[#52525B]">+{RESEARCH_PAPERS_DATA.length} Papers</div>
                </div>
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                  <div className="text-2xl font-bold">{STUDENTS_DATA.length}</div>
                  <div className="text-xs font-semibold mt-0.5">Active Students</div>
                  <div className="text-[10px] text-[#52525B]">{avgCgpa} Avg CGPA</div>
                </div>
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {ALUMNI_DATA.length}
                  </div>
                  <div className="text-xs font-semibold mt-0.5">Alumni Mentors</div>
                  <div className="text-[10px] text-[#52525B]">{totalOpenings} Direct Openings</div>
                </div>
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                  <div className="text-2xl font-bold text-emerald-600">{OFFERS_DATA.length}</div>
                  <div className="text-xs font-semibold mt-0.5">Verified Offers</div>
                  <div className="text-[10px] text-[#52525B]">
                    {ppoCount} PPOs • {internCount} Interns
                  </div>
                </div>
              </div>

              {/* Branch Distribution & Research Tracker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <BarChart3 className="w-3.5 h-3.5 text-[#2563EB]" />
                    What Students Are Building (50 Builds)
                  </h2>
                  <div className="space-y-2.5">
                    {projectDomainChart.map(([domain, count]) => {
                      const pct = Math.round((count / ALL_STUDENT_BUILDS.length) * 100);
                      return (
                        <div key={domain} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span>{domain}</span>
                            <span className="text-[#2563EB]">{count} ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#F4F4F5] dark:bg-zinc-800 overflow-hidden">
                            <div className="h-2 rounded-full bg-[#2563EB]" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
                    Student Cohort by Branch ({STUDENTS_DATA.length})
                  </h2>
                  <div className="space-y-2.5">
                    {branchBreakdown.map(([branch, count]) => {
                      const pct = Math.round((count / STUDENTS_DATA.length) * 100);
                      return (
                        <div key={branch} className="space-y-1 text-xs">
                          <div className="flex justify-between font-semibold">
                            <span>{branch}</span>
                            <span className="text-emerald-600">{count} students ({pct}%)</span>
                          </div>
                          <div className="h-2 rounded-full bg-[#F4F4F5] dark:bg-zinc-800 overflow-hidden">
                            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* CHART MODE: TOP-PERFORMING STUDENTS & TOP-CONTRIBUTING ALUMNI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#2563EB]" />
                      Top-Performing Students
                    </h2>
                    <span className="text-[10px] font-semibold text-[#52525B]">CGPA + Builds + Offers</span>
                  </div>
                  <div className="space-y-2.5">
                    {topPerformingStudents.map(({ student, cgpa, offer, score }) => {
                      const maxScore = topPerformingStudents[0]?.score || 100;
                      const pct = Math.round((score / maxScore) * 100);
                      return (
                        <button
                          key={student.id}
                          type="button"
                          onClick={() => setSelectedProfile({ kind: 'student', student })}
                          className="w-full text-left space-y-1 group"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="flex items-center gap-2 min-w-0">
                              <img
                                src={getIndianAvatar(student.fullName)}
                                alt={student.fullName}
                                className="h-6 w-6 rounded-full object-cover shrink-0"
                              />
                              <span className="font-bold truncate group-hover:text-[#2563EB]">
                                {student.fullName}
                              </span>
                            </span>
                            <span className="shrink-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-500/15 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                              {cgpa} • {offer ? `${offer.company} ${offer.offerType}` : `${student.totalProjectsCount} Builds`}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#F4F4F5] dark:bg-zinc-800 overflow-hidden">
                            <div className="h-1.5 rounded-full bg-[#2563EB]" style={{ width: `${pct}%` }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                      Top-Contributing Alumni
                    </h2>
                    <span className="text-[10px] font-semibold text-[#52525B]">Mentoring + Openings</span>
                  </div>
                  <div className="space-y-2.5">
                    {topContributingAlumni.map(({ alumni, impactScore }) => {
                      const maxImpact = topContributingAlumni[0]?.impactScore || 100;
                      const pct = Math.round((impactScore / maxImpact) * 100);
                      return (
                        <button
                          key={alumni.id}
                          type="button"
                          onClick={() => setSelectedProfile({ kind: 'alumni', alumni })}
                          className="w-full text-left space-y-1 group"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="flex items-center gap-2 min-w-0">
                              <img
                                src={getIndianAvatar(alumni.fullName)}
                                alt={alumni.fullName}
                                className="h-6 w-6 rounded-full object-cover shrink-0"
                              />
                              <span className="font-bold truncate group-hover:text-[#2563EB]">
                                {alumni.fullName}
                              </span>
                            </span>
                            <span className="shrink-0 text-[10px] font-bold text-indigo-700 bg-indigo-50 dark:bg-indigo-500/15 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                              {alumni.company} • {alumni.activeJobOpeningsCount} roles
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#F4F4F5] dark:bg-zinc-800 overflow-hidden">
                            <div className="h-1.5 rounded-full bg-indigo-600" style={{ width: `${pct}%` }} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Research Tracker */}
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                  Research Publications ({RESEARCH_PAPERS_DATA.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {RESEARCH_PAPERS_DATA.map((rp) => (
                    <button
                      key={rp.id}
                      type="button"
                      onClick={() => openProfileByName(rp.leadAuthorName)}
                      className="w-full text-left rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-2.5 flex items-center justify-between gap-2 text-xs hover:border-[#2563EB] border border-transparent"
                    >
                      <div className="min-w-0">
                        <div className="font-bold truncate">{rp.topic}</div>
                        <div className="text-[10px] text-[#52525B] truncate">
                          {rp.leadAuthorName} • {rp.venue}
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                        {rp.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {section === 'student-feed' && (
            <>
              <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg font-bold">
                    Student Feed Oversight ({visibleBuilds.length} Builds &amp; Papers)
                  </h1>
                  <p className="text-xs text-[#52525B] dark:text-zinc-400">
                    Click any student author or project to inspect full academic, club, and code proof.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDirectoryOpen(true)}
                  className="rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-1.5 text-xs font-semibold"
                >
                  All {STUDENTS_DATA.length} Students →
                </button>
              </div>

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

              <div className="space-y-4">
                {visibleBuilds.map((build) => (
                  <article
                    key={build.id}
                    className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-2xs"
                  >
                    <div
                      className={`relative overflow-hidden bg-gradient-to-br ${build.coverGradient} p-5 text-white flex flex-col justify-between min-h-[132px]`}
                    >
                      <img
                        src={build.coverImage}
                        alt={build.title}
                        className="absolute inset-0 h-full w-full object-cover opacity-30"
                      />
                      <div className="relative z-10 flex items-center justify-between gap-2 text-xs">
                        <span className="rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 font-medium">
                          {build.domain}
                        </span>
                        <span className="rounded-full bg-white/15 backdrop-blur px-2.5 py-0.5 text-[11px] font-semibold">
                          {build.impactMetric}
                        </span>
                      </div>
                      <div className="relative z-10 pt-3 flex items-end justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold leading-tight">{build.title}</h2>
                          <p className="text-xs text-white/80 mt-0.5">{build.subtitle}</p>
                        </div>
                        <a
                          href={build.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white text-[#09090B] px-3 py-1.5 text-[11px] font-bold"
                        >
                          Live <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => openProfileByName(build.author)}
                          className="flex items-center gap-2 text-xs hover:text-[#2563EB] text-left"
                        >
                          <img
                            src={build.authorAvatar}
                            alt={build.author}
                            className="h-7 w-7 rounded-full object-cover border border-[#E4E4E7]"
                          />
                          <span>
                            <strong className="hover:underline">{build.author}</strong>{' '}
                            <span className="text-[#52525B]">• {build.batch}</span>
                          </span>
                        </button>
                        {build.endorsedBy && (
                          <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold">
                            Endorsed by {build.endorsedBy}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#52525B] dark:text-zinc-300 leading-relaxed">
                        {build.story}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E7] dark:border-zinc-800 text-xs">
                        <a
                          href={build.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[#52525B] hover:text-[#2563EB] font-semibold"
                        >
                          <GitBranch className="w-3.5 h-3.5" /> GitHub Repo
                        </a>
                        <button
                          type="button"
                          onClick={() => setCaseStudyItem(build)}
                          className="font-semibold text-[#2563EB] hover:underline"
                        >
                          Inspect Case Study →
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {section === 'alumni-feed' && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-5 space-y-1">
                <h1 className="text-lg font-bold">
                  Alumni Mentors &amp; Hiring Leaders ({ALUMNI_DATA.length})
                </h1>
                <p className="text-xs text-[#52525B] dark:text-zinc-400">
                  {totalAlumExp} collective years of experience • {totalOpenings} active openings • Click any alumnus to view full career &amp; mentorship activity.
                </p>
              </div>
              <div className="space-y-3">
                {ALUMNI_DATA.map((a) => {
                  const career = ALUMNI_CAREER[a.id];
                  return (
                    <div
                      key={a.id}
                      className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedProfile({ kind: 'alumni', alumni: a })}
                          className="flex items-center gap-3 text-left hover:text-[#2563EB]"
                        >
                          <img
                            src={getIndianAvatar(a.fullName)}
                            alt={a.fullName}
                            className="h-11 w-11 rounded-xl object-cover border border-[#E4E4E7]"
                          />
                          <div>
                            <div className="text-sm font-bold hover:underline">{a.fullName}</div>
                            <div className="text-xs text-[#52525B] dark:text-zinc-400">
                              {a.designation} @ <strong>{a.company}</strong> • Batch &apos;{String(a.batchYear).slice(-2)}
                            </div>
                          </div>
                        </button>
                        <div className="flex items-center gap-2">
                          {career && (
                            <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 text-[10px] font-semibold">
                              {career.totalYears} yrs exp
                            </span>
                          )}
                          {a.canPostJobs && (
                            <span className="rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold">
                              {a.activeJobOpeningsCount} Openings
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-[#52525B] dark:text-zinc-300">
                        <strong>Mentorship:</strong> {a.mentorshipScope}
                        {career ? ` • Early: ${career.earlyCareer} → Mid: ${career.midCareer}` : ''}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E4E4E7] dark:border-zinc-800 text-[11px]">
                        <div className="flex flex-wrap gap-1.5">
                          {a.linkedStudentIds.map((sid) => {
                            const st = STUDENTS_DATA.find((s) => s.id === sid);
                            if (!st) return null;
                            return (
                              <button
                                key={sid}
                                type="button"
                                onClick={() => setSelectedProfile({ kind: 'student', student: st })}
                                className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 font-medium hover:text-[#2563EB]"
                              >
                                Mentoring: {st.fullName}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedProfile({ kind: 'alumni', alumni: a })}
                          className="font-semibold text-[#2563EB] hover:underline"
                        >
                          View Full Activity →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {section === 'placements' && (
            <div className="space-y-4">
              <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-lg font-bold">
                    Verified Placement &amp; Internship Offers ({visibleOffers.length})
                  </h1>
                  <p className="text-xs text-[#52525B] dark:text-zinc-400">
                    {ppoCount} Confirmed PPOs • {internCount} Research &amp; Tech Internships • Click candidate or alumnus to audit.
                  </p>
                </div>
                <div className="flex gap-1.5">
                  {(['All', 'PPO', 'Internship'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setOfferFilter(f)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        offerFilter === f
                          ? 'bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950'
                          : 'bg-white dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 text-[#52525B]'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {visibleOffers.map((o) => {
                  const alum = ALUMNI_DATA.find((a) => a.id === o.referringAlumniId);
                  return (
                    <div
                      key={o.id}
                      className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex flex-wrap items-center justify-between gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => openProfileByName(o.studentName)}
                        className="flex items-center gap-3 text-left hover:text-[#2563EB]"
                      >
                        <img
                          src={getIndianAvatar(o.studentName)}
                          alt={o.studentName}
                          className="h-10 w-10 rounded-full object-cover border border-[#E4E4E7]"
                        />
                        <div>
                          <div className="text-sm font-bold hover:underline">
                            {o.studentName}{' '}
                            <span className="text-[11px] font-normal text-[#52525B]">
                              ({o.academicYearBranch})
                            </span>
                          </div>
                          <div className="text-xs text-[#52525B] dark:text-zinc-400">
                            <strong>{o.company}</strong> — {o.jobRole}
                          </div>
                        </div>
                      </button>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {alum && (
                          <button
                            type="button"
                            onClick={() => setSelectedProfile({ kind: 'alumni', alumni: alum })}
                            className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-1 text-[11px] font-medium hover:text-[#2563EB]"
                          >
                            Ref: {alum.fullName}
                          </button>
                        )}
                        <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-[11px] font-bold">
                          {o.packageStr} • {o.offerType}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {section === 'profile' && (
            <div className="space-y-5">
              <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
                <div className="relative h-28 overflow-hidden bg-gradient-to-r from-[#09090B] via-slate-800 to-[#2563EB]">
                  <img
                    src={getIndianBanner(0)}
                    alt="ITER SOA Campus Banner"
                    className="h-full w-full object-cover opacity-45"
                  />
                </div>
                <div className="px-6 pb-6 -mt-10 space-y-4 relative z-10">
                  <img
                    src="/images/indian-alumni-mentor.jpg"
                    alt="Dean T&P Cell"
                    className="h-20 w-20 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-sm bg-[#18181B]"
                  />
                  <div>
                    <h1 className="text-xl font-bold">Dean &amp; Training &amp; Placement Cell</h1>
                    <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-400">
                      Institute of Technical Education &amp; Research (ITER), Siksha &apos;O&apos; Anusandhan, Bhubaneswar
                    </p>
                    <p className="text-xs text-[#52525B] dark:text-zinc-300 mt-2">
                      Institutional governance &amp; audit hub verifying {PROJECTS_DATA.length} student builds, {RESEARCH_PAPERS_DATA.length} research papers, {ALUMNI_DATA.length} alumni mentors, and {OFFERS_DATA.length} placement offers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5 text-xs">
                  <h2 className="font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-[#2563EB]" />
                    Verification &amp; Audit Summary
                  </h2>
                  <div className="flex justify-between py-1 border-b border-[#E4E4E7] dark:border-zinc-800">
                    <span>Total Verified Student Profiles</span>
                    <strong>{STUDENTS_DATA.length} (Avg CGPA {avgCgpa})</strong>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#E4E4E7] dark:border-zinc-800">
                    <span>Verified Alumni Mentors</span>
                    <strong>{ALUMNI_DATA.length} ({totalAlumExp} yrs exp)</strong>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Confirmed PPOs + Internships</span>
                    <strong>{ppoCount} PPOs + {internCount} Internships</strong>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5 text-xs">
                  <h2 className="font-bold uppercase tracking-wider text-[#52525B] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#2563EB]" />
                    Quick Institutional Actions
                  </h2>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setDirectoryOpen(true)}
                      className="rounded-full bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950 px-4 py-1.5 font-semibold"
                    >
                      Open Full People Directory
                    </button>
                    <button
                      type="button"
                      onClick={() => notify('Exported verified T&P cohort audit report (CSV)!')}
                      className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-1.5 font-semibold"
                    >
                      Export Audit Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT RAIL */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#2563EB]" />
                Latest Verified Offers
              </h3>
              <button
                type="button"
                onClick={() => setSection('placements')}
                className="text-[11px] font-semibold text-[#2563EB] hover:underline"
              >
                See all
              </button>
            </div>
            {OFFERS_DATA.slice(0, 4).map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => openProfileByName(o.studentName)}
                className="w-full text-left rounded-xl bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 p-2.5 flex items-center justify-between gap-2 text-xs hover:border-[#2563EB]"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={getIndianAvatar(o.studentName)}
                    alt={o.studentName}
                    className="h-7 w-7 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-bold truncate">{o.studentName}</div>
                    <div className="text-[10px] text-[#52525B] truncate">{o.company}</div>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                  {o.packageStr}
                </span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
              Top Student Honors
            </h3>
            {STUDENTS_DATA.slice(0, 4).map((st) => {
              const extra = STUDENT_ACADEMICS[st.id];
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setSelectedProfile({ kind: 'student', student: st })}
                  className="w-full text-left rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-2.5 space-y-0.5 text-xs hover:border-[#2563EB] border border-transparent"
                >
                  <div className="font-bold">{st.fullName} • {extra?.cgpa} CGPA</div>
                  <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                    {extra?.achievement}
                  </div>
                </button>
              );
            })}
          </div>
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
            const match = ALL_STUDENT_BUILDS.find((b) => b.id === projectId);
            if (match) setCaseStudyItem(match);
          }}
          onGoToJobs={() => setSection('placements')}
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

      {/* PROPER EXECUTIVE REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#E4E4E7] dark:border-zinc-800 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Institutional Report • ITER, SOA
                </span>
                <h2 className="text-xl font-bold mt-1">
                  Dean &amp; T&amp;P Cell — Cohort Performance &amp; Placement Report
                </h2>
                <p className="text-xs text-[#52525B] dark:text-zinc-400">
                  Live audit across {STUDENTS_DATA.length} students, {PROJECTS_DATA.length} projects, {RESEARCH_PAPERS_DATA.length} papers, {ALUMNI_DATA.length} alumni &amp; {OFFERS_DATA.length} verified offers.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={downloadCsvReport}
                  className="rounded-full bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-1.5 text-xs font-semibold"
                >
                  Download CSV Report
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-1.5 text-xs font-semibold"
                >
                  Print / PDF
                </button>
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="rounded-lg border border-[#E4E4E7] dark:border-zinc-700 p-1.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Summary KPIs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-2xl bg-[#F4F4F5] dark:bg-zinc-800 p-3">
                <div className="text-lg font-bold">{STUDENTS_DATA.length} Students</div>
                <div className="text-[11px] text-[#52525B]">Avg CGPA {avgCgpa}</div>
              </div>
              <div className="rounded-2xl bg-[#F4F4F5] dark:bg-zinc-800 p-3">
                <div className="text-lg font-bold text-[#2563EB]">{PROJECTS_DATA.length + RESEARCH_PAPERS_DATA.length} Builds</div>
                <div className="text-[11px] text-[#52525B]">{PROJECTS_DATA.length} Projects + {RESEARCH_PAPERS_DATA.length} Papers</div>
              </div>
              <div className="rounded-2xl bg-[#F4F4F5] dark:bg-zinc-800 p-3">
                <div className="text-lg font-bold text-indigo-600">{ALUMNI_DATA.length} Alumni</div>
                <div className="text-[11px] text-[#52525B]">{totalAlumExp} Yrs Exp • {totalOpenings} Openings</div>
              </div>
              <div className="rounded-2xl bg-[#F4F4F5] dark:bg-zinc-800 p-3">
                <div className="text-lg font-bold text-emerald-600">{OFFERS_DATA.length} Offers</div>
                <div className="text-[11px] text-[#52525B]">{ppoCount} PPOs • {internCount} Interns</div>
              </div>
            </div>

            {/* Top Students Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
                Top-Performing Students (CGPA, Builds &amp; Placements)
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-[#E4E4E7] dark:border-zinc-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F4F5] dark:bg-zinc-800 text-[11px]">
                    <tr>
                      <th className="px-3 py-2">Student</th>
                      <th className="px-3 py-2">Year / Branch</th>
                      <th className="px-3 py-2">CGPA</th>
                      <th className="px-3 py-2">Builds &amp; Honors</th>
                      <th className="px-3 py-2">Placement Outcome</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E4E7] dark:divide-zinc-800">
                    {topPerformingStudents.map(({ student, cgpa, offer, extra }) => (
                      <tr key={student.id}>
                        <td className="px-3 py-2 font-bold">{student.fullName}</td>
                        <td className="px-3 py-2">{student.academicYear} {student.branch}</td>
                        <td className="px-3 py-2 font-semibold text-[#2563EB]">{cgpa.toFixed(2)}</td>
                        <td className="px-3 py-2">{student.totalProjectsCount} Projects • {extra?.achievement}</td>
                        <td className="px-3 py-2 font-semibold text-emerald-700">
                          {offer ? `${offer.offerType} • ${offer.company} (${offer.packageStr})` : 'In Pipeline'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Contributing Alumni Table */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
                Top-Contributing Alumni (Time, Mentorship &amp; Hiring)
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-[#E4E4E7] dark:border-zinc-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4F4F5] dark:bg-zinc-800 text-[11px]">
                    <tr>
                      <th className="px-3 py-2">Alumnus</th>
                      <th className="px-3 py-2">Company &amp; Role</th>
                      <th className="px-3 py-2">Batch / Exp</th>
                      <th className="px-3 py-2">Mentorship Scope</th>
                      <th className="px-3 py-2">Openings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E4E4E7] dark:divide-zinc-800">
                    {topContributingAlumni.map(({ alumni, career }) => (
                      <tr key={alumni.id}>
                        <td className="px-3 py-2 font-bold">{alumni.fullName}</td>
                        <td className="px-3 py-2">{alumni.designation} @ {alumni.company}</td>
                        <td className="px-3 py-2">&apos;{String(alumni.batchYear).slice(-2)} ({career?.totalYears} yrs)</td>
                        <td className="px-3 py-2">{alumni.mentorshipScope}</td>
                        <td className="px-3 py-2 font-bold text-[#2563EB]">{alumni.activeJobOpeningsCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
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
