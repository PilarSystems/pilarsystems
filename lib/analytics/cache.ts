/**
 * Analytics Cache - Re-export from cache-adapter
 * 
 * This file maintains backward compatibility while using the new adapter pattern.
 */

export type { AnalyticsCache } from './cache-adapter'

export {
  getCachedAnalytics,
  setCachedAnalytics,
  invalidateAnalyticsCache
} from './cache-adapter'
