# PILAR SYSTEMS - Launch Checklist

Dieses Dokument enthält alle Schritte, um PILAR SYSTEMS production-ready zu deployen.

## 🎯 Übersicht

PILAR SYSTEMS ist jetzt vollständig implementiert mit:
- ✅ High-End Marketing Website (Apple-Style, Deutsch, DACH-optimiert)
- ✅ Vollautomatisches Affiliate-/Partner-System
- ✅ Contact Backend mit Email-Benachrichtigungen
- ✅ DSGVO-konformes Cookie-Management
- ✅ Stripe Integration mit Affiliate-Tracking
- ✅ Multi-Tenant SaaS-Plattform
- ✅ AI-Module (Phone, WhatsApp, Email)

## 📋 Pre-Launch Checklist

### 1. Environment Variables konfigurieren

#### Minimal (Lokale Entwicklung)
```bash
# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/pilarsystems"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"

# Auth (Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx..."
SUPABASE_SERVICE_ROLE_KEY="eyJxxx..."

# Encryption
ENCRYPTION_KEY="generate-with-openssl-rand-hex-32"
```

#### Vollständig (Production)

**Core Services:**
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/pilarsystems"

# App
NEXT_PUBLIC_APP_URL="https://pilarsystems.com"
NODE_ENV="production"

# Auth (Supabase)
NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJxxx..."
SUPABASE_SERVICE_ROLE_KEY="eyJxxx..."

# Encryption
ENCRYPTION_KEY="production-key-32-chars-min"
```

**Stripe (Payment):**
```bash
STRIPE_SECRET_KEY="sk_live_xxx"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_xxx"
STRIPE_WEBHOOK_SECRET="whsec_xxx"

# Stripe Product IDs (erstelle diese in Stripe Dashboard)
STRIPE_BASIC_PRICE_ID="price_xxx"
STRIPE_BASIC_SETUP_FEE_ID="price_xxx"
STRIPE_PRO_PRICE_ID="price_xxx"
STRIPE_PRO_SETUP_FEE_ID="price_xxx"
STRIPE_WHATSAPP_ADDON_PRICE_ID="price_xxx"
```

**AI Services:**
```bash
# OpenAI
OPENAI_API_KEY="sk-xxx"

# ElevenLabs (Voice AI)
ELEVENLABS_API_KEY="xxx"
```

**Communication:**
```bash
# Twilio (Phone AI)
TWILIO_ACCOUNT_SID="ACxxx"
TWILIO_AUTH_TOKEN="xxx"
TWILIO_PHONE_NUMBER="+4912345678"

# WhatsApp (optional)
WHATSAPP_PHONE_NUMBER_ID="xxx"
WHATSAPP_ACCESS_TOKEN="xxx"
WHATSAPP_VERIFY_TOKEN="xxx"
```

**Email:**
```bash
# SMTP (für Contact Form)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="PILAR SYSTEMS <no-reply@pilarsystems.com>"
CONTACT_TO="hello@pilarsystems.com"
CONTACT_EMAIL_ENABLED="true"
```

**Integrations:**
```bash
# Google Calendar
GOOGLE_CLIENT_ID="xxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxx"

# n8n (Automation)
N8N_WEBHOOK_URL="https://your-n8n.com/webhook/xxx"
N8N_API_KEY="xxx"
```

**Affiliate System:**
```bash
AFFILIATES_ENABLED="true"
AFFILIATE_AUTO_APPROVE="false"  # true = auto-approve, false = manual review
AFFILIATE_COMMISSION_SETUP="10"  # Prozent vom Setup Fee
AFFILIATE_COMMISSION_RECURRING="10"  # Prozent vom ersten Monat MRR
```

**Analytics (optional):**
```bash
ANALYTICS_ENABLED="true"
PLAUSIBLE_DOMAIN="pilarsystems.com"
```

**Admin Access:**
```bash
ADMIN_EMAILS="admin@pilarsystems.com,owner@pilarsystems.com"
```

**Rate Limiting:**
```bash
# Upstash Redis (für Rate Limiting)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxx"
```

### 2. Datenbank Setup

```bash
# 1. Prisma Migrations ausführen
npx prisma migrate deploy

# 2. Prisma Client generieren
npx prisma generate

# 3. (Optional) Seed-Daten laden
npx prisma db seed
```

### 3. Stripe Setup

#### Produkte erstellen:
1. Gehe zu https://dashboard.stripe.com/products
2. Erstelle folgende Produkte:

**BASIC Plan:**
- Name: "PILAR SYSTEMS Basic"
- Preis: 100€/Monat (recurring)
- Kopiere Price ID → `STRIPE_BASIC_PRICE_ID`

**BASIC Setup Fee:**
- Name: "PILAR SYSTEMS Basic - Setup Fee"
- Preis: 500€ (one-time)
- Kopiere Price ID → `STRIPE_BASIC_SETUP_FEE_ID`

**PRO Plan:**
- Name: "PILAR SYSTEMS Pro"
- Preis: 149€/Monat (recurring)
- Kopiere Price ID → `STRIPE_PRO_PRICE_ID`

**PRO Setup Fee:**
- Name: "PILAR SYSTEMS Pro - Setup Fee"
- Preis: 1000€ (one-time)
- Kopiere Price ID → `STRIPE_PRO_SETUP_FEE_ID`

**WhatsApp Add-on:**
- Name: "WhatsApp Add-on"
- Preis: 20€/Monat (recurring)
- Kopiere Price ID → `STRIPE_WHATSAPP_ADDON_PRICE_ID`

#### Webhooks konfigurieren:
1. Gehe zu https://dashboard.stripe.com/webhooks
2. Erstelle Endpoint: `https://pilarsystems.com/api/stripe/webhooks`
3. Wähle Events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Kopiere Signing Secret → `STRIPE_WEBHOOK_SECRET`

### 4. Twilio Setup (Phone AI)

1. Gehe zu https://console.twilio.com
2. Erstelle neuen Account oder nutze bestehenden
3. Kaufe deutsche Telefonnummer (+49)
4. Konfiguriere Webhook für eingehende Anrufe:
   - URL: `https://pilarsystems.com/api/twilio/voice`
   - Method: POST
5. Kopiere Credentials:
   - Account SID → `TWILIO_ACCOUNT_SID`
   - Auth Token → `TWILIO_AUTH_TOKEN`
   - Phone Number → `TWILIO_PHONE_NUMBER`

### 5. WhatsApp Setup (optional)

1. Gehe zu https://business.facebook.com
2. Erstelle WhatsApp Business Account
3. Verifiziere Business
4. Erstelle WhatsApp Business API App
5. Kopiere Credentials:
   - Phone Number ID → `WHATSAPP_PHONE_NUMBER_ID`
   - Access Token → `WHATSAPP_ACCESS_TOKEN`
   - Verify Token (selbst wählen) → `WHATSAPP_VERIFY_TOKEN`
6. Konfiguriere Webhook:
   - URL: `https://pilarsystems.com/api/whatsapp/webhook`
   - Verify Token: (dein gewählter Token)

### 6. Google Calendar Setup

1. Gehe zu https://console.cloud.google.com
2. Erstelle neues Projekt "PILAR SYSTEMS"
3. Aktiviere Google Calendar API
4. Erstelle OAuth 2.0 Credentials:
   - Application Type: Web Application
   - Authorized Redirect URIs: `https://pilarsystems.com/api/auth/callback/google`
5. Kopiere Credentials:
   - Client ID → `GOOGLE_CLIENT_ID`
   - Client Secret → `GOOGLE_CLIENT_SECRET`

### 7. n8n Setup (Automation)

1. Deploye n8n (https://n8n.io) oder nutze Cloud
2. Erstelle Workflows für:
   - Lead Follow-ups
   - Email Automation
   - CRM Integration
3. Erstelle Webhook-URLs
4. Kopiere Credentials:
   - Webhook URL → `N8N_WEBHOOK_URL`
   - API Key → `N8N_API_KEY`

### 8. Vercel Deployment

```bash
# 1. Installiere Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link Projekt
vercel link

# 4. Setze alle Environment Variables
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_APP_URL
# ... (alle anderen ENV vars)

# 5. Deploy
vercel --prod

# 6. Konfiguriere Custom Domain
vercel domains add pilarsystems.com
```

### 9. DNS Setup

Füge folgende DNS Records hinzu:

```
A     @              76.76.21.21
CNAME www            cname.vercel-dns.com
TXT   @              "v=spf1 include:_spf.google.com ~all"
TXT   _dmarc         "v=DMARC1; p=none; rua=mailto:dmarc@pilarsystems.com"
```

### 10. Email Setup (SMTP)

Für Gmail:
1. Gehe zu https://myaccount.google.com/security
2. Aktiviere 2-Factor Authentication
3. Erstelle App Password
4. Nutze App Password als `SMTP_PASS`

Für eigene Domain:
1. Nutze Mailgun, SendGrid, oder AWS SES
2. Konfiguriere SPF, DKIM, DMARC Records
3. Verifiziere Domain

## ✅ Testing Checklist

### Lokales Testing

```bash
# 1. Install Dependencies
npm install

# 2. Setup ENV
cp .env.example .env.local
# Fülle .env.local mit deinen Werten

# 3. Database
npx prisma migrate dev
npx prisma generate

# 4. Start Dev Server
npm run dev

# 5. Test in Browser
open http://localhost:3000
```

### Test-Szenarien

#### Marketing Website:
- [ ] Homepage lädt korrekt
- [ ] Alle Animationen funktionieren
- [ ] Navigation funktioniert
- [ ] Pricing Page zeigt korrekte Preise
- [ ] Features Page zeigt alle Module
- [ ] Contact Form funktioniert
- [ ] Legal Pages (Impressum, Datenschutz, AGB) sind vollständig
- [ ] Cookie Consent Manager funktioniert
- [ ] Mobile Responsive

#### Affiliate System:
- [ ] Affiliate Registration funktioniert
- [ ] Affiliate Link wird generiert
- [ ] QR Code wird generiert
- [ ] Click Tracking funktioniert
- [ ] Checkout mit ?ref Parameter funktioniert
- [ ] Conversion wird in DB gespeichert
- [ ] Webhook approved Conversion
- [ ] Commission wird korrekt berechnet
- [ ] Stats API zeigt korrekte Daten

#### Signup & Onboarding:
- [ ] User kann sich registrieren
- [ ] Email Verification funktioniert
- [ ] Stripe Checkout funktioniert
- [ ] Webhook erstellt Subscription
- [ ] Onboarding Wizard startet
- [ ] Alle 5 Steps funktionieren
- [ ] Dashboard wird nach Onboarding angezeigt

#### Dashboard:
- [ ] Overview zeigt KPIs
- [ ] Settings funktioniert
- [ ] Billing funktioniert
- [ ] Alle Module sind erreichbar

#### AI Features:
- [ ] Phone AI nimmt Anrufe entgegen
- [ ] WhatsApp AI antwortet
- [ ] Email AI verarbeitet Emails
- [ ] Lead Management funktioniert

## 🚀 Go-Live Checklist

### Pre-Launch (1 Woche vorher):
- [ ] Alle ENV Variables in Production gesetzt
- [ ] Stripe Live Mode aktiviert
- [ ] Twilio Production Numbers konfiguriert
- [ ] WhatsApp Business verifiziert
- [ ] Google Calendar OAuth approved
- [ ] n8n Workflows getestet
- [ ] Backup-Strategie implementiert
- [ ] Monitoring Setup (Sentry, LogRocket, etc.)
- [ ] Performance Testing durchgeführt
- [ ] Security Audit durchgeführt
- [ ] DSGVO Compliance geprüft

### Launch Day:
- [ ] DNS auf Production umgestellt
- [ ] SSL Zertifikat aktiv
- [ ] Alle Services erreichbar
- [ ] Test-Signup durchgeführt
- [ ] Test-Checkout durchgeführt
- [ ] Test-Affiliate-Conversion durchgeführt
- [ ] Monitoring aktiv
- [ ] Support-Email aktiv
- [ ] Marketing Kampagnen starten

### Post-Launch (erste Woche):
- [ ] Täglich Logs checken
- [ ] Error Rates monitoren
- [ ] Conversion Rates tracken
- [ ] User Feedback sammeln
- [ ] Performance optimieren
- [ ] Bugs fixen

## 📊 Monitoring

### Wichtige Metriken:
- Signup Rate
- Conversion Rate (Visitor → Customer)
- Affiliate Conversion Rate
- Churn Rate
- MRR (Monthly Recurring Revenue)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- API Response Times
- Error Rates
- Uptime

### Tools:
- Vercel Analytics (Performance)
- Sentry (Error Tracking)
- Plausible (Privacy-friendly Analytics)
- Stripe Dashboard (Revenue)
- Prisma Studio (Database)

## 🆘 Support

### Bei Problemen:
1. Check Vercel Logs: `vercel logs`
2. Check Database: `npx prisma studio`
3. Check Stripe Dashboard
4. Check Twilio Console
5. Check n8n Workflows

### Häufige Probleme:

**Build Fehler:**
```bash
# Prisma Client neu generieren
npx prisma generate

# Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install
```

**Webhook Fehler:**
```bash
# Stripe Webhook Secret prüfen
stripe listen --forward-to localhost:3000/api/stripe/webhooks

# Logs checken
vercel logs --follow
```

**Database Connection Fehler:**
```bash
# Connection String prüfen
echo $DATABASE_URL

# Prisma Migration Status
npx prisma migrate status
```

## 📝 Nächste Schritte nach Launch

1. **Marketing:**
   - Google Ads Kampagnen
   - Facebook/Instagram Ads
   - LinkedIn Ads
   - Content Marketing
   - SEO Optimierung

2. **Features:**
   - Mobile App (React Native)
   - Advanced Analytics
   - CRM Integration (HubSpot, Salesforce)
   - Multi-Language Support
   - White-Label Option

3. **Skalierung:**
   - Database Optimization
   - Caching Layer (Redis)
   - CDN Setup
   - Load Balancing
   - Auto-Scaling

## ✅ System ist bereit für:
- ✅ Paid Ads (Google, Facebook, LinkedIn)
- ✅ Organischen Traffic (SEO-optimiert)
- ✅ Sales Calls (Contact Form funktioniert)
- ✅ Affiliate Marketing (vollautomatisch)
- ✅ Echte Kunden (vollautomatisches Onboarding)
- ✅ Skalierung (Multi-Tenant Architecture)

---

**Viel Erfolg beim Launch! 🚀**
