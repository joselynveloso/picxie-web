import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('🔍 Middleware check for path:', req.nextUrl.pathname);

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  try {
    // Use environment variables with fallback to hardcoded values for development
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ampxyzotiiqmwcwsdfut.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHh5em90aWlxbXdjd3NkZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzcwNTEsImV4cCI6MjA3ODA1MzA1MX0.sicapw4FxmgfVWK0GnfJS2KIZKUB8gkVAxHL4yRxtK8';

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            req.cookies.set({
              name,
              value,
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: req.headers,
              },
            });
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            req.cookies.set({
              name,
              value: '',
              ...options,
            });
            response = NextResponse.next({
              request: {
                headers: req.headers,
              },
            });
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    console.log('🔍 Session check result:', session ? `✅ ${session.user.email}` : '❌ No session');

    if (error) {
      console.error('🔴 Middleware auth error:', error);
      // On error, redirect to login to be safe
      if (!req.nextUrl.pathname.startsWith('/auth')) {
        console.log('🔄 Redirecting to login due to error');
        return NextResponse.redirect(new URL('/auth/login', req.url));
      }
    }

    // Auth pages - redirect to home if already logged in
    if (req.nextUrl.pathname.startsWith('/auth')) {
      if (session) {
        console.log('✅ User already logged in, redirecting to home from auth page');
        return NextResponse.redirect(new URL('/', req.url));
      }
      console.log('ℹ️ No session, allowing access to auth page');
      return response;
    }

    // Protected pages - redirect to login if not authenticated
    if (!session) {
      console.log('🔒 No session found, redirecting to login from:', req.nextUrl.pathname);
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    console.log('✅ Session valid, allowing access to:', req.nextUrl.pathname);
    return response;
  } catch (err) {
    console.error('🔴 Middleware error:', err);
    // On unexpected error, allow through to prevent infinite loops
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
