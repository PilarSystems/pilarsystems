// src/lib/supabaseClient.ts
'use client';

import { createBrowserClient } from '@supabase/ssr';

// Optional: falls du später dein eigenes Typ-Interface hast
// import type { Database } from '@/types/supabase';

let supabaseBrowserClient: ReturnType<typeof createBrowserClient> | null = null;

export function createSupabaseBrowserClient() {
  if (!supabaseBrowserClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error(
        'Supabase Browser: Env-Variablen fehlen (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)',
      );
      throw new Error('Supabase Browser: Env-Variablen fehlen');
    }

    // Wenn du ein Database-Interface hast:
    // supabaseBrowserClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);

    supabaseBrowserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseBrowserClient;
}

// optionaler Default-Export, falls du ihn irgendwo brauchst
export default createSupabaseBrowserClient;
