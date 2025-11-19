// src/lib/supabaseAdmin.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseAdminInstance: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance;
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
      'Supabase Admin: Env-Variablen fehlen (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY). ' +
        'supabaseAdmin wird als null exportiert.'
    );
    return null;
  }

  supabaseAdminInstance = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  });

  return supabaseAdminInstance;
}

export const supabaseAdmin: SupabaseClient | null = null;
