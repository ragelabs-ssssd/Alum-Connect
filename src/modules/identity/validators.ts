import { z } from 'zod';

export const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.in',
  'yahoo.in',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'proton.me',
  'protonmail.com',
  'aol.com',
  'rediffmail.com',
  'zoho.com',
]);

/**
 * Checks whether a corporate `workEmail` uses a non-free domain that matches
 * the stated `company` name (used for automatic vs. Dean-reviewed alumni onboarding).
 */
export function isCorporateDomainMatch(
  workEmail: string | undefined | null,
  company: string | undefined | null,
): boolean {
  const email = workEmail?.trim().toLowerCase();
  const comp = company?.trim().toLowerCase();
  if (!email || !comp) return false;

  const atIdx = email.lastIndexOf('@');
  if (atIdx <= 0 || atIdx === email.length - 1) return false;

  const domain = email.slice(atIdx + 1);
  if (!domain || FREE_EMAIL_DOMAINS.has(domain)) {
    return false;
  }

  // Extract domain primary label (e.g., "atlassian" from "atlassian.com" or "swiggy" from "swiggy.in")
  const domainParts = domain.split('.').filter(Boolean);
  if (domainParts.length < 2) return false;

  const domainRoot = (
    domainParts.length >= 3 && domainParts[domainParts.length - 2] === 'co'
      ? domainParts[domainParts.length - 3]
      : domainParts[0]
  ).replace(/[^a-z0-9]/g, '');

  if (domainRoot.length < 2) return false;

  const normalizedCompany = comp.replace(/[^a-z0-9]/g, '');
  if (normalizedCompany.includes(domainRoot)) {
    return true;
  }

  const companyTokens = comp
    .split(/[^a-z0-9]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);

  return companyTokens.some(
    (token) => domainRoot.includes(token) || token.includes(domainRoot),
  );
}

function isValidLinkedinUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return (
      (url.protocol === 'https:' || url.protocol === 'http:') &&
      (host === 'linkedin.com' ||
        host === 'www.linkedin.com' ||
        host.endsWith('.linkedin.com')) &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
}

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .refine(
      (v) => v === undefined || v.length >= 6,
      'Password must be at least 6 characters.',
    ),
  role: z.enum(['student', 'alumni', 'dean']).optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    role: z.enum(['student', 'alumni']),
    fullName: z
      .string()
      .trim()
      .min(2, 'Full name must be at least 2 characters.')
      .max(100, 'Full name must be under 100 characters.'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address.'),
    password: z
      .string()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined))
      .refine(
        (v) => v === undefined || v.length >= 6,
        'Password must be at least 6 characters.',
      ),
    linkedinUrl: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    githubHandle: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v.replace(/^@/, '') : undefined)),
    headline: z.string().trim().max(180).optional(),
    techStack: z.array(z.string().trim().min(1)).max(20).optional(),
    // Student fields
    regNo: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    academicYear: z.string().trim().optional(),
    branch: z.string().trim().optional(),
    cgpa: z.number().min(0).max(10).optional(),
    bio: z.string().trim().max(600).optional(),
    // Alumni fields
    batchYear: z.number().int().min(1985).max(2030).optional(),
    company: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    designation: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    workEmail: z
      .string()
      .trim()
      .toLowerCase()
      .optional()
      .transform((v) => (v && v.length > 0 ? v : undefined)),
    personaCategory: z.string().trim().optional(),
    mentorshipScope: z.string().trim().max(240).optional(),
    proofNote: z.string().trim().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'student') {
      if (!data.regNo || !/^\d{10}$/.test(data.regNo)) {
        ctx.addIssue({
          code: 'custom',
          path: ['regNo'],
          message:
            'ITER registration number must be exactly 10 digits (e.g. 2341016089).',
        });
      }
      if (data.linkedinUrl && !isValidLinkedinUrl(data.linkedinUrl)) {
        ctx.addIssue({
          code: 'custom',
          path: ['linkedinUrl'],
          message: 'Please provide a valid LinkedIn profile URL.',
        });
      }
    }

    if (data.role === 'alumni') {
      if (!data.linkedinUrl || !isValidLinkedinUrl(data.linkedinUrl)) {
        ctx.addIssue({
          code: 'custom',
          path: ['linkedinUrl'],
          message:
            'A valid LinkedIn profile URL (https://linkedin.com/in/...) is required for alumni verification.',
        });
      }
      if (!data.company || data.company.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['company'],
          message: 'Current company name is required.',
        });
      }
      if (!data.designation || data.designation.length < 2) {
        ctx.addIssue({
          code: 'custom',
          path: ['designation'],
          message: 'Current role / designation is required.',
        });
      }
      if (data.workEmail) {
        const emailCheck = z.string().email().safeParse(data.workEmail);
        if (!emailCheck.success) {
          ctx.addIssue({
            code: 'custom',
            path: ['workEmail'],
            message: 'Please enter a valid corporate work email address.',
          });
        }
      }
    }
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

export const switchPersonaSchema = z.object({
  userId: z.string().trim().min(1, 'Persona userId is required.'),
});

export type SwitchPersonaInput = z.infer<typeof switchPersonaSchema>;

export const toggleFollowSchema = z.object({
  targetUserId: z.string().trim().min(1, 'Target userId is required.'),
});

export type ToggleFollowInput = z.infer<typeof toggleFollowSchema>;
