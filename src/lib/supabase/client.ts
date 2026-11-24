import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getSupabasePublicEnv } from '@/lib/env';

/**
 * Creates a browser Supabase client using public credentials, or returns null
 * when Supabase environment variables are not configured (demo/fallback mode).
 */
export function createSupabaseBrowserClient(): SupabaseClient | null {
  const env = getSupabasePublicEnv();
  if (!env) {
    return null;
  }

  return createBrowserClient(env.url, env.anonKey);
}

export const createClient = createSupabaseBrowserClient;
