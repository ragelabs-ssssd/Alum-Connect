import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  Award,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  FileText,
  Film,
  GitBranch,
  Globe,
  Layers,
  MessageSquareQuote,
  Sparkles,
  ThumbsUp,
  Users,
} from 'lucide-react';
import AlumConnectLogo from '@/components/AlumConnectLogo';
import ThemeToggle from '@/components/ThemeToggle';
import {
  formatHostLabel,
  formatShortDate,
  getCoverGradient,
  getDomainBadgeClass,
} from '@/components/shared/DomainUtils';
import { VouchCodeBadge } from '@/components/shared/VerificationBadge';
import { getSessionUser } from '@/lib/auth';
import {
  getBuildBySlugOrCodeQuery,
  listBuildsCursorQuery,
} from '@/modules/builds/queries';
import type { FeedBuildItem } from '@/types/domain';

function ProjectShowcaseSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-pulse">
      <div className="h-56 rounded-3xl bg-zinc-200 dark:bg-zinc-800/80" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-44 rounded-3xl bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-56 rounded-3xl bg-zinc-100 dark:bg-zinc-900" />
        </div>
        <div className="space-y-4">
          <div className="h-48 rounded-3xl bg-zinc-100 dark:bg-zinc-900" />
          <div className="h-44 rounded-3xl bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}

async function ProjectShowcaseContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const viewerUser = await getSessionUser();
  const build = await getBuildBySlugOrCodeQuery(decodedSlug, viewerUser?.id);

  if (!build) {
    notFound();
  }

  const isDraft = build.isPaper
    ? build.paperStatus === 'Draft'
    : build.status === 'draft';
  if (isDraft && !build.isMine && viewerUser?.role !== 'dean') {
    notFound();
  }

  let linkedCrossRef: FeedBuildItem | null = null;
  if (!build.isPaper && (build.linkedPaperId || build.linkedPaperCode)) {
    linkedCrossRef = await getBuildBySlugOrCodeQuery(
      build.linkedPaperId || build.linkedPaperCode || '',
      viewerUser?.id
    );
  } else if (build.isPaper) {
    const relatedProjects = await listBuildsCursorQuery({
      kind: 'project',
      limit: 60,
      viewerUserId: viewerUser?.id,
    });
    linkedCrossRef =
      relatedProjects.items.find(
        (item) =>
          !item.isPaper &&
          (item.linkedPaperId === build.id ||
            item.linkedPaperCode === build.code)
      ) ?? null;
  }

  const coverGradient = getCoverGradient(build.id || build.code);
  const liveHref = build.isPaper
    ? build.liveDemoUrl || build.preprintUrl
    : build.liveUrl;
  const repoHref = build.isPaper ? build.codeRepoUrl : build.githubUrl;
  const leadUserId = build.isPaper ? build.leadAuthorId : build.leadId;
  const leadName = build.isPaper ? build.leadAuthorName : build.leadName;
  const leadMeta = build.isPaper
    ? `${build.leadAuthorYearBranch} • Reg ${build.leadAuthorRegNo}`
    : `${build.batchLabel} • Reg ${build.leadRegNo}`;

  const statusLabel = build.isPaper
    ? build.paperStatus
    : build.status === 'verified'
      ? 'Verified Build'
      : build.status === 'draft'
        ? 'Draft'
        : 'Published';

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Hero Banner */}
      <section
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${coverGradient} p-6 sm:p-8 text-white shadow-lg border border-white/10`}
      >
        {build.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={build.coverImage}
            alt={build.title}
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

        <div className="relative z-10 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 backdrop-blur-md px-3 py-1 font-mono font-bold text-white">
                {build.code}
              </span>
              <span
                className={`rounded-full border px-3 py-1 text-[11px] font-semibold backdrop-blur-md ${getDomainBadgeClass(
                  build.domain
                )}`}
              >
                {build.domain}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/35 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {statusLabel}
              </span>
              {build.isPaper && (
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/20 border border-sky-400/35 px-3 py-1 text-[11px] font-semibold text-sky-200">
                  <BookOpen className="w-3.5 h-3.5" /> Research Paper
                </span>
              )}
            </div>

            <div className="inline-flex items-center gap-3 text-xs text-zinc-200">
              <span className="inline-flex items-center gap-1 font-semibold">
                <ThumbsUp className="w-3.5 h-3.5 text-[#22D3EE]" />
                {build.likesCount} Likes
              </span>
              <span>• {formatShortDate(build.createdAt)}</span>
            </div>
          </div>

          <div>
            <h1 className="font-luma-title text-2xl sm:text-3xl leading-tight tracking-tight text-white">
              {build.title}
            </h1>
            {build.subtitle && (
              <p className="text-sm sm:text-base text-zinc-200/95 mt-2 max-w-3xl">
                {build.subtitle}
              </p>
            )}
          </div>

          {/* Primary Action Links */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {liveHref && liveHref !== '#' && (
              <a
                href={liveHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-[#09090B] hover:bg-[#22D3EE] hover:text-[#041E24] px-4 py-2 text-xs font-bold transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                {build.isPaper && !build.liveDemoUrl
                  ? 'Read Preprint'
                  : `Live Demo (${formatHostLabel(liveHref) || (build.isPaper ? 'Demo' : build.hostingPlatform)})`}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            {repoHref && repoHref !== '#' && (
              <a
                href={repoHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 text-xs font-semibold transition-colors"
              >
                <GitBranch className="w-3.5 h-3.5" />
                Source Code ({formatHostLabel(repoHref) || 'GitHub'})
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {!build.isPaper && build.demoVideoUrl && (
              <a
                href={build.demoVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 text-xs font-semibold transition-colors"
              >
                <Film className="w-3.5 h-3.5 text-[#22D3EE]" />
                2-Min Demo Video
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {!build.isPaper && build.pitchVideoUrl && (
              <a
                href={build.pitchVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 text-xs font-semibold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
                2-Min Founder Pitch
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Architecture / Abstract, Tech Stack & Alumni Endorsements */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between gap-2 border-b border-[#E4E4E7] dark:border-zinc-800 pb-3">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0891B2] dark:text-[#22D3EE]" />
                {build.isPaper
                  ? 'Research Abstract & Methodology'
                  : 'Problem, Architecture & Impact'}
              </h2>
              {build.isPaper && build.pdfStoragePath && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#0891B2]/35 bg-[#0891B2]/10 px-2.5 py-0.5 text-[11px] font-mono text-[#0E7490] dark:text-[#22D3EE]">
                  <FileText className="w-3 h-3" />
                  PDF Attached
                </span>
              )}
            </div>

            {!build.isPaper && build.shortDesc && (
              <p className="text-sm font-medium text-[#09090B] dark:text-zinc-100 leading-relaxed">
                {build.shortDesc}
              </p>
            )}

            <p className="text-sm text-[#52525B] dark:text-zinc-300 whitespace-pre-line leading-relaxed">
              {build.story}
            </p>

            {/* Tech Stack */}
            <div className="pt-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 mb-2">
                Verified Tech Stack
              </div>
              <div className="flex flex-wrap gap-1.5">
                {build.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-800/80 px-3 py-1 text-xs font-medium text-[#09090B] dark:text-zinc-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {build.isPaper && build.guidanceNeeded.length > 0 && (
              <div className="pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 mb-2">
                  Alumni Guidance Requested
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {build.guidanceNeeded.map((g) => (
                    <span
                      key={g}
                      className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Alumni Endorsements, Vouch Certificates & Code Roasts */}
          <section className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between gap-2 border-b border-[#E4E4E7] dark:border-zinc-800 pb-3">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-[#059669] dark:text-[#34D399]" />
                Alumni Endorsements &amp; Vouch Certificates (
                {build.endorsements.length})
              </h2>
              <span className="text-[11px] font-mono text-[#52525B] dark:text-zinc-400">
                Cryptographically Verified
              </span>
            </div>

            {build.endorsements.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E4E4E7] dark:border-zinc-800 p-6 text-center text-xs text-[#52525B] dark:text-zinc-400 space-y-2">
                <MessageSquareQuote className="w-6 h-6 mx-auto opacity-50" />
                <p>
                  No alumni reviews yet. Verified alumni can endorse, roast, or
                  issue a cryptographic Vouch Certificate from the Alumni
                  Portal.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {build.endorsements.map((endorsement) => (
                  <article
                    key={endorsement.id}
                    className="rounded-2xl border border-[#E4E4E7] dark:border-zinc-800 bg-[#F4F4F5]/60 dark:bg-zinc-900/70 p-4 space-y-3"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <Link
                        href={`/u/${encodeURIComponent(endorsement.alumniUserId)}`}
                        className="flex items-center gap-3 group"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={
                            endorsement.alumAvatar ||
                            '/images/indian-alumni-mentor.jpg'
                          }
                          alt={endorsement.alumName}
                          className="h-10 w-10 rounded-full object-cover border border-[#E4E4E7] dark:border-zinc-700"
                        />
                        <div>
                          <div className="text-xs font-bold group-hover:text-[#0891B2] dark:group-hover:text-[#22D3EE] transition-colors">
                            {endorsement.alumName}
                          </div>
                          <div className="text-[11px] text-[#52525B] dark:text-zinc-400">
                            {endorsement.alumRole} @ {endorsement.alumCompany} •
                            Batch &apos;{String(endorsement.alumBatch).slice(-2)}
                          </div>
                        </div>
                      </Link>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                            endorsement.kind === 'roast'
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                              : endorsement.kind === 'vouch'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                                : 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30'
                          }`}
                        >
                          {endorsement.category || endorsement.kind}
                        </span>
                        {endorsement.vouchCode && (
                          <VouchCodeBadge vouchCode={endorsement.vouchCode} />
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#09090B] dark:text-zinc-200 leading-relaxed">
                      &ldquo;{endorsement.quote}&rdquo;
                    </p>

                    {endorsement.certifiedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {endorsement.certifiedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-white dark:bg-zinc-950 border border-[#E4E4E7] dark:border-zinc-800 px-2 py-0.5 text-[10px] font-mono text-[#0E7490] dark:text-[#22D3EE]"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Lead Builder, Squad Contributors & Linked Paper/Project */}
        <aside className="space-y-6">
          {/* Lead Builder Card */}
          <section className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-5 space-y-4 shadow-2xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400">
              {build.isPaper ? 'Lead Researcher' : 'Project Lead'}
            </div>

            <Link
              href={`/u/${encodeURIComponent(leadUserId)}`}
              className="flex items-center gap-3 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={build.authorAvatar || '/images/avatar-male-1.jpg'}
                alt={leadName}
                className="h-12 w-12 rounded-full object-cover border border-[#E4E4E7] dark:border-zinc-700"
              />
              <div className="min-w-0">
                <div className="text-sm font-bold truncate group-hover:text-[#0891B2] dark:group-hover:text-[#22D3EE] transition-colors">
                  {leadName}
                </div>
                <div className="text-xs text-[#52525B] dark:text-zinc-400 truncate">
                  {leadMeta}
                </div>
              </div>
            </Link>

            <Link
              href={`/u/${encodeURIComponent(leadUserId)}`}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-700 bg-[#F4F4F5] dark:bg-zinc-900 hover:border-[#0891B2] px-4 py-2 text-xs font-semibold transition-colors"
            >
              View Public Portfolio
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </section>

          {/* Squad Contributors */}
          <section className="rounded-3xl border border-[#E4E4E7] dark:border-zinc-800 bg-white dark:bg-[#14171E]/95 p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#52525B] dark:text-zinc-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0891B2] dark:text-[#22D3EE]" />
                {build.isPaper ? 'Co-Authors' : 'Squad Contributors'}
              </h3>
              <span className="text-[11px] font-mono text-[#52525B] dark:text-zinc-400">
                {build.isPaper
                  ? build.authorMode
                  : `${build.collaborationMode} (${build.teamSize})`}
              </span>
            </div>

            {build.isPaper ? (
              <div className="space-y-2 text-xs">
                <Link
                  href={`/u/${encodeURIComponent(build.leadAuthorId)}`}
                  className="flex items-center justify-between rounded-xl border border-[#E4E4E7] dark:border-zinc-800 px-3 py-2 hover:border-[#0891B2] transition-colors"
                >
                  <span className="font-semibold">{build.leadAuthorName}</span>
                  <span className="font-mono text-[11px] text-[#52525B] dark:text-zinc-400">
                    {build.leadAuthorRegNo}
                  </span>
                </Link>
                {build.coAuthorName && (
                  <div className="flex items-center justify-between rounded-xl border border-[#E4E4E7] dark:border-zinc-800 px-3 py-2">
                    <span className="font-semibold">{build.coAuthorName}</span>
                    <span className="font-mono text-[11px] text-[#52525B] dark:text-zinc-400">
                      {build.coAuthorRegNo ?? 'Co-Author'}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {build.contributors.map((member) => {
                  const content = (
                    <div className="flex items-center justify-between gap-2 w-full">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">
                          {member.name}
                        </div>
                        <div className="text-[10px] text-[#52525B] dark:text-zinc-400">
                          {member.academicYear}
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-[#0E7490] dark:text-[#22D3EE] shrink-0">
                        {member.regNo}
                      </span>
                    </div>
                  );

                  if (member.userId) {
                    return (
                      <Link
                        key={`${member.regNo}-${member.name}`}
                        href={`/u/${encodeURIComponent(member.userId)}`}
                        className="block rounded-xl border border-[#E4E4E7] dark:border-zinc-800 px-3 py-2 hover:border-[#0891B2] transition-colors"
                      >
                        {content}
                      </Link>
                    );
                  }

                  return (
                    <div
                      key={`${member.regNo}-${member.name}`}
                      className="rounded-xl border border-[#E4E4E7] dark:border-zinc-800 px-3 py-2"
                    >
                      {content}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Linked Paper / Linked Project Cross-Reference */}
          {linkedCrossRef && (
            <section className="rounded-3xl border border-[#0891B2]/35 dark:border-[#22D3EE]/30 bg-[linear-gradient(135deg,rgba(8,145,178,0.08)_0%,rgba(5,150,105,0.08)_100%)] p-5 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#0E7490] dark:text-[#22D3EE]">
                <span>
                  {linkedCrossRef.isPaper
                    ? 'Linked Research Paper'
                    : 'Linked Production Build'}
                </span>
                <span className="font-mono">{linkedCrossRef.code}</span>
              </div>
              <h3 className="text-sm font-bold leading-snug">
                {linkedCrossRef.title}
              </h3>
              <p className="text-xs text-[#52525B] dark:text-zinc-300 line-clamp-2">
                {linkedCrossRef.subtitle}
              </p>
              <Link
                href={`/projects/${linkedCrossRef.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#0891B2] dark:text-[#22D3EE] hover:underline pt-1"
              >
                Inspect {linkedCrossRef.code} <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}

export default function ProjectShowcasePage(props: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090B] text-[#09090B] dark:text-zinc-50 transition-colors">
      {/* Liquid Chrome Header */}
      <header className="sticky top-0 z-40 border-b border-[#E4E4E7] dark:border-zinc-800 bg-white/95 dark:bg-[#09090B]/95 backdrop-blur-md">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/student"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-800 px-3 py-1 text-xs font-semibold hover:bg-[#F4F4F5] dark:hover:bg-zinc-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Feed
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <AlumConnectLogo className="h-6 w-6" />
              <span className="font-luma-title text-sm hidden sm:inline">
                AlmaConnect
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/share-project"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-[#E4E4E7] dark:border-zinc-800 px-3 py-1.5 text-xs font-semibold hover:border-[#0891B2]"
            >
              Share Build
            </Link>
            <ThemeToggle compact />
          </div>
        </div>
      </header>

      <Suspense fallback={<ProjectShowcaseSkeleton />}>
        <ProjectShowcaseContent params={props.params} />
      </Suspense>
    </div>
  );
}
