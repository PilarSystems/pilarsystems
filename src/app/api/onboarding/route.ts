// src/app/api/onboarding/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log('🔧 Onboarding-Payload erhalten:', body);

    // TODO: Hier später:
    // - Aktuellen User über Stripe / Session matchen
    // - Workspace / Profile in Supabase updaten
    //   z.B. workspace_settings, channels, voice_profile etc.

    if (!supabaseAdmin) {
      console.warn(
        '⚠️ Supabase Admin ist nicht konfiguriert – Daten werden nicht in die DB geschrieben (nur Logging).'
      );
      return NextResponse.json({ ok: true, skippedDb: true });
    }

    // Beispiel-Struktur (anpassen, sobald Tabellen stehen)
    // await supabaseAdmin.from('workspace_settings').upsert({
    //   user_id: userId,
    //   gym: body.gym,
    //   channels: body.channels,
    //   voice: body.voice,
    // });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('❌ Fehler im Onboarding-API-Handler:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
