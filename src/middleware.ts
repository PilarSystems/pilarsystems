// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          res.cookies.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );

  const { data } = await supabase.auth.getUser();

  // Geschützte Routen
  const protectedRoutes = ['/dashboard', '/onboarding'];

  if (protectedRoutes.some((p) => req.nextUrl.pathname.startsWith(p))) {
    if (!data.user) {
      return NextResponse.redirect(new URL('/login-01', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/onboarding/:path*'],
};
