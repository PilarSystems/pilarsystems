# A/B Testing Framework for PILAR SYSTEMS

## Overview

Lightweight, dependency-free A/B testing framework for optimizing conversion rates across the platform.

## Implementation Strategy

### 1. Cookie-Based Bucketing

```typescript
// lib/ab-testing/bucketing.ts
export function getBucket(experimentId: string, userId?: string): 'A' | 'B' {
  const seed = userId || getCookie('pilar_visitor_id') || generateVisitorId()
  const hash = simpleHash(experimentId + seed)
  return hash % 2 === 0 ? 'A' : 'B'
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash = hash & hash
  }
  return Math.abs(hash)
}

function generateVisitorId(): string {
  const id = crypto.randomUUID()
  setCookie('pilar_visitor_id', id, 365)
  return id
}
