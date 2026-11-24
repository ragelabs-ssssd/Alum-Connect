import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from '@/lib/env';

/**
 * Creates a server-only Supabase admin client using SUPABASE_SERVICE_ROLE_KEY,
 * or returns null when unconfigured or called outside a server runtime.
 */
export function createSupabaseAdminClient(): SupabaseClient | null {
  if (typeof window !== 'undefined') {
    return null;
  }

  const publicEnv = getSupabasePublicEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!publicEnv || !serviceRoleKey) {
    return null;
  }

  return createClient(publicEnv.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const createAdminClient = createSupabaseAdminClient;
