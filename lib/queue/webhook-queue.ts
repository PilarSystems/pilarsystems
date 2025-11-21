/**
 * Webhook Queue - Re-export from upstash-adapter
 * 
 * This file maintains backward compatibility while using the new adapter pattern.
 */

export {
  enqueueWebhook,
  dequeueWebhook,
  getQueueLength,
  checkRateLimit
} from './upstash-adapter'
