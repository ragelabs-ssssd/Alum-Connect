import { z } from 'zod';

const DEFAULT_VOUCH_HMAC_SECRET = 'dev-almaconnect-vouch-hmac-secret-change-in-prod';
const DEFAULT_DEMO_SESSION_SECRET = 'dev-almaconnect-demo-session-secret-change-in-prod';
const DEFAULT_APP_URL = 'http://localhost:3000';

const trimmedOptionalString = z
  .string()
  .optional()
  .transform((val) => {
    const trimmed = val?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : undefined;
  });

const optionalHttpUrl = z
  .string()
  .optional()
  .transform((val) => {
    const trimmed = val?.trim();
    if (!trimmed) return undefined;
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed.toString().replace(/\/+$/, '');
      }
      return undefined;
    } catch {
      return undefined;
    }
  });

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: optionalHttpUrl,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: trimmedOptionalString,
  NEXT_PUBLIC_DEMO_MODE: trimmedOptionalString,
  NEXT_PUBLIC_APP_URL: optionalHttpUrl,
});

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: trimmedOptionalString,
  VOUCH_HMAC_SECRET: trimmedOptionalString,
  DEMO_SESSION_SECRET: trimmedOptionalString,
});

function readPublicEnv() {
  // Explicit property access is required so Next.js can inline NEXT_PUBLIC_* vars in client bundles.
  const raw = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  };
  const parsed = publicEnvSchema.safeParse(raw);
  return parsed.success
    ? parsed.data
    : {
        NEXT_PUBLIC_SUPABASE_URL: undefined,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: undefined,
        NEXT_PUBLIC_DEMO_MODE: undefined,
        NEXT_PUBLIC_APP_URL: undefined,
      };
}

function readServerEnv() {
  if (typeof window !== 'undefined') {
    return {
      SUPABASE_SERVICE_ROLE_KEY: undefined,
      VOUCH_HMAC_SECRET: undefined,
      DEMO_SESSION_SECRET: undefined,
    };
  }
  const parsed = serverEnvSchema.safeParse({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    VOUCH_HMAC_SECRET: process.env.VOUCH_HMAC_SECRET,
    DEMO_SESSION_SECRET: process.env.DEMO_SESSION_SECRET,
  });
  return parsed.success
    ? parsed.data
    : {
        SUPABASE_SERVICE_ROLE_KEY: undefined,
        VOUCH_HMAC_SECRET: undefined,
        DEMO_SESSION_SECRET: undefined,
      };
}

export interface SupabasePublicEnv {
  url: string;
  anonKey: string;
}

/** Returns public Supabase URL and anon key when both are configured, or null otherwise. */
export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const env = readPublicEnv();
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }
  return {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };
}

/** True when valid public Supabase credentials are configured. */
export function isSupabaseConfigured(): boolean {
  return getSupabasePublicEnv() !== null;
}

/**
 * True when the one-click Demo Persona Switcher and fallback session mode are enabled.
 * Defaults to true when Supabase is not configured unless explicitly set to "false".
 */
export function isDemoModeEnabled(): boolean {
  const env = readPublicEnv();
  const flag = env.NEXT_PUBLIC_DEMO_MODE?.toLowerCase();
  if (flag === 'true' || flag === '1') return true;
  if (flag === 'false' || flag === '0') return false;
  return !isSupabaseConfigured();
}

/** Server-only Supabase service role key, or null when unconfigured or called in the browser. */
export function getSupabaseServiceRoleKey(): string | null {
  if (typeof window !== 'undefined') return null;
  return readServerEnv().SUPABASE_SERVICE_ROLE_KEY ?? null;
}

/** Server-only HMAC secret used to sign and verify Vouch certificates. */
export function getVouchHmacSecret(): string {
  return readServerEnv().VOUCH_HMAC_SECRET ?? DEFAULT_VOUCH_HMAC_SECRET;
}

/** Server-only HMAC secret used to sign and verify HTTP-only demo session cookies. */
export function getDemoSessionSecret(): string {
  return readServerEnv().DEMO_SESSION_SECRET ?? DEFAULT_DEMO_SESSION_SECRET;
}

/** Canonical public base URL of the application without a trailing slash. */
export function getAppUrl(): string {
  return readPublicEnv().NEXT_PUBLIC_APP_URL ?? DEFAULT_APP_URL;
}
