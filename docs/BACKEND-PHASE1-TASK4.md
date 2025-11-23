# Backend Phase 1, Task 4: Orchestrator Grundgerüst (KI-BRAIN)

**Date:** November 22, 2024  
**Status:** ✅ Complete

## Overview

Central AI Orchestrator (KI-BRAIN) that processes messages from all channels, detects intent, routes to appropriate modules, and executes responses.

## Architecture

```
Incoming Message → Normalize → Detect Intent → Build Context → Route → Execute → Response
```

## Modules Created

### 1. orchestrator.types.ts
- Enums: Channel, Intent, Module
- Interfaces: RawMessage, NormalizedMessage, IntentDetectionResult, AIContext, RoutingDecision, AIResponse, OrchestratorResult

### 2. intentDetection.service.ts
- `detectIntentWithRules()` - Fast rule-based detection
- `detectIntentWithAI()` - OpenAI-based detection
- `detectIntent()` - Main function

### 3. routingRules.ts
- `routeToModule()` - Maps intent to module
- `isModuleAvailable()` - Checks implementation status
- `getFallbackModule()` - Returns fallback

### 4. orchestrator.service.ts
- `normalizeIncomingMessage()` - Normalization
- `buildAIContext()` - Context builder
- `executeAIResponse()` - Execution
- `orchestrate()` - Main pipeline

### 5. API Route
- `POST /api/orchestrator/process`

## Routing Table

- `training_plan` → `training_plan_engine` ✅
- `booking` → `booking_engine` ⏳ Stub
- `gym_buddy` → `training_plan_engine` ✅
- `lead_qualification` → `whatsapp_engine` ⏳ Stub
- `voice_call` → `voice_engine` ⏳ Stub
- `general_question` → `general_ai` ✅
- `fallback` → `general_ai` ✅

## Example: WhatsApp Training Plan

**Request:**
```bash
curl -X POST http://localhost:3000/api/orchestrator/process \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "whatsapp",
    "payload": {
      "from": "+491234567890",
      "message": {"text": {"body": "Ich brauche einen Trainingsplan"}}
    },
    "tenantId": "tenant-123"
  }'
```

**Flow:**
1. Normalize: Extract content from WhatsApp payload
2. Detect Intent: training_plan (0.8 confidence)
3. Build Context: Fetch tenant data
4. Route: training_plan_engine
5. Execute: Generate workout plan

## Example: Voice Call (Stub)

**Request:**
```bash
curl -X POST http://localhost:3000/api/orchestrator/process \
  -H "Content-Type: application/json" \
  -d '{
    "channel": "voice",
    "payload": {"transcript": "Ich möchte einen Termin buchen"},
    "tenantId": "tenant-123"
  }'
```

**Response:** Stub message (booking engine not implemented)

## Quality Checks

✅ `npm run lint` - Passing  
✅ `npm run build` - Passing  
✅ Fully typed

## Files Created

1. `/src/server/orchestrator/orchestrator.types.ts`
2. `/src/server/orchestrator/intentDetection.service.ts`
3. `/src/server/orchestrator/routingRules.ts`
4. `/src/server/orchestrator/orchestrator.service.ts`
5. `/app/api/orchestrator/process/route.ts`
6. `/docs/BACKEND-PHASE1-TASK4.md`

## Next Steps

- Phase 2, Task 1: Voice AI Integration
- Phase 2, Task 2: WhatsApp Bot
- Phase 2, Task 3: Booking System
