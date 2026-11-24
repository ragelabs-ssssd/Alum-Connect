import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';
import { getDefaultPersonaForRole, getSessionUser } from '@/lib/auth';
import { isDemoModeEnabled } from '@/lib/env';
import { listBuildsCursorQuery } from '@/modules/builds/queries';
import {
  getDeanAnalyticsQuery,
  listAuditLogsQuery,
  listPlacementOffersQuery,
  listVerificationRequestsQuery,
} from '@/modules/governance/queries';
import { listNetworkDirectoryQuery } from '@/modules/identity/queries';
import { DeanDashboardShell } from './_components/DeanDashboardShell';

function DeanSkeleton() {
  return (
    <div className="min-h-dvh bg-[#F8FAFC] dark:bg-[#07080A] px-4 sm:px-6 py-8">
      <div className="max-w-[1440px] mx-auto space-y-6 animate-pulse">
        <div className="h-14 rounded-2xl bg-slate-200/80 dark:bg-white/[0.06]" />
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-28 rounded-3xl bg-slate-200/70 dark:bg-white/[0.05]"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-3xl bg-slate-200/70 dark:bg-white/[0.05]" />
          <div className="h-64 rounded-3xl bg-slate-200/70 dark:bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}

async function DeanLoader() {
  const sessionUser = await getSessionUser();
  const demoEnabled = isDemoModeEnabled();

  if (sessionUser && sessionUser.role !== 'dean') {
    const portalHref = sessionUser.role === 'alumni' ? '/alumni' : '/student';
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#F8FAFC] dark:bg-[#07080A] px-4">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#14171E] p-7 text-center space-y-4 shadow-xl">
          <Building2 className="w-10 h-10 text-[#0891B2] dark:text-[#22D3EE] mx-auto" />
          <h1 className="font-luma-title text-xl">
            Dean &amp; T&amp;P Governance Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
            You are currently signed in as{' '}
            <span className="font-semibold text-[#0F172A] dark:text-white">
              {sessionUser.fullName}
            </span>{' '}
            ({sessionUser.role}). Switch to a Dean account to review alumni
            verifications and placement governance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <Link
              href={portalHref}
              className="rounded-full border border-slate-300 dark:border-white/20 px-4 py-2 text-xs font-semibold"
            >
              Go to My Portal
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-4 py-2 text-xs font-semibold"
            >
              Switch Persona <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fallbackDean =
    !sessionUser && demoEnabled ? getDefaultPersonaForRole('dean') : null;

  const activeDean = sessionUser ?? fallbackDean;

  if (!activeDean) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#F8FAFC] dark:bg-[#07080A] px-4">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#14171E] p-7 text-center space-y-4 shadow-xl">
          <Building2 className="w-10 h-10 text-[#0891B2] dark:text-[#22D3EE] mx-auto" />
          <h1 className="font-luma-title text-xl">
            Dean &amp; T&amp;P Portal Authentication Required
          </h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
            Sign in with your institutional Dean / Training &amp; Placement
            account to access governance analytics and verification queues.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-5 py-2 text-xs font-semibold"
          >
            Sign In <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const isPreviewMode = !sessionUser && Boolean(fallbackDean);

  const [
    initialAnalytics,
    initialVerifications,
    initialOffers,
    initialAuditLogs,
    initialBuildsPage,
    initialDirectory,
  ] = await Promise.all([
    getDeanAnalyticsQuery(),
    listVerificationRequestsQuery('all'),
    listPlacementOffersQuery('All'),
    listAuditLogsQuery(),
    listBuildsCursorQuery({ limit: 20, viewerUserId: activeDean.id }),
    listNetworkDirectoryQuery({ scope: 'all', viewerUserId: activeDean.id }),
  ]);

  return (
    <DeanDashboardShell
      dean={activeDean}
      isPreviewMode={isPreviewMode}
      demoEnabled={demoEnabled}
      initialAnalytics={initialAnalytics}
      initialVerifications={initialVerifications}
      initialOffers={initialOffers}
      initialAuditLogs={initialAuditLogs}
      initialBuildsPage={initialBuildsPage}
      initialDirectory={initialDirectory}
    />
  );
}

export default function DeanPage() {
  return (
    <Suspense fallback={<DeanSkeleton />}>
      <DeanLoader />
    </Suspense>
  );
}
