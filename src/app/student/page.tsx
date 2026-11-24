import React, { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap } from 'lucide-react';
import {
  getDefaultPersonaForRole,
  getSessionUser,
} from '@/lib/auth';
import { isDemoModeEnabled } from '@/lib/env';
import { listBuildsCursorQuery } from '@/modules/builds/queries';
import {
  listCoffeeChatsQuery,
  listJobsQuery,
  listMyApplicationsQuery,
} from '@/modules/hiring/queries';
import {
  getPublicProfileQuery,
  listNetworkDirectoryQuery,
} from '@/modules/identity/queries';
import {
  listMyNotificationsQuery,
  listMyThreadsQuery,
} from '@/modules/messaging/queries';
import { StudentStudioShell } from './_components/StudentStudioShell';

function StudentSkeleton() {
  return (
    <div className="min-h-dvh bg-[#F8FAFC] dark:bg-[#07080A] px-4 sm:px-6 py-8">
      <div className="max-w-[1440px] mx-auto space-y-6 animate-pulse">
        <div className="h-14 rounded-2xl bg-slate-200/80 dark:bg-white/[0.06]" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <div className="h-52 rounded-3xl bg-slate-200/70 dark:bg-white/[0.05]" />
            <div className="h-52 rounded-3xl bg-slate-200/70 dark:bg-white/[0.05]" />
          </div>
          <div className="lg:col-span-4 h-72 rounded-3xl bg-slate-200/70 dark:bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}

async function StudentLoader() {
  const sessionUser = await getSessionUser();
  const demoEnabled = isDemoModeEnabled();

  if (sessionUser && sessionUser.role !== 'student') {
    const portalHref = sessionUser.role === 'dean' ? '/dean' : '/alumni';
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#F8FAFC] dark:bg-[#07080A] px-4">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#14171E] p-7 text-center space-y-4 shadow-xl">
          <GraduationCap className="w-10 h-10 text-[#0891B2] dark:text-[#22D3EE] mx-auto" />
          <h1 className="font-luma-title text-xl">Student Studio Access</h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
            You are currently signed in as{' '}
            <span className="font-semibold text-[#0F172A] dark:text-white">
              {sessionUser.fullName}
            </span>{' '}
            ({sessionUser.role}). Switch to a Student account to access Student
            Studio.
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

  const fallbackStudent =
    !sessionUser && demoEnabled ? getDefaultPersonaForRole('student') : null;

  const activeStudent = sessionUser ?? fallbackStudent;

  if (!activeStudent) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#F8FAFC] dark:bg-[#07080A] px-4">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 dark:border-white/15 bg-white dark:bg-[#14171E] p-7 text-center space-y-4 shadow-xl">
          <GraduationCap className="w-10 h-10 text-[#0891B2] dark:text-[#22D3EE] mx-auto" />
          <h1 className="font-luma-title text-xl">Sign In to Student Studio</h1>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
            Authenticate with your ITER student account to ship builds, apply to
            alumni referrals, and message mentors.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] dark:bg-[linear-gradient(90deg,#22D3EE_0%,#34D399_100%)] text-white dark:text-[#041E24] px-5 py-2 text-xs font-semibold"
            >
              Sign In <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/signup"
              className="rounded-full border border-slate-300 dark:border-white/20 px-5 py-2 text-xs font-semibold"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isPreviewMode = !sessionUser && Boolean(fallbackStudent);

  const [
    initialBuildsPage,
    initialJobs,
    initialApplications,
    initialCoffeeChats,
    initialThreads,
    initialNotifications,
    initialDirectory,
    initialPublicProfile,
  ] = await Promise.all([
    listBuildsCursorQuery({ limit: 15, viewerUserId: activeStudent.id }),
    listJobsQuery({ viewerUserId: activeStudent.id }),
    listMyApplicationsQuery(activeStudent.id),
    listCoffeeChatsQuery(activeStudent.id, 'student'),
    listMyThreadsQuery(activeStudent.id),
    listMyNotificationsQuery(activeStudent.id),
    listNetworkDirectoryQuery({ scope: 'all', viewerUserId: activeStudent.id }),
    getPublicProfileQuery(activeStudent.id, activeStudent.id),
  ]);

  return (
    <StudentStudioShell
      student={activeStudent}
      isPreviewMode={isPreviewMode}
      demoEnabled={demoEnabled}
      initialBuildsPage={initialBuildsPage}
      initialJobs={initialJobs}
      initialApplications={initialApplications}
      initialCoffeeChats={initialCoffeeChats}
      initialThreads={initialThreads}
      initialNotifications={initialNotifications}
      initialDirectory={initialDirectory}
      initialPublicProfile={initialPublicProfile}
    />
  );
}

export default function StudentPage() {
  return (
    <Suspense fallback={<StudentSkeleton />}>
      <StudentLoader />
    </Suspense>
  );
}
