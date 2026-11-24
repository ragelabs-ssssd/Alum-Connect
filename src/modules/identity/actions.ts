'use server';

import { randomUUID } from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getIndianAvatar, getIndianBanner } from '@/data/alumConnectData';
import { getFallbackStore } from '@/db/fallbackStore';
import { getDb, isDatabaseConfigured } from '@/db/index';
import {
  alumniProfiles,
  alumniVerificationRequests,
  institutions,
  notifications,
  socialFollows,
  studentProfiles,
  users,
} from '@/db/schema';
import {
  clearDemoSessionCookie,
  getSessionUser,
  isAuthError,
  mapDbRecordToSessionUser,
  requireAuth,
  setDemoSessionCookie,
} from '@/lib/auth';
import { isDemoModeEnabled, isSupabaseConfigured } from '@/lib/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import {
  isCorporateDomainMatch,
  signInSchema,
  signUpSchema,
  switchPersonaSchema,
  toggleFollowSchema,
  type SignInInput,
  type SignUpInput,
} from '@/modules/identity/validators';
import type {
  ActionResult,
  NotificationDTO,
  SessionUser,
  VerificationRequestDTO,
} from '@/types/domain';

function makeDefaultDisplayName(email: string): string {
  const local = email.split('@')[0] ?? 'Member';
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function makeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Signs in via Supabase Auth when configured with a password, or resolves/creates
 * a session in the seeded fallback store and sets the signed demo cookie.
 */
export async function signInAction(
  input: SignInInput,
): Promise<ActionResult<SessionUser>> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid sign-in details.',
      code: 'VALIDATION_ERROR',
    };
  }

  const { email, password, role } = parsed.data;

  if (isSupabaseConfigured() && password) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          return {
            ok: false,
            error: error.message || 'Invalid email or password.',
            code: 'UNAUTHORIZED',
          };
        }
        const liveUser = await getSessionUser();
        if (!liveUser) {
          return {
            ok: false,
            error: 'Signed in, but could not load user session.',
            code: 'INTERNAL_ERROR',
          };
        }
        revalidatePath('/');
        return { ok: true, data: liveUser };
      }
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Authentication failed.',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  if (!isDemoModeEnabled()) {
    return {
      ok: false,
      error: 'Password is required when demo mode is disabled.',
      code: 'VALIDATION_ERROR',
    };
  }

  const store = getFallbackStore();
  let user = store.users.find((u) => u.email.toLowerCase() === email);

  if (!user) {
    const inferredRole =
      role ??
      (email.includes('dean')
        ? 'dean'
        : email.endsWith('@soa.ac.in')
          ? 'student'
          : 'alumni');
    const fullName = makeDefaultDisplayName(email);
    const id = `user_${inferredRole === 'alumni' ? 'alum' : inferredRole === 'dean' ? 'dean' : 'stu'}_${randomUUID().slice(0, 8)}`;

    user = {
      id,
      legacyCode: null,
      institutionId: store.institution.id,
      institutionSlug: store.institution.slug,
      email,
      fullName,
      role: inferredRole,
      verificationStatus:
        inferredRole === 'alumni' ? 'pending_review' : 'verified',
      avatarUrl: getIndianAvatar(fullName),
      bannerUrl: getIndianBanner(store.users.length),
      linkedinUrl: `https://linkedin.com/in/${makeSlug(fullName)}`,
      githubHandle: makeSlug(fullName),
      headline:
        inferredRole === 'alumni'
          ? 'ITER Alumni Member'
          : inferredRole === 'dean'
            ? 'Dean & Placement Governance'
            : '3rd Year CSE • Campus Builder',
      regNo: inferredRole === 'student' ? '2341019999' : null,
      academicYear: inferredRole === 'student' ? '3rd Year' : null,
      branch: inferredRole === 'student' ? 'CSE' : null,
      cgpa: inferredRole === 'student' ? 8.85 : null,
      bio: 'ITER Campus Builder on AlmaConnect.',
      techStack: ['TypeScript', 'Next.js', 'PostgreSQL'],
      batchYear: inferredRole === 'alumni' ? 2020 : null,
      company: inferredRole === 'alumni' ? 'Tech Partner' : null,
      workEmail: inferredRole === 'alumni' ? email : null,
      workEmailVerified: false,
      designation: inferredRole === 'alumni' ? 'Software Engineer' : null,
      personaCategory:
        inferredRole === 'alumni' ? 'Technical Mentor / Staff Engineer' : null,
      mentorshipScope:
        inferredRole === 'alumni' ? 'Architecture & Career Guidance' : null,
      bandwidthShield: inferredRole === 'alumni' ? '2 chats / week' : null,
      totalExpYears: inferredRole === 'alumni' ? 4 : null,
      canPostJobs: false,
    };

    store.users.push(user);
  }

  await setDemoSessionCookie(user);
  revalidatePath('/');
  return { ok: true, data: user };
}

/**
 * Registers a Student or Alumni account. Alumni providing a corporate work email
 * matching their stated company are auto-verified; others enter `pending_review`
 * and generate a verification request + Dean notification.
 */
export async function signUpAction(
  input: SignUpInput,
): Promise<ActionResult<SessionUser>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid sign-up fields.',
      code: 'VALIDATION_ERROR',
    };
  }

  const data = parsed.data;
  const store = getFallbackStore();

  const isAlumni = data.role === 'alumni';
  const domainAutoMatched = isAlumni
    ? isCorporateDomainMatch(data.workEmail, data.company)
    : false;

  const verificationStatus = isAlumni
    ? domainAutoMatched
      ? 'verified'
      : 'pending_review'
    : 'verified';

  const canPostJobs = isAlumni && verificationStatus === 'verified';
  const batchYear = data.batchYear ?? 2020;
  const academicYear = data.academicYear || '3rd Year';
  const branch = data.branch || 'CSE';
  const cgpa = data.cgpa ?? 8.9;
  const techStack =
    data.techStack && data.techStack.length > 0
      ? data.techStack
      : isAlumni
        ? ['System Design', 'Cloud Architecture', 'Mentorship']
        : ['TypeScript', 'Python', 'React'];

  const headline =
    data.headline && data.headline.length > 0
      ? data.headline
      : isAlumni
        ? `${data.designation} @ ${data.company} • Batch '${String(batchYear).slice(-2)}`
        : `${academicYear} ${branch} • Campus Builder`;

  const avatarUrl = getIndianAvatar(data.fullName);
  const bannerUrl = getIndianBanner(store.users.length);
  const githubHandle = data.githubHandle ?? makeSlug(data.fullName);

  // Live Supabase Auth + PostgreSQL path
  if (isSupabaseConfigured() && data.password) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              fullName: data.fullName,
              role: data.role,
              institutionId: store.institution.id,
              institutionSlug: store.institution.slug,
              verificationStatus,
              avatarUrl,
              bannerUrl,
              linkedinUrl: data.linkedinUrl ?? null,
              githubHandle,
              headline,
              regNo: data.regNo ?? null,
              academicYear: isAlumni ? null : academicYear,
              branch: isAlumni ? null : branch,
              cgpa: isAlumni ? null : cgpa,
              bio: data.bio ?? null,
              techStack,
              batchYear: isAlumni ? batchYear : null,
              company: data.company ?? null,
              workEmail: data.workEmail ?? null,
              workEmailVerified: domainAutoMatched,
              designation: data.designation ?? null,
              personaCategory:
                data.personaCategory ?? 'Technical Mentor / Staff Engineer',
              mentorshipScope:
                data.mentorshipScope ?? 'Capstone Reviews & Career Guidance',
              bandwidthShield: '2 chats / week',
              totalExpYears: isAlumni
                ? Math.max(1, new Date().getFullYear() - batchYear)
                : null,
              canPostJobs,
            },
          },
        });

        if (authError || !authData.user) {
          return {
            ok: false,
            error: authError?.message ?? 'Could not create Supabase account.',
            code: 'CONFLICT',
          };
        }

        const userId = authData.user.id;
        const newUser: SessionUser = {
          id: userId,
          legacyCode: null,
          institutionId: store.institution.id,
          institutionSlug: store.institution.slug,
          email: data.email,
          fullName: data.fullName,
          role: data.role,
          verificationStatus,
          avatarUrl,
          bannerUrl,
          linkedinUrl: data.linkedinUrl ?? null,
          githubHandle,
          headline,
          regNo: isAlumni ? null : (data.regNo ?? null),
          academicYear: isAlumni ? null : academicYear,
          branch: isAlumni ? null : branch,
          cgpa: isAlumni ? null : cgpa,
          bio: isAlumni ? null : (data.bio ?? ''),
          techStack,
          batchYear: isAlumni ? batchYear : null,
          company: isAlumni ? (data.company ?? null) : null,
          workEmail: isAlumni ? (data.workEmail ?? null) : null,
          workEmailVerified: domainAutoMatched,
          designation: isAlumni ? (data.designation ?? null) : null,
          personaCategory: isAlumni
            ? (data.personaCategory ?? 'Technical Mentor / Staff Engineer')
            : null,
          mentorshipScope: isAlumni
            ? (data.mentorshipScope ?? 'Capstone Reviews & Career Guidance')
            : null,
          bandwidthShield: isAlumni ? '2 chats / week' : null,
          totalExpYears: isAlumni
            ? Math.max(1, new Date().getFullYear() - batchYear)
            : null,
          canPostJobs,
        };

        if (isDatabaseConfigured()) {
          const db = getDb();
          await db
            .insert(users)
            .values({
              id: userId,
              institutionId: store.institution.id,
              email: data.email,
              fullName: data.fullName,
              role: data.role,
              verificationStatus,
              avatarUrl,
              bannerUrl,
              linkedinUrl: data.linkedinUrl ?? null,
              githubHandle,
              headline,
            })
            .onConflictDoNothing();

          if (data.role === 'student') {
            await db
              .insert(studentProfiles)
              .values({
                userId,
                regNo: data.regNo!,
                academicYear,
                branch,
                cgpa,
                bio: data.bio ?? '',
                techStack,
              })
              .onConflictDoNothing();
          } else {
            await db
              .insert(alumniProfiles)
              .values({
                userId,
                batchYear,
                company: data.company!,
                workEmail: data.workEmail ?? null,
                workEmailVerified: domainAutoMatched,
                designation: data.designation!,
                personaCategory:
                  data.personaCategory ?? 'Technical Mentor / Staff Engineer',
                mentorshipScope:
                  data.mentorshipScope ??
                  'Capstone Reviews & Career Guidance',
                bandwidthShield: '2 chats / week',
                totalExpYears: Math.max(1, new Date().getFullYear() - batchYear),
                techStackExpertise: techStack,
                canPostJobs,
              })
              .onConflictDoNothing();

            if (verificationStatus === 'pending_review') {
              const reqId = `verif_req_${randomUUID().slice(0, 8)}`;
              await db.insert(alumniVerificationRequests).values({
                id: reqId,
                institutionId: store.institution.id,
                alumniUserId: userId,
                linkedinUrl: data.linkedinUrl ?? '',
                workEmail: data.workEmail ?? '',
                company: data.company!,
                domainAutoMatched: false,
                proofNote:
                  data.proofNote ??
                  `ITER Batch ${batchYear} alumnus joining from ${data.company}.`,
                status: 'pending',
              });

              const [deanRow] = await db
                .select({ id: users.id })
                .from(users)
                .where(eq(users.role, 'dean'))
                .limit(1);

              if (deanRow) {
                await db.insert(notifications).values({
                  id: `notif_${randomUUID().slice(0, 8)}`,
                  institutionId: store.institution.id,
                  recipientUserId: deanRow.id,
                  actorUserId: userId,
                  category: 'verification',
                  title: `Alumni Verification Pending: ${data.fullName}`,
                  message: `${data.fullName} (${data.designation} @ ${data.company}) requested Dean verification.`,
                  targetSection: 'dean',
                  targetEntityId: reqId,
                  actionLabel: 'Review Queue',
                });
              }
            }
          }
        }

        revalidatePath('/');
        revalidatePath('/dean');
        return { ok: true, data: newUser };
      }
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error ? err.message : 'Unable to complete sign up.',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  // Fallback Store / Demo Mode Path
  const existing = store.users.find((u) => u.email.toLowerCase() === data.email);
  if (existing) {
    return {
      ok: false,
      error: 'An account with this email already exists.',
      code: 'CONFLICT',
    };
  }

  const userId = `user_${isAlumni ? 'alum' : 'stu'}_${randomUUID().slice(0, 8)}`;
  const newUser: SessionUser = {
    id: userId,
    legacyCode: null,
    institutionId: store.institution.id,
    institutionSlug: store.institution.slug,
    email: data.email,
    fullName: data.fullName,
    role: data.role,
    verificationStatus,
    avatarUrl,
    bannerUrl,
    linkedinUrl: data.linkedinUrl ?? null,
    githubHandle,
    headline,
    regNo: isAlumni ? null : (data.regNo ?? null),
    academicYear: isAlumni ? null : academicYear,
    branch: isAlumni ? null : branch,
    cgpa: isAlumni ? null : cgpa,
    bio: isAlumni ? null : (data.bio ?? ''),
    techStack,
    batchYear: isAlumni ? batchYear : null,
    company: isAlumni ? (data.company ?? null) : null,
    workEmail: isAlumni ? (data.workEmail ?? null) : null,
    workEmailVerified: domainAutoMatched,
    designation: isAlumni ? (data.designation ?? null) : null,
    personaCategory: isAlumni
      ? (data.personaCategory ?? 'Technical Mentor / Staff Engineer')
      : null,
    mentorshipScope: isAlumni
      ? (data.mentorshipScope ?? 'Capstone Reviews & Career Guidance')
      : null,
    bandwidthShield: isAlumni ? '2 chats / week' : null,
    totalExpYears: isAlumni
      ? Math.max(1, new Date().getFullYear() - batchYear)
      : null,
    canPostJobs,
  };

  store.users.push(newUser);

  if (!isAlumni) {
    store.studentAcademicsByUserId[userId] = {
      cgpa,
      class10School: 'ITER Feeder High School',
      class10Board: 'CBSE',
      class10Pct: '92.0%',
      class12School: 'ITER Senior Secondary',
      class12Board: 'CBSE',
      class12Pct: '90.5%',
      primaryClub: 'Coding Club - CDPC',
      secondaryClub: 'GDSC ITER',
      clubRole: 'Campus Builder',
      achievement: 'Active AlmaConnect Student Member',
    };
  } else {
    const expYears = Math.max(1, new Date().getFullYear() - batchYear);
    store.alumniCareerByUserId[userId] = {
      schooling: `ITER Batch ${batchYear}`,
      totalYears: expYears,
      careerStage: data.designation ?? 'Software Engineer',
      earlyCareer: `Graduate Engineer (${batchYear})`,
      midCareer: `${data.designation} at ${data.company}`,
      founderStatus: data.personaCategory ?? 'Industry Mentor',
    };

    if (verificationStatus === 'pending_review') {
      const nowIso = new Date().toISOString();
      const reqId = `verif_req_${randomUUID().slice(0, 8)}`;
      const req: VerificationRequestDTO = {
        id: reqId,
        alumniUserId: userId,
        alumniName: data.fullName,
        alumniEmail: data.email,
        alumniAvatar: avatarUrl,
        batchYear,
        company: data.company!,
        designation: data.designation!,
        workEmail: data.workEmail ?? '',
        linkedinUrl: data.linkedinUrl ?? '',
        domainAutoMatched: false,
        proofNote:
          data.proofNote ??
          `ITER Batch ${batchYear} alumnus requesting verification for ${data.company}.`,
        status: 'pending',
        reviewedByDeanId: null,
        reviewNote: null,
        createdAt: nowIso,
        reviewedAt: null,
      };
      store.verificationRequests.unshift(req);

      const dean = store.users.find((u) => u.role === 'dean');
      if (dean) {
        const notif: NotificationDTO = {
          id: `notif_${randomUUID().slice(0, 8)}`,
          recipientUserId: dean.id,
          actorUserId: userId,
          category: 'verification',
          title: `Alumni Verification Pending: ${data.fullName}`,
          message: `${data.fullName} (${data.designation} @ ${data.company}) submitted LinkedIn/profile credentials for review.`,
          targetSection: 'dean',
          targetEntityId: reqId,
          actionLabel: 'Review Queue',
          isRead: false,
          createdAt: nowIso,
        };
        store.notifications.unshift(notif);
      }
    }
  }

  await setDemoSessionCookie(newUser);
  revalidatePath('/');
  revalidatePath('/dean');
  return { ok: true, data: newUser };
}

/** Signs out the active Supabase and/or demo session. */
export async function signOutAction(): Promise<
  ActionResult<{ signedOut: true }>
> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // Ignore signOut errors and still clear demo cookie.
    }
  }

  await clearDemoSessionCookie();
  revalidatePath('/');
  return { ok: true, data: { signedOut: true } };
}

/** Switches the signed HTTP-only demo session cookie to a seeded persona. */
export async function switchDemoPersonaAction(
  userId: string,
): Promise<ActionResult<SessionUser>> {
  if (!isDemoModeEnabled()) {
    return {
      ok: false,
      error: 'Demo persona switching is disabled in this environment.',
      code: 'FORBIDDEN',
    };
  }

  const parsed = switchPersonaSchema.safeParse({ userId });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid persona ID.',
      code: 'VALIDATION_ERROR',
    };
  }

  let targetUser: SessionUser | null = null;

  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const [row] = await db
        .select({
          user: users,
          institutionSlug: institutions.slug,
          studentProfile: studentProfiles,
          alumniProfile: alumniProfiles,
        })
        .from(users)
        .leftJoin(institutions, eq(users.institutionId, institutions.id))
        .leftJoin(studentProfiles, eq(users.id, studentProfiles.userId))
        .leftJoin(alumniProfiles, eq(users.id, alumniProfiles.userId))
        .where(eq(users.id, parsed.data.userId))
        .limit(1);

      if (row) {
        targetUser = mapDbRecordToSessionUser(row);
      }
    } catch {
      // Fall through to fallbackStore lookup.
    }
  }

  if (!targetUser) {
    const store = getFallbackStore();
    targetUser = store.users.find((u) => u.id === parsed.data.userId) ?? null;
  }

  if (!targetUser) {
    return {
      ok: false,
      error: 'Requested demo persona was not found.',
      code: 'NOT_FOUND',
    };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch {
      // Continue setting demo cookie.
    }
  }

  await setDemoSessionCookie(targetUser);
  revalidatePath('/');
  return { ok: true, data: targetUser };
}

/** Toggles following state for the current authenticated user against `targetUserId`. */
export async function toggleFollowUserAction(
  targetUserId: string,
): Promise<ActionResult<{ following: boolean }>> {
  const parsed = toggleFollowSchema.safeParse({ targetUserId });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? 'Invalid target user.',
      code: 'VALIDATION_ERROR',
    };
  }

  let viewer: SessionUser;
  try {
    viewer = await requireAuth();
  } catch (err) {
    if (isAuthError(err)) {
      return { ok: false, error: err.message, code: err.code };
    }
    return {
      ok: false,
      error: 'Authentication required.',
      code: 'UNAUTHORIZED',
    };
  }

  if (parsed.data.targetUserId === viewer.id) {
    return {
      ok: false,
      error: 'You cannot follow your own profile.',
      code: 'VALIDATION_ERROR',
    };
  }

  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      const [existing] = await db
        .select()
        .from(socialFollows)
        .where(
          and(
            eq(socialFollows.followerUserId, viewer.id),
            eq(socialFollows.followingUserId, parsed.data.targetUserId),
          ),
        )
        .limit(1);

      if (existing) {
        await db
          .delete(socialFollows)
          .where(
            and(
              eq(socialFollows.followerUserId, viewer.id),
              eq(socialFollows.followingUserId, parsed.data.targetUserId),
            ),
          );
        revalidatePath('/u');
        return { ok: true, data: { following: false } };
      }

      await db.insert(socialFollows).values({
        followerUserId: viewer.id,
        followingUserId: parsed.data.targetUserId,
        institutionId: viewer.institutionId,
      });
      revalidatePath('/u');
      return { ok: true, data: { following: true } };
    } catch (err) {
      return {
        ok: false,
        error:
          err instanceof Error ? err.message : 'Unable to update follow state.',
        code: 'INTERNAL_ERROR',
      };
    }
  }

  const store = getFallbackStore();
  const targetExists = store.users.some(
    (u) => u.id === parsed.data.targetUserId,
  );
  if (!targetExists) {
    return {
      ok: false,
      error: 'Target user not found.',
      code: 'NOT_FOUND',
    };
  }

  if (!store.followingIdsByUser[viewer.id]) {
    store.followingIdsByUser[viewer.id] = new Set();
  }
  const followSet = store.followingIdsByUser[viewer.id];
  let following: boolean;
  if (followSet.has(parsed.data.targetUserId)) {
    followSet.delete(parsed.data.targetUserId);
    following = false;
  } else {
    followSet.add(parsed.data.targetUserId);
    following = true;
  }

  revalidatePath('/u');
  return { ok: true, data: { following } };
}
