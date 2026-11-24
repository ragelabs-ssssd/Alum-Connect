'use server';

import { revalidatePath, updateTag } from 'next/cache';
import { and, eq, inArray, sql } from 'drizzle-orm';
import { getDb, isDatabaseConfigured } from '@/db';
import { getFallbackStore } from '@/db/fallbackStore';
import {
  institutionalAuditLogs,
  jobPostings,
  postLikes,
  projectContributors,
  projects,
  researchPapers,
  savedItems,
  studentProfiles,
  users,
} from '@/db/schema';
import { getSessionUser, isAuthError, requireAuth } from '@/lib/auth';
import type {
  ActionResult,
  CursorPage,
  FeedBuildItem,
  PaperDTO,
  ProjectCardDTO,
  SessionUser,
} from '@/types/domain';
import { listBuildsCursorQuery } from './queries';
import {
  feedFilterSchema,
  publishBuildSchema,
  toggleBuildSchema,
  toggleSaveSchema,
} from './validators';

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function normalizeInstitutionId(user: SessionUser): string {
  if (user.institutionId === 'inst-iter-soa') {
    return 'inst_iter_soa';
  }
  return user.institutionId || 'inst_iter_soa';
}

function makeBatchLabel(academicYears: string): string {
  if (academicYears.includes('4th')) return 'Batch 2026';
  if (academicYears.includes('3rd')) return 'Batch 2027';
  if (academicYears.includes('2nd')) return 'Batch 2028';
  return 'ITER Campus';
}

/**
 * Publishes (or saves as draft) a new Student Project or Research Paper.
 * Resolves teammate registration numbers, records an audit log when published,
 * and expires `'ecosystem-stats'` & `'builds-feed'` via `updateTag()`.
 */
export async function publishBuildAction(
  input: unknown
): Promise<ActionResult<FeedBuildItem>> {
  let actor: SessionUser;
  try {
    actor = await requireAuth();
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, error: err.message, code: err.code };
    }
    return { ok: false, error: 'Authentication failed.', code: 'UNAUTHORIZED' };
  }

  const parsed = publishBuildSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid build payload.',
      code: 'VALIDATION_ERROR',
    };
  }

  const data = parsed.data;
  const now = new Date();
  const nowIso = now.toISOString();
  const institutionId = normalizeInstitutionId(actor);
  const uniqueSuffix = Math.random().toString(36).slice(2, 6);

  if (data.buildType === 'paper') {
    const paperId = `rp_${Date.now().toString(36)}_${uniqueSuffix}`;
    const paperCode = `RP-${Math.floor(100 + Math.random() * 899)}`;
    const slug = `${slugify(data.title)}-${uniqueSuffix}`;
    const effectivePaperStatus =
      data.status === 'draft' ? 'Draft' : data.paperStatus;
    const coverImage =
      data.coverImage.trim() || '/images/indian-campus-lab.jpg';

    if (isDatabaseConfigured()) {
      const db = getDb();
      let coAuthorUser: {
        id: string;
        fullName: string;
        regNo: string;
      } | null = null;

      if (data.coAuthorRegNo) {
        const [coRow] = await db
          .select({
            id: users.id,
            fullName: users.fullName,
            regNo: studentProfiles.regNo,
          })
          .from(studentProfiles)
          .innerJoin(users, eq(studentProfiles.userId, users.id))
          .where(eq(studentProfiles.regNo, data.coAuthorRegNo.trim()))
          .limit(1);
        if (coRow) {
          coAuthorUser = coRow;
        }
      }

      await db.insert(researchPapers).values({
        id: paperId,
        institutionId,
        code: paperCode,
        slug,
        topic: data.title,
        abstract: data.story,
        domain: data.domain,
        venue: data.venue,
        status: effectivePaperStatus,
        authorMode: data.authorMode,
        leadAuthorId: actor.id,
        coAuthorId: coAuthorUser?.id ?? null,
        preprintUrl: data.preprintUrl,
        pdfStoragePath: data.pdfStoragePath ?? null,
        codeRepoUrl: data.githubUrl,
        liveDemoUrl: data.liveUrl,
        guidanceNeeded: data.guidanceNeeded,
        techStack: data.techStack,
        coverImageUrl: coverImage,
        likesCount: 0,
        createdAt: now,
      });

      if (data.status === 'published') {
        await db.insert(institutionalAuditLogs).values({
          id: `audit_${Date.now().toString(36)}_${uniqueSuffix}`,
          institutionId,
          actorUserId: actor.id,
          actorName: actor.fullName,
          category: 'mvp_ship',
          title: `Published Research Paper ${paperCode}: ${data.title}`,
          impact: `${data.venue} • ${data.domain}`,
          createdAt: now,
        });
      }

      const paperDto: PaperDTO = {
        id: paperId,
        code: paperCode,
        slug,
        title: data.title,
        subtitle: data.subtitle || `${data.venue} • ${data.domain}`,
        story: data.story,
        domain: data.domain,
        venue: data.venue,
        paperStatus: effectivePaperStatus,
        authorMode: data.authorMode,
        leadAuthorId: actor.id,
        leadAuthorName: actor.fullName,
        leadAuthorRegNo: actor.regNo ?? '2341010000',
        leadAuthorYearBranch: `${actor.academicYear ?? '4th Year'}, ${actor.branch ?? 'CSE'}`,
        coAuthorName: coAuthorUser?.fullName ?? null,
        coAuthorRegNo: coAuthorUser?.regNo ?? data.coAuthorRegNo ?? null,
        preprintUrl: data.preprintUrl,
        pdfStoragePath: data.pdfStoragePath ?? null,
        codeRepoUrl: data.githubUrl,
        liveDemoUrl: data.liveUrl,
        guidanceNeeded: data.guidanceNeeded,
        techStack: data.techStack,
        tags: [...data.techStack, data.domain],
        coverImage,
        authorAvatar: actor.avatarUrl,
        likesCount: 0,
        likedByMe: false,
        savedByMe: false,
        isMine: true,
        isPaper: true,
        endorsements: [],
        createdAt: nowIso,
      };

      updateTag('ecosystem-stats');
      updateTag('builds-feed');
      revalidatePath('/');
      revalidatePath('/student');
      revalidatePath('/alumni');
      revalidatePath('/dean');
      revalidatePath(`/projects/${slug}`);
      return { ok: true, data: paperDto };
    }

    // Fallback mode (Paper)
    const store = getFallbackStore();
    const coAuthor = data.coAuthorRegNo
      ? store.users.find(
          (u) => u.regNo?.toLowerCase() === data.coAuthorRegNo?.toLowerCase()
        )
      : undefined;
    const nextCode = `RP-${String(store.papers.length + 1).padStart(2, '0')}`;

    const paperDto: PaperDTO = {
      id: paperId,
      code: nextCode,
      slug,
      title: data.title,
      subtitle: data.subtitle || `${data.venue} • ${data.domain}`,
      story: data.story,
      domain: data.domain,
      venue: data.venue,
      paperStatus: effectivePaperStatus,
      authorMode: data.authorMode,
      leadAuthorId: actor.id,
      leadAuthorName: actor.fullName,
      leadAuthorRegNo: actor.regNo ?? '2341010000',
      leadAuthorYearBranch: `${actor.academicYear ?? '4th Year'}, ${actor.branch ?? 'CSE'}`,
      coAuthorName: coAuthor?.fullName ?? null,
      coAuthorRegNo: coAuthor?.regNo ?? data.coAuthorRegNo ?? null,
      preprintUrl: data.preprintUrl,
      pdfStoragePath: data.pdfStoragePath ?? null,
      codeRepoUrl: data.githubUrl,
      liveDemoUrl: data.liveUrl,
      guidanceNeeded: data.guidanceNeeded,
      techStack: data.techStack,
      tags: [...data.techStack, data.domain],
      coverImage,
      authorAvatar: actor.avatarUrl,
      likesCount: 0,
      likedByMe: false,
      savedByMe: false,
      isMine: true,
      isPaper: true,
      endorsements: [],
      createdAt: nowIso,
    };

    store.papers.unshift(paperDto);

    if (data.status === 'published') {
      store.auditLogs.unshift({
        id: `audit_${Date.now().toString(36)}_${uniqueSuffix}`,
        actorUserId: actor.id,
        actorName: actor.fullName,
        category: 'mvp_ship',
        title: `Published Research Paper ${nextCode}: ${data.title}`,
        impact: `${data.venue} • ${data.domain}`,
        createdAt: nowIso,
      });
    }

    updateTag('ecosystem-stats');
    updateTag('builds-feed');
    revalidatePath('/');
    revalidatePath('/student');
    revalidatePath('/alumni');
    revalidatePath('/dean');
    revalidatePath(`/projects/${slug}`);
    return { ok: true, data: paperDto };
  }

  // Project creation path
  const projectId = `prj_${Date.now().toString(36)}_${uniqueSuffix}`;
  const slug = `${slugify(data.title)}-${uniqueSuffix}`;
  const coverImage =
    data.coverImage.trim() || '/images/indian-student-tech.jpg';
  const shortDesc = data.shortDesc.trim() || data.story.slice(0, 220);
  const subtitle = data.subtitle.trim() || shortDesc.slice(0, 120);
  const providedByReg = new Map(
    data.coContributors.map((c) => [c.regNo.trim().toLowerCase(), c])
  );
  const cleanedRegNos = Array.from(
    new Set(
      [
        ...data.coContributorRegNos,
        ...data.coContributors.map((c) => c.regNo),
      ]
        .map((r) => r.trim())
        .filter((r) => r.length > 0 && r !== actor.regNo)
    )
  );

  if (isDatabaseConfigured()) {
    const db = getDb();
    const projectCode = `PRJ-${Math.floor(100 + Math.random() * 899)}`;

    const resolvedTeammates =
      cleanedRegNos.length > 0
        ? await db
            .select({
              id: users.id,
              fullName: users.fullName,
              regNo: studentProfiles.regNo,
              academicYear: studentProfiles.academicYear,
            })
            .from(studentProfiles)
            .innerJoin(users, eq(studentProfiles.userId, users.id))
            .where(inArray(studentProfiles.regNo, cleanedRegNos))
        : [];

    const teammateByReg = new Map(resolvedTeammates.map((t) => [t.regNo, t]));
    const contributors: ProjectCardDTO['contributors'] = [
      {
        userId: actor.id,
        name: actor.fullName,
        regNo: actor.regNo ?? '2341010000',
        academicYear: actor.academicYear ?? data.academicYears,
      },
      ...cleanedRegNos.map((regNo) => {
        const match = teammateByReg.get(regNo);
        const provided = providedByReg.get(regNo.toLowerCase());
        return {
          userId: match?.id ?? null,
          name: match?.fullName ?? provided?.name ?? `Collaborator (${regNo})`,
          regNo,
          academicYear:
            match?.academicYear ?? provided?.academicYear ?? data.academicYears,
        };
      }),
    ];

    let linkedPaperCode: string | null = null;
    if (data.linkedPaperId) {
      const [paperRow] = await db
        .select({ code: researchPapers.code })
        .from(researchPapers)
        .where(eq(researchPapers.id, data.linkedPaperId))
        .limit(1);
      linkedPaperCode = paperRow?.code ?? null;
    }

    const effectiveTeamSize = Math.max(data.teamSize, contributors.length);
    const effectiveMode =
      effectiveTeamSize > 1 ? 'Group' : data.collaborationMode;

    await db.insert(projects).values({
      id: projectId,
      institutionId,
      code: projectCode,
      slug,
      name: data.title,
      pitch: subtitle,
      shortDesc,
      detailedDesc: data.story,
      domain: data.domain,
      collaborationMode: effectiveMode,
      teamSize: effectiveTeamSize,
      leadStudentId: actor.id,
      academicYears: data.academicYears,
      techStack: data.techStack,
      liveUrl: data.liveUrl,
      hostingPlatform: data.hostingPlatform,
      githubUrl: data.githubUrl,
      demoVideoUrl: data.demoVideoUrl,
      pitchVideoUrl: data.pitchVideoUrl,
      coverImageUrl: coverImage,
      linkedPaperId: data.linkedPaperId ?? null,
      status: data.status,
      likesCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    await db.insert(projectContributors).values(
      contributors.map((c) => ({
        projectId,
        studentUserId: c.userId ?? null,
        contributorName: c.name,
        regNo: c.regNo,
        academicYear: c.academicYear,
      }))
    );

    if (data.status === 'published') {
      await db.insert(institutionalAuditLogs).values({
        id: `audit_${Date.now().toString(36)}_${uniqueSuffix}`,
        institutionId,
        actorUserId: actor.id,
        actorName: actor.fullName,
        category: 'mvp_ship',
        title: `Shipped Project ${projectCode}: ${data.title}`,
        impact: `${data.domain} • ${data.techStack.slice(0, 4).join(', ')}`,
        createdAt: now,
      });
    }

    const projectDto: ProjectCardDTO = {
      id: projectId,
      code: projectCode,
      slug,
      title: data.title,
      subtitle,
      shortDesc,
      story: data.story,
      domain: data.domain,
      collaborationMode: effectiveMode,
      teamSize: effectiveTeamSize,
      leadId: actor.id,
      leadName: actor.fullName,
      leadRegNo: actor.regNo ?? '2341010000',
      contributors,
      academicYears: data.academicYears,
      batchLabel: makeBatchLabel(data.academicYears),
      techStack: data.techStack,
      tags: [...data.techStack, data.hostingPlatform],
      liveUrl: data.liveUrl,
      hostingPlatform: data.hostingPlatform,
      githubUrl: data.githubUrl,
      demoVideoUrl: data.demoVideoUrl,
      pitchVideoUrl: data.pitchVideoUrl,
      linkedPaperId: data.linkedPaperId ?? null,
      linkedPaperCode,
      coverImage,
      authorAvatar: actor.avatarUrl,
      status: data.status,
      likesCount: 0,
      likedByMe: false,
      savedByMe: false,
      isMine: true,
      isPaper: false,
      endorsements: [],
      openRole: data.openRole,
      createdAt: nowIso,
    };

    updateTag('ecosystem-stats');
    updateTag('builds-feed');
    revalidatePath('/');
    revalidatePath('/student');
    revalidatePath('/alumni');
    revalidatePath('/dean');
    revalidatePath(`/projects/${slug}`);
    return { ok: true, data: projectDto };
  }

  // Fallback mode (Project)
  const store = getFallbackStore();
  const nextCode = `PRJ-${String(store.projects.length + 1).padStart(2, '0')}`;
  const contributors: ProjectCardDTO['contributors'] = [
    {
      userId: actor.id,
      name: actor.fullName,
      regNo: actor.regNo ?? '2341010000',
      academicYear: actor.academicYear ?? data.academicYears,
    },
    ...cleanedRegNos.map((regNo) => {
      const match = store.users.find(
        (u) => u.regNo?.toLowerCase() === regNo.toLowerCase()
      );
      const provided = providedByReg.get(regNo.toLowerCase());
      return {
        userId: match?.id ?? null,
        name: match?.fullName ?? provided?.name ?? `Collaborator (${regNo})`,
        regNo,
        academicYear:
          match?.academicYear ?? provided?.academicYear ?? data.academicYears,
      };
    }),
  ];

  const linkedPaper = data.linkedPaperId
    ? store.papers.find(
        (p) => p.id === data.linkedPaperId || p.code === data.linkedPaperId
      )
    : undefined;
  const effectiveTeamSize = Math.max(data.teamSize, contributors.length);
  const effectiveMode =
    effectiveTeamSize > 1 ? 'Group' : data.collaborationMode;

  const projectDto: ProjectCardDTO = {
    id: projectId,
    code: nextCode,
    slug,
    title: data.title,
    subtitle,
    shortDesc,
    story: data.story,
    domain: data.domain,
    collaborationMode: effectiveMode,
    teamSize: effectiveTeamSize,
    leadId: actor.id,
    leadName: actor.fullName,
    leadRegNo: actor.regNo ?? '2341010000',
    contributors,
    academicYears: data.academicYears,
    batchLabel: makeBatchLabel(data.academicYears),
    techStack: data.techStack,
    tags: [...data.techStack, data.hostingPlatform],
    liveUrl: data.liveUrl,
    hostingPlatform: data.hostingPlatform,
    githubUrl: data.githubUrl,
    demoVideoUrl: data.demoVideoUrl,
    pitchVideoUrl: data.pitchVideoUrl,
    linkedPaperId: linkedPaper?.id ?? null,
    linkedPaperCode: linkedPaper?.code ?? null,
    coverImage,
    authorAvatar: actor.avatarUrl,
    status: data.status,
    likesCount: 0,
    likedByMe: false,
    savedByMe: false,
    isMine: true,
    isPaper: false,
    endorsements: [],
    openRole: data.openRole,
    createdAt: nowIso,
  };

  store.projects.unshift(projectDto);

  if (data.status === 'published') {
    store.auditLogs.unshift({
      id: `audit_${Date.now().toString(36)}_${uniqueSuffix}`,
      actorUserId: actor.id,
      actorName: actor.fullName,
      category: 'mvp_ship',
      title: `Shipped Project ${nextCode}: ${data.title}`,
      impact: `${data.domain} • ${data.techStack.slice(0, 4).join(', ')}`,
      createdAt: nowIso,
    });
  }

  updateTag('ecosystem-stats');
  updateTag('builds-feed');
  revalidatePath('/');
  revalidatePath('/student');
  revalidatePath('/alumni');
  revalidatePath('/dean');
  revalidatePath(`/projects/${slug}`);
  return { ok: true, data: projectDto };
}

/**
 * Toggles a like on a Project or Research Paper for the current user.
 */
export async function toggleLikeBuildAction(
  targetType: 'project' | 'paper',
  targetId: string
): Promise<ActionResult<{ liked: boolean; likesCount: number }>> {
  let actor: SessionUser;
  try {
    actor = await requireAuth();
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, error: err.message, code: err.code };
    }
    return { ok: false, error: 'Authentication failed.', code: 'UNAUTHORIZED' };
  }

  const parsed = toggleBuildSchema.safeParse({ targetType, targetId });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid like target.',
      code: 'VALIDATION_ERROR',
    };
  }

  const institutionId = normalizeInstitutionId(actor);

  if (isDatabaseConfigured()) {
    const db = getDb();
    const [existing] = await db
      .select()
      .from(postLikes)
      .where(
        and(
          eq(postLikes.userId, actor.id),
          eq(postLikes.targetType, parsed.data.targetType),
          eq(postLikes.targetId, parsed.data.targetId)
        )
      )
      .limit(1);

    const liked = !existing;

    if (existing) {
      await db
        .delete(postLikes)
        .where(
          and(
            eq(postLikes.userId, actor.id),
            eq(postLikes.targetType, parsed.data.targetType),
            eq(postLikes.targetId, parsed.data.targetId)
          )
        );
    } else {
      await db.insert(postLikes).values({
        userId: actor.id,
        targetType: parsed.data.targetType,
        targetId: parsed.data.targetId,
        institutionId,
      });
    }

    const delta = liked ? 1 : -1;
    let likesCount = 0;

    if (parsed.data.targetType === 'project') {
      const [updated] = await db
        .update(projects)
        .set({
          likesCount: sql`GREATEST(0, ${projects.likesCount} + ${delta})`,
        })
        .where(eq(projects.id, parsed.data.targetId))
        .returning({ likesCount: projects.likesCount });

      if (!updated) {
        return { ok: false, error: 'Project not found.', code: 'NOT_FOUND' };
      }
      likesCount = updated.likesCount;
    } else {
      const [updated] = await db
        .update(researchPapers)
        .set({
          likesCount: sql`GREATEST(0, ${researchPapers.likesCount} + ${delta})`,
        })
        .where(eq(researchPapers.id, parsed.data.targetId))
        .returning({ likesCount: researchPapers.likesCount });

      if (!updated) {
        return {
          ok: false,
          error: 'Research paper not found.',
          code: 'NOT_FOUND',
        };
      }
      likesCount = updated.likesCount;
    }

    updateTag('builds-feed');
    return { ok: true, data: { liked, likesCount } };
  }

  // Fallback Mode
  const store = getFallbackStore();
  const build =
    parsed.data.targetType === 'project'
      ? store.projects.find((p) => p.id === parsed.data.targetId)
      : store.papers.find((p) => p.id === parsed.data.targetId);

  if (!build) {
    return { ok: false, error: 'Build not found.', code: 'NOT_FOUND' };
  }

  if (!store.likedBuildKeysByUser[actor.id]) {
    store.likedBuildKeysByUser[actor.id] = new Set();
  }
  const key = `${parsed.data.targetType}:${parsed.data.targetId}`;
  const set = store.likedBuildKeysByUser[actor.id];
  let liked: boolean;

  if (set.has(key)) {
    set.delete(key);
    build.likesCount = Math.max(0, build.likesCount - 1);
    liked = false;
  } else {
    set.add(key);
    build.likesCount += 1;
    liked = true;
  }

  updateTag('builds-feed');
  return { ok: true, data: { liked, likesCount: build.likesCount } };
}

/**
 * Toggles bookmark / saved state for a Project, Research Paper, or Job Posting.
 */
export async function toggleSaveItemAction(
  itemType: 'project' | 'paper' | 'job',
  itemId: string
): Promise<ActionResult<{ saved: boolean }>> {
  let actor: SessionUser;
  try {
    actor = await requireAuth();
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, error: err.message, code: err.code };
    }
    return { ok: false, error: 'Authentication failed.', code: 'UNAUTHORIZED' };
  }

  const parsed = toggleSaveSchema.safeParse({ itemType, itemId });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid save target.',
      code: 'VALIDATION_ERROR',
    };
  }

  const institutionId = normalizeInstitutionId(actor);

  if (isDatabaseConfigured()) {
    const db = getDb();

    if (parsed.data.itemType === 'project') {
      const [exists] = await db
        .select({ id: projects.id })
        .from(projects)
        .where(eq(projects.id, parsed.data.itemId))
        .limit(1);
      if (!exists) {
        return { ok: false, error: 'Project not found.', code: 'NOT_FOUND' };
      }
    } else if (parsed.data.itemType === 'paper') {
      const [exists] = await db
        .select({ id: researchPapers.id })
        .from(researchPapers)
        .where(eq(researchPapers.id, parsed.data.itemId))
        .limit(1);
      if (!exists) {
        return { ok: false, error: 'Paper not found.', code: 'NOT_FOUND' };
      }
    } else {
      const [exists] = await db
        .select({ id: jobPostings.id })
        .from(jobPostings)
        .where(eq(jobPostings.id, parsed.data.itemId))
        .limit(1);
      if (!exists) {
        return { ok: false, error: 'Job posting not found.', code: 'NOT_FOUND' };
      }
    }

    const [existing] = await db
      .select()
      .from(savedItems)
      .where(
        and(
          eq(savedItems.userId, actor.id),
          eq(savedItems.itemType, parsed.data.itemType),
          eq(savedItems.itemId, parsed.data.itemId)
        )
      )
      .limit(1);

    const saved = !existing;
    if (existing) {
      await db
        .delete(savedItems)
        .where(
          and(
            eq(savedItems.userId, actor.id),
            eq(savedItems.itemType, parsed.data.itemType),
            eq(savedItems.itemId, parsed.data.itemId)
          )
        );
    } else {
      await db.insert(savedItems).values({
        userId: actor.id,
        itemType: parsed.data.itemType,
        itemId: parsed.data.itemId,
        institutionId,
      });
    }

    updateTag('builds-feed');
    return { ok: true, data: { saved } };
  }

  // Fallback Mode
  const store = getFallbackStore();
  const exists =
    parsed.data.itemType === 'project'
      ? store.projects.some((p) => p.id === parsed.data.itemId)
      : parsed.data.itemType === 'paper'
        ? store.papers.some((p) => p.id === parsed.data.itemId)
        : store.jobs.some((j) => j.id === parsed.data.itemId);

  if (!exists) {
    return { ok: false, error: 'Item not found.', code: 'NOT_FOUND' };
  }

  if (!store.savedItemKeysByUser[actor.id]) {
    store.savedItemKeysByUser[actor.id] = new Set();
  }
  const key = `${parsed.data.itemType}:${parsed.data.itemId}`;
  const set = store.savedItemKeysByUser[actor.id];

  let saved: boolean;
  if (set.has(key)) {
    set.delete(key);
    saved = false;
  } else {
    set.add(key);
    saved = true;
  }

  updateTag('builds-feed');
  return { ok: true, data: { saved } };
}

/**
 * Loads the next cursor page of builds (or filtered feed) for the active viewer.
 */
export async function loadMoreBuildsAction(input: {
  kind?: 'all' | 'project' | 'paper';
  domain?: string;
  search?: string;
  tech?: string;
  onlyMineForUserId?: string;
  cursor?: string | null;
  limit?: number;
}): Promise<ActionResult<CursorPage<FeedBuildItem>>> {
  const parsed = feedFilterSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid feed filter options.',
      code: 'VALIDATION_ERROR',
    };
  }

  try {
    const viewer = await getSessionUser();
    const page = await listBuildsCursorQuery({
      ...parsed.data,
      viewerUserId: viewer?.id ?? null,
    });
    return { ok: true, data: page };
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error ? err.message : 'Failed to load builds feed.',
      code: 'INTERNAL_ERROR',
    };
  }
}
