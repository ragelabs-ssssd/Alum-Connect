'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Film,
  GitBranch,
  Globe,
  Link2,
  Play,
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

export function IdentitySection({ data, onChange, compact }: SectionProps) {
  const remaining = 120 - data.oneLiner.length;
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs font-semibold mb-1">
          Project Name *
        </label>
        <input
          type="text"
          value={data.projectName}
          onChange={(e) =>
            onChange((p) => ({ ...p, projectName: e.target.value }))
          }
          placeholder="e.g., Ragelabs Campus Proof Engine"
          className="w-full rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#2563EB]"
        />
      </div>

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
          Detailed Description (Problem, Architecture, Impact)
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
  const hasPreview = Boolean(video.fileName || video.url.trim());

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
          <Upload className="w-4 h-4 text-[#2563EB] mb-1" />
          <span className="text-[11px] font-semibold">
            {video.fileName || 'Drop MP4 / WebM or click to browse'}
          </span>
          <input
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpdate({ ...video, fileName: f.name });
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
        <span className="rounded-full bg-[#F4F4F5] dark:bg-zinc-800 px-2.5 py-0.5 font-semibold">
          {data.mode === 'group'
            ? `Group Project (${data.teammates.length} Members)`
            : `Individual • ${data.academicYear}`}
        </span>
        <span className="font-mono text-[11px] text-[#2563EB] font-semibold">
          {platform}
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
