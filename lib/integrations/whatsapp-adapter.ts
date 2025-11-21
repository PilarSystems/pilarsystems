/**
 * WhatsApp Adapter with Graceful Degradation
 */

import { isWhatsAppAvailable } from './index'
import { logger } from '@/lib/logger'

export async function sendWhatsAppMessage(to: string, message: string, workspaceId: string) {
  const status = isWhatsAppAvailable()
  
  if (!status.available) {
    logger.warn({ workspaceId, to }, `WhatsApp not available: ${status.reason}`)
    return {
      success: false,
      error: status.reason,
      messageId: null
    }
  }
  
  try {
    const envModule = await import('@/lib/config/env')
    const env = envModule.env
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/\D/g, ''), // Remove non-digits
          type: 'text',
          text: { body: message }
        })
      }
    )
    
    if (!response.ok) {
      throw new Error(`WhatsApp API error: ${response.statusText}`)
    }
    
    const data = await response.json()
    
    logger.info({ workspaceId, to, messageId: data.messages?.[0]?.id }, 'WhatsApp message sent')
    
    return {
      success: true,
      messageId: data.messages?.[0]?.id
    }
  } catch (error) {
    logger.error({ error, workspaceId, to }, 'Failed to send WhatsApp message')
    return {
      success: false,
      error: 'Fehler beim Senden der WhatsApp-Nachricht',
      messageId: null
    }
  }
}

export async function getWhatsAppConversationHistory(phoneNumber: string, workspaceId: string) {
  const status = isWhatsAppAvailable()
  
  if (!status.available) {
    return {
      success: false,
      error: status.reason,
      messages: []
    }
  }
  
  // This would typically query your database for stored messages
  // For now, return empty array with success
  return {
    success: true,
    messages: []
  }
}
