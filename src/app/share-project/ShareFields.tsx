'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Film,
  GitBranch,
  Globe,
  Link2,
  Loader2,
  Play,
  Plus,
  Search,
  Upload,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import {
  AcademicYear,
  detectHostingPlatform,
  isValidIterRegNo,
  ITER_STUDENTS_DIRECTORY,
  ShareProjectFormData,
  VideoInputState,
} from './shareTypes';

interface SectionProps {
  data: ShareProjectFormData;
  onChange: React.Dispatch<React.SetStateAction<ShareProjectFormData>>;
  compact?: boolean;
}

interface UploadSignPayload {
  ok: boolean;
  error?: string;
  code?: string;
  data?: {
    mode: 'supabase' | 'mock';
    bucket: string;
    path: string;
    signedUrl: string | null;
    token: string;
    publicUrl: string | null;
  };
}

interface UploadOutcome {
  ok: boolean;
  mode?: 'supabase' | 'mock';
  path?: string;
  publicUrl?: string | null;
  error?: string;
  unauthorized?: boolean;
}

async function uploadFileViaSignedEndpoint(
  bucket: 'project-media' | 'research-pdfs',
  file: File
): Promise<UploadOutcome> {
  try {
    const signRes = await fetch('/api/uploads/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bucket,
        fileName: file.name,
        mimeType: file.type || (bucket === 'research-pdfs' ? 'application/pdf' : 'video/mp4'),
        sizeBytes: file.size,
      }),
    });

    const json = (await signRes.json()) as UploadSignPayload;
    if (signRes.status === 401 || json.code === 'UNAUTHORIZED') {
      return {
        ok: false,
        unauthorized: true,
        error: json.error ?? 'Sign in required to upload media.',
      };
    }

    if (!signRes.ok || !json.ok || !json.data) {
      return {
        ok: false,
        error: json.error ?? 'Failed to authorize upload.',
      };
    }

    const signed = json.data;
    if (signed.mode === 'supabase' && signed.signedUrl) {
      const putRes = await fetch(signed.signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });

      if (!putRes.ok) {
        return {
          ok: false,
          error: `Storage upload failed (${putRes.status}).`,
        };
      }
    }

    return {
      ok: true,
      mode: signed.mode,
      path: signed.path,
      publicUrl: signed.publicUrl,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error during upload.',
    };
  }
}

const DOMAIN_CHOICES = [
  'Full-Stack & Cloud',
  'Applied AI',
  'Product & FinTech',
  'IoT & Systems',
  'Cybersecurity & ZK',
  'Graphics & WebXR',
];

export function IdentitySection({ data, onChange, compact }: SectionProps) {
  const remaining = 120 - data.oneLiner.length;
  const [techInput, setTechInput] = useState('');
  const [pdfStatus, setPdfStatus] = useState<{
    state: 'idle' | 'uploading' | 'done' | 'error';
    message?: string;
    unauthorized?: boolean;
  }>({ state: 'idle' });

  const guidanceOptions = [
    'Methodology Review',
    'Dataset / Compute',
    'Co-Author Mentorship',
    'Venue Selection',
  ];

  const toggleGuidance = (item: string) => {
    const exists = data.research.guidanceNeeded.includes(item);
    onChange((p) => ({
      ...p,
      research: {
        ...p.research,
        guidanceNeeded: exists
          ? p.research.guidanceNeeded.filter((g) => g !== item)
          : [...p.research.guidanceNeeded, item],
      },
    }));
  };

  const addTechTag = () => {
    const cleaned = techInput.trim();
    if (!cleaned) return;
    if (data.techStack.some((t) => t.toLowerCase() === cleaned.toLowerCase())) {
      setTechInput('');
      return;
    }
    onChange((p) => ({ ...p, techStack: [...p.techStack, cleaned] }));
    setTechInput('');
  };

  const handlePdfUpload = async (file: File) => {
    setPdfStatus({ state: 'uploading', message: `Signing ${file.name}...` });
    const outcome = await uploadFileViaSignedEndpoint('research-pdfs', file);
    if (!outcome.ok) {
      setPdfStatus({
        state: 'error',
        message: outcome.error,
        unauthorized: outcome.unauthorized,
      });
      return;
    }

    onChange((p) => ({
      ...p,
      research: {
        ...p.research,
        paperPdfName: file.name,
        pdfStoragePath: outcome.path ?? p.research.pdfStoragePath,
      },
    }));
    setPdfStatus({
      state: 'done',
      message:
        outcome.mode === 'supabase'
          ? 'Uploaded PDF to private research-pdfs bucket'
          : 'Signed mock PDF path attached (demo mode)',
    });
  };

  return (
    <div className="space-y-3">
      {/* Submission Type Toggle */}
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 p-1">
        {[
          { id: 'project' as const, label: 'Project / Product Build' },
          { id: 'research_paper' as const, label: 'Research Paper (Alumni Guidance)' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange((p) => ({ ...p, submissionType: t.id }))}
            className={`rounded-lg py-1.5 px-2 text-xs font-semibold transition-all ${
              data.submissionType === t.id
                ? 'bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950'
                : 'text-[#52525B] dark:text-zinc-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">
          {data.submissionType === 'research_paper'
            ? 'Research Paper Title *'
            : 'Project Name *'}
        </label>
        <input
          type="text"
          value={data.projectName}
          onChange={(e) =>
            onChange((p) => ({ ...p, projectName: e.target.value }))
          }
          placeholder={
            data.submissionType === 'research_paper'
              ? 'e.g., Low-Latency RAG Evaluation for Indian Legal Corpora'
              : 'e.g., Ragelabs Campus Proof Engine'
          }
          className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#2563EB]"
        />
      </div>

      {data.submissionType === 'research_paper' && (
        <div className="rounded-2xl border border-blue-200 dark:border-sky-500/30 bg-blue-50/40 dark:bg-sky-500/5 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Target Venue / Conference
              </label>
              <input
                type="text"
                value={data.research.targetVenue}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    research: { ...p.research, targetVenue: e.target.value },
                  }))
                }
                placeholder="IEEE, ACM, Springer, arXiv..."
                className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Research Domain
              </label>
              <input
                type="text"
                value={data.research.researchDomain}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    research: { ...p.research, researchDomain: e.target.value },
                  }))
                }
                placeholder="Applied AI, Systems, Security, IoT..."
                className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs font-semibold cursor-pointer hover:border-[#2563EB]">
              {pdfStatus.state === 'uploading' ? (
                <Loader2 className="w-3.5 h-3.5 text-[#2563EB] animate-spin shrink-0" />
              ) : (
                <Upload className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              )}
              <span className="truncate">
                {data.research.paperPdfName || 'Upload Paper PDF (<= 25MB)'}
              </span>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    void handlePdfUpload(f);
                  }
                }}
              />
            </label>
            <input
              type="url"
              value={data.research.paperUrl}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  research: { ...p.research, paperUrl: e.target.value },
                }))
              }
              placeholder="Or paste arXiv / Overleaf / Drive URL..."
              className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#2563EB]"
            />
          </div>

          {pdfStatus.state !== 'idle' && (
            <div
              className={`rounded-xl px-3 py-2 text-[11px] flex items-center justify-between gap-2 ${
                pdfStatus.state === 'error'
                  ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
                  : pdfStatus.state === 'done'
                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    : 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30'
              }`}
            >
              <span className="flex items-center gap-1.5">
                {pdfStatus.state === 'error' ? (
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                )}
                {pdfStatus.message}
              </span>
              {pdfStatus.unauthorized && (
                <Link
                  href="/login?next=/share-project"
                  className="font-bold underline shrink-0"
                >
                  Sign in →
                </Link>
              )}
            </div>
          )}

          <div>
            <div className="text-xs font-semibold mb-1.5">
              Alumni Guidance &amp; Contribution Needed
            </div>
            <div className="flex flex-wrap gap-1.5">
              {guidanceOptions.map((g) => {
                const active = data.research.guidanceNeeded.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGuidance(g)}
                    className={`rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                      active
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-white dark:bg-zinc-900 border-[#E4E4E7] dark:border-zinc-700 text-[#52525B]'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {data.submissionType === 'project' && (
        <div>
          <label className="block text-xs font-semibold mb-1">
            Primary Engineering Domain
          </label>
          <select
            value={data.domain}
            onChange={(e) =>
              onChange((p) => ({ ...p, domain: e.target.value }))
            }
            className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#2563EB]"
          >
            {DOMAIN_CHOICES.map((dom) => (
              <option key={dom} value={dom}>
                {dom}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold">One-Liner Pitch *</label>
          <span
            className={`text-[11px] font-mono ${
              remaining < 15 ? 'text-amber-600 font-bold' : 'text-[#52525B]'
            }`}
          >
            {data.oneLiner.length}/120
          </span>
        </div>
        <input
          type="text"
          maxLength={120}
          value={data.oneLiner}
          onChange={(e) =>
            onChange((p) => ({ ...p, oneLiner: e.target.value }))
          }
          placeholder="Short, punchy tagline for your project card..."
          className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#2563EB]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">
          Short Description (2–3 sentences for feed card) *
        </label>
        <textarea
          rows={compact ? 2 : 3}
          value={data.shortDesc}
          onChange={(e) =>
            onChange((p) => ({ ...p, shortDesc: e.target.value }))
          }
          placeholder="Summarize what your build does and why it matters..."
          className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#2563EB]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">
          Detailed Description (Problem, Architecture, Impact) *
        </label>
        <textarea
          rows={compact ? 3 : 4}
          value={data.detailedDesc}
          onChange={(e) =>
            onChange((p) => ({ ...p, detailedDesc: e.target.value }))
          }
          placeholder="Break down the problem, technical architecture, and traction/impact..."
          className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#2563EB]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">
          Tech Stack Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTechTag();
              }
            }}
            placeholder="Add tech (e.g., Rust, LangGraph, PostgreSQL)..."
            className="flex-1 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-1.5 text-xs focus:outline-none focus:border-[#2563EB]"
          />
          <button
            type="button"
            onClick={addTechTag}
            className="inline-flex items-center gap-1 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-1.5 text-xs font-semibold hover:border-[#2563EB]"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center gap-1 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 text-[11px] font-medium"
            >
              {tech}
              <button
                type="button"
                onClick={() =>
                  onChange((p) => ({
                    ...p,
                    techStack: p.techStack.filter((t) => t !== tech),
                  }))
                }
                aria-label={`Remove ${tech}`}
                className="text-[#52525B] hover:text-rose-600"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AcademicContributorsSection({ data, onChange }: SectionProps) {
  const [searchMate, setSearchMate] = useState('');

  const matchingDirectory = ITER_STUDENTS_DIRECTORY.filter(
    (s) =>
      !data.teammates.some((t) => t.id === s.id) &&
      (s.name.toLowerCase().includes(searchMate.toLowerCase()) ||
        s.email.toLowerCase().includes(searchMate.toLowerCase()) ||
        s.regNumber.includes(searchMate))
  );

  const regValid = isValidIterRegNo(data.regNumber);

  return (
    <div className="space-y-3.5">
      {/* Individual vs Group Project Toggle */}
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 p-1">
        {(['individual', 'group'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChange((p) => ({ ...p, mode: m }))}
            className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold transition-all ${
              data.mode === m
                ? 'bg-[#18181B] text-white dark:bg-zinc-100 dark:text-zinc-950'
                : 'text-[#52525B] dark:text-zinc-400'
            }`}
          >
            {m === 'individual' ? (
              <>
                <UserCheck className="w-3.5 h-3.5" /> Individual
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5" /> Group Project
              </>
            )}
          </button>
        ))}
      </div>

      {data.mode === 'individual' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1">
              Academic Year *
            </label>
            <select
              value={data.academicYear}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  academicYear: e.target.value as AcademicYear,
                }))
              }
              className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#2563EB]"
            >
              {(['1st Year', '2nd Year', '3rd Year', '4th Year'] as AcademicYear[]).map(
                (yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold">
                Student Registration No. *
              </label>
              {data.regNumber && (
                <span
                  className={`text-[10px] font-mono font-bold ${
                    regValid ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {regValid ? 'ITER Verified ✓' : '10 digits (224101XXXX)'}
                </span>
              )}
            </div>
            <input
              type="text"
              maxLength={10}
              value={data.regNumber}
              onChange={(e) =>
                onChange((p) => ({ ...p, regNumber: e.target.value.replace(/\D/g, '') }))
              }
              placeholder="224101XXXX"
              className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-[#2563EB]"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Interactive Teammate Search Dropdown */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#52525B] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchMate}
              onChange={(e) => setSearchMate(e.target.value)}
              placeholder="Search & tag ITER teammates by name, email, or reg. no..."
              className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-[#2563EB]"
            />
            {matchingDirectory.length > 0 && (
              <div className="mt-1.5 max-h-32 overflow-y-auto rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 divide-y divide-[#E4E4E7] dark:divide-zinc-800">
                {matchingDirectory.map((mate) => (
                  <button
                    key={mate.id}
                    type="button"
                    onClick={() => {
                      onChange((p) => ({
                        ...p,
                        teammates: [...p.teammates, mate],
                      }));
                      setSearchMate('');
                    }}
                    className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-[#F4F4F5] dark:hover:bg-zinc-900 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center text-[10px] font-bold">
                        {mate.initials}
                      </span>
                      <div>
                        <div className="font-semibold">{mate.name}</div>
                        <div className="text-[10px] text-[#52525B]">{mate.year}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-[#2563EB]">
                      + Tag ({mate.regNumber})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tagged Teammates List with Verified Reg. No */}
          <div className="space-y-2">
            {data.teammates.map((mate) => {
              const valid = isValidIterRegNo(mate.regNumber);
              return (
                <div
                  key={mate.id}
                  className="rounded-xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 flex items-center justify-center text-[10px] font-bold">
                      {mate.initials}
                    </span>
                    <div>
                      <div className="font-semibold">{mate.name}</div>
                      <div className="text-[10px] text-[#52525B]">{mate.year}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      maxLength={10}
                      value={mate.regNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        onChange((p) => ({
                          ...p,
                          teammates: p.teammates.map((t) =>
                            t.id === mate.id ? { ...t, regNumber: val } : t
                          ),
                        }));
                      }}
                      placeholder="Reg. No"
                      className={`w-28 rounded-lg border px-2 py-1 text-[11px] font-mono bg-white dark:bg-zinc-950 ${
                        valid
                          ? 'border-emerald-400 text-emerald-700 dark:text-emerald-300'
                          : 'border-amber-400'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        onChange((p) => ({
                          ...p,
                          teammates: p.teammates.filter((t) => t.id !== mate.id),
                        }))
                      }
                      aria-label={`Remove ${mate.name}`}
                      className="text-[#52525B] hover:text-rose-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function DeploymentLinksSection({ data, onChange }: SectionProps) {
  const platform = detectHostingPlatform(data.liveUrl);
  const [tested, setTested] = useState(false);

  return (
    <div className="space-y-3">
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold">
            Live Hosted Project URL *
          </label>
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-sky-500/10 border border-blue-200 dark:border-sky-500/25 px-2 py-0.5 text-[10px] font-mono font-bold text-[#2563EB] dark:text-sky-400">
            <Globe className="w-3 h-3" /> {platform}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="url"
            value={data.liveUrl}
            onChange={(e) => {
              setTested(false);
              onChange((p) => ({ ...p, liveUrl: e.target.value }));
            }}
            placeholder="https://your-project.vercel.app"
            className="flex-1 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#2563EB]"
          />
          <button
            type="button"
            disabled={!data.liveUrl.startsWith('http')}
            onClick={() => setTested(true)}
            className="inline-flex items-center gap-1 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800 px-3 py-2 text-xs font-semibold disabled:opacity-40 hover:border-[#2563EB]"
          >
            {tested ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Reachable
              </>
            ) : (
              <>
                <ExternalLink className="w-3.5 h-3.5" /> Test Link
              </>
            )}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1">
          GitHub Repository URL (Recommended Proof-of-Work)
        </label>
        <div className="relative">
          <GitBranch className="w-3.5 h-3.5 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="url"
            value={data.githubUrl}
            onChange={(e) =>
              onChange((p) => ({ ...p, githubUrl: e.target.value }))
            }
            placeholder="https://github.com/username/repo"
            className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-9 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-[#2563EB]"
          />
        </div>
      </div>
    </div>
  );
}

function SingleVideoSlot({
  title,
  subtitle,
  video,
  onUpdate,
}: {
  title: string;
  subtitle: string;
  video: VideoInputState;
  onUpdate: (next: VideoInputState) => void;
}) {
  const [uploadStatus, setUploadStatus] = useState<{
    state: 'idle' | 'uploading' | 'done' | 'error';
    message?: string;
    unauthorized?: boolean;
  }>({ state: 'idle' });

  const hasPreview = Boolean(video.fileName || video.url.trim());

  const handleVideoFile = async (file: File) => {
    setUploadStatus({ state: 'uploading', message: `Uploading ${file.name}...` });
    const outcome = await uploadFileViaSignedEndpoint('project-media', file);
    if (!outcome.ok) {
      setUploadStatus({
        state: 'error',
        message: outcome.error,
        unauthorized: outcome.unauthorized,
      });
      return;
    }

    onUpdate({
      ...video,
      fileName: file.name,
      url: outcome.publicUrl || outcome.path || video.url,
    });
    setUploadStatus({
      state: 'done',
      message:
        outcome.mode === 'supabase'
          ? 'Uploaded to project-media bucket'
          : 'Signed mock video attached (demo mode)',
    });
  };

  return (
    <div className="rounded-xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-900 p-3.5 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-bold flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-[#2563EB]" />
            {title}
          </div>
          <p className="text-[11px] text-[#52525B] dark:text-zinc-400">{subtitle}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-2 py-0.5 text-[10px] font-mono font-bold">
            2:00 MAX
          </span>
          <div className="flex rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 p-0.5 text-[10px] font-semibold">
            <button
              type="button"
              onClick={() => onUpdate({ ...video, mode: 'upload' })}
              className={`rounded-full px-2 py-0.5 ${
                video.mode === 'upload' ? 'bg-[#2563EB] text-white' : 'text-[#52525B]'
              }`}
            >
              MP4/WebM
            </button>
            <button
              type="button"
              onClick={() => onUpdate({ ...video, mode: 'link' })}
              className={`rounded-full px-2 py-0.5 ${
                video.mode === 'link' ? 'bg-[#2563EB] text-white' : 'text-[#52525B]'
              }`}
            >
              Video Link
            </button>
          </div>
        </div>
      </div>

      {video.mode === 'upload' ? (
        <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 p-3 text-center cursor-pointer hover:border-[#2563EB]">
          {uploadStatus.state === 'uploading' ? (
            <Loader2 className="w-4 h-4 text-[#2563EB] mb-1 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 text-[#2563EB] mb-1" />
          )}
          <span className="text-[11px] font-semibold">
            {video.fileName || 'Drop MP4 / WebM (<= 150MB) or click to browse'}
          </span>
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                void handleVideoFile(f);
              }
            }}
          />
        </label>
      ) : (
        <div className="relative">
          <Link2 className="w-3.5 h-3.5 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="url"
            value={video.url}
            onChange={(e) => onUpdate({ ...video, url: e.target.value })}
            placeholder="Paste Loom or YouTube Unlisted URL..."
            className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 pl-8 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-[#2563EB]"
          />
        </div>
      )}

      {uploadStatus.state !== 'idle' && (
        <div
          className={`rounded-lg px-3 py-1.5 text-[11px] flex items-center justify-between gap-2 ${
            uploadStatus.state === 'error'
              ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/30'
              : uploadStatus.state === 'done'
                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                : 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30'
          }`}
        >
          <span>{uploadStatus.message}</span>
          {uploadStatus.unauthorized && (
            <Link
              href="/login?next=/share-project"
              className="font-bold underline shrink-0"
            >
              Sign in →
            </Link>
          )}
        </div>
      )}

      {hasPreview && (
        <div className="rounded-lg bg-[#09090B] text-white px-3 py-2 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1.5 font-mono truncate">
            <Play className="w-3 h-3 text-sky-400 fill-current shrink-0" />
            {video.fileName || video.url}
          </span>
          <span className="text-emerald-400 font-semibold shrink-0 ml-2">
            Preview Ready
          </span>
        </div>
      )}
    </div>
  );
}

export function DualVideosSection({ data, onChange }: SectionProps) {
  return (
    <div className="space-y-3">
      <SingleVideoSlot
        title="Video 1 — 2-Minute Product Demo Walkthrough"
        subtitle="Screen recording showing your working live app & user flow."
        video={data.demoVideo}
        onUpdate={(next) => onChange((p) => ({ ...p, demoVideo: next }))}
      />
      <SingleVideoSlot
        title="Video 2 — 2-Minute Founder / Team Pitch"
        subtitle="Pitch the problem, use-case & ask (mentorship, internship, or acqui-hire)."
        video={data.pitchVideo}
        onUpdate={(next) => onChange((p) => ({ ...p, pitchVideo: next }))}
      />
    </div>
  );
}

export function LiveFeedCardPreview({ data }: { data: ShareProjectFormData }) {
  const platform = detectHostingPlatform(data.liveUrl);
  return (
    <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm space-y-3.5">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {data.submissionType === 'research_paper' && (
            <span className="rounded-full bg-[#2563EB] text-white px-2.5 py-0.5 font-semibold">
              Research Paper
            </span>
          )}
          <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 font-semibold">
            {data.mode === 'group'
              ? `Group (${data.teammates.length} Members)`
              : `Individual • ${data.academicYear}`}
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#2563EB] font-semibold">
          {data.submissionType === 'research_paper'
            ? data.research.targetVenue
            : platform}
        </span>
      </div>

      <div>
        <h3 className="text-base font-bold">
          {data.projectName || 'Your Project Name'}
        </h3>
        <p className="text-xs font-medium text-[#2563EB] mt-0.5">
          {data.oneLiner || 'Your 120-character one-liner pitch appears here'}
        </p>
        <p className="text-xs text-[#52525B] dark:text-zinc-300 mt-2 leading-relaxed">
          {data.shortDesc ||
            'Your 2–3 sentence summary for alumni and recruiters will preview here.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {data.mode === 'individual' ? (
          <span className="rounded-md bg-[#F4F4F5] dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono">
            Reg: {data.regNumber || '224101XXXX'}
          </span>
        ) : (
          data.teammates.map((t) => (
            <span
              key={t.id}
              className="rounded-md bg-[#F4F4F5] dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono"
            >
              {t.name.split(' ')[0]} ({t.regNumber || 'Reg#'})
            </span>
          ))
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E4E4E7] dark:border-zinc-800 text-[11px]">
        <div className="rounded-lg bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-1.5 font-mono truncate">
          Demo: {data.demoVideo.url || data.demoVideo.fileName ? 'Attached ✓' : 'Pending'}
        </div>
        <div className="rounded-lg bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-1.5 font-mono truncate">
          Pitch: {data.pitchVideo.url || data.pitchVideo.fileName ? 'Attached ✓' : 'Pending'}
        </div>
      </div>
    </div>
  );
}
