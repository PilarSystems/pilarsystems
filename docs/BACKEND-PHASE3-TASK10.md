# Backend Phase 3, Task 10: Agent Builder – Personality + Prompt Editor UI

**Date:** November 23, 2024  
**Status:** ✅ Complete

## Overview

Complete Agent Builder for studio owners to configure AI agent personality, prompts, and behavior. Includes live preview with orchestrator integration.

## Architecture

```
Agent Builder → API Routes → Prisma → AgentProfile
                    ↓
              Orchestrator → OpenAI → Response
```

## Files Created

### Prisma Schema

1. **`src/server/db/schema.prisma`** (Updated)
   - Added `AgentProfile` model (19 lines)
   - Added `agentProfile` relation to `Tenant`

### Backend (API Routes)

2. **`/app/api/agent/profile/route.ts`** (110 lines)
   - GET: Load agent profile
   - Auto-create default profile if not exists

3. **`/app/api/agent/update/route.ts`** (145 lines)
   - POST: Update agent profile
   - Validation for all fields

4. **`/app/api/agent/preview/route.ts`** (95 lines)
   - POST: Test agent with orchestrator
   - Real-time AI response

### Frontend (Components)

5. **`/src/components/agent/AgentEditor.tsx`** (245 lines)
   - 2 Tabs: Personality + Prompt
   - Form fields for all agent settings
   - Save button with loading state

6. **`/src/components/agent/AgentPreview.tsx`** (165 lines)
   - Chat interface for testing
   - Message history
   - Real-time responses

7. **`/src/app/dashboard/agent/page.tsx`** (140 lines)
   - Agent Builder page
   - Layout with editor + preview
   - Save status notifications

**Total:** ~900 lines

## Components

### 1. AgentProfile Model (Prisma)

**Schema:**
```prisma
model AgentProfile {
  id          String   @id @default(uuid())
  tenantId    String   @unique
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  name        String   @default("Studio Assistant")
  voiceModel  String   @default("tts-1")
  language    String   @default("de")
  tone        String   @default("friendly")
  greeting    String   @db.Text
  studioRules Json
  prompt      String   @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([tenantId])
}
```

**Fields:**
- `id` - UUID primary key
- `tenantId` - Foreign key to Tenant (unique, one profile per tenant)
- `name` - Agent name (e.g., "Studio Assistant")
- `voiceModel` - TTS model (e.g., "tts-1", "tts-1-hd")
- `language` - Language code (e.g., "de", "en")
- `tone` - Conversation tone (e.g., "friendly", "professional")
- `greeting` - Welcome message
- `studioRules` - Array of rules (JSON)
- `prompt` - System prompt (Text)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### 2. Profile API (`/app/api/agent/profile/route.ts` - 110 lines)

**GET /api/agent/profile**

Get agent profile for current tenant. Creates default profile if not exists.

**Flow:**
1. Get session (tenantId from JWT)
2. Find AgentProfile by tenantId
3. If not exists, create default profile:
   - name: "Studio Assistant"
   - voiceModel: "tts-1"
   - language: "de"
   - tone: "friendly"
   - greeting: "Hey! 👋 Willkommen..."
   - studioRules: 8 default rules
   - prompt: DEFAULT_AGENT_PROMPT.systemPrompt
4. Return profile

**Response (Success):**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Studio Assistant",
    "voiceModel": "tts-1",
    "language": "de",
    "tone": "friendly",
    "greeting": "Hey! 👋 Willkommen bei unserem Fitnessstudio...",
    "studioRules": [
      "Sei immer freundlich und hilfsbereit",
      "Antworte auf Deutsch",
      "Verwende die Du-Form",
      "Sei motivierend und positiv",
      "Gib konkrete Informationen",
      "Frage nach, wenn etwas unklar ist",
      "Biete Probetraining an",
      "Erwähne unsere Öffnungszeiten bei Bedarf"
    ],
    "prompt": "Du bist ein freundlicher KI-Assistent...",
    "createdAt": "2024-11-23T10:00:00.000Z",
    "updatedAt": "2024-11-23T10:00:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

### 3. Update API (`/app/api/agent/update/route.ts` - 145 lines)

**POST /api/agent/update**

Update agent profile for current tenant.

**Request Body:**
```json
{
  "name": "Studio Assistant",
  "voiceModel": "tts-1",
  "language": "de",
  "tone": "friendly",
  "greeting": "Hey! 👋 Willkommen...",
  "studioRules": [
    "Sei immer freundlich und hilfsbereit",
    "Antworte auf Deutsch",
    "..."
  ],
  "prompt": "Du bist ein freundlicher KI-Assistent..."
}
```

**Validation:**
- `name` - Required, string
- `voiceModel` - Required, string
- `language` - Required, string
- `tone` - Required, string
- `greeting` - Required, string
- `studioRules` - Required, array
- `prompt` - Required, string

**Flow:**
1. Get session (tenantId from JWT)
2. Validate all fields
3. Upsert AgentProfile (update if exists, create if not)
4. Return updated profile

**Response (Success):**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Studio Assistant",
    "voiceModel": "tts-1",
    "language": "de",
    "tone": "friendly",
    "greeting": "Hey! 👋 Willkommen...",
    "studioRules": [...],
    "prompt": "...",
    "updatedAt": "2024-11-23T10:05:00.000Z"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Name is required"
}
```

### 4. Preview API (`/app/api/agent/preview/route.ts` - 95 lines)

**POST /api/agent/preview**

Test agent with orchestrator. Sends message to AI and returns response.

**Request Body:**
```json
{
  "message": "Hallo, ich interessiere mich für eine Mitgliedschaft"
}
```

**Flow:**
1. Get session (tenantId from JWT)
2. Validate message
3. Load AgentProfile from database
4. Call orchestrator with:
   - channel: WHATSAPP
   - payload: { from: 'preview-user', text: message, name: 'Test User' }
   - tenantId: session.tenantId
   - metadata: { agentProfile: {...} }
5. Return AI response

**Response (Success):**
```json
{
  "success": true,
  "response": "Hey! 👋 Super, dass du dich für unser Studio interessierst! Wir haben verschiedene Mitgliedschaftsoptionen...",
  "intent": "membership_inquiry",
  "confidence": 0.95
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Message is required"
}
```

### 5. Agent Editor (`/src/components/agent/AgentEditor.tsx` - 245 lines)

**Main editor component with 2 tabs**

**Props:**
```typescript
interface AgentEditorProps {
  profile: AgentProfile
  onSave: (profile: Partial<AgentProfile>) => Promise<void>
  saving: boolean
}
```

**Features:**

**Tab 1: Personality**
- Agent Name (text input)
- Voice Model (select: tts-1, tts-1-hd)
- Language (select: de, en)
- Tone (select: friendly, professional, casual, formal)
- Greeting Message (textarea, 3 rows)
- Studio Rules (dynamic list):
  - Add Rule button
  - Remove Rule button (×)
  - Text input for each rule

**Tab 2: Prompt**
- System Prompt (textarea, 20 rows)
- Code-style editor (monospace font, gray background)
- Placeholder text

**Save Button:**
- Blue button with Save icon
- Loading state (spinner + "Saving...")
- Disabled when saving

**State Management:**
- Local state for form data
- Updates on input change
- Calls onSave on button click

### 6. Agent Preview (`/src/components/agent/AgentPreview.tsx` - 165 lines)

**Chat interface for testing agent**

**Features:**

**Header:**
- Title: "Agent Preview"
- Description: "Test your agent with sample messages"

**Messages Area:**
- Scrollable message list
- User messages (right, blue)
- Agent messages (left, gray)
- Avatar icons (User/Bot)
- Timestamp display
- Loading indicator (spinner)
- Empty state: "No messages yet"

**Input Area:**
- Text input field
- Send button (blue, Send icon)
- Keyboard shortcut: Enter to send, Shift+Enter for new line
- Disabled when loading

**Message Flow:**
1. User types message
2. Press Enter or click Send
3. Add user message to list
4. Call /api/agent/preview
5. Add agent response to list
6. Clear input field

**Error Handling:**
- Display error messages in chat
- Network error handling
- API error handling

### 7. Agent Builder Page (`/src/app/dashboard/agent/page.tsx` - 140 lines)

**Main page for Agent Builder**

**Features:**

**Header:**
- Title: "Agent Builder"
- Description: "Configure your AI agent's personality, prompts, and behavior"
- Save Status:
  - Success: Green checkmark + "Saved successfully"
  - Error: Red X + "Failed to save"
  - Auto-hide after 3 seconds

**Layout:**
- 2-column grid (lg:grid-cols-2)
- Left: AgentEditor
- Right: AgentPreview

**State Management:**
- profile: AgentProfile | null
- loading: boolean
- saving: boolean
- saveStatus: 'idle' | 'success' | 'error'

**Functions:**
- loadProfile() - Fetch profile from API
- handleSave() - Save profile to API

**Loading States:**
- Initial load: Spinner + "Loading agent builder..."
- Error state: Red X + "Failed to load agent profile" + Retry button

## Agent Builder Flow

### Initial Load

**1. User navigates to /dashboard/agent**
```
AuthProvider checks session → Authenticated
```

**2. Page loads profile**
```javascript
GET /api/agent/profile
```

**3. Backend checks for profile**
```
1. Get tenantId from session
2. Find AgentProfile by tenantId
3. If not exists, create default profile
4. Return profile
```

**4. Frontend displays editor + preview**
```
AgentEditor: Shows profile data in form
AgentPreview: Empty chat interface
```

### Edit Flow

**1. User edits personality settings**
```
- Change name: "Studio Assistant" → "Fitness Coach"
- Change tone: "friendly" → "professional"
- Add rule: "Biete Ernährungsberatung an"
```

**2. User clicks Save**
```javascript
POST /api/agent/update
{
  "name": "Fitness Coach",
  "voiceModel": "tts-1",
  "language": "de",
  "tone": "professional",
  "greeting": "...",
  "studioRules": [...],
  "prompt": "..."
}
```

**3. Backend updates profile**
```
1. Get tenantId from session
2. Validate all fields
3. Upsert AgentProfile
4. Return updated profile
```

**4. Frontend shows success**
```
Save Status: Green checkmark + "Saved successfully"
Profile state updated
```

### Preview Flow

**1. User types message in preview**
```
"Hallo, ich interessiere mich für eine Mitgliedschaft"
```

**2. User clicks Send**
```javascript
POST /api/agent/preview
{
  "message": "Hallo, ich interessiere mich für eine Mitgliedschaft"
}
```

**3. Backend processes message**
```
1. Get tenantId from session
2. Load AgentProfile from database
3. Call orchestrator with:
   - channel: WHATSAPP
   - payload: { from: 'preview-user', text: message }
   - tenantId: session.tenantId
   - metadata: { agentProfile: {...} }
4. Orchestrator:
   - Normalize message
   - Detect intent
   - Build AI context
   - Route to module
   - Execute AI response (OpenAI)
5. Return AI response
```

**4. Frontend displays response**
```
User message: "Hallo, ich interessiere mich für eine Mitgliedschaft"
Agent response: "Hey! 👋 Super, dass du dich für unser Studio interessierst!..."
```

## Tenant Isolation

**How Tenant Isolation Works:**

**1. Session contains tenantId**
```json
{
  "tenantId": "550e8400-e29b-41d4-a716-446655440000",
  "ownerId": "660e8400-e29b-41d4-a716-446655440000",
  "email": "owner@studio.com",
  "role": "owner"
}
```

**2. Every API request gets tenantId from session**
```javascript
const session = await getSession()
const tenantId = session.tenantId
```

**3. Database queries filtered by tenantId**
```javascript
const profile = await prisma.agentProfile.findUnique({
  where: { tenantId: session.tenantId }
})
```

**4. No cross-tenant access**
- Each tenant has exactly one AgentProfile
- tenantId is unique constraint
- Cascade delete on tenant deletion

## UI Design (Apple-Style)

### Design Principles

**1. Clean & Minimal**
- White backgrounds
- Subtle borders (gray-200)
- Generous spacing
- No clutter

**2. Tabs**
- Underline style
- Blue active state
- Gray inactive state
- Smooth transitions

**3. Form Fields**
- Rounded corners (rounded-lg)
- Border focus (blue-500)
- Placeholder text (gray-400)
- Label above field

**4. Buttons**
- Blue primary (blue-600)
- Hover state (blue-700)
- Disabled state (opacity-50)
- Icon + text

**5. Chat Interface**
- User messages: Right, blue background
- Agent messages: Left, gray background
- Avatar icons
- Rounded bubbles
- Scrollable area

## Testing

### Test 1: Load Profile

**Request:**
```bash
curl http://localhost:3000/api/agent/profile \
  -H "Cookie: session=eyJhbGciOiJIUzI1NiJ9..."
```

**Expected Response:**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Studio Assistant",
    "voiceModel": "tts-1",
    "language": "de",
    "tone": "friendly",
    "greeting": "Hey! 👋 Willkommen...",
    "studioRules": [...],
    "prompt": "..."
  }
}
```

### Test 2: Update Profile

**Request:**
```bash
curl -X POST http://localhost:3000/api/agent/update \
  -H "Content-Type: application/json" \
  -H "Cookie: session=eyJhbGciOiJIUzI1NiJ9..." \
  -d '{
    "name": "Fitness Coach",
    "voiceModel": "tts-1-hd",
    "language": "de",
    "tone": "professional",
    "greeting": "Willkommen bei unserem Fitnessstudio!",
    "studioRules": [
      "Sei professionell",
      "Antworte auf Deutsch"
    ],
    "prompt": "Du bist ein professioneller Fitness Coach..."
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Fitness Coach",
    "voiceModel": "tts-1-hd",
    "language": "de",
    "tone": "professional",
    "greeting": "Willkommen bei unserem Fitnessstudio!",
    "studioRules": [
      "Sei professionell",
      "Antworte auf Deutsch"
    ],
    "prompt": "Du bist ein professioneller Fitness Coach...",
    "updatedAt": "2024-11-23T10:05:00.000Z"
  }
}
```

### Test 3: Preview Agent

**Request:**
```bash
curl -X POST http://localhost:3000/api/agent/preview \
  -H "Content-Type: application/json" \
  -H "Cookie: session=eyJhbGciOiJIUzI1NiJ9..." \
  -d '{
    "message": "Hallo, ich interessiere mich für eine Mitgliedschaft"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "response": "Hey! 👋 Super, dass du dich für unser Studio interessierst! Wir haben verschiedene Mitgliedschaftsoptionen...",
  "intent": "membership_inquiry",
  "confidence": 0.95
}
```

### Test 4: Preview with Custom Prompt

**Scenario:** User updates prompt to be more formal, then tests

**1. Update profile:**
```json
{
  "prompt": "Du bist ein formeller Kundenberater für ein Premium-Fitnessstudio. Antworte höflich und professionell."
}
```

**2. Test preview:**
```json
{
  "message": "Hallo, ich interessiere mich für eine Mitgliedschaft"
}
```

**Expected Response:**
```json
{
  "success": true,
  "response": "Guten Tag! Vielen Dank für Ihr Interesse an unserem Premium-Fitnessstudio. Gerne berate ich Sie zu unseren Mitgliedschaftsoptionen...",
  "intent": "membership_inquiry",
  "confidence": 0.95
}
```

## Integration with Orchestrator

### How Preview Uses Orchestrator

**1. Preview API receives message**
```javascript
POST /api/agent/preview
{
  "message": "Hallo, ich interessiere mich für eine Mitgliedschaft"
}
```

**2. Load AgentProfile from database**
```javascript
const profile = await prisma.agentProfile.findUnique({
  where: { tenantId: session.tenantId }
})
```

**3. Call orchestrator**
```javascript
const result = await orchestrate({
  channel: Channel.WHATSAPP,
  payload: {
    from: 'preview-user',
    text: message,
    name: 'Test User',
  },
  timestamp: new Date(),
  tenantId: session.tenantId,
  metadata: {
    agentProfile: {
      name: profile.name,
      tone: profile.tone,
      language: profile.language,
      greeting: profile.greeting,
      studioRules: profile.studioRules,
      prompt: profile.prompt,
    },
  },
})
```

**4. Orchestrator processes**
```
1. normalizeIncomingMessage() - Parse message
2. detectIntent() - Detect intent
3. buildAIContext() - Build context
4. routeToModule() - Route to module
5. executeAIResponse() - Call OpenAI with custom prompt
6. Return response
```

**5. Return response to frontend**
```json
{
  "success": true,
  "response": "Hey! 👋 Super, dass du dich für unser Studio interessierst!...",
  "intent": "membership_inquiry",
  "confidence": 0.95
}
```

## Quality

✅ **`npm run lint`** - Passing (only warnings, no errors)  
✅ **`npm run build`** - Passing (0 errors)  
✅ TypeScript Strict Mode  
✅ Prisma Schema Updated  
✅ API Routes with Validation  
✅ Tenant Isolation  
✅ Apple-Style UI  
✅ Real-time Preview  
✅ Orchestrator Integration

## Next Steps

### Future Enhancements

**1. Advanced Editor Features**
- Syntax highlighting for prompt
- Prompt templates
- Version history
- Import/Export profiles

**2. Preview Enhancements**
- Multi-turn conversations
- Save conversation history
- Test different channels (Voice, Email)
- Performance metrics

**3. Agent Testing**
- A/B testing different prompts
- Analytics on agent performance
- User feedback collection
- Conversation quality metrics

**4. Personality Presets**
- Pre-built personality templates
- Industry-specific presets
- Tone analyzer
- Prompt suggestions

**5. Voice Testing**
- Voice preview (TTS)
- Voice model comparison
- Accent selection
- Speed control

## Summary

Phase 3, Task 10 successfully implements a complete Agent Builder with:
- AgentProfile model in Prisma
- 3 API routes (profile, update, preview)
- 2-tab editor (Personality + Prompt)
- Live preview with orchestrator
- Real-time AI responses
- Tenant isolation
- Apple-style UI
- Save/Load functionality
- Validation and error handling

Studio owners can now fully configure their AI agent's personality, prompts, and behavior, and test it in real-time before deploying.
