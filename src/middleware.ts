// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl.clone();
  const path = url.pathname;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Wenn Supabase-Env fehlt → keine Auth-Logik, Seite normal durchlassen
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[middleware] Supabase Env fehlt, überspringe Auth.');
    return res;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        return req.cookies.get(name)?.value;
      },
      set(name, value, options) {
        res.cookies.set({
          name,
          value,
          ...options,
        });
      },
      remove(name, options) {
        res.cookies.set({
          name,
          value: '',
          ...options,
          maxAge: 0,
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = path.startsWith('/login-01') || path.startsWith('/signup-01');

  // ⚠️ Nur das Dashboard ist geschützt – NICHT /checkout!
  const isProtectedRoute = path.startsWith('/dashboard');

  // Nicht eingeloggt & will ins Dashboard → auf Login mit redirectTo
  if (isProtectedRoute && !user) {
    const redirectTo = encodeURIComponent(path + (url.search || ''));
    url.pathname = '/login-01';
    url.search = `?redirectTo=${redirectTo}`;
    return NextResponse.redirect(url);
  }

  // Schon eingeloggt & geht auf Login/Signup → direkt ins Dashboard
  if (isAuthRoute && user) {
    url.pathname = '/dashboard';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return res;
}

// Nur auf diese Routen anwenden
export const config = {
  matcher: ['/dashboard/:path*', '/login-01', '/signup-01'],
};
