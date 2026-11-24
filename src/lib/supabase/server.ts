import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { getSupabasePublicEnv } from '@/lib/env';

/**
 * Creates a request-scoped Supabase server client using Next.js 16 async cookies(),
 * or returns null when Supabase environment variables are not configured.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient | null> {
  const env = getSupabasePublicEnv();
  if (!env) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called inside a Server Component render where mutating cookies is disallowed;
          // Next.js proxy handles session refresh writes on the response.
        }
      },
    },
  });
}

export const createClient = createSupabaseServerClient;
