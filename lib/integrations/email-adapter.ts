/**
 * PILAR AUTOPILOT - Email Adapter
 * 
 * Handles email sending via SMTP
 * Gracefully degrades when ENV not configured
 */

import nodemailer from 'nodemailer'
import { IEmailAdapter, IAdapterResult } from './base'
import { logger } from '@/lib/logger'
import { withRetry } from '@/lib/autopilot/self-healing'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = process.env.SMTP_PORT
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASSWORD = process.env.SMTP_PASSWORD
const SMTP_FROM = process.env.SMTP_FROM || 'noreply@pilarsystems.com'

class EmailAdapter implements IEmailAdapter {
  private isConfigured(): boolean {
    return !!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASSWORD)
  }

  async send(
    to: string,
    subject: string,
    html: string,
    options?: {
      from?: string
      replyTo?: string
    }
  ): Promise<IAdapterResult> {
    if (!this.isConfigured()) {
      logger.warn({ to, subject }, 'SMTP not configured, skipping email send')
      return {
        ok: false,
        error: 'SMTP not configured',
        code: 'INTEGRATION_OFFLINE',
      }
    }

    try {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: parseInt(SMTP_PORT || '587'),
        secure: SMTP_PORT === '465',
        auth: {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        },
      })

      await withRetry(async () => {
        return await transporter.sendMail({
          from: options?.from || SMTP_FROM,
          to,
          subject,
          html,
          replyTo: options?.replyTo,
        })
      })

      logger.info({ to, subject }, 'Email sent successfully')

      return {
        ok: true,
      }
    } catch (error: unknown) {
      const err = error as Error & { code?: string }
      logger.error({ error, to, subject }, 'Failed to send email')
      return {
        ok: false,
        error: err.message || 'Failed to send email',
        code: err.code || 'WEBHOOK_ERROR',
      }
    }
  }

  async getStatus(): Promise<
    IAdapterResult<{
      configured: boolean
      provider?: string
    }>
  > {
    return {
      ok: true,
      data: {
        configured: this.isConfigured(),
        provider: SMTP_HOST || undefined,
      },
    }
  }
}

export const emailAdapter = new EmailAdapter()
