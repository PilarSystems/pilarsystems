# PILAR SYSTEMS - Komplette Setup & Launch Anleitung

**Version:** 2.0.0 (Final Production-Ready)  
**Stand:** November 2025  
**Status:** 🚀 Launch-Ready

---

## 📋 Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Technische Voraussetzungen](#technische-voraussetzungen)
3. [Schritt-für-Schritt Setup](#schritt-für-schritt-setup)
4. [Provider Einrichtung](#provider-einrichtung)
5. [Deployment (Vercel)](#deployment-vercel)
6. [Test-Checkliste](#test-checkliste)
7. [Production Launch](#production-launch)
8. [Troubleshooting](#troubleshooting)
9. [Support & Wartung](#support--wartung)

---

## Übersicht

PILAR SYSTEMS ist eine vollautomatische AI SaaS-Plattform für Fitnessstudios mit:

### ✅ Vollständig implementierte Features:
- **Marketing Website** - Apple-Style Design, Deutsch, SEO-optimiert
- **Auth System** - Supabase Auth mit Email/Password, Magic Link, Password Reset
- **Stripe Billing** - Subscriptions mit Setup Fees (Basic €100/mo + €500, Pro €149/mo + €1000)
- **Onboarding Wizard** - 5 Schritte zur vollständigen Studio-Einrichtung
- **AI Automation** - Phone AI, WhatsApp AI, Email AI, Lead Engine
- **Dashboard** - Overview, Leads, Messages, Calendar, Analytics, Settings
- **Affiliate System** - Vollautomatisches Partner-Programm mit Tracking & Provisionen
- **Multi-Tenant** - Isolierte Infrastruktur pro Gym (Twilio Subaccounts, etc.)
- **WhatsApp Coach** - Gym-Buddy System mit Opt-in und Scheduling

### 🎯 Nach diesem Setup kannst du:
- Paid Ads schalten (Google, Facebook, LinkedIn)
- Sales Calls führen (Contact Form funktioniert)
- Affiliate Partner akquirieren (vollautomatisch)
- Echte Kunden onboarden (vollautomatisch)
- Skalieren (Multi-Tenant Architecture)

---

## Technische Voraussetzungen

### Software
- **Node.js** 18+ (empfohlen: 20 LTS)
- **npm** oder **yarn** (Package Manager)
- **Git** (Version Control)
- **PostgreSQL** 14+ (oder Supabase)

### Accounts (erforderlich)
- ✅ **GitHub Account** (für Repository)
- ✅ **Vercel Account** (für Deployment)
- ✅ **Supabase Account** (für Auth + Database)
- ✅ **Stripe Account** (für Payments)
- ✅ **OpenAI Account** (für AI Features)

### Accounts (optional, aber empfohlen)
- 🔸 **Twilio Account** (für Phone AI)
- 🔸 **WhatsApp Business API** (für WhatsApp AI)
- 🔸 **ElevenLabs Account** (für Voice AI)
- 🔸 **Google Cloud Account** (für Calendar Integration)
- 🔸 **Upstash Account** (für Rate Limiting)

---

## Schritt-für-Schritt Setup

### Schritt 1: Repository klonen

```bash
# Repository klonen
git clone https://github.com/PilarSystems/pilarsystems.git
cd pilarsystems

# Dependencies installieren
npm install

# Prisma Client generieren
npx prisma generate
```

**Erwartetes Ergebnis:** Alle Dependencies sind installiert, keine Fehler.

---

### Schritt 2: Environment Variables einrichten

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```bash
cp .env.example .env.local
```

Öffne `.env.local` und fülle **alle** folgenden Variablen aus:

#### 2.1 Database & App

```env
# PostgreSQL Database (Supabase empfohlen)
DATABASE_URL="postgresql://user:password@host:5432/pilarsystems"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"  # Lokal
# NEXT_PUBLIC_APP_URL="https://pilarsystems.com"  # Production

# Node Environment
NODE_ENV="development"  # Lokal
# NODE_ENV="production"  # Production
```

**Wie bekomme ich DATABASE_URL?**
1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard)
2. Erstelle neues Projekt (oder wähle bestehendes)
3. Gehe zu **Settings** → **Database**
4. Kopiere **Connection String** (URI Format)
5. Ersetze `[YOUR-PASSWORD]` mit deinem Passwort

---

#### 2.2 Supabase Auth

```env
# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Wie bekomme ich diese Keys?**
1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard)
2. Wähle dein Projekt
3. Gehe zu **Settings** → **API**
4. Kopiere:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** Key → `SUPABASE_SERVICE_ROLE_KEY`

⚠️ **WICHTIG:** Der `service_role` Key darf NIEMALS im Client-Code verwendet werden!

---

#### 2.3 Stripe (Payments)

```env
# Stripe API Keys
STRIPE_SECRET_KEY="sk_test_..."  # Test Mode für Entwicklung
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Product Price IDs (werden in Schritt 4 erstellt)
STRIPE_BASIC_PRICE_ID="price_..."
STRIPE_BASIC_SETUP_FEE_ID="price_..."
STRIPE_PRO_PRICE_ID="price_..."
STRIPE_PRO_SETUP_FEE_ID="price_..."
STRIPE_WHATSAPP_ADDON_PRICE_ID="price_..."
```

**Wie bekomme ich Stripe Keys?**
1. Gehe zu [Stripe Dashboard](https://dashboard.stripe.com)
2. Gehe zu **Developers** → **API Keys**
3. Kopiere:
   - **Secret key** → `STRIPE_SECRET_KEY` (verwende `sk_test_...` für Entwicklung)
   - **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

**Webhook Secret** (wird später konfiguriert):
1. Gehe zu **Developers** → **Webhooks**
2. Klicke **Add endpoint**
3. URL: `http://localhost:3000/api/stripe/webhooks` (lokal) oder `https://pilarsystems.com/api/stripe/webhooks` (production)
4. Events auswählen:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Kopiere **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

#### 2.4 OpenAI (AI Features)

```env
# OpenAI API
OPENAI_API_KEY="sk-..."
```

**Wie bekomme ich OpenAI API Key?**
1. Gehe zu [OpenAI Platform](https://platform.openai.com)
2. Gehe zu **API Keys**
3. Klicke **Create new secret key**
4. Kopiere Key → `OPENAI_API_KEY`

**Verwendet für:** WhatsApp AI, Phone AI, Email AI, Lead Classification, Follow-up Automation

---

#### 2.5 ElevenLabs (Voice AI) - Optional

```env
# ElevenLabs Voice AI
ELEVENLABS_API_KEY="..."
```

**Wie bekomme ich ElevenLabs API Key?**
1. Gehe zu [ElevenLabs](https://elevenlabs.io)
2. Erstelle Account oder logge dich ein
3. Gehe zu **Profile** → **API Keys**
4. Klicke **Generate API Key**
5. Kopiere Key → `ELEVENLABS_API_KEY`

**Verwendet für:** Voice Selection im Onboarding, Text-to-Speech für Phone AI

**Hinweis:** Free Tier = 10.000 Zeichen/Monat. Für Production: Paid Plan empfohlen.

---

#### 2.6 Twilio (Phone AI) - Optional

```env
# Twilio Phone AI
TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_AUTH_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
TWILIO_PHONE_NUMBER="+491234567890"
```

**Wie bekomme ich Twilio Credentials?**
1. Gehe zu [Twilio Console](https://console.twilio.com)
2. Kopiere von Dashboard:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`
3. Gehe zu **Phone Numbers** → **Manage** → **Buy a number**
4. Kaufe deutsche Nummer (+49) mit Voice Capabilities
5. Kopiere Nummer in E.164 Format → `TWILIO_PHONE_NUMBER`
6. Konfiguriere Webhook:
   - Klicke auf deine Nummer
   - **Voice & Fax** → **A CALL COMES IN**: `https://pilarsystems.com/api/webhooks/twilio` (POST)
   - Klicke **Save**

---

#### 2.7 WhatsApp Business API - Optional

```env
# WhatsApp Cloud API
WHATSAPP_API_TOKEN="EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
WHATSAPP_PHONE_NUMBER_ID="123456789012345"
WHATSAPP_VERIFY_TOKEN="dein-custom-verify-token"
```

**Wie bekomme ich WhatsApp API Credentials?**
1. Gehe zu [Meta for Developers](https://developers.facebook.com)
2. Erstelle App oder wähle bestehende
3. Füge **WhatsApp** Product hinzu
4. Gehe zu **WhatsApp** → **API Setup**
5. Kopiere:
   - **Temporary access token** → `WHATSAPP_API_TOKEN` (für Testing)
   - **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`
6. Wähle eigenen Verify Token → `WHATSAPP_VERIFY_TOKEN` (beliebiger String)
7. Konfiguriere Webhook:
   - **WhatsApp** → **Configuration** → **Edit**
   - **Callback URL**: `https://pilarsystems.com/api/webhooks/whatsapp`
   - **Verify token**: (dein gewählter Token)
   - Subscribe to: `messages`
   - Klicke **Verify and save**

**Für Production:** Erstelle permanenten Token:
1. Gehe zu **System Users** → Create system user
2. Generate token mit `whatsapp_business_messaging` permission

---

#### 2.8 Google Calendar OAuth - Optional

```env
# Google Calendar Integration
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxx"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
```

**Wie bekomme ich Google OAuth Credentials?**
1. Gehe zu [Google Cloud Console](https://console.cloud.google.com)
2. Erstelle neues Projekt "PILAR SYSTEMS"
3. Gehe zu **APIs & Services** → **Library**
4. Aktiviere **Google Calendar API**
5. Gehe zu **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
6. Configure OAuth consent screen (falls nötig)
7. **Application type**: Web application
8. **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://pilarsystems.com/api/auth/google/callback`
9. Kopiere:
   - **Client ID** → `GOOGLE_CLIENT_ID`
   - **Client secret** → `GOOGLE_CLIENT_SECRET`

---

#### 2.9 Email (SMTP) - Optional

```env
# Email Configuration
EMAIL_USER="your-email@gmail.com"
EMAIL_PASSWORD="your-app-password"
EMAIL_IMAP_HOST="imap.gmail.com"
EMAIL_IMAP_PORT="993"
EMAIL_SMTP_HOST="smtp.gmail.com"
EMAIL_SMTP_PORT="587"
EMAIL_SMTP_SECURE="false"

# Contact Form
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="PILAR SYSTEMS <no-reply@pilarsystems.com>"
CONTACT_TO="hello@pilarsystems.com"
CONTACT_EMAIL_ENABLED="true"
```

**Wie bekomme ich Gmail App Password?**
1. Gehe zu [Google Account Security](https://myaccount.google.com/security)
2. Aktiviere **2-Step Verification**
3. Gehe zu **App passwords**
4. Wähle **Mail** und **Other (Custom name)**
5. Gib "PILAR SYSTEMS" ein
6. Klicke **Generate**
7. Kopiere 16-Zeichen Passwort → `EMAIL_PASSWORD` und `SMTP_PASS`

---

#### 2.10 n8n Workflow Automation - Optional

```env
# n8n Automation
N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/xxxxx"
N8N_API_KEY="xxxxx"
```

**Wie bekomme ich n8n Credentials?**
1. Deploye n8n (self-hosted oder [n8n.cloud](https://n8n.cloud))
2. Erstelle Workflow mit Webhook Node
3. Kopiere **Production URL** → `N8N_WEBHOOK_URL`
4. Erstelle API Key in n8n Settings → `N8N_API_KEY`

**Hinweis:** n8n Workflows sind im `/n8n-workflows/` Verzeichnis. Importiere sie in deine n8n Instanz.

---

#### 2.11 Security & Encryption (ERFORDERLICH)

```env
# Encryption Keys
ENCRYPTION_KEY="your-64-character-hex-encryption-key"
NEXTAUTH_SECRET="your-nextauth-secret"
```

**Wie generiere ich diese Keys?**

```bash
# ENCRYPTION_KEY (64-character hex)
openssl rand -hex 32

# NEXTAUTH_SECRET (base64)
openssl rand -base64 32
```

**Verwendet für:**
- `ENCRYPTION_KEY`: Verschlüsselung von API Keys, Tokens und sensiblen Daten in der Datenbank
- `NEXTAUTH_SECRET`: Session Token Verschlüsselung und CSRF Protection

⚠️ **WICHTIG:** Verwende unterschiedliche Keys für Development und Production!

---

#### 2.12 Rate Limiting (Empfohlen für Production)

```env
# Upstash Redis (Rate Limiting)
RATE_LIMIT_REDIS_URL="https://xxxxx.upstash.io"
RATE_LIMIT_REDIS_TOKEN="xxxxx"
```

**Wie bekomme ich Upstash Redis?**
1. Gehe zu [Upstash Console](https://console.upstash.com)
2. Erstelle neue Redis Database
3. Gehe zu **REST API** Tab
4. Kopiere:
   - **UPSTASH_REDIS_REST_URL** → `RATE_LIMIT_REDIS_URL`
   - **UPSTASH_REDIS_REST_TOKEN** → `RATE_LIMIT_REDIS_TOKEN`

**Hinweis:** Wenn nicht gesetzt, ist Rate Limiting deaktiviert (nicht empfohlen für Production).

---

#### 2.13 Affiliate System Configuration

```env
# Affiliate System
AFFILIATES_ENABLED="true"
AFFILIATE_AUTO_APPROVE="false"  # false = manuelle Freigabe, true = automatisch
AFFILIATE_COMMISSION_SETUP="10"  # Prozent vom Setup Fee
AFFILIATE_COMMISSION_RECURRING="10"  # Prozent vom ersten Monat MRR
```

---

#### 2.14 Admin Access

```env
# Admin Emails (komma-separiert)
ADMIN_EMAILS="admin@pilarsystems.com,owner@pilarsystems.com"
```

---

### Schritt 3: Datenbank Setup

```bash
# 1. Datenbank Migrationen ausführen
npx prisma migrate deploy

# 2. Prisma Client generieren
npx prisma generate

# 3. (Optional) Seed-Daten laden
npx prisma db seed
```

**Erwartetes Ergebnis:**
- Alle Tabellen sind erstellt
- Prisma Client ist generiert
- Keine Fehler

**Bei Problemen:**
```bash
# Prisma Studio öffnen (Datenbank GUI)
npx prisma studio

# Migration Status prüfen
npx prisma migrate status

# Migration zurücksetzen (VORSICHT: Löscht Daten!)
npx prisma migrate reset
```

---

### Schritt 4: Stripe Produkte erstellen

```bash
# Stripe Produkte automatisch erstellen
npx ts-node scripts/create-stripe-products.ts
```

Das Script erstellt folgende Produkte in Stripe:
- **PILAR SYSTEMS Basic** - €100/Monat (monatlich) oder €85/Monat (jährlich, 15% Rabatt)
- **PILAR SYSTEMS Basic - Setup Fee** - €500 einmalig
- **PILAR SYSTEMS Pro** - €149/Monat (monatlich) oder €127/Monat (jährlich, 15% Rabatt)
- **PILAR SYSTEMS Pro - Setup Fee** - €1000 einmalig
- **WhatsApp Add-on** - €20/Monat

**Nach Ausführung:**
1. Script gibt Price IDs aus
2. Kopiere alle Price IDs in deine `.env.local`:
   ```env
   STRIPE_BASIC_PRICE_ID="price_xxxxx"
   STRIPE_BASIC_YEARLY_PRICE_ID="price_xxxxx"
   STRIPE_BASIC_SETUP_FEE_ID="price_xxxxx"
   STRIPE_PRO_PRICE_ID="price_xxxxx"
   STRIPE_PRO_YEARLY_PRICE_ID="price_xxxxx"
   STRIPE_PRO_SETUP_FEE_ID="price_xxxxx"
   STRIPE_WHATSAPP_ADDON_PRICE_ID="price_xxxxx"
   ```

**Alternative (Manuell):**
1. Gehe zu [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Erstelle Produkte manuell mit obigen Preisen
3. Kopiere Price IDs

---

### Schritt 5: Lokale Entwicklung starten

```bash
# Development Server starten
npm run dev
```

**Öffne Browser:**
- Homepage: http://localhost:3000
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup
- Dashboard: http://localhost:3000/dashboard
- Affiliate: http://localhost:3000/affiliate

**Erwartetes Ergebnis:**
- Server läuft auf Port 3000
- Keine Console Errors
- Alle Seiten laden korrekt

---

### Schritt 6: Stripe Webhook lokal testen (Optional)

```bash
# Stripe CLI installieren (falls noch nicht installiert)
brew install stripe/stripe-cli/stripe  # macOS
# oder: https://stripe.com/docs/stripe-cli

# Stripe CLI login
stripe login

# Webhook forwarding starten (in separatem Terminal)
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

Das gibt dir einen **Webhook Signing Secret** aus. Kopiere ihn in `.env.local`:
```env
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"
```

---

## Provider Einrichtung

### Supabase Auth Konfiguration

1. Gehe zu [Supabase Dashboard](https://supabase.com/dashboard)
2. Wähle dein Projekt
3. Gehe zu **Authentication** → **URL Configuration**
4. Setze:
   - **Site URL**: `http://localhost:3000` (Development) oder `https://pilarsystems.com` (Production)
   - **Redirect URLs**: 
     - `http://localhost:3000/auth/callback`
     - `https://pilarsystems.com/auth/callback`
5. Gehe zu **Authentication** → **Email Templates**
6. Passe Email Templates an (optional):
   - Confirm signup
   - Magic Link
   - Reset Password

---

### Stripe Konfiguration

#### Test Mode (Development)
1. Verwende `sk_test_...` und `pk_test_...` Keys
2. Teste mit [Stripe Test Cards](https://stripe.com/docs/testing):
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

#### Live Mode (Production)
1. Gehe zu [Stripe Dashboard](https://dashboard.stripe.com)
2. Aktiviere Live Mode (Toggle oben rechts)
3. Vervollständige **Business Details**
4. Aktiviere **Payment Methods** (Kreditkarte, SEPA, etc.)
5. Kopiere Live Keys (`sk_live_...`, `pk_live_...`)
6. Erstelle Produkte im Live Mode (oder nutze Script)
7. Konfiguriere Webhook für Production URL

---

### Twilio Konfiguration (Optional)

1. Gehe zu [Twilio Console](https://console.twilio.com)
2. Kaufe deutsche Telefonnummer (+49) mit **Voice** Capabilities
3. Konfiguriere Nummer:
   - **Voice & Fax** → **A CALL COMES IN**: `https://pilarsystems.com/api/webhooks/twilio` (POST)
   - **Messaging** → **A MESSAGE COMES IN**: `https://pilarsystems.com/api/webhooks/twilio` (POST)
4. Teste mit Testanruf

**Multi-Tenant Setup:**
- PILAR erstellt automatisch Twilio Subaccounts pro Gym
- Jedes Gym bekommt eigene Telefonnummer
- Konfiguration erfolgt automatisch nach Onboarding

---

### WhatsApp Business API (Optional)

1. Gehe zu [Meta for Developers](https://developers.facebook.com)
2. Erstelle Business App
3. Füge WhatsApp Product hinzu
4. Verifiziere Business (erforderlich für Production)
5. Beantrage WhatsApp Business API Zugang
6. Konfiguriere Webhook (siehe Schritt 2.7)
7. Teste mit Test-Nachricht

**Hinweis:** WhatsApp Business API Approval kann 1-2 Wochen dauern.

---

## Deployment (Vercel)

### Schritt 1: GitHub Repository vorbereiten

```bash
# Stelle sicher, dass alle Änderungen committed sind
git status

# Pushe zu GitHub
git push origin main
```

---

### Schritt 2: Vercel Projekt erstellen

1. Gehe zu [Vercel Dashboard](https://vercel.com/dashboard)
2. Klicke **Add New** → **Project**
3. Importiere dein GitHub Repository
4. Klicke **Import**

---

### Schritt 3: Environment Variables in Vercel setzen

1. Gehe zu **Settings** → **Environment Variables**
2. Füge **ALLE** Variablen aus deiner `.env.local` hinzu
3. Für jede Variable:
   - Klicke **Add**
   - **Key**: Variable Name (z.B. `DATABASE_URL`)
   - **Value**: Wert aus `.env.local`
   - **Environments**: Wähle **Production**, **Preview**, **Development**
   - Klicke **Save**

**Wichtige Änderungen für Production:**
```env
NEXT_PUBLIC_APP_URL="https://pilarsystems.com"  # Deine Domain
NODE_ENV="production"
STRIPE_SECRET_KEY="sk_live_..."  # Live Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."  # Live Key
```

**Vollständige Liste der erforderlichen Variables:**
```
DATABASE_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_WEBHOOK_SECRET
STRIPE_BASIC_PRICE_ID
STRIPE_BASIC_SETUP_FEE_ID
STRIPE_PRO_PRICE_ID
STRIPE_PRO_SETUP_FEE_ID
STRIPE_WHATSAPP_ADDON_PRICE_ID
OPENAI_API_KEY
ELEVENLABS_API_KEY
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER
WHATSAPP_API_TOKEN
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_VERIFY_TOKEN
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
EMAIL_USER
EMAIL_PASSWORD
EMAIL_IMAP_HOST
EMAIL_IMAP_PORT
EMAIL_SMTP_HOST
EMAIL_SMTP_PORT
EMAIL_SMTP_SECURE
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_FROM
CONTACT_TO
CONTACT_EMAIL_ENABLED
N8N_WEBHOOK_URL
N8N_API_KEY
ENCRYPTION_KEY
NEXTAUTH_SECRET
RATE_LIMIT_REDIS_URL
RATE_LIMIT_REDIS_TOKEN
AFFILIATES_ENABLED
AFFILIATE_AUTO_APPROVE
AFFILIATE_COMMISSION_SETUP
AFFILIATE_COMMISSION_RECURRING
ADMIN_EMAILS
NEXT_PUBLIC_APP_URL
NODE_ENV
LOG_LEVEL
```

---

### Schritt 4: Deployment starten

1. Klicke **Deploy**
2. Warte bis Build abgeschlossen ist (~2-3 Minuten)
3. Deployment ist live unter `https://your-project.vercel.app`

**Bei Build-Fehlern:**
- Prüfe Vercel Logs: **Deployments** → Klick auf Deployment → **Build Logs**
- Häufigste Fehler:
  - Fehlende ENV Variables
  - Prisma Client nicht generiert
  - TypeScript Errors

---

### Schritt 5: Custom Domain verbinden (Optional)

1. Gehe zu **Settings** → **Domains**
2. Klicke **Add**
3. Gib deine Domain ein: `pilarsystems.com`
4. Folge DNS Konfigurationsanweisungen:
   ```
   A     @      76.76.21.21
   CNAME www    cname.vercel-dns.com
   ```
5. Warte auf DNS Propagation (~5-60 Minuten)
6. SSL Zertifikat wird automatisch erstellt

**Nach Domain-Verbindung:**
1. Update `NEXT_PUBLIC_APP_URL` in Vercel ENV Variables
2. Update alle Webhook URLs (Stripe, Twilio, WhatsApp)
3. Update Google OAuth Redirect URIs
4. Redeploy

---

### Schritt 6: Webhooks für Production konfigurieren

#### Stripe Webhook
1. Gehe zu [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Klicke **Add endpoint**
3. URL: `https://pilarsystems.com/api/stripe/webhooks`
4. Events: (siehe Schritt 2.3)
5. Kopiere neuen **Signing secret**
6. Update `STRIPE_WEBHOOK_SECRET` in Vercel
7. Redeploy

#### Twilio Webhook
1. Gehe zu [Twilio Console](https://console.twilio.com)
2. Gehe zu **Phone Numbers** → Deine Nummer
3. Update **Voice URL**: `https://pilarsystems.com/api/webhooks/twilio`
4. Klicke **Save**

#### WhatsApp Webhook
1. Gehe zu [Meta for Developers](https://developers.facebook.com)
2. Gehe zu **WhatsApp** → **Configuration**
3. Update **Callback URL**: `https://pilarsystems.com/api/webhooks/whatsapp`
4. Klicke **Verify and save**

---

## Test-Checkliste

### Lokale Tests (vor Deployment)

```bash
# 1. Build testen
npm run build

# Erwartetes Ergebnis: Build erfolgreich, 0 Errors

# 2. Lint prüfen
npm run lint

# Erwartetes Ergebnis: Keine Lint Errors

# 3. TypeScript prüfen
npx tsc --noEmit

# Erwartetes Ergebnis: Keine Type Errors
```

---

### Manuelle Tests (nach Deployment)

#### ✅ Marketing Website
- [ ] Homepage lädt (`/`)
- [ ] Alle Animationen funktionieren
- [ ] Navigation funktioniert (Desktop + Mobile)
- [ ] Pricing Page zeigt korrekte Preise (`/pricing`)
- [ ] Features Page zeigt alle Module (`/features`)
- [ ] About Page lädt (`/about`)
- [ ] Contact Form funktioniert (`/contact`)
- [ ] Legal Pages vollständig (Impressum, Datenschutz, AGB)
- [ ] Cookie Consent Manager funktioniert
- [ ] Mobile Responsive (teste auf Smartphone)

#### ✅ Auth System
- [ ] Signup funktioniert (`/signup`)
- [ ] Email Verification Email wird gesendet
- [ ] Login funktioniert (`/login`)
- [ ] Magic Link funktioniert
- [ ] Password Reset funktioniert (`/reset-password`)
- [ ] Logout funktioniert
- [ ] Fehlermeldungen auf Deutsch

#### ✅ Checkout & Subscription
- [ ] Checkout Page lädt (`/checkout`)
- [ ] Plan Auswahl funktioniert (Basic/Pro)
- [ ] WhatsApp Add-on kann hinzugefügt werden
- [ ] Stripe Checkout öffnet sich
- [ ] Test-Zahlung funktioniert (Test Card: `4242 4242 4242 4242`)
- [ ] Webhook erstellt Subscription in DB
- [ ] User wird zu Onboarding weitergeleitet

#### ✅ Onboarding Wizard
- [ ] Onboarding startet nach Checkout (`/onboarding`)
- [ ] Step 1: Studio Info kann ausgefüllt werden
- [ ] Step 2: Integrations zeigt Optionen
- [ ] Step 3: Voice Selection funktioniert (ElevenLabs)
- [ ] Step 4: Lead Rules können konfiguriert werden
- [ ] Step 5: Test & Go-Live zeigt Summary
- [ ] Nach Abschluss: Weiterleitung zu Dashboard

#### ✅ Dashboard
- [ ] Dashboard lädt (`/dashboard`)
- [ ] Overview zeigt KPIs
- [ ] Leads Page funktioniert (`/dashboard/leads`)
- [ ] Messages Page funktioniert (`/dashboard/messages`)
- [ ] Calendar Page funktioniert (`/dashboard/calendar`)
- [ ] Analytics Page funktioniert (`/dashboard/analytics`)
- [ ] Settings Page funktioniert (`/dashboard/settings`)
- [ ] Phone AI Page funktioniert (`/dashboard/phone`)
- [ ] Affiliate Dashboard funktioniert (`/dashboard/affiliate`)
- [ ] Logout funktioniert

#### ✅ Affiliate System
- [ ] Affiliate Landing Page lädt (`/affiliate`)
- [ ] Affiliate Signup funktioniert (`/affiliate/signup`)
- [ ] Referral Link wird generiert
- [ ] QR Code wird generiert
- [ ] Redirect funktioniert (`/r/[code]`)
- [ ] Cookie wird gesetzt (30 Tage)
- [ ] Checkout mit Affiliate Tracking funktioniert
- [ ] Conversion wird in DB gespeichert
- [ ] Commission wird berechnet
- [ ] Partner Dashboard zeigt Stats (`/dashboard/affiliate`)
- [ ] Admin Dashboard zeigt alle Affiliates (`/dashboard/admin/affiliates`)

#### ✅ WhatsApp Coach (wenn aktiviert)
- [ ] Opt-in System funktioniert
- [ ] Konfiguration im Dashboard funktioniert
- [ ] Nachrichten werden versendet
- [ ] Tonality kann eingestellt werden
- [ ] Häufigkeit kann eingestellt werden

#### ✅ AI Features (wenn aktiviert)
- [ ] Phone AI nimmt Anrufe entgegen
- [ ] WhatsApp AI antwortet auf Nachrichten
- [ ] Email AI verarbeitet Emails
- [ ] Lead Classification funktioniert
- [ ] Follow-up Automation funktioniert

---

### Performance Tests

```bash
# Lighthouse Audit
npx lighthouse https://pilarsystems.com --view

# Erwartete Scores:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 95+
```

---

## Production Launch

### Pre-Launch Checklist (1 Woche vorher)

#### ✅ Content
- [ ] Legal Pages mit echten Daten gefüllt (Impressum, Datenschutz, AGB)
- [ ] Contact Email aktiv und wird überwacht
- [ ] Support Email aktiv (`support@pilarsystems.com`)
- [ ] Alle Texte auf Rechtschreibfehler geprüft

#### ✅ Technical
- [ ] Alle ENV Variables in Production gesetzt
- [ ] Stripe Live Mode aktiviert
- [ ] Stripe Produkte im Live Mode erstellt
- [ ] Stripe Webhook für Production konfiguriert
- [ ] Twilio Production Number konfiguriert
- [ ] WhatsApp Business verifiziert
- [ ] Google Calendar OAuth approved
- [ ] Custom Domain verbunden
- [ ] SSL Zertifikat aktiv
- [ ] Database Backups konfiguriert

#### ✅ Monitoring
- [ ] Vercel Analytics aktiviert
- [ ] Error Tracking Setup (Sentry empfohlen)
- [ ] Uptime Monitoring Setup (UptimeRobot empfohlen)
- [ ] Log Aggregation Setup (Logtail empfohlen)

#### ✅ Security
- [ ] DSGVO Compliance geprüft
- [ ] Cookie Consent Manager funktioniert
- [ ] Datenschutzerklärung vollständig
- [ ] Rate Limiting aktiviert (Upstash Redis)
- [ ] Alle Secrets rotiert (neue Keys für Production)

#### ✅ Testing
- [ ] Kompletter Test-Signup durchgeführt
- [ ] Test-Checkout durchgeführt (mit echtem Geld, dann refunded)
- [ ] Test-Affiliate-Conversion durchgeführt
- [ ] Alle Webhooks getestet
- [ ] Mobile Testing auf iOS und Android
- [ ] Browser Testing (Chrome, Firefox, Safari, Edge)

---

### Launch Day

1. **DNS auf Production umstellen** (falls noch nicht geschehen)
2. **Final Smoke Test:**
   - Homepage lädt
   - Signup funktioniert
   - Checkout funktioniert
   - Dashboard lädt
3. **Monitoring aktivieren:**
   - Vercel Dashboard im Auge behalten
   - Error Tracking Dashboard öffnen
   - Stripe Dashboard öffnen
4. **Marketing Kampagnen starten:**
   - Google Ads aktivieren
   - Facebook/Instagram Ads aktivieren
   - LinkedIn Ads aktivieren
   - Email Newsletter versenden
5. **Support bereit:**
   - Support Email überwachen
   - Telefon bereit (falls vorhanden)
   - Slack/Discord für Team-Kommunikation

---

### Post-Launch (erste Woche)

- [ ] **Täglich Logs checken** (Vercel Logs, Error Tracking)
- [ ] **Error Rates monitoren** (sollte < 1% sein)
- [ ] **Conversion Rates tracken** (Visitor → Signup → Customer)
- [ ] **User Feedback sammeln** (Email, Calls, Umfragen)
- [ ] **Performance optimieren** (basierend auf Lighthouse)
- [ ] **Bugs fixen** (priorisiert nach Severity)
- [ ] **Affiliate Partner akquirieren** (Outreach starten)

---

## Troubleshooting

### Build Fehler

**Problem:** `npm run build` schlägt fehl

**Lösung:**
```bash
# 1. Prisma Client neu generieren
npx prisma generate

# 2. Node Modules neu installieren
rm -rf node_modules package-lock.json
npm install

# 3. Cache löschen
rm -rf .next

# 4. Erneut versuchen
npm run build
```

---

### Database Connection Fehler

**Problem:** `Error: Can't reach database server`

**Lösung:**
```bash
# 1. DATABASE_URL prüfen
echo $DATABASE_URL

# 2. Prisma Migration Status prüfen
npx prisma migrate status

# 3. Prisma Studio öffnen (testet Connection)
npx prisma studio

# 4. Falls Supabase: Prüfe ob Projekt pausiert ist
# Gehe zu Supabase Dashboard → Projekt sollte "Active" sein
```

---

### Stripe Webhook Fehler

**Problem:** Webhooks kommen nicht an oder schlagen fehl

**Lösung:**
```bash
# 1. Webhook Secret prüfen
echo $STRIPE_WEBHOOK_SECRET

# 2. Stripe CLI für lokales Testing
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# 3. Vercel Logs checken
vercel logs --follow

# 4. Stripe Dashboard → Webhooks → Event Logs prüfen
```

---

### Encryption Key Fehler

**Problem:** `ENCRYPTION_KEY not set` oder `Invalid encryption key`

**Lösung:**
```bash
# 1. Neuen Key generieren
openssl rand -hex 32

# 2. In .env.local eintragen
echo "ENCRYPTION_KEY=your-generated-key" >> .env.local

# 3. Server neu starten
npm run dev
```

---

### Vercel Deployment Fehler

**Problem:** Deployment schlägt fehl

**Lösung:**
1. Gehe zu Vercel Dashboard → **Deployments**
2. Klicke auf fehlgeschlagenes Deployment
3. Prüfe **Build Logs** für Fehler
4. Häufigste Fehler:
   - Fehlende ENV Variables → In Settings hinzufügen
   - Prisma Client nicht generiert → `npx prisma generate` in `package.json` build script
   - TypeScript Errors → Lokal fixen und pushen

---

### Supabase Auth Fehler

**Problem:** Login/Signup funktioniert nicht

**Lösung:**
1. Prüfe Supabase Dashboard → **Authentication** → **Users**
2. Prüfe **URL Configuration**:
   - Site URL korrekt?
   - Redirect URLs korrekt?
3. Prüfe ENV Variables:
   - `NEXT_PUBLIC_SUPABASE_URL` korrekt?
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` korrekt?
   - `SUPABASE_SERVICE_ROLE_KEY` korrekt?
4. Prüfe Browser Console für Fehler

---

## Support & Wartung

### Wichtige Dashboards

- **Vercel:** https://vercel.com/dashboard
- **Supabase:** https://supabase.com/dashboard
- **Stripe:** https://dashboard.stripe.com
- **Twilio:** https://console.twilio.com
- **Meta for Developers:** https://developers.facebook.com
- **Google Cloud:** https://console.cloud.google.com

---

### Monitoring Metriken

**Business Metriken:**
- Signup Rate (Visitor → Signup)
- Conversion Rate (Signup → Customer)
- Affiliate Conversion Rate
- Churn Rate (monatlich)
- MRR (Monthly Recurring Revenue)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)

**Technical Metriken:**
- API Response Times (< 200ms)
- Error Rate (< 1%)
- Uptime (> 99.9%)
- Database Query Performance
- Webhook Success Rate

---

### Backup Strategie

**Datenbank Backups:**
- Supabase: Automatische tägliche Backups (7 Tage Retention)
- Manuelle Backups: `pg_dump` via Supabase CLI
- Empfohlen: Wöchentliche Backups auf S3

**Code Backups:**
- GitHub: Automatisch bei jedem Push
- Empfohlen: Protected Branches für `main`

---

### Skalierung

**Wenn du 100+ Kunden hast:**
1. **Database Optimization:**
   - Indizes hinzufügen für häufige Queries
   - Connection Pooling (PgBouncer)
   - Read Replicas für Analytics

2. **Caching:**
   - Redis für Session Storage
   - CDN für Static Assets (Vercel macht das automatisch)
   - API Response Caching

3. **Infrastructure:**
   - Vercel Pro Plan (bessere Performance)
   - Supabase Pro Plan (mehr Connections)
   - Dedicated Twilio Subaccounts

---

### Wartungsplan

**Täglich:**
- Error Logs checken
- Stripe Dashboard checken (neue Kunden, Zahlungen)
- Support Emails beantworten

**Wöchentlich:**
- Performance Metriken reviewen
- User Feedback sammeln und priorisieren
- Affiliate Partner Stats reviewen
- Database Backup verifizieren

**Monatlich:**
- Security Updates installieren
- Dependencies updaten (`npm outdated`)
- Lighthouse Audit durchführen
- Churn Analysis
- Feature Roadmap reviewen

---

## Nächste Schritte nach Launch

### Phase 1: Marketing (Monat 1-3)
- Google Ads Kampagnen optimieren
- Facebook/Instagram Ads skalieren
- LinkedIn Ads für B2B
- Content Marketing (Blog Posts)
- SEO Optimierung
- Affiliate Partner akquirieren

### Phase 2: Features (Monat 3-6)
- Mobile App (React Native)
- Advanced Analytics Dashboard
- CRM Integration (HubSpot, Salesforce)
- Multi-Language Support (Englisch)
- White-Label Option für Reseller

### Phase 3: Skalierung (Monat 6-12)
- Database Optimization
- Caching Layer (Redis)
- Auto-Scaling Infrastructure
- Enterprise Features
- API für Drittanbieter

---

## ✅ System ist bereit für:

- ✅ **Paid Ads** (Google, Facebook, LinkedIn)
- ✅ **Organischen Traffic** (SEO-optimiert)
- ✅ **Sales Calls** (Contact Form funktioniert)
- ✅ **Affiliate Marketing** (vollautomatisch)
- ✅ **Echte Kunden** (vollautomatisches Onboarding)
- ✅ **Skalierung** (Multi-Tenant Architecture)

---

## Zusammenfassung

Nach Abarbeiten dieser Anleitung hast du:

1. ✅ Lokale Entwicklungsumgebung eingerichtet
2. ✅ Alle Provider konfiguriert (Supabase, Stripe, OpenAI, etc.)
3. ✅ Production Deployment auf Vercel
4. ✅ Alle Webhooks konfiguriert
5. ✅ Komplettes Testing durchgeführt
6. ✅ Monitoring Setup
7. ✅ Launch-Ready System

**Du kannst jetzt:**
- Paid Ads schalten
- Sales Calls führen
- Affiliate Partner onboarden
- Echte Kunden akquirieren
- Skalieren

---

**Viel Erfolg beim Launch! 🚀**

**Bei Fragen:**
- GitHub Issues: https://github.com/PilarSystems/pilarsystems/issues
- Support Email: support@pilarsystems.com

---

**Version:** 2.0.0 (Final Production-Ready)  
**Letztes Update:** November 2025  
**Status:** 🚀 Launch-Ready
