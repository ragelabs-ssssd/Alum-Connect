'use client';

import React, { useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  GraduationCap,
  Mail,
  Search,
  Sparkles,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  ALUMNI_DATA,
  AlumniRecord,
  OFFERS_DATA,
  PROJECTS_DATA,
  ProjectRecord,
  RESEARCH_PAPERS_DATA,
  STUDENTS_DATA,
  StudentRecord,
  getIndianAvatar,
  getIndianBanner,
} from '../data/alumConnectData';

export type SelectedProfileTarget =
  | { kind: 'student'; student: StudentRecord }
  | { kind: 'alumni'; alumni: AlumniRecord };

export function findProfileByName(name: string): SelectedProfileTarget | null {
  const primary = name.split('&')[0].trim().toLowerCase();
  const stu = STUDENTS_DATA.find((s) => s.fullName.toLowerCase() === primary);
  if (stu) return { kind: 'student', student: stu };
  const alum = ALUMNI_DATA.find((a) => a.fullName.toLowerCase() === primary);
  if (alum) return { kind: 'alumni', alumni: alum };
  return null;
}

interface ProfileModalProps {
  target: SelectedProfileTarget;
  followedIds: Record<string, boolean>;
  onToggleFollow: (id: string, name: string) => void;
  onSelectProfile: (next: SelectedProfileTarget) => void;
  onOpenProject: (projectId: string) => void;
  onGoToJobs: () => void;
  onNotify: (msg: string) => void;
  onClose: () => void;
}

export function PublicProfileModal({
  target,
  followedIds,
  onToggleFollow,
  onSelectProfile,
  onOpenProject,
  onGoToJobs,
  onNotify,
  onClose,
}: ProfileModalProps) {
  if (target.kind === 'student') {
    const s = target.student;
    const isFollowed = !!followedIds[s.id];
    const projects = PROJECTS_DATA.filter((p) => s.projectIds.includes(p.id));
    const papers = RESEARCH_PAPERS_DATA.filter((rp) => s.researchPaperIds.includes(rp.id));
    const offer = OFFERS_DATA.find((o) => o.studentId === s.id);
    const mentors = ALUMNI_DATA.filter((a) => a.linkedStudentIds.includes(s.id));
    const seed = parseInt(s.id.replace(/\D/g, ''), 10) || 1;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">
          {/* Banner */}
          <div className="relative h-32 bg-gradient-to-r from-[#18181B] via-zinc-800 to-[#2563EB]">
            <img
              src={getIndianBanner(seed)}
              alt={`${s.fullName} banner`}
              className="h-full w-full object-cover opacity-45"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close profile"
              className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70 text-white p-2 backdrop-blur transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pb-6 -mt-12 space-y-5 relative z-10">
            {/* Avatar + Follow */}
            <div className="flex flex-wrap items-end justify-between gap-3">
              <img
                src={getIndianAvatar(s.fullName)}
                alt={s.fullName}
                className="h-24 w-24 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-md bg-[#18181B]"
              />
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${s.email}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-3.5 py-1.5 text-xs font-semibold hover:border-[#2563EB]"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </a>
                <button
                  type="button"
                  onClick={() => onToggleFollow(s.id, s.fullName)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                    isFollowed
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                      : 'bg-[#18181B] hover:bg-[#27272A] dark:bg-zinc-100 dark:text-zinc-950 text-white'
                  }`}
                >
                  {isFollowed ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                  {isFollowed ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>

            {/* Identity */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold">{s.fullName}</h2>
                <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-semibold text-[#52525B] dark:text-zinc-300">
                  Reg: {s.regNo}
                </span>
                {s.isResearchAuthor && (
                  <span className="rounded-full bg-blue-50 dark:bg-sky-500/10 text-[#2563EB] dark:text-sky-400 px-2.5 py-0.5 text-[11px] font-semibold">
                    Research Author
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#52525B] dark:text-zinc-400">
                {s.academicYear} {s.branch} • ITER, Siksha &apos;O&apos; Anusandhan • {s.email}
              </p>
              <p className="text-xs sm:text-sm text-[#09090B] dark:text-zinc-200 leading-relaxed pt-1">
                {s.bio}
              </p>
            </div>

            {/* Offer Banner if placed */}
            {offer && (
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 p-3.5 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>
                    <strong>{offer.offerType}</strong> at <strong>{offer.company}</strong> —{' '}
                    {offer.jobRole}
                  </span>
                </div>
                <span className="rounded-full bg-white dark:bg-zinc-900 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  {offer.packageStr}
                </span>
              </div>
            )}

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5">
              {s.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 px-2.5 py-0.5 text-[11px] font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Mentors */}
            {mentors.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                  Endorsed &amp; Mentored By Alumni
                </h3>
                <div className="flex flex-wrap gap-2">
                  {mentors.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => onSelectProfile({ kind: 'alumni', alumni: m })}
                      className="inline-flex items-center gap-2 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-1 text-xs hover:border-[#2563EB] transition-colors"
                    >
                      <img
                        src={getIndianAvatar(m.fullName)}
                        alt={m.fullName}
                        className="h-5 w-5 rounded-full object-cover"
                      />
                      <span className="font-semibold">{m.fullName}</span>
                      <span className="text-[10px] text-[#52525B] dark:text-zinc-400">
                        @ {m.company}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                Projects ({projects.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((p: ProjectRecord) => (
                  <div
                    key={p.id}
                    className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#FAFAFA] dark:bg-zinc-950 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-20 bg-zinc-900">
                        <img
                          src={p.coverImage}
                          alt={p.name}
                          className="h-full w-full object-cover opacity-65"
                        />
                        <span className="absolute top-2 left-2 rounded-full bg-black/60 text-white px-2 py-0.5 text-[10px] font-semibold">
                          {p.id} • {p.collaborationMode}
                        </span>
                      </div>
                      <div className="p-3 space-y-1">
                        <div className="text-xs font-bold">{p.name}</div>
                        <p className="text-[11px] text-[#52525B] dark:text-zinc-400 line-clamp-2">
                          {p.pitch}
                        </p>
                      </div>
                    </div>
                    <div className="px-3 pb-3 flex items-center justify-between gap-2 text-[11px]">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenProject(p.id);
                        }}
                        className="font-semibold text-[#2563EB] hover:underline"
                      >
                        Case Study →
                      </button>
                      <div className="flex items-center gap-2">
                        <a
                          href={p.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#52525B] hover:text-[#18181B] dark:hover:text-white inline-flex items-center gap-1"
                        >
                          <GitBranch className="w-3 h-3" /> Code
                        </a>
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#52525B] hover:text-[#18181B] dark:hover:text-white inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" /> Live
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Research Papers */}
            {papers.length > 0 && (
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#2563EB]" />
                  Research Papers ({papers.length})
                </h3>
                {papers.map((rp) => (
                  <div
                    key={rp.id}
                    className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-800/60 p-3.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#2563EB]">
                        {rp.id} • {rp.venue}
                      </span>
                      <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                        {rp.status}
                      </span>
                    </div>
                    <div className="text-xs font-bold">{rp.topic}</div>
                    <p className="text-[11px] text-[#52525B] dark:text-zinc-400">{rp.abstract}</p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold">
                      <a
                        href={rp.preprintUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2563EB] hover:underline"
                      >
                        Preprint PDF ↗
                      </a>
                      <a
                        href={rp.codeRepoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#52525B] hover:underline"
                      >
                        Code Repo ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ALUMNI PROFILE MODAL
  const a = target.alumni;
  const isFollowed = !!followedIds[a.id];
  const mentoredStudents = STUDENTS_DATA.filter((s) => a.linkedStudentIds.includes(s.id));
  const linkedProjects = PROJECTS_DATA.filter((p) => a.linkedProjectIds.includes(p.id));
  const linkedPapers = RESEARCH_PAPERS_DATA.filter((rp) => a.linkedPaperIds.includes(rp.id));
  const seed = parseInt(a.id.replace(/\D/g, ''), 10) || 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl">
        <div className="relative h-32 bg-gradient-to-r from-[#09090B] via-slate-800 to-[#2563EB]">
          <img
            src={getIndianBanner(seed + 1)}
            alt={`${a.fullName} banner`}
            className="h-full w-full object-cover opacity-40"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="absolute top-3 right-3 rounded-full bg-black/50 hover:bg-black/70 text-white p-2 backdrop-blur transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6 -mt-12 space-y-5 relative z-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <img
              src={getIndianAvatar(a.fullName)}
              alt={a.fullName}
              className="h-24 w-24 rounded-2xl object-cover border-4 border-white dark:border-zinc-900 shadow-md bg-[#18181B]"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNotify(`Sent 15-min coffee chat request to ${a.fullName}!`)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-3.5 py-1.5 text-xs font-semibold hover:border-[#2563EB]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                Request Chat
              </button>
              <button
                type="button"
                onClick={() => onToggleFollow(a.id, a.fullName)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  isFollowed
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300'
                    : 'bg-[#18181B] hover:bg-[#27272A] dark:bg-zinc-100 dark:text-zinc-950 text-white'
                }`}
              >
                {isFollowed ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                {isFollowed ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold">{a.fullName}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-sky-500/10 text-[#2563EB] dark:text-sky-400 px-2.5 py-0.5 text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3" />
                Verified Alum • Batch &apos;{String(a.batchYear).slice(-2)}
              </span>
              <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-semibold text-[#52525B] dark:text-zinc-300">
                {a.personaCategory}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-[#09090B] dark:text-zinc-200">
              {a.designation} @ {a.company}
            </p>
            <p className="text-xs text-[#52525B] dark:text-zinc-400">
              Mentorship Focus: {a.mentorshipScope}
            </p>
          </div>

          {a.canPostJobs && a.activeJobOpeningsCount > 0 && (
            <div className="rounded-2xl border border-blue-200 dark:border-sky-500/30 bg-blue-50/70 dark:bg-sky-500/10 p-3.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <Briefcase className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span>
                  <strong>{a.activeJobOpeningsCount} active referral openings</strong> at{' '}
                  <strong>{a.company}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onGoToJobs();
                }}
                className="rounded-full bg-[#2563EB] text-white px-3 py-1 text-[11px] font-semibold hover:bg-blue-700"
              >
                View Jobs →
              </button>
            </div>
          )}

          <div className="flex flex-wrap gap-1.5">
            {a.techStackExpertise.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 border border-[#E4E4E7] dark:border-zinc-700 px-2.5 py-0.5 text-[11px] font-medium"
              >
                {skill}
              </span>
            ))}
          </div>

          {mentoredStudents.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                Mentoring ITER Students ({mentoredStudents.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {mentoredStudents.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => onSelectProfile({ kind: 'student', student: st })}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-1 text-xs hover:border-[#2563EB] transition-colors"
                  >
                    <img
                      src={getIndianAvatar(st.fullName)}
                      alt={st.fullName}
                      className="h-5 w-5 rounded-full object-cover"
                    />
                    <span className="font-semibold">{st.fullName}</span>
                    <span className="text-[10px] text-[#52525B] dark:text-zinc-400">
                      {st.academicYear} {st.branch}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {linkedProjects.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                Endorsed Student Projects ({linkedProjects.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkedProjects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenProject(p.id);
                    }}
                    className="text-left rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#FAFAFA] dark:bg-zinc-950 p-3 space-y-1 hover:border-[#2563EB] transition-colors"
                  >
                    <div className="text-xs font-bold">{p.name}</div>
                    <div className="text-[11px] text-[#52525B] dark:text-zinc-400 line-clamp-2">
                      {p.pitch}
                    </div>
                    <div className="text-[10px] font-semibold text-[#2563EB]">
                      By {p.leadName} • Open Case Study →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {linkedPapers.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
                Guided Research Papers ({linkedPapers.length})
              </h3>
              {linkedPapers.map((rp) => (
                <div
                  key={rp.id}
                  className="rounded-xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-800/60 p-3 text-xs space-y-1"
                >
                  <div className="font-bold">{rp.topic}</div>
                  <div className="text-[11px] text-[#52525B] dark:text-zinc-400">
                    {rp.venue} • {rp.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DirectoryModalProps {
  initialQuery?: string;
  followedIds: Record<string, boolean>;
  onToggleFollow: (id: string, name: string) => void;
  onSelectProfile: (target: SelectedProfileTarget) => void;
  onClose: () => void;
}

export function PeopleDirectoryModal({
  initialQuery = '',
  followedIds,
  onToggleFollow,
  onSelectProfile,
  onClose,
}: DirectoryModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [filter, setFilter] = useState<'all' | 'students' | 'alumni' | 'research' | 'hiring'>('all');

  const filteredStudents = useMemo(() => {
    if (filter === 'alumni' || filter === 'hiring') return [];
    const q = query.trim().toLowerCase();
    return STUDENTS_DATA.filter((s) => {
      if (filter === 'research' && !s.isResearchAuthor) return false;
      if (!q) return true;
      return `${s.fullName} ${s.branch} ${s.academicYear} ${s.regNo} ${s.bio} ${s.techStack.join(' ')}`
        .toLowerCase()
        .includes(q);
    });
  }, [query, filter]);

  const filteredAlumni = useMemo(() => {
    if (filter === 'students' || filter === 'research') return [];
    const q = query.trim().toLowerCase();
    return ALUMNI_DATA.filter((a) => {
      if (filter === 'hiring' && !a.canPostJobs) return false;
      if (!q) return true;
      return `${a.fullName} ${a.company} ${a.designation} ${a.personaCategory} ${a.mentorshipScope} ${a.techStackExpertise.join(' ')}`
        .toLowerCase()
        .includes(q);
    });
  }, [query, filter]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-[#E4E4E7] dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2563EB]" />
                ITER Network Directory
              </h2>
              <p className="text-xs text-[#52525B] dark:text-zinc-400">
                Search and explore all {STUDENTS_DATA.length} student builders and {ALUMNI_DATA.length} verified alumni mentors.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-[#F4F4F5] dark:hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, skill, branch, company, or reg no..."
                className="w-full rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  { id: 'all', label: `All (${STUDENTS_DATA.length + ALUMNI_DATA.length})` },
                  { id: 'students', label: `Students (${STUDENTS_DATA.length})` },
                  { id: 'alumni', label: `Alumni (${ALUMNI_DATA.length})` },
                  { id: 'research', label: 'Research Authors' },
                  { id: 'hiring', label: 'Hiring Alums' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilter(tab.id)}
                  className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-colors ${
                    filter === tab.id
                      ? 'bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950'
                      : 'bg-[#F4F4F5] dark:bg-zinc-800 text-[#52525B] dark:text-zinc-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {filteredAlumni.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#2563EB]" />
                Alumni Mentors &amp; Recruiters ({filteredAlumni.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredAlumni.map((a, idx) => {
                  const isFollowed = !!followedIds[a.id];
                  return (
                    <div
                      key={a.id}
                      className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#FAFAFA] dark:bg-zinc-950 overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-12 bg-gradient-to-r from-[#09090B] to-[#2563EB]">
                          <img
                            src={getIndianBanner(idx)}
                            alt={a.company}
                            className="h-full w-full object-cover opacity-35"
                          />
                        </div>
                        <div className="px-3.5 pb-3 -mt-6 space-y-1.5 relative z-10">
                          <div className="flex items-end justify-between">
                            <img
                              src={getIndianAvatar(a.fullName)}
                              alt={a.fullName}
                              className="h-12 w-12 rounded-xl object-cover border-2 border-white dark:border-zinc-900 shadow-xs"
                            />
                            <button
                              type="button"
                              onClick={() => onToggleFollow(a.id, a.fullName)}
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                isFollowed
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950'
                              }`}
                            >
                              {isFollowed ? 'Following' : 'Follow'}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectProfile({ kind: 'alumni', alumni: a });
                            }}
                            className="text-left block w-full hover:text-[#2563EB]"
                          >
                            <div className="text-xs font-bold truncate">{a.fullName}</div>
                            <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                              {a.designation} @ {a.company}
                            </div>
                          </button>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {a.techStackExpertise.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 px-2 py-0.5 text-[10px]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="px-3.5 pb-3 pt-1 border-t border-[#E4E4E7] dark:border-zinc-800 flex items-center justify-between text-[10px]">
                        <span className="text-[#52525B]">Batch &apos;{String(a.batchYear).slice(-2)}</span>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectProfile({ kind: 'alumni', alumni: a });
                          }}
                          className="font-semibold text-[#2563EB] hover:underline"
                        >
                          View Profile →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredStudents.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-[#2563EB]" />
                ITER Student Builders ({filteredStudents.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredStudents.map((s, idx) => {
                  const isFollowed = !!followedIds[s.id];
                  return (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#FAFAFA] dark:bg-zinc-950 overflow-hidden flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative h-12 bg-gradient-to-r from-[#18181B] to-[#2563EB]">
                          <img
                            src={getIndianBanner(idx + 1)}
                            alt={s.branch}
                            className="h-full w-full object-cover opacity-35"
                          />
                        </div>
                        <div className="px-3.5 pb-3 -mt-6 space-y-1.5 relative z-10">
                          <div className="flex items-end justify-between">
                            <img
                              src={getIndianAvatar(s.fullName)}
                              alt={s.fullName}
                              className="h-12 w-12 rounded-xl object-cover border-2 border-white dark:border-zinc-900 shadow-xs"
                            />
                            <button
                              type="button"
                              onClick={() => onToggleFollow(s.id, s.fullName)}
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                                isFollowed
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950'
                              }`}
                            >
                              {isFollowed ? 'Following' : 'Follow'}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onSelectProfile({ kind: 'student', student: s });
                            }}
                            className="text-left block w-full hover:text-[#2563EB]"
                          >
                            <div className="text-xs font-bold truncate">{s.fullName}</div>
                            <div className="text-[10px] text-[#52525B] dark:text-zinc-400 truncate">
                              {s.academicYear} {s.branch} • {s.totalProjectsCount} Projects
                            </div>
                          </button>
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {s.techStack.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-white dark:bg-zinc-900 border border-[#E4E4E7] dark:border-zinc-800 px-2 py-0.5 text-[10px]"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="px-3.5 pb-3 pt-1 border-t border-[#E4E4E7] dark:border-zinc-800 flex items-center justify-between text-[10px]">
                        <span className="text-[#52525B]">
                          {s.isResearchAuthor ? 'Research Author' : 'Builder'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onSelectProfile({ kind: 'student', student: s });
                          }}
                          className="font-semibold text-[#2563EB] hover:underline"
                        >
                          View Profile →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {filteredStudents.length === 0 && filteredAlumni.length === 0 && (
            <div className="py-12 text-center text-xs text-[#52525B]">
              No students or alumni matched &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
