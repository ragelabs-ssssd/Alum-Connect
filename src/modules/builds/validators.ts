import { z } from 'zod';

export const publishBuildSchema = z.object({
  buildType: z.enum(['project', 'paper']).default('project'),
  status: z.enum(['draft', 'published']).default('published'),
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters.')
    .max(180, 'Title cannot exceed 180 characters.'),
  subtitle: z.string().trim().max(260).optional().default(''),
  shortDesc: z.string().trim().max(600).optional().default(''),
  story: z
    .string()
    .trim()
    .min(10, 'Detailed overview / abstract must be at least 10 characters.')
    .max(8000, 'Story cannot exceed 8000 characters.'),
  domain: z.string().trim().min(2).max(120).optional().default('Systems & AI'),
  techStack: z
    .array(z.string().trim().min(1).max(48))
    .max(20)
    .optional()
    .default([]),
  coverImage: z.string().trim().max(500).optional().default(''),
  // Project-specific fields
  collaborationMode: z.enum(['Solo', 'Group']).optional().default('Solo'),
  teamSize: z.number().int().min(1).max(12).optional().default(1),
  coContributorRegNos: z
    .array(z.string().trim().min(4).max(32))
    .max(10)
    .optional()
    .default([]),
  coContributors: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(120),
        regNo: z.string().trim().min(4).max(32),
        academicYear: z.string().trim().max(40).optional(),
      })
    )
    .max(10)
    .optional()
    .default([]),
  academicYears: z.string().trim().max(60).optional().default('4th Year'),
  liveUrl: z.string().trim().max(500).optional().default(''),
  hostingPlatform: z.string().trim().max(80).optional().default('Vercel'),
  githubUrl: z.string().trim().max(500).optional().default(''),
  demoVideoUrl: z.string().trim().max(500).optional().default(''),
  pitchVideoUrl: z.string().trim().max(500).optional().default(''),
  linkedPaperId: z.string().trim().max(120).nullable().optional(),
  openRole: z.string().trim().max(160).optional(),
  // Paper-specific fields
  venue: z
    .string()
    .trim()
    .max(160)
    .optional()
    .default('Preprint / ITER Research'),
  paperStatus: z
    .enum(['Draft', 'Under Peer Review', 'Accepted', 'Published'])
    .optional()
    .default('Under Peer Review'),
  authorMode: z.enum(['Solo', 'Dual']).optional().default('Solo'),
  coAuthorRegNo: z.string().trim().max(40).nullable().optional(),
  preprintUrl: z.string().trim().max(500).optional().default(''),
  pdfStoragePath: z.string().trim().max(500).nullable().optional(),
  guidanceNeeded: z
    .array(z.string().trim().min(1).max(100))
    .max(10)
    .optional()
    .default([]),
});

export type PublishBuildInput = z.input<typeof publishBuildSchema>;

export const toggleBuildSchema = z.object({
  targetType: z.enum(['project', 'paper']),
  targetId: z.string().trim().min(1, 'Target build ID is required.'),
});

export const toggleSaveSchema = z.object({
  itemType: z.enum(['project', 'paper', 'job']),
  itemId: z.string().trim().min(1, 'Item ID is required.'),
});

export const signUploadSchema = z.object({
  bucket: z.enum(['avatars', 'project-media', 'research-pdfs']),
  fileName: z.string().trim().min(1).max(180),
  mimeType: z.string().trim().min(3).max(120),
  sizeBytes: z.number().int().positive(),
});

export type SignUploadInput = z.infer<typeof signUploadSchema>;

export const feedFilterSchema = z.object({
  kind: z.enum(['all', 'project', 'paper']).optional().default('all'),
  domain: z.string().trim().max(120).optional(),
  search: z.string().trim().max(160).optional(),
  tech: z.string().trim().max(80).optional(),
  onlyMineForUserId: z.string().trim().optional(),
  cursor: z.string().trim().nullable().optional(),
  limit: z.number().int().min(1).max(60).optional().default(18),
});

export type FeedFilterInput = z.input<typeof feedFilterSchema>;
