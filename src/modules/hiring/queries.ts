import { and, desc, eq, inArray } from 'drizzle-orm';
import { getDb, isDatabaseConfigured } from '@/db';
import { getFallbackStore } from '@/db/fallbackStore';
import {
  alumniProfiles,
  coffeeChatRequests,
  jobApplications,
  jobPostings,
  projects,
  savedItems,
  studentProfiles,
  users,
} from '@/db/schema';
import type {
  CoffeeChatDTO,
  JobApplicationDTO,
  JobPostingDTO,
  UserRole,
} from '@/types/domain';

export interface ListJobsFilter {
  jobType?: JobPostingDTO['jobType'] | 'All';
  savedOnlyForUserId?: string;
  postedByAlumniId?: string;
  viewerUserId?: string;
}

/**
 * Lists alumni-posted referral jobs, internships, and paid bounties,
 * hydrating viewer-specific save and application status when `viewerUserId` is supplied.
 */
export async function listJobsQuery(
  filters: ListJobsFilter = {}
): Promise<JobPostingDTO[]> {
  const { jobType, savedOnlyForUserId, postedByAlumniId, viewerUserId } = filters;

  if (!isDatabaseConfigured()) {
    const store = getFallbackStore();
    const targetSavedUserId = savedOnlyForUserId ?? viewerUserId;
    const savedKeys = targetSavedUserId
      ? store.savedItemKeysByUser[targetSavedUserId]
      : undefined;

    const myAppsByJobId = new Map<string, JobApplicationDTO>();
    if (viewerUserId) {
      for (const app of store.jobApplications) {
        if (app.studentUserId === viewerUserId) {
          myAppsByJobId.set(app.jobId, app);
        }
      }
    }

    return store.jobs
      .filter((job) => {
        if (jobType && jobType !== 'All' && job.jobType !== jobType) return false;
        if (postedByAlumniId && job.postedByAlumniId !== postedByAlumniId) return false;
        if (savedOnlyForUserId && !savedKeys?.has(`job:${job.id}`)) return false;
        return true;
      })
      .map((job) => {
        const myApp = myAppsByJobId.get(job.id);
        return {
          ...job,
          savedByMe: savedKeys ? savedKeys.has(`job:${job.id}`) : false,
          appliedByMe: Boolean(myApp),
          myApplicationStatus: myApp?.status ?? null,
        };
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const db = getDb();
  const conditions = [];
  if (jobType && jobType !== 'All') {
    conditions.push(eq(jobPostings.jobType, jobType));
  }
  if (postedByAlumniId) {
    conditions.push(eq(jobPostings.postedByAlumniId, postedByAlumniId));
  }

  const rows = await db
    .select({
      job: jobPostings,
      alumUser: users,
      alumProfile: alumniProfiles,
    })
    .from(jobPostings)
    .innerJoin(users, eq(jobPostings.postedByAlumniId, users.id))
    .leftJoin(alumniProfiles, eq(users.id, alumniProfiles.userId))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(jobPostings.createdAt));

  const savedSet = new Set<string>();
  const savedUserId = savedOnlyForUserId ?? viewerUserId;
  if (savedUserId) {
    const savedRows = await db
      .select({ itemId: savedItems.itemId })
      .from(savedItems)
      .where(
        and(eq(savedItems.userId, savedUserId), eq(savedItems.itemType, 'job'))
      );
    for (const r of savedRows) savedSet.add(r.itemId);
  }

  const myAppMap = new Map<string, JobApplicationDTO['status']>();
  if (viewerUserId) {
    const appRows = await db
      .select({
        jobId: jobApplications.jobId,
        status: jobApplications.status,
      })
      .from(jobApplications)
      .where(eq(jobApplications.studentUserId, viewerUserId));
    for (const app of appRows) {
      myAppMap.set(app.jobId, app.status);
    }
  }

  const mapped: JobPostingDTO[] = rows.map(({ job, alumUser, alumProfile }) => {
    const myStatus = myAppMap.get(job.id) ?? null;
    return {
      id: job.id,
      postedByAlumniId: job.postedByAlumniId,
      alumniName: alumUser.fullName,
      alumniRole: alumProfile
        ? `${alumProfile.designation} @ ${alumProfile.company}`
        : 'Verified Alumni',
      alumniAvatar: alumUser.avatarUrl,
      alumniVerified: alumUser.verificationStatus === 'verified',
      roleTitle: job.roleTitle,
      company: job.company,
      jobType: job.jobType,
      location: job.location,
      compensation: job.compensation,
      slots: job.slots,
      eligibility: job.eligibility,
      skillsRequired: job.skillsRequired,
      jdText: job.jdText,
      deadline: job.deadline,
      status: job.status,
      applicationsCount: job.applicationsCount,
      savedByMe: savedSet.has(job.id),
      appliedByMe: Boolean(myStatus),
      myApplicationStatus: myStatus,
      createdAt: job.createdAt.toISOString(),
    };
  });

  if (savedOnlyForUserId) {
    return mapped.filter((j) => j.savedByMe);
  }
  return mapped;
}

/**
 * Lists all job applications submitted by a specific student.
 */
export async function listMyApplicationsQuery(
  studentUserId: string
): Promise<JobApplicationDTO[]> {
  if (!isDatabaseConfigured()) {
    const store = getFallbackStore();
    return store.jobApplications
      .filter((app) => app.studentUserId === studentUserId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const db = getDb();
  const rows = await db
    .select({
      app: jobApplications,
      job: jobPostings,
      studentUser: users,
      studentProfile: studentProfiles,
      project: projects,
    })
    .from(jobApplications)
    .innerJoin(jobPostings, eq(jobApplications.jobId, jobPostings.id))
    .innerJoin(users, eq(jobApplications.studentUserId, users.id))
    .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
    .leftJoin(projects, eq(jobApplications.showcaseProjectId, projects.id))
    .where(eq(jobApplications.studentUserId, studentUserId))
    .orderBy(desc(jobApplications.createdAt));

  return rows.map(({ app, job, studentUser, studentProfile, project }) => ({
    id: app.id,
    jobId: app.jobId,
    jobTitle: job.roleTitle,
    company: job.company,
    studentUserId: app.studentUserId,
    studentName: studentUser.fullName,
    studentRegNo: studentProfile?.regNo ?? '',
    studentBranch: studentProfile?.branch ?? 'CSE',
    studentCgpa: studentProfile?.cgpa ?? null,
    studentAvatar: studentUser.avatarUrl,
    showcaseProjectId: app.showcaseProjectId,
    showcaseProjectTitle: project?.name ?? null,
    note: app.note,
    status: app.status,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  }));
}

/**
 * Lists all student applications for a specific job posting owned by `alumniUserId`.
 */
export async function listApplicantsForJobQuery(
  jobId: string,
  alumniUserId: string
): Promise<JobApplicationDTO[]> {
  if (!isDatabaseConfigured()) {
    const store = getFallbackStore();
    const job = store.jobs.find((j) => j.id === jobId);
    if (!job || job.postedByAlumniId !== alumniUserId) {
      return [];
    }
    return store.jobApplications
      .filter((app) => app.jobId === jobId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const db = getDb();
  const [job] = await db
    .select()
    .from(jobPostings)
    .where(eq(jobPostings.id, jobId))
    .limit(1);

  if (!job || job.postedByAlumniId !== alumniUserId) {
    return [];
  }

  const rows = await db
    .select({
      app: jobApplications,
      studentUser: users,
      studentProfile: studentProfiles,
      project: projects,
    })
    .from(jobApplications)
    .innerJoin(users, eq(jobApplications.studentUserId, users.id))
    .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
    .leftJoin(projects, eq(jobApplications.showcaseProjectId, projects.id))
    .where(eq(jobApplications.jobId, jobId))
    .orderBy(desc(jobApplications.createdAt));

  return rows.map(({ app, studentUser, studentProfile, project }) => ({
    id: app.id,
    jobId: app.jobId,
    jobTitle: job.roleTitle,
    company: job.company,
    studentUserId: app.studentUserId,
    studentName: studentUser.fullName,
    studentRegNo: studentProfile?.regNo ?? '',
    studentBranch: studentProfile?.branch ?? 'CSE',
    studentCgpa: studentProfile?.cgpa ?? null,
    studentAvatar: studentUser.avatarUrl,
    showcaseProjectId: app.showcaseProjectId,
    showcaseProjectTitle: project?.name ?? null,
    note: app.note,
    status: app.status,
    createdAt: app.createdAt.toISOString(),
    updatedAt: app.updatedAt.toISOString(),
  }));
}

/**
 * Lists 15-minute mentorship coffee chat requests scoped to the caller's role.
 */
export async function listCoffeeChatsQuery(
  userId: string,
  role: UserRole
): Promise<CoffeeChatDTO[]> {
  if (!isDatabaseConfigured()) {
    const store = getFallbackStore();
    return store.coffeeChats
      .filter((chat) => {
        if (role === 'student') return chat.studentUserId === userId;
        if (role === 'alumni') return chat.alumniUserId === userId;
        return true;
      })
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const db = getDb();
  const rows = await db
    .select({
      chat: coffeeChatRequests,
      project: projects,
    })
    .from(coffeeChatRequests)
    .leftJoin(projects, eq(coffeeChatRequests.projectId, projects.id))
    .where(
      role === 'student'
        ? eq(coffeeChatRequests.studentUserId, userId)
        : role === 'alumni'
          ? eq(coffeeChatRequests.alumniUserId, userId)
          : undefined
    )
    .orderBy(desc(coffeeChatRequests.createdAt));

  if (rows.length === 0) return [];

  const userIds = Array.from(
    new Set(rows.flatMap((r) => [r.chat.studentUserId, r.chat.alumniUserId]))
  );

  const [userRows, studentRows, alumRows] = await Promise.all([
    db.select().from(users).where(inArray(users.id, userIds)),
    db.select().from(studentProfiles).where(inArray(studentProfiles.userId, userIds)),
    db.select().from(alumniProfiles).where(inArray(alumniProfiles.userId, userIds)),
  ]);

  const userMap = new Map(userRows.map((u) => [u.id, u]));
  const studentMap = new Map(studentRows.map((s) => [s.userId, s]));
  const alumMap = new Map(alumRows.map((a) => [a.userId, a]));

  return rows.map(({ chat, project }) => {
    const stu = userMap.get(chat.studentUserId);
    const stuProf = studentMap.get(chat.studentUserId);
    const alum = userMap.get(chat.alumniUserId);
    const alumProf = alumMap.get(chat.alumniUserId);

    return {
      id: chat.id,
      studentUserId: chat.studentUserId,
      studentName: stu?.fullName ?? 'Student',
      studentMeta: stuProf
        ? `${stuProf.academicYear} ${stuProf.branch} • CGPA ${stuProf.cgpa}`
        : stu?.headline ?? 'ITER Student',
      studentAvatar: stu?.avatarUrl ?? '',
      alumniUserId: chat.alumniUserId,
      alumniName: alum?.fullName ?? 'Alumni Mentor',
      alumniMeta: alumProf
        ? `${alumProf.designation} @ ${alumProf.company}`
        : alum?.headline ?? 'ITER Alumnus',
      alumniAvatar: alum?.avatarUrl ?? '',
      projectId: chat.projectId,
      projectTitle: project?.name ?? null,
      topic: chat.topic,
      status: chat.status,
      createdAt: chat.createdAt.toISOString(),
    };
  });
}
