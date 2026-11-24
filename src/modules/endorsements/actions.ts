'use server';

import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { updateTag } from 'next/cache';
import { getDb, isDatabaseConfigured } from '@/db';
import { getFallbackStore } from '@/db/fallbackStore';
import {
  endorsements,
  institutionalAuditLogs,
  notifications,
  projects,
  researchPapers,
} from '@/db/schema';
import { isAuthError, requireAuth, requireVerifiedAlumni } from '@/lib/auth';
import type {
  ActionResult,
  EndorsementDTO,
  VouchCertificateDTO,
} from '@/types/domain';
import {
  endorseOrVouchSchema,
  toggleRoastResolvedSchema,
  type EndorseOrVouchInput,
  type ToggleRoastResolvedInput,
} from './validators';
import { generateVouchCode, signVouchCertificate } from './vouchCrypto';

function safeUpdateTags(tags: string[]): void {
  for (const tag of tags) {
    try {
      updateTag(tag);
    } catch {
      // Ignored if called outside a Next.js request/action context.
    }
  }
}

export interface EndorseOrVouchResult {
  endorsement: EndorsementDTO;
  vouchCertificate?: VouchCertificateDTO;
}

/**
 * Issues an endorsement, 5-minute architecture roast, or cryptographic Vouch Card
 * on a student project or research paper. Strictly gated to verified alumni.
 */
export async function endorseOrVouchBuildAction(
  input: EndorseOrVouchInput
): Promise<ActionResult<EndorseOrVouchResult>> {
  try {
    const alum = await requireVerifiedAlumni();
    const parsed = endorseOrVouchSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: parsed.error.issues[0]?.message ?? 'Invalid endorsement payload.',
      };
    }

    const data = parsed.data;
    const endorsementId = `end_${randomUUID().slice(0, 12)}`;
    const now = new Date();
    const issuedAt = now.toISOString();
    const vouchCode = data.kind === 'vouch' ? generateVouchCode(now.getUTCFullYear()) : null;

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      const targetProject =
        data.targetType === 'project'
          ? store.projects.find((p) => p.id === data.targetId)
          : undefined;
      const targetPaper =
        data.targetType === 'paper'
          ? store.papers.find((p) => p.id === data.targetId)
          : undefined;

      if (!targetProject && !targetPaper) {
        return {
          ok: false,
          code: 'NOT_FOUND',
          error: 'Target project or research paper was not found.',
        };
      }

      const endorsement: EndorsementDTO = {
        id: endorsementId,
        alumniUserId: alum.id,
        alumName: alum.fullName,
        alumRole: alum.designation ?? 'Verified Alumni',
        alumCompany: alum.company ?? 'Industry Partner',
        alumBatch: alum.batchYear ?? 2019,
        alumAvatar: alum.avatarUrl,
        kind: data.kind,
        vouchCode,
        category: data.category,
        quote: data.quote,
        certifiedSkills: data.certifiedSkills,
        rating: data.rating,
        resolved: data.kind !== 'roast',
        createdAt: issuedAt,
      };

      store.endorsements.unshift(endorsement);

      let vouchCertificate: VouchCertificateDTO | undefined;

      if (targetProject) {
        targetProject.endorsements.unshift(endorsement);
        if (data.kind === 'vouch' && targetProject.status === 'published') {
          targetProject.status = 'verified';
        }
        if (vouchCode) {
          const signatureDigest = signVouchCertificate({
            vouchCode,
            alumUserId: alum.id,
            projectId: targetProject.id,
            issuedAt,
            quote: data.quote,
          });
          vouchCertificate = {
            vouchCode,
            valid: true,
            signatureDigest,
            issuedAt,
            projectId: targetProject.id,
            projectCode: targetProject.code,
            projectTitle: targetProject.title,
            studentNames:
              targetProject.contributors.length > 0
                ? targetProject.contributors.map((c) => c.name)
                : [targetProject.leadName],
            alumUserId: alum.id,
            alumName: alum.fullName,
            alumDesignation: alum.designation ?? 'Verified Alumni',
            alumCompany: alum.company ?? 'Industry Partner',
            alumBatch: alum.batchYear ?? 2019,
            alumAvatar: alum.avatarUrl,
            alumVerified: true,
            quote: data.quote,
            certifiedSkills: data.certifiedSkills,
            publicUrl: `/vouch/${vouchCode}`,
          };
          store.vouchCertificates[vouchCode] = vouchCertificate;
        }
      } else if (targetPaper) {
        targetPaper.endorsements.unshift(endorsement);
        if (vouchCode) {
          const signatureDigest = signVouchCertificate({
            vouchCode,
            alumUserId: alum.id,
            projectId: targetPaper.id,
            issuedAt,
            quote: data.quote,
          });
          const studentNames = targetPaper.coAuthorName
            ? [targetPaper.leadAuthorName, targetPaper.coAuthorName]
            : [targetPaper.leadAuthorName];
          vouchCertificate = {
            vouchCode,
            valid: true,
            signatureDigest,
            issuedAt,
            projectId: targetPaper.id,
            projectCode: targetPaper.code,
            projectTitle: targetPaper.title,
            studentNames,
            alumUserId: alum.id,
            alumName: alum.fullName,
            alumDesignation: alum.designation ?? 'Verified Alumni',
            alumCompany: alum.company ?? 'Industry Partner',
            alumBatch: alum.batchYear ?? 2019,
            alumAvatar: alum.avatarUrl,
            alumVerified: true,
            quote: data.quote,
            certifiedSkills: data.certifiedSkills,
            publicUrl: `/vouch/${vouchCode}`,
          };
          store.vouchCertificates[vouchCode] = vouchCertificate;
        }
      }

      const recipientUserId = targetProject
        ? targetProject.leadId
        : (targetPaper?.leadAuthorId ?? '');
      const targetTitle = targetProject?.title ?? targetPaper?.title ?? 'your build';

      if (vouchCode) {
        store.auditLogs.unshift({
          id: `audit_${randomUUID().slice(0, 10)}`,
          actorUserId: alum.id,
          actorName: alum.fullName,
          category: 'vouch',
          title: `Issued Vouch Certificate ${vouchCode}`,
          impact: `Certified "${targetTitle}" (${data.certifiedSkills.slice(0, 3).join(', ') || data.category})`,
          createdAt: issuedAt,
        });
      }

      if (recipientUserId) {
        store.notifications.unshift({
          id: `notif_${randomUUID().slice(0, 10)}`,
          recipientUserId,
          actorUserId: alum.id,
          category: data.kind,
          title:
            data.kind === 'vouch'
              ? 'New Alumni Vouch Certificate Issued'
              : data.kind === 'roast'
                ? 'New 5-Min Architecture Roast'
                : 'New Alumni Endorsement',
          message:
            data.kind === 'vouch'
              ? `${alum.fullName} (${alum.company ?? 'Alumni'}) issued ${vouchCode} for "${targetTitle}".`
              : `${alum.fullName} reviewed "${targetTitle}": "${data.quote.slice(0, 90)}${data.quote.length > 90 ? '...' : ''}"`,
          targetSection: data.targetType === 'paper' ? 'papers' : 'projects',
          targetEntityId: data.targetId,
          actionLabel: data.kind === 'vouch' ? 'View Vouch' : 'Inspect Review',
          isRead: false,
          createdAt: issuedAt,
        });
      }

      safeUpdateTags(['feed', 'endorsements', 'dean']);
      return { ok: true, data: { endorsement, vouchCertificate } };
    }

    const db = getDb();
    let targetTitle = 'Student Build';
    let targetCode: string | null = null;
    let recipientUserId: string | null = null;
    const studentNames: string[] = [];

    if (data.targetType === 'project') {
      const [proj] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, data.targetId))
        .limit(1);
      if (!proj) {
        return { ok: false, code: 'NOT_FOUND', error: 'Project not found.' };
      }
      targetTitle = proj.name;
      targetCode = proj.code;
      recipientUserId = proj.leadStudentId;
      if (data.kind === 'vouch' && proj.status === 'published') {
        await db
          .update(projects)
          .set({ status: 'verified', updatedAt: now })
          .where(eq(projects.id, proj.id));
      }
    } else {
      const [paper] = await db
        .select()
        .from(researchPapers)
        .where(eq(researchPapers.id, data.targetId))
        .limit(1);
      if (!paper) {
        return { ok: false, code: 'NOT_FOUND', error: 'Research paper not found.' };
      }
      targetTitle = paper.topic;
      targetCode = paper.code;
      recipientUserId = paper.leadAuthorId;
    }

    await db.insert(endorsements).values({
      id: endorsementId,
      institutionId: alum.institutionId,
      alumniUserId: alum.id,
      targetType: data.targetType,
      projectId: data.targetType === 'project' ? data.targetId : null,
      paperId: data.targetType === 'paper' ? data.targetId : null,
      kind: data.kind,
      vouchCode,
      category: data.category,
      quote: data.quote,
      certifiedSkills: data.certifiedSkills,
      rating: data.rating,
      resolved: data.kind !== 'roast',
      createdAt: now,
    });

    if (vouchCode) {
      await db.insert(institutionalAuditLogs).values({
        id: `audit_${randomUUID().slice(0, 10)}`,
        institutionId: alum.institutionId,
        actorUserId: alum.id,
        actorName: alum.fullName,
        category: 'vouch',
        title: `Issued Vouch Certificate ${vouchCode}`,
        impact: `Certified "${targetTitle}" (${data.certifiedSkills.slice(0, 3).join(', ') || data.category})`,
        createdAt: now,
      });
    }

    if (recipientUserId) {
      await db.insert(notifications).values({
        id: `notif_${randomUUID().slice(0, 10)}`,
        institutionId: alum.institutionId,
        recipientUserId,
        actorUserId: alum.id,
        category: data.kind,
        title:
          data.kind === 'vouch'
            ? 'New Alumni Vouch Certificate Issued'
            : data.kind === 'roast'
              ? 'New 5-Min Architecture Roast'
              : 'New Alumni Endorsement',
        message:
          data.kind === 'vouch'
            ? `${alum.fullName} (${alum.company ?? 'Alumni'}) issued ${vouchCode} for "${targetTitle}".`
            : `${alum.fullName} reviewed "${targetTitle}".`,
        targetSection: data.targetType === 'paper' ? 'papers' : 'projects',
        targetEntityId: data.targetId,
        actionLabel: data.kind === 'vouch' ? 'View Vouch' : 'Inspect Review',
        isRead: false,
        createdAt: now,
      });
    }

    const endorsement: EndorsementDTO = {
      id: endorsementId,
      alumniUserId: alum.id,
      alumName: alum.fullName,
      alumRole: alum.designation ?? 'Verified Alumni',
      alumCompany: alum.company ?? 'Industry Partner',
      alumBatch: alum.batchYear ?? 2019,
      alumAvatar: alum.avatarUrl,
      kind: data.kind,
      vouchCode,
      category: data.category,
      quote: data.quote,
      certifiedSkills: data.certifiedSkills,
      rating: data.rating,
      resolved: data.kind !== 'roast',
      createdAt: issuedAt,
    };

    let vouchCertificate: VouchCertificateDTO | undefined;
    if (vouchCode) {
      const signatureDigest = signVouchCertificate({
        vouchCode,
        alumUserId: alum.id,
        projectId: data.targetId,
        issuedAt,
        quote: data.quote,
      });
      vouchCertificate = {
        vouchCode,
        valid: true,
        signatureDigest,
        issuedAt,
        projectId: data.targetId,
        projectCode: targetCode,
        projectTitle: targetTitle,
        studentNames,
        alumUserId: alum.id,
        alumName: alum.fullName,
        alumDesignation: alum.designation ?? 'Verified Alumni',
        alumCompany: alum.company ?? 'Industry Partner',
        alumBatch: alum.batchYear ?? 2019,
        alumAvatar: alum.avatarUrl,
        alumVerified: true,
        quote: data.quote,
        certifiedSkills: data.certifiedSkills,
        publicUrl: `/vouch/${vouchCode}`,
      };
    }

    safeUpdateTags(['feed', 'endorsements', 'dean']);
    return { ok: true, data: { endorsement, vouchCertificate } };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to submit endorsement.',
    };
  }
}

/**
 * Toggles the `resolved` flag on an architecture roast or endorsement.
 */
export async function toggleRoastResolvedAction(
  input: ToggleRoastResolvedInput
): Promise<ActionResult<{ id: string; resolved: boolean }>> {
  try {
    const user = await requireAuth();
    const parsed = toggleRoastResolvedSchema.safeParse(input);
    if (!parsed.success) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: parsed.error.issues[0]?.message ?? 'Invalid endorsement ID.',
      };
    }

    const { endorsementId } = parsed.data;

    if (!isDatabaseConfigured()) {
      const store = getFallbackStore();
      const target = store.endorsements.find((e) => e.id === endorsementId);
      if (!target) {
        return { ok: false, code: 'NOT_FOUND', error: 'Endorsement not found.' };
      }

      const nextResolved = !target.resolved;
      target.resolved = nextResolved;

      for (const proj of store.projects) {
        const embedded = proj.endorsements.find((e) => e.id === endorsementId);
        if (embedded) embedded.resolved = nextResolved;
      }
      for (const paper of store.papers) {
        const embedded = paper.endorsements.find((e) => e.id === endorsementId);
        if (embedded) embedded.resolved = nextResolved;
      }

      safeUpdateTags(['feed', 'endorsements']);
      return { ok: true, data: { id: endorsementId, resolved: nextResolved } };
    }

    const db = getDb();
    const [existing] = await db
      .select()
      .from(endorsements)
      .where(eq(endorsements.id, endorsementId))
      .limit(1);

    if (!existing) {
      return { ok: false, code: 'NOT_FOUND', error: 'Endorsement not found.' };
    }

    if (user.role !== 'dean' && existing.alumniUserId !== user.id) {
      let isTargetOwner = false;
      if (existing.projectId) {
        const [proj] = await db
          .select({ leadStudentId: projects.leadStudentId })
          .from(projects)
          .where(eq(projects.id, existing.projectId))
          .limit(1);
        isTargetOwner = proj?.leadStudentId === user.id;
      } else if (existing.paperId) {
        const [paper] = await db
          .select({ leadAuthorId: researchPapers.leadAuthorId })
          .from(researchPapers)
          .where(eq(researchPapers.id, existing.paperId))
          .limit(1);
        isTargetOwner = paper?.leadAuthorId === user.id;
      }
      if (!isTargetOwner) {
        return {
          ok: false,
          code: 'FORBIDDEN',
          error: 'Only the build author, reviewer, or Dean can resolve this feedback.',
        };
      }
    }

    const nextResolved = !existing.resolved;
    await db
      .update(endorsements)
      .set({ resolved: nextResolved })
      .where(eq(endorsements.id, endorsementId));

    safeUpdateTags(['feed', 'endorsements']);
    return { ok: true, data: { id: endorsementId, resolved: nextResolved } };
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, code: err.code, error: err.message };
    }
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      error: err instanceof Error ? err.message : 'Failed to toggle roast status.',
    };
  }
}
