import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabasePublicEnv } from '@/lib/env';

/**
 * Next.js 16 Proxy: refreshes Supabase SSR auth cookies when configured and
 * applies baseline security headers across matched routes.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabaseEnv = getSupabasePublicEnv();
  if (supabaseEnv) {
    try {
      const supabase = createServerClient(
        supabaseEnv.url,
        supabaseEnv.anonKey,
        {
          cookies: {
            getAll() {
              return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => {
                request.cookies.set(name, value);
              });
              response = NextResponse.next({
                request,
              });
              cookiesToSet.forEach(({ name, value, options }) => {
                response.cookies.set(name, value, options);
              });
            },
          },
        },
      );

      await supabase.auth.getUser();
    } catch {
      // Do not block requests if Supabase auth refresh encounters a transient error.
    }
  }

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|otf|eot)$).*)',
  ],
};
