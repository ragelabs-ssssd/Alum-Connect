'use client';

import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Play,
  Plus,
  Search,
  Send,
  Users,
  Video,
  X,
} from 'lucide-react';
import {
  AlumniCritiqueRecord,
  JOB_REFERRALS_32,
  JobReferralRecord,
  ProjectRecord,
  RESEARCH_PAPERS_DATA,
  ResearchPaperRecord,
  UNIFIED_ALUMNI,
  UNIFIED_STUDENTS,
  UnifiedAlumni,
  UnifiedStudent,
  getIndianAvatar,
} from '../data/alumConnectData';

export function CommandSearchModal({
  open,
  projects,
  onClose,
  onSelectProject,
  onSelectStudent,
  onSelectAlumni,
  onJumpToReferrals,
}: {
  open: boolean;
  projects: ProjectRecord[];
  onClose: () => void;
  onSelectProject: (p: ProjectRecord) => void;
  onSelectStudent: (s: UnifiedStudent) => void;
  onSelectAlumni: (a: UnifiedAlumni) => void;
  onJumpToReferrals: () => void;
}) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const match = (text: string) => !q || text.toLowerCase().includes(q);
    return {
      projects: projects.filter((p) => match(`${p.id} ${p.name} ${p.pitch} ${p.techStack.join(' ')} ${p.leadName}`)).slice(0, 5),
      papers: RESEARCH_PAPERS_DATA.filter((rp) => match(`${rp.id} ${rp.topic} ${rp.domain} ${rp.leadAuthorName}`)).slice(0, 3),
      students: UNIFIED_STUDENTS.filter((s) => match(`${s.id} ${s.fullName} ${s.regNo} ${s.branch} ${s.techStack.join(' ')}`)).slice(0, 4),
      alumni: UNIFIED_ALUMNI.filter((a) => match(`${a.id} ${a.fullName} ${a.company} ${a.designation}`)).slice(0, 4),
      referrals: JOB_REFERRALS_32.filter((r) => match(`${r.company} ${r.roleTitle} ${r.skills.join(' ')}`)).slice(0, 3),
    };
  }, [query, projects]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#E4E4E7] dark:border-zinc-800">
          <Search className="w-4 h-4 text-[#2563EB]" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Command Search (⌘K) — projects, papers, reg nos, students, alumni, referrals..."
            className="flex-1 bg-transparent text-xs sm:text-sm focus:outline-none"
          />
          <button type="button" onClick={onClose} className="rounded-lg p-1 hover:bg-[#F4F4F5] dark:hover:bg-zinc-800">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="max-h-[65vh] overflow-y-auto overscroll-contain p-3 space-y-4 text-xs">
          {results.projects.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#52525B]">Projects ({results.projects.length})</div>
              {results.projects.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSelectProject(p);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-xl px-2.5 py-2 hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 text-left"
                >
                  <div className="min-w-0">
                    <div className="font-bold truncate">
                      <span className="font-mono text-[#2563EB] mr-1.5">{p.id}</span>
                      {p.name}
                    </div>
                    <div className="text-[11px] text-[#52525B] truncate">{p.pitch}</div>
                  </div>
                  <span className="text-[10px] font-mono text-[#52525B] shrink-0">{p.hostingPlatform}</span>
                </button>
              ))}
            </div>
          )}

          {results.students.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#52525B]">Students</div>
              {results.students.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => {
                    onSelectStudent(s);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={s.avatarUrl} alt={s.fullName} className="h-6 w-6 rounded-full object-cover" />
                    <span className="font-bold truncate">{s.fullName}</span>
                    <span className="font-mono text-[10px] text-[#52525B]">{s.regNo}</span>
                  </div>
                  <span className="text-[10px] text-[#2563EB] font-semibold">{s.academics.cgpa} CGPA</span>
                </button>
              ))}
            </div>
          )}

          {results.alumni.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#52525B]">Alumni Mentors</div>
              {results.alumni.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => {
                    onSelectAlumni(a);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 text-left"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <img src={a.avatarUrl} alt={a.fullName} className="h-6 w-6 rounded-full object-cover" />
                    <span className="font-bold truncate">{a.fullName}</span>
                    <span className="text-[11px] text-[#52525B] truncate">{a.designation} @ {a.company}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#52525B]">&apos;{String(a.batchYear).slice(-2)}</span>
                </button>
              ))}
            </div>
          )}

          {results.referrals.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#52525B]">Active Referrals</div>
              {results.referrals.map((r: JobReferralRecord) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    onJumpToReferrals();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 text-left"
                >
                  <span className="font-semibold truncate">{r.company} — {r.roleTitle}</span>
                  <span className="text-[10px] font-bold text-emerald-600">{r.compensation}</span>
                </button>
              ))}
            </div>
          )}

          {results.papers.length > 0 && (
            <div className="space-y-1">
              <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#52525B]">Research Papers</div>
              {results.papers.map((rp: ResearchPaperRecord) => (
                <a
                  key={rp.id}
                  href={rp.preprintUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 hover:bg-[#F4F4F5] dark:hover:bg-zinc-800"
                >
                  <span className="font-semibold truncate">{rp.id}: {rp.topic}</span>
                  <span className="text-[10px] text-[#2563EB]">{rp.venue} ↗</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function ProjectInspectorDrawer({
  project,
  critiques,
  activePersonaName,
  onAddCritique,
  onSelectStudent,
  onClose,
}: {
  project: ProjectRecord;
  critiques: AlumniCritiqueRecord[];
  activePersonaName: string;
  onAddCritique: (projectId: string, comment: string) => void;
  onSelectStudent: (s: UnifiedStudent) => void;
  onClose: () => void;
}) {
  const [videoTab, setVideoTab] = useState<'demo' | 'pitch'>('demo');
  const [commentText, setCommentText] = useState('');

  const contributorRegs = [project.leadRegNo, ...project.coContributorsRegNos];
  const contributors = UNIFIED_STUDENTS.filter(
    (s) =>
      contributorRegs.includes(s.regNo) ||
      s.fullName === project.leadName ||
      project.coContributorsNames.includes(s.fullName)
  );
  const linkedPaper = project.linkedPaperId
    ? RESEARCH_PAPERS_DATA.find((rp) => rp.id === project.linkedPaperId)
    : null;
  const projectCritiques = critiques.filter((c) => c.projectId === project.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddCritique(project.id, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-2xl h-full bg-white dark:bg-zinc-950 border-l border-[#E4E4E7] dark:border-zinc-800 shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b border-[#E4E4E7] dark:border-zinc-800 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="rounded bg-[#F4F4F5] dark:bg-zinc-800 px-2 py-0.5 font-bold text-[#2563EB]">
                {project.id}
              </span>
              <span>{project.collaborationMode} ({project.teamSize})</span>
              <span>• {project.hostingPlatform}</span>
              {linkedPaper && (
                <span className="rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 font-bold">
                  Linked {linkedPaper.id}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold mt-1">{project.name}</h2>
            <p className="text-xs text-[#52525B] dark:text-zinc-400">{project.pitch}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#E4E4E7] dark:border-zinc-800 p-1.5 hover:bg-[#F4F4F5]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-6">
          {/* Dual 2-Minute Video Switcher */}
          <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#09090B] text-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/80">
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setVideoTab('demo')}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                    videoTab === 'demo' ? 'bg-[#2563EB] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  01: 2-Min Product Demo Walkthrough
                </button>
                <button
                  type="button"
                  onClick={() => setVideoTab('pitch')}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                    videoTab === 'pitch' ? 'bg-[#2563EB] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  02: 2-Min Founder/Team Pitch
                </button>
              </div>
              <span className="font-mono text-[10px] text-zinc-400">02:00</span>
            </div>
            <div className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-sky-400" />
                  {videoTab === 'demo' ? 'Live Architecture & Product Demo' : 'Problem Statement & GTM Pitch'}
                </div>
                <p className="text-[11px] text-zinc-400 font-mono truncate max-w-md">
                  {videoTab === 'demo' ? project.demoVideoUrl : project.pitchVideoUrl}
                </p>
              </div>
              <a
                href={videoTab === 'demo' ? project.demoVideoUrl : project.pitchVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white text-zinc-950 px-4 py-2 text-xs font-bold hover:bg-zinc-200"
              >
                <Play className="w-3.5 h-3.5 fill-current" /> Watch Video
              </a>
            </div>
          </div>

          {/* Hosting & GitHub Actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2 text-xs font-semibold"
            >
              Open Live Hosting ({project.hostingPlatform}) <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-2 text-xs font-semibold"
            >
              <GitBranch className="w-3.5 h-3.5" /> GitHub Repository
            </a>
          </div>

          {/* Detailed Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B]">Detailed Architecture</h3>
            <p className="text-xs sm:text-sm text-[#09090B] dark:text-zinc-200 leading-relaxed">
              {project.detailedDesc}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {project.techStack.map((t) => (
                <span key={t} className="font-mono rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 text-[11px]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Linked Research Paper */}
          {linkedPaper && (
            <div className="rounded-2xl border border-blue-200 dark:border-sky-500/30 bg-blue-50/60 dark:bg-sky-500/10 p-4 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2563EB] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> {linkedPaper.id} • {linkedPaper.venue}
                </span>
                <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                  {linkedPaper.status}
                </span>
              </div>
              <div className="font-bold">{linkedPaper.topic}</div>
              <p className="text-[11px] text-[#52525B] dark:text-zinc-300">{linkedPaper.abstract}</p>
            </div>
          )}

          {/* Contributor Roster */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
              Contributor Roster ({contributors.length})
            </h3>
            <div className="space-y-2">
              {contributors.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onSelectStudent(st)}
                  className="w-full text-left rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#FAFAFA] dark:bg-zinc-900 p-3 flex flex-wrap items-center justify-between gap-2 hover:border-[#2563EB]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={st.avatarUrl} alt={st.fullName} className="h-9 w-9 rounded-full object-cover" />
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">
                        {st.fullName} <span className="font-mono text-[10px] text-[#52525B]">{st.regNo}</span>
                      </div>
                      <div className="text-[11px] text-[#52525B] truncate">
                        {st.academicYear} {st.branch} • {st.academics.clubRole} ({st.academics.primaryClub})
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium truncate">
                        {st.academics.achievement}
                      </div>
                    </div>
                  </div>
                  <div className="text-right font-mono text-[11px]">
                    <div className="font-bold text-[#2563EB]">{st.academics.cgpa.toFixed(2)} CGPA</div>
                    <div className="text-[10px] text-[#52525B]">
                      10th: {st.academics.class10Pct} • 12th: {st.academics.class12Pct}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Alumni Critiques & Endorsements */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B]">
              Alumni Technical Critiques &amp; Endorsements ({projectCritiques.length})
            </h3>
            <div className="space-y-2">
              {projectCritiques.map((c) => (
                <div key={c.id} className="rounded-xl bg-[#F4F4F5] dark:bg-zinc-900 p-3 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{c.alumniName}</span>
                    <span className="text-[10px] text-[#52525B]">{c.timestamp}</span>
                  </div>
                  <div className="text-[10px] text-[#2563EB] font-medium">{c.alumniRole}</div>
                  <p className="text-[#52525B] dark:text-zinc-300">{c.comment}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Leave a technical critique as ${activePersonaName}...`}
                className="flex-1 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 px-3.5 py-2 text-xs"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 rounded-full bg-[#2563EB] text-white px-4 py-2 text-xs font-semibold"
              >
                <Send className="w-3 h-3" /> Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShareProjectStudioModal({
  open,
  onClose,
  onPublish,
}: {
  open: boolean;
  onClose: () => void;
  onPublish: (project: ProjectRecord) => void;
}) {
  const [name, setName] = useState('');
  const [pitch, setPitch] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [detailedDesc, setDetailedDesc] = useState('');
  const [mode, setMode] = useState<'Solo' | 'Group'>('Solo');
  const [coSearch, setCoSearch] = useState('');
  const [selectedCo, setSelectedCo] = useState<UnifiedStudent[]>([]);
  const [liveUrl, setLiveUrl] = useState('https://');
  const [githubUrl, setGithubUrl] = useState('https://github.com/iter-alum/');
  const [demoVideoUrl, setDemoVideoUrl] = useState('https://youtu.be/');
  const [pitchVideoUrl, setPitchVideoUrl] = useState('https://youtu.be/');
  const [techStack, setTechStack] = useState('Next.js, TypeScript, FastAPI');

  if (!open) return null;

  const detectedHost = liveUrl.includes('github.io')
    ? 'GitHub Pages'
    : liveUrl.includes('vercel.app')
      ? 'Vercel'
      : 'Vercel';

  const coMatches = UNIFIED_STUDENTS.filter(
    (s) =>
      s.id !== 'STU-01' &&
      !selectedCo.some((c) => c.id === s.id) &&
      `${s.fullName} ${s.regNo}`.toLowerCase().includes(coSearch.toLowerCase())
  ).slice(0, 5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !pitch.trim()) return;
    const lead = UNIFIED_STUDENTS[0];
    const created: ProjectRecord = {
      id: `PRJ-${Math.floor(46 + Math.random() * 50)}`,
      name: name.trim(),
      pitch: pitch.trim().slice(0, 120),
      shortDesc: shortDesc.trim() || pitch.trim(),
      detailedDesc: detailedDesc.trim() || shortDesc.trim() || pitch.trim(),
      collaborationMode: mode,
      teamSize: mode === 'Solo' ? 1 : 1 + selectedCo.length,
      leadName: lead.fullName,
      leadRegNo: lead.regNo,
      coContributorsNames: mode === 'Group' ? selectedCo.map((c) => c.fullName) : [],
      coContributorsRegNos: mode === 'Group' ? selectedCo.map((c) => c.regNo) : [],
      academicYears: lead.academicYear,
      techStack: techStack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      liveUrl: liveUrl.trim(),
      hostingPlatform: detectedHost,
      githubUrl: githubUrl.trim(),
      demoVideoUrl: demoVideoUrl.trim(),
      pitchVideoUrl: pitchVideoUrl.trim(),
      linkedPaperId: null,
      coverImage: '/images/indian-campus-lab.jpg',
    };
    onPublish(created);
    setName('');
    setPitch('');
    setShortDesc('');
    setDetailedDesc('');
    setSelectedCo([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto overscroll-contain rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4 shadow-2xl text-xs"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold">Share Project Submission Studio</h3>
            <p className="text-[11px] text-[#52525B]">Publishes live to Ecosystem Feed &amp; increments student project count.</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg border p-1.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="font-semibold text-[11px]">Project Name *</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. FinAudit Edge"
              className="mt-1 w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2"
            />
          </div>
          <div>
            <div className="flex justify-between font-semibold text-[11px]">
              <label>One-Liner Pitch *</label>
              <span className="font-mono text-[#52525B]">{pitch.length}/120</span>
            </div>
            <input
              required
              maxLength={120}
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Concise 120-char value proposition"
              className="mt-1 w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2"
            />
          </div>
        </div>

        <input
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          placeholder="Short Description (1–2 sentences)"
          className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2"
        />
        <textarea
          rows={3}
          value={detailedDesc}
          onChange={(e) => setDetailedDesc(e.target.value)}
          placeholder="Detailed Architecture & Implementation Description..."
          className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 p-3"
        />

        {/* Individual vs Group Toggle */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[11px]">Collaboration Mode:</span>
            {(['Solo', 'Group'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full px-3 py-1 font-semibold ${
                  mode === m ? 'bg-[#18181B] text-white' : 'bg-[#F4F4F5] text-[#52525B]'
                }`}
              >
                {m === 'Solo' ? 'Individual' : 'Group Project'}
              </button>
            ))}
          </div>

          {mode === 'Group' && (
            <div className="rounded-xl border border-[#E4E4E7] dark:border-zinc-700 p-3 space-y-2">
              <input
                value={coSearch}
                onChange={(e) => setCoSearch(e.target.value)}
                placeholder="Search student co-contributor by name or ITER Reg No..."
                className="w-full rounded-lg bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-1.5"
              />
              <div className="flex flex-wrap gap-1.5">
                {coMatches.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedCo((prev) => [...prev, st])}
                    className="rounded-full border border-[#E4E4E7] px-2.5 py-0.5 text-[11px] hover:border-[#2563EB]"
                  >
                    + {st.fullName} (<span className="font-mono">{st.regNo}</span> • {st.academicYear})
                  </button>
                ))}
              </div>
              {selectedCo.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedCo.map((c) => (
                    <span key={c.id} className="rounded-full bg-blue-50 text-[#2563EB] px-2.5 py-0.5 text-[11px] font-semibold">
                      {c.fullName} ({c.regNo})
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-[11px] font-semibold">
              <label>Live Hosted URL</label>
              <span className="text-[#2563EB]">{detectedHost}</span>
            </div>
            <input
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold">GitHub Repo URL</label>
            <input
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold">2-Min Demo Video URL</label>
            <input
              value={demoVideoUrl}
              onChange={(e) => setDemoVideoUrl(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold">2-Min Pitch Video URL</label>
            <input
              value={pitchVideoUrl}
              onChange={(e) => setPitchVideoUrl(e.target.value)}
              className="mt-1 w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 font-mono"
            />
          </div>
        </div>

        <input
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          placeholder="Tech Stack (comma-separated)"
          className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 font-mono"
        />

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full border px-4 py-1.5 font-semibold">
            Cancel
          </button>
          <button type="submit" className="rounded-full bg-[#2563EB] text-white px-5 py-1.5 font-semibold">
            Publish Project
          </button>
        </div>
      </form>
    </div>
  );
}
