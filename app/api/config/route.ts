export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getPublicFeatureFlags } from '@/lib/config/env'


export const runtime = 'nodejs'

/**
 * Public feature flags endpoint
 * Returns which features are enabled based on environment configuration
 * Safe to call from client-side code
 */
export async function GET() {
  try {
    const flags = getPublicFeatureFlags()
    
    return NextResponse.json({
      success: true,
      flags,
    })
  } catch (error) {
    console.error('Failed to get feature flags:', error)
    
    return NextResponse.json({
      success: true,
      flags: {
        twilioAutoProvisioningEnabled: false,
        stripeEnabled: false,
        openaiEnabled: false,
        elevenlabsEnabled: false,
        whatsappEnabled: true,
        emailEnabled: true,
        googleCalendarEnabled: false,
        n8nEnabled: false,
        encryptionReady: false,
      },
    })
  }
}
