# PILAR SYSTEMS – n8n Workflow Integration

> **Stand:** November 2025  
> **Kompatibel mit:** n8n v1.x+

---

## Übersicht

PILAR SYSTEMS kann mit n8n-Workflows erweitert werden, um zusätzliche Automatisierungen außerhalb der Kernfunktionen zu ermöglichen. Die Workflows im Ordner `n8n-workflows/` decken typische Anwendungsfälle ab.

---

## Verfügbare Workflows

| Workflow | Datei | Trigger | Zweck |
|----------|-------|---------|-------|
| **Lead New** | `lead-new.json` | Neuer Lead erstellt | Klassifizierung + Welcome-Nachricht + Follow-up |
| **WhatsApp Message** | `whatsapp-message.json` | WhatsApp Nachricht | AI-Antwort + Lead-Zuordnung |
| **Call Missed** | `call-missed.json` | Verpasster Anruf | SMS/WhatsApp Follow-up |
| **Email Incoming** | `email-incoming.json` | Eingehende E-Mail | Klassifizierung + Auto-Reply |
| **Calendar Booked** | `calendar-booked.json` | Termin gebucht | Bestätigung + Reminder |

---

## Setup-Anleitung

### 1. n8n installieren

**Self-Hosted (empfohlen für Production):**
```bash
# Docker
docker run -it --rm \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n

# Oder: n8n.cloud (managed)
# https://n8n.cloud
```

### 2. Workflows importieren

1. Öffne n8n Dashboard
2. Gehe zu **Workflows** → **Add Workflow** → **Import from File**
3. Wähle die `.json`-Datei aus `n8n-workflows/`
4. Wiederhole für jeden Workflow

### 3. Credentials konfigurieren

Erstelle in n8n folgende Credentials:

**HTTP Header Auth (für PILAR API):**
- Name: `PILAR API`
- Header Name: `Authorization`
- Header Value: `Bearer YOUR_API_TOKEN`

> **Hinweis:** API Token kann über Dashboard → Settings → API erstellt werden (falls implementiert).

### 4. Environment Variables in n8n setzen

In n8n → **Settings** → **Variables**:

| Variable | Wert | Beschreibung |
|----------|------|--------------|
| `APP_URL` | `https://pilarsystems.com` | PILAR Produktions-URL |
| `PILAR_API_TOKEN` | `dein-api-token` | Auth Token für API-Calls |

### 5. Webhook URLs notieren

Nach dem Importieren → Workflow aktivieren → **Webhook URL** kopieren.

Webhook-URL-Format:
```
https://dein-n8n.com/webhook/[WORKFLOW-ID]/lead-new
```

### 6. PILAR mit Webhooks verbinden

Die Workflows werden über PILAR-interne Events getriggert:

1. Dashboard → Settings → Integrations → n8n
2. Webhook-URL für jeden Event-Typ eintragen
3. Speichern

---

## Workflow-Details

### Lead New (`lead-new.json`)

**Trigger:** Neuer Lead wird über WhatsApp, Telefon oder Web erstellt

**Ablauf:**
1. Webhook empfängt Lead-Daten (`workspaceId`, `leadId`)
2. HTTP Request an `/api/ai/classify-lead` → A/B/C Klassifizierung
3. HTTP Request an `/api/messages/send` → Welcome-Nachricht
4. HTTP Request an `/api/followups` → Follow-up in 24h planen

**Benötigte API-Endpunkte:**
- `POST /api/ai/classify-lead`
- `POST /api/messages/send`
- `POST /api/followups`

---

### WhatsApp Message (`whatsapp-message.json`)

**Trigger:** WhatsApp-Nachricht eingehend

**Ablauf:**
1. Webhook empfängt Nachricht (`from`, `message`, `workspaceId`)
2. Lead-Lookup oder -Erstellung
3. AI-Response-Generierung
4. Nachricht senden

**Benötigte API-Endpunkte:**
- `POST /api/leads/find-or-create`
- `POST /api/ai/generate-response`
- `POST /api/whatsapp/send`

---

### Call Missed (`call-missed.json`)

**Trigger:** Anruf wurde nicht beantwortet (Twilio Webhook)

**Ablauf:**
1. Webhook empfängt Call-Daten (`from`, `callSid`)
2. Lead-Lookup
3. SMS oder WhatsApp senden: "Wir haben Ihren Anruf verpasst..."
4. Callback-Termin vorschlagen

**Benötigte API-Endpunkte:**
- `POST /api/leads/find-or-create`
- `POST /api/sms/send` oder `POST /api/whatsapp/send`
- `POST /api/calendar/suggest`

---

### Email Incoming (`email-incoming.json`)

**Trigger:** E-Mail-Eingang (über Email-Sync oder Webhook)

**Ablauf:**
1. Webhook empfängt E-Mail-Daten
2. Lead-Zuordnung
3. AI-Klassifizierung (Anfrage-Typ)
4. Auto-Reply falls konfiguriert

---

### Calendar Booked (`calendar-booked.json`)

**Trigger:** Termin wurde gebucht (Google Calendar Event)

**Ablauf:**
1. Webhook empfängt Event-Daten
2. Lead-Zuordnung
3. Bestätigungs-WhatsApp/SMS
4. Reminder 24h vorher planen

---

## API-Endpunkte für n8n

Diese Endpunkte werden von n8n-Workflows aufgerufen:

| Methode | Endpunkt | Beschreibung |
|---------|----------|--------------|
| `POST` | `/api/ai/classify-lead` | Lead klassifizieren (A/B/C) |
| `POST` | `/api/ai/generate-response` | AI-Antwort generieren |
| `POST` | `/api/messages/send` | Nachricht senden (alle Kanäle) |
| `POST` | `/api/whatsapp/send` | WhatsApp senden |
| `POST` | `/api/sms/send` | SMS senden |
| `POST` | `/api/followups` | Follow-up planen |
| `POST` | `/api/leads/find-or-create` | Lead finden oder erstellen |
| `POST` | `/api/calendar/suggest` | Termin vorschlagen |

---

## Environment Variables in PILAR

Füge diese zu `.env.local` hinzu:

```env
# n8n Integration
N8N_WEBHOOK_URL=https://dein-n8n.com/webhook
N8N_API_KEY=dein-n8n-api-key
```

---

## Troubleshooting

### Webhook kommt nicht an

1. Prüfe n8n Workflow ist **aktiviert** (Toggle auf "Active")
2. Prüfe Webhook-URL ist korrekt konfiguriert
3. Prüfe n8n Logs: **Executions** → Filter nach Workflow

### API-Calls schlagen fehl

1. Prüfe `APP_URL` Environment Variable in n8n
2. Prüfe API Token ist korrekt
3. Prüfe PILAR Logs: Vercel Dashboard → Logs

### Keine AI-Response

1. Prüfe `OPENAI_API_KEY` in PILAR gesetzt
2. Prüfe Workspace hat aktive Subscription

---

## Best Practices

1. **Teste lokal zuerst**: Nutze ngrok/Cloudflare Tunnel für lokales Testing
2. **Retry-Logic**: n8n hat eingebaute Retries – aktiviere diese
3. **Error Handling**: Füge Error-Workflow hinzu für Benachrichtigungen
4. **Rate Limiting**: Beachte API-Limits (10 Requests/Sekunde)
5. **Logging**: Aktiviere Execution-Logging in n8n für Debugging

---

## Support

- **n8n Docs:** https://docs.n8n.io
- **PILAR Support:** support@pilarsystems.com
- **GitHub Issues:** https://github.com/PilarSystems/pilarsystems/issues
