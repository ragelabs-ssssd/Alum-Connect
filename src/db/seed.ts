import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { getFallbackStore } from './fallbackStore';
import * as schema from './schema';

export interface SeedSummary {
  skipped: boolean;
  reason?: string;
  institutionId?: string;
  usersCount?: number;
  projectsCount?: number;
  papersCount?: number;
  jobsCount?: number;
  offersCount?: number;
  endorsementsCount?: number;
}

/**
 * Deterministic, idempotent seed engine callable via `npm run db:seed` (`tsx src/db/seed.ts`)
 * or programmatically. Uses `DIRECT_URL || DATABASE_URL` and exits gracefully if neither is set.
 */
export async function runSeed(): Promise<SeedSummary> {
  const connectionUrl =
    process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL?.trim();

  if (!connectionUrl) {
    console.log(
      '[db:seed] Skipping PostgreSQL seed: neither DIRECT_URL nor DATABASE_URL is configured.'
    );
    return {
      skipped: true,
      reason: 'Neither DIRECT_URL nor DATABASE_URL is set.',
    };
  }

  const client = postgres(connectionUrl, { prepare: false, max: 5 });
  const db = drizzle(client, { schema });
  const store = getFallbackStore();
  const institutionId = store.institution.id;

  try {
    // 1. Institution
    await db
      .insert(schema.institutions)
      .values({
        id: store.institution.id,
        slug: store.institution.slug,
        name: store.institution.name,
        allowedStudentDomains: store.institution.allowedStudentDomains,
        regNoPattern: store.institution.regNoPattern,
        settingsJson: store.institution.settingsJson,
        createdAt: new Date(store.institution.createdAt),
      })
      .onConflictDoUpdate({
        target: schema.institutions.id,
        set: {
          slug: store.institution.slug,
          name: store.institution.name,
          allowedStudentDomains: store.institution.allowedStudentDomains,
          regNoPattern: store.institution.regNoPattern,
          settingsJson: store.institution.settingsJson,
        },
      });

    // 2. Users (31 students + 14 verified alumni + 2 pending_review alumni + 1 dean)
    for (const user of store.users) {
      await db
        .insert(schema.users)
        .values({
          id: user.id,
          institutionId,
          legacyCode: user.legacyCode ?? null,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          verificationStatus: user.verificationStatus,
          verifiedBy:
            user.verificationStatus === 'verified' ? 'user_dean_01' : null,
          verifiedAt:
            user.verificationStatus === 'verified'
              ? new Date('2026-08-15T09:00:00.000Z')
              : null,
          avatarUrl: user.avatarUrl,
          bannerUrl: user.bannerUrl,
          linkedinUrl: user.linkedinUrl ?? null,
          githubHandle: user.githubHandle ?? null,
          headline: user.headline,
        })
        .onConflictDoUpdate({
          target: schema.users.id,
          set: {
            legacyCode: user.legacyCode ?? null,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            verificationStatus: user.verificationStatus,
            avatarUrl: user.avatarUrl,
            bannerUrl: user.bannerUrl,
            linkedinUrl: user.linkedinUrl ?? null,
            githubHandle: user.githubHandle ?? null,
            headline: user.headline,
          },
        });

      if (user.role === 'student') {
        const extra = store.studentAcademicsByUserId[user.id];
        const academicsJson: Record<string, unknown> = extra
          ? { ...extra }
          : {};
        await db
          .insert(schema.studentProfiles)
          .values({
            userId: user.id,
            regNo: user.regNo ?? '2341010000',
            academicYear: user.academicYear ?? '4th Year',
            branch: user.branch ?? 'CSE',
            cgpa: user.cgpa ?? 8.9,
            bio: user.bio ?? '',
            techStack: user.techStack,
            academicsJson,
            isResearchAuthor: store.papers.some(
              (p) =>
                p.leadAuthorId === user.id ||
                p.coAuthorRegNo === user.regNo
            ),
          })
          .onConflictDoUpdate({
            target: schema.studentProfiles.userId,
            set: {
              regNo: user.regNo ?? '2341010000',
              academicYear: user.academicYear ?? '4th Year',
              branch: user.branch ?? 'CSE',
              cgpa: user.cgpa ?? 8.9,
              bio: user.bio ?? '',
              techStack: user.techStack,
              academicsJson,
            },
          });
      }

      if (user.role === 'alumni') {
        const career = store.alumniCareerByUserId[user.id];
        const careerJson: Record<string, unknown> = career
          ? { ...career }
          : {};
        await db
          .insert(schema.alumniProfiles)
          .values({
            userId: user.id,
            batchYear: user.batchYear ?? 2018,
            company: user.company ?? 'Partner Tech',
            workEmail: user.workEmail ?? null,
            workEmailVerified: Boolean(user.workEmailVerified),
            designation: user.designation ?? 'Software Engineer',
            personaCategory: user.personaCategory ?? 'Technical Mentor / Staff Engineer',
            mentorshipScope: user.mentorshipScope ?? '',
            bandwidthShield: user.bandwidthShield ?? '2 chats / week',
            totalExpYears: user.totalExpYears ?? 6,
            techStackExpertise: user.techStack,
            careerJson,
            canPostJobs: Boolean(user.canPostJobs),
          })
          .onConflictDoUpdate({
            target: schema.alumniProfiles.userId,
            set: {
              batchYear: user.batchYear ?? 2018,
              company: user.company ?? 'Partner Tech',
              workEmail: user.workEmail ?? null,
              workEmailVerified: Boolean(user.workEmailVerified),
              designation: user.designation ?? 'Software Engineer',
              personaCategory:
                user.personaCategory ?? 'Technical Mentor / Staff Engineer',
              mentorshipScope: user.mentorshipScope ?? '',
              bandwidthShield: user.bandwidthShield ?? '2 chats / week',
              totalExpYears: user.totalExpYears ?? 6,
              techStackExpertise: user.techStack,
              careerJson,
              canPostJobs: Boolean(user.canPostJobs),
            },
          });
      }
    }

    // 3. Alumni Verification Requests
    for (const req of store.verificationRequests) {
      await db
        .insert(schema.alumniVerificationRequests)
        .values({
          id: req.id,
          institutionId,
          alumniUserId: req.alumniUserId,
          linkedinUrl: req.linkedinUrl,
          workEmail: req.workEmail,
          company: req.company,
          domainAutoMatched: req.domainAutoMatched,
          proofNote: req.proofNote,
          status: req.status,
          reviewedByDeanId: req.reviewedByDeanId ?? null,
          reviewNote: req.reviewNote ?? null,
          createdAt: new Date(req.createdAt),
          reviewedAt: req.reviewedAt ? new Date(req.reviewedAt) : null,
        })
        .onConflictDoUpdate({
          target: schema.alumniVerificationRequests.id,
          set: {
            status: req.status,
            proofNote: req.proofNote,
            domainAutoMatched: req.domainAutoMatched,
          },
        });
    }

    // 4. Research Papers (5)
    const userByRegNo = new Map(
      store.users
        .filter((u) => u.regNo)
        .map((u) => [u.regNo as string, u.id])
    );

    for (const paper of store.papers) {
      const coAuthorId = paper.coAuthorRegNo
        ? (userByRegNo.get(paper.coAuthorRegNo) ?? null)
        : null;
      await db
        .insert(schema.researchPapers)
        .values({
          id: paper.id,
          institutionId,
          code: paper.code,
          slug: paper.slug,
          topic: paper.title,
          abstract: paper.story,
          domain: paper.domain,
          venue: paper.venue,
          status: paper.paperStatus,
          authorMode: paper.authorMode,
          leadAuthorId: paper.leadAuthorId,
          coAuthorId,
          preprintUrl: paper.preprintUrl,
          pdfStoragePath: paper.pdfStoragePath ?? null,
          codeRepoUrl: paper.codeRepoUrl,
          liveDemoUrl: paper.liveDemoUrl,
          guidanceNeeded: paper.guidanceNeeded,
          techStack: paper.techStack,
          coverImageUrl: paper.coverImage,
          likesCount: paper.likesCount,
          createdAt: new Date(paper.createdAt),
        })
        .onConflictDoUpdate({
          target: schema.researchPapers.id,
          set: {
            topic: paper.title,
            abstract: paper.story,
            domain: paper.domain,
            venue: paper.venue,
            status: paper.paperStatus,
            techStack: paper.techStack,
            coverImageUrl: paper.coverImage,
          },
        });
    }

    // 5. Projects (45) & Contributors
    for (const project of store.projects) {
      await db
        .insert(schema.projects)
        .values({
          id: project.id,
          institutionId,
          code: project.code,
          slug: project.slug,
          name: project.title,
          pitch: project.subtitle,
          shortDesc: project.shortDesc,
          detailedDesc: project.story,
          domain: project.domain,
          collaborationMode: project.collaborationMode,
          teamSize: project.teamSize,
          leadStudentId: project.leadId,
          academicYears: project.academicYears,
          techStack: project.techStack,
          liveUrl: project.liveUrl,
          hostingPlatform: project.hostingPlatform,
          githubUrl: project.githubUrl,
          demoVideoUrl: project.demoVideoUrl,
          pitchVideoUrl: project.pitchVideoUrl,
          coverImageUrl: project.coverImage,
          linkedPaperId: project.linkedPaperId ?? null,
          status: project.status,
          likesCount: project.likesCount,
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.createdAt),
        })
        .onConflictDoUpdate({
          target: schema.projects.id,
          set: {
            name: project.title,
            pitch: project.subtitle,
            shortDesc: project.shortDesc,
            detailedDesc: project.story,
            domain: project.domain,
            techStack: project.techStack,
            status: project.status,
          },
        });

      for (const contributor of project.contributors) {
        await db
          .insert(schema.projectContributors)
          .values({
            projectId: project.id,
            studentUserId: contributor.userId ?? null,
            contributorName: contributor.name,
            regNo: contributor.regNo,
            academicYear: contributor.academicYear,
          })
          .onConflictDoUpdate({
            target: [
              schema.projectContributors.projectId,
              schema.projectContributors.regNo,
            ],
            set: {
              studentUserId: contributor.userId ?? null,
              contributorName: contributor.name,
              academicYear: contributor.academicYear,
            },
          });
      }
    }

    // 6. Endorsements & Vouches
    for (const project of store.projects) {
      for (const endorsement of project.endorsements) {
        await db
          .insert(schema.endorsements)
          .values({
            id: endorsement.id,
            institutionId,
            alumniUserId: endorsement.alumniUserId,
            targetType: 'project',
            projectId: project.id,
            paperId: null,
            kind: endorsement.kind,
            vouchCode: endorsement.vouchCode ?? null,
            category: endorsement.category,
            quote: endorsement.quote,
            certifiedSkills: endorsement.certifiedSkills,
            rating: endorsement.rating,
            resolved: endorsement.resolved,
            createdAt: new Date(endorsement.createdAt),
          })
          .onConflictDoUpdate({
            target: schema.endorsements.id,
            set: {
              quote: endorsement.quote,
              certifiedSkills: endorsement.certifiedSkills,
              resolved: endorsement.resolved,
            },
          });
      }
    }

    for (const paper of store.papers) {
      for (const endorsement of paper.endorsements) {
        await db
          .insert(schema.endorsements)
          .values({
            id: endorsement.id,
            institutionId,
            alumniUserId: endorsement.alumniUserId,
            targetType: 'paper',
            projectId: null,
            paperId: paper.id,
            kind: endorsement.kind,
            vouchCode: endorsement.vouchCode ?? null,
            category: endorsement.category,
            quote: endorsement.quote,
            certifiedSkills: endorsement.certifiedSkills,
            rating: endorsement.rating,
            resolved: endorsement.resolved,
            createdAt: new Date(endorsement.createdAt),
          })
          .onConflictDoUpdate({
            target: schema.endorsements.id,
            set: {
              quote: endorsement.quote,
              certifiedSkills: endorsement.certifiedSkills,
              resolved: endorsement.resolved,
            },
          });
      }
    }

    // 7. Job Postings (32)
    for (const job of store.jobs) {
      await db
        .insert(schema.jobPostings)
        .values({
          id: job.id,
          institutionId,
          postedByAlumniId: job.postedByAlumniId,
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
          createdAt: new Date(job.createdAt),
        })
        .onConflictDoUpdate({
          target: schema.jobPostings.id,
          set: {
            roleTitle: job.roleTitle,
            company: job.company,
            compensation: job.compensation,
            status: job.status,
          },
        });
    }

    // 8. Job Applications
    for (const app of store.jobApplications) {
      await db
        .insert(schema.jobApplications)
        .values({
          id: app.id,
          institutionId,
          jobId: app.jobId,
          studentUserId: app.studentUserId,
          showcaseProjectId: app.showcaseProjectId ?? null,
          note: app.note,
          status: app.status,
          createdAt: new Date(app.createdAt),
          updatedAt: new Date(app.updatedAt),
        })
        .onConflictDoUpdate({
          target: schema.jobApplications.id,
          set: {
            status: app.status,
            note: app.note,
          },
        });
    }

    // 9. Coffee Chat Requests
    for (const chat of store.coffeeChats) {
      await db
        .insert(schema.coffeeChatRequests)
        .values({
          id: chat.id,
          institutionId,
          studentUserId: chat.studentUserId,
          alumniUserId: chat.alumniUserId,
          projectId: chat.projectId ?? null,
          topic: chat.topic,
          status: chat.status,
          createdAt: new Date(chat.createdAt),
        })
        .onConflictDoUpdate({
          target: schema.coffeeChatRequests.id,
          set: {
            status: chat.status,
            topic: chat.topic,
          },
        });
    }

    // 10. Placement Offers (10)
    for (const offer of store.offers) {
      await db
        .insert(schema.placementOffers)
        .values({
          id: offer.id,
          institutionId,
          code: offer.code,
          studentUserId: offer.studentUserId,
          academicYearBranch: offer.academicYearBranch,
          company: offer.company,
          jobRole: offer.jobRole,
          packageStr: offer.packageStr,
          packageLpa: offer.packageLpa,
          offerType: offer.offerType,
          referringAlumniId: offer.referringAlumniId ?? null,
          status: offer.status,
          verifiedByDean: offer.verifiedByDean,
          createdAt: new Date(offer.createdAt),
        })
        .onConflictDoUpdate({
          target: schema.placementOffers.id,
          set: {
            packageStr: offer.packageStr,
            packageLpa: offer.packageLpa,
            status: offer.status,
            verifiedByDean: offer.verifiedByDean,
          },
        });
    }

    // 11. Chat Threads & Messages
    for (const thread of store.chatThreads) {
      await db
        .insert(schema.chatThreads)
        .values({
          id: thread.id,
          institutionId,
          studentUserId: thread.studentUserId,
          alumniUserId: thread.alumniUserId,
          topic: thread.topic,
          studentUnreadCount: thread.studentUnreadCount,
          alumniUnreadCount: thread.alumniUnreadCount,
          lastMessageAt: new Date(thread.lastMessageAt),
          createdAt: new Date(thread.lastMessageAt),
        })
        .onConflictDoUpdate({
          target: schema.chatThreads.id,
          set: {
            topic: thread.topic,
            lastMessageAt: new Date(thread.lastMessageAt),
          },
        });

      for (const msg of thread.messages) {
        await db
          .insert(schema.chatMessages)
          .values({
            id: msg.id,
            threadId: thread.id,
            institutionId,
            senderUserId: msg.senderUserId,
            senderRole: msg.senderRole,
            senderName: msg.senderName,
            text: msg.text,
            attachmentUrl: msg.attachmentUrl ?? null,
            readAt: msg.readAt ? new Date(msg.readAt) : null,
            createdAt: new Date(msg.createdAt),
          })
          .onConflictDoNothing();
      }
    }

    // 12. Notifications
    for (const notif of store.notifications) {
      await db
        .insert(schema.notifications)
        .values({
          id: notif.id,
          institutionId,
          recipientUserId: notif.recipientUserId,
          actorUserId: notif.actorUserId ?? null,
          category: notif.category,
          title: notif.title,
          message: notif.message,
          targetSection: notif.targetSection,
          targetEntityId: notif.targetEntityId ?? null,
          actionLabel: notif.actionLabel,
          isRead: notif.isRead,
          createdAt: new Date(notif.createdAt),
        })
        .onConflictDoNothing();
    }

    // 13. Institutional Audit Logs
    for (const log of store.auditLogs) {
      await db
        .insert(schema.institutionalAuditLogs)
        .values({
          id: log.id,
          institutionId,
          actorUserId: log.actorUserId,
          actorName: log.actorName,
          category: log.category,
          title: log.title,
          impact: log.impact,
          createdAt: new Date(log.createdAt),
        })
        .onConflictDoNothing();
    }

    // 14. Social Follows, Likes, Saved Items
    for (const [followerId, followingSet] of Object.entries(
      store.followingIdsByUser
    )) {
      for (const followingId of followingSet) {
        await db
          .insert(schema.socialFollows)
          .values({
            followerUserId: followerId,
            followingUserId: followingId,
            institutionId,
          })
          .onConflictDoNothing();
      }
    }

    for (const [userId, likeSet] of Object.entries(
      store.likedBuildKeysByUser
    )) {
      for (const key of likeSet) {
        const [targetType, targetId] = key.split(':') as [
          'project' | 'paper',
          string,
        ];
        if (!targetType || !targetId) continue;
        await db
          .insert(schema.postLikes)
          .values({
            userId,
            targetType,
            targetId,
            institutionId,
          })
          .onConflictDoNothing();
      }
    }

    for (const [userId, saveSet] of Object.entries(store.savedItemKeysByUser)) {
      for (const key of saveSet) {
        const [itemType, itemId] = key.split(':') as [
          'project' | 'paper' | 'job',
          string,
        ];
        if (!itemType || !itemId) continue;
        await db
          .insert(schema.savedItems)
          .values({
            userId,
            itemType,
            itemId,
            institutionId,
          })
          .onConflictDoNothing();
      }
    }

    const summary: SeedSummary = {
      skipped: false,
      institutionId,
      usersCount: store.users.length,
      projectsCount: store.projects.length,
      papersCount: store.papers.length,
      jobsCount: store.jobs.length,
      offersCount: store.offers.length,
      endorsementsCount: store.endorsements.length,
    };

    console.log('[db:seed] Seed completed:', summary);
    return summary;
  } finally {
    await client.end({ timeout: 5 });
  }
}

const isCliEntry =
  typeof process !== 'undefined' &&
  Array.isArray(process.argv) &&
  Boolean(process.argv[1]) &&
  /(^|\/)seed\.(ts|js|mjs|cjs)$/.test(process.argv[1]);

if (isCliEntry) {
  runSeed()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error('[db:seed] Failed:', err);
      process.exit(1);
    });
}
