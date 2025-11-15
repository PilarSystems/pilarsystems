// src/lib/supabaseAdmin.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Wir lesen beide Variablen, falls du später SUPABASE_URL nutzt
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    'Supabase Admin: Env-Variablen fehlen (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY). ' +
      'supabaseAdmin wird als null exportiert.'
  );
}

// Entweder ein echter Client – oder null, damit der Build nicht crasht
export const supabaseAdmin: SupabaseClient | null =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
        },
      })
    : null;
