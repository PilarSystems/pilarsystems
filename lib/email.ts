import nodemailer from 'nodemailer'
import Imap from 'imap'
import { simpleParser } from 'mailparser'
import { logger } from '@/lib/logger'

export const emailTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST!,
  port: parseInt(process.env.EMAIL_SMTP_PORT || '587'),
  secure: process.env.EMAIL_SMTP_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASSWORD!,
  },
})

export function createImapConnection() {
  return new Imap({
    user: process.env.EMAIL_USER!,
    password: process.env.EMAIL_PASSWORD!,
    host: process.env.EMAIL_IMAP_HOST!,
    port: parseInt(process.env.EMAIL_IMAP_PORT || '993'),
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
  })
}

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await emailTransporter.sendMail({
      from: process.env.EMAIL_USER!,
      to,
      subject,
      html,
    })
    return info
  } catch (error) {
    logger.error({ error }, 'Error sending email')
    throw error
  }
}
