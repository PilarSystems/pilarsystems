import twilio from 'twilio'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { secretsService } from '@/lib/secrets'
import { auditService } from '@/lib/audit'

function getTwilioMasterCredentials() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    throw new Error('Twilio master credentials not configured (TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN required)');
  }
  
  return { accountSid, authToken };
}

export interface SubaccountConfig {
  workspaceId: string
  friendlyName: string
}

export interface SubaccountResult {
  subaccountSid: string
  apiKeySid: string
  apiKeySecret: string
}

export class TwilioSubaccountService {
  private client: twilio.Twilio | null = null

  private getClient(): twilio.Twilio {
    if (!this.client) {
      const { accountSid, authToken } = getTwilioMasterCredentials();
      this.client = twilio(accountSid, authToken)
    }
    return this.client
  }

  /**
   * Create a new Twilio subaccount for a workspace
   */
  async createSubaccount(config: SubaccountConfig): Promise<SubaccountResult> {
    try {
      logger.info({ workspaceId: config.workspaceId }, 'Creating Twilio subaccount')

      const existing = await prisma.twilioSubaccount.findUnique({
        where: { workspaceId: config.workspaceId },
      })

      if (existing) {
        logger.info({ workspaceId: config.workspaceId }, 'Subaccount already exists')
        return {
          subaccountSid: existing.subaccountSid,
          apiKeySid: existing.apiKeySid,
          apiKeySecret: secretsService.decrypt(existing.apiKeySecret),
        }
      }

      const client = this.getClient()
      const subaccount = await client.api.v2010.accounts.create({
        friendlyName: config.friendlyName,
      })

      logger.info(
        { workspaceId: config.workspaceId, subaccountSid: subaccount.sid },
        'Subaccount created'
      )

      const subaccountClient = twilio(subaccount.sid, subaccount.authToken!)
      const apiKey = await subaccountClient.newKeys.create({
        friendlyName: `${config.friendlyName} API Key`,
      })

      logger.info(
        { workspaceId: config.workspaceId, apiKeySid: apiKey.sid },
        'API key created'
      )

      await prisma.twilioSubaccount.create({
        data: {
          workspaceId: config.workspaceId,
          subaccountSid: subaccount.sid,
          apiKeySid: apiKey.sid,
          apiKeySecret: secretsService.encrypt(apiKey.secret),
          status: 'active',
        },
      })

      await auditService.logProvisioning(
        config.workspaceId,
        'twilio.subaccount.create',
        'twilio_subaccount',
        subaccount.sid,
        true
      )

      return {
        subaccountSid: subaccount.sid,
        apiKeySid: apiKey.sid,
        apiKeySecret: apiKey.secret,
      }
    } catch (error) {
      logger.error({ error, workspaceId: config.workspaceId }, 'Failed to create subaccount')
      
      await auditService.logProvisioning(
        config.workspaceId,
        'twilio.subaccount.create',
        'twilio_subaccount',
        '',
        false,
        error instanceof Error ? error.message : 'Unknown error'
      )

      throw error
    }
  }

  /**
   * Get subaccount credentials for a workspace
   */
  async getSubaccountCredentials(workspaceId: string): Promise<SubaccountResult | null> {
    const subaccount = await prisma.twilioSubaccount.findUnique({
      where: { workspaceId },
    })

    if (!subaccount) {
      return null
    }

    return {
      subaccountSid: subaccount.subaccountSid,
      apiKeySid: subaccount.apiKeySid,
      apiKeySecret: secretsService.decrypt(subaccount.apiKeySecret),
    }
  }

  /**
   * Rotate API key for a subaccount
   */
  async rotateApiKey(workspaceId: string): Promise<SubaccountResult> {
    try {
      const subaccount = await prisma.twilioSubaccount.findUnique({
        where: { workspaceId },
      })

      if (!subaccount) {
        throw new Error('Subaccount not found')
      }

      logger.info({ workspaceId, subaccountSid: subaccount.subaccountSid }, 'Rotating API key')

      const client = this.getClient()
      const subaccountDetails = await client.api.v2010
        .accounts(subaccount.subaccountSid)
        .fetch()

      const subaccountClient = twilio(subaccount.subaccountSid, subaccountDetails.authToken!)
      const newApiKey = await subaccountClient.newKeys.create({
        friendlyName: `Rotated API Key ${new Date().toISOString()}`,
      })

      try {
        await subaccountClient.keys(subaccount.apiKeySid).remove()
      } catch (error) {
        logger.warn({ error, oldKeySid: subaccount.apiKeySid }, 'Failed to delete old API key')
      }

      await prisma.twilioSubaccount.update({
        where: { workspaceId },
        data: {
          apiKeySid: newApiKey.sid,
          apiKeySecret: secretsService.encrypt(newApiKey.secret),
          updatedAt: new Date(),
        },
      })

      logger.info({ workspaceId, newApiKeySid: newApiKey.sid }, 'API key rotated')

      await auditService.logProvisioning(
        workspaceId,
        'twilio.apikey.rotate',
        'twilio_subaccount',
        subaccount.subaccountSid,
        true
      )

      return {
        subaccountSid: subaccount.subaccountSid,
        apiKeySid: newApiKey.sid,
        apiKeySecret: newApiKey.secret,
      }
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to rotate API key')
      throw error
    }
  }

  /**
   * Suspend a subaccount
   */
  async suspendSubaccount(workspaceId: string): Promise<void> {
    try {
      const subaccount = await prisma.twilioSubaccount.findUnique({
        where: { workspaceId },
      })

      if (!subaccount) {
        throw new Error('Subaccount not found')
      }

      const client = this.getClient()
      await client.api.v2010.accounts(subaccount.subaccountSid).update({
        status: 'suspended',
      })

      await prisma.twilioSubaccount.update({
        where: { workspaceId },
        data: { status: 'suspended' },
      })

      logger.info({ workspaceId, subaccountSid: subaccount.subaccountSid }, 'Subaccount suspended')

      await auditService.logProvisioning(
        workspaceId,
        'twilio.subaccount.suspend',
        'twilio_subaccount',
        subaccount.subaccountSid,
        true
      )
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to suspend subaccount')
      throw error
    }
  }

  /**
   * Reactivate a subaccount
   */
  async reactivateSubaccount(workspaceId: string): Promise<void> {
    try {
      const subaccount = await prisma.twilioSubaccount.findUnique({
        where: { workspaceId },
      })

      if (!subaccount) {
        throw new Error('Subaccount not found')
      }

      const client = this.getClient()
      await client.api.v2010.accounts(subaccount.subaccountSid).update({
        status: 'active',
      })

      await prisma.twilioSubaccount.update({
        where: { workspaceId },
        data: { status: 'active' },
      })

      logger.info({ workspaceId, subaccountSid: subaccount.subaccountSid }, 'Subaccount reactivated')

      await auditService.logProvisioning(
        workspaceId,
        'twilio.subaccount.reactivate',
        'twilio_subaccount',
        subaccount.subaccountSid,
        true
      )
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to reactivate subaccount')
      throw error
    }
  }
}

export const twilioSubaccountService = new TwilioSubaccountService()
