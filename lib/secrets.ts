import crypto from 'crypto'
import { logger } from './logger'

const ALGORITHM = 'aes-256-gcm'
const CURRENT_KEY_VERSION = 'v1'

interface EncryptedData {
  keyVersion: string
  iv: string
  authTag: string
  data: string
}

/**
 * Enhanced secrets service with key versioning and rotation support
 */
export class SecretsService {
  private keys: Map<string, Buffer>
  private initialized: boolean = false

  constructor() {
    this.keys = new Map()
  }

  private loadKeys() {
    if (this.initialized) {
      return
    }

    const currentKey = process.env.ENCRYPTION_KEY
    
    if (!currentKey) {
      if (process.env.NODE_ENV === 'production') {
        logger.warn('ENCRYPTION_KEY not set in production - encryption will fail at runtime')
      }
      const dummyKey = Buffer.alloc(32)
      this.keys.set(CURRENT_KEY_VERSION, dummyKey)
      this.initialized = true
      return
    }
    
    if (currentKey.length !== 64) {
      throw new Error('ENCRYPTION_KEY must be 64 characters (32 bytes hex)')
    }

    this.keys.set(CURRENT_KEY_VERSION, Buffer.from(currentKey, 'hex'))

    const legacyKey = process.env.ENCRYPTION_KEY_LEGACY
    if (legacyKey) {
      this.keys.set('v0', Buffer.from(legacyKey, 'hex'))
    }

    this.initialized = true
  }

  /**
   * Encrypt data with the current key version
   */
  encrypt(plaintext: string): string {
    try {
      this.loadKeys()
      const iv = crypto.randomBytes(16)
      const key = this.keys.get(CURRENT_KEY_VERSION)!
      
      const cipher = crypto.createCipheriv(ALGORITHM, key, iv)
      let encrypted = cipher.update(plaintext, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const authTag = cipher.getAuthTag()

      const result: EncryptedData = {
        keyVersion: CURRENT_KEY_VERSION,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        data: encrypted,
      }

      return JSON.stringify(result)
    } catch (error) {
      logger.error({ error }, 'Failed to encrypt data')
      throw new Error('Encryption failed')
    }
  }

  /**
   * Decrypt data, supporting multiple key versions
   */
  decrypt(ciphertext: string): string {
    try {
      this.loadKeys()
      const encrypted: EncryptedData = JSON.parse(ciphertext)
      
      const key = this.keys.get(encrypted.keyVersion)
      if (!key) {
        throw new Error(`Encryption key version ${encrypted.keyVersion} not found`)
      }

      const iv = Buffer.from(encrypted.iv, 'hex')
      const authTag = Buffer.from(encrypted.authTag, 'hex')
      
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)
      decipher.setAuthTag(authTag)
      
      let decrypted = decipher.update(encrypted.data, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      logger.error({ error }, 'Failed to decrypt data')
      throw new Error('Decryption failed')
    }
  }

  /**
   * Re-encrypt data with the current key version (for key rotation)
   */
  rotate(ciphertext: string): string {
    const plaintext = this.decrypt(ciphertext)
    return this.encrypt(plaintext)
  }

  /**
   * Check if data needs rotation (encrypted with old key version)
   */
  needsRotation(ciphertext: string): boolean {
    try {
      const encrypted: EncryptedData = JSON.parse(ciphertext)
      return encrypted.keyVersion !== CURRENT_KEY_VERSION
    } catch {
      return false
    }
  }

  /**
   * Generate a secure random token
   */
  generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Hash a value (for verification tokens, etc.)
   */
  hash(value: string): string {
    return crypto.createHash('sha256').update(value).digest('hex')
  }

  /**
   * Verify a hashed value
   */
  verifyHash(value: string, hash: string): boolean {
    return this.hash(value) === hash
  }
}

export const secretsService = new SecretsService()

export const encrypt = (plaintext: string) => secretsService.encrypt(plaintext)
export const decrypt = (ciphertext: string) => secretsService.decrypt(ciphertext)
export const generateToken = (length?: number) => secretsService.generateToken(length)
export const hashValue = (value: string) => secretsService.hash(value)
export const verifyHash = (value: string, hash: string) => secretsService.verifyHash(value, hash)
