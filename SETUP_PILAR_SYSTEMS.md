# PILAR SYSTEMS - Setup Guide

Vollständige Anleitung zur Einrichtung und Inbetriebnahme der PILAR SYSTEMS Plattform.

## Übersicht

PILAR SYSTEMS ist eine vollautomatische AI SaaS-Plattform für Fitnessstudios mit:
- 24/7 AI Phone Rezeption
- WhatsApp & Email Automation
- Lead Management & CRM
- Kalender Integration
- Analytics Dashboard
- **Affiliate System** (neu in diesem Release)

## Voraussetzungen

- Node.js 18+ und npm
- PostgreSQL Datenbank (empfohlen: Supabase)
- Stripe Account (für Zahlungen)
- Twilio Account (für Phone AI)
- WhatsApp Business API (optional)
- ElevenLabs API Key (für Voice AI)
- OpenAI API Key (für AI Features)

## 1. Repository Setup

```bash
# Repository klonen
git clone https://github.com/PilarSystems/pilarsystems.git
cd pilarsystems

# Dependencies installieren
npm install

# Prisma Client generieren
npx prisma generate
```

## 2. Umgebungsvariablen

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID="price_..."
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID="price_..."

# Twilio (Phone AI)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+49..."

# WhatsApp (optional)
WHATSAPP_PHONE_NUMBER_ID="..."
WHATSAPP_ACCESS_TOKEN="..."
WHATSAPP_VERIFY_TOKEN="..."

# ElevenLabs (Voice AI)
ELEVENLABS_API_KEY="..."

# OpenAI (AI Features)
OPENAI_API_KEY="sk-..."

# Email (optional)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="..."
SMTP_PASSWORD="..."

# n8n (Workflow Automation, optional)
N8N_API_URL="https://your-n8n-instance.com"
N8N_API_KEY="..."

# Encryption (für sensible Daten)
ENCRYPTION_KEY="your-32-character-encryption-key"

# App URL (Production)
NEXT_PUBLIC_APP_URL="https://pilarsystems.com"
```

## 3. Datenbank Setup

```bash
# Datenbank Migrationen ausführen
npx prisma migrate deploy

# Prisma Client generieren
npx prisma generate

# (Optional) Seed-Daten laden
npx prisma db seed
```

## 4. Stripe Setup

1. **Stripe Dashboard öffnen**: https://dashboard.stripe.com
2. **Produkte erstellen**:
   - Basic Plan: 100€/Monat + 500€ Setup
   - Pro Plan: 149€/Monat + 1.000€ Setup
3. **Price IDs kopieren** und in `.env.local` eintragen
4. **Webhook einrichten**:
   - URL: `https://your-domain.com/api/stripe/webhooks`
   - Events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
5. **Webhook Secret** kopieren und in `.env.local` eintragen

```bash
# Stripe CLI für lokale Tests (optional)
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

## 5. Twilio Setup (Phone AI)

1. **Twilio Account erstellen**: https://www.twilio.com
2. **Phone Number kaufen** (mit Voice-Capabilities)
3. **TwiML App erstellen**:
   - Voice URL: `https://your-domain.com/api/webhooks/twilio`
   - Method: POST
4. **Credentials** in `.env.local` eintragen

## 6. WhatsApp Setup (optional)

1. **WhatsApp Business API** beantragen
2. **Phone Number ID** und **Access Token** erhalten
3. **Webhook einrichten**:
   - URL: `https://your-domain.com/api/webhooks/whatsapp`
   - Verify Token: Eigenen Token wählen
4. **Credentials** in `.env.local` eintragen

## 7. Lokale Entwicklung

```bash
# Development Server starten
npm run dev

# App öffnen
open http://localhost:3000
```

### Wichtige Routen

**Marketing (öffentlich)**:
- `/` - Homepage
- `/features` - Features Übersicht
- `/pricing` - Preise
- `/about` - Über uns
- `/contact` - Kontakt
- `/affiliate` - Affiliate Programm ✨ NEU
- `/affiliate/signup` - Affiliate Registrierung ✨ NEU

**Auth**:
- `/login` - Login
- `/signup` - Registrierung
- `/reset-password` - Passwort zurücksetzen

**Onboarding**:
- `/onboarding` - Onboarding Wizard (5 Schritte)

**Dashboard**:
- `/dashboard` - Übersicht
- `/dashboard/phone` - Phone AI
- `/dashboard/messages` - WhatsApp & Email
- `/dashboard/leads` - Lead Management
- `/dashboard/calendar` - Kalender
- `/dashboard/analytics` - Analytics
- `/dashboard/settings` - Einstellungen
- `/dashboard/affiliate` - Affiliate Dashboard ✨ NEU
- `/dashboard/admin/affiliates` - Admin Affiliate Management ✨ NEU

**API**:
- `/api/affiliate/register` - Affiliate registrieren
- `/api/affiliate/track-click` - Klick tracken
- `/api/affiliate/stats` - Affiliate Statistiken
- `/api/affiliate/qr/[code]` - QR-Code generieren
- `/r/[code]` - Affiliate Redirect ✨ NEU

## 8. Affiliate System (NEU)

### Übersicht

Das Affiliate System ermöglicht es Partnern, PILAR zu empfehlen und Provision zu verdienen:
- **25-30% wiederkehrende Provision** auf monatliche Zahlungen
- **Einmalige Setup-Provision** (125€ Basic, 300€ Pro)
- **30 Tage Cookie-Laufzeit**
- **Monatliche Auszahlung** ab 50€ Mindestauszahlung

### Affiliate Registrierung

1. Partner besucht `/affiliate` (Landing Page)
2. Klickt auf "Jetzt Partner werden"
3. Füllt Formular aus unter `/affiliate/signup`
4. Erhält sofort:
   - Persönlichen Referral-Link (`/r/[code]`)
   - QR-Code zum Download
   - Zugang zum Affiliate Dashboard

### Tracking Flow

1. **Klick**: Partner teilt Link `/r/ABC123`
2. **Redirect**: System trackt Klick, setzt Cookie, leitet zu `/` weiter
3. **Signup**: Lead registriert sich (Cookie wird ausgelesen)
4. **Checkout**: Lead kauft Plan (Affiliate wird zugeordnet)
5. **Provision**: Affiliate erhält Provision (Setup + monatlich)

### Affiliate Dashboard

Partner können unter `/dashboard/affiliate`:
- Klicks, Leads, Kunden sehen
- Provisionen verfolgen (gesamt, ausstehend, ausgezahlt)
- Referral-Link kopieren
- QR-Code herunterladen
- Letzte Aktivitäten sehen

### Admin Dashboard

Admins können unter `/dashboard/admin/affiliates`:
- Alle Affiliates sehen
- Performance-Metriken einsehen
- Status verwalten (aktiv, ausstehend, gesperrt)
- Provisionen überwachen
- CSV Export

### Prisma Models

Das Affiliate System nutzt folgende Prisma Models (bereits in PR #7 vorhanden):
- `Affiliate` - Partner-Daten
- `AffiliateLink` - Referral-Links
- `AffiliateClick` - Klick-Tracking
- `AffiliateConversion` - Conversion-Tracking
- `AffiliatePayout` - Auszahlungen

## 9. Deployment (Vercel)

### Vercel Setup

```bash
# Vercel CLI installieren
npm i -g vercel

# Projekt deployen
vercel

# Production Deployment
vercel --prod
```

### Umgebungsvariablen in Vercel

1. **Vercel Dashboard öffnen**: https://vercel.com
2. **Projekt auswählen**
3. **Settings → Environment Variables**
4. **Alle Variablen aus `.env.local` hinzufügen**

Wichtig:
- `DATABASE_URL` muss auf Production-Datenbank zeigen
- `NEXTAUTH_URL` muss auf Production-Domain zeigen
- `NEXT_PUBLIC_APP_URL` muss auf Production-Domain zeigen

### Domain Setup

1. **Domain in Vercel hinzufügen**: `pilarsystems.com`
2. **DNS Records konfigurieren**:
   - A Record: `@` → Vercel IP
   - CNAME Record: `www` → `cname.vercel-dns.com`
3. **SSL Zertifikat** wird automatisch erstellt

### Webhooks konfigurieren

Nach Deployment:
1. **Stripe Webhook** auf Production-URL umstellen
2. **Twilio Webhook** auf Production-URL umstellen
3. **WhatsApp Webhook** auf Production-URL umstellen

## 10. Testing

### Lokale Tests

```bash
# Build testen
npm run build

# Lint prüfen
npm run lint

# TypeScript prüfen
npm run type-check
```

### Manuelles Testing

1. **Homepage**: `/` sollte Landing Page zeigen (nicht Next.js Default)
2. **Smooth Scroll**: Anchor-Links sollten smooth scrollen
3. **CTAs**: Alle Buttons sollten "Jetzt starten" zeigen (nicht "Demo buchen")
4. **Affiliate Flow**:
   - `/affiliate` öffnen
   - "Jetzt Partner werden" klicken
   - Formular ausfüllen
   - Referral-Link erhalten
   - Link testen (`/r/[code]`)
   - Dashboard öffnen (`/dashboard/affiliate`)
5. **Signup Flow**:
   - `/signup` öffnen
   - Account erstellen
   - Checkout durchlaufen
   - Onboarding abschließen
   - Dashboard öffnen

## 11. Troubleshooting

### Build Fehler

```bash
# Prisma Client neu generieren
npx prisma generate

# Node Modules neu installieren
rm -rf node_modules package-lock.json
npm install

# Cache löschen
rm -rf .next
npm run build
```

### Datenbank Fehler

```bash
# Prisma Studio öffnen (Datenbank GUI)
npx prisma studio

# Migrationen zurücksetzen (VORSICHT: Löscht Daten!)
npx prisma migrate reset

# Neue Migration erstellen
npx prisma migrate dev --name your-migration-name
```

### Encryption Fehler

Wenn "ENCRYPTION_KEY not set" Fehler auftreten:
1. 32-Zeichen Key generieren: `openssl rand -base64 32`
2. In `.env.local` als `ENCRYPTION_KEY` eintragen
3. Server neu starten

## 12. Produktions-Checkliste

Vor dem Launch:

- [ ] Alle ENV Variablen in Vercel gesetzt
- [ ] Datenbank Migrationen ausgeführt
- [ ] Stripe Produkte erstellt und Price IDs korrekt
- [ ] Stripe Webhook auf Production-URL konfiguriert
- [ ] Twilio Phone Number gekauft und Webhook konfiguriert
- [ ] WhatsApp Business API eingerichtet (optional)
- [ ] Domain mit Vercel verbunden
- [ ] SSL Zertifikat aktiv
- [ ] Legal Pages ausgefüllt (Impressum, Datenschutz, AGB)
- [ ] Contact Form Backend getestet
- [ ] Affiliate System getestet
- [ ] Signup → Checkout → Onboarding Flow getestet
- [ ] Dashboard Features getestet
- [ ] Mobile Responsiveness geprüft
- [ ] Lighthouse Audit durchgeführt

## 13. Support & Dokumentation

- **GitHub Repository**: https://github.com/PilarSystems/pilarsystems
- **Vercel Dashboard**: https://vercel.com
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Twilio Console**: https://console.twilio.com
- **Supabase Dashboard**: https://supabase.com/dashboard

## 14. Wichtige Änderungen in diesem Release

### ✨ Neu hinzugefügt

1. **Affiliate System komplett**:
   - Landing Page (`/affiliate`)
   - Signup Flow (`/affiliate/signup`)
   - Partner Dashboard (`/dashboard/affiliate`)
   - Admin Dashboard (`/dashboard/admin/affiliates`)
   - Redirect Route (`/r/[code]`)
   - API Endpoints für Tracking und Stats

2. **Homepage Routing Fix**:
   - Entfernt: `app/page.tsx` (Next.js Default)
   - Jetzt zeigt `/` die Marketing Homepage

3. **Smooth Scroll**:
   - `html { scroll-behavior: smooth; }` in globals.css
   - Alle Anchor-Links scrollen smooth

4. **CTA Replacement**:
   - Alle "Demo buchen" Buttons → "Jetzt starten"
   - 10 Locations aktualisiert (Header, Homepage, Features, About, Pricing, Contact, marketing.ts)

### 🎨 Design

- Konsistent mit PR #7 Dark Theme
- Framer Motion Animationen
- Mobile-responsive
- Apple-Style Design Language

### 🔧 Technisch

- Build passing (0 Errors)
- TypeScript strict mode
- Next.js 16.0.3 mit async params
- Prisma Models aus PR #7 wiederverwendet

## 15. Nächste Schritte

Nach dem Launch:
1. **Marketing starten**: Paid Ads, SEO, Content Marketing
2. **Affiliate Partner akquirieren**: Fitness-Influencer, Gym-Berater
3. **Feedback sammeln**: Von ersten Kunden
4. **Features erweitern**: Basierend auf Feedback
5. **Support aufbauen**: FAQ, Wissensdatenbank, Chat

---

**Version**: 1.0.0 (Revert to PR #7 + Affiliate System)  
**Letztes Update**: November 2025  
**Status**: Production-Ready ✅
