'use server';

import { z } from 'zod';
import { unifiedSearchQuery } from '@/modules/search/queries';
import type { SearchHitDTO } from '@/types/domain';

const unifiedSearchInputSchema = z.object({
  q: z.string().trim().max(160),
  scope: z
    .enum(['all', 'students', 'alumni', 'builds', 'jobs'])
    .optional()
    .default('all'),
  limit: z.number().int().min(1).max(40).optional().default(12),
});

/**
 * Server Action wrapper around `unifiedSearchQuery` for command palettes and
 * portal navbar search dropdowns.
 */
export async function unifiedSearchAction(input: {
  q: string;
  scope?: 'all' | 'students' | 'alumni' | 'builds' | 'jobs';
  limit?: number;
}): Promise<SearchHitDTO[]> {
  const parsed = unifiedSearchInputSchema.safeParse(input);
  if (!parsed.success || parsed.data.q.length === 0) {
    return [];
  }

  return unifiedSearchQuery({
    q: parsed.data.q,
    scope: parsed.data.scope,
    limit: parsed.data.limit,
  });
}
