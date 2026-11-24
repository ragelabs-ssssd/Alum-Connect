import { cacheLife, cacheTag } from 'next/cache';
import { getEcosystemStatsQuery } from '@/modules/builds/queries';
import type { EcosystemStatsDTO } from '@/types/domain';

/**
 * Cached institutional ecosystem counters (`buildsCount`, `projectsCount`,
 * `papersCount`, `studentsCount`, `alumniCount`, `openDealsCount`, `offersCount`).
 * Uses Next.js 16 `'use cache'` with `cacheTag('ecosystem-stats')` and never reads
 * `cookies()` or `headers()`.
 */
export async function getCachedEcosystemStats(): Promise<EcosystemStatsDTO> {
  'use cache';
  cacheTag('ecosystem-stats');
  cacheLife('minutes');

  return getEcosystemStatsQuery();
}
