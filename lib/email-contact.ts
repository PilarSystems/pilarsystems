/**
 * Contact form email service using nodemailer
 * Configured via environment variables
 */

import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import { getConfig } from './config/env'
import { logger } from './logger'

let transporter: Transporter | null = null

function getTransporter() {
  if (transporter) return transporter

  const config = getConfig()

  if (!config.contactEmailEnabled) {
    logger.warn('Email service not configured - missing SMTP credentials')
    return null
  }

  transporter = nodemailer.createTransport({
    host: config.smtpHost!,
    port: config.smtpPort!,
    secure: config.smtpPort === 465,
    auth: {
      user: config.smtpUser!,
      pass: config.smtpPass!,
    },
  })

  return transporter
}

export interface ContactEmailData {
  name: string
  email: string
  phone?: string
  studioName: string
  studioSize: string
  location?: string
  message?: string
}

export async function sendContactNotification(data: ContactEmailData): Promise<boolean> {
  const config = getConfig()
  const transport = getTransporter()

  if (!transport || !config.contactTo) {
    logger.warn('Email not sent - service not configured')
    return false
  }

  try {
    const html = `
      <h2>Neue Kontaktanfrage von PILAR SYSTEMS Website</h2>
      
      <h3>Kontaktdaten:</h3>
      <ul>
        <li><strong>Name:</strong> ${data.name}</li>
        <li><strong>E-Mail:</strong> ${data.email}</li>
        ${data.phone ? `<li><strong>Telefon:</strong> ${data.phone}</li>` : ''}
      </ul>
      
      <h3>Studio-Informationen:</h3>
      <ul>
        <li><strong>Studio-Name:</strong> ${data.studioName}</li>
        <li><strong>Studio-Größe:</strong> ${data.studioSize}</li>
        ${data.location ? `<li><strong>Standort:</strong> ${data.location}</li>` : ''}
      </ul>
      
      ${data.message ? `
        <h3>Nachricht:</h3>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      ` : ''}
      
      <hr>
      <p style="color: #666; font-size: 12px;">
        Diese E-Mail wurde automatisch von der PILAR SYSTEMS Website generiert.
      </p>
    `

    const text = `
Neue Kontaktanfrage von PILAR SYSTEMS Website

Kontaktdaten:
- Name: ${data.name}
- E-Mail: ${data.email}
${data.phone ? `- Telefon: ${data.phone}` : ''}

Studio-Informationen:
- Studio-Name: ${data.studioName}
- Studio-Größe: ${data.studioSize}
${data.location ? `- Standort: ${data.location}` : ''}

${data.message ? `Nachricht:\n${data.message}` : ''}
    `

    await transport.sendMail({
      from: config.smtpFrom!,
      to: config.contactTo,
      subject: `Neue Kontaktanfrage: ${data.studioName}`,
      text,
      html,
    })

    logger.info({ email: data.email, studioName: data.studioName }, 'Contact notification sent')
    return true
  } catch (error) {
    logger.error({ error, email: data.email }, 'Failed to send contact notification')
    return false
  }
}

export async function sendContactConfirmation(to: string, name: string): Promise<boolean> {
  const config = getConfig()
  const transport = getTransporter()

  if (!transport) {
    return false
  }

  try {
    const html = `
      <h2>Vielen Dank für deine Anfrage, ${name}!</h2>
      
      <p>
        Wir haben deine Kontaktanfrage erhalten und melden uns innerhalb von 24 Stunden bei dir.
      </p>
      
      <p>
        Beste Grüße,<br>
        Dein PILAR SYSTEMS Team
      </p>
    `

    await transport.sendMail({
      from: config.smtpFrom!,
      to,
      subject: 'Deine Anfrage bei PILAR SYSTEMS',
      text: `Vielen Dank für deine Anfrage, ${name}!\n\nWir haben deine Kontaktanfrage erhalten und melden uns innerhalb von 24 Stunden bei dir.\n\nBeste Grüße,\nDein PILAR SYSTEMS Team`,
      html,
    })

    logger.info({ email: to }, 'Contact confirmation sent')
    return true
  } catch (error) {
    logger.error({ error, email: to }, 'Failed to send contact confirmation')
    return false
  }
}
