# PILAR SYSTEMS – Setup für Freddi (Step by Step)

> **Version:** 1.0.0  
> **Letzte Aktualisierung:** November 2025  
> **Ziel:** Du kannst PILAR SYSTEMS lokal starten, testen und auf Vercel deployen.

---

## 📋 Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Benötigte Accounts](#1-benötigte-accounts)
3. [Repository klonen](#2-repository-klonen)
4. [Environment Variables einrichten](#3-environment-variables-einrichten)
5. [Datenbank Setup](#4-datenbank-setup)
6. [Stripe Produkte erstellen](#5-stripe-produkte-erstellen)
7. [Lokal starten](#6-lokal-starten)
8. [Webhooks verbinden](#7-webhooks-verbinden)
9. [n8n Workflows (optional)](#8-n8n-workflows-optional)
10. [Production Deployment (Vercel)](#9-production-deployment-vercel)
11. [Nach dem Launch](#10-nach-dem-launch)
12. [Troubleshooting](#troubleshooting)

---

## Übersicht

**PILAR SYSTEMS** ist eine vollautomatische KI-SaaS-Plattform für Fitnessstudios mit:

- **Marketing-Website** (Landing, Features, Pricing, Legal)
- **B2B-Dashboard** für Studios (Leads, Messages, Calendar, Analytics)
- **AI-Automation** (WhatsApp AI, Phone AI, Email AI, Lead Engine)
- **Stripe Billing** (Subscriptions mit Setup Fees)
- **Multi-Tenant Architektur** (isolierte Daten pro Studio)
- **Autopilot System** (0-Touch Provisioning, Self-Healing)

**Tech-Stack:**
- Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
- PostgreSQL (Supabase) + Prisma ORM
- Supabase Auth + Stripe Billing
- OpenAI GPT-4 für AI Features
- Twilio (Phone) + WhatsApp Cloud API

---

## 1. Benötigte Accounts

### Zwingend erforderlich:

| Account | Wozu? | Link |
|---------|-------|------|
| **GitHub** | Repository-Zugang | [github.com](https://github.com) |
| **Vercel** | Hosting & Deployment | [vercel.com](https://vercel.com) |
| **Supabase** | Auth + PostgreSQL Datenbank | [supabase.com](https://supabase.com) |
| **Stripe** | Payments & Subscriptions | [stripe.com](https://stripe.com) |
| **OpenAI** | AI Features (GPT-4) | [platform.openai.com](https://platform.openai.com) |

### Optional (für erweiterte Features):

| Account | Wozu? | Link |
|---------|-------|------|
| **Twilio** | Phone AI & SMS | [twilio.com](https://twilio.com) |
| **Meta/WhatsApp** | WhatsApp Business API | [developers.facebook.com](https://developers.facebook.com) |
| **ElevenLabs** | Voice Selection | [elevenlabs.io](https://elevenlabs.io) |
| **Google Cloud** | Calendar Integration | [console.cloud.google.com](https://console.cloud.google.com) |
| **Upstash** | Redis (Rate Limiting) | [upstash.com](https://upstash.com) |
| **n8n** | Workflow Automation | [n8n.io](https://n8n.io) |

---

## 2. Repository klonen

```bash
# 1. Repository klonen
git clone https://github.com/PilarSystems/pilarsystems.git
cd pilarsystems

# 2. Dependencies installieren (Node.js 20+ erforderlich!)
yarn install

# 3. Prüfen, ob alles funktioniert
yarn --version  # Sollte 1.22+ sein
node --version  # Sollte 20+ sein
```

**Erwartetes Ergebnis:** Alle Dependencies sind installiert, keine Fehler.

---

## 3. Environment Variables einrichten

### 3.1 Datei erstellen

```bash
cp .env.example .env.local
```

### 3.2 Pflichtfelder ausfüllen

Öffne `.env.local` und fülle diese Werte aus:

#### Supabase (Auth + Database)

1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard)
2. Erstelle neues Projekt oder wähle bestehendes
3. Gehe zu **Settings → API**
4. Kopiere:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database (Settings → Database → Connection String)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

#### Stripe (Payments)

1. Gehe zu [Stripe Dashboard](https://dashboard.stripe.com)
2. Gehe zu **Developers → API Keys**
3. Kopiere (Test-Keys für Entwicklung!):

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

#### OpenAI (AI Features)

1. Gehe zu [OpenAI Platform](https://platform.openai.com)
2. Erstelle API Key unter **API Keys**
3. Kopiere:

```env
# OpenAI
OPENAI_API_KEY=sk-...
```

#### Security Keys (generieren!)

```bash
# Im Terminal ausführen:
openssl rand -hex 32   # → ENCRYPTION_KEY
openssl rand -base64 32   # → NEXTAUTH_SECRET
```

```env
# Security
ENCRYPTION_KEY=dein-64-zeichen-hex-string
NEXTAUTH_SECRET=dein-base64-string
```

#### App URL

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## 4. Datenbank Setup

```bash
# 1. Prisma Client generieren
npx prisma generate

# 2. Datenbank-Migrationen ausführen
npx prisma migrate deploy

# 3. (Optional) Prisma Studio öffnen zum Prüfen
npx prisma studio
```

**Erwartetes Ergebnis:** Alle Tabellen sind erstellt, keine Fehler.

---

## 5. Stripe Produkte erstellen

```bash
# Stripe CLI installieren (falls noch nicht)
# macOS: brew install stripe/stripe-cli/stripe
# Andere: https://stripe.com/docs/stripe-cli

# Produkte erstellen
npx ts-node scripts/create-stripe-products.ts
```

Das Script erstellt:
- **PILAR BASIC:** €100/Monat + €500 Setup
- **PILAR PRO:** €149/Monat + €1000 Setup
- **WhatsApp Add-on:** €20/Monat

**Kopiere die ausgegebenen Price IDs in deine `.env.local`:**

```env
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_BASIC_SETUP_FEE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PRO_SETUP_FEE_ID=price_...
STRIPE_WHATSAPP_ADDON_PRICE_ID=price_...
```

---

## 6. Lokal starten

```bash
yarn dev
```

**Öffne im Browser:**
- Homepage: http://localhost:3000
- Signup: http://localhost:3000/signup
- Dashboard: http://localhost:3000/dashboard

**Prüfe:**
- [ ] Homepage lädt ohne Fehler
- [ ] Signup funktioniert (→ Supabase User wird erstellt)
- [ ] Login funktioniert
- [ ] Dashboard zeigt nach Login

---

## 7. Webhooks verbinden

### 7.1 Stripe Webhook (lokal testen)

```bash
# Terminal 1: App starten
yarn dev

# Terminal 2: Stripe Webhook forwarden
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

Kopiere den **Webhook Signing Secret** (`whsec_...`) in `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 7.2 Stripe Webhook (Production)

1. Gehe zu [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Klicke **Add endpoint**
3. URL: `https://deine-domain.com/api/stripe/webhooks`
4. Events auswählen:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Kopiere **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

## 8. n8n Workflows (optional)

Die n8n-Workflows findest du im Ordner `n8n-workflows/`:

| Workflow | Zweck |
|----------|-------|
| `lead-new.json` | Neuer Lead → Benachrichtigung |
| `whatsapp-message.json` | WhatsApp Nachricht → Verarbeitung |
| `call-missed.json` | Verpasster Anruf → Follow-up |
| `email-incoming.json` | E-Mail → Lead-Zuordnung |
| `calendar-booked.json` | Termin gebucht → Bestätigung |

### Setup:

1. Installiere n8n (Self-hosted oder [n8n.cloud](https://n8n.cloud))
2. Importiere Workflows aus `n8n-workflows/`
3. Konfiguriere Webhook URLs
4. Setze in `.env.local`:

```env
N8N_WEBHOOK_URL=https://dein-n8n.com/webhook
N8N_API_KEY=dein-api-key
```

---

## 9. Production Deployment (Vercel)

### 9.1 Vercel Projekt erstellen

1. Gehe zu [Vercel Dashboard](https://vercel.com/dashboard)
2. Klicke **Add New → Project**
3. Importiere GitHub Repository
4. Klicke **Import**

### 9.2 Environment Variables setzen

Gehe zu **Settings → Environment Variables** und füge ALLE Variablen aus `.env.local` hinzu.

**Wichtig für Production:**
```env
NEXT_PUBLIC_APP_URL=https://pilarsystems.com  # Deine Domain!
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_...  # Live-Key!
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # Live-Key!
```

### 9.3 Deploy

1. Klicke **Deploy**
2. Warte auf Build (~2-3 Minuten)
3. App ist live unter `https://dein-projekt.vercel.app`

### 9.4 Custom Domain

1. **Settings → Domains**
2. Domain hinzufügen
3. DNS-Records setzen:
   ```
   A     @      76.76.21.21
   CNAME www    cname.vercel-dns.com
   ```
4. SSL wird automatisch aktiviert

### 9.5 Webhooks aktualisieren

Nach Domain-Setup alle Webhook-URLs aktualisieren:
- Stripe: `https://deine-domain.com/api/stripe/webhooks`
- Twilio: `https://deine-domain.com/api/webhooks/twilio`
- WhatsApp: `https://deine-domain.com/api/webhooks/whatsapp`

---

## 10. Nach dem Launch

### Täglich:
- [ ] Vercel Logs checken (Errors?)
- [ ] Stripe Dashboard checken (neue Kunden?)
- [ ] Support-Mails beantworten

### Wöchentlich:
- [ ] KPIs reviewen (Signups, Conversions)
- [ ] Affiliate-Partner Stats prüfen
- [ ] User Feedback sammeln

### Monatlich:
- [ ] Dependencies updaten (`yarn outdated`)
- [ ] Affiliate-Provisionen auszahlen
- [ ] Churn analysieren

---

## Troubleshooting

### Build-Fehler

```bash
# Prisma Client neu generieren
npx prisma generate

# Node Modules neu installieren
rm -rf node_modules yarn.lock
yarn install

# Cache löschen
rm -rf .next

# Erneut bauen
yarn build
```

### Database-Verbindung fehlgeschlagen

1. Prüfe `DATABASE_URL` in `.env.local`
2. Prüfe Supabase Dashboard → Projekt aktiv?
3. Teste mit: `npx prisma studio`

### Stripe Webhook kommt nicht an

1. Prüfe `STRIPE_WEBHOOK_SECRET`
2. Prüfe Vercel Logs für Errors
3. Teste mit Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhooks`

### Auth funktioniert nicht

1. Prüfe Supabase Credentials
2. Prüfe Supabase → Authentication → URL Configuration
3. Site URL = `https://deine-domain.com`
4. Redirect URLs = `https://deine-domain.com/auth/callback`

---

## Checkliste für Launch 🚀

### Vor dem Launch:
- [ ] Alle ENV Variables in Vercel gesetzt
- [ ] Stripe Live-Mode aktiviert (keine Test-Keys!)
- [ ] Stripe Produkte im Live-Mode erstellt
- [ ] Webhooks für Production konfiguriert
- [ ] Custom Domain verbunden
- [ ] SSL aktiv
- [ ] Legal Pages mit echten Daten (Impressum, Datenschutz, AGB)
- [ ] Test-Checkout durchgeführt (echte Zahlung → Refund)

### Launch-Day:
1. DNS auf Vercel umstellen
2. Smoke Test: Homepage → Signup → Checkout → Dashboard
3. Monitoring aktivieren
4. Marketing-Kampagnen starten

---

## Support

- **GitHub Issues:** https://github.com/PilarSystems/pilarsystems/issues
- **Dokumentation:** Siehe `SETUP_PILAR_SYSTEMS_FINAL.md` und `AUTOPILOT_OVERVIEW.md`

---

**Viel Erfolg, Freddi! 🚀**

*Erstellt: November 2025*
