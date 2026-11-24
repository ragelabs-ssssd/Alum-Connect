'use server';

import { randomUUID } from 'node:crypto';
import { and, eq, sql } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { getDb, isDatabaseConfigured } from '@/db';
import { getFallbackStore } from '@/db/fallbackStore';
import {
  alumniProfiles,
  coffeeChatRequests,
  institutionalAuditLogs,
  jobApplications,
  jobPostings,
  notifications,
  projects,
  studentProfiles,
  users,
} from '@/db/schema';
import { isAuthError, requireRole, requireVerifiedAlumni } from '@/lib/auth';
import type {
  ActionResult,
  CoffeeChatDTO,
  JobApplicationDTO,
  JobPostingDTO,
} from '@/types/domain';
import { listApplicantsForJobQuery } from './queries';
import {
  applyToJobSchema,
  createJobPostingSchema,
  requestCoffeeChatSchema,
  respondCoffeeChatSchema,
  updateApplicationStatusSchema,
  type ApplyToJobInput,
  type CreateJobPostingInput,
  type RequestCoffeeChatInput,
  type RespondCoffeeChatInput,
  type UpdateApplicationStatusInput,
} from './validators';

function safeUpdateTags(tags: string[]): void {
  for (const tag of tags) {
    try {
      updateTag(tag);
    } catch {
      // Safe no-op outside Next.js Server Action context
    }
  }
}

/**
 * Publishes a new alumni referral job, internship, or paid bounty.
 * Strictly guarded by `requireVerifiedAlumni()` — pending/rejected alumni receive `UNVERIFIED_ALUMNI`.
 */
export async function createJobPostingAction(
  input: CreateJobPostingInput
): Promise<ActionResult<JobPostingDTO>> {
  try {
    const alum = await requireVerifiedAlumni();
    const parsed = createJobPostingSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: parsed.error.issues[0]?.message ?? 'Invalid job posting payload.',
      };
    }

    const data = parsed.data;
    const jobId = `job_${randomUUID().slice(0, 12)}`;
    const now = new Date();
    const createdAt = now.toISOString();

    const dto: JobPostingDTO = {
      id: jobId,
      postedByAlumniId: alum.id,
      alumniName: alum.fullName,
      alumniRole: `${alum.designation ?? 'Verified Alumni'} @ ${alum.company ?? data.company}`,
      alumniAvatar: alum.avatarUrl,
      alumniVerified: true,
      roleTitle: data.roleTitle,
      company: data.company,
      jobType: data.jobType,
      location: data.location,
      compensation: data.compensation,
      slots: data.slots,
      eligibility: data.eligibility,
      skillsRequired: data.skillsRequired,
      jdText: data.jdText,
      deadline: data.deadline,
      status: 'open',
      applicationsCount: 0,
      appliedByMe: false,
      savedByMe: false,
      myApplicationStatus: null,
      createdAt,
    };

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      store.jobs.unshift(dto);
      store.auditLogs.unshift({
        id: `audit_${randomUUID().slice(0, 10)}`,
        actorUserId: alum.id,
        actorName: alum.fullName,
        category: 'job_post',
        title: `Posted ${data.jobType}: ${data.roleTitle}`,
        impact: `${data.company} (${data.slots} ${data.slots === 1 ? 'slot' : 'slots'} • ${data.compensation})`,
        createdAt,
      });
      safeUpdateTags(['jobs', 'dean']);
      return { ok: true, data: dto };
    }

    const db = getDb();
    await db.insert(jobPostings).values({
      id: jobId,
      institutionId: alum.institutionId,
      postedByAlumniId: alum.id,
      roleTitle: data.roleTitle,
      company: data.company,
      jobType: data.jobType,
      location: data.location,
      compensation: data.compensation,
      slots: data.slots,
      eligibility: data.eligibility,
      skillsRequired: data.skillsRequired,
      jdText: data.jdText,
      deadline: data.deadline,
      status: 'open',
      applicationsCount: 0,
      createdAt: now,
    });

    await db.insert(institutionalAuditLogs).values({
      id: `audit_${randomUUID().slice(0, 10)}`,
      institutionId: alum.institutionId,
      actorUserId: alum.id,
      actorName: alum.fullName,
      category: 'job_post',
      title: `Posted ${data.jobType}: ${data.roleTitle}`,
      impact: `${data.company} (${data.slots} ${data.slots === 1 ? 'slot' : 'slots'} • ${data.compensation})`,
      createdAt: now,
    });

    safeUpdateTags(['jobs', 'dean']);
    return { ok: true, data: dto };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to create job posting.',
    };
  }
}

/**
 * Submits a portfolio-backed student application for an open alumni job posting.
 * Prevents duplicate applications and notifies the posting alumnus.
 */
export async function applyToJobAction(
  input: ApplyToJobInput
): Promise<ActionResult<JobApplicationDTO>> {
  try {
    const student = await requireRole(['student']);
    const parsed = applyToJobSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: parsed.error.issues[0]?.message ?? 'Invalid job application.',
      };
    }

    const data = parsed.data;
    const applicationId = `app_${randomUUID().slice(0, 12)}`;
    const now = new Date();
    const nowIso = now.toISOString();

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      const job = store.jobs.find((j) => j.id === data.jobId);
      if (!job) {
        return { ok: false, code: 'NOT_FOUND', error: 'Job posting not found.' };
      }
      if (job.status !== 'open') {
        return {
          ok: false,
          code: 'CONFLICT',
          error: 'Applications are closed for this opening.',
        };
      }

      const duplicate = store.jobApplications.find(
        (a) => a.jobId === data.jobId && a.studentUserId === student.id
      );
      if (duplicate) {
        return {
          ok: false,
          code: 'CONFLICT',
          error: 'You have already applied to this role.',
        };
      }

      const showcaseProject = data.showcaseProjectId
        ? store.projects.find((p) => p.id === data.showcaseProjectId)
        : undefined;

      const appDto: JobApplicationDTO = {
        id: applicationId,
        jobId: job.id,
        jobTitle: job.roleTitle,
        company: job.company,
        studentUserId: student.id,
        studentName: student.fullName,
        studentRegNo: student.regNo ?? '',
        studentBranch: student.branch ?? 'CSE',
        studentCgpa: student.cgpa ?? null,
        studentAvatar: student.avatarUrl,
        showcaseProjectId: showcaseProject?.id ?? null,
        showcaseProjectTitle: showcaseProject?.title ?? null,
        note: data.note,
        status: 'applied',
        createdAt: nowIso,
        updatedAt: nowIso,
      };

      store.jobApplications.unshift(appDto);
      job.applicationsCount += 1;

      store.notifications.unshift({
        id: `notif_${randomUUID().slice(0, 10)}`,
        recipientUserId: job.postedByAlumniId,
        actorUserId: student.id,
        category: 'job_application',
        title: `New Portfolio Application: ${job.roleTitle}`,
        message: `${student.fullName} applied to ${job.roleTitle} at ${job.company}${
          showcaseProject ? ` showcasing "${showcaseProject.title}"` : ''
        }.`,
        targetSection: 'post-job',
        targetEntityId: job.id,
        actionLabel: 'Review Applicant',
        isRead: false,
        createdAt: nowIso,
      });

      safeUpdateTags(['jobs', 'applications']);
      return { ok: true, data: appDto };
    }

    const db = getDb();
    const [job] = await db
      .select()
      .from(jobPostings)
      .where(eq(jobPostings.id, data.jobId))
      .limit(1);

    if (!job) {
      return { ok: false, code: 'NOT_FOUND', error: 'Job posting not found.' };
    }
    if (job.status !== 'open') {
      return {
        ok: false,
        code: 'CONFLICT',
        error: 'Applications are closed for this opening.',
      };
    }

    const [existing] = await db
      .select({ id: jobApplications.id })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.jobId, data.jobId),
          eq(jobApplications.studentUserId, student.id)
        )
      )
      .limit(1);

    if (existing) {
      return {
        ok: false,
        code: 'CONFLICT',
        error: 'You have already applied to this role.',
      };
    }

    let showcaseTitle: string | null = null;
    if (data.showcaseProjectId) {
      const [proj] = await db
        .select({ name: projects.name })
        .from(projects)
        .where(eq(projects.id, data.showcaseProjectId))
        .limit(1);
      showcaseTitle = proj?.name ?? null;
    }

    const [stuProfile] = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, student.id))
      .limit(1);

    await db.insert(jobApplications).values({
      id: applicationId,
      institutionId: student.institutionId,
      jobId: job.id,
      studentUserId: student.id,
      showcaseProjectId: data.showcaseProjectId ?? null,
      note: data.note,
      status: 'applied',
      createdAt: now,
      updatedAt: now,
    });

    await db
      .update(jobPostings)
      .set({ applicationsCount: sql`${jobPostings.applicationsCount} + 1` })
      .where(eq(jobPostings.id, job.id));

    await db.insert(notifications).values({
      id: `notif_${randomUUID().slice(0, 10)}`,
      institutionId: student.institutionId,
      recipientUserId: job.postedByAlumniId,
      actorUserId: student.id,
      category: 'job_application',
      title: `New Portfolio Application: ${job.roleTitle}`,
      message: `${student.fullName} applied to ${job.roleTitle} at ${job.company}${
        showcaseTitle ? ` showcasing "${showcaseTitle}"` : ''
      }.`,
      targetSection: 'post-job',
      targetEntityId: job.id,
      actionLabel: 'Review Applicant',
      isRead: false,
      createdAt: now,
    });

    const appDto: JobApplicationDTO = {
      id: applicationId,
      jobId: job.id,
      jobTitle: job.roleTitle,
      company: job.company,
      studentUserId: student.id,
      studentName: student.fullName,
      studentRegNo: stuProfile?.regNo ?? student.regNo ?? '',
      studentBranch: stuProfile?.branch ?? student.branch ?? 'CSE',
      studentCgpa: stuProfile?.cgpa ?? student.cgpa ?? null,
      studentAvatar: student.avatarUrl,
      showcaseProjectId: data.showcaseProjectId ?? null,
      showcaseProjectTitle: showcaseTitle,
      note: data.note,
      status: 'applied',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    safeUpdateTags(['jobs', 'applications']);
    return { ok: true, data: appDto };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to submit application.',
    };
  }
}

/**
 * Updates an applicant's pipeline stage (`under_review`, `shortlisted`, `offered`, `rejected`)
 * and notifies the student. Strictly guarded by `requireVerifiedAlumni()`.
 */
export async function updateApplicationStatusAction(
  input: UpdateApplicationStatusInput
): Promise<ActionResult<JobApplicationDTO>> {
  try {
    const alum = await requireVerifiedAlumni();
    const parsed = updateApplicationStatusSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: parsed.error.issues[0]?.message ?? 'Invalid status update.',
      };
    }

    const { applicationId, status } = parsed.data;
    const now = new Date();
    const nowIso = now.toISOString();

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      const app = store.jobApplications.find((a) => a.id === applicationId);
      if (!app) {
        return { ok: false, code: 'NOT_FOUND', error: 'Application not found.' };
      }
      const job = store.jobs.find((j) => j.id === app.jobId);
      if (!job || job.postedByAlumniId !== alum.id) {
        return {
          ok: false,
          code: 'FORBIDDEN',
          error: 'Only the alumnus who posted this role can update applicants.',
        };
      }

      app.status = status;
      app.updatedAt = nowIso;

      store.notifications.unshift({
        id: `notif_${randomUUID().slice(0, 10)}`,
        recipientUserId: app.studentUserId,
        actorUserId: alum.id,
        category: 'application_status',
        title: `Application Update: ${job.company}`,
        message: `${alum.fullName} updated your application for ${job.roleTitle} to "${status.replace('_', ' ')}".`,
        targetSection: 'jobs',
        targetEntityId: job.id,
        actionLabel: 'View Status',
        isRead: false,
        createdAt: nowIso,
      });

      safeUpdateTags(['jobs', 'applications']);
      return { ok: true, data: { ...app } };
    }

    const db = getDb();
    const [row] = await db
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
      .where(eq(jobApplications.id, applicationId))
      .limit(1);

    if (!row) {
      return { ok: false, code: 'NOT_FOUND', error: 'Application not found.' };
    }
    if (row.job.postedByAlumniId !== alum.id) {
      return {
        ok: false,
        code: 'FORBIDDEN',
        error: 'Only the alumnus who posted this role can update applicants.',
      };
    }

    await db
      .update(jobApplications)
      .set({ status, updatedAt: now })
      .where(eq(jobApplications.id, applicationId));

    await db.insert(notifications).values({
      id: `notif_${randomUUID().slice(0, 10)}`,
      institutionId: alum.institutionId,
      recipientUserId: row.app.studentUserId,
      actorUserId: alum.id,
      category: 'application_status',
      title: `Application Update: ${row.job.company}`,
      message: `${alum.fullName} updated your application for ${row.job.roleTitle} to "${status.replace('_', ' ')}".`,
      targetSection: 'jobs',
      targetEntityId: row.job.id,
      actionLabel: 'View Status',
      isRead: false,
      createdAt: now,
    });

    const updatedDto: JobApplicationDTO = {
      id: row.app.id,
      jobId: row.app.jobId,
      jobTitle: row.job.roleTitle,
      company: row.job.company,
      studentUserId: row.app.studentUserId,
      studentName: row.studentUser.fullName,
      studentRegNo: row.studentProfile?.regNo ?? '',
      studentBranch: row.studentProfile?.branch ?? 'CSE',
      studentCgpa: row.studentProfile?.cgpa ?? null,
      studentAvatar: row.studentUser.avatarUrl,
      showcaseProjectId: row.app.showcaseProjectId,
      showcaseProjectTitle: row.project?.name ?? null,
      note: row.app.note,
      status,
      createdAt: row.app.createdAt.toISOString(),
      updatedAt: nowIso,
    };

    safeUpdateTags(['jobs', 'applications']);
    return { ok: true, data: updatedDto };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to update application status.',
    };
  }
}

/**
 * Requests a 15-minute mentorship coffee chat with an alumni mentor.
 */
export async function requestCoffeeChatAction(
  input: RequestCoffeeChatInput
): Promise<ActionResult<CoffeeChatDTO>> {
  try {
    const student = await requireRole(['student']);
    const parsed = requestCoffeeChatSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: parsed.error.issues[0]?.message ?? 'Invalid coffee chat request.',
      };
    }

    const data = parsed.data;
    const chatId = `chat_req_${randomUUID().slice(0, 10)}`;
    const now = new Date();
    const nowIso = now.toISOString();

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      const alum = store.users.find(
        (u) => u.id === data.alumniUserId && u.role === 'alumni'
      );
      if (!alum) {
        return { ok: false, code: 'NOT_FOUND', error: 'Alumni mentor not found.' };
      }

      const project = data.projectId
        ? store.projects.find((p) => p.id === data.projectId)
        : undefined;

      const chatDto: CoffeeChatDTO = {
        id: chatId,
        studentUserId: student.id,
        studentName: student.fullName,
        studentMeta: `${student.academicYear ?? 'ITER'} ${student.branch ?? 'CSE'}${
          student.cgpa ? ` • CGPA ${student.cgpa}` : ''
        }`,
        studentAvatar: student.avatarUrl,
        alumniUserId: alum.id,
        alumniName: alum.fullName,
        alumniMeta: `${alum.designation ?? 'Alumni'} @ ${alum.company ?? 'Industry'}`,
        alumniAvatar: alum.avatarUrl,
        projectId: project?.id ?? null,
        projectTitle: project?.title ?? null,
        topic: data.topic,
        status: 'pending',
        createdAt: nowIso,
      };

      store.coffeeChats.unshift(chatDto);
      store.notifications.unshift({
        id: `notif_${randomUUID().slice(0, 10)}`,
        recipientUserId: alum.id,
        actorUserId: student.id,
        category: 'coffee_chat',
        title: 'New 15-Min Coffee Chat Request',
        message: `${student.fullName} requested a 15-min chat: "${data.topic}"`,
        targetSection: 'notifications',
        targetEntityId: chatId,
        actionLabel: 'Respond',
        isRead: false,
        createdAt: nowIso,
      });

      safeUpdateTags(['coffee-chats']);
      return { ok: true, data: chatDto };
    }

    const db = getDb();
    const [alumRow] = await db
      .select({ user: users, profile: alumniProfiles })
      .from(users)
      .leftJoin(alumniProfiles, eq(users.id, alumniProfiles.userId))
      .where(and(eq(users.id, data.alumniUserId), eq(users.role, 'alumni')))
      .limit(1);

    if (!alumRow) {
      return { ok: false, code: 'NOT_FOUND', error: 'Alumni mentor not found.' };
    }

    let projectTitle: string | null = null;
    if (data.projectId) {
      const [proj] = await db
        .select({ name: projects.name })
        .from(projects)
        .where(eq(projects.id, data.projectId))
        .limit(1);
      projectTitle = proj?.name ?? null;
    }

    await db.insert(coffeeChatRequests).values({
      id: chatId,
      institutionId: student.institutionId,
      studentUserId: student.id,
      alumniUserId: alumRow.user.id,
      projectId: data.projectId ?? null,
      topic: data.topic,
      status: 'pending',
      createdAt: now,
    });

    await db.insert(notifications).values({
      id: `notif_${randomUUID().slice(0, 10)}`,
      institutionId: student.institutionId,
      recipientUserId: alumRow.user.id,
      actorUserId: student.id,
      category: 'coffee_chat',
      title: 'New 15-Min Coffee Chat Request',
      message: `${student.fullName} requested a 15-min chat: "${data.topic}"`,
      targetSection: 'notifications',
      targetEntityId: chatId,
      actionLabel: 'Respond',
      isRead: false,
      createdAt: now,
    });

    const chatDto: CoffeeChatDTO = {
      id: chatId,
      studentUserId: student.id,
      studentName: student.fullName,
      studentMeta: `${student.academicYear ?? 'ITER'} ${student.branch ?? 'CSE'}`,
      studentAvatar: student.avatarUrl,
      alumniUserId: alumRow.user.id,
      alumniName: alumRow.user.fullName,
      alumniMeta: alumRow.profile
        ? `${alumRow.profile.designation} @ ${alumRow.profile.company}`
        : 'Alumni Mentor',
      alumniAvatar: alumRow.user.avatarUrl,
      projectId: data.projectId ?? null,
      projectTitle,
      topic: data.topic,
      status: 'pending',
      createdAt: nowIso,
    };

    safeUpdateTags(['coffee-chats']);
    return { ok: true, data: chatDto };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to request coffee chat.',
    };
  }
}

/**
 * Allows a verified alumnus to accept or decline an incoming coffee chat request.
 */
export async function respondCoffeeChatAction(
  input: RespondCoffeeChatInput
): Promise<ActionResult<CoffeeChatDTO>> {
  try {
    const alum = await requireVerifiedAlumni();
    const parsed = respondCoffeeChatSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: parsed.error.issues[0]?.message ?? 'Invalid response payload.',
      };
    }

    const { coffeeChatId, decision } = parsed.data;
    const now = new Date();
    const nowIso = now.toISOString();

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      const chat = store.coffeeChats.find((c) => c.id === coffeeChatId);
      if (!chat) {
        return { ok: false, code: 'NOT_FOUND', error: 'Coffee chat request not found.' };
      }
      if (chat.alumniUserId !== alum.id) {
        return {
          ok: false,
          code: 'FORBIDDEN',
          error: 'You can only respond to your own coffee chat requests.',
        };
      }

      chat.status = decision;

      store.notifications.unshift({
        id: `notif_${randomUUID().slice(0, 10)}`,
        recipientUserId: chat.studentUserId,
        actorUserId: alum.id,
        category: 'coffee_chat',
        title:
          decision === 'accepted'
            ? `Coffee Chat Confirmed with ${alum.fullName}`
            : `Coffee Chat Update from ${alum.fullName}`,
        message:
          decision === 'accepted'
            ? `${alum.fullName} accepted your 15-min chat on "${chat.topic}".`
            : `${alum.fullName} could not fit this slot right now.`,
        targetSection: 'chat',
        targetEntityId: chat.id,
        actionLabel: decision === 'accepted' ? 'Open Chat' : 'View',
        isRead: false,
        createdAt: nowIso,
      });

      safeUpdateTags(['coffee-chats']);
      return { ok: true, data: { ...chat } };
    }

    const db = getDb();
    const [chat] = await db
      .select()
      .from(coffeeChatRequests)
      .where(eq(coffeeChatRequests.id, coffeeChatId))
      .limit(1);

    if (!chat) {
      return { ok: false, code: 'NOT_FOUND', error: 'Coffee chat request not found.' };
    }
    if (chat.alumniUserId !== alum.id) {
      return {
        ok: false,
        code: 'FORBIDDEN',
        error: 'You can only respond to your own coffee chat requests.',
      };
    }

    await db
      .update(coffeeChatRequests)
      .set({ status: decision })
      .where(eq(coffeeChatRequests.id, coffeeChatId));

    const [stuUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, chat.studentUserId))
      .limit(1);

    const [stuProf] = await db
      .select()
      .from(studentProfiles)
      .where(eq(studentProfiles.userId, chat.studentUserId))
      .limit(1);

    let projectTitle: string | null = null;
    if (chat.projectId) {
      const [proj] = await db
        .select({ name: projects.name })
        .from(projects)
        .where(eq(projects.id, chat.projectId))
        .limit(1);
      projectTitle = proj?.name ?? null;
    }

    await db.insert(notifications).values({
      id: `notif_${randomUUID().slice(0, 10)}`,
      institutionId: alum.institutionId,
      recipientUserId: chat.studentUserId,
      actorUserId: alum.id,
      category: 'coffee_chat',
      title:
        decision === 'accepted'
          ? `Coffee Chat Confirmed with ${alum.fullName}`
          : `Coffee Chat Update from ${alum.fullName}`,
      message:
        decision === 'accepted'
          ? `${alum.fullName} accepted your 15-min chat on "${chat.topic}".`
          : `${alum.fullName} could not fit this slot right now.`,
      targetSection: 'chat',
      targetEntityId: chat.id,
      actionLabel: decision === 'accepted' ? 'Open Chat' : 'View',
      isRead: false,
      createdAt: now,
    });

    const updatedDto: CoffeeChatDTO = {
      id: chat.id,
      studentUserId: chat.studentUserId,
      studentName: stuUser?.fullName ?? 'Student',
      studentMeta: stuProf
        ? `${stuProf.academicYear} ${stuProf.branch} • CGPA ${stuProf.cgpa}`
        : 'ITER Student',
      studentAvatar: stuUser?.avatarUrl ?? '',
      alumniUserId: alum.id,
      alumniName: alum.fullName,
      alumniMeta: `${alum.designation ?? 'Alumni'} @ ${alum.company ?? 'Industry'}`,
      alumniAvatar: alum.avatarUrl,
      projectId: chat.projectId,
      projectTitle,
      topic: chat.topic,
      status: decision,
      createdAt: chat.createdAt.toISOString(),
    };

    safeUpdateTags(['coffee-chats']);
    return { ok: true, data: updatedDto };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to respond to coffee chat.',
    };
  }
}

/**
 * Fetches student applications for a specific job posting owned by the
 * authenticated verified alumnus so the Applicants Drawer can load on demand.
 */
export async function fetchApplicantsForJobAction(
  jobId: string
): Promise<ActionResult<JobApplicationDTO[]>> {
  try {
    const alum = await requireVerifiedAlumni();
    const trimmedJobId = jobId?.trim();
    if (!trimmedJobId) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: 'Job ID is required.',
      };
    }

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      const job = store.jobs.find((j) => j.id === trimmedJobId);
      if (!job) {
        return { ok: false, code: 'NOT_FOUND', error: 'Job posting not found.' };
      }
      if (job.postedByAlumniId !== alum.id) {
        return {
          ok: false,
          code: 'FORBIDDEN',
          error: 'Only the alumnus who posted this role can inspect applicants.',
        };
      }
    } else {
      const db = getDb();
      const [job] = await db
        .select({ postedByAlumniId: jobPostings.postedByAlumniId })
        .from(jobPostings)
        .where(eq(jobPostings.id, trimmedJobId))
        .limit(1);
      if (!job) {
        return { ok: false, code: 'NOT_FOUND', error: 'Job posting not found.' };
      }
      if (job.postedByAlumniId !== alum.id) {
        return {
          ok: false,
          code: 'FORBIDDEN',
          error: 'Only the alumnus who posted this role can inspect applicants.',
        };
      }
    }

    const applicants = await listApplicantsForJobQuery(trimmedJobId, alum.id);
    return { ok: true, data: applicants };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to load applicants.',
    };
  }
}
