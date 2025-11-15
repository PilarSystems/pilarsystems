// src/lib/supabaseServer.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Typ, falls du ihn irgendwo brauchst
export type SupabaseServerClient = Awaited<
  ReturnType<typeof createSupabaseServerClient>
>;

export async function createSupabaseServerClient() {
  // In Next 15/16 ist cookies() async
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Wichtig: Supabase erwartet getAll / setAll – NICHT get / set / remove
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // In RSC können cookies readonly sein – deshalb try/catch
              cookieStore.set(name, value, options);
            });
          } catch {
            // Server Component → cookies sind readonly, ignorieren
          }
        },
      },
    }
  );

  return supabase;
}
