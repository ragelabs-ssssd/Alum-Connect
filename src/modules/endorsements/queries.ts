import { desc, eq } from 'drizzle-orm';
import { getDb, isDatabaseConfigured } from '@/db';
import { createSignatureDigest, getFallbackStore } from '@/db/fallbackStore';
import {
  alumniProfiles,
  endorsements,
  projectContributors,
  projects,
  researchPapers,
  users,
} from '@/db/schema';
import type { EndorsementDTO, VouchCertificateDTO } from '@/types/domain';
import { signVouchCertificate, verifyVouchSignature } from './vouchCrypto';

export interface EndorsementWithTargetDTO extends EndorsementDTO {
  targetType: 'project' | 'paper';
  targetId: string;
  targetCode: string;
  targetTitle: string;
  targetDomain: string;
}

/**
 * Lists all endorsements, roasts, and vouch cards issued by a given alumnus.
 */
export async function listEndorsementsForAlumniQuery(
  alumniUserId: string
): Promise<EndorsementWithTargetDTO[]> {
  if (!isDatabaseConfigured()) {
    const store = getFallbackStore();
    const results: EndorsementWithTargetDTO[] = [];

    for (const proj of store.projects) {
      for (const end of proj.endorsements) {
        if (end.alumniUserId === alumniUserId) {
          results.push({
            ...end,
            targetType: 'project',
            targetId: proj.id,
            targetCode: proj.code,
            targetTitle: proj.title,
            targetDomain: proj.domain,
          });
        }
      }
    }

    for (const paper of store.papers) {
      for (const end of paper.endorsements) {
        if (end.alumniUserId === alumniUserId) {
          results.push({
            ...end,
            targetType: 'paper',
            targetId: paper.id,
            targetCode: paper.code,
            targetTitle: paper.title,
            targetDomain: paper.domain,
          });
        }
      }
    }

    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const db = getDb();
  const rows = await db
    .select({
      endorsement: endorsements,
      alumUser: users,
      alumProfile: alumniProfiles,
      project: projects,
      paper: researchPapers,
    })
    .from(endorsements)
    .innerJoin(users, eq(endorsements.alumniUserId, users.id))
    .leftJoin(alumniProfiles, eq(users.id, alumniProfiles.userId))
    .leftJoin(projects, eq(endorsements.projectId, projects.id))
    .leftJoin(researchPapers, eq(endorsements.paperId, researchPapers.id))
    .where(eq(endorsements.alumniUserId, alumniUserId))
    .orderBy(desc(endorsements.createdAt));

  return rows.map(({ endorsement, alumUser, alumProfile, project, paper }) => {
    const isPaper = endorsement.targetType === 'paper' && Boolean(paper);
    return {
      id: endorsement.id,
      alumniUserId: endorsement.alumniUserId,
      alumName: alumUser.fullName,
      alumRole: alumProfile?.designation ?? 'Verified Alumni',
      alumCompany: alumProfile?.company ?? 'Industry Partner',
      alumBatch: alumProfile?.batchYear ?? 2018,
      alumAvatar: alumUser.avatarUrl,
      kind: endorsement.kind,
      vouchCode: endorsement.vouchCode,
      category: endorsement.category,
      quote: endorsement.quote,
      certifiedSkills: endorsement.certifiedSkills,
      rating: endorsement.rating,
      resolved: endorsement.resolved,
      createdAt: endorsement.createdAt.toISOString(),
      targetType: isPaper ? 'paper' : 'project',
      targetId: isPaper ? (paper?.id ?? '') : (project?.id ?? ''),
      targetCode: isPaper ? (paper?.code ?? '') : (project?.code ?? ''),
      targetTitle: isPaper ? (paper?.topic ?? 'Research Paper') : (project?.name ?? 'Student Build'),
      targetDomain: isPaper ? (paper?.domain ?? 'Research Papers') : (project?.domain ?? 'Systems'),
    };
  });
}

/**
 * Verifies and resolves a public Vouch Certificate by its unique code.
 */
export async function verifyVouchByCodeQuery(
  code: string
): Promise<VouchCertificateDTO | null> {
  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode) return null;

  if (!isDatabaseConfigured()) {
    const store = getFallbackStore();
    const cert =
      store.vouchCertificates[normalizedCode] ??
      Object.values(store.vouchCertificates).find(
        (c) => c.vouchCode.toUpperCase() === normalizedCode
      );

    if (!cert) return null;

    const hmacValid = verifyVouchSignature({
      vouchCode: cert.vouchCode,
      alumUserId: cert.alumUserId,
      projectId: cert.projectId ?? null,
      issuedAt: cert.issuedAt,
      quote: cert.quote,
      signatureDigest: cert.signatureDigest,
    });
    const seededDigestValid =
      cert.signatureDigest === createSignatureDigest(cert.vouchCode, cert.quote);

    return {
      ...cert,
      valid: hmacValid || seededDigestValid,
    };
  }

  const db = getDb();
  const rows = await db
    .select({
      endorsement: endorsements,
      alumUser: users,
      alumProfile: alumniProfiles,
      project: projects,
      paper: researchPapers,
    })
    .from(endorsements)
    .innerJoin(users, eq(endorsements.alumniUserId, users.id))
    .leftJoin(alumniProfiles, eq(users.id, alumniProfiles.userId))
    .leftJoin(projects, eq(endorsements.projectId, projects.id))
    .leftJoin(researchPapers, eq(endorsements.paperId, researchPapers.id))
    .where(eq(endorsements.vouchCode, normalizedCode))
    .limit(1);

  const row = rows[0];
  if (!row || !row.endorsement.vouchCode) {
    return null;
  }

  const { endorsement, alumUser, alumProfile, project, paper } = row;
  const vouchCode = endorsement.vouchCode;
  if (!vouchCode) {
    return null;
  }
  const issuedAt = endorsement.createdAt.toISOString();
  const targetId = project?.id ?? paper?.id ?? null;

  let studentNames: string[] = [];
  if (project) {
    const contributors = await db
      .select({ name: projectContributors.contributorName })
      .from(projectContributors)
      .where(eq(projectContributors.projectId, project.id));
    studentNames = contributors.map((c) => c.name);
  } else if (paper) {
    const [lead] = await db
      .select({ fullName: users.fullName })
      .from(users)
      .where(eq(users.id, paper.leadAuthorId))
      .limit(1);
    if (lead) studentNames.push(lead.fullName);
    if (paper.coAuthorId) {
      const [co] = await db
        .select({ fullName: users.fullName })
        .from(users)
        .where(eq(users.id, paper.coAuthorId))
        .limit(1);
      if (co) studentNames.push(co.fullName);
    }
  }

  const signatureDigest = signVouchCertificate({
    vouchCode,
    alumUserId: endorsement.alumniUserId,
    projectId: targetId,
    issuedAt,
    quote: endorsement.quote,
  });

  const valid =
    alumUser.verificationStatus === 'verified' &&
    verifyVouchSignature({
      vouchCode,
      alumUserId: endorsement.alumniUserId,
      projectId: targetId,
      issuedAt,
      quote: endorsement.quote,
      signatureDigest,
    });

  return {
    vouchCode,
    valid,
    signatureDigest,
    issuedAt,
    projectId: targetId,
    projectCode: project?.code ?? paper?.code ?? null,
    projectTitle: project?.name ?? paper?.topic ?? 'Student Build',
    studentNames,
    alumUserId: alumUser.id,
    alumName: alumUser.fullName,
    alumDesignation: alumProfile?.designation ?? 'Alumni Mentor',
    alumCompany: alumProfile?.company ?? 'Industry Partner',
    alumBatch: alumProfile?.batchYear ?? 2018,
    alumAvatar: alumUser.avatarUrl,
    alumVerified: alumUser.verificationStatus === 'verified',
    quote: endorsement.quote,
    certifiedSkills: endorsement.certifiedSkills,
    publicUrl: `/vouch/${vouchCode}`,
  };
}
