/**
 * PILAR AUTOPILOT - Integration Adapter Interfaces
 * 
 * Defines common interfaces for all integration adapters
 */

export interface IAdapterResult<T = unknown> {
  ok: boolean
  data?: T
  error?: string
  code?: string
}

/**
 * Twilio Adapter Interface
 */
export interface ITwilioAdapter {
  /**
   * Ensure Twilio subaccount exists for workspace
   */
  ensureSubaccount(workspaceId: string): Promise<
    IAdapterResult<{
      subaccountSid: string
      apiKeySid: string
      apiKeySecret: string
    }>
  >

  /**
   * Ensure phone number is purchased for workspace
   */
  ensureNumber(
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
  >

  /**
   * Set webhooks for voice and messaging
   */
  setWebhooks(
    workspaceId: string,
    urls: {
      voice: string
      messaging?: string
    }
  ): Promise<IAdapterResult>

  /**
   * Get status of Twilio integration
   */
  getStatus(workspaceId: string): Promise<
    IAdapterResult<{
      active: boolean
      number?: string
      subaccountSid?: string
    }>
  >
}

/**
 * WhatsApp Adapter Interface
 */
export interface IWhatsAppAdapter {
  /**
   * Send a WhatsApp message
   */
  sendMessage(
    workspaceId: string,
    to: string,
    text: string
  ): Promise<
    IAdapterResult<{
      messageId: string
    }>
  >

  /**
   * Verify webhook token
   */
  verifyWebhook(
    token: string,
    mode: string,
    challenge: string
  ): IAdapterResult<{ challenge: string }>

  /**
   * Get status of WhatsApp integration
   */
  getStatus(workspaceId: string): Promise<
    IAdapterResult<{
      connected: boolean
      phoneNumberId?: string
    }>
  >
}

/**
 * Email Adapter Interface
 */
export interface IEmailAdapter {
  /**
   * Send an email
   */
  send(
    to: string,
    subject: string,
    html: string,
    options?: {
      from?: string
      replyTo?: string
    }
  ): Promise<IAdapterResult>

  /**
   * Get status of email integration
   */
  getStatus(): Promise<
    IAdapterResult<{
      configured: boolean
      provider?: string
    }>
  >
}

/**
 * OpenAI Adapter Interface
 */
export interface IOpenAIAdapter {
  /**
   * Generate a WhatsApp Coach message
   */
  generateCoachMessage(context: {
    tone: string
    goal: string
    lastMessages: string[]
    language: 'DE' | 'EN'
    leadName?: string
    targetAudience?: string
  }): Promise<
    IAdapterResult<{
      text: string
    }>
  >

  /**
   * Generate a support report summary
   */
  generateSupportReport(context: {
    workspaceId: string
    errors: Array<{
      message: string
      timestamp: string
      step?: string
    }>
    jobType: string
  }): Promise<
    IAdapterResult<{
      summary: string
      recommendations: string[]
    }>
  >
}
