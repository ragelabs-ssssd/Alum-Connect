'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Compass,
  Download,
  ExternalLink,
  FlaskConical,
  GitBranch,
  Layers,
  Play,
  Plus,
  Rocket,
  Search,
  ShieldCheck,
  ThumbsUp,
  Users,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import {
  ACQUI_HIRE_INQUIRIES,
  ALUMNI_CRITIQUES,
  AlumniCritiqueRecord,
  JOB_REFERRALS_32,
  OFFICE_HOURS,
  PROJECTS_DATA,
  ProjectRecord,
  RESEARCH_PAPERS_DATA,
  SQUAD_OPENINGS,
  UNIFIED_ALUMNI,
  UNIFIED_OFFERS,
  UNIFIED_STUDENTS,
  getIndianAvatar,
} from '../../data/alumConnectData';
import {
  PublicProfileModal,
  SelectedProfileTarget,
} from '../../components/ProfileDirectoryModal';
import {
  CommandSearchModal,
  ProjectInspectorDrawer,
  ShareProjectStudioModal,
} from '../../components/CommandCenterModals';

type RoleKey = 'student' | 'mentor' | 'founder' | 'dean';
type NavView =
  | 'feed'
  | 'projects'
  | 'research'
  | 'referrals'
  | 'alumni'
  | 'placements'
  | 'dean-analytics';

const ROLE_PERSONAS: Record<
  RoleKey,
  { label: string; name: string; sub: string; regOrOrg: string; avatar: string }
> = {
  student: {
    label: 'Student Builder',
    name: UNIFIED_STUDENTS[0].fullName,
    sub: `${UNIFIED_STUDENTS[0].academicYear} ${UNIFIED_STUDENTS[0].branch} • ${UNIFIED_STUDENTS[0].academics.cgpa} CGPA`,
    regOrOrg: UNIFIED_STUDENTS[0].regNo,
    avatar: UNIFIED_STUDENTS[0].avatarUrl,
  },
  mentor: {
    label: 'Alumni Mentor',
    name: UNIFIED_ALUMNI[3].fullName,
    sub: `${UNIFIED_ALUMNI[3].designation} @ ${UNIFIED_ALUMNI[3].company}`,
    regOrOrg: `Batch '${String(UNIFIED_ALUMNI[3].batchYear).slice(-2)}`,
    avatar: UNIFIED_ALUMNI[3].avatarUrl,
  },
  founder: {
    label: 'Startup Founder / Recruiter',
    name: UNIFIED_ALUMNI[0].fullName,
    sub: `${UNIFIED_ALUMNI[0].designation} @ ${UNIFIED_ALUMNI[0].company}`,
    regOrOrg: `Batch '${String(UNIFIED_ALUMNI[0].batchYear).slice(-2)}`,
    avatar: UNIFIED_ALUMNI[0].avatarUrl,
  },
  dean: {
    label: 'Dean / Placement Admin',
    name: 'Dr. Raj Hota',
    sub: 'Dean, CDPC & Innovation • ITER SOA',
    regOrOrg: 'ADMIN-CDPC',
    avatar: '/images/indian-alumni-mentor.jpg',
  },
};

const HEATMAP_CELLS = [
  1, 2, 0, 3, 2, 4, 1, 2, 3, 1, 4, 2,
  0, 3, 4, 2, 1, 3, 2, 4, 1, 2, 3, 4,
  2, 1, 3, 4, 2, 0, 3, 2, 4, 3, 2, 1,
];

export default function CommandCenterPage() {
  const [role, setRole] = useState<RoleKey>('student');
  const [view, setView] = useState<NavView>('feed');
  const [projects, setProjects] = useState<ProjectRecord[]>(PROJECTS_DATA);
  const [critiques, setCritiques] = useState<AlumniCritiqueRecord[]>(ALUMNI_CRITIQUES);

  // Filters
  const [modeFilter, setModeFilter] = useState<'All' | 'Solo' | 'Group'>('All');
  const [hostFilter, setHostFilter] = useState<'All' | 'Vercel' | 'GitHub Pages'>('All');
  const [researchOnly, setResearchOnly] = useState(false);
  const [stackFilter, setStackFilter] = useState('');

  // Interactive States
  const [endorsedIds, setEndorsedIds] = useState<Record<string, boolean>>({});
  const [appliedRefs, setAppliedRefs] = useState<Record<string, boolean>>({});
  const [joinedSquads, setJoinedSquads] = useState<Record<string, boolean>>({});
  const [bookedOfficeHours, setBookedOfficeHours] = useState<Record<string, boolean>>({});
  const [scoutedSquads, setScoutedSquads] = useState<Record<string, boolean>>({});
  const [followedIds, setFollowedIds] = useState<Record<string, boolean>>({});

  // Modals & Drawers
  const [cmdOpen, setCmdOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [inspectedProject, setInspectedProject] = useState<ProjectRecord | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<SelectedProfileTarget | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (role === 'dean') setView('dean-analytics');
    else if (view === 'dean-analytics') setView('feed');
  }, [role, view]);

  const anyModalOpen = !!(cmdOpen || shareOpen || inspectedProject || selectedProfile);
  useEffect(() => {
    if (!anyModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [anyModalOpen]);

  const filteredProjects = useMemo(() => {
    const q = stackFilter.trim().toLowerCase();
    return projects.filter((p) => {
      if (modeFilter !== 'All' && p.collaborationMode !== modeFilter) return false;
      if (hostFilter !== 'All' && p.hostingPlatform !== hostFilter) return false;
      if (researchOnly && !p.linkedPaperId) return false;
      if (q && !`${p.name} ${p.pitch} ${p.techStack.join(' ')}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [projects, modeFilter, hostFilter, researchOnly, stackFilter]);

  const handlePublishProject = (newProj: ProjectRecord) => {
    setProjects((prev) => [newProj, ...prev]);
    notify(`Published ${newProj.id}: ${newProj.name} to Ecosystem Feed!`);
  };

  const handleAddCritique = (projectId: string, comment: string) => {
    const entry: AlumniCritiqueRecord = {
      id: `CRT-${Date.now()}`,
      projectId,
      alumniId: role === 'mentor' ? 'ALUM-04' : 'ALUM-01',
      alumniName: ROLE_PERSONAS[role].name,
      alumniRole: ROLE_PERSONAS[role].sub,
      comment,
      timestamp: 'Just now',
      endorsed: true,
    };
    setCritiques((prev) => [entry, ...prev]);
    notify('Posted technical critique & endorsement!');
  };

  const exportDeanCsv = () => {
    const rows = [
      ['Offer_ID', 'Student', 'Branch', 'Company', 'Role', 'Package', 'Type', 'Triggered_By_Project'],
      ...UNIFIED_OFFERS.map((o) => [
        o.id,
        o.studentName,
        o.academicYearBranch,
        o.company,
        o.jobRole,
        o.packageStr,
        o.offerType,
        o.triggeredByProjectId,
      ]),
    ];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AlumConnect-CDPC-Analytics.csv';
    a.click();
    URL.revokeObjectURL(url);
    notify('Exported AlumConnect-CDPC-Analytics.csv');
  };

  const persona = ROLE_PERSONAS[role];
  const studentProjectCount =
    projects.filter((p) => p.leadName === UNIFIED_STUDENTS[0].fullName).length;

  return (
    <div className="h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#09090B] text-[#09090B] dark:text-zinc-100 overflow-hidden">
      {/* ==================== 56px STICKY TOP BAR ==================== */}
      <header className="h-14 shrink-0 border-b border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#09090B] px-4 flex items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#F4F4F5] dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 p-1 flex items-center justify-center">
              <img src="/logo.png" alt="Alum Connect" className="h-full w-full object-contain dark:invert" />
            </div>
            <span className="text-sm font-bold tracking-tight hidden sm:inline">Alum Connect</span>
          </Link>
          <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-sky-500/10 border border-blue-200/70 dark:border-sky-500/30 px-2.5 py-0.5 text-[10px] font-bold text-[#2563EB] dark:text-sky-400">
            <ShieldCheck className="w-3 h-3" /> ITER × SOA
          </span>
        </div>

        {/* ⌘K Global Command Search */}
        <button
          type="button"
          onClick={() => setCmdOpen(true)}
          className="flex-1 max-w-md flex items-center justify-between gap-2 rounded-full border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 px-3.5 py-1.5 text-xs text-[#52525B] hover:border-[#2563EB] transition-colors"
        >
          <span className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Search 45 projects, 5 papers, 31 students, 14 alumni...</span>
          </span>
          <kbd className="hidden sm:inline-block rounded bg-white dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>

        {/* 4-Role Persona Switcher + Share Project CTA + Theme */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            aria-label="Active RBAC Persona"
            value={role}
            onChange={(e) => setRole(e.target.value as RoleKey)}
            className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#2563EB]"
          >
            <option value="student">Student Builder (STU-01)</option>
            <option value="mentor">Alumni Mentor (ALUM-04)</option>
            <option value="founder">Startup Founder (ALUM-01)</option>
            <option value="dean">Dean / Placement Admin</option>
          </select>

          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="inline-flex items-center gap-1 rounded-full bg-[#18181B] hover:bg-[#27272A] dark:bg-zinc-100 dark:text-zinc-950 text-white px-3.5 py-1.5 text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share Project</span>
          </button>

          <ThemeToggle compact />
        </div>
      </header>

      {/* ==================== 100vh WORKSPACE BODY ==================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* 240px STICKY LEFT NAVIGATION RAIL */}
        <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#09090B] p-4 space-y-5 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {/* Active Identity Card + 12-Week Heatmap */}
          <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#FAFAFA] dark:bg-zinc-900 p-3.5 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src={persona.avatar}
                alt={persona.name}
                className="h-10 w-10 rounded-xl object-cover border border-[#E4E4E7] dark:border-zinc-700 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold truncate">{persona.name}</div>
                <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                  {persona.sub}
                </div>
                <div className="font-mono text-[10px] text-[#2563EB] font-semibold">
                  {persona.regOrOrg}
                  {role === 'student' ? ` • ${studentProjectCount} Builds` : ''}
                </div>
              </div>
            </div>

            {/* 12-Week GitHub-Style Ship Heatmap */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] text-[#52525B]">
                <span>12-Week Ship Activity</span>
                <span className="font-mono text-emerald-600 font-semibold">Active</span>
              </div>
              <div className="grid grid-cols-12 gap-1">
                {HEATMAP_CELLS.map((lvl, idx) => (
                  <span
                    key={idx}
                    className={`h-2.5 rounded-[2px] ${
                      lvl === 0
                        ? 'bg-[#E4E4E7] dark:bg-zinc-800'
                        : lvl === 1
                          ? 'bg-emerald-200 dark:bg-emerald-900'
                          : lvl === 2
                            ? 'bg-emerald-400 dark:bg-emerald-700'
                            : lvl === 3
                              ? 'bg-emerald-500'
                              : 'bg-emerald-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Views */}
          <nav className="space-y-1 text-xs">
            {(
              [
                { id: 'feed', label: 'Ecosystem Feed', icon: <Compass className="w-3.5 h-3.5" /> },
                { id: 'projects', label: `Projects Launchpad (${projects.length})`, icon: <Rocket className="w-3.5 h-3.5" /> },
                { id: 'research', label: `Research Hub (${RESEARCH_PAPERS_DATA.length})`, icon: <FlaskConical className="w-3.5 h-3.5" /> },
                { id: 'referrals', label: `Referrals & Squad (${JOB_REFERRALS_32.length})`, icon: <Briefcase className="w-3.5 h-3.5" /> },
                { id: 'alumni', label: `Alumni Mentors (${UNIFIED_ALUMNI.length})`, icon: <Building2 className="w-3.5 h-3.5" /> },
                { id: 'placements', label: 'Placements & Acqui-Hires', icon: <Award className="w-3.5 h-3.5" /> },
                ...(role === 'dean'
                  ? [{ id: 'dean-analytics' as NavView, label: 'Dean & CDPC Analytics', icon: <BarChart3 className="w-3.5 h-3.5" /> }]
                  : []),
              ] as { id: NavView; label: string; icon: React.ReactNode }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 font-semibold transition-colors text-left ${
                  view === item.id
                    ? 'bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950'
                    : 'text-[#52525B] dark:text-zinc-400 hover:bg-[#F4F4F5] dark:hover:bg-zinc-900'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* CENTER WORKSPACE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Mobile View Switcher */}
          <div className="flex lg:hidden gap-1.5 overflow-x-auto pb-1">
            {(
              [
                { id: 'feed', label: 'Feed' },
                { id: 'projects', label: `Projects (${projects.length})` },
                { id: 'research', label: 'Research (5)' },
                { id: 'referrals', label: 'Referrals (32)' },
                { id: 'alumni', label: 'Alumni (14)' },
                { id: 'placements', label: 'Offers (10)' },
              ] as { id: NavView; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setView(t.id)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                  view === t.id ? 'bg-[#18181B] text-white' : 'bg-white border border-[#E4E4E7]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* 1 & 2. ECOSYSTEM FEED OR PROJECTS LAUNCHPAD */}
          {(view === 'feed' || view === 'projects') && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5">
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {(['All', 'Solo', 'Group'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setModeFilter(m)}
                      className={`rounded-full px-3 py-1 font-semibold ${
                        modeFilter === m ? 'bg-[#18181B] text-white' : 'bg-[#F4F4F5] text-[#52525B]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                  {(['All', 'Vercel', 'GitHub Pages'] as const).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHostFilter(h)}
                      className={`rounded-full px-3 py-1 font-semibold ${
                        hostFilter === h ? 'bg-[#2563EB] text-white' : 'bg-[#F4F4F5] text-[#52525B]'
                      }`}
                    >
                      {h === 'All' ? 'All Hosts' : h}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setResearchOnly((r) => !r)}
                    className={`rounded-full px-3 py-1 font-semibold ${
                      researchOnly ? 'bg-emerald-600 text-white' : 'bg-[#F4F4F5] text-[#52525B]'
                    }`}
                  >
                    Research-Backed Only
                  </button>
                </div>
                <input
                  type="text"
                  value={stackFilter}
                  onChange={(e) => setStackFilter(e.target.value)}
                  placeholder="Filter by Tech Stack..."
                  className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-1 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProjects.map((p) => {
                  const endorsed = !!endorsedIds[p.id];
                  const scouted = !!scoutedSquads[p.id];
                  return (
                    <article
                      key={p.id}
                      className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden flex flex-col justify-between shadow-2xs hover:border-[#2563EB] transition-colors"
                    >
                      <div>
                        <div className="relative h-28 bg-zinc-900 p-4 text-white flex flex-col justify-between">
                          <img
                            src={p.coverImage}
                            alt={p.name}
                            className="absolute inset-0 h-full w-full object-cover opacity-35"
                          />
                          <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                            <span className="rounded bg-white/15 backdrop-blur px-2 py-0.5 font-bold">
                              {p.id} • {p.collaborationMode} ({p.teamSize})
                            </span>
                            <span className="rounded bg-white/15 backdrop-blur px-2 py-0.5">
                              {p.hostingPlatform}
                            </span>
                          </div>
                          <div className="relative z-10 flex items-center justify-between gap-2">
                            <h2 className="text-base font-bold truncate">{p.name}</h2>
                            {p.linkedPaperId && (
                              <span className="shrink-0 rounded-full bg-emerald-500 text-zinc-950 px-2 py-0.5 font-mono text-[10px] font-bold">
                                {p.linkedPaperId}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-4 space-y-3">
                          <p className="text-xs font-semibold text-[#09090B] dark:text-zinc-100">
                            {p.pitch}
                          </p>
                          <p className="text-[11px] text-[#52525B] dark:text-zinc-400 line-clamp-2">
                            {p.shortDesc}
                          </p>

                          {/* Contributors with JetBrains Mono Reg Nos */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                            <button
                              type="button"
                              onClick={() => {
                                const st = UNIFIED_STUDENTS.find((s) => s.regNo === p.leadRegNo);
                                if (st) setSelectedProfile({ kind: 'student', student: st });
                              }}
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 hover:text-[#2563EB]"
                            >
                              <img
                                src={getIndianAvatar(p.leadName)}
                                alt={p.leadName}
                                className="h-4 w-4 rounded-full object-cover"
                              />
                              <span className="font-semibold">{p.leadName}</span>
                              <span className="font-mono text-[10px] text-[#52525B]">{p.leadRegNo}</span>
                            </button>
                            {p.coContributorsNames.map((co, i) => (
                              <span
                                key={co}
                                className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2 py-0.5 text-[10px]"
                              >
                                {co} <span className="font-mono text-[#52525B]">{p.coContributorsRegNos[i]}</span>
                              </span>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {p.techStack.map((t) => (
                              <span
                                key={t}
                                className="font-mono rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-2 py-0.5 text-[10px]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="px-4 py-3 border-t border-[#E4E4E7] dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <a
                            href={p.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] px-2.5 py-1 font-semibold hover:border-[#2563EB]"
                          >
                            Live <ExternalLink className="w-3 h-3" />
                          </a>
                          <a
                            href={p.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] px-2.5 py-1 font-semibold hover:border-[#2563EB]"
                          >
                            <GitBranch className="w-3 h-3" /> Repo
                          </a>
                          <button
                            type="button"
                            onClick={() => setInspectedProject(p)}
                            className="inline-flex items-center gap-1 rounded-full bg-[#2563EB] text-white px-2.5 py-1 font-semibold"
                          >
                            <Play className="w-3 h-3" /> Watch 2-Min Demo &amp; Pitch
                          </button>
                        </div>

                        {role === 'founder' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setScoutedSquads((s) => ({ ...s, [p.id]: !s[p.id] }));
                              notify(`Initiated Acqui-Hire inquiry for ${p.name} squad!`);
                            }}
                            className={`rounded-full px-2.5 py-1 font-semibold ${
                              scouted ? 'bg-emerald-100 text-emerald-700' : 'bg-[#18181B] text-white'
                            }`}
                          >
                            {scouted ? 'Scouted ✓' : 'Scout Squad for Acqui-Hire'}
                          </button>
                        ) : role === 'mentor' || role === 'dean' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setEndorsedIds((e) => ({ ...e, [p.id]: !e[p.id] }));
                              notify(endorsed ? `Removed endorsement on ${p.id}` : `Endorsed ${p.name}!`);
                            }}
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-semibold ${
                              endorsed ? 'bg-emerald-100 text-emerald-700' : 'bg-[#18181B] text-white'
                            }`}
                          >
                            <ThumbsUp className="w-3 h-3" /> {endorsed ? 'Endorsed ✓' : 'Endorse Build'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setView('referrals');
                              notify(`Using ${p.id} (${p.name}) as Proof-of-Work!`);
                            }}
                            className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-1 font-semibold hover:text-[#2563EB]"
                          >
                            Apply with Proof-of-Work →
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. RESEARCH HUB (5) */}
          {view === 'research' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <h1 className="text-lg font-bold">Research Hub ({RESEARCH_PAPERS_DATA.length} Peer-Reviewed Papers)</h1>
              {RESEARCH_PAPERS_DATA.map((rp) => {
                const impl = projects.find((p) => p.linkedPaperId === rp.id);
                return (
                  <div
                    key={rp.id}
                    className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-mono font-bold text-[#2563EB]">
                        {rp.id} • {rp.venue}
                      </span>
                      <span className="rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-0.5 text-[11px] font-bold">
                        {rp.status}
                      </span>
                    </div>
                    <h2 className="text-base font-bold">{rp.topic}</h2>
                    <p className="text-xs text-[#52525B] dark:text-zinc-300">{rp.abstract}</p>
                    <div className="text-xs font-mono text-[#52525B]">
                      Lead: {rp.leadAuthorName} ({rp.leadAuthorRegNo})
                      {rp.coAuthorName ? ` • Co-Author: ${rp.coAuthorName} (${rp.coAuthorRegNo})` : ''}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E4E4E7] dark:border-zinc-800 text-xs">
                      <a href={rp.preprintUrl} target="_blank" rel="noreferrer" className="rounded-full bg-[#18181B] text-white px-3 py-1 font-semibold">
                        Preprint PDF ↗
                      </a>
                      <a href={rp.codeRepoUrl} target="_blank" rel="noreferrer" className="rounded-full border px-3 py-1 font-semibold">
                        Code Repo ↗
                      </a>
                      {impl && (
                        <button
                          type="button"
                          onClick={() => setInspectedProject(impl)}
                          className="rounded-full bg-blue-50 text-[#2563EB] px-3 py-1 font-semibold"
                        >
                          Inspect Linked Implementation ({impl.id}: {impl.name}) →
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. REFERRALS & SQUAD BOARD (32) */}
          {view === 'referrals' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="space-y-3">
                <h1 className="text-lg font-bold">Direct Alumni Referrals ({JOB_REFERRALS_32.length} Openings)</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {JOB_REFERRALS_32.map((r) => {
                    const applied = !!appliedRefs[r.id];
                    return (
                      <div
                        key={r.id}
                        className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-2 text-xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-mono text-[10px] text-[#2563EB] font-bold">
                              {r.id} • {r.company} • {r.roleType}
                            </div>
                            <h2 className="text-sm font-bold">{r.roleTitle}</h2>
                          </div>
                          <span className="font-bold text-emerald-600 shrink-0">{r.compensation}</span>
                        </div>
                        <div className="text-[11px] text-[#52525B]">
                          Posted by <strong>{r.postedBy}</strong> ({r.designation}) • Last Date: <span className="font-mono">{r.lastDate}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-[#E4E4E7] dark:border-zinc-800">
                          <span className="font-mono text-[10px] text-[#52525B]">{r.skills.join(' • ')}</span>
                          <button
                            type="button"
                            disabled={applied}
                            onClick={() => {
                              setAppliedRefs((p) => ({ ...p, [r.id]: true }));
                              notify(`Applied to ${r.company} (${r.id}) with Proof-of-Work!`);
                            }}
                            className={`rounded-full px-3 py-1 font-semibold ${
                              applied ? 'bg-emerald-100 text-emerald-700' : 'bg-[#2563EB] text-white'
                            }`}
                          >
                            {applied ? 'Applied ✓' : 'Apply with PoW'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-bold">Open Student Squad Seats ({SQUAD_OPENINGS.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SQUAD_OPENINGS.map((sq) => {
                    const joined = !!joinedSquads[sq.id];
                    return (
                      <div
                        key={sq.id}
                        className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-mono text-[10px] text-[#2563EB]">{sq.id} • {sq.projectId}</div>
                          <div className="font-bold">{sq.projectName}</div>
                          <div className="text-[11px] text-[#52525B]">
                            Seeking: {sq.roleNeeded} • Lead: {sq.leadName}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={joined}
                          onClick={() => {
                            setJoinedSquads((p) => ({ ...p, [sq.id]: true }));
                            notify(`Sent squad join request to ${sq.leadName}!`);
                          }}
                          className={`rounded-full px-3 py-1 font-semibold shrink-0 ${
                            joined ? 'bg-emerald-100 text-emerald-700' : 'bg-[#18181B] text-white'
                          }`}
                        >
                          {joined ? 'Requested ✓' : 'Join Squad'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 5. ALUMNI MENTORS & CAREER PATHS (14) */}
          {view === 'alumni' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <h1 className="text-lg font-bold">Alumni Mentors &amp; Career Trajectories ({UNIFIED_ALUMNI.length})</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {UNIFIED_ALUMNI.map((a) => {
                  const slot = OFFICE_HOURS.find((oh) => oh.alumniId === a.id);
                  const booked = slot ? !!bookedOfficeHours[slot.id] : false;
                  return (
                    <div
                      key={a.id}
                      className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3 text-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedProfile({ kind: 'alumni', alumni: a })}
                          className="flex items-center gap-2.5 text-left hover:text-[#2563EB]"
                        >
                          <img src={a.avatarUrl} alt={a.fullName} className="h-10 w-10 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-sm">{a.fullName}</div>
                            <div className="text-[11px] text-[#52525B]">
                              {a.designation} @ {a.company} • Batch &apos;{String(a.batchYear).slice(-2)}
                            </div>
                          </div>
                        </button>
                        <a
                          href={a.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] font-semibold text-[#2563EB] hover:underline"
                        >
                          LinkedIn ↗
                        </a>
                      </div>
                      <div className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-800 p-2.5 text-[11px] space-y-1">
                        <div><strong>Career Path:</strong> {a.career.earlyCareer} → {a.career.midCareer} → <strong>{a.company}</strong></div>
                        <div className="text-[#52525B]">Experience: {a.career.totalYears} yrs • Openings: {a.activeJobOpeningsCount}</div>
                      </div>
                      {slot && (
                        <div className="flex items-center justify-between pt-1">
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#52525B]">
                            <Calendar className="w-3.5 h-3.5 text-[#2563EB]" /> {slot.dayTime} (15m)
                          </span>
                          <button
                            type="button"
                            disabled={booked}
                            onClick={() => {
                              setBookedOfficeHours((p) => ({ ...p, [slot.id]: true }));
                              notify(`Booked 15-min Office Hours with ${a.fullName}!`);
                            }}
                            className={`rounded-full px-3 py-1 font-semibold ${
                              booked ? 'bg-emerald-100 text-emerald-700' : 'bg-[#18181B] text-white'
                            }`}
                          >
                            {booked ? 'Booked ✓' : 'Book 15m'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 6. PLACEMENTS & ACQUI-HIRES */}
          {view === 'placements' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="space-y-3">
                <h1 className="text-lg font-bold">Verified Placements &amp; Internships ({UNIFIED_OFFERS.length})</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {UNIFIED_OFFERS.map((o) => (
                    <div
                      key={o.id}
                      className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-mono text-[10px] text-[#2563EB] font-bold">
                          {o.id} • Triggered by {o.triggeredByProjectId}
                        </div>
                        <div className="font-bold text-sm">{o.studentName}</div>
                        <div className="text-[11px] text-[#52525B]">
                          {o.company} — {o.jobRole}
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 font-bold">
                        {o.packageStr} ({o.offerType})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-bold">Commercial Squad Acqui-Hire Inquiries ({ACQUI_HIRE_INQUIRIES.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {ACQUI_HIRE_INQUIRIES.map((acq) => (
                    <div
                      key={acq.id}
                      className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-1.5 text-xs"
                    >
                      <div className="font-mono text-[10px] text-[#2563EB] font-bold">{acq.id} • {acq.status}</div>
                      <div className="font-bold">{acq.targetProjectName} ({acq.targetProjectId})</div>
                      <div className="text-[11px] text-[#52525B]">
                        Scouted by {acq.founderName} @ {acq.company}
                      </div>
                      <div className="text-[11px] font-semibold text-emerald-700">
                        {acq.offerType} ({acq.squadSize} builders)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 7. DEAN & CDPC EXECUTIVE ANALYTICS */}
          {view === 'dean-analytics' && (
            <div className="max-w-5xl mx-auto space-y-5">
              <div className="rounded-3xl bg-[#111318] text-white p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Dean &amp; CDPC Executive Dashboard
                  </div>
                  <h1 className="text-2xl font-bold mt-1">
                    {projects.length} Builds • {RESEARCH_PAPERS_DATA.length} Papers • {UNIFIED_OFFERS.length} Verified Offers
                  </h1>
                  <p className="text-xs text-zinc-300 mt-1">
                    6 PPOs (₹22–36 LPA) &amp; 4 Internships (₹50k–80k/mo) across {UNIFIED_STUDENTS.length} ITER students.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={exportDeanCsv}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 text-zinc-950 px-4 py-2 text-xs font-bold"
                >
                  <Download className="w-3.5 h-3.5" /> Export CSV Report
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'CSE Students', val: UNIFIED_STUDENTS.filter((s) => s.branch === 'CSE').length },
                  { label: 'CSIT Students', val: UNIFIED_STUDENTS.filter((s) => s.branch === 'CSIT').length },
                  { label: 'ECE Students', val: UNIFIED_STUDENTS.filter((s) => s.branch === 'ECE').length },
                  { label: 'EEE Students', val: UNIFIED_STUDENTS.filter((s) => s.branch === 'EEE').length },
                ].map((d) => (
                  <div key={d.label} className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                    <div className="text-2xl font-bold text-[#2563EB]">{d.val}</div>
                    <div className="text-xs font-semibold">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODALS & DRAWERS */}
      <CommandSearchModal
        open={cmdOpen}
        projects={projects}
        onClose={() => setCmdOpen(false)}
        onSelectProject={(p) => setInspectedProject(p)}
        onSelectStudent={(s) => setSelectedProfile({ kind: 'student', student: s })}
        onSelectAlumni={(a) => setSelectedProfile({ kind: 'alumni', alumni: a })}
        onJumpToReferrals={() => setView('referrals')}
      />

      {inspectedProject && (
        <ProjectInspectorDrawer
          project={inspectedProject}
          critiques={critiques}
          activePersonaName={persona.name}
          onAddCritique={handleAddCritique}
          onSelectStudent={(s) => {
            setInspectedProject(null);
            setSelectedProfile({ kind: 'student', student: s });
          }}
          onClose={() => setInspectedProject(null)}
        />
      )}

      <ShareProjectStudioModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onPublish={handlePublishProject}
      />

      {selectedProfile && (
        <PublicProfileModal
          target={selectedProfile}
          followedIds={followedIds}
          onToggleFollow={(id, name) => {
            setFollowedIds((p) => ({ ...p, [id]: !p[id] }));
            notify(`Updated follow status for ${name}`);
          }}
          onSelectProfile={(next) => setSelectedProfile(next)}
          onOpenProject={(pid) => {
            const found = projects.find((p) => p.id === pid);
            if (found) setInspectedProject(found);
          }}
          onGoToJobs={() => setView('referrals')}
          onNotify={notify}
          onClose={() => setSelectedProfile(null)}
        />
      )}

      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl bg-[#18181B] text-white px-4 py-2.5 text-xs font-semibold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
