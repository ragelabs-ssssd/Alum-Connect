import { and, desc, eq, ne, or, sql } from 'drizzle-orm';
import { getDb, isDatabaseConfigured } from '@/db';
import { getFallbackStore } from '@/db/fallbackStore';
import {
  alumniProfiles,
  jobPostings,
  projects,
  researchPapers,
  studentProfiles,
  users,
} from '@/db/schema';
import type { SearchHitDTO } from '@/types/domain';

export type SearchScope = 'all' | 'students' | 'alumni' | 'builds' | 'jobs';

export interface UnifiedSearchInput {
  q: string;
  scope?: SearchScope;
  limit?: number;
}

interface ScoredHit {
  score: number;
  hit: SearchHitDTO;
}

function scoreTextMatch(
  query: string,
  primary: string,
  secondary: string[],
  tertiary: string[]
): number {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(Boolean);
  let score = 0;

  const pLower = primary.toLowerCase();
  if (pLower === q) score += 120;
  else if (pLower.startsWith(q)) score += 80;
  else if (pLower.includes(q)) score += 50;

  const secText = secondary.join(' ').toLowerCase();
  const terText = tertiary.join(' ').toLowerCase();

  for (const token of tokens) {
    if (pLower.includes(token)) score += 24;
    if (secText.includes(token)) score += 16;
    if (terText.includes(token)) score += 8;
  }

  return score;
}

/**
 * Unified search across Students, Alumni, Projects/Papers ("builds"), and Job Postings.
 * Uses weighted PostgreSQL FTS + trigram ranking when DATABASE_URL is configured,
 * and deterministic multi-field scoring over `getFallbackStore()` otherwise.
 */
export async function unifiedSearchQuery(
  input: UnifiedSearchInput
): Promise<SearchHitDTO[]> {
  const q = input.q.trim();
  if (!q) return [];

  const scope: SearchScope = input.scope ?? 'all';
  const limit = Math.min(40, Math.max(1, input.limit ?? 12));

  if (isDatabaseConfigured()) {
    const db = getDb();
    const pattern = `%${q}%`;
    const perBucketLimit = Math.max(4, Math.ceil(limit / 2));
    const scoredHits: ScoredHit[] = [];

    const tasks: Promise<void>[] = [];

    if (scope === 'all' || scope === 'students') {
      tasks.push(
        (async () => {
          const rows = await db
            .select({
              user: users,
              profile: studentProfiles,
              rank: sql<number>`(
                ts_rank(
                  setweight(to_tsvector('english', coalesce(${users.fullName}, '')), 'A') ||
                  setweight(to_tsvector('english', coalesce(${studentProfiles.branch}, '')), 'B') ||
                  setweight(to_tsvector('english', array_to_string(${studentProfiles.techStack}, ' ')), 'B'),
                  plainto_tsquery('english', ${q})
                ) + coalesce(similarity(${users.fullName}, ${q}), 0)
              )`,
            })
            .from(users)
            .innerJoin(studentProfiles, eq(users.id, studentProfiles.userId))
            .where(
              and(
                eq(users.role, 'student'),
                or(
                  sql`${users.fullName} ILIKE ${pattern}`,
                  sql`${studentProfiles.regNo} ILIKE ${pattern}`,
                  sql`${studentProfiles.branch} ILIKE ${pattern}`,
                  sql`array_to_string(${studentProfiles.techStack}, ' ') ILIKE ${pattern}`,
                  sql`${studentProfiles.bio} ILIKE ${pattern}`
                )
              )
            )
            .orderBy(desc(sql`1`))
            .limit(perBucketLimit);

          for (const row of rows) {
            scoredHits.push({
              score: Number(row.rank ?? 0) * 100 + 20,
              hit: {
                kind: 'student',
                id: row.user.id,
                title: row.user.fullName,
                subtitle: `${row.profile.academicYear} ${row.profile.branch} • CGPA ${row.profile.cgpa.toFixed(2)}`,
                href: `/student?highlight=${encodeURIComponent(row.user.id)}`,
                avatarUrl: row.user.avatarUrl,
                badge: row.profile.branch,
              },
            });
          }
        })()
      );
    }

    if (scope === 'all' || scope === 'alumni') {
      tasks.push(
        (async () => {
          const rows = await db
            .select({
              user: users,
              profile: alumniProfiles,
              rank: sql<number>`(
                ts_rank(
                  setweight(to_tsvector('english', coalesce(${users.fullName}, '')), 'A') ||
                  setweight(to_tsvector('english', coalesce(${alumniProfiles.company}, '')), 'A') ||
                  setweight(to_tsvector('english', array_to_string(${alumniProfiles.techStackExpertise}, ' ')), 'B'),
                  plainto_tsquery('english', ${q})
                ) + coalesce(similarity(${users.fullName}, ${q}), 0)
              )`,
            })
            .from(users)
            .innerJoin(alumniProfiles, eq(users.id, alumniProfiles.userId))
            .where(
              and(
                eq(users.role, 'alumni'),
                eq(users.verificationStatus, 'verified'),
                or(
                  sql`${users.fullName} ILIKE ${pattern}`,
                  sql`${alumniProfiles.company} ILIKE ${pattern}`,
                  sql`${alumniProfiles.designation} ILIKE ${pattern}`,
                  sql`array_to_string(${alumniProfiles.techStackExpertise}, ' ') ILIKE ${pattern}`
                )
              )
            )
            .orderBy(desc(sql`1`))
            .limit(perBucketLimit);

          for (const row of rows) {
            scoredHits.push({
              score: Number(row.rank ?? 0) * 100 + 20,
              hit: {
                kind: 'alumni',
                id: row.user.id,
                title: row.user.fullName,
                subtitle: `${row.profile.designation} @ ${row.profile.company}`,
                href: `/alumni?highlight=${encodeURIComponent(row.user.id)}`,
                avatarUrl: row.user.avatarUrl,
                badge: `Batch '${String(row.profile.batchYear).slice(-2)}`,
              },
            });
          }
        })()
      );
    }

    if (scope === 'all' || scope === 'builds') {
      tasks.push(
        (async () => {
          const [projRows, paperRows] = await Promise.all([
            db
              .select({
                project: projects,
                leadAvatar: users.avatarUrl,
              })
              .from(projects)
              .innerJoin(users, eq(projects.leadStudentId, users.id))
              .where(
                and(
                  ne(projects.status, 'draft'),
                  or(
                    sql`${projects.name} ILIKE ${pattern}`,
                    sql`${projects.pitch} ILIKE ${pattern}`,
                    sql`${projects.domain} ILIKE ${pattern}`,
                    sql`${projects.code} ILIKE ${pattern}`,
                    sql`array_to_string(${projects.techStack}, ' ') ILIKE ${pattern}`
                  )
                )
              )
              .orderBy(desc(projects.likesCount))
              .limit(perBucketLimit),
            db
              .select({
                paper: researchPapers,
                leadAvatar: users.avatarUrl,
              })
              .from(researchPapers)
              .innerJoin(users, eq(researchPapers.leadAuthorId, users.id))
              .where(
                and(
                  ne(researchPapers.status, 'Draft'),
                  or(
                    sql`${researchPapers.topic} ILIKE ${pattern}`,
                    sql`${researchPapers.domain} ILIKE ${pattern}`,
                    sql`${researchPapers.venue} ILIKE ${pattern}`,
                    sql`${researchPapers.code} ILIKE ${pattern}`,
                    sql`array_to_string(${researchPapers.techStack}, ' ') ILIKE ${pattern}`
                  )
                )
              )
              .orderBy(desc(researchPapers.likesCount))
              .limit(perBucketLimit),
          ]);

          for (const row of projRows) {
            scoredHits.push({
              score:
                scoreTextMatch(
                  q,
                  row.project.name,
                  [row.project.code, row.project.domain, ...row.project.techStack],
                  [row.project.pitch, row.project.shortDesc]
                ) + 10,
              hit: {
                kind: 'project',
                id: row.project.id,
                title: row.project.name,
                subtitle: `${row.project.domain} • ${row.project.techStack.slice(0, 3).join(', ')}`,
                href: `/projects/${row.project.slug}`,
                avatarUrl: row.leadAvatar,
                badge: row.project.code,
              },
            });
          }

          for (const row of paperRows) {
            scoredHits.push({
              score:
                scoreTextMatch(
                  q,
                  row.paper.topic,
                  [row.paper.code, row.paper.venue, row.paper.domain, ...row.paper.techStack],
                  [row.paper.abstract]
                ) + 10,
              hit: {
                kind: 'paper',
                id: row.paper.id,
                title: row.paper.topic,
                subtitle: `${row.paper.venue} • ${row.paper.domain}`,
                href: `/projects/${row.paper.slug}`,
                avatarUrl: row.leadAvatar,
                badge: row.paper.code,
              },
            });
          }
        })()
      );
    }

    if (scope === 'all' || scope === 'jobs') {
      tasks.push(
        (async () => {
          const rows = await db
            .select({
              job: jobPostings,
              alumAvatar: users.avatarUrl,
            })
            .from(jobPostings)
            .innerJoin(users, eq(jobPostings.postedByAlumniId, users.id))
            .where(
              and(
                eq(jobPostings.status, 'open'),
                or(
                  sql`${jobPostings.roleTitle} ILIKE ${pattern}`,
                  sql`${jobPostings.company} ILIKE ${pattern}`,
                  sql`${jobPostings.location} ILIKE ${pattern}`,
                  sql`array_to_string(${jobPostings.skillsRequired}, ' ') ILIKE ${pattern}`
                )
              )
            )
            .orderBy(desc(jobPostings.createdAt))
            .limit(perBucketLimit);

          for (const row of rows) {
            scoredHits.push({
              score: scoreTextMatch(
                q,
                row.job.roleTitle,
                [row.job.company, row.job.jobType, ...row.job.skillsRequired],
                [row.job.location, row.job.compensation]
              ),
              hit: {
                kind: 'job',
                id: row.job.id,
                title: row.job.roleTitle,
                subtitle: `${row.job.company} • ${row.job.compensation}`,
                href: `/student?tab=jobs&q=${encodeURIComponent(row.job.roleTitle)}`,
                avatarUrl: row.alumAvatar,
                badge: row.job.jobType,
              },
            });
          }
        })()
      );
    }

    await Promise.all(tasks);

    return scoredHits
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.hit);
  }

  // Fallback Mode
  const store = getFallbackStore();
  const scored: ScoredHit[] = [];

  if (scope === 'all' || scope === 'students') {
    for (const user of store.users) {
      if (user.role !== 'student') continue;
      const score = scoreTextMatch(
        q,
        user.fullName,
        [user.regNo ?? '', user.branch ?? '', user.academicYear ?? '', ...user.techStack],
        [user.headline, user.bio ?? '']
      );
      if (score > 0) {
        scored.push({
          score,
          hit: {
            kind: 'student',
            id: user.id,
            title: user.fullName,
            subtitle: `${user.academicYear ?? 'Student'} ${user.branch ?? ''} • CGPA ${(user.cgpa ?? 8.9).toFixed(2)}`,
            href: `/student?highlight=${encodeURIComponent(user.id)}`,
            avatarUrl: user.avatarUrl,
            badge: user.branch ?? 'ITER',
          },
        });
      }
    }
  }

  if (scope === 'all' || scope === 'alumni') {
    for (const user of store.users) {
      if (user.role !== 'alumni' || user.verificationStatus !== 'verified') {
        continue;
      }
      const score = scoreTextMatch(
        q,
        user.fullName,
        [user.company ?? '', user.designation ?? '', ...user.techStack],
        [user.mentorshipScope ?? '', user.headline]
      );
      if (score > 0) {
        scored.push({
          score,
          hit: {
            kind: 'alumni',
            id: user.id,
            title: user.fullName,
            subtitle: `${user.designation ?? 'Alumni'} @ ${user.company ?? 'Partner'}`,
            href: `/alumni?highlight=${encodeURIComponent(user.id)}`,
            avatarUrl: user.avatarUrl,
            badge: user.batchYear
              ? `Batch '${String(user.batchYear).slice(-2)}`
              : 'Alumni',
          },
        });
      }
    }
  }

  if (scope === 'all' || scope === 'builds') {
    for (const proj of store.projects) {
      if (proj.status === 'draft') continue;
      const score = scoreTextMatch(
        q,
        proj.title,
        [proj.code, proj.domain, proj.leadName, ...proj.techStack],
        [proj.subtitle, proj.shortDesc, proj.story]
      );
      if (score > 0) {
        scored.push({
          score,
          hit: {
            kind: 'project',
            id: proj.id,
            title: proj.title,
            subtitle: `${proj.domain} • ${proj.techStack.slice(0, 3).join(', ')}`,
            href: `/projects/${proj.slug}`,
            avatarUrl: proj.authorAvatar,
            badge: proj.code,
          },
        });
      }
    }

    for (const paper of store.papers) {
      if (paper.paperStatus === 'Draft') continue;
      const score = scoreTextMatch(
        q,
        paper.title,
        [paper.code, paper.venue, paper.domain, paper.leadAuthorName, ...paper.techStack],
        [paper.story]
      );
      if (score > 0) {
        scored.push({
          score,
          hit: {
            kind: 'paper',
            id: paper.id,
            title: paper.title,
            subtitle: `${paper.venue} • ${paper.domain}`,
            href: `/projects/${paper.slug}`,
            avatarUrl: paper.authorAvatar,
            badge: paper.code,
          },
        });
      }
    }
  }

  if (scope === 'all' || scope === 'jobs') {
    for (const job of store.jobs) {
      if (job.status !== 'open') continue;
      const score = scoreTextMatch(
        q,
        job.roleTitle,
        [job.company, job.jobType, ...job.skillsRequired],
        [job.location, job.compensation, job.eligibility]
      );
      if (score > 0) {
        scored.push({
          score,
          hit: {
            kind: 'job',
            id: job.id,
            title: job.roleTitle,
            subtitle: `${job.company} • ${job.compensation}`,
            href: `/student?tab=jobs&q=${encodeURIComponent(job.roleTitle)}`,
            avatarUrl: job.alumniAvatar,
            badge: job.jobType,
          },
        });
      }
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.hit);
}
