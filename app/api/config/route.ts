export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getPublicFeatureFlags } from '@/lib/config/env'
import { logger } from '@/lib/logger'

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
    logger.error({ error }, 'Failed to get feature flags')
    
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
