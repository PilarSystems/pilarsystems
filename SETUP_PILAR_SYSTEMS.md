# PILAR SYSTEMS - Complete Setup Guide

**High-End Mode Enabled** 🚀

PILAR SYSTEMS ist eine vollautomatische SaaS-Plattform für Fitnessstudios im DACH-Raum mit Apple-Style Design, Ultra-Animationen und vollständiger Backend-Automatisierung.

This guide will help you set up and deploy PILAR SYSTEMS from scratch. Follow these steps in order.

## Table of Contents

1. [High-End Mode Features](#high-end-mode-features)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Environment Variables](#environment-variables)
5. [Database Setup](#database-setup)
6. [Stripe Configuration](#stripe-configuration)
7. [Twilio Configuration](#twilio-configuration)
8. [WhatsApp Configuration](#whatsapp-configuration)
9. [Email Configuration](#email-configuration)
10. [Calendar Integration](#calendar-integration)
11. [AI Configuration](#ai-configuration)
12. [Deployment](#deployment)
13. [Testing](#testing)
14. [Troubleshooting](#troubleshooting)

---

## High-End Mode Features

PILAR SYSTEMS wurde auf 7-stelliges Qualitätsniveau gebracht:

### Marketing Website (Apple-Style Design)
- **6 Marketing Pages:** Home, Pricing, Features, WhatsApp Coach, Solutions, About
- **Ultra-Animationen:** Framer Motion mit AnimatedGradient, DepthCard, MicroButton, ScrollSection
- **Code-basierte Visuals:** Keine Bilder, alles animierte Komponenten
- **DACH-optimiert:** Vollständig deutsche Texte, conversion-stark
- **SEO-optimiert:** Metadata, OpenGraph, Sitemap, Robots.txt
- **Blog System:** 3 deutsche Blog-Posts mit statischer Generierung

### Motion Primitives Library
- `PageTransition` - Smooth page transitions
- `AnimatedGradient` - Animated gradient backgrounds (radial/conic/linear)
- `DepthCard` - 3D hover effects with depth
- `MicroButton` - Spring animations on hover
- `ScrollSection` - Scroll-triggered animations with stagger
- `NodeFlow` - Animated node graphs
- `TransitionRoot` - Root-level transition wrapper

### Backend Hardening
- **Feature Flag System:** Graceful degradation when ENV vars missing
- **API Protection:** All integration endpoints protected
- **No Crashes:** Returns 200 with informative message when disabled
- **Multi-Tenant Safe:** Per-tenant secrets loading
- **Idempotent Webhooks:** Safe retry handling

### Integrations Protected
- Twilio (Phone AI)
- WhatsApp Business API
- Google Calendar OAuth
- Email Automation
- n8n Workflows
- ElevenLabs Voice AI
- OpenAI GPT-4
- Stripe Payments

### German Content
- All marketing copy in `src/content/marketing.de.ts`
- DACH-focused messaging
- Conversion-optimized
- DSGVO-compliant language

---

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ and npm/yarn installed
- Git installed
- A Supabase account (for database and auth)
- A Stripe account (for payments)
- A Twilio account (for phone and WhatsApp)
- An OpenAI account (for AI features)
- A Vercel account (for deployment)

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/PilarSystems/pilarsystems.git
cd pilarsystems
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create Environment Files

```bash
cp .env.example .env.local
```

---

## Environment Variables

Edit `.env.local` and fill in all required variables. See `.env.example` for the complete list.

### Core Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Database (Supabase)
DATABASE_URL=postgresql://user:password@host:5432/database
DIRECT_URL=postgresql://user:password@host:5432/database

# Auth (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Stripe Variables

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_PRICE_BASIC_MONTHLY=price_...
STRIPE_PRICE_BASIC_SETUP=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_SETUP=price_...
STRIPE_PRICE_WHATSAPP_ADDON=price_...
```

### Twilio Variables

```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_API_KEY=SK...
TWILIO_API_SECRET=...
```

### AI Variables

```env
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
```

---

## Database Setup

### 1. Set Up Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy the connection string and API keys
4. Add them to `.env.local`

### 2. Run Prisma Migrations

```bash
npx prisma migrate deploy
npx prisma generate
```

### 3. Verify Database Connection

```bash
npx prisma studio
```

This will open Prisma Studio at `http://localhost:5555` where you can view your database.

---

## Stripe Configuration

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Create an account
3. Switch to Test Mode (toggle in top right)

### 2. Create Products and Prices

Run the setup script:

```bash
npm run stripe:setup
```

Or create manually in Stripe Dashboard:

**Basic Plan:**
- Product: "PILAR Basic"
- Monthly Price: €100 (10000 cents)
- Setup Fee: €500 (50000 cents)

**Pro Plan:**
- Product: "PILAR Pro"
- Monthly Price: €149 (14900 cents)
- Setup Fee: €1000 (100000 cents)

**WhatsApp Addon:**
- Product: "WhatsApp AI"
- Monthly Price: €20 (2000 cents)

### 3. Set Up Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/stripe/webhooks`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### 4. Test Webhook Locally

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
```

---

## Twilio Configuration

### 1. Create Twilio Account

1. Go to [twilio.com](https://twilio.com)
2. Create an account
3. Verify your phone number

### 2. Get API Credentials

1. Go to Console → Account → API Keys
2. Create a new API Key
3. Copy SID, Key, and Secret to `.env.local`

### 3. Enable Subaccounts (Optional)

For multi-tenant isolation, enable Twilio Subaccounts:

1. Go to Console → Account → Subaccounts
2. Enable subaccount creation via API
3. Each workspace will get its own subaccount

### 4. Buy Phone Numbers

Phone numbers are purchased automatically during onboarding, but you can also buy manually:

1. Go to Console → Phone Numbers → Buy a Number
2. Select country and capabilities (Voice, SMS)
3. Purchase number

---

## WhatsApp Configuration

### 1. Set Up WhatsApp Business API

1. Go to Twilio Console → Messaging → WhatsApp
2. Follow the setup wizard
3. Connect your WhatsApp Business Account
4. Get approval from Meta (can take 1-2 weeks)

### 2. Configure Webhook

1. Set webhook URL: `https://your-domain.com/api/webhooks/whatsapp`
2. Enable message events

### 3. Test WhatsApp

Send a test message to your WhatsApp number to verify the webhook is working.

---

## Email Configuration

### 1. Set Up Email Provider

Choose one:

**Option A: SendGrid**
```env
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@pilarsystems.com
```

**Option B: Resend**
```env
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@pilarsystems.com
```

### 2. Verify Domain

1. Add DNS records to verify your domain
2. Set up SPF, DKIM, and DMARC records
3. Test email sending

---

## Calendar Integration

### 1. Set Up Google Cloud Project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project
3. Enable Google Calendar API

### 2. Create OAuth Credentials

1. Go to APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

---

## AI Configuration

### 1. OpenAI Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Add to `.env.local`:

```env
OPENAI_API_KEY=sk-...
```

### 2. ElevenLabs Setup (Optional)

For voice AI features:

1. Go to [elevenlabs.io](https://elevenlabs.io)
2. Create API key
3. Add to `.env.local`:

```env
ELEVENLABS_API_KEY=...
```

---

## Deployment

### 1. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### 2. Configure Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

### 3. Set Up Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `pilarsystems.com`)
3. Configure DNS records as shown

### 4. Update Webhook URLs

After deployment, update all webhook URLs to use your production domain:

- Stripe webhook: `https://pilarsystems.com/api/stripe/webhooks`
- Twilio webhook: `https://pilarsystems.com/api/webhooks/twilio`
- WhatsApp webhook: `https://pilarsystems.com/api/webhooks/whatsapp`

---

## Testing

### 1. Run Local Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### 2. Test Complete Flow

Follow the test plan in `TEST_PLAN.md`:

1. **Sign Up Flow**
   - Go to `/signup`
   - Create account
   - Verify email
   - Complete Stripe checkout
   - Verify subscription created

2. **Onboarding Flow**
   - Complete all 5 onboarding steps
   - Connect phone number
   - Connect WhatsApp
   - Set up calendar
   - Configure AI rules
   - Go live

3. **Dashboard Features**
   - Test phone AI
   - Test WhatsApp AI
   - Test email automation
   - Test lead management
   - Test calendar sync
   - Test analytics

### 3. Test Webhooks

```bash
# Test Stripe webhook
stripe trigger checkout.session.completed

# Test Twilio webhook (send SMS to your number)

# Test WhatsApp webhook (send WhatsApp message)
```

---

## Troubleshooting

### Build Errors

**Error: Prisma Client not generated**
```bash
npx prisma generate
```

**Error: Database connection failed**
- Check `DATABASE_URL` is correct
- Ensure database is accessible
- Check firewall rules

### Stripe Issues

**Error: Webhook signature verification failed**
- Ensure `STRIPE_WEBHOOK_SECRET` is correct
- Check webhook is configured in Stripe Dashboard
- Verify endpoint URL is correct

### Twilio Issues

**Error: Phone number purchase failed**
- Check Twilio account balance
- Verify API credentials
- Ensure phone number is available in your region

### WhatsApp Issues

**Error: WhatsApp not connected**
- Verify WhatsApp Business Account is approved
- Check webhook URL is correct
- Ensure message templates are approved

### Deployment Issues

**Error: Build failed on Vercel**
- Check all environment variables are set
- Verify `DATABASE_URL` is accessible from Vercel
- Check build logs for specific errors

---

## Support

For additional help:

- Documentation: [docs.pilarsystems.com](https://docs.pilarsystems.com)
- Email: support@pilarsystems.com
- GitHub Issues: [github.com/PilarSystems/pilarsystems/issues](https://github.com/PilarSystems/pilarsystems/issues)

---

## Next Steps

After setup is complete:

1. Review `LAUNCH_CHECKLIST.md` for pre-launch tasks
2. Review `TEST_PLAN.md` for comprehensive testing
3. Configure monitoring and alerts
4. Set up backup strategy
5. Plan marketing and customer acquisition

---

**Last Updated:** November 2025
**Version:** 2.0.0 (High-End Mode)

---

## High-End Mode Implementation Details

### Phase 1: Motion Primitives + German Copy ✅
- Created 7 reusable motion components
- Centralized German copy in `src/content/marketing.de.ts`
- Added page transitions with TransitionRoot

### Phase 2: Ultra-Animations for All 6 Pages ✅
- Upgraded HomePage (430 lines)
- Upgraded PricingPage (370 lines)
- Upgraded FeaturesPage (378 lines)
- Upgraded CoachPage (388 lines)
- Upgraded SolutionsPage (365 lines)
- Upgraded AboutPage (411 lines)
- Upgraded BlogPage (334 lines)
- Total: 2,676 lines with ultra-animations

### Phase 3: Backend Hardening ✅
- Created `lib/features.ts` feature flag system
- Protected 6 API routes with graceful degradation
- No crashes when ENV vars missing
- Returns 200 with informative messages

### Phase 5: Blog + SEO ✅
- Created blog template with static generation
- 3 German blog posts:
  - "Die KI-Revolution im Fitness-Business" (8 Min)
  - "5 Wege, deine Lead-Conversion um 40% zu steigern" (6 Min)
  - "WhatsApp Business für Fitnessstudios: Der komplette Guide" (12 Min)
- SEO metadata with OpenGraph tags
- German content optimized for DACH market

### Launch Readiness
- ✅ Build passing (0 errors)
- ✅ All pages functional
- ✅ All integrations protected
- ✅ German copy throughout
- ✅ SEO optimized
- ✅ Blog system ready
- ✅ Documentation complete

**Ready for production deployment!**
