import React, { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getDefaultPersonaForRole, getSessionUser } from '@/lib/auth';
import { isDemoModeEnabled } from '@/lib/env';
import { listBuildsCursorQuery } from '@/modules/builds/queries';
import { listEndorsementsForAlumniQuery } from '@/modules/endorsements/queries';
import { listPlacementOffersQuery } from '@/modules/governance/queries';
import { listCoffeeChatsQuery, listJobsQuery } from '@/modules/hiring/queries';
import {
  getPublicProfileQuery,
  listNetworkDirectoryQuery,
} from '@/modules/identity/queries';
import {
  listMyNotificationsQuery,
  listMyThreadsQuery,
} from '@/modules/messaging/queries';
import { AlumniPortalShell } from './_components/AlumniPortalShell';

function AlumniPortalSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090B] p-6">
      <div className="max-w-[1440px] mx-auto space-y-6 animate-pulse">
        <div className="h-14 rounded-2xl bg-zinc-200 dark:bg-zinc-900" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 h-72 rounded-3xl bg-zinc-100 dark:bg-zinc-900" />
          <div className="lg:col-span-6 space-y-4">
            <div className="h-44 rounded-3xl bg-zinc-200 dark:bg-zinc-900" />
            <div className="h-64 rounded-3xl bg-zinc-100 dark:bg-zinc-900" />
          </div>
          <div className="lg:col-span-3 h-72 rounded-3xl bg-zinc-100 dark:bg-zinc-900" />
        </div>
      </div>
    </div>
  );
}

async function AlumniLoader() {
  const sessionUser = await getSessionUser();
  const demoMode = isDemoModeEnabled();

  let viewer = sessionUser;
  if (!viewer && demoMode) {
    viewer = getDefaultPersonaForRole('alumni');
  }

  if (!viewer) {
    redirect('/login?next=/alumni');
  }

  if (viewer.role !== 'alumni') {
    redirect(viewer.role === 'dean' ? '/dean' : '/student');
  }

  const [
    initialBuildsPage,
    initialEndorsements,
    initialJobs,
    initialCoffeeChats,
    initialThreads,
    initialNotifications,
    directoryEntries,
    viewerProfile,
    initialOffers,
  ] = await Promise.all([
    listBuildsCursorQuery({ limit: 15, viewerUserId: viewer.id }),
    listEndorsementsForAlumniQuery(viewer.id),
    listJobsQuery({ viewerUserId: viewer.id }),
    listCoffeeChatsQuery(viewer.id, 'alumni'),
    listMyThreadsQuery(viewer.id),
    listMyNotificationsQuery(viewer.id),
    listNetworkDirectoryQuery({ scope: 'all', viewerUserId: viewer.id }),
    getPublicProfileQuery(viewer.id, viewer.id),
    listPlacementOffersQuery(),
  ]);

  return (
    <AlumniPortalShell
      viewer={viewer}
      viewerProfile={viewerProfile}
      initialBuildsPage={initialBuildsPage}
      initialEndorsements={initialEndorsements}
      initialJobs={initialJobs}
      initialCoffeeChats={initialCoffeeChats}
      initialThreads={initialThreads}
      initialNotifications={initialNotifications}
      initialOffers={initialOffers}
      directoryEntries={directoryEntries}
      demoModeEnabled={demoMode}
    />
  );
}

export default function AlumniPortalPage() {
  return (
    <Suspense fallback={<AlumniPortalSkeleton />}>
      <AlumniLoader />
    </Suspense>
  );
}
