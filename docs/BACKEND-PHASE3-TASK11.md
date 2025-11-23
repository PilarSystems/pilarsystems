# Backend Phase 3, Task 11: Voice Test UI + WhatsApp Test UI + Live Agent Preview

**Date:** November 23, 2024  
**Status:** ✅ Complete

## Overview

Complete test environment for studio owners to test Voice and WhatsApp engines in real-time with live agent preview and debug console.

## Architecture

```
Test Dashboard
├── Voice Test: Browser Mic → Speech Recognition → Orchestrator → TTS → Audio
├── WhatsApp Test: Chat UI → Orchestrator → Text Response
├── Preview Card: Intent → Routing → Module → Response
└── Debug Console: Full JSON Logs with Timestamps
```

## Files Created

### Backend (API Routes)

1. **`/app/api/test/voice/route.ts`** (165 lines)
   - POST: Test voice input with orchestrator
   - Generate TTS audio response
   - Tenant context integration

2. **`/app/api/test/whatsapp/route.ts`** (120 lines)
   - POST: Test WhatsApp message with orchestrator
   - Full result with debug info
   - Tenant context integration

### Frontend (Components)

3. **`/src/components/test/VoiceTest.tsx`** (280 lines)
   - Browser microphone access (getUserMedia)
   - Speech recognition (Web Speech API)
   - Audio playback (TTS response)
   - Recording controls

4. **`/src/components/test/WhatsAppTest.tsx`** (230 lines)
   - Chat interface (messenger-style)
   - Message history
   - Real-time responses
   - Loading states

5. **`/src/components/test/PreviewCard.tsx`** (180 lines)
   - Intent detection display
   - Routing decision display
   - AI response display
   - Confidence scores

6. **`/src/components/test/DebugConsole.tsx`** (130 lines)
   - Full JSON logs
   - Expandable/collapsible
   - Copy to clipboard
   - Request/Response/Error types

7. **`/src/app/dashboard/test/page.tsx`** (140 lines)
   - Test Dashboard page
   - Tab navigation (Voice/WhatsApp)
   - Layout with test + preview
   - Clear logs functionality

**Total:** ~1,245 lines

## Components

### 1. Voice Test API (`/app/api/test/voice/route.ts` - 165 lines)

**POST /api/test/voice**

Test voice input with orchestrator and generate TTS audio.

**Request Body:**
```json
{
  "text": "Hallo, ich möchte einen Trainingsplan",
  "generateAudio": true
}
```

**Flow:**
1. Get session (tenantId from JWT)
2. Validate text input
3. Load AgentProfile for tenant context
4. Call orchestrator with VOICE channel
5. Generate TTS audio if requested
6. Return result with audio

**Response (Success):**
```json
{
  "success": true,
  "result": {
    "message": {
      "id": "uuid",
      "channel": "voice",
      "content": "Hallo, ich möchte einen Trainingsplan",
      "metadata": {...}
    },
    "intent": {
      "intent": "training_plan",
      "confidence": 0.95,
      "entities": {}
    },
    "routing": {
      "module": "training_plan_engine",
      "intent": "training_plan",
      "params": {}
    },
    "response": {
      "content": "Ich habe einen personalisierten Trainingsplan für dich erstellt! 💪...",
      "metadata": {
        "module": "training_plan_engine",
        "intent": "training_plan",
        "confidence": 0.95,
        "processingTime": 1234
      }
    },
    "audio": "base64_encoded_audio_data"
  },
  "debug": {
    "tenantId": "uuid",
    "tenantName": "Studio Name",
    "agentProfile": {
      "name": "Studio Assistant",
      "tone": "friendly",
      "language": "de",
      "voiceModel": "tts-1"
    },
    "timestamp": "2024-11-23T10:00:00.000Z",
    "audioGenerated": true
  }
}
```

**TTS Generation:**
```typescript
// Create realtime engine session
const realtimeEngine = getRealtimeEngine()
const callId = `test-${Date.now()}`

await realtimeEngine.createSession(callId, {
  tenantId: session.tenantId,
  voice: profile?.voiceModel || 'alloy',
  language: profile?.language || 'de',
})

// Generate voice response
const voiceResponse = await realtimeEngine.generateVoiceResponse(
  callId,
  result.response.content,
  {
    tenantId: session.tenantId,
    voice: profile?.voiceModel || 'alloy',
    language: profile?.language || 'de',
  }
)

// End session
await realtimeEngine.endSession(callId)
```

### 2. WhatsApp Test API (`/app/api/test/whatsapp/route.ts` - 120 lines)

**POST /api/test/whatsapp**

Test WhatsApp message with orchestrator.

**Request Body:**
```json
{
  "message": "Hallo, ich möchte einen Trainingsplan"
}
```

**Flow:**
1. Get session (tenantId from JWT)
2. Validate message input
3. Load AgentProfile for tenant context
4. Call orchestrator with WHATSAPP channel
5. Return result with debug info

**Response (Success):**
```json
{
  "success": true,
  "result": {
    "message": {
      "id": "uuid",
      "channel": "whatsapp",
      "content": "Hallo, ich möchte einen Trainingsplan",
      "metadata": {...}
    },
    "intent": {
      "intent": "training_plan",
      "confidence": 0.95,
      "entities": {}
    },
    "routing": {
      "module": "training_plan_engine",
      "intent": "training_plan",
      "params": {}
    },
    "response": {
      "content": "Ich habe einen personalisierten Trainingsplan für dich erstellt! 💪...",
      "metadata": {
        "module": "training_plan_engine",
        "intent": "training_plan",
        "confidence": 0.95,
        "processingTime": 1234
      }
    }
  },
  "debug": {
    "tenantId": "uuid",
    "tenantName": "Studio Name",
    "agentProfile": {
      "name": "Studio Assistant",
      "tone": "friendly",
      "language": "de"
    },
    "timestamp": "2024-11-23T10:00:00.000Z"
  }
}
```

### 3. Voice Test Component (`/src/components/test/VoiceTest.tsx` - 280 lines)

**Browser microphone → Speech recognition → Orchestrator → TTS → Audio playback**

**Features:**

**Microphone Access:**
- Request microphone permission (getUserMedia)
- Visual recording indicator
- Start/Stop recording button

**Speech Recognition:**
- Web Speech API (webkitSpeechRecognition)
- German language (de-DE)
- Real-time transcription
- Error handling

**Processing:**
- Send transcript to `/api/test/voice`
- Display loading state
- Handle errors

**Audio Playback:**
- Convert base64 audio to blob
- Create audio URL
- Play/Stop controls
- Visual playback indicator

**UI Elements:**
- Large circular recording button (purple/red)
- Transcript display
- Audio playback controls
- Error messages
- Instructions

**Code Example:**
```typescript
// Request microphone permission
const requestMicrophonePermission = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach(track => track.stop())
    setPermissionGranted(true)
    return true
  } catch (error) {
    setError('Microphone permission denied')
    return false
  }
}

// Start speech recognition
const startRecording = async () => {
  if (recognitionRef.current) {
    recognitionRef.current.start()
    setIsRecording(true)
  }
}

// Process voice input
const processVoiceInput = async (text: string) => {
  const response = await fetch('/api/test/voice', {
    method: 'POST',
    body: JSON.stringify({ text, generateAudio: true }),
  })
  
  const data = await response.json()
  
  // Play audio
  if (data.result.audio) {
    playAudio(data.result.audio)
  }
}
```

### 4. WhatsApp Test Component (`/src/components/test/WhatsAppTest.tsx` - 230 lines)

**Chat UI → Orchestrator → Text response**

**Features:**

**Chat Interface:**
- Messenger-style design
- User messages (right, blue)
- Agent messages (left, gray)
- Avatar icons (User/Bot)
- Timestamps

**Message Handling:**
- Text input with textarea
- Send button
- Keyboard shortcuts (Enter to send, Shift+Enter for newline)
- Loading indicator ("Typing...")

**API Integration:**
- POST to `/api/test/whatsapp`
- Display response in chat
- Error handling
- Log requests/responses

**UI Elements:**
- Scrollable message area
- Empty state
- Loading state
- Error messages

**Code Example:**
```typescript
const sendMessage = async () => {
  const userMessage = {
    id: `user-${Date.now()}`,
    role: 'user',
    content: input.trim(),
    timestamp: new Date(),
  }

  setMessages(prev => [...prev, userMessage])
  setLoading(true)

  const response = await fetch('/api/test/whatsapp', {
    method: 'POST',
    body: JSON.stringify({ message: userMessage.content }),
  })

  const data = await response.json()

  const assistantMessage = {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    content: data.result.response.content,
    timestamp: new Date(),
  }

  setMessages(prev => [...prev, assistantMessage])
  setLoading(false)
}
```

### 5. Preview Card Component (`/src/components/test/PreviewCard.tsx` - 180 lines)

**Live agent preview with intent, routing, and response**

**Displays:**

**Intent Detection:**
- Intent name (badge)
- Confidence score (percentage)
- Entities (key-value pairs)

**Routing Decision:**
- Module name (badge)
- Target intent

**AI Response:**
- Response content (text)
- Module used
- Processing time (ms)
- Confidence score

**UI Design:**
- Color-coded sections:
  - Blue: Intent Detection
  - Purple: Routing Decision
  - Green: AI Response
- Border-left indicators
- Icons for each section
- Loading state
- Empty state

**Code Example:**
```typescript
<PreviewCard 
  result={{
    intent: {
      intent: 'training_plan',
      confidence: 0.95,
      entities: {}
    },
    routing: {
      module: 'training_plan_engine',
      intent: 'training_plan',
      params: {}
    },
    response: {
      content: 'Ich habe einen personalisierten Trainingsplan...',
      metadata: {
        module: 'training_plan_engine',
        intent: 'training_plan',
        confidence: 0.95,
        processingTime: 1234
      }
    }
  }}
  loading={false}
/>
```

### 6. Debug Console Component (`/src/components/test/DebugConsole.tsx` - 130 lines)

**Full JSON logs with timestamps and debug info**

**Features:**

**Log Display:**
- Request logs (blue badge)
- Response logs (green badge)
- Error logs (red badge)
- Timestamps
- Full JSON data

**Interactions:**
- Expandable/collapsible
- Copy to clipboard
- Scrollable area
- Log count badge

**UI Design:**
- Dark theme (gray-900 background)
- Monospace font for JSON
- Color-coded log types
- Copy button with success indicator

**Code Example:**
```typescript
<DebugConsole 
  logs={[
    {
      timestamp: '2024-11-23T10:00:00.000Z',
      type: 'request',
      data: {
        channel: 'whatsapp',
        message: 'Hallo, ich möchte einen Trainingsplan'
      }
    },
    {
      timestamp: '2024-11-23T10:00:01.000Z',
      type: 'response',
      data: {
        success: true,
        result: {...}
      }
    }
  ]}
/>
```

### 7. Test Dashboard Page (`/src/app/dashboard/test/page.tsx` - 140 lines)

**Main test environment page**

**Features:**

**Tab Navigation:**
- WhatsApp Test tab
- Voice Test tab
- Active tab indicator

**Layout:**
- 2-column grid (lg:grid-cols-2)
- Left: Test interface (Voice or WhatsApp)
- Right: Preview Card + Debug Console

**State Management:**
- Active tab state
- Preview result state
- Debug logs state
- Loading states

**Functions:**
- handleResult: Update preview card
- handleLog: Add log to console
- clearLogs: Clear all logs

**Info Cards:**
- WhatsApp Test description
- Voice Test description
- Live Preview description

## Test Flows

### Voice Test Flow

**1. User opens Test Dashboard**
```
Navigate to /dashboard/test
Select "Voice Test" tab
```

**2. User grants microphone permission**
```
Click "Start Recording" button
Browser prompts for microphone access
User grants permission
```

**3. User records voice message**
```
Click microphone button (turns red, starts pulsing)
Speak message in German: "Hallo, ich möchte einen Trainingsplan"
Click button again to stop recording
```

**4. Speech recognition processes audio**
```
Web Speech API transcribes audio
Transcript displayed: "Hallo, ich möchte einen Trainingsplan"
```

**5. Frontend sends to API**
```javascript
POST /api/test/voice
{
  "text": "Hallo, ich möchte einen Trainingsplan",
  "generateAudio": true
}
```

**6. Backend processes request**
```
1. Get session (tenantId from JWT)
2. Load AgentProfile from database
3. Call orchestrator:
   - channel: VOICE
   - payload: { transcript: text, from: 'test-user' }
   - tenantId: session.tenantId
4. Orchestrator:
   - normalizeIncomingMessage()
   - detectIntent() → "training_plan" (0.95 confidence)
   - buildAIContext()
   - routeToModule() → "training_plan_engine"
   - executeAIResponse() → OpenAI GPT-4o-mini
5. Generate TTS audio:
   - Create realtime engine session
   - generateVoiceResponse() → OpenAI TTS
   - Return base64 audio
6. Return result with audio
```

**7. Frontend displays result**
```
Preview Card shows:
- Intent: training_plan (95% confidence)
- Module: training_plan_engine
- Response: "Ich habe einen personalisierten Trainingsplan..."

Debug Console logs:
- Request: { channel: 'voice', transcript: '...' }
- Response: { success: true, result: {...} }

Audio playback:
- Convert base64 to blob
- Create audio URL
- Play audio automatically
```

**8. User hears AI response**
```
TTS audio plays: "Ich habe einen personalisierten Trainingsplan für dich erstellt!..."
User can stop/replay audio
```

### WhatsApp Test Flow

**1. User opens Test Dashboard**
```
Navigate to /dashboard/test
Select "WhatsApp Test" tab (default)
```

**2. User types message**
```
Type in textarea: "Hallo, ich interessiere mich für eine Mitgliedschaft"
Press Enter or click Send button
```

**3. Frontend sends to API**
```javascript
POST /api/test/whatsapp
{
  "message": "Hallo, ich interessiere mich für eine Mitgliedschaft"
}
```

**4. Backend processes request**
```
1. Get session (tenantId from JWT)
2. Load AgentProfile from database
3. Call orchestrator:
   - channel: WHATSAPP
   - payload: { text: message, from: 'test-user' }
   - tenantId: session.tenantId
4. Orchestrator:
   - normalizeIncomingMessage()
   - detectIntent() → "lead_qualification" (0.92 confidence)
   - buildAIContext()
   - routeToModule() → "general_ai"
   - executeAIResponse() → OpenAI GPT-4o-mini
5. Return result
```

**5. Frontend displays result**
```
Chat shows:
- User message (right, blue): "Hallo, ich interessiere mich für eine Mitgliedschaft"
- Agent message (left, gray): "Hey! 👋 Super, dass du dich für unser Studio interessierst!..."

Preview Card shows:
- Intent: lead_qualification (92% confidence)
- Module: general_ai
- Response: "Hey! 👋 Super, dass du dich für unser Studio interessierst!..."

Debug Console logs:
- Request: { channel: 'whatsapp', message: '...' }
- Response: { success: true, result: {...} }
```

**6. User continues conversation**
```
Type: "Was kostet eine Mitgliedschaft?"
Process repeats with new message
Chat history grows
```

## Orchestrator Integration

### How Test APIs Use Orchestrator

**1. Voice Test API**
```typescript
const result = await orchestrate({
  channel: Channel.VOICE,
  payload: {
    from: 'test-user',
    transcript: text,
    text: text,
    caller: 'Test User',
  },
  timestamp: new Date(),
  tenantId: session.tenantId,
})
```

**2. WhatsApp Test API**
```typescript
const result = await orchestrate({
  channel: Channel.WHATSAPP,
  payload: {
    from: 'test-user',
    text: message,
    name: 'Test User',
  },
  timestamp: new Date(),
  tenantId: session.tenantId,
})
```

**3. Orchestrator Processing**
```
1. normalizeIncomingMessage(rawMessage)
   → Extract content from payload
   → Create normalized message with metadata

2. detectIntent(normalizedMessage)
   → Analyze message content
   → Detect intent (training_plan, booking, lead_qualification, etc.)
   → Return confidence score

3. buildAIContext(tenantId, userData, messageHistory, intent)
   → Load tenant info from database
   → Build context with user data
   → Include message history

4. routeToModule(intent)
   → Map intent to module
   → Return routing decision

5. executeAIResponse(context, routing, message)
   → Route to appropriate module:
     - training_plan_engine
     - booking_engine
     - whatsapp_engine
     - voice_engine
     - general_ai
   → Call OpenAI GPT-4o-mini
   → Return AI response

6. Return OrchestratorResult
   → success: true/false
   → message: normalized message
   → intent: detection result
   → routing: routing decision
   → response: AI response
```

## Tenant Context

### How Tenant Context is Used

**1. Session contains tenantId**
```json
{
  "tenantId": "550e8400-e29b-41d4-a716-446655440000",
  "ownerId": "660e8400-e29b-41d4-a716-446655440000",
  "email": "owner@studio.com",
  "role": "owner"
}
```

**2. Load AgentProfile for tenant**
```typescript
const profile = await prisma.agentProfile.findUnique({
  where: { tenantId: session.tenantId },
})
```

**3. Use AgentProfile in processing**
```typescript
// Voice: Use voiceModel for TTS
const voiceResponse = await realtimeEngine.generateVoiceResponse(
  callId,
  result.response.content,
  {
    tenantId: session.tenantId,
    voice: profile?.voiceModel || 'alloy',
    language: profile?.language || 'de',
  }
)

// WhatsApp: Use tone, language, studioRules in orchestrator
// (Orchestrator uses tenant context internally)
```

**4. Return debug info with tenant context**
```json
{
  "debug": {
    "tenantId": "uuid",
    "tenantName": "Studio Name",
    "agentProfile": {
      "name": "Studio Assistant",
      "tone": "friendly",
      "language": "de",
      "voiceModel": "tts-1"
    }
  }
}
```

## UI Design (Apple-Style)

### Design Principles

**1. Clean & Minimal**
- White backgrounds
- Subtle borders (gray-200)
- Generous spacing
- No clutter

**2. Color Coding**
- Blue: Primary actions, user messages
- Purple: Voice test, routing
- Green: Success, agent messages, audio playback
- Red: Recording, errors
- Gray: Neutral, assistant messages

**3. Smooth Animations**
- Pulse animation for recording
- Spin animation for loading
- Fade transitions for messages
- Smooth tab switching

**4. Card Layout**
- Rounded corners (rounded-lg)
- Border shadows
- Consistent padding
- Responsive grid

**5. Icons**
- Lucide React icons
- Consistent sizing (w-5 h-5)
- Color-coded
- Meaningful symbols

## Testing

### Test 1: Voice Test

**Scenario:** User tests voice input with training plan request

**Steps:**
1. Navigate to `/dashboard/test`
2. Click "Voice Test" tab
3. Click microphone button
4. Grant microphone permission
5. Speak: "Hallo, ich möchte einen Trainingsplan für Muskelaufbau"
6. Click button to stop recording
7. Wait for processing

**Expected Result:**
- Transcript displayed: "Hallo, ich möchte einen Trainingsplan für Muskelaufbau"
- Preview Card shows:
  - Intent: training_plan (95% confidence)
  - Module: training_plan_engine
  - Response: "Ich habe einen personalisierten Trainingsplan..."
- Audio plays automatically
- Debug Console shows request/response logs

### Test 2: WhatsApp Test

**Scenario:** User tests WhatsApp chat with membership inquiry

**Steps:**
1. Navigate to `/dashboard/test`
2. Click "WhatsApp Test" tab (default)
3. Type: "Hallo, ich interessiere mich für eine Mitgliedschaft"
4. Press Enter

**Expected Result:**
- User message appears (right, blue)
- Loading indicator shows ("Typing...")
- Agent message appears (left, gray): "Hey! 👋 Super, dass du dich für unser Studio interessierst!..."
- Preview Card shows:
  - Intent: lead_qualification (92% confidence)
  - Module: general_ai
  - Response: "Hey! 👋 Super, dass du dich für unser Studio interessierst!..."
- Debug Console shows request/response logs

### Test 3: Multi-Turn Conversation

**Scenario:** User has multi-turn conversation in WhatsApp test

**Steps:**
1. Send: "Hallo, ich interessiere mich für eine Mitgliedschaft"
2. Wait for response
3. Send: "Was kostet das?"
4. Wait for response
5. Send: "Kann ich ein Probetraining machen?"
6. Wait for response

**Expected Result:**
- All messages displayed in chat
- Each message gets AI response
- Preview Card updates with each response
- Debug Console logs all requests/responses
- Message history preserved

### Test 4: Error Handling

**Scenario:** Test error handling with invalid input

**Steps:**
1. Voice Test: Deny microphone permission
2. WhatsApp Test: Send empty message

**Expected Result:**
- Voice Test: Error message displayed: "Microphone permission denied"
- WhatsApp Test: Send button disabled when input empty
- Debug Console logs errors
- No crashes or broken UI

## Quality

✅ **`npm run lint`** - Passing (only warnings, no errors)  
✅ **`npm run build`** - Passing (0 errors)  
✅ TypeScript Strict Mode  
✅ Browser APIs (getUserMedia, Web Speech API)  
✅ Audio Playback (base64 → blob → URL)  
✅ Real-time Updates  
✅ Error Handling  
✅ Tenant Isolation  
✅ Apple-Style UI  
✅ Orchestrator Integration  
✅ TTS Generation

## Browser Compatibility

**Voice Test Requirements:**
- getUserMedia API (microphone access)
- Web Speech API (speech recognition)
- Audio API (playback)
- Modern browsers: Chrome, Edge, Safari (with limitations)

**WhatsApp Test Requirements:**
- Fetch API
- Modern JavaScript (ES6+)
- All modern browsers

**Note:** Voice Test works best in Chrome/Edge due to Web Speech API support.

## Next Steps

### Future Enhancements

**1. Voice Test Improvements**
- Real-time audio streaming (WebSocket)
- Voice activity detection
- Noise cancellation
- Multiple language support
- Voice model selection

**2. WhatsApp Test Improvements**
- Message history persistence
- Export conversation
- Share conversation
- Test with images/media
- Bulk testing

**3. Preview Enhancements**
- Visual flow diagram
- Performance metrics
- A/B testing
- Conversation analytics
- Intent confidence trends

**4. Debug Console Improvements**
- Filter logs by type
- Search logs
- Export logs (JSON/CSV)
- Log retention
- Performance profiling

**5. Additional Test Modes**
- Email test
- SMS test
- Web chat test
- Multi-channel test
- Load testing

## Summary

Phase 3, Task 11 successfully implements a complete test environment with:
- Voice Test with browser microphone and TTS
- WhatsApp Test with chat interface
- Live Agent Preview with intent/routing/response
- Debug Console with full JSON logs
- 2 API routes (voice, whatsapp)
- 5 frontend components
- Orchestrator integration
- Tenant context support
- Apple-style UI
- Real-time updates
- Error handling

Studio owners can now test their AI agents in real-time with both voice and text inputs, see live previews of intent detection and routing, and debug with full JSON logs.
