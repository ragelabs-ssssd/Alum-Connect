'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  GitBranch,
  Globe,
  Play,
  Rocket,
  Save,
  Wand2,
  X,
} from 'lucide-react';
import ThemeToggle from '../../components/ThemeToggle';
import {
  computeReadiness,
  detectHostingPlatform,
  EMPTY_SHARE_DATA,
  SAMPLE_GROUP_PROJECT,
  ShareProjectFormData,
} from './shareTypes';
import {
  AcademicContributorsSection,
  DeploymentLinksSection,
  DualVideosSection,
  IdentitySection,
  LiveFeedCardPreview,
} from './ShareFields';

export default function ShareProjectPage() {
  const [data, setData] = useState<ShareProjectFormData>(EMPTY_SHARE_DATA);
  const [launchTab, setLaunchTab] = useState<
    'identity' | 'squad' | 'links' | 'videos'
  >('identity');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishedView, setPublishedView] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const readiness = computeReadiness(data);
  const platform = detectHostingPlatform(data.liveUrl);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  const handlePublish = () => {
    if (!data.projectName.trim()) {
      notify('Please enter a Project Name before publishing.');
      return;
    }
    setPreviewOpen(false);
    setPublishedView(true);
    notify(`Published "${data.projectName}" to Alum Connect Ecosystem!`);
  };

  const handleSaveDraft = () => {
    notify('Saved project draft locally.');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-[#09090B] dark:text-zinc-50 transition-colors">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-[#E4E4E7] dark:border-zinc-800 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-800 px-3 py-1 text-xs font-semibold hover:bg-[#F4F4F5] dark:hover:bg-zinc-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Student Studio
            </Link>
            <span className="text-sm font-bold hidden sm:inline">
              Share Project
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setData(SAMPLE_GROUP_PROJECT);
                notify('Filled sample ITER 4-member Group Project!');
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 hover:border-[#2563EB] px-3.5 py-1.5 text-xs font-semibold transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#2563EB]" />
              Fill Sample Project
            </button>
            <ThemeToggle compact />
          </div>
        </div>
      </header>

      {/* Main Content: Option 6 — Product Hunt Launchpad Tabs + Readiness % */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {publishedView ? (
          <div className="rounded-3xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> Published to Alum Connect Ecosystem
              </span>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPublishedView(false)}
                  className="text-[#52525B] hover:text-[#09090B] dark:hover:text-white"
                >
                  ← Edit Submission
                </button>
                <Link href="/student" className="text-[#2563EB] hover:underline">
                  Back to Student Studio →
                </Link>
              </div>
            </div>
            <LiveFeedCardPreview data={data} />
          </div>
        ) : (
          <div className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Launchpad Tabs + Launch Readiness % */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4E4E7] dark:border-zinc-800 pb-4">
              <div className="flex flex-wrap gap-1.5">
                {[
                  {
                    id: 'identity' as const,
                    label: '1. Identity',
                    ok: readiness.checks.identity,
                  },
                  {
                    id: 'squad' as const,
                    label: '2. Squad & Reg. Nos',
                    ok: readiness.checks.academic,
                  },
                  {
                    id: 'links' as const,
                    label: '3. Hosting Links',
                    ok: readiness.checks.links,
                  },
                  {
                    id: 'videos' as const,
                    label: '4. 2-Min Videos',
                    ok: readiness.checks.videos,
                  },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setLaunchTab(t.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors ${
                      launchTab === t.id
                        ? 'bg-[#18181B] text-white border-[#18181B] dark:bg-zinc-100 dark:text-zinc-950'
                        : 'bg-[#F4F4F5] dark:bg-zinc-800 border-[#E4E4E7] dark:border-zinc-700 hover:border-[#2563EB]'
                    }`}
                  >
                    {t.ok && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    )}
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full border-4 border-[#2563EB] flex items-center justify-center text-[11px] font-mono font-bold">
                  {readiness.pct}%
                </div>
                <span className="text-xs font-semibold">Launch Readiness</span>
              </div>
            </div>

            {/* Active Tab Form Fields */}
            {launchTab === 'identity' && (
              <IdentitySection data={data} onChange={setData} />
            )}
            {launchTab === 'squad' && (
              <AcademicContributorsSection data={data} onChange={setData} />
            )}
            {launchTab === 'links' && (
              <DeploymentLinksSection data={data} onChange={setData} />
            )}
            {launchTab === 'videos' && (
              <DualVideosSection data={data} onChange={setData} />
            )}

            {/* Action Bar: Save Draft -> Preview -> Publish Build to Ecosystem */}
            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-4 border-t border-[#E4E4E7] dark:border-zinc-800">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-semibold hover:bg-[#F4F4F5] dark:hover:bg-zinc-800"
              >
                <Save className="w-3.5 h-3.5" />
                Save Draft
              </button>

              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#2563EB] text-[#2563EB] dark:text-sky-400 bg-blue-50/60 dark:bg-sky-500/10 hover:bg-blue-100/70 px-4 py-2 text-xs font-semibold transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>

              <button
                type="button"
                onClick={handlePublish}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-white px-5 py-2 text-xs font-semibold transition-colors"
              >
                <Rocket className="w-3.5 h-3.5" />
                Publish Build to Ecosystem
              </button>
            </div>
          </div>
        )}
      </main>

      {/* PREVIEW MODAL (Triggered before Publish) */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] dark:border-zinc-800 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#2563EB]">
                  PRE-LAUNCH PREVIEW • {readiness.pct}% READY
                </span>
                <h2 className="text-base font-bold">
                  How your project will appear on Alum Connect
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-lg border border-[#E4E4E7] dark:border-zinc-700 p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <LiveFeedCardPreview data={data} />

            {data.detailedDesc && (
              <div className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5] dark:bg-zinc-800/70 p-4 space-y-1">
                <div className="text-[11px] font-bold uppercase text-[#52525B] dark:text-zinc-400">
                  Detailed Description
                </div>
                <p className="text-xs text-[#09090B] dark:text-zinc-200 whitespace-pre-line leading-relaxed">
                  {data.detailedDesc}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-[#E4E4E7] dark:border-zinc-800 p-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#2563EB] shrink-0" />
                <span className="font-mono truncate">
                  {platform}: {data.liveUrl || 'Not provided'}
                </span>
              </div>
              <div className="rounded-xl border border-[#E4E4E7] dark:border-zinc-800 p-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#52525B] shrink-0" />
                <span className="font-mono truncate">
                  {data.githubUrl || 'No GitHub URL'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-[#09090B] text-white p-3 flex items-center gap-2 font-mono">
                <Play className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">
                  Demo (2:00):{' '}
                  {data.demoVideo.fileName || data.demoVideo.url || 'Pending'}
                </span>
              </div>
              <div className="rounded-xl bg-[#09090B] text-white p-3 flex items-center gap-2 font-mono">
                <Play className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">
                  Pitch (2:00):{' '}
                  {data.pitchVideo.fileName || data.pitchVideo.url || 'Pending'}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-[#E4E4E7] dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-2 text-xs font-semibold"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-5 py-2 text-xs font-semibold"
              >
                <Rocket className="w-3.5 h-3.5" />
                Publish Build to Ecosystem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 rounded-xl border border-[#E4E4E7] dark:border-zinc-700 bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2.5 text-xs font-semibold shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
