'use server';

import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { getFallbackStore } from '@/db/fallbackStore';
import { getDb, isDatabaseConfigured } from '@/db/index';
import {
  alumniProfiles,
  alumniVerificationRequests,
  institutionalAuditLogs,
  notifications,
  placementOffers,
  users,
} from '@/db/schema';
import { isAuthError, requireRole } from '@/lib/auth';
import type {
  ActionResult,
  InstitutionalAuditLogDTO,
  NotificationDTO,
  PlacementOfferDTO,
  SessionUser,
  VerificationRequestDTO,
} from '@/types/domain';

const reviewVerificationSchema = z.object({
  requestId: z.string().trim().min(1, 'Verification requestId is required.'),
  decision: z.enum(['approved', 'rejected']),
  reviewNote: z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined)),
});

const verifyOfferSchema = z.object({
  offerId: z.string().trim().min(1, 'Placement offerId is required.'),
});

const createAuditLogSchema = z.object({
  category: z.enum([
    'verification',
    'vouch',
    'job_post',
    'offer_verified',
    'mvp_ship',
  ]),
  title: z.string().trim().min(3, 'Audit title is required.').max(180),
  impact: z.string().trim().min(3, 'Audit impact is required.').max(400),
});

export type ReviewAlumniVerificationInput = z.input<
  typeof reviewVerificationSchema
>;
export type CreateAuditLogInput = z.infer<typeof createAuditLogSchema>;

/**
 * Dean-only Server Action to approve or reject an alumni verification request.
 * Updates request status, user verificationStatus, alumni job-posting eligibility,
 * inserts an institutional audit log, and dispatches a notification to the alumnus.
 */
export async function reviewAlumniVerificationAction(
  input: ReviewAlumniVerificationInput,
): Promise<ActionResult<VerificationRequestDTO>> {
  let dean: SessionUser;
  try {
    dean = await requireRole(['dean']);
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, error: err.message, code: err.code };
    }
    return {
      ok: false,
      error: 'Dean authorization required.',
      code: 'FORBIDDEN',
    };
  }

  const parsed = reviewVerificationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid verification decision.',
      code: 'VALIDATION_ERROR',
    };
  }

  const { requestId, decision, reviewNote } = parsed.data;
  const now = new Date();
  const nowIso = now.toISOString();
  const newUserStatus = decision === 'approved' ? 'verified' : 'rejected';
  const canPostJobs = decision === 'approved';
  const resolvedNote =
    reviewNote ??
    (decision === 'approved'
      ? `Verified by ${dean.fullName} (Dean & T&P Office).`
      : `Verification declined by ${dean.fullName}. Please update corporate credentials.`);

  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const [existing] = await db
        .select({
          req: alumniVerificationRequests,
          alumniName: users.fullName,
          alumniEmail: users.email,
          alumniAvatar: users.avatarUrl,
          batchYear: alumniProfiles.batchYear,
          designation: alumniProfiles.designation,
        })
        .from(alumniVerificationRequests)
        .innerJoin(
          users,
          eq(alumniVerificationRequests.alumniUserId, users.id),
        )
        .leftJoin(alumniProfiles, eq(users.id, alumniProfiles.userId))
        .where(eq(alumniVerificationRequests.id, requestId))
        .limit(1);

      if (existing) {
        await db
          .update(alumniVerificationRequests)
          .set({
            status: decision,
            reviewedByDeanId: dean.id,
            reviewNote: resolvedNote,
            reviewedAt: now,
          })
          .where(eq(alumniVerificationRequests.id, requestId));

        await db
          .update(users)
          .set({
            verificationStatus: newUserStatus,
            verifiedBy: decision === 'approved' ? dean.id : null,
            verifiedAt: decision === 'approved' ? now : null,
          })
          .where(eq(users.id, existing.req.alumniUserId));

        await db
          .update(alumniProfiles)
          .set({ canPostJobs })
          .where(eq(alumniProfiles.userId, existing.req.alumniUserId));

        await db.insert(institutionalAuditLogs).values({
          id: `audit_${randomUUID().slice(0, 8)}`,
          institutionId: dean.institutionId,
          actorUserId: dean.id,
          actorName: dean.fullName,
          category: 'verification',
          title:
            decision === 'approved'
              ? `Verified Alumnus: ${existing.alumniName} (${existing.req.company})`
              : `Rejected Alumni Request: ${existing.alumniName}`,
          impact: resolvedNote,
        });

        await db.insert(notifications).values({
          id: `notif_${randomUUID().slice(0, 8)}`,
          institutionId: dean.institutionId,
          recipientUserId: existing.req.alumniUserId,
          actorUserId: dean.id,
          category: 'verification',
          title:
            decision === 'approved'
              ? 'Alumni Account Verified by Dean'
              : 'Alumni Verification Update',
          message:
            decision === 'approved'
              ? `Welcome to ITER Alumni Portal! You can now vouch for student builds, post jobs, and accept mentorship chats.`
              : `Your verification request for ${existing.req.company} was not approved. ${resolvedNote}`,
          targetSection: 'alumni',
          targetEntityId: requestId,
          actionLabel: decision === 'approved' ? 'Open Alumni Portal' : 'View Status',
        });

        revalidatePath('/dean');
        revalidatePath('/alumni');
        revalidatePath('/');

        return {
          ok: true,
          data: {
            id: existing.req.id,
            alumniUserId: existing.req.alumniUserId,
            alumniName: existing.alumniName,
            alumniEmail: existing.alumniEmail,
            alumniAvatar: existing.alumniAvatar,
            batchYear: existing.batchYear ?? 2019,
            company: existing.req.company,
            designation: existing.designation ?? 'Alumni Mentor',
            workEmail: existing.req.workEmail,
            linkedinUrl: existing.req.linkedinUrl,
            domainAutoMatched: existing.req.domainAutoMatched,
            proofNote: existing.req.proofNote,
            status: decision,
            reviewedByDeanId: dean.id,
            reviewNote: resolvedNote,
            createdAt: existing.req.createdAt.toISOString(),
            reviewedAt: nowIso,
          },
        };
      }
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : 'Unable to update verification request.',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  const store = getFallbackStore();
  const reqIdx = store.verificationRequests.findIndex(
    (r) => r.id === requestId,
  );
  if (reqIdx === -1) {
    return {
      ok: false,
      error: 'Verification request not found.',
      code: 'NOT_FOUND',
    };
  }

  const existingReq = store.verificationRequests[reqIdx];
  const updatedReq: VerificationRequestDTO = {
    ...existingReq,
    status: decision,
    reviewedByDeanId: dean.id,
    reviewNote: resolvedNote,
    reviewedAt: nowIso,
  };
  store.verificationRequests[reqIdx] = updatedReq;

  const userIdx = store.users.findIndex(
    (u) => u.id === existingReq.alumniUserId,
  );
  if (userIdx !== -1) {
    store.users[userIdx] = {
      ...store.users[userIdx],
      verificationStatus: newUserStatus,
      canPostJobs,
      workEmailVerified:
        decision === 'approved'
          ? true
          : store.users[userIdx].workEmailVerified,
    };
  }

  const auditLog: InstitutionalAuditLogDTO = {
    id: `audit_${randomUUID().slice(0, 8)}`,
    actorUserId: dean.id,
    actorName: dean.fullName,
    category: 'verification',
    title:
      decision === 'approved'
        ? `Verified Alumnus: ${existingReq.alumniName} (${existingReq.company})`
        : `Rejected Alumni Request: ${existingReq.alumniName}`,
    impact: resolvedNote,
    createdAt: nowIso,
  };
  store.auditLogs.unshift(auditLog);

  const notification: NotificationDTO = {
    id: `notif_${randomUUID().slice(0, 8)}`,
    recipientUserId: existingReq.alumniUserId,
    actorUserId: dean.id,
    category: 'verification',
    title:
      decision === 'approved'
        ? 'Alumni Account Verified by Dean'
        : 'Alumni Verification Update',
    message:
      decision === 'approved'
        ? `Welcome to ITER Alumni Portal! You can now vouch for student builds, post jobs, and mentor students.`
        : `Your verification request for ${existingReq.company} was not approved. ${resolvedNote}`,
    targetSection: 'alumni',
    targetEntityId: requestId,
    actionLabel: decision === 'approved' ? 'Open Alumni Portal' : 'View Status',
    isRead: false,
    createdAt: nowIso,
  };
  store.notifications.unshift(notification);

  revalidatePath('/dean');
  revalidatePath('/alumni');
  revalidatePath('/');

  return { ok: true, data: updatedReq };
}

/**
 * Dean-only Server Action to verify an institutional placement offer (PPO / Internship)
 * and log the confirmation in the governance audit trail.
 */
export async function verifyPlacementOfferAction(
  offerId: string,
): Promise<ActionResult<PlacementOfferDTO>> {
  let dean: SessionUser;
  try {
    dean = await requireRole(['dean']);
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, error: err.message, code: err.code };
    }
    return {
      ok: false,
      error: 'Dean authorization required.',
      code: 'FORBIDDEN',
    };
  }

  const parsed = verifyOfferSchema.safeParse({ offerId });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid offer ID.',
      code: 'VALIDATION_ERROR',
    };
  }

  const nowIso = new Date().toISOString();

  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const [offer] = await db
        .select()
        .from(placementOffers)
        .where(eq(placementOffers.id, parsed.data.offerId))
        .limit(1);

      if (offer) {
        await db
          .update(placementOffers)
          .set({ verifiedByDean: true })
          .where(eq(placementOffers.id, offer.id));

        const [studentRow] = await db
          .select({ fullName: users.fullName })
          .from(users)
          .where(eq(users.id, offer.studentUserId))
          .limit(1);

        const refRow = offer.referringAlumniId
          ? (
              await db
                .select({ fullName: users.fullName })
                .from(users)
                .where(eq(users.id, offer.referringAlumniId))
                .limit(1)
            )[0]
          : undefined;

        const studentName = studentRow?.fullName ?? 'Student';

        await db.insert(institutionalAuditLogs).values({
          id: `audit_${randomUUID().slice(0, 8)}`,
          institutionId: dean.institutionId,
          actorUserId: dean.id,
          actorName: dean.fullName,
          category: 'offer_verified',
          title: `Verified ${offer.company} ${offer.offerType} (${offer.packageStr})`,
          impact: `Confirmed offer ${offer.code} for ${studentName}.`,
        });

        await db.insert(notifications).values({
          id: `notif_${randomUUID().slice(0, 8)}`,
          institutionId: dean.institutionId,
          recipientUserId: offer.studentUserId,
          actorUserId: dean.id,
          category: 'offer_verified',
          title: `Placement Offer Verified: ${offer.company}`,
          message: `T&P Office verified your ${offer.offerType} offer (${offer.jobRole} • ${offer.packageStr}).`,
          targetSection: 'student',
          targetEntityId: offer.id,
          actionLabel: 'View Offer',
        });

        revalidatePath('/dean');
        revalidatePath('/student');

        return {
          ok: true,
          data: {
            id: offer.id,
            code: offer.code,
            studentUserId: offer.studentUserId,
            studentName,
            academicYearBranch: offer.academicYearBranch,
            company: offer.company,
            jobRole: offer.jobRole,
            packageStr: offer.packageStr,
            packageLpa: offer.packageLpa,
            offerType: offer.offerType,
            referringAlumniId: offer.referringAlumniId ?? null,
            referringAlumniName: refRow?.fullName ?? null,
            status: offer.status,
            verifiedByDean: true,
            createdAt: offer.createdAt.toISOString(),
          },
        };
      }
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error
            ? err.message
            : 'Unable to verify placement offer.',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  const store = getFallbackStore();
  const offerIdx = store.offers.findIndex((o) => o.id === parsed.data.offerId);
  if (offerIdx === -1) {
    return {
      ok: false,
      error: 'Placement offer not found.',
      code: 'NOT_FOUND',
    };
  }

  const updatedOffer: PlacementOfferDTO = {
    ...store.offers[offerIdx],
    verifiedByDean: true,
  };
  store.offers[offerIdx] = updatedOffer;

  store.auditLogs.unshift({
    id: `audit_${randomUUID().slice(0, 8)}`,
    actorUserId: dean.id,
    actorName: dean.fullName,
    category: 'offer_verified',
    title: `Verified ${updatedOffer.company} ${updatedOffer.offerType} (${updatedOffer.packageStr})`,
    impact: `Confirmed placement offer ${updatedOffer.code} for ${updatedOffer.studentName}.`,
    createdAt: nowIso,
  });

  store.notifications.unshift({
    id: `notif_${randomUUID().slice(0, 8)}`,
    recipientUserId: updatedOffer.studentUserId,
    actorUserId: dean.id,
    category: 'offer_verified',
    title: `Placement Offer Verified: ${updatedOffer.company}`,
    message: `T&P Office verified your ${updatedOffer.offerType} offer (${updatedOffer.jobRole} • ${updatedOffer.packageStr}).`,
    targetSection: 'student',
    targetEntityId: updatedOffer.id,
    actionLabel: 'View Offer',
    isRead: false,
    createdAt: nowIso,
  });

  revalidatePath('/dean');
  revalidatePath('/student');
  return { ok: true, data: updatedOffer };
}

/** Dean-only Server Action to record an institutional governance audit log entry. */
export async function createAuditLogAction(
  input: CreateAuditLogInput,
): Promise<ActionResult<InstitutionalAuditLogDTO>> {
  let dean: SessionUser;
  try {
    dean = await requireRole(['dean']);
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, error: err.message, code: err.code };
    }
    return {
      ok: false,
      error: 'Dean authorization required.',
      code: 'FORBIDDEN',
    };
  }

  const parsed = createAuditLogSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid audit log payload.',
      code: 'VALIDATION_ERROR',
    };
  }

  const id = `audit_${randomUUID().slice(0, 8)}`;
  const nowIso = new Date().toISOString();
  const entry: InstitutionalAuditLogDTO = {
    id,
    actorUserId: dean.id,
    actorName: dean.fullName,
    category: parsed.data.category,
    title: parsed.data.title,
    impact: parsed.data.impact,
    createdAt: nowIso,
  };

  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      await db.insert(institutionalAuditLogs).values({
        id,
        institutionId: dean.institutionId,
        actorUserId: dean.id,
        actorName: dean.fullName,
        category: parsed.data.category,
        title: parsed.data.title,
        impact: parsed.data.impact,
      });

      revalidatePath('/dean');
      return { ok: true, data: entry };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error ? err.message : 'Unable to create audit log.',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  const store = getFallbackStore();
  store.auditLogs.unshift(entry);
  revalidatePath('/dean');
  return { ok: true, data: entry };
}
