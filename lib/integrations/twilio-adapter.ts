/**
 * PILAR AUTOPILOT - Twilio Adapter
 * 
 * Handles Twilio subaccount creation, number purchasing, and webhook configuration
 * Gracefully degrades when ENV not configured
 */

import { ITwilioAdapter, IAdapterResult } from './base'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { encrypt, decrypt } from '@/lib/encryption'
import { withRetry } from '@/lib/autopilot/self-healing'

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://pilarsystems.com'

class TwilioAdapter implements ITwilioAdapter {
  private isConfigured(): boolean {
    return !!(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN)
  }

  private getTwilioClient() {
    if (!this.isConfigured()) {
      return null
    }

    const twilio = require('twilio')
    return twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  }

  async ensureSubaccount(
    workspaceId: string
  ): Promise<
    IAdapterResult<{
      subaccountSid: string
      apiKeySid: string
      apiKeySecret: string
    }>
  > {
    if (!this.isConfigured()) {
      logger.warn({ workspaceId }, 'Twilio not configured, skipping subaccount creation')
      return {
        ok: false,
        error: 'Twilio not configured',
        code: 'INTEGRATION_OFFLINE',
      }
    }

    try {
      const existing = await prisma.twilioSubaccount.findUnique({
        where: { workspaceId },
      })

      if (existing && existing.subaccountSid) {
        logger.info({ workspaceId, subaccountSid: existing.subaccountSid }, 'Twilio subaccount already exists')
        return {
          ok: true,
          data: {
            subaccountSid: existing.subaccountSid,
            apiKeySid: existing.apiKeySid,
            apiKeySecret: decrypt(existing.apiKeySecret),
          },
        }
      }

      const workspace = await prisma.workspace.findUnique({
        where: { id: workspaceId },
        select: { name: true },
      })

      if (!workspace) {
        return {
          ok: false,
          error: 'Workspace not found',
          code: 'RESOURCE_NOT_FOUND',
        }
      }

      const client = this.getTwilioClient()
      if (!client) {
        return {
          ok: false,
          error: 'Twilio client not available',
          code: 'INTEGRATION_OFFLINE',
        }
      }

      const subaccount = await withRetry(async () => {
        return await client.api.accounts.create({
          friendlyName: `PILAR - ${workspace.name}`,
        })
      })

      logger.info(
        { workspaceId, subaccountSid: subaccount.sid },
        'Twilio subaccount created'
      )

      const subaccountClient = require('twilio')(
        subaccount.sid,
        subaccount.authToken
      )

      const apiKey = await withRetry(async () => {
        return await subaccountClient.newKeys.create({
          friendlyName: `PILAR API Key - ${workspace.name}`,
        })
      })

      logger.info(
        { workspaceId, apiKeySid: apiKey.sid },
        'Twilio API key created'
      )

      await prisma.twilioSubaccount.upsert({
        where: { workspaceId },
        create: {
          workspaceId,
          subaccountSid: subaccount.sid,
          apiKeySid: apiKey.sid,
          apiKeySecret: encrypt(apiKey.secret),
        },
        update: {
          subaccountSid: subaccount.sid,
          apiKeySid: apiKey.sid,
          apiKeySecret: encrypt(apiKey.secret),
        },
      })

      return {
        ok: true,
        data: {
          subaccountSid: subaccount.sid,
          apiKeySid: apiKey.sid,
          apiKeySecret: apiKey.secret,
        },
      }
    } catch (error: any) {
      logger.error({ error, workspaceId }, 'Failed to create Twilio subaccount')
      return {
        ok: false,
        error: error.message || 'Failed to create subaccount',
        code: error.code || 'PROVISIONING_ERROR',
      }
    }
  }

  async ensureNumber(
    workspaceId: string,
    options: {
      country: string
      areaCode?: string
      type: 'local' | 'mobile' | 'tollfree'
    }
  ): Promise<
    IAdapterResult<{
      phoneNumberSid: string
      phoneNumber: string
    }>
  > {
    if (!this.isConfigured()) {
      logger.warn({ workspaceId }, 'Twilio not configured, skipping number purchase')
      return {
        ok: false,
        error: 'Twilio not configured',
        code: 'INTEGRATION_OFFLINE',
      }
    }

    try {
      const existing = await prisma.twilioSubaccount.findUnique({
        where: { workspaceId },
      })

      if (existing && existing.phoneNumberSid && existing.phoneNumber) {
        logger.info(
          { workspaceId, phoneNumber: existing.phoneNumber },
          'Twilio number already exists'
        )
        return {
          ok: true,
          data: {
            phoneNumberSid: existing.phoneNumberSid,
            phoneNumber: existing.phoneNumber,
          },
        }
      }

      if (!existing || !existing.subaccountSid) {
        return {
          ok: false,
          error: 'Subaccount not found, create subaccount first',
          code: 'PROVISIONING_ERROR',
        }
      }

      const subaccountClient = require('twilio')(
        existing.subaccountSid,
        TWILIO_AUTH_TOKEN
      )

      const searchParams: any = {
        limit: 10,
      }

      if (options.areaCode) {
        searchParams.areaCode = options.areaCode
      }

      let availableNumbers: any[] = []

      if (options.type === 'local') {
        availableNumbers = await withRetry(async () => {
          return await subaccountClient
            .availablePhoneNumbers(options.country)
            .local.list(searchParams)
        })
      } else if (options.type === 'mobile') {
        availableNumbers = await withRetry(async () => {
          return await subaccountClient
            .availablePhoneNumbers(options.country)
            .mobile.list(searchParams)
        })
      } else if (options.type === 'tollfree') {
        availableNumbers = await withRetry(async () => {
          return await subaccountClient
            .availablePhoneNumbers(options.country)
            .tollFree.list(searchParams)
        })
      }

      if (availableNumbers.length === 0) {
        return {
          ok: false,
          error: `No available ${options.type} numbers found in ${options.country}${options.areaCode ? ` with area code ${options.areaCode}` : ''}`,
          code: 'RESOURCE_NOT_FOUND',
        }
      }

      const selectedNumber = availableNumbers[0]
      const purchasedNumber = await withRetry(async () => {
        return await subaccountClient.incomingPhoneNumbers.create({
          phoneNumber: selectedNumber.phoneNumber,
        })
      })

      logger.info(
        {
          workspaceId,
          phoneNumber: purchasedNumber.phoneNumber,
          phoneNumberSid: purchasedNumber.sid,
        },
        'Twilio number purchased'
      )

      await prisma.twilioSubaccount.update({
        where: { workspaceId },
        data: {
          phoneNumberSid: purchasedNumber.sid,
          phoneNumber: purchasedNumber.phoneNumber,
        },
      })

      return {
        ok: true,
        data: {
          phoneNumberSid: purchasedNumber.sid,
          phoneNumber: purchasedNumber.phoneNumber,
        },
      }
    } catch (error: any) {
      logger.error({ error, workspaceId }, 'Failed to purchase Twilio number')
      return {
        ok: false,
        error: error.message || 'Failed to purchase number',
        code: error.code || 'PROVISIONING_ERROR',
      }
    }
  }

  async setWebhooks(
    workspaceId: string,
    urls: {
      voice: string
      messaging?: string
    }
  ): Promise<IAdapterResult> {
    if (!this.isConfigured()) {
      logger.warn({ workspaceId }, 'Twilio not configured, skipping webhook setup')
      return {
        ok: false,
        error: 'Twilio not configured',
        code: 'INTEGRATION_OFFLINE',
      }
    }

    try {
      const twilioSubaccount = await prisma.twilioSubaccount.findUnique({
        where: { workspaceId },
      })

      if (!twilioSubaccount || !twilioSubaccount.phoneNumberSid) {
        return {
          ok: false,
          error: 'Phone number not found',
          code: 'RESOURCE_NOT_FOUND',
        }
      }

      const subaccountClient = require('twilio')(
        twilioSubaccount.subaccountSid,
        TWILIO_AUTH_TOKEN
      )

      await withRetry(async () => {
        return await subaccountClient
          .incomingPhoneNumbers(twilioSubaccount.phoneNumberSid)
          .update({
            voiceUrl: urls.voice,
            voiceMethod: 'POST',
            smsUrl: urls.messaging || urls.voice,
            smsMethod: 'POST',
          })
      })

      logger.info(
        { workspaceId, phoneNumber: twilioSubaccount.phoneNumber },
        'Twilio webhooks configured'
      )

      return {
        ok: true,
      }
    } catch (error: any) {
      logger.error({ error, workspaceId }, 'Failed to set Twilio webhooks')
      return {
        ok: false,
        error: error.message || 'Failed to set webhooks',
        code: error.code || 'PROVISIONING_ERROR',
      }
    }
  }

  async getStatus(
    workspaceId: string
  ): Promise<
    IAdapterResult<{
      active: boolean
      number?: string
      subaccountSid?: string
    }>
  > {
    try {
      const twilioSubaccount = await prisma.twilioSubaccount.findUnique({
        where: { workspaceId },
      })

      if (!twilioSubaccount) {
        return {
          ok: true,
          data: {
            active: false,
          },
        }
      }

      return {
        ok: true,
        data: {
          active: !!(twilioSubaccount.phoneNumber && twilioSubaccount.subaccountSid),
          number: twilioSubaccount.phoneNumber || undefined,
          subaccountSid: twilioSubaccount.subaccountSid || undefined,
        },
      }
    } catch (error: any) {
      logger.error({ error, workspaceId }, 'Failed to get Twilio status')
      return {
        ok: false,
        error: error.message || 'Failed to get status',
      }
    }
  }
}

export const twilioAdapter = new TwilioAdapter()
