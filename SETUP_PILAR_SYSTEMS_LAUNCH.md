# PILAR SYSTEMS - Launch Setup Guide

**Version:** 1.0.0  
**Letzte Aktualisierung:** November 2024  
**Zielgruppe:** Gründer, die PILAR SYSTEMS für echte Kunden launchen möchten

---

## Überblick

Dieses Dokument ist die **einzige Setup-Anleitung**, die du brauchst, um PILAR SYSTEMS von Grund auf produktionsreif zu machen. Nach Abschluss aller Schritte hast du ein vollständig funktionierendes SaaS-System mit:

- ✅ Authentifizierung (Supabase)
- ✅ Stripe Checkout & Abonnements
- ✅ Automatisches Onboarding
- ✅ WhatsApp Coach Automation
- ✅ Affiliate System
- ✅ Multi-Tenant Architektur
- ✅ PILAR AUTOPILOT v6 (vollautomatische Provisioning & Monitoring)

---

## Teil A: Voraussetzungen

### 1. Accounts, die du brauchst

Bevor du startest, stelle sicher, dass du folgende Accounts hast:

| Service | Zweck | Link |
|---------|-------|------|
| **Supabase** | Authentifizierung & PostgreSQL Datenbank | https://supabase.com |
| **Stripe** | Zahlungen & Abonnements | https://stripe.com |
| **Vercel** | Hosting & Deployment | https://vercel.com |
| **Twilio** | WhatsApp Business API | https://twilio.com |
| **OpenAI** | KI für Coach & Automation | https://openai.com |
| **ElevenLabs** (Optional) | Voice AI | https://elevenlabs.io |
| **Upstash** (Optional) | Redis für Rate Limiting | https://upstash.com |

**Wichtig:** Alle Services mit "(Optional)" sind nicht zwingend erforderlich. Das System funktioniert auch ohne sie (Graceful Degradation).

### 2. Lokale Entwicklungsumgebung (Optional)

Falls du lokal testen möchtest:

- Node.js 18+ installiert
- Yarn installiert (`npm install -g yarn`)
- Git installiert
- Stripe CLI installiert (für Webhook-Testing)

---

## Teil B: Lokale Entwicklung (Optional)

Dieser Teil ist **optional**. Du kannst direkt zu Teil C springen und alles in Production deployen.

### 1. Repository klonen

```bash
git clone https://github.com/PilarSystems/pilarsystems.git
cd pilarsystems
```

### 2. Dependencies installieren

```bash
yarn install
```

### 3. Environment Variables erstellen

Erstelle eine `.env.local` Datei:

```bash
cp .env.example .env.local
```

Fülle die Werte aus (siehe Teil C für Details zu jedem Wert).

### 4. Datenbank Setup

```bash
# Prisma Client generieren
yarn prisma generate

# Datenbank Migrations ausführen
yarn prisma migrate deploy
```

### 5. Development Server starten

```bash
yarn dev
```

Die App läuft jetzt auf `http://localhost:3000`.

### 6. Stripe Webhooks lokal testen

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

Kopiere den Webhook Signing Secret und füge ihn in `.env.local` als `STRIPE_WEBHOOK_SECRET` ein.

---

## Teil C: Production Setup (Schritt für Schritt)

### Schritt 1: Supabase Projekt erstellen

1. Gehe zu https://supabase.com/dashboard
2. Klicke auf "New Project"
3. Wähle einen Namen (z.B. "pilar-systems-prod")
4. Wähle eine Region (z.B. "Frankfurt" für DACH)
5. Wähle ein starkes Datenbank-Passwort
6. Klicke auf "Create new project"

**Wichtig:** Notiere dir folgende Werte aus "Project Settings" → "API":

- `NEXT_PUBLIC_SUPABASE_URL` (Project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (anon/public key)
- `SUPABASE_SERVICE_ROLE_KEY` (service_role key - **geheim!**)

**Database Connection String:**

Gehe zu "Project Settings" → "Database" → "Connection string" → "URI":

- `DATABASE_URL` (PostgreSQL Connection String)

### Schritt 2: Supabase Auth konfigurieren

1. Gehe zu "Authentication" → "URL Configuration"
2. Füge folgende URLs hinzu:
   - **Site URL:** `https://deine-domain.vercel.app`
   - **Redirect URLs:**
     - `https://deine-domain.vercel.app/dashboard`
     - `https://deine-domain.vercel.app/verify-email`
     - `https://deine-domain.vercel.app/onboarding`

3. Gehe zu "Authentication" → "Email Templates"
4. Passe die E-Mail-Templates an (optional, Standard-Templates funktionieren)

**Wichtig:** Supabase sendet automatisch Bestätigungs-E-Mails. Du musst nichts weiter konfigurieren.

### Schritt 3: Stripe Account einrichten

1. Gehe zu https://dashboard.stripe.com
2. Aktiviere "Test Mode" (Toggle oben rechts)
3. Gehe zu "Developers" → "API keys"
4. Notiere dir:
   - `STRIPE_SECRET_KEY` (Secret key - **geheim!**)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Publishable key)

**Produkte erstellen:**

1. Gehe zu "Products" → "Add product"
2. Erstelle zwei Produkte:

**BASIC Plan:**
- Name: "PILAR BASIC"
- Preis: 49€/Monat (oder dein Preis)
- Recurring: Monthly
- Metadata hinzufügen: `plan=BASIC`

**PRO Plan:**
- Name: "PILAR PRO"
- Preis: 99€/Monat (oder dein Preis)
- Recurring: Monthly
- Metadata hinzufügen: `plan=PRO`

**Notiere dir die Price IDs:**
- `NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC`
- `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`

**Webhooks einrichten:**

1. Gehe zu "Developers" → "Webhooks"
2. Klicke auf "Add endpoint"
3. URL: `https://deine-domain.vercel.app/api/stripe/webhooks`
4. Events auswählen:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Klicke auf "Add endpoint"
6. Notiere dir den **Signing secret**: `STRIPE_WEBHOOK_SECRET`

### Schritt 4: Twilio WhatsApp Business API

1. Gehe zu https://console.twilio.com
2. Erstelle ein neues Projekt
3. Gehe zu "Messaging" → "Try it out" → "Send a WhatsApp message"
4. Folge den Anweisungen, um WhatsApp Business API zu aktivieren

**Notiere dir:**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_NUMBER` (z.B. "+14155238886")

**Webhook einrichten:**

1. Gehe zu "Messaging" → "Settings" → "WhatsApp sandbox settings"
2. Webhook URL: `https://deine-domain.vercel.app/api/webhooks/whatsapp`
3. Webhook Method: POST
4. Speichern

**Verify Token:**

Setze einen beliebigen String als `WHATSAPP_VERIFY_TOKEN` (z.B. "pilar-whatsapp-2024").

### Schritt 5: OpenAI API

1. Gehe zu https://platform.openai.com/api-keys
2. Erstelle einen neuen API Key
3. Notiere dir: `OPENAI_API_KEY`

**Empfohlenes Modell:** `gpt-4o-mini` (günstig und schnell)

### Schritt 6: ElevenLabs (Optional)

Falls du Voice AI nutzen möchtest:

1. Gehe zu https://elevenlabs.io
2. Erstelle einen Account
3. Gehe zu "Profile" → "API Keys"
4. Notiere dir: `ELEVENLABS_API_KEY`

**Falls nicht genutzt:** Lasse das Feld leer. Das System funktioniert auch ohne.

### Schritt 7: Upstash Redis (Optional)

Falls du Redis für Rate Limiting nutzen möchtest:

1. Gehe zu https://console.upstash.com
2. Erstelle eine neue Redis Datenbank
3. Wähle Region (z.B. "Frankfurt")
4. Notiere dir:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`

**Falls nicht genutzt:** Lasse die Felder leer. Das System nutzt dann die Datenbank als Fallback.

### Schritt 8: Vercel Deployment

1. Gehe zu https://vercel.com/new
2. Importiere dein GitHub Repository
3. Wähle "pilarsystems" als Root Directory
4. Füge alle Environment Variables hinzu (siehe unten)
5. Klicke auf "Deploy"

**Environment Variables in Vercel:**

Gehe zu "Settings" → "Environment Variables" und füge folgende Werte hinzu:

```
# Supabase
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC=price_...
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_...

# Twilio
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=+14155238886

# WhatsApp
WHATSAPP_VERIFY_TOKEN=pilar-whatsapp-2024
WHATSAPP_APP_SECRET=dein-geheimer-string

# OpenAI
OPENAI_API_KEY=sk-...

# ElevenLabs (Optional)
ELEVENLABS_API_KEY=...

# Upstash (Optional)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# App
NEXT_PUBLIC_APP_URL=https://deine-domain.vercel.app
```

### Schritt 9: Datenbank Migrations ausführen

Nach dem ersten Vercel Deployment:

1. Gehe zu Vercel Dashboard → dein Projekt → "Settings" → "Functions"
2. Öffne ein Terminal (oder nutze Vercel CLI lokal)
3. Führe aus:

```bash
npx prisma migrate deploy
```

**Oder lokal mit Vercel CLI:**

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### Schritt 10: Stripe Webhook URL aktualisieren

1. Gehe zurück zu Stripe Dashboard → "Developers" → "Webhooks"
2. Bearbeite deinen Webhook
3. Aktualisiere die URL auf deine echte Vercel URL:
   - `https://deine-domain.vercel.app/api/stripe/webhooks`
4. Speichern

### Schritt 11: Twilio Webhook URL aktualisieren

1. Gehe zurück zu Twilio Console
2. Aktualisiere die WhatsApp Webhook URL:
   - `https://deine-domain.vercel.app/api/webhooks/whatsapp`
3. Speichern

---

## Teil D: Pre-Launch Checklist

Bevor du live gehst, teste folgende Flows:

### ✅ 1. Signup Flow

1. Öffne `https://deine-domain.vercel.app/signup` in Incognito
2. Registriere dich mit einer Test-E-Mail
3. Prüfe, ob Bestätigungs-E-Mail ankommt (auch Spam-Ordner!)
4. Klicke auf Bestätigungs-Link
5. Du solltest auf `/dashboard` weitergeleitet werden

### ✅ 2. Login Flow

1. Öffne `https://deine-domain.vercel.app/login`
2. Melde dich mit deinem Test-Account an
3. Du solltest auf `/dashboard` weitergeleitet werden

### ✅ 3. Stripe Checkout Flow

1. Gehe zu `https://deine-domain.vercel.app/pricing`
2. Wähle einen Plan (BASIC oder PRO)
3. Nutze Stripe Test Card: `4242 4242 4242 4242`
4. Schließe Checkout ab
5. Du solltest auf `/onboarding` weitergeleitet werden
6. Prüfe in Stripe Dashboard, ob Subscription erstellt wurde

### ✅ 4. Onboarding Flow

1. Nach Checkout solltest du auf `/onboarding` sein
2. Durchlaufe alle 5 Schritte
3. Am Ende solltest du auf `/dashboard` weitergeleitet werden

### ✅ 5. WhatsApp Coach (Optional)

1. Sende eine WhatsApp an deine Twilio Nummer
2. Prüfe in Twilio Logs, ob Webhook empfangen wurde
3. Prüfe in Vercel Logs, ob Event verarbeitet wurde
4. Du solltest eine KI-Antwort erhalten

### ✅ 6. Affiliate System (Optional)

1. Gehe zu `https://deine-domain.vercel.app/affiliate`
2. Registriere dich als Affiliate
3. Kopiere deinen Referral-Link
4. Öffne den Link in Incognito
5. Schließe einen Kauf ab
6. Prüfe im Dashboard, ob Conversion getrackt wurde

---

## Teil E: Troubleshooting

### Problem: Bestätigungs-E-Mail kommt nicht an

**Lösung:**
1. Prüfe Spam-Ordner
2. Prüfe Supabase Dashboard → "Authentication" → "Logs"
3. Prüfe, ob E-Mail-Adresse korrekt ist
4. Prüfe, ob Supabase SMTP konfiguriert ist (Standard sollte funktionieren)

### Problem: Stripe Checkout funktioniert nicht

**Lösung:**
1. Prüfe Vercel Logs für Fehler
2. Prüfe Stripe Dashboard → "Developers" → "Logs"
3. Prüfe, ob `STRIPE_WEBHOOK_SECRET` korrekt ist
4. Prüfe, ob Webhook URL korrekt ist
5. Teste Webhook mit Stripe CLI: `stripe trigger checkout.session.completed`

### Problem: WhatsApp Coach antwortet nicht

**Lösung:**
1. Prüfe Twilio Logs für Webhook-Fehler
2. Prüfe Vercel Logs für Fehler
3. Prüfe, ob `OPENAI_API_KEY` korrekt ist
4. Prüfe, ob `WHATSAPP_VERIFY_TOKEN` korrekt ist
5. Teste Webhook manuell mit Postman

### Problem: Build schlägt fehl

**Lösung:**
1. Prüfe Vercel Build Logs
2. Häufigster Fehler: `DATABASE_URL` fehlt
3. Lösung: Füge `DATABASE_URL` in Vercel Environment Variables hinzu
4. Redeploy

### Problem: Datenbank Migrations schlagen fehl

**Lösung:**
1. Prüfe, ob `DATABASE_URL` korrekt ist
2. Prüfe, ob Supabase Datenbank erreichbar ist
3. Führe Migrations manuell aus: `npx prisma migrate deploy`
4. Falls Fehler: `npx prisma migrate reset` (⚠️ löscht alle Daten!)

### Problem: Redis/Upstash Fehler

**Lösung:**
Das System funktioniert auch ohne Redis (Graceful Degradation). Falls Fehler auftreten:
1. Entferne `UPSTASH_REDIS_REST_URL` und `UPSTASH_REDIS_REST_TOKEN`
2. System nutzt automatisch Datenbank als Fallback
3. Redeploy

---

## Teil F: Nach dem Launch

### Monitoring

- **Vercel Dashboard:** Prüfe Logs und Analytics
- **Stripe Dashboard:** Prüfe Subscriptions und Payments
- **Supabase Dashboard:** Prüfe Auth Logs und Database
- **Autopilot Stats:** `https://deine-domain.vercel.app/api/autopilot/stats`

### Skalierung

Das System ist für 10.000+ Studios ausgelegt:
- Multi-Tenant Architektur mit Workspace-Isolation
- Rate Limiting pro Workspace
- Job Queue mit Priority
- Distributed Locking
- Graceful Degradation

### Support

Falls du Hilfe brauchst:
- **Dokumentation:** Siehe `AUTOPILOT_V6_ARCHITECTURE.md` für technische Details
- **GitHub Issues:** https://github.com/PilarSystems/pilarsystems/issues
- **E-Mail:** support@pilarsystems.com

---

## Zusammenfassung

Nach Abschluss aller Schritte hast du:

✅ Ein vollständig funktionierendes SaaS-System  
✅ Authentifizierung mit E-Mail-Bestätigung  
✅ Stripe Checkout mit automatischer Subscription-Verwaltung  
✅ Automatisches Onboarding für neue Kunden  
✅ WhatsApp Coach mit KI-Automation  
✅ Affiliate System mit Tracking & Payouts  
✅ PILAR AUTOPILOT v6 für vollautomatische Provisioning  
✅ Production-ready Deployment auf Vercel  

**Du bist jetzt bereit für echte Kunden! 🚀**

---

**Version History:**
- v1.0.0 (November 2024): Initial launch-ready version
