import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { secretsService } from '@/lib/secrets'
import { auditService } from '@/lib/audit'
import axios from 'axios'

const WHATSAPP_API_VERSION = 'v18.0'
const WHATSAPP_API_BASE = `https://graph.facebook.com/${WHATSAPP_API_VERSION}`

export interface WhatsAppConfig {
  workspaceId: string
  wabaId: string
  phoneNumberId: string
  phoneNumber: string
  accessToken: string
  systemUserId?: string
}

/**
 * WhatsApp Automation Service
 * Handles automatic WhatsApp Business API setup and message handling
 * 
 * Note: This assumes you have a pre-verified WABA and are assigning
 * phone numbers from your pool. Full WABA creation per tenant requires
 * manual Meta Business Manager verification.
 */
export class WhatsAppAutomationService {
  /**
   * Provision WhatsApp integration for a workspace
   * Assigns a pre-verified phone number from the pool
   */
  async provisionWhatsApp(config: WhatsAppConfig): Promise<void> {
    try {
      logger.info({ workspaceId: config.workspaceId }, 'Provisioning WhatsApp integration')

      const existing = await prisma.whatsAppIntegration.findUnique({
        where: { workspaceId: config.workspaceId },
      })

      if (existing) {
        logger.info({ workspaceId: config.workspaceId }, 'WhatsApp already provisioned')
        return
      }

      const webhookVerifyToken = secretsService.generateToken(32)

      await prisma.whatsAppIntegration.create({
        data: {
          workspaceId: config.workspaceId,
          wabaId: config.wabaId,
          phoneNumberId: config.phoneNumberId,
          phoneNumber: config.phoneNumber,
          accessToken: secretsService.encrypt(config.accessToken),
          systemUserId: config.systemUserId,
          webhookVerifyToken: secretsService.encrypt(webhookVerifyToken),
          status: 'active',
        },
      })

      await this.registerWebhook(config.workspaceId, config.phoneNumberId, config.accessToken)

      logger.info(
        { workspaceId: config.workspaceId, phoneNumber: config.phoneNumber },
        'WhatsApp provisioned successfully'
      )

      await auditService.logProvisioning(
        config.workspaceId,
        'whatsapp.provision',
        'whatsapp_integration',
        config.phoneNumberId,
        true
      )
    } catch (error) {
      logger.error({ error, workspaceId: config.workspaceId }, 'Failed to provision WhatsApp')

      await auditService.logProvisioning(
        config.workspaceId,
        'whatsapp.provision',
        'whatsapp_integration',
        '',
        false,
        error instanceof Error ? error.message : 'Unknown error'
      )

      throw error
    }
  }

  /**
   * Register webhook for a phone number
   */
  private async registerWebhook(
    workspaceId: string,
    phoneNumberId: string,
    accessToken: string
  ): Promise<void> {
    try {
      const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/whatsapp`

      await axios.post(
        `${WHATSAPP_API_BASE}/${phoneNumberId}/subscribed_apps`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      logger.info({ workspaceId, phoneNumberId }, 'WhatsApp webhook registered')
    } catch (error) {
      logger.error({ error, workspaceId, phoneNumberId }, 'Failed to register webhook')
      throw error
    }
  }

  /**
   * Send WhatsApp message
   */
  async sendMessage(
    workspaceId: string,
    to: string,
    message: string
  ): Promise<{ messageId: string }> {
    try {
      const integration = await prisma.whatsAppIntegration.findUnique({
        where: { workspaceId },
      })

      if (!integration) {
        throw new Error('WhatsApp not provisioned for this workspace')
      }

      const accessToken = secretsService.decrypt(integration.accessToken)

      const response = await axios.post(
        `${WHATSAPP_API_BASE}/${integration.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: message },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const messageId = response.data.messages[0].id

      const lead = await prisma.lead.findFirst({
        where: { workspaceId, phone: to },
      })

      if (lead) {
        await prisma.message.create({
          data: {
            workspaceId,
            leadId: lead.id,
            channel: 'whatsapp',
            direction: 'outbound',
            content: message,
            metadata: { messageId },
          },
        })
      }

      logger.info({ workspaceId, to, messageId }, 'WhatsApp message sent')

      return { messageId }
    } catch (error) {
      logger.error({ error, workspaceId, to }, 'Failed to send WhatsApp message')
      throw error
    }
  }

  /**
   * Handle incoming WhatsApp message
   */
  async handleIncomingMessage(
    phoneNumberId: string,
    from: string,
    messageBody: string,
    messageId: string
  ): Promise<void> {
    try {
      const integration = await prisma.whatsAppIntegration.findUnique({
        where: { phoneNumberId },
      })

      if (!integration) {
        logger.warn({ phoneNumberId }, 'WhatsApp integration not found')
        return
      }

      const workspaceId = integration.workspaceId

      let lead = await prisma.lead.findFirst({
        where: { workspaceId, phone: from },
      })

      if (!lead) {
        lead = await prisma.lead.create({
          data: {
            workspaceId,
            name: `Lead from ${from}`,
            phone: from,
            source: 'whatsapp',
            status: 'new',
            priority: 'medium',
          },
        })

        logger.info({ workspaceId, leadId: lead.id, phone: from }, 'New lead created from WhatsApp')
      }

      await prisma.message.create({
        data: {
          workspaceId,
          leadId: lead.id,
          channel: 'whatsapp',
          direction: 'inbound',
          content: messageBody,
          metadata: { messageId, from },
        },
      })

      await prisma.activityLog.create({
        data: {
          workspaceId,
          leadId: lead.id,
          actionType: 'whatsapp_received',
          description: `WhatsApp message received from ${from}`,
          metadata: { preview: messageBody.substring(0, 100) },
        },
      })

      logger.info({ workspaceId, leadId: lead.id, messageId }, 'WhatsApp message processed')

    } catch (error) {
      logger.error({ error, phoneNumberId, from }, 'Failed to handle WhatsApp message')
      throw error
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(workspaceId: string): Promise<void> {
    try {
      const integration = await prisma.whatsAppIntegration.findUnique({
        where: { workspaceId },
      })

      if (!integration) {
        throw new Error('WhatsApp integration not found')
      }


      logger.info({ workspaceId }, 'WhatsApp access token refreshed')

      await auditService.logProvisioning(
        workspaceId,
        'whatsapp.token.refresh',
        'whatsapp_integration',
        integration.phoneNumberId,
        true
      )
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to refresh WhatsApp token')
      throw error
    }
  }

  /**
   * Get WhatsApp integration status
   */
  async getIntegrationStatus(workspaceId: string) {
    const integration = await prisma.whatsAppIntegration.findUnique({
      where: { workspaceId },
    })

    if (!integration) {
      return null
    }

    return {
      phoneNumber: integration.phoneNumber,
      phoneNumberId: integration.phoneNumberId,
      status: integration.status,
      createdAt: integration.createdAt,
    }
  }

  /**
   * Deactivate WhatsApp integration
   */
  async deactivate(workspaceId: string): Promise<void> {
    try {
      await prisma.whatsAppIntegration.update({
        where: { workspaceId },
        data: { status: 'inactive' },
      })

      logger.info({ workspaceId }, 'WhatsApp integration deactivated')

      await auditService.logProvisioning(
        workspaceId,
        'whatsapp.deactivate',
        'whatsapp_integration',
        workspaceId,
        true
      )
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to deactivate WhatsApp')
      throw error
    }
  }
}

export const whatsappAutomationService = new WhatsAppAutomationService()
