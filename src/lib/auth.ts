import { createHmac, timingSafeEqual } from 'node:crypto';
import type { User } from '@supabase/supabase-js';
import { eq } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import { z } from 'zod';
import { getFallbackStore } from '@/db/fallbackStore';
import { getDb, isDatabaseConfigured } from '@/db/index';
import { alumniProfiles, institutions, studentProfiles, users } from '@/db/schema';
import {
  getAppUrl,
  getDemoSessionSecret,
  isDemoModeEnabled,
  isSupabaseConfigured,
} from '@/lib/env';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type {
  SessionUser,
  UserRole,
  VerificationStatus,
} from '@/types/domain';

export const DEMO_SESSION_COOKIE_NAME = 'almaconnect_demo_session';
const DEMO_SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const userRoleSchema = z.enum(['student', 'alumni', 'dean']);
const verificationStatusSchema = z.enum([
  'unverified',
  'pending_review',
  'verified',
  'rejected',
]);

const sessionUserSchema: z.ZodType<SessionUser> = z.object({
  id: z.string().min(1),
  legacyCode: z.string().nullable().optional(),
  institutionId: z.string().min(1),
  institutionSlug: z.string().min(1),
  email: z.string(),
  fullName: z.string().min(1),
  role: userRoleSchema,
  verificationStatus: verificationStatusSchema,
  avatarUrl: z.string(),
  bannerUrl: z.string(),
  linkedinUrl: z.string().nullable().optional(),
  githubHandle: z.string().nullable().optional(),
  headline: z.string(),
  regNo: z.string().nullable().optional(),
  academicYear: z.string().nullable().optional(),
  branch: z.string().nullable().optional(),
  cgpa: z.number().nullable().optional(),
  bio: z.string().nullable().optional(),
  techStack: z.array(z.string()),
  batchYear: z.number().nullable().optional(),
  company: z.string().nullable().optional(),
  workEmail: z.string().nullable().optional(),
  workEmailVerified: z.boolean().optional(),
  designation: z.string().nullable().optional(),
  personaCategory: z.string().nullable().optional(),
  mentorshipScope: z.string().nullable().optional(),
  bandwidthShield: z.string().nullable().optional(),
  totalExpYears: z.number().nullable().optional(),
  canPostJobs: z.boolean().optional(),
});

const signedDemoEnvelopeSchema = z.object({
  user: sessionUserSchema,
  exp: z.number().int().positive(),
});

export type AuthErrorCode = 'UNAUTHORIZED' | 'FORBIDDEN' | 'UNVERIFIED_ALUMNI';

/** Typed authorization failure thrown by server auth guards. */
export class AuthError extends Error {
  public readonly code: AuthErrorCode;
  public readonly status: number;

  constructor(code: AuthErrorCode, message?: string) {
    const defaultMessages: Record<AuthErrorCode, string> = {
      UNAUTHORIZED: 'Authentication required. Please sign in to continue.',
      FORBIDDEN: 'You do not have permission to perform this action.',
      UNVERIFIED_ALUMNI:
        'Verified alumni status is required to perform this action.',
    };
    super(message ?? defaultMessages[code]);
    this.name = 'AuthError';
    this.code = code;
    this.status = code === 'UNAUTHORIZED' ? 401 : 403;
  }
}

export function isAuthError(error: unknown): error is AuthError {
  return error instanceof AuthError;
}

function signDemoPayload(encodedPayload: string): string {
  return createHmac('sha256', getDemoSessionSecret())
    .update(encodedPayload)
    .digest('base64url');
}

function createSignedDemoToken(user: SessionUser): string {
  const envelope = {
    user,
    exp: Math.floor(Date.now() / 1000) + DEMO_SESSION_TTL_SECONDS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(envelope), 'utf8').toString(
    'base64url',
  );
  const signature = signDemoPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

function verifySignedDemoToken(token: string): SessionUser | null {
  const parts = token.split('.');
  if (parts.length !== 2) {
    return null;
  }
  const [encodedPayload, providedSig] = parts;
  if (!encodedPayload || !providedSig) {
    return null;
  }

  const expectedSig = signDemoPayload(encodedPayload);
  const providedBuf = Buffer.from(providedSig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');

  if (
    providedBuf.length !== expectedBuf.length ||
    !timingSafeEqual(providedBuf, expectedBuf)
  ) {
    return null;
  }

  try {
    const rawJson = Buffer.from(encodedPayload, 'base64url').toString('utf8');
    const parsed = signedDemoEnvelopeSchema.safeParse(JSON.parse(rawJson));
    if (!parsed.success) {
      return null;
    }
    if (parsed.data.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }
    return parsed.data.user;
  } catch {
    return null;
  }
}

/** Sets a signed HTTP-only demo session cookie for the active persona. */
export async function setDemoSessionCookie(user: SessionUser): Promise<void> {
  const cookieStore = await cookies();
  const token = createSignedDemoToken(user);

  cookieStore.set(DEMO_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure:
      process.env.NODE_ENV === 'production' && getAppUrl().startsWith('https://'),
    path: '/',
    maxAge: DEMO_SESSION_TTL_SECONDS,
  });
}

/** Clears the signed HTTP-only demo session cookie. */
export async function clearDemoSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(DEMO_SESSION_COOKIE_NAME);
}

/** Reads and verifies the signed HTTP-only demo session cookie, returning null if absent or invalid. */
export async function readDemoSessionCookie(): Promise<SessionUser | null> {
  if (!isDemoModeEnabled()) {
    return null;
  }

  const cookieStore = await cookies();
  const rawToken = cookieStore.get(DEMO_SESSION_COOKIE_NAME)?.value;
  if (!rawToken) {
    return null;
  }

  await connection();
  return verifySignedDemoToken(rawToken);
}

function readMetaString(
  meta: Record<string, unknown>,
  ...keys: string[]
): string | undefined {
  for (const key of keys) {
    const value = meta[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function readMetaNumber(
  meta: Record<string, unknown>,
  ...keys: string[]
): number | undefined {
  for (const key of keys) {
    const value = meta[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}

function readMetaBoolean(
  meta: Record<string, unknown>,
  ...keys: string[]
): boolean | undefined {
  for (const key of keys) {
    const value = meta[key];
    if (typeof value === 'boolean') {
      return value;
    }
  }
  return undefined;
}

function readMetaStringArray(
  meta: Record<string, unknown>,
  ...keys: string[]
): string[] {
  for (const key of keys) {
    const value = meta[key];
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string');
    }
  }
  return [];
}

function mapSupabaseUserToSessionUser(user: User): SessionUser {
  const userMeta = (user.user_metadata ?? {}) as Record<string, unknown>;
  const appMeta = (user.app_metadata ?? {}) as Record<string, unknown>;
  const meta: Record<string, unknown> = { ...userMeta, ...appMeta };

  const rawRole = readMetaString(meta, 'role');
  const roleParsed = userRoleSchema.safeParse(rawRole);
  const role: UserRole = roleParsed.success ? roleParsed.data : 'student';

  const rawStatus = readMetaString(
    meta,
    'verificationStatus',
    'verification_status',
  );
  const statusParsed = verificationStatusSchema.safeParse(rawStatus);
  const defaultStatus: VerificationStatus =
    role === 'alumni' ? 'pending_review' : 'verified';
  const verificationStatus: VerificationStatus = statusParsed.success
    ? statusParsed.data
    : defaultStatus;

  const email = user.email ?? readMetaString(userMeta, 'email') ?? '';
  const fallbackName = email ? email.split('@')[0] : 'AlmaConnect Member';

  return {
    id: user.id,
    legacyCode: readMetaString(userMeta, 'legacyCode', 'legacy_code') ?? null,
    institutionId:
      readMetaString(meta, 'institutionId', 'institution_id') ?? 'inst_iter_soa',
    institutionSlug:
      readMetaString(meta, 'institutionSlug', 'institution_slug') ?? 'iter-soa',
    email,
    fullName:
      readMetaString(userMeta, 'fullName', 'full_name', 'name') ?? fallbackName,
    role,
    verificationStatus,
    avatarUrl: readMetaString(userMeta, 'avatarUrl', 'avatar_url') ?? '',
    bannerUrl: readMetaString(userMeta, 'bannerUrl', 'banner_url') ?? '',
    linkedinUrl:
      readMetaString(userMeta, 'linkedinUrl', 'linkedin_url') ?? null,
    githubHandle:
      readMetaString(userMeta, 'githubHandle', 'github_handle') ?? null,
    headline: readMetaString(userMeta, 'headline') ?? '',
    regNo: readMetaString(userMeta, 'regNo', 'reg_no') ?? null,
    academicYear:
      readMetaString(userMeta, 'academicYear', 'academic_year') ?? null,
    branch: readMetaString(userMeta, 'branch') ?? null,
    cgpa: readMetaNumber(userMeta, 'cgpa') ?? null,
    bio: readMetaString(userMeta, 'bio') ?? null,
    techStack: readMetaStringArray(userMeta, 'techStack', 'tech_stack'),
    batchYear: readMetaNumber(userMeta, 'batchYear', 'batch_year') ?? null,
    company: readMetaString(userMeta, 'company') ?? null,
    workEmail: readMetaString(userMeta, 'workEmail', 'work_email') ?? null,
    workEmailVerified:
      readMetaBoolean(userMeta, 'workEmailVerified', 'work_email_verified') ??
      false,
    designation: readMetaString(userMeta, 'designation') ?? null,
    personaCategory:
      readMetaString(userMeta, 'personaCategory', 'persona_category') ?? null,
    mentorshipScope:
      readMetaString(userMeta, 'mentorshipScope', 'mentorship_scope') ?? null,
    bandwidthShield:
      readMetaString(userMeta, 'bandwidthShield', 'bandwidth_shield') ?? null,
    totalExpYears:
      readMetaNumber(userMeta, 'totalExpYears', 'total_exp_years') ?? null,
    canPostJobs:
      readMetaBoolean(meta, 'canPostJobs', 'can_post_jobs') ??
      (role === 'alumni' && verificationStatus === 'verified'),
  };
}

/** Maps joined DB row records into a canonical SessionUser DTO. */
export function mapDbRecordToSessionUser(record: {
  user: typeof users.$inferSelect;
  institutionSlug?: string | null;
  studentProfile?: typeof studentProfiles.$inferSelect | null;
  alumniProfile?: typeof alumniProfiles.$inferSelect | null;
}): SessionUser {
  const { user, institutionSlug, studentProfile, alumniProfile } = record;
  const techStack =
    user.role === 'alumni'
      ? (alumniProfile?.techStackExpertise ?? [])
      : (studentProfile?.techStack ?? []);

  return {
    id: user.id,
    legacyCode: user.legacyCode ?? null,
    institutionId: user.institutionId,
    institutionSlug: institutionSlug ?? 'iter-soa',
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    verificationStatus: user.verificationStatus,
    avatarUrl: user.avatarUrl,
    bannerUrl: user.bannerUrl,
    linkedinUrl: user.linkedinUrl ?? null,
    githubHandle: user.githubHandle ?? null,
    headline: user.headline,
    regNo: studentProfile?.regNo ?? null,
    academicYear: studentProfile?.academicYear ?? null,
    branch: studentProfile?.branch ?? null,
    cgpa: studentProfile?.cgpa ?? null,
    bio: studentProfile?.bio ?? null,
    techStack,
    batchYear: alumniProfile?.batchYear ?? null,
    company: alumniProfile?.company ?? null,
    workEmail: alumniProfile?.workEmail ?? null,
    workEmailVerified: alumniProfile?.workEmailVerified ?? false,
    designation: alumniProfile?.designation ?? null,
    personaCategory: alumniProfile?.personaCategory ?? null,
    mentorshipScope: alumniProfile?.mentorshipScope ?? null,
    bandwidthShield: alumniProfile?.bandwidthShield ?? null,
    totalExpYears: alumniProfile?.totalExpYears ?? null,
    canPostJobs:
      alumniProfile?.canPostJobs ??
      (user.role === 'alumni' && user.verificationStatus === 'verified'),
  };
}

/**
 * Refreshes a resolved SessionUser against live PostgreSQL (when configured)
 * or the seeded fallback store so status transitions (e.g. Dean approval)
 * take effect immediately without requiring re-login.
 */
export async function hydrateLiveSessionUser(
  baseUser: SessionUser,
): Promise<SessionUser> {
  if (isDatabaseConfigured()) {
    try {
      const db = getDb();
      let [row] = await db
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
        .where(eq(users.id, baseUser.id))
        .limit(1);

      if (!row && baseUser.email) {
        [row] = await db
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
          .where(eq(users.email, baseUser.email.toLowerCase()))
          .limit(1);
      }

      if (row) {
        return mapDbRecordToSessionUser(row);
      }
    } catch {
      // Fall back to in-memory store if database is unreachable or unmigrated.
    }
  }

  const store = getFallbackStore();
  const normalizedEmail = baseUser.email.trim().toLowerCase();
  const liveFallbackUser =
    store.users.find((u) => u.id === baseUser.id) ??
    (normalizedEmail
      ? store.users.find((u) => u.email.toLowerCase() === normalizedEmail)
      : undefined);

  return liveFallbackUser ? { ...liveFallbackUser } : baseUser;
}

/**
 * Resolves the authenticated SessionUser from Supabase SSR when configured,
 * falling back to the signed HTTP-only demo session cookie when demo mode is enabled,
 * and always refreshes live status/profile fields from DB or fallback store.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createSupabaseServerClient();
      if (supabase) {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (!error && user) {
          return hydrateLiveSessionUser(mapSupabaseUserToSessionUser(user));
        }
      }
    } catch {
      // Fall through to demo cookie if enabled, or return null.
    }
  }

  const demoUser = await readDemoSessionCookie();
  if (!demoUser) {
    return null;
  }

  return hydrateLiveSessionUser(demoUser);
}

/** Returns the default curated demo persona for a given role from the seeded store. */
export function getDefaultPersonaForRole(role: UserRole): SessionUser | null {
  const { users: storeUsers } = getFallbackStore();

  if (role === 'student') {
    return (
      storeUsers.find(
        (u) => u.role === 'student' && u.fullName === 'Ananya Dash',
      ) ??
      storeUsers.find((u) => u.role === 'student') ??
      null
    );
  }

  if (role === 'alumni') {
    return (
      storeUsers.find(
        (u) => u.role === 'alumni' && u.fullName === 'Debadatta Rath',
      ) ??
      storeUsers.find(
        (u) => u.role === 'alumni' && u.verificationStatus === 'verified',
      ) ??
      storeUsers.find((u) => u.role === 'alumni') ??
      null
    );
  }

  return (
    storeUsers.find(
      (u) => u.role === 'dean' && u.fullName === 'Prof. Sujit Kumar Patra',
    ) ??
    storeUsers.find((u) => u.role === 'dean') ??
    null
  );
}

/**
 * Lists curated demo personas across Student, Verified Alumni, Pending Review Alumni,
 * and Dean roles for the Demo Persona Switcher.
 */
export function listDemoPersonas(): SessionUser[] {
  const { users: storeUsers } = getFallbackStore();
  const preferredOrder = [
    'user_stu_02', // Ananya Dash (4th Year CSE Student)
    'user_stu_01', // Aarav Mohanty (4th Year CSE Student)
    'user_alum_01', // Debadatta Rath (Verified Alumni — Startup Founder)
    'user_alum_03', // Priyadarshini Mohanty (Verified Alumni — HR / Talent Acquisition)
    'user_alum_pending_01', // Soumyajit Mishra (Pending Review Alumni)
    'user_alum_pending_02', // Ankita Panda (Pending Review Alumni)
    'user_dean_01', // Prof. Sujit Kumar Patra (Dean of Placements)
  ];

  const seen = new Set<string>();
  const personas: SessionUser[] = [];

  for (const id of preferredOrder) {
    const match = storeUsers.find((u) => u.id === id);
    if (match && !seen.has(match.id)) {
      seen.add(match.id);
      personas.push(match);
    }
  }

  return personas;
}

/** Requires an authenticated session or throws AuthError('UNAUTHORIZED'). */
export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    throw new AuthError('UNAUTHORIZED');
  }
  return user;
}

/** Requires an authenticated session whose role is included in `roles`. */
export async function requireRole(roles: UserRole[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new AuthError(
      'FORBIDDEN',
      `Requires one of roles: ${roles.join(', ')}.`,
    );
  }
  return user;
}

/** Requires an authenticated alumni account with `verificationStatus === 'verified'`. */
export async function requireVerifiedAlumni(): Promise<SessionUser> {
  const user = await requireRole(['alumni']);
  if (user.verificationStatus !== 'verified') {
    throw new AuthError(
      'UNVERIFIED_ALUMNI',
      'Your alumni account must be verified by the Dean before performing this action.',
    );
  }
  return user;
}
