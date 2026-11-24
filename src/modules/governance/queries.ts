import { desc, eq, sql } from 'drizzle-orm';
import { getFallbackStore } from '@/db/fallbackStore';
import { getDb, isDatabaseConfigured } from '@/db/index';
import {
  alumniProfiles,
  alumniVerificationRequests,
  institutionalAuditLogs,
  placementOffers,
  projects,
  studentProfiles,
  users,
} from '@/db/schema';
import type {
  DeanAnalyticsDTO,
  InstitutionalAuditLogDTO,
  PlacementOfferDTO,
  VerificationRequestDTO,
} from '@/types/domain';

interface KpiViewRow {
  institution_id: string;
  total_students: number;
  total_alumni: number;
  verified_alumni_count: number;
  pending_verifications_count: number;
  total_projects: number;
  total_papers: number;
  total_openings: number;
  total_offers: number;
  ppo_count: number;
  internship_count: number;
  avg_cgpa: number;
  total_alum_exp_years: number;
}

interface LeaderboardViewRow {
  institution_id: string;
  entity_type: 'student' | 'alumni';
  user_id: string;
  code: string;
  full_name: string;
  avatar_url: string;
  branch: string | null;
  academic_year: string | null;
  cgpa: number | null;
  company: string | null;
  designation: string | null;
  batch_year: number | null;
  projects_count: number;
  papers_count: number;
  openings_count: number;
  endorsed_count: number;
  impact_score: number;
}

function getFallbackAnalytics(): DeanAnalyticsDTO {
  const store = getFallbackStore();

  const students = store.users.filter((u) => u.role === 'student');
  const alumni = store.users.filter((u) => u.role === 'alumni');
  const verifiedAlumni = alumni.filter(
    (u) => u.verificationStatus === 'verified',
  );
  const pendingVerificationsCount = store.verificationRequests.filter(
    (r) => r.status === 'pending',
  ).length;

  const ppoCount = store.offers.filter((o) => o.offerType === 'PPO').length;
  const internshipCount = store.offers.filter(
    (o) => o.offerType === 'Internship',
  ).length;

  const cgpaValues = students
    .map((s) => s.cgpa)
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));
  const avgCgpa =
    cgpaValues.length > 0
      ? (
          cgpaValues.reduce((acc, v) => acc + v, 0) / cgpaValues.length
        ).toFixed(2)
      : '0.00';

  const totalAlumExpYears = alumni.reduce(
    (acc, a) => acc + (a.totalExpYears ?? 0),
    0,
  );

  const branchCounts = new Map<string, number>();
  for (const s of students) {
    const branch = s.branch || 'CSE';
    branchCounts.set(branch, (branchCounts.get(branch) ?? 0) + 1);
  }
  const branchBreakdown = Array.from(branchCounts.entries())
    .map(([branch, count]) => ({ branch, count }))
    .sort((a, b) => b.count - a.count);

  const domainCounts = new Map<string, number>();
  for (const p of store.projects) {
    domainCounts.set(p.domain, (domainCounts.get(p.domain) ?? 0) + 1);
  }
  for (const rp of store.papers) {
    domainCounts.set(rp.domain, (domainCounts.get(rp.domain) ?? 0) + 1);
  }
  const domainBreakdown = Array.from(domainCounts.entries())
    .map(([domain, count]) => ({ domain, count }))
    .sort((a, b) => b.count - a.count);

  const offerByStudentId = new Map<string, PlacementOfferDTO>();
  for (const offer of store.offers) {
    if (!offerByStudentId.has(offer.studentUserId)) {
      offerByStudentId.set(offer.studentUserId, offer);
    }
  }

  const topStudents = students
    .map((s) => {
      const projectsCount = store.projects.filter(
        (p) => p.leadId === s.id,
      ).length;
      const papersCount = store.papers.filter(
        (rp) =>
          rp.leadAuthorId === s.id ||
          rp.coAuthorName?.toLowerCase() === s.fullName.toLowerCase(),
      ).length;
      const cgpa = s.cgpa ?? 8.5;
      const score =
        Math.round((cgpa * 10 + projectsCount * 12 + papersCount * 20) * 10) /
        10;
      const offer = offerByStudentId.get(s.id);
      return {
        userId: s.id,
        code: s.legacyCode ?? s.id,
        name: s.fullName,
        branch: s.branch ?? 'CSE',
        academicYear: s.academicYear ?? '4th Year',
        cgpa,
        projectsCount,
        papersCount,
        score,
        offerLabel: offer ? `${offer.company} • ${offer.packageStr}` : null,
        avatarUrl: s.avatarUrl,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const topAlumni = verifiedAlumni
    .map((a) => {
      const openingsCount = store.jobs.filter(
        (j) => j.postedByAlumniId === a.id && j.status === 'open',
      ).length;
      const mentoredCount = store.coffeeChats.filter(
        (c) => c.alumniUserId === a.id && c.status === 'accepted',
      ).length;
      const endorsedCount = store.endorsements.filter(
        (e) => e.alumniUserId === a.id,
      ).length;
      const impactScore =
        openingsCount * 15 + endorsedCount * 18 + mentoredCount * 10;

      return {
        userId: a.id,
        code: a.legacyCode ?? a.id,
        name: a.fullName,
        company: a.company ?? 'Partner Org',
        designation: a.designation ?? 'Mentor',
        batchYear: a.batchYear ?? 2018,
        openingsCount,
        mentoredCount,
        endorsedCount,
        impactScore,
        avatarUrl: a.avatarUrl,
      };
    })
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 10);

  return {
    totalStudents: students.length,
    totalAlumni: alumni.length,
    verifiedAlumniCount: verifiedAlumni.length,
    pendingVerificationsCount,
    totalProjects: store.projects.length,
    totalPapers: store.papers.length,
    totalOpenings: store.jobs.filter((j) => j.status === 'open').length,
    totalOffers: store.offers.length,
    ppoCount,
    internshipCount,
    avgCgpa,
    totalAlumExpYears,
    branchBreakdown,
    domainBreakdown,
    topStudents,
    topAlumni,
  };
}

/**
 * Returns institutional analytics for the Dean & T&P Governance Portal.
 * Reads `mv_institution_placement_kpis` and `mv_campus_leaderboards` when PostgreSQL
 * is configured, or computes equivalent KPIs from the seeded fallback store.
 */
export async function getDeanAnalyticsQuery(): Promise<DeanAnalyticsDTO> {
  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const kpiResult = await db.execute(
        sql`SELECT * FROM public.mv_institution_placement_kpis LIMIT 1`,
      );
      const kpiRow = (kpiResult as unknown as KpiViewRow[])[0];

      if (kpiRow) {
        const [
          leaderboardRows,
          branchRows,
          domainRows,
          offerRows,
          acceptedChatsResult,
        ] = await Promise.all([
          db.execute(
            sql`SELECT * FROM public.mv_campus_leaderboards WHERE institution_id = ${kpiRow.institution_id} ORDER BY impact_score DESC`,
          ),
          db
            .select({ branch: studentProfiles.branch })
            .from(studentProfiles),
          db.select({ domain: projects.domain }).from(projects),
          db.select().from(placementOffers),
          db.execute(
            sql`SELECT alumni_user_id, count(*)::int AS mentored_count FROM public.coffee_chat_requests WHERE status = 'accepted' GROUP BY alumni_user_id`,
          ),
        ]);

        const branchCounts = new Map<string, number>();
        for (const r of branchRows) {
          branchCounts.set(r.branch, (branchCounts.get(r.branch) ?? 0) + 1);
        }
        const branchBreakdown = Array.from(branchCounts.entries())
          .map(([branch, count]) => ({ branch, count }))
          .sort((a, b) => b.count - a.count);

        const domainCounts = new Map<string, number>();
        for (const r of domainRows) {
          domainCounts.set(r.domain, (domainCounts.get(r.domain) ?? 0) + 1);
        }
        const domainBreakdown = Array.from(domainCounts.entries())
          .map(([domain, count]) => ({ domain, count }))
          .sort((a, b) => b.count - a.count);

        const offerByStudent = new Map<string, string>();
        for (const o of offerRows) {
          if (!offerByStudent.has(o.studentUserId)) {
            offerByStudent.set(o.studentUserId, `${o.company} • ${o.packageStr}`);
          }
        }

        const mentoredByAlum = new Map<string, number>();
        for (const row of acceptedChatsResult as unknown as Array<{
          alumni_user_id: string;
          mentored_count: number;
        }>) {
          mentoredByAlum.set(row.alumni_user_id, Number(row.mentored_count) || 0);
        }

        const typedLeaderboard = leaderboardRows as unknown as LeaderboardViewRow[];

        const topStudents = typedLeaderboard
          .filter((r) => r.entity_type === 'student')
          .slice(0, 10)
          .map((r) => ({
            userId: r.user_id,
            code: r.code,
            name: r.full_name,
            branch: r.branch ?? 'CSE',
            academicYear: r.academic_year ?? '4th Year',
            cgpa: Number(r.cgpa ?? 8.5),
            projectsCount: Number(r.projects_count ?? 0),
            papersCount: Number(r.papers_count ?? 0),
            score: Math.round(Number(r.impact_score ?? 0) * 10) / 10,
            offerLabel: offerByStudent.get(r.user_id) ?? null,
            avatarUrl: r.avatar_url,
          }));

        const topAlumni = typedLeaderboard
          .filter((r) => r.entity_type === 'alumni')
          .slice(0, 10)
          .map((r) => ({
            userId: r.user_id,
            code: r.code,
            name: r.full_name,
            company: r.company ?? 'Partner Org',
            designation: r.designation ?? 'Mentor',
            batchYear: Number(r.batch_year ?? 2018),
            openingsCount: Number(r.openings_count ?? 0),
            mentoredCount: mentoredByAlum.get(r.user_id) ?? 0,
            endorsedCount: Number(r.endorsed_count ?? 0),
            impactScore: Math.round(Number(r.impact_score ?? 0) * 10) / 10,
            avatarUrl: r.avatar_url,
          }));

        return {
          totalStudents: Number(kpiRow.total_students ?? 0),
          totalAlumni: Number(kpiRow.total_alumni ?? 0),
          verifiedAlumniCount: Number(kpiRow.verified_alumni_count ?? 0),
          pendingVerificationsCount: Number(
            kpiRow.pending_verifications_count ?? 0,
          ),
          totalProjects: Number(kpiRow.total_projects ?? 0),
          totalPapers: Number(kpiRow.total_papers ?? 0),
          totalOpenings: Number(kpiRow.total_openings ?? 0),
          totalOffers: Number(kpiRow.total_offers ?? 0),
          ppoCount: Number(kpiRow.ppo_count ?? 0),
          internshipCount: Number(kpiRow.internship_count ?? 0),
          avgCgpa: Number(kpiRow.avg_cgpa ?? 0).toFixed(2),
          totalAlumExpYears: Number(kpiRow.total_alum_exp_years ?? 0),
          branchBreakdown,
          domainBreakdown,
          topStudents,
          topAlumni,
        };
      }
    } catch {
      // Fall back to computed fallback analytics when DB/views are unavailable.
    }
  }

  return getFallbackAnalytics();
}

/** Lists alumni verification requests for the Dean queue, optionally filtered by status. */
export async function listVerificationRequestsQuery(
  status: 'all' | 'pending' | 'approved' | 'rejected' = 'all',
): Promise<VerificationRequestDTO[]> {
  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const rows = await db
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
        .leftJoin(
          alumniProfiles,
          eq(users.id, alumniProfiles.userId),
        )
        .orderBy(desc(alumniVerificationRequests.createdAt));

      if (rows.length > 0) {
        const mapped: VerificationRequestDTO[] = rows.map((r) => ({
          id: r.req.id,
          alumniUserId: r.req.alumniUserId,
          alumniName: r.alumniName,
          alumniEmail: r.alumniEmail,
          alumniAvatar: r.alumniAvatar,
          batchYear: r.batchYear ?? 2019,
          company: r.req.company,
          designation: r.designation ?? 'Alumni Mentor',
          workEmail: r.req.workEmail,
          linkedinUrl: r.req.linkedinUrl,
          domainAutoMatched: r.req.domainAutoMatched,
          proofNote: r.req.proofNote,
          status: r.req.status,
          reviewedByDeanId: r.req.reviewedByDeanId ?? null,
          reviewNote: r.req.reviewNote ?? null,
          createdAt: r.req.createdAt.toISOString(),
          reviewedAt: r.req.reviewedAt?.toISOString() ?? null,
        }));
        return status === 'all'
          ? mapped
          : mapped.filter((item) => item.status === status);
      }
    } catch {
      // Fall through to fallback store.
    }
  }

  const store = getFallbackStore();
  const sorted = [...store.verificationRequests].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  return status === 'all'
    ? sorted
    : sorted.filter((item) => item.status === status);
}

/** Lists verified/pending placement offers, optionally filtered by offerType. */
export async function listPlacementOffersQuery(
  offerType: 'All' | 'PPO' | 'Internship' = 'All',
): Promise<PlacementOfferDTO[]> {
  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const [offerRows, allUsers] = await Promise.all([
        db
          .select()
          .from(placementOffers)
          .orderBy(desc(placementOffers.createdAt)),
        db
          .select({ id: users.id, fullName: users.fullName })
          .from(users),
      ]);

      if (offerRows.length > 0) {
        const nameById = new Map(allUsers.map((u) => [u.id, u.fullName]));
        const mapped: PlacementOfferDTO[] = offerRows.map((o) => ({
          id: o.id,
          code: o.code,
          studentUserId: o.studentUserId,
          studentName: nameById.get(o.studentUserId) ?? 'Student',
          academicYearBranch: o.academicYearBranch,
          company: o.company,
          jobRole: o.jobRole,
          packageStr: o.packageStr,
          packageLpa: o.packageLpa,
          offerType: o.offerType,
          referringAlumniId: o.referringAlumniId ?? null,
          referringAlumniName: o.referringAlumniId
            ? (nameById.get(o.referringAlumniId) ?? null)
            : null,
          status: o.status,
          verifiedByDean: o.verifiedByDean,
          createdAt: o.createdAt.toISOString(),
        }));
        return offerType === 'All'
          ? mapped
          : mapped.filter((o) => o.offerType === offerType);
      }
    } catch {
      // Fall through to fallback store.
    }
  }

  const store = getFallbackStore();
  const sorted = [...store.offers].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
  return offerType === 'All'
    ? sorted
    : sorted.filter((o) => o.offerType === offerType);
}

/** Lists institutional governance audit logs ordered newest first. */
export async function listAuditLogsQuery(): Promise<
  InstitutionalAuditLogDTO[]
> {
  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const rows = await db
        .select()
        .from(institutionalAuditLogs)
        .orderBy(desc(institutionalAuditLogs.createdAt));

      if (rows.length > 0) {
        return rows.map((row) => ({
          id: row.id,
          actorUserId: row.actorUserId,
          actorName: row.actorName,
          category: row.category,
          title: row.title,
          impact: row.impact,
          createdAt: row.createdAt.toISOString(),
        }));
      }
    } catch {
      // Fall through to fallback store.
    }
  }

  const store = getFallbackStore();
  return [...store.auditLogs].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}

function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvLine(
  cells: Array<string | number | boolean | null | undefined>,
): string {
  return cells.map(escapeCsvCell).join(',');
}

/**
 * Builds an RFC-4180 escaped CSV report spanning students, alumni,
 * placement offers, and alumni verification requests.
 */
export async function buildDeanCsvReport(): Promise<string> {
  const [offers, verifications] = await Promise.all([
    listPlacementOffersQuery('All'),
    listVerificationRequestsQuery('all'),
  ]);

  let rosterUsers: Array<{
    code: string;
    fullName: string;
    email: string;
    role: string;
    orgOrBranch: string;
    status: string;
    metric: string;
  }> = [];

  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const rows = await db
        .select({
          user: users,
          student: studentProfiles,
          alumni: alumniProfiles,
        })
        .from(users)
        .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
        .leftJoin(alumniProfiles, eq(users.id, alumniProfiles.userId));

      if (rows.length > 0) {
        rosterUsers = rows
          .filter((r) => r.user.role !== 'dean')
          .map((r) => ({
            code: r.user.legacyCode ?? r.user.id,
            fullName: r.user.fullName,
            email: r.user.email,
            role: r.user.role.toUpperCase(),
            orgOrBranch:
              r.user.role === 'alumni'
                ? `${r.alumni?.company ?? ''} (${r.alumni?.designation ?? ''})`
                : `${r.student?.academicYear ?? ''} ${r.student?.branch ?? ''}`,
            status: r.user.verificationStatus,
            metric:
              r.user.role === 'alumni'
                ? `Batch ${r.alumni?.batchYear ?? ''}`
                : `Reg ${r.student?.regNo ?? ''} | CGPA ${r.student?.cgpa ?? ''}`,
          }));
      }
    } catch {
      // Fall through to fallback store.
    }
  }

  if (rosterUsers.length === 0) {
    const store = getFallbackStore();
    rosterUsers = store.users
      .filter((u) => u.role !== 'dean')
      .map((u) => ({
        code: u.legacyCode ?? u.id,
        fullName: u.fullName,
        email: u.email,
        role: u.role.toUpperCase(),
        orgOrBranch:
          u.role === 'alumni'
            ? `${u.company ?? ''} (${u.designation ?? ''})`
            : `${u.academicYear ?? ''} ${u.branch ?? ''}`,
        status: u.verificationStatus,
        metric:
          u.role === 'alumni'
            ? `Batch ${u.batchYear ?? ''}`
            : `Reg ${u.regNo ?? ''} | CGPA ${u.cgpa ?? ''}`,
      }));
  }

  const lines: string[] = [
    toCsvLine([
      'RecordType',
      'CodeOrID',
      'Name',
      'EmailOrPartner',
      'DepartmentOrCompany',
      'Status',
      'MetricOrPackage',
      'NotesOrTimestamp',
    ]),
  ];

  for (const row of rosterUsers) {
    lines.push(
      toCsvLine([
        row.role,
        row.code,
        row.fullName,
        row.email,
        row.orgOrBranch,
        row.status,
        row.metric,
        'Campus Roster',
      ]),
    );
  }

  for (const offer of offers) {
    lines.push(
      toCsvLine([
        'PLACEMENT_OFFER',
        offer.code,
        offer.studentName,
        offer.referringAlumniName ?? 'Campus Drive',
        `${offer.company} - ${offer.jobRole}`,
        offer.verifiedByDean ? `${offer.status} (Dean Verified)` : offer.status,
        `${offer.offerType} | ${offer.packageStr}`,
        offer.createdAt,
      ]),
    );
  }

  for (const verif of verifications) {
    lines.push(
      toCsvLine([
        'ALUMNI_VERIFICATION',
        verif.id,
        verif.alumniName,
        verif.workEmail || verif.alumniEmail,
        `${verif.company} - ${verif.designation}`,
        verif.status,
        verif.domainAutoMatched ? 'Corporate Domain Matched' : 'Manual Review',
        verif.reviewNote ?? verif.proofNote,
      ]),
    );
  }

  return lines.join('\r\n');
}
