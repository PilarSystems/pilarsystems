/**
 * Enhanced Email Service for Multi-Channel Communication
 * Handles email sending, tracking, and campaign management
 */

import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { secretsService } from '@/lib/secrets'
import { auditService } from '@/lib/audit'
import { 
  UnifiedMessage, 
  MessageDeliveryResult, 
  MessageStatus,
  MessageTemplate 
} from './types'

interface EmailTransporterConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

type EmailTransporter = ReturnType<typeof nodemailer.createTransport>

/**
 * Enhanced Email Service for outreach and campaign management
 */
export class EmailOutreachService {
  /**
   * Get email transporter for a workspace
   */
  private async getTransporter(workspaceId: string): Promise<{
    transporter: EmailTransporter
    fromEmail: string
    fromName: string
  }> {
    const credential = await prisma.emailCredential.findUnique({
      where: { workspaceId },
    })

    if (credential && credential.status === 'active') {
      const password = secretsService.decrypt(credential.password)
      const config: EmailTransporterConfig = {
        host: credential.smtpHost,
        port: credential.smtpPort,
        secure: credential.useTLS,
        auth: {
          user: credential.username,
          pass: password,
        },
      }

      return {
        transporter: nodemailer.createTransport(config),
        fromEmail: credential.email,
        fromName: credential.username,
      }
    }

    // Fallback to default SMTP configuration
    const smtpHost = process.env.EMAIL_SMTP_HOST
    const smtpPort = process.env.EMAIL_SMTP_PORT
    const smtpUser = process.env.EMAIL_USER
    const smtpPass = process.env.EMAIL_PASSWORD

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
      throw new Error('Email credentials not configured')
    }

    return {
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: process.env.EMAIL_SMTP_SECURE === 'true',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      }),
      fromEmail: smtpUser,
      fromName: process.env.EMAIL_FROM_NAME || 'Pilar Systems',
    }
  }

  /**
   * Send an email message
   */
  async sendEmail(message: UnifiedMessage): Promise<MessageDeliveryResult> {
    const startTime = Date.now()

    try {
      logger.info(
        { workspaceId: message.workspaceId, to: message.to },
        'Sending email'
      )

      const { transporter, fromEmail, fromName } = await this.getTransporter(
        message.workspaceId
      )

      // Process template if provided
      let content = message.content
      let htmlContent = message.html || this.textToHtml(content)
      let subject = message.subject || 'Message from your fitness studio'

      if (message.templateId && message.templateVariables) {
        content = this.processTemplate(content, message.templateVariables)
        htmlContent = this.processTemplate(htmlContent, message.templateVariables)
        subject = this.processTemplate(subject, message.templateVariables)
      }

      // Generate tracking pixel for open tracking
      const trackingId = secretsService.generateToken(16)
      const trackingPixel = this.generateTrackingPixel(
        message.workspaceId,
        trackingId
      )
      htmlContent = htmlContent + trackingPixel

      const mailOptions = {
        from: `"${fromName}" <${message.from || fromEmail}>`,
        to: message.to,
        subject,
        text: content,
        html: htmlContent,
        headers: {
          'X-Tracking-Id': trackingId,
          'X-Workspace-Id': message.workspaceId,
        },
      }

      const info = await transporter.sendMail(mailOptions)

      // Store message in database
      const dbMessage = await prisma.message.create({
        data: {
          workspaceId: message.workspaceId,
          leadId: message.leadId,
          channel: 'email',
          direction: 'outbound',
          content: content,
          metadata: {
            externalId: info.messageId,
            subject,
            from: fromEmail,
            to: message.to,
            trackingId,
            templateId: message.templateId,
            deliveryTimeMs: Date.now() - startTime,
          },
          aiGenerated: false,
        },
      })

      logger.info(
        {
          workspaceId: message.workspaceId,
          messageId: dbMessage.id,
          externalId: info.messageId,
        },
        'Email sent successfully'
      )

      await auditService.log({
        workspaceId: message.workspaceId,
        action: 'email.send',
        resource: 'message',
        resourceId: dbMessage.id,
        success: true,
      })

      return {
        success: true,
        messageId: dbMessage.id,
        externalId: info.messageId,
        channel: 'email',
        status: 'sent',
        timestamp: new Date(),
        metadata: {
          trackingId,
          deliveryTimeMs: Date.now() - startTime,
        },
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      logger.error(
        { error, workspaceId: message.workspaceId, to: message.to },
        'Failed to send email'
      )

      await auditService.log({
        workspaceId: message.workspaceId,
        action: 'email.send',
        resource: 'message',
        success: false,
        errorMessage,
      })

      return {
        success: false,
        channel: 'email',
        status: 'failed',
        timestamp: new Date(),
        error: errorMessage,
      }
    }
  }

  /**
   * Send bulk emails with rate limiting
   */
  async sendBulkEmails(
    workspaceId: string,
    recipients: Array<{
      to: string
      leadId?: string
      variables?: Record<string, string>
    }>,
    subject: string,
    content: string,
    html?: string,
    templateId?: string
  ): Promise<MessageDeliveryResult[]> {
    const results: MessageDeliveryResult[] = []

    for (const recipient of recipients) {
      const result = await this.sendEmail({
        workspaceId,
        leadId: recipient.leadId,
        channel: 'email',
        to: recipient.to,
        subject,
        content,
        html,
        templateId,
        templateVariables: recipient.variables,
      })
      results.push(result)

      // Rate limiting delay (respect email provider limits)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }

    return results
  }

  /**
   * Track email open via tracking pixel
   */
  async trackEmailOpen(trackingId: string): Promise<void> {
    try {
      const message = await prisma.message.findFirst({
        where: {
          channel: 'email',
          metadata: {
            path: ['trackingId'],
            equals: trackingId,
          },
        },
      })

      if (!message) {
        logger.warn({ trackingId }, 'Message not found for open tracking')
        return
      }

      const currentMetadata = (message.metadata as Record<string, unknown>) || {}

      await prisma.message.update({
        where: { id: message.id },
        data: {
          metadata: {
            ...currentMetadata,
            status: 'read',
            openedAt: new Date().toISOString(),
            openCount: ((currentMetadata.openCount as number) || 0) + 1,
          },
        },
      })

      // Track analytics
      await this.trackDeliveryMetric(message.workspaceId, 'read')

      logger.info({ trackingId, messageId: message.id }, 'Email open tracked')
    } catch (error) {
      logger.error({ error, trackingId }, 'Failed to track email open')
    }
  }

  /**
   * Track email link click
   */
  async trackEmailClick(
    trackingId: string,
    linkUrl: string
  ): Promise<string> {
    try {
      const message = await prisma.message.findFirst({
        where: {
          channel: 'email',
          metadata: {
            path: ['trackingId'],
            equals: trackingId,
          },
        },
      })

      if (message) {
        const currentMetadata = (message.metadata as Record<string, unknown>) || {}
        const clicks = (currentMetadata.clicks as Array<unknown>) || []

        await prisma.message.update({
          where: { id: message.id },
          data: {
            metadata: {
              ...currentMetadata,
              clicks: [...clicks, { url: linkUrl, timestamp: new Date().toISOString() }],
            },
          },
        })

        logger.info({ trackingId, linkUrl, messageId: message.id }, 'Email click tracked')
      }

      return linkUrl
    } catch (error) {
      logger.error({ error, trackingId }, 'Failed to track email click')
      return linkUrl
    }
  }

  /**
   * Handle email bounce/complaint webhook
   */
  async handleBounce(
    messageId: string,
    bounceType: 'hard' | 'soft',
    reason: string
  ): Promise<void> {
    try {
      const message = await prisma.message.findFirst({
        where: {
          channel: 'email',
          metadata: {
            path: ['externalId'],
            equals: messageId,
          },
        },
      })

      if (!message) {
        logger.warn({ messageId }, 'Message not found for bounce handling')
        return
      }

      const currentMetadata = (message.metadata as Record<string, unknown>) || {}

      await prisma.message.update({
        where: { id: message.id },
        data: {
          metadata: {
            ...currentMetadata,
            status: 'bounced',
            bounceType,
            bounceReason: reason,
            bouncedAt: new Date().toISOString(),
          },
        },
      })

      // Update lead email validity if hard bounce
      if (bounceType === 'hard' && message.leadId) {
        await prisma.lead.update({
          where: { id: message.leadId },
          data: {
            metadata: {
              emailValid: false,
              bounceReason: reason,
            },
          },
        })
      }

      await this.trackDeliveryMetric(message.workspaceId, 'bounced')

      logger.info({ messageId, bounceType, reason }, 'Email bounce handled')
    } catch (error) {
      logger.error({ error, messageId }, 'Failed to handle email bounce')
    }
  }

  /**
   * Generate tracking pixel HTML
   */
  private generateTrackingPixel(workspaceId: string, trackingId: string): string {
    const trackingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/email/track?id=${trackingId}`
    return `<img src="${trackingUrl}" width="1" height="1" style="display:none;" alt="" />`
  }

  /**
   * Convert plain text to HTML
   */
  private textToHtml(text: string): string {
    const escapedText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')

    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        ${escapedText}
      </div>
    `
  }

  /**
   * Process template with variables
   */
  private processTemplate(
    template: string,
    variables: Record<string, string>
  ): string {
    let processed = template
    for (const [key, value] of Object.entries(variables)) {
      processed = processed.replace(new RegExp(`{{${key}}}`, 'g'), value)
    }
    return processed
  }

  /**
   * Track delivery metrics for analytics
   */
  private async trackDeliveryMetric(
    workspaceId: string,
    status: MessageStatus
  ): Promise<void> {
    try {
      await prisma.activityLog.create({
        data: {
          workspaceId,
          actionType: 'email_delivery_status',
          description: `Email status: ${status}`,
          metadata: { status, channel: 'email' },
        },
      })
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to track email delivery metric')
    }
  }

  /**
   * Get email templates for a workspace
   */
  async getTemplates(workspaceId: string): Promise<MessageTemplate[]> {
    return [
      {
        id: 'email-welcome',
        name: 'Welcome Email',
        channel: 'email',
        subject: 'Welcome to {{studio_name}}!',
        content: `Hi {{name}},

Welcome to {{studio_name}}! We're excited to have you.

Here's what you can expect:
- Personalized training plans
- Expert guidance
- A supportive community

Ready to get started? Book your first session today!

Best regards,
The {{studio_name}} Team`,
        variables: ['name', 'studio_name'],
        active: true,
      },
      {
        id: 'email-appointment-reminder',
        name: 'Appointment Reminder',
        channel: 'email',
        subject: 'Reminder: Your appointment on {{date}}',
        content: `Hi {{name}},

This is a friendly reminder about your upcoming appointment:

Date: {{date}}
Time: {{time}}
Location: {{studio_name}}

Need to reschedule? Just reply to this email.

See you soon!
{{studio_name}}`,
        variables: ['name', 'studio_name', 'date', 'time'],
        active: true,
      },
      {
        id: 'email-followup',
        name: 'Re-engagement Email',
        channel: 'email',
        subject: 'We miss you at {{studio_name}}!',
        content: `Hi {{name}},

We noticed it's been a while since your last visit. We'd love to have you back!

As a special welcome back offer, book a session this week and get 20% off.

Just reply to this email or give us a call to schedule.

Looking forward to seeing you!
{{studio_name}}`,
        variables: ['name', 'studio_name'],
        active: true,
      },
    ]
  }

  /**
   * Check if email is enabled for a workspace
   */
  async isEnabled(workspaceId: string): Promise<boolean> {
    const credential = await prisma.emailCredential.findUnique({
      where: { workspaceId },
    })
    return !!(credential && credential.status === 'active')
  }

  /**
   * Verify email connection
   */
  async verifyConnection(workspaceId: string): Promise<boolean> {
    try {
      const { transporter } = await this.getTransporter(workspaceId)
      await transporter.verify()
      return true
    } catch (error) {
      logger.error({ error, workspaceId }, 'Email connection verification failed')
      return false
    }
  }
}

export const emailOutreachService = new EmailOutreachService()
