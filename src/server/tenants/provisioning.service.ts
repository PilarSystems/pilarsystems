/**
 * Tenant Provisioning Service
 * 
 * Handles automatic tenant setup and configuration
 */

import { prisma } from '../db/client'
import { DEFAULT_TENANT_CONFIG, DefaultTenantConfig } from './defaultTenantConfig'
import { DEFAULT_AGENT_PROMPT } from '../orchestrator/prompts/defaultAgentPrompt'
import bcrypt from 'bcryptjs'

export interface CreateTenantInput {
  studioName: string
  ownerEmail: string
  password: string
  domain?: string
  config?: Partial<DefaultTenantConfig>
}

export interface CreateTenantResult {
  success: boolean
  tenantId?: string
  ownerId?: string
  defaultConfig?: any
  status?: string
  error?: string
}

/**
 * Tenant Provisioning Service
 */
export class TenantProvisioningService {
  /**
   * Create new tenant with full setup
   */
  async createTenant(input: CreateTenantInput): Promise<CreateTenantResult> {
    console.log(`[PROVISIONING] Creating tenant: ${input.studioName}`)

    try {
      const existingUser = await prisma.tenantUser.findFirst({
        where: { email: input.ownerEmail },
      })

      if (existingUser) {
        return {
          success: false,
          error: 'Email already exists',
        }
      }

      const passwordHash = await bcrypt.hash(input.password, 10)

      const tenant = await prisma.tenant.create({
        data: {
          name: input.studioName,
          domain: input.domain,
        },
      })

      console.log(`[PROVISIONING] Tenant created: ${tenant.id}`)

      const owner = await prisma.tenantUser.create({
        data: {
          tenantId: tenant.id,
          email: input.ownerEmail,
          passwordHash,
          role: 'owner',
        },
      })

      console.log(`[PROVISIONING] Owner created: ${owner.id}`)

      await this.setupVoice(tenant.id)

      await this.setupWhatsApp(tenant.id)

      await this.setupDefaults(tenant.id)

      await this.seedAIProfiles(tenant.id)

      const config = DEFAULT_TENANT_CONFIG

      console.log(`[PROVISIONING] Tenant setup complete: ${tenant.id}`)

      return {
        success: true,
        tenantId: tenant.id,
        ownerId: owner.id,
        defaultConfig: config,
        status: 'ready',
      }

    } catch (error) {
      console.error('[PROVISIONING] Error creating tenant:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Setup Voice Agent for tenant
   */
  async setupVoice(tenantId: string): Promise<void> {
    console.log(`[PROVISIONING] Setting up Voice Agent for tenant: ${tenantId}`)

    try {
      await prisma.phoneNumber.create({
        data: {
          tenantId,
          number: `+49${Date.now().toString().slice(-10)}`, // Temporary number
          sipCredentials: {
            username: `tenant_${tenantId}`,
            password: this.generateRandomString(32),
            domain: 'sip.pilarsystems.com',
          },
          status: 'PENDING',
        },
      })

      console.log(`[PROVISIONING] Voice Agent setup complete for tenant: ${tenantId}`)

    } catch (error) {
      console.error('[PROVISIONING] Error setting up Voice Agent:', error)
      throw error
    }
  }

  /**
   * Setup WhatsApp Agent for tenant
   */
  async setupWhatsApp(tenantId: string): Promise<void> {
    console.log(`[PROVISIONING] Setting up WhatsApp Agent for tenant: ${tenantId}`)

    try {
      await prisma.whatsAppChannel.create({
        data: {
          tenantId,
          waNumber: `+49${Date.now().toString().slice(-10)}`, // Temporary number
          waCloudApiConfig: {
            phoneNumberId: 'PENDING',
            accessToken: 'PENDING',
            businessAccountId: 'PENDING',
            webhookVerifyToken: this.generateRandomString(32),
          },
          status: 'PENDING',
        },
      })

      console.log(`[PROVISIONING] WhatsApp Agent setup complete for tenant: ${tenantId}`)

    } catch (error) {
      console.error('[PROVISIONING] Error setting up WhatsApp Agent:', error)
      throw error
    }
  }

  /**
   * Setup default configuration for tenant
   */
  async setupDefaults(tenantId: string): Promise<void> {
    console.log(`[PROVISIONING] Setting up defaults for tenant: ${tenantId}`)

    try {
      const integrations = [
        {
          tenantId,
          type: 'MAGICLINE' as const,
          config: {
            apiKey: '',
            apiUrl: '',
            enabled: false,
          },
          active: false,
        },
        {
          tenantId,
          type: 'FITOGRAM' as const,
          config: {
            apiKey: '',
            apiUrl: '',
            enabled: false,
          },
          active: false,
        },
        {
          tenantId,
          type: 'GOOGLE_CALENDAR' as const,
          config: {
            clientId: '',
            clientSecret: '',
            refreshToken: '',
            enabled: false,
          },
          active: false,
        },
      ]

      for (const integration of integrations) {
        await prisma.tenantIntegration.create({
          data: integration,
        })
      }

      console.log(`[PROVISIONING] Defaults setup complete for tenant: ${tenantId}`)

    } catch (error) {
      console.error('[PROVISIONING] Error setting up defaults:', error)
      throw error
    }
  }

  /**
   * Seed AI profiles for tenant
   */
  async seedAIProfiles(tenantId: string): Promise<void> {
    console.log(`[PROVISIONING] Seeding AI profiles for tenant: ${tenantId}`)

    try {
      await prisma.conversation.create({
        data: {
          tenantId,
          channel: 'VOICE',
          transcript: {
            messages: [],
            systemPrompt: DEFAULT_AGENT_PROMPT.systemPrompt,
            profile: DEFAULT_AGENT_PROMPT,
          },
          metadata: {
            type: 'system_initialization',
            config: DEFAULT_TENANT_CONFIG,
          },
        },
      })

      console.log(`[PROVISIONING] AI profiles seeded for tenant: ${tenantId}`)

    } catch (error) {
      console.error('[PROVISIONING] Error seeding AI profiles:', error)
      throw error
    }
  }

  /**
   * Get tenant by ID
   */
  async getTenant(tenantId: string) {
    return prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        phoneNumbers: true,
        whatsappChannels: true,
        tenantIntegrations: true,
        tenantUsers: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
          },
        },
      },
    })
  }

  /**
   * Get tenant by domain
   */
  async getTenantByDomain(domain: string) {
    return prisma.tenant.findUnique({
      where: { domain },
      include: {
        phoneNumbers: true,
        whatsappChannels: true,
        tenantIntegrations: true,
      },
    })
  }

  /**
   * Update tenant configuration
   */
  async updateTenantConfig(tenantId: string, config: Partial<DefaultTenantConfig>) {
    console.log(`[PROVISIONING] Updating config for tenant: ${tenantId}`)
    return config
  }

  /**
   * Delete tenant (with cascade)
   */
  async deleteTenant(tenantId: string): Promise<boolean> {
    try {
      await prisma.tenant.delete({
        where: { id: tenantId },
      })
      console.log(`[PROVISIONING] Tenant deleted: ${tenantId}`)
      return true
    } catch (error) {
      console.error('[PROVISIONING] Error deleting tenant:', error)
      return false
    }
  }

  /**
   * Generate random string
   */
  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

let provisioningServiceInstance: TenantProvisioningService | null = null

/**
 * Get provisioning service instance
 */
export function getProvisioningService(): TenantProvisioningService {
  if (!provisioningServiceInstance) {
    provisioningServiceInstance = new TenantProvisioningService()
  }
  return provisioningServiceInstance
}
