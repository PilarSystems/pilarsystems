import twilio from 'twilio'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { auditService } from '@/lib/audit'
import { twilioSubaccountService } from './subaccount'

function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

export interface NumberProvisioningConfig {
  workspaceId: string
  countryCode: string // e.g., 'US', 'DE', 'GB'
  areaCode?: string
  numberType?: 'local' | 'mobile' | 'tollfree'
}

export interface ProvisionedNumber {
  phoneNumberSid: string
  phoneNumber: string
  capabilities: {
    voice: boolean
    sms: boolean
    mms: boolean
  }
}

/**
 * Twilio Number Provisioner
 * Handles automatic phone number purchase and configuration
 */
export class TwilioNumberProvisioner {
  /**
   * Search for available phone numbers
   */
  async searchAvailableNumbers(
    config: NumberProvisioningConfig,
    limit: number = 10
  ): Promise<any[]> {
    try {
      const credentials = await twilioSubaccountService.getSubaccountCredentials(
        config.workspaceId
      )

      if (!credentials) {
        throw new Error('Subaccount not found')
      }

      const client = twilio(credentials.apiKeySid, credentials.apiKeySecret, {
        accountSid: credentials.subaccountSid,
      })

      logger.info(
        { workspaceId: config.workspaceId, countryCode: config.countryCode },
        'Searching for available numbers'
      )

      let availableNumbers: any[] = []

      if (config.numberType === 'tollfree') {
        availableNumbers = await client.availablePhoneNumbers(config.countryCode).tollFree.list({
          limit,
        })
      } else if (config.numberType === 'mobile') {
        availableNumbers = await client.availablePhoneNumbers(config.countryCode).mobile.list({
          limit,
          ...(config.areaCode && { areaCode: parseInt(config.areaCode) }),
        })
      } else {
        availableNumbers = await client.availablePhoneNumbers(config.countryCode).local.list({
          limit,
          ...(config.areaCode && { areaCode: parseInt(config.areaCode) }),
        })
      }

      logger.info(
        { workspaceId: config.workspaceId, count: availableNumbers.length },
        'Found available numbers'
      )

      return availableNumbers
    } catch (error) {
      logger.error({ error, workspaceId: config.workspaceId }, 'Failed to search numbers')
      throw error
    }
  }

  /**
   * Purchase and configure a phone number
   */
  async provisionNumber(config: NumberProvisioningConfig): Promise<ProvisionedNumber> {
    try {
      logger.info({ workspaceId: config.workspaceId }, 'Starting number provisioning')

      const existing = await prisma.twilioSubaccount.findUnique({
        where: { workspaceId: config.workspaceId },
      })

      if (existing?.phoneNumber) {
        logger.info({ workspaceId: config.workspaceId }, 'Number already provisioned')
        return {
          phoneNumberSid: existing.phoneNumberSid!,
          phoneNumber: existing.phoneNumber,
          capabilities: {
            voice: true,
            sms: true,
            mms: true,
          },
        }
      }

      const credentials = await twilioSubaccountService.getSubaccountCredentials(
        config.workspaceId
      )

      if (!credentials) {
        throw new Error('Subaccount not found. Create subaccount first.')
      }

      const client = twilio(credentials.apiKeySid, credentials.apiKeySecret, {
        accountSid: credentials.subaccountSid,
      })

      const availableNumbers = await this.searchAvailableNumbers(config, 1)

      if (availableNumbers.length === 0) {
        throw new Error(
          `No available ${config.numberType || 'local'} numbers in ${config.countryCode}${
            config.areaCode ? ` with area code ${config.areaCode}` : ''
          }`
        )
      }

      const selectedNumber = availableNumbers[0]

      logger.info(
        { workspaceId: config.workspaceId, phoneNumber: selectedNumber.phoneNumber },
        'Purchasing number'
      )

      const purchasedNumber = await client.incomingPhoneNumbers.create({
        phoneNumber: selectedNumber.phoneNumber,
        friendlyName: `PILAR ${config.workspaceId}`,
        voiceUrl: `${getAppUrl()}/api/webhooks/twilio`,
        voiceMethod: 'POST',
        statusCallback: `${getAppUrl()}/api/webhooks/twilio/status`,
        statusCallbackMethod: 'POST',
        smsUrl: `${getAppUrl()}/api/webhooks/twilio`,
        smsMethod: 'POST',
        voiceReceiveMode: 'voice',
      })

      logger.info(
        {
          workspaceId: config.workspaceId,
          phoneNumberSid: purchasedNumber.sid,
          phoneNumber: purchasedNumber.phoneNumber,
        },
        'Number purchased successfully'
      )

      await prisma.twilioSubaccount.update({
        where: { workspaceId: config.workspaceId },
        data: {
          phoneNumberSid: purchasedNumber.sid,
          phoneNumber: purchasedNumber.phoneNumber,
          webhooksConfigured: true,
          updatedAt: new Date(),
        },
      })

      await auditService.logProvisioning(
        config.workspaceId,
        'twilio.number.provision',
        'phone_number',
        purchasedNumber.sid,
        true
      )

      return {
        phoneNumberSid: purchasedNumber.sid,
        phoneNumber: purchasedNumber.phoneNumber,
        capabilities: {
          voice: purchasedNumber.capabilities.voice || false,
          sms: purchasedNumber.capabilities.sms || false,
          mms: purchasedNumber.capabilities.mms || false,
        },
      }
    } catch (error) {
      logger.error({ error, workspaceId: config.workspaceId }, 'Failed to provision number')

      await auditService.logProvisioning(
        config.workspaceId,
        'twilio.number.provision',
        'phone_number',
        '',
        false,
        error instanceof Error ? error.message : 'Unknown error'
      )

      throw error
    }
  }

  /**
   * Update webhook configuration for a number
   */
  async updateWebhooks(workspaceId: string): Promise<void> {
    try {
      const subaccount = await prisma.twilioSubaccount.findUnique({
        where: { workspaceId },
      })

      if (!subaccount || !subaccount.phoneNumberSid) {
        throw new Error('Phone number not found')
      }

      const credentials = await twilioSubaccountService.getSubaccountCredentials(workspaceId)
      if (!credentials) {
        throw new Error('Subaccount credentials not found')
      }

      const client = twilio(credentials.apiKeySid, credentials.apiKeySecret, {
        accountSid: credentials.subaccountSid,
      })

      await client.incomingPhoneNumbers(subaccount.phoneNumberSid).update({
        voiceUrl: `${getAppUrl()}/api/webhooks/twilio`,
        voiceMethod: 'POST',
        statusCallback: `${getAppUrl()}/api/webhooks/twilio/status`,
        statusCallbackMethod: 'POST',
        smsUrl: `${getAppUrl()}/api/webhooks/twilio`,
        smsMethod: 'POST',
      })

      await prisma.twilioSubaccount.update({
        where: { workspaceId },
        data: { webhooksConfigured: true },
      })

      logger.info({ workspaceId }, 'Webhooks updated')

      await auditService.logProvisioning(
        workspaceId,
        'twilio.webhooks.update',
        'phone_number',
        subaccount.phoneNumberSid,
        true
      )
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to update webhooks')
      throw error
    }
  }
}

export const twilioNumberProvisioner = new TwilioNumberProvisioner()
