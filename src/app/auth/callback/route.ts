import { NextResponse, type NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { createSupabaseServerClient } from '@/lib/supabase/server';

function sanitizeNextPath(rawNext: string | null): string | null {
  if (!rawNext) return null;
  const trimmed = rawNext.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || trimmed.startsWith('/\\')) {
    return null;
  }
  return trimmed;
}

function buildRedirectBase(request: NextRequest): string {
  const { origin } = request.nextUrl;
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https';
  if (forwardedHost && process.env.NODE_ENV !== 'development') {
    return `${forwardedProto}://${forwardedHost}`;
  }
  return origin;
}

/**
 * Supabase OAuth PKCE callback Route Handler: exchanges `code` for session cookies,
 * safely validates the `next` redirect target, and routes to the user's portal.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');
  const requestedNext = sanitizeNextPath(searchParams.get('next'));
  const redirectBase = buildRedirectBase(request);

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=oauth_callback_failed', redirectBase),
    );
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.redirect(
      new URL(requestedNext ?? '/login', redirectBase),
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL('/login?error=oauth_callback_failed', redirectBase),
    );
  }

  const sessionUser = await getSessionUser();
  const roleDefault =
    sessionUser?.role === 'dean'
      ? '/dean'
      : sessionUser?.role === 'alumni'
        ? '/alumni'
        : '/student';

  return NextResponse.redirect(
    new URL(requestedNext ?? roleDefault, redirectBase),
  );
}
