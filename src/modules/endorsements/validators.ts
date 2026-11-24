import { z } from 'zod';

export const endorseOrVouchSchema = z.object({
  targetType: z.enum(['project', 'paper']),
  targetId: z.string().trim().min(1, 'Target build ID is required.'),
  kind: z.enum(['endorsement', 'roast', 'vouch']),
  category: z.string().trim().min(2, 'Category must be at least 2 characters.').max(80),
  quote: z.string().trim().min(10, 'Feedback quote must be at least 10 characters.').max(1200),
  certifiedSkills: z
    .array(z.string().trim().min(1).max(60))
    .max(12)
    .default([]),
  rating: z.number().int().min(1).max(5).default(5),
});

export type EndorseOrVouchInput = z.infer<typeof endorseOrVouchSchema>;

export const toggleRoastResolvedSchema = z.object({
  endorsementId: z.string().trim().min(1, 'Endorsement ID is required.'),
});

export type ToggleRoastResolvedInput = z.infer<typeof toggleRoastResolvedSchema>;
