'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Eye,
  GitBranch,
  Globe,
  Loader2,
  LogIn,
  Play,
  Rocket,
  Save,
  Wand2,
  X,
} from 'lucide-react';
import AlumConnectLogo from '@/components/AlumConnectLogo';
import ThemeToggle from '@/components/ThemeToggle';
import { publishBuildAction } from '@/modules/builds/actions';
import type { FeedBuildItem } from '@/types/domain';
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
  const router = useRouter();
  const [data, setData] = useState<ShareProjectFormData>(EMPTY_SHARE_DATA);
  const [launchTab, setLaunchTab] = useState<
    'identity' | 'squad' | 'links' | 'videos'
  >('identity');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishedItem, setPublishedItem] = useState<FeedBuildItem | null>(
    null
  );
  const [draftSavedItem, setDraftSavedItem] = useState<FeedBuildItem | null>(
    null
  );
  const [authRequiredError, setAuthRequiredError] = useState<string | null>(
    null
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const readiness = computeReadiness(data);
  const platform = detectHostingPlatform(data.liveUrl);

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3600);
  };

  const buildPayload = (status: 'draft' | 'published') => {
    const isPaper = data.submissionType === 'research_paper';
    const storySource =
      data.detailedDesc.trim() ||
      data.shortDesc.trim() ||
      data.oneLiner.trim();
    const paddedStory =
      storySource.length >= 10
        ? storySource
        : `${storySource} — Built at ITER, Siksha 'O' Anusandhan.`;

    return {
      buildType: isPaper ? ('paper' as const) : ('project' as const),
      status,
      title: data.projectName.trim(),
      subtitle: data.oneLiner.trim(),
      shortDesc: data.shortDesc.trim() || data.oneLiner.trim(),
      story: paddedStory,
      domain: isPaper
        ? data.research.researchDomain.trim() || 'Applied AI & ML'
        : data.domain || 'Full-Stack & Cloud',
      techStack: data.techStack,
      collaborationMode:
        data.mode === 'group' ? ('Group' as const) : ('Solo' as const),
      teamSize:
        data.mode === 'group' ? Math.max(2, data.teammates.length) : 1,
      coContributorRegNos:
        data.mode === 'group'
          ? data.teammates.map((t) => t.regNumber).filter(Boolean)
          : data.regNumber
            ? [data.regNumber]
            : [],
      coContributors:
        data.mode === 'group'
          ? data.teammates
              .filter((t) => Boolean(t.regNumber))
              .map((t) => ({
                name: t.name,
                regNo: t.regNumber,
                academicYear: t.year,
              }))
          : [],
      academicYears: data.academicYear,
      liveUrl: data.liveUrl.trim(),
      hostingPlatform: detectHostingPlatform(data.liveUrl),
      githubUrl: data.githubUrl.trim(),
      demoVideoUrl: data.demoVideo.url.trim(),
      pitchVideoUrl: data.pitchVideo.url.trim(),
      venue: data.research.targetVenue.trim() || 'IEEE / arXiv Preprint',
      paperStatus:
        status === 'draft'
          ? ('Draft' as const)
          : ('Under Peer Review' as const),
      authorMode:
        data.mode === 'group' ? ('Dual' as const) : ('Solo' as const),
      coAuthorRegNo:
        isPaper && data.mode === 'group'
          ? data.teammates[0]?.regNumber ?? null
          : null,
      preprintUrl: data.research.paperUrl.trim(),
      pdfStoragePath: data.research.pdfStoragePath || null,
      guidanceNeeded: data.research.guidanceNeeded,
    };
  };

  const submitBuild = (status: 'draft' | 'published') => {
    setAuthRequiredError(null);
    setSubmitError(null);

    if (!data.projectName.trim()) {
      setSubmitError('Please enter a Project or Research Paper title first.');
      setLaunchTab('identity');
      return;
    }

    startTransition(async () => {
      const result = await publishBuildAction(buildPayload(status));

      if (!result.ok) {
        if (result.code === 'UNAUTHORIZED') {
          setAuthRequiredError(result.error);
          setPreviewOpen(false);
          return;
        }
        setSubmitError(result.error);
        notify(result.error);
        return;
      }

      setPreviewOpen(false);
      if (status === 'draft') {
        setDraftSavedItem(result.data);
        notify(`Saved draft "${result.data.title}" (${result.data.code}).`);
      } else {
        setDraftSavedItem(null);
        setPublishedItem(result.data);
        notify(`Published "${result.data.title}" to AlmaConnect Ecosystem!`);
      }
      router.refresh();
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-[#09090B] dark:text-zinc-50 transition-colors">
      {/* Liquid Chrome Sticky Header */}
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
            <div className="hidden sm:flex items-center gap-2">
              <AlumConnectLogo className="h-6 w-6" />
              <span className="text-sm font-bold">Share Build / Paper</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                setData(SAMPLE_GROUP_PROJECT);
                setAuthRequiredError(null);
                setSubmitError(null);
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-5">
        {/* Auth CTA Banner when UNAUTHORIZED */}
        {authRequiredError && (
          <div className="rounded-2xl border border-amber-400/50 bg-amber-50 dark:bg-amber-500/10 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  Sign in required to save or publish builds
                </div>
                <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mt-0.5">
                  {authRequiredError} Your form fields remain preserved in this tab.
                </p>
              </div>
            </div>
            <Link
              href="/login?next=/share-project"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-4 py-2 text-xs font-semibold hover:opacity-90"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In / Switch Persona →
            </Link>
          </div>
        )}

        {/* Validation / Server Error Banner */}
        {submitError && (
          <div className="rounded-2xl border border-rose-400/50 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-xs font-medium text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2">
            <span>{submitError}</span>
            <button
              type="button"
              onClick={() => setSubmitError(null)}
              className="p-1 hover:opacity-70"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Draft Confirmation Banner */}
        {draftSavedItem && !publishedItem && (
          <div className="rounded-2xl border border-[#0891B2]/35 bg-[#0891B2]/5 dark:bg-[#22D3EE]/10 px-4 py-3 text-xs flex flex-wrap items-center justify-between gap-2">
            <span className="font-semibold text-[#0E7490] dark:text-[#22D3EE] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Draft saved as {draftSavedItem.code}: &ldquo;{draftSavedItem.title}&rdquo;
            </span>
            <Link
              href={`/projects/${draftSavedItem.slug}`}
              className="inline-flex items-center gap-1 font-bold text-[#0891B2] dark:text-[#22D3EE] hover:underline"
            >
              Inspect Draft <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {publishedItem ? (
          <div className="rounded-3xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-zinc-900 p-6 sm:p-8 space-y-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3 py-1 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" /> Published ({publishedItem.code}) to AlmaConnect Ecosystem
              </span>
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPublishedItem(null)}
                  className="text-[#52525B] hover:text-[#09090B] dark:hover:text-white"
                >
                  ← Submit Another Build
                </button>
                <Link
                  href={`/projects/${publishedItem.slug}`}
                  className="inline-flex items-center gap-1 rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-3.5 py-1.5 text-xs font-semibold"
                >
                  Open Public Showcase
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/student"
                  className="text-[#2563EB] dark:text-sky-400 hover:underline"
                >
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
                disabled={isPending}
                onClick={() => submitBuild('draft')}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-semibold hover:bg-[#F4F4F5] dark:hover:bg-zinc-800 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                Save Draft
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => setPreviewOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#2563EB] text-[#2563EB] dark:text-sky-400 bg-blue-50/60 dark:bg-sky-500/10 hover:bg-blue-100/70 px-4 py-2 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => submitBuild('published')}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] hover:bg-[#27272A] dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-white px-5 py-2 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Rocket className="w-3.5 h-3.5" />
                )}
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
                disabled={isPending}
                onClick={() => setPreviewOpen(false)}
                className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 px-4 py-2 text-xs font-semibold"
              >
                Back to Edit
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => submitBuild('published')}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#18181B] dark:bg-zinc-100 text-white dark:text-zinc-950 px-5 py-2 text-xs font-semibold disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Rocket className="w-3.5 h-3.5" />
                )}
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
