import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { secretsService } from '@/lib/secrets'
import { auditService } from '@/lib/audit'
import Imap from 'imap'
import { simpleParser } from 'mailparser'

export interface EmailConfig {
  workspaceId: string
  provider: 'gmail' | 'outlook' | 'custom'
  email: string
  imapHost: string
  imapPort: number
  smtpHost: string
  smtpPort: number
  username: string
  password: string
  useTLS?: boolean
}

/**
 * Email Automation Service
 * Handles IMAP/SMTP setup and email syncing
 */
export class EmailAutomationService {
  /**
   * Provision email integration for a workspace
   */
  async provisionEmail(config: EmailConfig): Promise<void> {
    try {
      logger.info({ workspaceId: config.workspaceId, email: config.email }, 'Provisioning email integration')

      const existing = await prisma.emailCredential.findUnique({
        where: { workspaceId: config.workspaceId },
      })

      if (existing) {
        logger.info({ workspaceId: config.workspaceId }, 'Email already provisioned')
        return
      }

      await this.testImapConnection(config)

      await prisma.emailCredential.create({
        data: {
          workspaceId: config.workspaceId,
          provider: config.provider,
          email: config.email,
          imapHost: config.imapHost,
          imapPort: config.imapPort,
          smtpHost: config.smtpHost,
          smtpPort: config.smtpPort,
          username: config.username,
          password: secretsService.encrypt(config.password),
          useTLS: config.useTLS !== false,
          status: 'active',
        },
      })

      logger.info({ workspaceId: config.workspaceId, email: config.email }, 'Email provisioned successfully')

      await auditService.logProvisioning(
        config.workspaceId,
        'email.provision',
        'email_credential',
        config.email,
        true
      )
    } catch (error) {
      logger.error({ error, workspaceId: config.workspaceId }, 'Failed to provision email')

      await auditService.logProvisioning(
        config.workspaceId,
        'email.provision',
        'email_credential',
        '',
        false,
        error instanceof Error ? error.message : 'Unknown error'
      )

      throw error
    }
  }

  /**
   * Test IMAP connection
   */
  private async testImapConnection(config: EmailConfig): Promise<void> {
    return new Promise((resolve, reject) => {
      const imap = new Imap({
        user: config.username,
        password: config.password,
        host: config.imapHost,
        port: config.imapPort,
        tls: config.useTLS !== false,
        tlsOptions: { rejectUnauthorized: false },
      })

      imap.once('ready', () => {
        imap.end()
        resolve()
      })

      imap.once('error', (err: Error) => {
        reject(new Error(`IMAP connection failed: ${err.message}`))
      })

      imap.connect()
    })
  }

  /**
   * Sync emails from inbox
   */
  async syncEmails(workspaceId: string): Promise<number> {
    try {
      const credential = await prisma.emailCredential.findUnique({
        where: { workspaceId },
      })

      if (!credential) {
        throw new Error('Email credentials not found')
      }

      const password = secretsService.decrypt(credential.password)

      return new Promise((resolve, reject) => {
        const imap = new Imap({
          user: credential.username,
          password,
          host: credential.imapHost,
          port: credential.imapPort,
          tls: credential.useTLS,
          tlsOptions: { rejectUnauthorized: false },
        })

        let syncedCount = 0

        imap.once('ready', () => {
          imap.openBox('INBOX', false, (err, box) => {
            if (err) {
              reject(err)
              return
            }

            imap.search(['UNSEEN'], (err, results) => {
              if (err) {
                reject(err)
                return
              }

              if (results.length === 0) {
                imap.end()
                resolve(0)
                return
              }

              const fetch = imap.fetch(results, { bodies: '' })

              fetch.on('message', (msg) => {
                msg.on('body', (stream) => {
                  simpleParser(stream as any, async (err, parsed) => {
                    if (err) {
                      logger.error({ error: err }, 'Failed to parse email')
                      return
                    }

                    try {
                      await this.processEmail(workspaceId, parsed)
                      syncedCount++
                    } catch (error) {
                      logger.error({ error }, 'Failed to process email')
                    }
                  })
                })
              })

              fetch.once('end', () => {
                imap.end()
                resolve(syncedCount)
              })

              fetch.once('error', (err) => {
                reject(err)
              })
            })
          })
        })

        imap.once('error', (err: Error) => {
          reject(err)
        })

        imap.connect()
      })
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to sync emails')
      throw error
    }
  }

  /**
   * Process a single email
   */
  private async processEmail(workspaceId: string, email: any): Promise<void> {
    try {
      const from = email.from?.value?.[0]?.address || 'unknown'
      const subject = email.subject || 'No Subject'
      const body = email.text || email.html || ''

      logger.info({ workspaceId, from, subject }, 'Processing email')

      let lead = await prisma.lead.findFirst({
        where: { workspaceId, email: from },
      })

      if (!lead) {
        lead = await prisma.lead.create({
          data: {
            workspaceId,
            name: email.from?.value?.[0]?.name || from,
            email: from,
            source: 'email',
            status: 'new',
            priority: 'medium',
          },
        })

        logger.info({ workspaceId, leadId: lead.id, email: from }, 'New lead created from email')
      }

      await prisma.message.create({
        data: {
          workspaceId,
          leadId: lead.id,
          channel: 'email',
          direction: 'inbound',
          content: body,
          metadata: {
            subject,
            from,
            messageId: email.messageId,
          },
        },
      })

      await prisma.activityLog.create({
        data: {
          workspaceId,
          leadId: lead.id,
          actionType: 'email_received',
          description: `Email received: ${subject}`,
          metadata: {
            from,
            subject,
            preview: body.substring(0, 100),
          },
        },
      })

      logger.info({ workspaceId, leadId: lead.id }, 'Email processed successfully')
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to process email')
      throw error
    }
  }

  /**
   * Get email integration status
   */
  async getStatus(workspaceId: string) {
    const credential = await prisma.emailCredential.findUnique({
      where: { workspaceId },
    })

    if (!credential) {
      return null
    }

    return {
      email: credential.email,
      provider: credential.provider,
      status: credential.status,
      lastSyncAt: credential.lastSyncAt,
      createdAt: credential.createdAt,
    }
  }

  /**
   * Deactivate email integration
   */
  async deactivate(workspaceId: string): Promise<void> {
    try {
      await prisma.emailCredential.update({
        where: { workspaceId },
        data: { status: 'inactive' },
      })

      logger.info({ workspaceId }, 'Email integration deactivated')

      await auditService.logProvisioning(
        workspaceId,
        'email.deactivate',
        'email_credential',
        workspaceId,
        true
      )
    } catch (error) {
      logger.error({ error, workspaceId }, 'Failed to deactivate email')
      throw error
    }
  }
}

export const emailAutomationService = new EmailAutomationService()
