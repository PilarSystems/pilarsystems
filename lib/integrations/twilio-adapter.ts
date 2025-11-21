/**
 * Twilio Adapter with Graceful Degradation
 */

import { isTwilioAvailable } from './index'
import { logger } from '@/lib/logger'

export async function createTwilioSubaccount(workspaceId: string, workspaceName: string) {
  const status = isTwilioAvailable()
  
  if (!status.available) {
    logger.warn({ workspaceId }, `Twilio not available: ${status.reason}`)
    return {
      success: false,
      error: status.reason,
      subaccountSid: null,
      phoneNumber: null
    }
  }
  
  try {
    // Dynamic import to avoid loading SDK when not needed
    const twilio = await import('twilio')
    const { env } = await import('@/lib/config/env')
    
    const client = twilio.default(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)
    
    // Create subaccount
    const subaccount = await client.api.accounts.create({
      friendlyName: `${workspaceName} (${workspaceId})`
    })
    
    logger.info({ workspaceId, subaccountSid: subaccount.sid }, 'Twilio subaccount created')
    
    return {
      success: true,
      subaccountSid: subaccount.sid,
      authToken: subaccount.authToken,
      phoneNumber: null // Phone number provisioning happens separately
    }
  } catch (error) {
    logger.error({ error, workspaceId }, 'Failed to create Twilio subaccount')
    return {
      success: false,
      error: 'Fehler beim Erstellen des Twilio-Subaccounts',
      subaccountSid: null,
      phoneNumber: null
    }
  }
}

export async function provisionPhoneNumber(subaccountSid: string, areaCode?: string) {
  const status = isTwilioAvailable()
  
  if (!status.available) {
    logger.warn('Twilio not available for phone provisioning')
    return {
      success: false,
      error: status.reason,
      phoneNumber: null
    }
  }
  
  try {
    const twilio = await import('twilio')
    const { env } = await import('@/lib/config/env')
    
    const client = twilio.default(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN)
    
    // Search for available phone numbers
    const numbers = await client.availablePhoneNumbers('DE')
      .local
      .list({ areaCode, limit: 1 })
    
    if (numbers.length === 0) {
      return {
        success: false,
        error: 'Keine verfügbaren Telefonnummern gefunden',
        phoneNumber: null
      }
    }
    
    // Purchase the number for the subaccount
    const purchasedNumber = await client.incomingPhoneNumbers.create({
      phoneNumber: numbers[0].phoneNumber,
      accountSid: subaccountSid
    })
    
    logger.info({ subaccountSid, phoneNumber: purchasedNumber.phoneNumber }, 'Phone number provisioned')
    
    return {
      success: true,
      phoneNumber: purchasedNumber.phoneNumber
    }
  } catch (error) {
    logger.error({ error, subaccountSid }, 'Failed to provision phone number')
    return {
      success: false,
      error: 'Fehler beim Bereitstellen der Telefonnummer',
      phoneNumber: null
    }
  }
}
