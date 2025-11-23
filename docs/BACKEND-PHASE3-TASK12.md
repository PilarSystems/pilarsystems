# Phase 3, Task 12: Live Message Console (Realtime Logs)

**Status:** ✅ Complete  
**Date:** 2024-11-23  
**Branch:** `devin/1763771537-core-launch-automation`

## Overview

Implemented a comprehensive Live Message Console for the PILAR SYSTEMS dashboard that provides real-time logging and monitoring of all AI agent interactions across Voice, WhatsApp, Email, Web, and SMS channels. The system includes tenant-isolated logging, filtering capabilities, and a beautiful Apple-style UI.

## Architecture

### Backend Components

#### 1. Log Types (`/src/server/logs/log.types.ts`)

**Purpose:** TypeScript types and interfaces for the logging system.

**Key Types:**
- `LogLevel`: INFO, WARNING, ERROR, DEBUG
- `LogType`: MESSAGE_RECEIVED, MESSAGE_SENT, INTENT_DETECTED, ROUTING_DECISION, MODULE_EXECUTION, AI_RESPONSE, ERROR, SYSTEM
- `MessageLog`: Complete log entry with all metadata
- `LogFilter`: Filtering options for querying logs
- `LogStats`: Statistics about logs

**MessageLog Interface:**
```typescript
interface MessageLog {
  id: string
  tenantId: string
  timestamp: Date
  level: LogLevel
  type: LogType
  channel: Channel
  
  // User/Session Info
  userId?: string
  userName?: string
  phoneNumber?: string
  email?: string
  sessionId?: string
  callId?: string
  
  // Message Content
  messageId?: string
  content?: string
  
  // Intent Detection
  intent?: Intent
  intentConfidence?: number
  entities?: Record<string, any>
  
  // Routing
  module?: Module
  routingParams?: Record<string, any>
  
  // Response
  response?: string
  responseMetadata?: Record<string, any>
  
  // Performance
  latency?: number
  processingTime?: number
  
  // Error Info
  error?: string
  errorStack?: string
  
  // Raw Data
  rawRequest?: any
  rawResponse?: any
  
  // Metadata
  metadata?: Record<string, any>
}
```

#### 2. Log Store (`/src/server/logs/log.store.ts`)

**Purpose:** In-memory store for message logs with tenant isolation.

**Features:**
- Tenant-isolated storage (Map<tenantId, MessageLog[]>)
- Automatic log rotation (max 1000 logs per tenant)
- Filtering by channel, level, type, date range, user, session
- Pagination support
- Fast in-memory access

**Key Methods:**
- `append(log: MessageLog)`: Add new log entry
- `getLogs(filter: LogFilter)`: Get logs with filtering
- `getLogById(tenantId, logId)`: Get specific log
- `clearLogs(tenantId)`: Clear all logs for tenant
- `getLogCount(tenantId)`: Get total log count

**Production Note:**
For production deployments with multiple servers or high volume, replace with:
- Database storage (PostgreSQL with time-series optimization)
- Redis for fast access
- Elasticsearch for advanced search
- Log aggregation service (e.g., Datadog, CloudWatch)

#### 3. Log Service (`/src/server/logs/log.service.ts`)

**Purpose:** Service layer for creating and managing logs.

**Key Functions:**

**logMessageReceived:**
```typescript
function logMessageReceived(
  tenantId: string,
  channel: Channel,
  content: string,
  metadata: {
    userId?: string
    userName?: string
    phoneNumber?: string
    email?: string
    sessionId?: string
    callId?: string
    messageId?: string
    rawRequest?: any
  }
): MessageLog
```

**logOrchestratorResult:**
```typescript
function logOrchestratorResult(
  tenantId: string,
  channel: Channel,
  result: OrchestratorResult,
  metadata: {
    userId?: string
    userName?: string
    phoneNumber?: string
    email?: string
    sessionId?: string
    callId?: string
  }
): void
```

Creates 4 log entries:
1. Intent Detection log
2. Routing Decision log
3. Module Execution log
4. AI Response log

**logError:**
```typescript
function logError(
  tenantId: string,
  channel: Channel,
  error: string | Error,
  metadata: {
    userId?: string
    sessionId?: string
    callId?: string
    rawRequest?: any
    rawResponse?: any
  }
): MessageLog
```

**getLogStats:**
```typescript
function getLogStats(tenantId: string): LogStats
```

Returns:
- Total logs
- Logs by channel
- Logs by level
- Logs by type
- Average latency
- Error rate

### API Routes

#### 1. GET /api/logs

**Purpose:** Fetch logs with filtering and pagination.

**Query Parameters:**
- `channel`: Filter by channel (whatsapp, voice, email, web, sms)
- `level`: Filter by level (info, warning, error, debug)
- `type`: Filter by type (message_received, intent_detected, etc.)
- `limit`: Number of logs to return (default: 100)
- `offset`: Pagination offset (default: 0)
- `includeStats`: Include statistics (default: false)

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "timestamp": "2024-11-23T10:00:00.000Z",
      "level": "info",
      "type": "intent_detected",
      "channel": "voice",
      "content": "Hallo, ich möchte einen Trainingsplan",
      "intent": "training_plan",
      "intentConfidence": 0.95,
      "module": "training_plan_engine",
      "latency": 1234
    }
  ],
  "stats": {
    "totalLogs": 42,
    "byChannel": { "voice": 20, "whatsapp": 22 },
    "averageLatency": 856
  },
  "pagination": {
    "limit": 100,
    "offset": 0,
    "total": 42
  }
}
```

**Authentication:** Requires valid session (JWT)  
**Tenant Isolation:** Automatically filters by session.tenantId

#### 2. POST /api/logs/append

**Purpose:** Append a new log entry (internal use).

**Request Body:**
```json
{
  "type": "message_received",
  "channel": "whatsapp",
  "content": "Hallo, ich möchte einen Trainingsplan",
  "metadata": {
    "userId": "user-123",
    "userName": "John Doe",
    "phoneNumber": "+49123456789"
  }
}
```

**Response:**
```json
{
  "success": true,
  "log": {
    "id": "uuid",
    "tenantId": "uuid",
    "timestamp": "2024-11-23T10:00:00.000Z",
    "level": "info",
    "type": "message_received",
    "channel": "whatsapp",
    "content": "Hallo, ich möchte einen Trainingsplan"
  }
}
```

**Authentication:** Requires valid session (JWT)  
**Tenant Isolation:** Uses session.tenantId

#### 3. POST /api/logs/clear

**Purpose:** Clear all logs for the current tenant.

**Request:** Empty body

**Response:**
```json
{
  "success": true,
  "message": "Logs cleared successfully"
}
```

**Authentication:** Requires valid session (JWT)  
**Tenant Isolation:** Only clears logs for session.tenantId

### Integration Points

#### Voice Test API Integration

**File:** `/app/api/test/voice/route.ts`

**Integration:**
```typescript
import { logOrchestratorResult } from '@/src/server/logs/log.service'

// After orchestrator call
logOrchestratorResult(
  session.tenantId,
  Channel.VOICE,
  result,
  {
    userId: 'test-user',
    userName: 'Test User',
    callId: `test-${Date.now()}`,
  }
)
```

**Logs Created:**
1. Intent Detection (intent, confidence, entities)
2. Routing Decision (module, routing params)
3. Module Execution (processing time)
4. AI Response (response content, latency)

#### WhatsApp Test API Integration

**File:** `/app/api/test/whatsapp/route.ts`

**Integration:**
```typescript
import { logOrchestratorResult } from '@/src/server/logs/log.service'

// After orchestrator call
logOrchestratorResult(
  session.tenantId,
  Channel.WHATSAPP,
  result,
  {
    userId: 'test-user',
    userName: 'Test User',
    phoneNumber: 'test-user',
  }
)
```

**Logs Created:**
1. Intent Detection (intent, confidence, entities)
2. Routing Decision (module, routing params)
3. Module Execution (processing time)
4. AI Response (response content, latency)

### Frontend Components

#### 1. MessageLogItem Component

**File:** `/src/components/messages/MessageLogItem.tsx`

**Purpose:** Display individual log entry with expandable details.

**Features:**
- Collapsible/Expandable view
- Channel icon with color coding
- Level badge (INFO, WARNING, ERROR, DEBUG)
- Type badge (Message Received, Intent Detected, etc.)
- Intent badge with confidence percentage
- Module badge
- Content preview (2 lines max)
- Response preview
- Error display
- Timestamp formatting (German locale)
- Copy to clipboard (full JSON)
- Expandable sections:
  - User Info (ID, name, phone, email)
  - Intent & Routing (intent, confidence, module, entities)
  - Performance (latency, processing time)
  - Raw Data (request, response)
  - Full JSON

**Channel Colors:**
- WhatsApp: Green
- Voice: Purple
- Email: Blue
- Web: Gray
- SMS: Yellow

**Level Colors:**
- ERROR: Red
- WARNING: Yellow
- INFO: Blue
- DEBUG: Gray

**UI Design:**
- Apple-style rounded corners
- Smooth hover transitions
- Clean typography
- Proper spacing
- Responsive layout

#### 2. MessageFilters Component

**File:** `/src/components/messages/MessageFilters.tsx`

**Purpose:** Filter logs by level and type.

**Features:**
- Log Level filter (All, Info, Warning, Error)
- Log Type dropdown (All Types, Message Received, Intent Detected, etc.)
- Clear filters button
- Active filter indicator
- Grid layout for level buttons
- Color-coded level buttons

**Filter Options:**

**Level:**
- All
- Info (Blue)
- Warning (Yellow)
- Error (Red)

**Type:**
- All Types
- Message Received
- Message Sent
- Intent Detected
- Routing Decision
- Module Execution
- AI Response
- Error
- System

#### 3. ChannelTabs Component

**File:** `/src/components/messages/ChannelTabs.tsx`

**Purpose:** Switch between different channels.

**Features:**
- Tab navigation (All, Voice, WhatsApp, Email, Web, SMS)
- Channel icons
- Optional log counts per channel
- Active tab highlighting
- Smooth transitions

**Tabs:**
- All (no icon)
- Voice (Phone icon)
- WhatsApp (MessageCircle icon)
- Email (Mail icon)
- Web (Globe icon)
- SMS (MessageSquare icon)

#### 4. MessageStream Component

**File:** `/src/components/messages/MessageStream.tsx`

**Purpose:** Display stream of logs with auto-refresh.

**Features:**
- Auto-refresh every 3 seconds (toggleable)
- Manual refresh button
- Clear logs button (with confirmation)
- Log count display
- Empty state (no logs yet)
- Loading state (spinner)
- Error state (with retry)
- Filters applied automatically
- Pagination support

**Controls:**
- Refresh button
- Auto-refresh checkbox
- Clear logs button (red, destructive)

**Empty State:**
- Icon: MessageCircle
- Title: "No Logs Yet"
- Description: "Logs will appear here when you test Voice or WhatsApp engines."

#### 5. Messages Page

**File:** `/src/app/dashboard/messages/page.tsx`

**Purpose:** Main page for Live Message Console.

**Layout:**
- Header with Activity icon and title
- Channel tabs (full width)
- 2-column layout:
  - Left: Filters sidebar (1/4 width)
  - Right: Message stream (3/4 width)

**State Management:**
- Active channel (all, voice, whatsapp, email, web, sms)
- Log level filter (all, info, warning, error, debug)
- Log type filter (all, message_received, intent_detected, etc.)

**Features:**
- Responsive layout (stacks on mobile)
- Real-time updates
- Tenant isolation (automatic)
- Apple-style UI

## Example Log Flow

### Voice Test Example

**1. User Action:**
```
User clicks microphone in Voice Test
Speaks: "Hallo, ich möchte einen Trainingsplan"
```

**2. Logs Created:**

**Log 1: Intent Detection**
```json
{
  "id": "log-1",
  "tenantId": "tenant-123",
  "timestamp": "2024-11-23T10:00:00.000Z",
  "level": "info",
  "type": "intent_detected",
  "channel": "voice",
  "content": "Hallo, ich möchte einen Trainingsplan",
  "intent": "training_plan",
  "intentConfidence": 0.95,
  "entities": {},
  "userId": "test-user",
  "userName": "Test User",
  "callId": "test-1700740800000"
}
```

**Log 2: Routing Decision**
```json
{
  "id": "log-2",
  "tenantId": "tenant-123",
  "timestamp": "2024-11-23T10:00:00.100Z",
  "level": "info",
  "type": "routing_decision",
  "channel": "voice",
  "intent": "training_plan",
  "module": "training_plan_engine",
  "routingParams": { "confidence": 0.95 },
  "userId": "test-user",
  "userName": "Test User",
  "callId": "test-1700740800000"
}
```

**Log 3: Module Execution**
```json
{
  "id": "log-3",
  "tenantId": "tenant-123",
  "timestamp": "2024-11-23T10:00:01.234Z",
  "level": "info",
  "type": "module_execution",
  "channel": "voice",
  "module": "training_plan_engine",
  "processingTime": 1234,
  "userId": "test-user",
  "userName": "Test User",
  "callId": "test-1700740800000"
}
```

**Log 4: AI Response**
```json
{
  "id": "log-4",
  "tenantId": "tenant-123",
  "timestamp": "2024-11-23T10:00:01.234Z",
  "level": "info",
  "type": "ai_response",
  "channel": "voice",
  "response": "Ich habe einen personalisierten Trainingsplan für dich erstellt! 💪...",
  "responseMetadata": {
    "module": "training_plan_engine",
    "intent": "training_plan",
    "confidence": 0.95,
    "processingTime": 1234
  },
  "latency": 1234,
  "userId": "test-user",
  "userName": "Test User",
  "callId": "test-1700740800000"
}
```

**3. UI Display:**

Live Message Console shows 4 log entries:
- Intent Detected: training_plan (95%)
- Routing Decision: → training_plan_engine
- Module Execution: 1234ms
- AI Response: "Ich habe einen personalisierten Trainingsplan..."

### WhatsApp Test Example

**1. User Action:**
```
User types in WhatsApp Test: "Hallo, ich interessiere mich für eine Mitgliedschaft"
Clicks Send
```

**2. Logs Created:**

**Log 1: Intent Detection**
```json
{
  "id": "log-5",
  "tenantId": "tenant-123",
  "timestamp": "2024-11-23T10:05:00.000Z",
  "level": "info",
  "type": "intent_detected",
  "channel": "whatsapp",
  "content": "Hallo, ich interessiere mich für eine Mitgliedschaft",
  "intent": "lead_qualification",
  "intentConfidence": 0.92,
  "entities": {},
  "userId": "test-user",
  "userName": "Test User",
  "phoneNumber": "test-user"
}
```

**Log 2: Routing Decision**
```json
{
  "id": "log-6",
  "tenantId": "tenant-123",
  "timestamp": "2024-11-23T10:05:00.050Z",
  "level": "info",
  "type": "routing_decision",
  "channel": "whatsapp",
  "intent": "lead_qualification",
  "module": "general_ai",
  "routingParams": { "confidence": 0.92 },
  "userId": "test-user",
  "userName": "Test User",
  "phoneNumber": "test-user"
}
```

**Log 3: Module Execution**
```json
{
  "id": "log-7",
  "tenantId": "tenant-123",
  "timestamp": "2024-11-23T10:05:00.906Z",
  "level": "info",
  "type": "module_execution",
  "channel": "whatsapp",
  "module": "general_ai",
  "processingTime": 856,
  "userId": "test-user",
  "userName": "Test User",
  "phoneNumber": "test-user"
}
```

**Log 4: AI Response**
```json
{
  "id": "log-8",
  "tenantId": "tenant-123",
  "timestamp": "2024-11-23T10:05:00.906Z",
  "level": "info",
  "type": "ai_response",
  "channel": "whatsapp",
  "response": "Hey! 👋 Super, dass du dich für unser Studio interessierst!...",
  "responseMetadata": {
    "module": "general_ai",
    "intent": "lead_qualification",
    "confidence": 0.92,
    "processingTime": 856
  },
  "latency": 856,
  "userId": "test-user",
  "userName": "Test User",
  "phoneNumber": "test-user"
}
```

**3. UI Display:**

Live Message Console shows 4 log entries:
- Intent Detected: lead_qualification (92%)
- Routing Decision: → general_ai
- Module Execution: 856ms
- AI Response: "Hey! 👋 Super, dass du dich für unser Studio interessierst!..."

## Files Created

### Backend (10 files)

1. `/src/server/logs/log.types.ts` (95 lines)
   - TypeScript types for logging system

2. `/src/server/logs/log.store.ts` (107 lines)
   - In-memory log storage with tenant isolation

3. `/src/server/logs/log.service.ts` (298 lines)
   - Service layer for log management

4. `/app/api/logs/route.ts` (84 lines)
   - GET endpoint for fetching logs

5. `/app/api/logs/append/route.ts` (72 lines)
   - POST endpoint for appending logs

6. `/app/api/logs/clear/route.ts` (38 lines)
   - POST endpoint for clearing logs

7. `/app/api/test/voice/route.ts` (updated)
   - Added logging integration

8. `/app/api/test/whatsapp/route.ts` (updated)
   - Added logging integration

### Frontend (5 files)

9. `/src/components/messages/MessageLogItem.tsx` (329 lines)
   - Individual log entry component

10. `/src/components/messages/MessageFilters.tsx` (120 lines)
    - Filter controls component

11. `/src/components/messages/ChannelTabs.tsx` (64 lines)
    - Channel navigation tabs

12. `/src/components/messages/MessageStream.tsx` (189 lines)
    - Log stream with auto-refresh

13. `/src/app/dashboard/messages/page.tsx` (64 lines)
    - Main messages page

### Documentation

14. `/docs/BACKEND-PHASE3-TASK12.md` (this file)

**Total:** 14 files, ~1,460 lines of code

## Testing

### Manual Testing Steps

**1. Navigate to Messages Page:**
```
http://localhost:3000/dashboard/messages
```

**2. Test Voice Logging:**
- Go to `/dashboard/test`
- Click "Voice Test" tab
- Click microphone button
- Speak: "Hallo, ich möchte einen Trainingsplan"
- Stop recording
- Wait for response
- Go to `/dashboard/messages`
- Verify 4 log entries appear:
  - Intent Detected
  - Routing Decision
  - Module Execution
  - AI Response

**3. Test WhatsApp Logging:**
- Go to `/dashboard/test`
- Click "WhatsApp Test" tab
- Type: "Hallo, ich interessiere mich für eine Mitgliedschaft"
- Click Send
- Wait for response
- Go to `/dashboard/messages`
- Verify 4 log entries appear

**4. Test Filters:**
- Click "Voice" tab → Only voice logs shown
- Click "WhatsApp" tab → Only WhatsApp logs shown
- Click "All" tab → All logs shown
- Select "Error" level → Only error logs shown
- Select "Intent Detected" type → Only intent logs shown
- Click "Clear" → All filters reset

**5. Test Auto-Refresh:**
- Verify auto-refresh checkbox is checked
- Send test message
- Wait 3 seconds
- Verify new logs appear automatically
- Uncheck auto-refresh
- Send test message
- Verify logs don't appear until manual refresh

**6. Test Clear Logs:**
- Click "Clear Logs" button
- Confirm dialog
- Verify all logs are cleared

**7. Test Expandable Details:**
- Click on any log entry
- Verify expanded view shows:
  - User Info
  - Intent & Routing
  - Performance
  - Raw Data
  - Full JSON
- Click "Copy" button
- Verify JSON is copied to clipboard

### Build & Lint Status

**Lint:**
```bash
npm run lint
```
✅ Passing (only warnings, no errors)

**Build:**
```bash
npm run build
```
✅ Passing (0 errors)

**TypeScript:**
✅ Strict mode enabled
✅ All types properly defined
✅ No type errors

## Security & Tenant Isolation

### Tenant Isolation

**Backend:**
- All log operations require authentication (JWT session)
- Logs are automatically filtered by `session.tenantId`
- No cross-tenant data access possible
- Log store uses tenant ID as primary key

**API Routes:**
- GET /api/logs: Filters by session.tenantId
- POST /api/logs/append: Uses session.tenantId
- POST /api/logs/clear: Only clears session.tenantId logs

**Frontend:**
- All API calls include session cookie
- No tenant ID exposed in UI
- Automatic tenant context from session

### Data Privacy

**Sensitive Data:**
- Phone numbers: Stored in logs (for debugging)
- Email addresses: Stored in logs (for debugging)
- User names: Stored in logs (for debugging)
- Message content: Stored in logs (for debugging)

**Production Recommendations:**
- Implement log retention policy (e.g., 7 days)
- Add PII masking for sensitive fields
- Encrypt logs at rest
- Add audit logging for log access
- Implement GDPR compliance (right to deletion)

### Performance

**In-Memory Store:**
- Fast read/write operations
- Limited to 1000 logs per tenant
- Automatic log rotation
- No database overhead

**Limitations:**
- Logs lost on server restart
- Not suitable for multi-server deployments
- Limited search capabilities
- No historical data retention

**Production Recommendations:**
- Use PostgreSQL with time-series optimization
- Implement Redis caching layer
- Add Elasticsearch for advanced search
- Use log aggregation service (Datadog, CloudWatch)
- Implement log archival to S3/GCS

## Future Enhancements

### Phase 1: Database Storage
- Migrate from in-memory to PostgreSQL
- Add indexes for fast queries
- Implement log retention policy
- Add log archival

### Phase 2: Advanced Filtering
- Date range picker
- User search
- Session tracking
- Full-text search

### Phase 3: Analytics
- Log statistics dashboard
- Error rate tracking
- Performance metrics
- Channel usage analytics

### Phase 4: Real-time Updates
- WebSocket integration
- Live log streaming
- Push notifications for errors
- Real-time dashboard

### Phase 5: Export & Reporting
- Export logs to CSV/JSON
- Generate reports
- Email alerts for errors
- Slack/Discord integration

## Conclusion

Phase 3, Task 12 is complete! The Live Message Console provides comprehensive real-time logging and monitoring for all AI agent interactions. Studio owners can now:

✅ Monitor Voice and WhatsApp interactions in real-time  
✅ Track intent detection and routing decisions  
✅ View AI responses and performance metrics  
✅ Filter logs by channel, level, and type  
✅ Debug errors with full request/response data  
✅ Clear logs when needed  
✅ Auto-refresh for live monitoring  

The system is fully tenant-isolated, secure, and ready for production use with the recommended enhancements for scale.
