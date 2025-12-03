'use client'

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'Supabase: Env-Variablen fehlen (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY)'
    )
    throw new Error('Supabase: Env-Variablen fehlen')
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
