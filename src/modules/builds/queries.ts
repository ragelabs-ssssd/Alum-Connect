import { cacheLife, cacheTag } from 'next/cache';
import {
  and,
  count,
  desc,
  eq,
  inArray,
  lt,
  ne,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
import { getDb, isDatabaseConfigured } from '@/db';
import { getFallbackStore } from '@/db/fallbackStore';
import {
  alumniProfiles,
  endorsements,
  jobPostings,
  placementOffers,
  postLikes,
  projectContributors,
  projects,
  researchPapers,
  savedItems,
  studentProfiles,
  users,
} from '@/db/schema';
import type {
  CursorPage,
  EcosystemStatsDTO,
  EndorsementDTO,
  FeedBuildItem,
  PaperDTO,
  ProjectCardDTO,
} from '@/types/domain';
import { feedFilterSchema, type FeedFilterInput } from './validators';

interface KeysetCursor {
  createdAt: string;
  id: string;
}

function encodeCursor(createdAt: string, id: string): string {
  return Buffer.from(JSON.stringify({ createdAt, id }), 'utf8').toString(
    'base64url'
  );
}

function decodeCursor(cursor?: string | null): KeysetCursor | null {
  if (!cursor) return null;
  try {
    const raw = Buffer.from(cursor, 'base64url').toString('utf8');
    const parsed = JSON.parse(raw) as Partial<KeysetCursor>;
    if (
      typeof parsed.createdAt === 'string' &&
      typeof parsed.id === 'string' &&
      !Number.isNaN(Date.parse(parsed.createdAt))
    ) {
      return { createdAt: parsed.createdAt, id: parsed.id };
    }
    return null;
  } catch {
    return null;
  }
}

function compareBuildsDesc(a: FeedBuildItem, b: FeedBuildItem): number {
  const timeA = Date.parse(a.createdAt);
  const timeB = Date.parse(b.createdAt);
  if (timeA !== timeB) {
    return timeB - timeA;
  }
  return b.id.localeCompare(a.id);
}

function isBeforeCursor(item: FeedBuildItem, cursor: KeysetCursor): boolean {
  const itemTime = Date.parse(item.createdAt);
  const cursorTime = Date.parse(cursor.createdAt);
  if (itemTime < cursorTime) return true;
  if (itemTime === cursorTime && item.id < cursor.id) return true;
  return false;
}

function makeBatchLabel(academicYears: string): string {
  if (academicYears.includes('4th')) return 'Batch 2026';
  if (academicYears.includes('3rd')) return 'Batch 2027';
  if (academicYears.includes('2nd')) return 'Batch 2028';
  return 'ITER Campus';
}

function annotateBuildForViewer<T extends FeedBuildItem>(
  item: T,
  viewerUserId: string | null | undefined,
  likedKeys: Set<string>,
  savedKeys: Set<string>
): T {
  const prefix = item.isPaper ? 'paper' : 'project';
  const key = `${prefix}:${item.id}`;
  const isMine = Boolean(
    viewerUserId &&
      (item.isPaper
        ? item.leadAuthorId === viewerUserId
        : item.leadId === viewerUserId ||
          item.contributors.some((c) => c.userId === viewerUserId))
  );

  return {
    ...item,
    likedByMe: likedKeys.has(key),
    savedByMe: savedKeys.has(key),
    isMine,
  };
}

async function hydrateDbEndorsements(
  targetType: 'project' | 'paper',
  targetIds: string[]
): Promise<Map<string, EndorsementDTO[]>> {
  const result = new Map<string, EndorsementDTO[]>();
  if (targetIds.length === 0) return result;

  const db = getDb();
  const targetCol =
    targetType === 'project' ? endorsements.projectId : endorsements.paperId;

  const rows = await db
    .select({
      endorsement: endorsements,
      alumUser: users,
      alumProfile: alumniProfiles,
    })
    .from(endorsements)
    .innerJoin(users, eq(endorsements.alumniUserId, users.id))
    .leftJoin(alumniProfiles, eq(users.id, alumniProfiles.userId))
    .where(
      and(
        eq(endorsements.targetType, targetType),
        inArray(targetCol, targetIds)
      )
    )
    .orderBy(desc(endorsements.createdAt));

  for (const row of rows) {
    const key =
      targetType === 'project'
        ? row.endorsement.projectId
        : row.endorsement.paperId;
    if (!key) continue;

    const list = result.get(key) ?? [];
    list.push({
      id: row.endorsement.id,
      alumniUserId: row.endorsement.alumniUserId,
      alumName: row.alumUser.fullName,
      alumRole: row.alumProfile?.designation ?? 'Verified Alumni',
      alumCompany: row.alumProfile?.company ?? 'Industry Partner',
      alumBatch: row.alumProfile?.batchYear ?? 2018,
      alumAvatar: row.alumUser.avatarUrl,
      kind: row.endorsement.kind,
      vouchCode: row.endorsement.vouchCode,
      category: row.endorsement.category,
      quote: row.endorsement.quote,
      certifiedSkills: row.endorsement.certifiedSkills,
      rating: row.endorsement.rating,
      resolved: row.endorsement.resolved,
      createdAt: row.endorsement.createdAt.toISOString(),
    });
    result.set(key, list);
  }

  return result;
}

async function fetchDbProjects(options: {
  domain?: string;
  search?: string;
  tech?: string;
  onlyMineForUserId?: string;
  cursor: KeysetCursor | null;
  limit: number;
  viewerUserId?: string | null;
}): Promise<ProjectCardDTO[]> {
  const db = getDb();
  const conditions: SQL[] = [];

  if (!options.onlyMineForUserId) {
    conditions.push(ne(projects.status, 'draft'));
  } else {
    const contributorProjectIds = db
      .select({ projectId: projectContributors.projectId })
      .from(projectContributors)
      .where(eq(projectContributors.studentUserId, options.onlyMineForUserId));
    conditions.push(
      or(
        eq(projects.leadStudentId, options.onlyMineForUserId),
        inArray(projects.id, contributorProjectIds)
      )!
    );
    if (options.viewerUserId !== options.onlyMineForUserId) {
      conditions.push(ne(projects.status, 'draft'));
    }
  }

  if (options.domain && options.domain.toLowerCase() !== 'all') {
    conditions.push(sql`lower(${projects.domain}) = lower(${options.domain})`);
  }

  if (options.tech) {
    conditions.push(
      sql`EXISTS (SELECT 1 FROM unnest(${projects.techStack}) AS t WHERE lower(t) = lower(${options.tech}))`
    );
  }

  if (options.search) {
    const pattern = `%${options.search}%`;
    conditions.push(
      or(
        sql`${projects.name} ILIKE ${pattern}`,
        sql`${projects.pitch} ILIKE ${pattern}`,
        sql`${projects.shortDesc} ILIKE ${pattern}`,
        sql`${projects.domain} ILIKE ${pattern}`,
        sql`${projects.code} ILIKE ${pattern}`,
        sql`array_to_string(${projects.techStack}, ' ') ILIKE ${pattern}`
      )!
    );
  }

  if (options.cursor) {
    const cursorDate = new Date(options.cursor.createdAt);
    conditions.push(
      or(
        lt(projects.createdAt, cursorDate),
        and(
          eq(projects.createdAt, cursorDate),
          lt(projects.id, options.cursor.id)
        )
      )!
    );
  }

  const rows = await db
    .select({
      project: projects,
      leadUser: users,
      leadProfile: studentProfiles,
      linkedPaperCode: researchPapers.code,
    })
    .from(projects)
    .innerJoin(users, eq(projects.leadStudentId, users.id))
    .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
    .leftJoin(researchPapers, eq(projects.linkedPaperId, researchPapers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(projects.createdAt), desc(projects.id))
    .limit(options.limit);

  if (rows.length === 0) return [];

  const projectIds = rows.map((r) => r.project.id);

  const [contribRows, endorsementsMap] = await Promise.all([
    db
      .select()
      .from(projectContributors)
      .where(inArray(projectContributors.projectId, projectIds)),
    hydrateDbEndorsements('project', projectIds),
  ]);

  const contribByProject = new Map<
    string,
    ProjectCardDTO['contributors']
  >();
  for (const c of contribRows) {
    const arr = contribByProject.get(c.projectId) ?? [];
    arr.push({
      userId: c.studentUserId,
      name: c.contributorName,
      regNo: c.regNo,
      academicYear: c.academicYear,
    });
    contribByProject.set(c.projectId, arr);
  }

  return rows.map((row) => {
    const p = row.project;
    const contributors = contribByProject.get(p.id) ?? [
      {
        userId: row.leadUser.id,
        name: row.leadUser.fullName,
        regNo: row.leadProfile?.regNo ?? '2341010000',
        academicYear: row.leadProfile?.academicYear ?? p.academicYears,
      },
    ];

    return {
      id: p.id,
      code: p.code,
      slug: p.slug,
      title: p.name,
      subtitle: p.pitch,
      shortDesc: p.shortDesc,
      story: p.detailedDesc,
      domain: p.domain,
      collaborationMode: p.collaborationMode,
      teamSize: p.teamSize,
      leadId: p.leadStudentId,
      leadName: row.leadUser.fullName,
      leadRegNo: row.leadProfile?.regNo ?? contributors[0]?.regNo ?? '2341010000',
      contributors,
      academicYears: p.academicYears,
      batchLabel: makeBatchLabel(p.academicYears),
      techStack: p.techStack,
      tags: [...p.techStack, p.hostingPlatform],
      liveUrl: p.liveUrl,
      hostingPlatform: p.hostingPlatform,
      githubUrl: p.githubUrl,
      demoVideoUrl: p.demoVideoUrl,
      pitchVideoUrl: p.pitchVideoUrl,
      linkedPaperId: p.linkedPaperId,
      linkedPaperCode: row.linkedPaperCode ?? null,
      coverImage: p.coverImageUrl,
      authorAvatar: row.leadUser.avatarUrl,
      status: p.status,
      likesCount: p.likesCount,
      isPaper: false,
      endorsements: endorsementsMap.get(p.id) ?? [],
      createdAt: p.createdAt.toISOString(),
    };
  });
}

async function fetchDbPapers(options: {
  domain?: string;
  search?: string;
  tech?: string;
  onlyMineForUserId?: string;
  cursor: KeysetCursor | null;
  limit: number;
  viewerUserId?: string | null;
}): Promise<PaperDTO[]> {
  const db = getDb();
  const conditions: SQL[] = [];

  if (!options.onlyMineForUserId) {
    conditions.push(ne(researchPapers.status, 'Draft'));
  } else {
    conditions.push(
      or(
        eq(researchPapers.leadAuthorId, options.onlyMineForUserId),
        eq(researchPapers.coAuthorId, options.onlyMineForUserId)
      )!
    );
    if (options.viewerUserId !== options.onlyMineForUserId) {
      conditions.push(ne(researchPapers.status, 'Draft'));
    }
  }

  if (options.domain && options.domain.toLowerCase() !== 'all') {
    conditions.push(
      sql`lower(${researchPapers.domain}) = lower(${options.domain})`
    );
  }

  if (options.tech) {
    conditions.push(
      sql`EXISTS (SELECT 1 FROM unnest(${researchPapers.techStack}) AS t WHERE lower(t) = lower(${options.tech}))`
    );
  }

  if (options.search) {
    const pattern = `%${options.search}%`;
    conditions.push(
      or(
        sql`${researchPapers.topic} ILIKE ${pattern}`,
        sql`${researchPapers.abstract} ILIKE ${pattern}`,
        sql`${researchPapers.domain} ILIKE ${pattern}`,
        sql`${researchPapers.venue} ILIKE ${pattern}`,
        sql`${researchPapers.code} ILIKE ${pattern}`,
        sql`array_to_string(${researchPapers.techStack}, ' ') ILIKE ${pattern}`
      )!
    );
  }

  if (options.cursor) {
    const cursorDate = new Date(options.cursor.createdAt);
    conditions.push(
      or(
        lt(researchPapers.createdAt, cursorDate),
        and(
          eq(researchPapers.createdAt, cursorDate),
          lt(researchPapers.id, options.cursor.id)
        )
      )!
    );
  }

  const rows = await db
    .select({
      paper: researchPapers,
      leadUser: users,
      leadProfile: studentProfiles,
    })
    .from(researchPapers)
    .innerJoin(users, eq(researchPapers.leadAuthorId, users.id))
    .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(researchPapers.createdAt), desc(researchPapers.id))
    .limit(options.limit);

  if (rows.length === 0) return [];

  const paperIds = rows.map((r) => r.paper.id);
  const coAuthorIds = rows
    .map((r) => r.paper.coAuthorId)
    .filter((id): id is string => Boolean(id));

  const [coAuthors, endorsementsMap] = await Promise.all([
    coAuthorIds.length > 0
      ? db
          .select({
            id: users.id,
            fullName: users.fullName,
            regNo: studentProfiles.regNo,
          })
          .from(users)
          .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
          .where(inArray(users.id, coAuthorIds))
      : Promise.resolve([]),
    hydrateDbEndorsements('paper', paperIds),
  ]);

  const coAuthorMap = new Map(coAuthors.map((c) => [c.id, c]));

  return rows.map((row) => {
    const rp = row.paper;
    const coAuthor = rp.coAuthorId ? coAuthorMap.get(rp.coAuthorId) : undefined;
    const yearBranch = row.leadProfile
      ? `${row.leadProfile.academicYear}, ${row.leadProfile.branch}`
      : '4th Year, CSE';

    return {
      id: rp.id,
      code: rp.code,
      slug: rp.slug,
      title: rp.topic,
      subtitle: `${rp.venue} • ${rp.domain}`,
      story: rp.abstract,
      domain: rp.domain,
      venue: rp.venue,
      paperStatus: rp.status,
      authorMode: rp.authorMode,
      leadAuthorId: rp.leadAuthorId,
      leadAuthorName: row.leadUser.fullName,
      leadAuthorRegNo: row.leadProfile?.regNo ?? '2341010000',
      leadAuthorYearBranch: yearBranch,
      coAuthorName: coAuthor?.fullName ?? null,
      coAuthorRegNo: coAuthor?.regNo ?? null,
      preprintUrl: rp.preprintUrl,
      pdfStoragePath: rp.pdfStoragePath,
      codeRepoUrl: rp.codeRepoUrl,
      liveDemoUrl: rp.liveDemoUrl,
      guidanceNeeded: rp.guidanceNeeded,
      techStack: rp.techStack,
      tags: [...rp.techStack, rp.domain],
      coverImage: rp.coverImageUrl,
      authorAvatar: row.leadUser.avatarUrl,
      likesCount: rp.likesCount,
      isPaper: true,
      endorsements: endorsementsMap.get(rp.id) ?? [],
      createdAt: rp.createdAt.toISOString(),
    };
  });
}

async function getDbViewerEngagement(viewerUserId?: string | null): Promise<{
  likedKeys: Set<string>;
  savedKeys: Set<string>;
}> {
  if (!viewerUserId) {
    return { likedKeys: new Set(), savedKeys: new Set() };
  }
  const db = getDb();
  const [likesRows, savedRows] = await Promise.all([
    db
      .select({ targetType: postLikes.targetType, targetId: postLikes.targetId })
      .from(postLikes)
      .where(eq(postLikes.userId, viewerUserId)),
    db
      .select({ itemType: savedItems.itemType, itemId: savedItems.itemId })
      .from(savedItems)
      .where(eq(savedItems.userId, viewerUserId)),
  ]);

  return {
    likedKeys: new Set(likesRows.map((l) => `${l.targetType}:${l.targetId}`)),
    savedKeys: new Set(savedRows.map((s) => `${s.itemType}:${s.itemId}`)),
  };
}

/**
 * Keyset-paginated builds feed supporting projects, research papers, or combined feed.
 * Uses `(createdAt, id)` keyset pagination and supports both live PostgreSQL and fallbackStore.
 */
export async function listBuildsCursorQuery(
  rawInput: FeedFilterInput & { viewerUserId?: string | null } = {}
): Promise<CursorPage<FeedBuildItem>> {
  const parsed = feedFilterSchema.parse({
    kind: rawInput.kind ?? 'all',
    domain: rawInput.domain,
    search: rawInput.search,
    tech: rawInput.tech,
    onlyMineForUserId: rawInput.onlyMineForUserId,
    cursor: rawInput.cursor,
    limit: rawInput.limit ?? 18,
  });

  const cursor = decodeCursor(parsed.cursor);
  const viewerUserId = rawInput.viewerUserId ?? null;

  if (isDatabaseConfigured()) {
    const fetchLimit = parsed.limit + 1;
    const [projectItems, paperItems, engagement] = await Promise.all([
      parsed.kind === 'paper'
        ? Promise.resolve([] as ProjectCardDTO[])
        : fetchDbProjects({
            domain: parsed.domain,
            search: parsed.search,
            tech: parsed.tech,
            onlyMineForUserId: parsed.onlyMineForUserId,
            cursor,
            limit: fetchLimit,
            viewerUserId,
          }),
      parsed.kind === 'project'
        ? Promise.resolve([] as PaperDTO[])
        : fetchDbPapers({
            domain: parsed.domain,
            search: parsed.search,
            tech: parsed.tech,
            onlyMineForUserId: parsed.onlyMineForUserId,
            cursor,
            limit: fetchLimit,
            viewerUserId,
          }),
      getDbViewerEngagement(viewerUserId),
    ]);

    const merged = [...projectItems, ...paperItems].sort(compareBuildsDesc);
    const hasMore = merged.length > parsed.limit;
    const pageItems = merged
      .slice(0, parsed.limit)
      .map((item) =>
        annotateBuildForViewer(
          item,
          viewerUserId,
          engagement.likedKeys,
          engagement.savedKeys
        )
      );

    const last = pageItems[pageItems.length - 1];
    return {
      items: pageItems,
      nextCursor: hasMore && last ? encodeCursor(last.createdAt, last.id) : null,
      hasMore,
    };
  }

  // Fallback Mode
  const store = getFallbackStore();
  const likedKeys =
    (viewerUserId ? store.likedBuildKeysByUser[viewerUserId] : undefined) ??
    new Set<string>();
  const savedKeys =
    (viewerUserId ? store.savedItemKeysByUser[viewerUserId] : undefined) ??
    new Set<string>();

  const matchesFilters = (item: FeedBuildItem): boolean => {
    if (!parsed.onlyMineForUserId) {
      if (!item.isPaper && item.status === 'draft') return false;
      if (item.isPaper && item.paperStatus === 'Draft') return false;
    } else {
      const owns = item.isPaper
        ? item.leadAuthorId === parsed.onlyMineForUserId
        : item.leadId === parsed.onlyMineForUserId ||
          item.contributors.some((c) => c.userId === parsed.onlyMineForUserId);
      if (!owns) return false;
      if (viewerUserId !== parsed.onlyMineForUserId) {
        if (!item.isPaper && item.status === 'draft') return false;
        if (item.isPaper && item.paperStatus === 'Draft') return false;
      }
    }

    if (parsed.domain && parsed.domain.toLowerCase() !== 'all') {
      if (item.domain.toLowerCase() !== parsed.domain.toLowerCase()) {
        return false;
      }
    }

    if (parsed.tech) {
      const needle = parsed.tech.toLowerCase();
      if (!item.techStack.some((t) => t.toLowerCase() === needle)) {
        return false;
      }
    }

    if (parsed.search) {
      const q = parsed.search.toLowerCase();
      const haystack = [
        item.code,
        item.title,
        item.subtitle,
        item.story,
        item.domain,
        item.isPaper ? item.leadAuthorName : item.leadName,
        ...item.techStack,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  };

  let pool: FeedBuildItem[] = [];
  if (parsed.kind !== 'paper') {
    pool = pool.concat(store.projects);
  }
  if (parsed.kind !== 'project') {
    pool = pool.concat(store.papers);
  }

  const filtered = pool.filter(matchesFilters).sort(compareBuildsDesc);
  const totalCount = filtered.length;
  const afterCursor = cursor
    ? filtered.filter((item) => isBeforeCursor(item, cursor))
    : filtered;

  const hasMore = afterCursor.length > parsed.limit;
  const pageItems = afterCursor
    .slice(0, parsed.limit)
    .map((item) =>
      annotateBuildForViewer(item, viewerUserId, likedKeys, savedKeys)
    );

  const last = pageItems[pageItems.length - 1];

  return {
    items: pageItems,
    nextCursor: hasMore && last ? encodeCursor(last.createdAt, last.id) : null,
    hasMore,
    totalCount,
  };
}

/**
 * Fetches a single Project or Research Paper by `slug`, `code`, or `id`.
 */
export async function getBuildBySlugOrCodeQuery(
  slugOrCode: string,
  viewerUserId?: string | null
): Promise<FeedBuildItem | null> {
  const key = slugOrCode.trim();
  if (!key) return null;

  if (isDatabaseConfigured()) {
    const db = getDb();
    const [projRow] = await db
      .select({
        project: projects,
        leadUser: users,
        leadProfile: studentProfiles,
        linkedPaperCode: researchPapers.code,
      })
      .from(projects)
      .innerJoin(users, eq(projects.leadStudentId, users.id))
      .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
      .leftJoin(researchPapers, eq(projects.linkedPaperId, researchPapers.id))
      .where(
        or(
          eq(projects.id, key),
          eq(projects.slug, key),
          sql`lower(${projects.code}) = lower(${key})`
        )
      )
      .limit(1);

    if (projRow) {
      const [contribRows, endorsementsMap, engagement] = await Promise.all([
        db
          .select()
          .from(projectContributors)
          .where(eq(projectContributors.projectId, projRow.project.id)),
        hydrateDbEndorsements('project', [projRow.project.id]),
        getDbViewerEngagement(viewerUserId),
      ]);

      const contributors =
        contribRows.length > 0
          ? contribRows.map((c) => ({
              userId: c.studentUserId,
              name: c.contributorName,
              regNo: c.regNo,
              academicYear: c.academicYear,
            }))
          : [
              {
                userId: projRow.leadUser.id,
                name: projRow.leadUser.fullName,
                regNo: projRow.leadProfile?.regNo ?? '2341010000',
                academicYear:
                  projRow.leadProfile?.academicYear ??
                  projRow.project.academicYears,
              },
            ];

      const dto: ProjectCardDTO = {
        id: projRow.project.id,
        code: projRow.project.code,
        slug: projRow.project.slug,
        title: projRow.project.name,
        subtitle: projRow.project.pitch,
        shortDesc: projRow.project.shortDesc,
        story: projRow.project.detailedDesc,
        domain: projRow.project.domain,
        collaborationMode: projRow.project.collaborationMode,
        teamSize: projRow.project.teamSize,
        leadId: projRow.project.leadStudentId,
        leadName: projRow.leadUser.fullName,
        leadRegNo:
          projRow.leadProfile?.regNo ?? contributors[0]?.regNo ?? '2341010000',
        contributors,
        academicYears: projRow.project.academicYears,
        batchLabel: makeBatchLabel(projRow.project.academicYears),
        techStack: projRow.project.techStack,
        tags: [...projRow.project.techStack, projRow.project.hostingPlatform],
        liveUrl: projRow.project.liveUrl,
        hostingPlatform: projRow.project.hostingPlatform,
        githubUrl: projRow.project.githubUrl,
        demoVideoUrl: projRow.project.demoVideoUrl,
        pitchVideoUrl: projRow.project.pitchVideoUrl,
        linkedPaperId: projRow.project.linkedPaperId,
        linkedPaperCode: projRow.linkedPaperCode ?? null,
        coverImage: projRow.project.coverImageUrl,
        authorAvatar: projRow.leadUser.avatarUrl,
        status: projRow.project.status,
        likesCount: projRow.project.likesCount,
        isPaper: false,
        endorsements: endorsementsMap.get(projRow.project.id) ?? [],
        createdAt: projRow.project.createdAt.toISOString(),
      };

      return annotateBuildForViewer(
        dto,
        viewerUserId,
        engagement.likedKeys,
        engagement.savedKeys
      );
    }

    const [paperRow] = await db
      .select({
        paper: researchPapers,
        leadUser: users,
        leadProfile: studentProfiles,
      })
      .from(researchPapers)
      .innerJoin(users, eq(researchPapers.leadAuthorId, users.id))
      .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
      .where(
        or(
          eq(researchPapers.id, key),
          eq(researchPapers.slug, key),
          sql`lower(${researchPapers.code}) = lower(${key})`
        )
      )
      .limit(1);

    if (paperRow) {
      const [coAuthorRows, endorsementsMap, engagement] = await Promise.all([
        paperRow.paper.coAuthorId
          ? db
              .select({
                fullName: users.fullName,
                regNo: studentProfiles.regNo,
              })
              .from(users)
              .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
              .where(eq(users.id, paperRow.paper.coAuthorId))
              .limit(1)
          : Promise.resolve([]),
        hydrateDbEndorsements('paper', [paperRow.paper.id]),
        getDbViewerEngagement(viewerUserId),
      ]);

      const coAuthor = coAuthorRows[0];
      const rp = paperRow.paper;
      const dto: PaperDTO = {
        id: rp.id,
        code: rp.code,
        slug: rp.slug,
        title: rp.topic,
        subtitle: `${rp.venue} • ${rp.domain}`,
        story: rp.abstract,
        domain: rp.domain,
        venue: rp.venue,
        paperStatus: rp.status,
        authorMode: rp.authorMode,
        leadAuthorId: rp.leadAuthorId,
        leadAuthorName: paperRow.leadUser.fullName,
        leadAuthorRegNo: paperRow.leadProfile?.regNo ?? '2341010000',
        leadAuthorYearBranch: paperRow.leadProfile
          ? `${paperRow.leadProfile.academicYear}, ${paperRow.leadProfile.branch}`
          : '4th Year, CSE',
        coAuthorName: coAuthor?.fullName ?? null,
        coAuthorRegNo: coAuthor?.regNo ?? null,
        preprintUrl: rp.preprintUrl,
        pdfStoragePath: rp.pdfStoragePath,
        codeRepoUrl: rp.codeRepoUrl,
        liveDemoUrl: rp.liveDemoUrl,
        guidanceNeeded: rp.guidanceNeeded,
        techStack: rp.techStack,
        tags: [...rp.techStack, rp.domain],
        coverImage: rp.coverImageUrl,
        authorAvatar: paperRow.leadUser.avatarUrl,
        likesCount: rp.likesCount,
        isPaper: true,
        endorsements: endorsementsMap.get(rp.id) ?? [],
        createdAt: rp.createdAt.toISOString(),
      };

      return annotateBuildForViewer(
        dto,
        viewerUserId,
        engagement.likedKeys,
        engagement.savedKeys
      );
    }

    return null;
  }

  // Fallback Mode
  const store = getFallbackStore();
  const normalized = key.toLowerCase();
  const likedKeys =
    (viewerUserId ? store.likedBuildKeysByUser[viewerUserId] : undefined) ??
    new Set<string>();
  const savedKeys =
    (viewerUserId ? store.savedItemKeysByUser[viewerUserId] : undefined) ??
    new Set<string>();

  const project = store.projects.find(
    (p) =>
      p.id.toLowerCase() === normalized ||
      p.slug.toLowerCase() === normalized ||
      p.code.toLowerCase() === normalized
  );
  if (project) {
    return annotateBuildForViewer(project, viewerUserId, likedKeys, savedKeys);
  }

  const paper = store.papers.find(
    (p) =>
      p.id.toLowerCase() === normalized ||
      p.slug.toLowerCase() === normalized ||
      p.code.toLowerCase() === normalized
  );
  if (paper) {
    return annotateBuildForViewer(paper, viewerUserId, likedKeys, savedKeys);
  }

  return null;
}

/**
 * Returns aggregate ecosystem metrics cached via `'use cache'` and `cacheTag('ecosystem-stats')`.
 */
export async function getEcosystemStatsQuery(): Promise<EcosystemStatsDTO> {
  'use cache';
  cacheTag('ecosystem-stats');
  cacheLife('minutes');

  if (isDatabaseConfigured()) {
    const db = getDb();
    const [
      [projCountRow],
      [paperCountRow],
      [stuCountRow],
      [alumCountRow],
      [openJobsRow],
      [offersCountRow],
    ] = await Promise.all([
      db
        .select({ value: count() })
        .from(projects)
        .where(ne(projects.status, 'draft')),
      db
        .select({ value: count() })
        .from(researchPapers)
        .where(ne(researchPapers.status, 'Draft')),
      db
        .select({ value: count() })
        .from(users)
        .where(eq(users.role, 'student')),
      db
        .select({ value: count() })
        .from(users)
        .where(
          and(
            eq(users.role, 'alumni'),
            eq(users.verificationStatus, 'verified')
          )
        ),
      db
        .select({ value: count() })
        .from(jobPostings)
        .where(eq(jobPostings.status, 'open')),
      db.select({ value: count() }).from(placementOffers),
    ]);

    const projectsCount = Number(projCountRow?.value ?? 0);
    const papersCount = Number(paperCountRow?.value ?? 0);

    return {
      buildsCount: projectsCount + papersCount,
      projectsCount,
      papersCount,
      studentsCount: Number(stuCountRow?.value ?? 0),
      alumniCount: Number(alumCountRow?.value ?? 0),
      openDealsCount: Number(openJobsRow?.value ?? 0),
      offersCount: Number(offersCountRow?.value ?? 0),
    };
  }

  const store = getFallbackStore();
  const projectsCount = store.projects.filter(
    (p) => p.status !== 'draft'
  ).length;
  const papersCount = store.papers.filter(
    (p) => p.paperStatus !== 'Draft'
  ).length;

  return {
    buildsCount: projectsCount + papersCount,
    projectsCount,
    papersCount,
    studentsCount: store.users.filter((u) => u.role === 'student').length,
    alumniCount: store.users.filter(
      (u) => u.role === 'alumni' && u.verificationStatus === 'verified'
    ).length,
    openDealsCount: store.jobs.filter((j) => j.status === 'open').length,
    offersCount: store.offers.length,
  };
}
