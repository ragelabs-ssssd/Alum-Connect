import { desc, eq, inArray, or } from 'drizzle-orm';
import type {
  AlumniCareerExtra,
  StudentAcademicExtra,
} from '@/data/alumConnectData';
import { getFallbackStore } from '@/db/fallbackStore';
import { getDb, isDatabaseConfigured } from '@/db/index';
import {
  alumniProfiles,
  coffeeChatRequests,
  endorsements,
  institutions,
  placementOffers,
  projectContributors,
  projects,
  researchPapers,
  socialFollows,
  studentProfiles,
  users,
} from '@/db/schema';
import { mapDbRecordToSessionUser } from '@/lib/auth';
import type {
  EndorsementDTO,
  PaperDTO,
  PlacementOfferDTO,
  ProjectCardDTO,
  SessionUser,
} from '@/types/domain';

export interface PublicProfileDTO {
  user: SessionUser;
  academics: StudentAcademicExtra | null;
  career: AlumniCareerExtra | null;
  projects: ProjectCardDTO[];
  papers: PaperDTO[];
  offers: PlacementOfferDTO[];
  mentorsOrMentees: SessionUser[];
  isFollowedByMe: boolean;
  followersCount: number;
}

export interface NetworkDirectoryEntry {
  user: SessionUser;
  isFollowedByMe: boolean;
  followersCount: number;
  projectsCount: number;
  papersCount: number;
  offersCount: number;
}

export interface ListNetworkDirectoryParams {
  scope?: 'all' | 'students' | 'alumni';
  q?: string;
  viewerUserId?: string | null;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function matchesUserIdentifier(user: SessionUser, rawIdentifier: string): boolean {
  const decoded = safeDecode(rawIdentifier).trim();
  if (!decoded) return false;
  const lower = decoded.toLowerCase();
  const slugged = slugify(decoded);

  return (
    user.id === decoded ||
    user.id.toLowerCase() === lower ||
    (user.legacyCode?.toLowerCase() ?? '') === lower ||
    (user.githubHandle?.toLowerCase() ?? '') === lower ||
    (user.regNo?.toLowerCase() ?? '') === lower ||
    user.fullName.toLowerCase() === lower ||
    slugify(user.fullName) === slugged
  );
}

function buildEndorsementDtoMap(
  rows: Array<{
    endorsement: typeof endorsements.$inferSelect;
    alumName: string;
    alumDesignation: string | null;
    alumCompany: string | null;
    alumBatch: number | null;
    alumAvatar: string;
  }>,
): Map<string, EndorsementDTO[]> {
  const map = new Map<string, EndorsementDTO[]>();
  for (const row of rows) {
    const key = row.endorsement.projectId ?? row.endorsement.paperId;
    if (!key) continue;
    const list = map.get(key) ?? [];
    list.push({
      id: row.endorsement.id,
      alumniUserId: row.endorsement.alumniUserId,
      alumName: row.alumName,
      alumRole: row.alumDesignation ?? 'Alumni Mentor',
      alumCompany: row.alumCompany ?? 'ITER Alumni Network',
      alumBatch: row.alumBatch ?? 2020,
      alumAvatar: row.alumAvatar,
      kind: row.endorsement.kind,
      vouchCode: row.endorsement.vouchCode ?? null,
      category: row.endorsement.category,
      quote: row.endorsement.quote,
      certifiedSkills: row.endorsement.certifiedSkills ?? [],
      rating: row.endorsement.rating,
      resolved: row.endorsement.resolved,
      createdAt: row.endorsement.createdAt.toISOString(),
    });
    map.set(key, list);
  }
  return map;
}

async function getPublicProfileFromDb(
  handleOrIdOrName: string,
  viewerUserId?: string | null,
): Promise<{ found: boolean; data: PublicProfileDTO | null }> {
  const db = getDb();
  const decoded = safeDecode(handleOrIdOrName).trim();
  if (!decoded) {
    return { found: true, data: null };
  }

  const allUserRows = await db
    .select({
      user: users,
      institutionSlug: institutions.slug,
      studentProfile: studentProfiles,
      alumniProfile: alumniProfiles,
    })
    .from(users)
    .leftJoin(institutions, eq(users.institutionId, institutions.id))
    .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
    .leftJoin(alumniProfiles, eq(users.id, alumniProfiles.userId));

  if (allUserRows.length === 0) {
    return { found: false, data: null };
  }

  const mappedUsers = allUserRows.map(mapDbRecordToSessionUser);
  const targetIdx = mappedUsers.findIndex((u) =>
    matchesUserIdentifier(u, decoded),
  );
  if (targetIdx === -1) {
    return { found: true, data: null };
  }

  const targetRow = allUserRows[targetIdx];
  const targetUser = mappedUsers[targetIdx];
  const userById = new Map(mappedUsers.map((u) => [u.id, u]));

  const followRows = await db
    .select()
    .from(socialFollows)
    .where(eq(socialFollows.followingUserId, targetUser.id));

  const followersCount = followRows.length;
  const isFollowedByMe = Boolean(
    viewerUserId && followRows.some((f) => f.followerUserId === viewerUserId),
  );

  // Load endorsement rows for hydrating projects and papers
  const endorsementRows = await db
    .select({
      endorsement: endorsements,
      alumName: users.fullName,
      alumDesignation: alumniProfiles.designation,
      alumCompany: alumniProfiles.company,
      alumBatch: alumniProfiles.batchYear,
      alumAvatar: users.avatarUrl,
    })
    .from(endorsements)
    .innerJoin(users, eq(endorsements.alumniUserId, users.id))
    .leftJoin(alumniProfiles, eq(users.id, alumniProfiles.userId));

  const endorsementsByTarget = buildEndorsementDtoMap(endorsementRows);

  // Determine project IDs and paper IDs relevant to the user
  let projectRows: Array<typeof projects.$inferSelect> = [];
  let paperRows: Array<typeof researchPapers.$inferSelect> = [];

  if (targetUser.role === 'alumni') {
    const endorsedProjectIds = Array.from(
      new Set(
        endorsementRows
          .filter(
            (r) =>
              r.endorsement.alumniUserId === targetUser.id &&
              r.endorsement.projectId,
          )
          .map((r) => r.endorsement.projectId as string),
      ),
    );
    const endorsedPaperIds = Array.from(
      new Set(
        endorsementRows
          .filter(
            (r) =>
              r.endorsement.alumniUserId === targetUser.id &&
              r.endorsement.paperId,
          )
          .map((r) => r.endorsement.paperId as string),
      ),
    );

    if (endorsedProjectIds.length > 0) {
      projectRows = await db
        .select()
        .from(projects)
        .where(inArray(projects.id, endorsedProjectIds))
        .orderBy(desc(projects.createdAt));
    }
    if (endorsedPaperIds.length > 0) {
      paperRows = await db
        .select()
        .from(researchPapers)
        .where(inArray(researchPapers.id, endorsedPaperIds))
        .orderBy(desc(researchPapers.createdAt));
    }
  } else {
    const contribMatches = await db
      .select({ projectId: projectContributors.projectId })
      .from(projectContributors)
      .where(eq(projectContributors.studentUserId, targetUser.id));

    const contribProjectIds = contribMatches.map((c) => c.projectId);
    projectRows = await db
      .select()
      .from(projects)
      .where(
        contribProjectIds.length > 0
          ? or(
              eq(projects.leadStudentId, targetUser.id),
              inArray(projects.id, contribProjectIds),
            )
          : eq(projects.leadStudentId, targetUser.id),
      )
      .orderBy(desc(projects.createdAt));

    paperRows = await db
      .select()
      .from(researchPapers)
      .where(
        or(
          eq(researchPapers.leadAuthorId, targetUser.id),
          eq(researchPapers.coAuthorId, targetUser.id),
        ),
      )
      .orderBy(desc(researchPapers.createdAt));
  }

  const projectIds = projectRows.map((p) => p.id);
  const contributorsRows =
    projectIds.length > 0
      ? await db
          .select()
          .from(projectContributors)
          .where(inArray(projectContributors.projectId, projectIds))
      : [];

  const contributorsByProject = new Map<
    string,
    ProjectCardDTO['contributors']
  >();
  for (const c of contributorsRows) {
    const list = contributorsByProject.get(c.projectId) ?? [];
    list.push({
      userId: c.studentUserId ?? null,
      name: c.contributorName,
      regNo: c.regNo,
      academicYear: c.academicYear,
    });
    contributorsByProject.set(c.projectId, list);
  }

  const mappedProjects: ProjectCardDTO[] = projectRows.map((p) => {
    const lead = userById.get(p.leadStudentId);
    const projectEndorsements = endorsementsByTarget.get(p.id) ?? [];
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
      leadName: lead?.fullName ?? targetUser.fullName,
      leadRegNo: lead?.regNo ?? targetUser.regNo ?? '',
      contributors: contributorsByProject.get(p.id) ?? [],
      academicYears: p.academicYears,
      batchLabel: `${p.academicYears} • ${lead?.branch ?? 'CSE'}`,
      techStack: p.techStack ?? [],
      tags: p.techStack ?? [],
      liveUrl: p.liveUrl,
      hostingPlatform: p.hostingPlatform,
      githubUrl: p.githubUrl,
      demoVideoUrl: p.demoVideoUrl,
      pitchVideoUrl: p.pitchVideoUrl,
      linkedPaperId: p.linkedPaperId ?? null,
      linkedPaperCode: null,
      coverImage: p.coverImageUrl,
      authorAvatar: lead?.avatarUrl ?? targetUser.avatarUrl,
      status: p.status,
      likesCount: p.likesCount,
      isMine: viewerUserId === p.leadStudentId,
      isPaper: false,
      endorsements: projectEndorsements,
      createdAt: p.createdAt.toISOString(),
    };
  });

  const mappedPapers: PaperDTO[] = paperRows.map((rp) => {
    const lead = userById.get(rp.leadAuthorId);
    const coAuthor = rp.coAuthorId ? userById.get(rp.coAuthorId) : undefined;
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
      leadAuthorName: lead?.fullName ?? targetUser.fullName,
      leadAuthorRegNo: lead?.regNo ?? '',
      leadAuthorYearBranch: `${lead?.academicYear ?? '4th Year'} ${lead?.branch ?? 'CSE'}`,
      coAuthorName: coAuthor?.fullName ?? null,
      coAuthorRegNo: coAuthor?.regNo ?? null,
      preprintUrl: rp.preprintUrl,
      pdfStoragePath: rp.pdfStoragePath ?? null,
      codeRepoUrl: rp.codeRepoUrl,
      liveDemoUrl: rp.liveDemoUrl,
      guidanceNeeded: rp.guidanceNeeded ?? [],
      techStack: rp.techStack ?? [],
      tags: rp.techStack ?? [],
      coverImage: rp.coverImageUrl,
      authorAvatar: lead?.avatarUrl ?? targetUser.avatarUrl,
      likesCount: rp.likesCount,
      isMine: viewerUserId === rp.leadAuthorId,
      isPaper: true,
      endorsements: endorsementsByTarget.get(rp.id) ?? [],
      createdAt: rp.createdAt.toISOString(),
    };
  });

  const offerRows = await db
    .select()
    .from(placementOffers)
    .where(
      targetUser.role === 'alumni'
        ? eq(placementOffers.referringAlumniId, targetUser.id)
        : eq(placementOffers.studentUserId, targetUser.id),
    )
    .orderBy(desc(placementOffers.createdAt));

  const mappedOffers: PlacementOfferDTO[] = offerRows.map((o) => {
    const stu = userById.get(o.studentUserId);
    const refAlum = o.referringAlumniId
      ? userById.get(o.referringAlumniId)
      : undefined;
    return {
      id: o.id,
      code: o.code,
      studentUserId: o.studentUserId,
      studentName: stu?.fullName ?? 'Student',
      academicYearBranch: o.academicYearBranch,
      company: o.company,
      jobRole: o.jobRole,
      packageStr: o.packageStr,
      packageLpa: o.packageLpa,
      offerType: o.offerType,
      referringAlumniId: o.referringAlumniId ?? null,
      referringAlumniName: refAlum?.fullName ?? null,
      status: o.status,
      verifiedByDean: o.verifiedByDean,
      createdAt: o.createdAt.toISOString(),
    };
  });

  // Related mentors or mentees via endorsements, offers, and accepted coffee chats
  const relatedIds = new Set<string>();
  const chats = await db
    .select()
    .from(coffeeChatRequests)
    .where(
      targetUser.role === 'alumni'
        ? eq(coffeeChatRequests.alumniUserId, targetUser.id)
        : eq(coffeeChatRequests.studentUserId, targetUser.id),
    );

  for (const chat of chats) {
    if (chat.status === 'accepted') {
      relatedIds.add(
        targetUser.role === 'alumni' ? chat.studentUserId : chat.alumniUserId,
      );
    }
  }

  if (targetUser.role === 'alumni') {
    for (const p of mappedProjects) relatedIds.add(p.leadId);
    for (const rp of mappedPapers) relatedIds.add(rp.leadAuthorId);
    for (const o of mappedOffers) relatedIds.add(o.studentUserId);
  } else {
    for (const p of mappedProjects) {
      for (const e of p.endorsements) relatedIds.add(e.alumniUserId);
    }
    for (const rp of mappedPapers) {
      for (const e of rp.endorsements) relatedIds.add(e.alumniUserId);
    }
    for (const o of mappedOffers) {
      if (o.referringAlumniId) relatedIds.add(o.referringAlumniId);
    }
  }
  relatedIds.delete(targetUser.id);

  const mentorsOrMentees = Array.from(relatedIds)
    .map((id) => userById.get(id))
    .filter((u): u is SessionUser => Boolean(u));

  const academics =
    targetRow.studentProfile?.academicsJson &&
    Object.keys(targetRow.studentProfile.academicsJson).length > 0
      ? (targetRow.studentProfile.academicsJson as unknown as StudentAcademicExtra)
      : null;

  const career =
    targetRow.alumniProfile?.careerJson &&
    Object.keys(targetRow.alumniProfile.careerJson).length > 0
      ? (targetRow.alumniProfile.careerJson as unknown as AlumniCareerExtra)
      : null;

  return {
    found: true,
    data: {
      user: targetUser,
      academics,
      career,
      projects: mappedProjects,
      papers: mappedPapers,
      offers: mappedOffers,
      mentorsOrMentees,
      isFollowedByMe,
      followersCount,
    },
  };
}

function getPublicProfileFromFallback(
  handleOrIdOrName: string,
  viewerUserId?: string | null,
): PublicProfileDTO | null {
  const store = getFallbackStore();
  const targetUser = store.users.find((u) =>
    matchesUserIdentifier(u, handleOrIdOrName),
  );
  if (!targetUser) {
    return null;
  }

  const userById = new Map(store.users.map((u) => [u.id, u]));

  const projectsList =
    targetUser.role === 'alumni'
      ? store.projects.filter((p) =>
          p.endorsements.some((e) => e.alumniUserId === targetUser.id),
        )
      : store.projects.filter(
          (p) =>
            p.leadId === targetUser.id ||
            p.contributors.some(
              (c) =>
                c.userId === targetUser.id ||
                (Boolean(targetUser.regNo) && c.regNo === targetUser.regNo),
            ),
        );

  const papersList =
    targetUser.role === 'alumni'
      ? store.papers.filter((rp) =>
          rp.endorsements.some((e) => e.alumniUserId === targetUser.id),
        )
      : store.papers.filter(
          (rp) =>
            rp.leadAuthorId === targetUser.id ||
            rp.coAuthorName?.toLowerCase() === targetUser.fullName.toLowerCase(),
        );

  const offersList =
    targetUser.role === 'alumni'
      ? store.offers.filter((o) => o.referringAlumniId === targetUser.id)
      : store.offers.filter((o) => o.studentUserId === targetUser.id);

  const relatedIds = new Set<string>();
  for (const chat of store.coffeeChats) {
    if (chat.status !== 'accepted') continue;
    if (targetUser.role === 'alumni' && chat.alumniUserId === targetUser.id) {
      relatedIds.add(chat.studentUserId);
    }
    if (targetUser.role === 'student' && chat.studentUserId === targetUser.id) {
      relatedIds.add(chat.alumniUserId);
    }
  }

  if (targetUser.role === 'alumni') {
    for (const p of projectsList) relatedIds.add(p.leadId);
    for (const rp of papersList) relatedIds.add(rp.leadAuthorId);
    for (const o of offersList) relatedIds.add(o.studentUserId);
  } else {
    for (const p of projectsList) {
      for (const e of p.endorsements) relatedIds.add(e.alumniUserId);
    }
    for (const rp of papersList) {
      for (const e of rp.endorsements) relatedIds.add(e.alumniUserId);
    }
    for (const o of offersList) {
      if (o.referringAlumniId) relatedIds.add(o.referringAlumniId);
    }
  }
  relatedIds.delete(targetUser.id);

  const mentorsOrMentees = Array.from(relatedIds)
    .map((id) => userById.get(id))
    .filter((u): u is SessionUser => Boolean(u));

  let followersCount = 0;
  for (const set of Object.values(store.followingIdsByUser)) {
    if (set.has(targetUser.id)) {
      followersCount += 1;
    }
  }
  const isFollowedByMe = Boolean(
    viewerUserId && store.followingIdsByUser[viewerUserId]?.has(targetUser.id),
  );

  return {
    user: targetUser,
    academics: store.studentAcademicsByUserId[targetUser.id] ?? null,
    career: store.alumniCareerByUserId[targetUser.id] ?? null,
    projects: projectsList,
    papers: papersList,
    offers: offersList,
    mentorsOrMentees,
    isFollowedByMe,
    followersCount,
  };
}

/**
 * Resolves a public portfolio profile by user ID, legacy code, GitHub handle,
 * registration number, slug, or full name.
 */
export async function getPublicProfileQuery(
  handleOrIdOrName: string,
  viewerUserId?: string | null,
): Promise<PublicProfileDTO | null> {
  if (isDatabaseConfigured()) {
    try {
      const result = await getPublicProfileFromDb(
        handleOrIdOrName,
        viewerUserId,
      );
      if (result.found) {
        return result.data;
      }
    } catch {
      // Fall back to seeded store if DB is unreachable or unmigrated.
    }
  }

  return getPublicProfileFromFallback(handleOrIdOrName, viewerUserId);
}

function matchesSearchQuery(user: SessionUser, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const haystack = [
    user.fullName,
    user.headline,
    user.company ?? '',
    user.designation ?? '',
    user.branch ?? '',
    user.academicYear ?? '',
    user.regNo ?? '',
    user.legacyCode ?? '',
    user.batchYear ? String(user.batchYear) : '',
    ...user.techStack,
  ]
    .join(' ')
    .toLowerCase();

  return haystack.includes(q);
}

/**
 * Lists students and/or alumni in the campus network directory with
 * follow counts, follow state, and build/offer counts.
 */
export async function listNetworkDirectoryQuery(
  params: ListNetworkDirectoryParams = {},
): Promise<NetworkDirectoryEntry[]> {
  const { scope = 'all', q = '', viewerUserId = null } = params;

  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const userRows = await db
        .select({
          user: users,
          institutionSlug: institutions.slug,
          studentProfile: studentProfiles,
          alumniProfile: alumniProfiles,
        })
        .from(users)
        .leftJoin(institutions, eq(users.institutionId, institutions.id))
        .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
        .leftJoin(alumniProfiles, eq(users.id, alumniProfiles.userId));

      if (userRows.length > 0) {
        const [follows, allProjects, allPapers, allOffers] = await Promise.all([
          db.select().from(socialFollows),
          db
            .select({ id: projects.id, leadStudentId: projects.leadStudentId })
            .from(projects),
          db
            .select({
              id: researchPapers.id,
              leadAuthorId: researchPapers.leadAuthorId,
            })
            .from(researchPapers),
          db
            .select({
              id: placementOffers.id,
              studentUserId: placementOffers.studentUserId,
              referringAlumniId: placementOffers.referringAlumniId,
            })
            .from(placementOffers),
        ]);

        const followerCountByUser = new Map<string, number>();
        const viewerFollowing = new Set<string>();
        for (const f of follows) {
          followerCountByUser.set(
            f.followingUserId,
            (followerCountByUser.get(f.followingUserId) ?? 0) + 1,
          );
          if (viewerUserId && f.followerUserId === viewerUserId) {
            viewerFollowing.add(f.followingUserId);
          }
        }

        const projectCountByUser = new Map<string, number>();
        for (const p of allProjects) {
          projectCountByUser.set(
            p.leadStudentId,
            (projectCountByUser.get(p.leadStudentId) ?? 0) + 1,
          );
        }

        const paperCountByUser = new Map<string, number>();
        for (const rp of allPapers) {
          paperCountByUser.set(
            rp.leadAuthorId,
            (paperCountByUser.get(rp.leadAuthorId) ?? 0) + 1,
          );
        }

        const offerCountByUser = new Map<string, number>();
        for (const o of allOffers) {
          offerCountByUser.set(
            o.studentUserId,
            (offerCountByUser.get(o.studentUserId) ?? 0) + 1,
          );
          if (o.referringAlumniId) {
            offerCountByUser.set(
              o.referringAlumniId,
              (offerCountByUser.get(o.referringAlumniId) ?? 0) + 1,
            );
          }
        }

        return userRows
          .map(mapDbRecordToSessionUser)
          .filter((u) => {
            if (u.role === 'dean') return false;
            if (scope === 'students' && u.role !== 'student') return false;
            if (scope === 'alumni' && u.role !== 'alumni') return false;
            return matchesSearchQuery(u, q);
          })
          .map((u) => ({
            user: u,
            isFollowedByMe: viewerFollowing.has(u.id),
            followersCount: followerCountByUser.get(u.id) ?? 0,
            projectsCount: projectCountByUser.get(u.id) ?? 0,
            papersCount: paperCountByUser.get(u.id) ?? 0,
            offersCount: offerCountByUser.get(u.id) ?? 0,
          }));
      }
    } catch {
      // Fall back to in-memory store if DB is unreachable or unmigrated.
    }
  }

  const store = getFallbackStore();
  const followerCountByUser = new Map<string, number>();
  for (const followingSet of Object.values(store.followingIdsByUser)) {
    for (const targetId of followingSet) {
      followerCountByUser.set(
        targetId,
        (followerCountByUser.get(targetId) ?? 0) + 1,
      );
    }
  }
  const viewerFollowing = viewerUserId
    ? store.followingIdsByUser[viewerUserId] ?? new Set<string>()
    : new Set<string>();

  return store.users
    .filter((u) => {
      if (u.role === 'dean') return false;
      if (scope === 'students' && u.role !== 'student') return false;
      if (scope === 'alumni' && u.role !== 'alumni') return false;
      return matchesSearchQuery(u, q);
    })
    .map((u) => {
      const projectsCount =
        u.role === 'alumni'
          ? store.projects.filter((p) =>
              p.endorsements.some((e) => e.alumniUserId === u.id),
            ).length
          : store.projects.filter(
              (p) =>
                p.leadId === u.id ||
                p.contributors.some((c) => c.userId === u.id),
            ).length;

      const papersCount =
        u.role === 'alumni'
          ? store.papers.filter((rp) =>
              rp.endorsements.some((e) => e.alumniUserId === u.id),
            ).length
          : store.papers.filter((rp) => rp.leadAuthorId === u.id).length;

      const offersCount =
        u.role === 'alumni'
          ? store.offers.filter((o) => o.referringAlumniId === u.id).length
          : store.offers.filter((o) => o.studentUserId === u.id).length;

      return {
        user: u,
        isFollowedByMe: viewerFollowing.has(u.id),
        followersCount: followerCountByUser.get(u.id) ?? 0,
        projectsCount,
        papersCount,
        offersCount,
      };
    });
}
