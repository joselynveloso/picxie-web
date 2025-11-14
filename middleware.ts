import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware check for path:', request.nextUrl.pathname);

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Use environment variables with fallback to hardcoded values for development
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ampxyzotiiqmwcwsdfut.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHh5em90aWlxbXdjd3NkZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzcwNTEsImV4cCI6MjA3ODA1MzA1MX0.sicapw4FxmgfVWK0GnfJS2KIZKUB8gkVAxHL4yRxtK8';

  // Create Supabase client with simplified cookie handling
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
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

  try {
    // Get session
    const { data: { session }, error } = await supabase.auth.getSession();

    console.log('🔍 Session check result:', session ? `✅ ${session.user.email}` : '❌ No session');

    if (error) {
      console.error('🔴 Middleware auth error:', error);
    }

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth');

    // If no session and not on auth page, redirect to login
    if (!session && !isAuthPage) {
      console.log('🔒 No session, redirecting to login from:', request.nextUrl.pathname);
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // If session exists and on auth page, redirect to home
    if (session && isAuthPage) {
      console.log('✅ Has session on auth page, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log('✅ Allowing access to:', request.nextUrl.pathname);
    return response;
  } catch (err) {
    console.error('🔴 Middleware error:', err);
    // On error, allow through to prevent infinite loops
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
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
