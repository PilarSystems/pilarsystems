// src/middleware.ts
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabaseServer';

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // ❗ Geschützte Routen
  const protectedRoutes = ['/dashboard', '/dashboard/', '/dashboard/settings'];

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // User NICHT eingeloggt → sofort zum Login
  if (!user && protectedRoutes.some((p) => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/login-01', req.url));
  }

  // Eingeloggt → Subscription prüfen
  if (user && protectedRoutes.some((p) => pathname.startsWith(p))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', user.id)
      .single();

    // Kein Profil oder kein aktives Abo
    if (!profile || profile.subscription_status !== 'active') {
      return NextResponse.redirect(new URL('/checkout', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
