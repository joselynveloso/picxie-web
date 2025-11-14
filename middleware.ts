import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { CookieOptions } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  console.log('🔍 Middleware - Path:', request.nextUrl.pathname);

  // Skip middleware for auth pages completely
  if (request.nextUrl.pathname.startsWith('/auth')) {
    console.log('ℹ️ Auth page - allowing access');
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ampxyzotiiqmwcwsdfut.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcHh5em90aWlxbXdjd3NkZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0NzcwNTEsImV4cCI6MjA3ODA1MzA1MX0.sicapw4FxmgfVWK0GnfJS2KIZKUB8gkVAxHL4yRxtK8';

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          get(name: string) {
            return request.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
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
          remove(name: string, options: CookieOptions) {
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

    // Use getUser() instead of getSession() for more reliable middleware checks
    const { data: { user }, error } = await supabase.auth.getUser();

    console.log('🔍 User check:', user ? `✅ ${user.email}` : '❌ None', error ? `Error: ${error.message}` : '');

    if (!user) {
      console.log('🔒 No user - redirecting to login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    console.log('✅ User authenticated - allowing access');
    return response;
  } catch (error) {
    console.error('🔴 Middleware error:', error);
    // On error, allow through to prevent infinite loops
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files and auth pages
     */
    '/((?!_next/static|_next/image|favicon.ico|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
