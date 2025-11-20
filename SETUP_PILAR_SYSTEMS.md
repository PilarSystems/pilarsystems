# PILAR SYSTEMS - Complete Setup Guide

This guide will help you set up and deploy PILAR SYSTEMS from scratch. Follow these steps in order.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Variables](#environment-variables)
4. [Database Setup](#database-setup)
5. [Stripe Configuration](#stripe-configuration)
6. [Twilio Configuration](#twilio-configuration)
7. [WhatsApp Configuration](#whatsapp-configuration)
8. [Email Configuration](#email-configuration)
9. [Calendar Integration](#calendar-integration)
10. [AI Configuration](#ai-configuration)
11. [Deployment](#deployment)
12. [Testing](#testing)
13. [Troubleshooting](#troubleshooting)

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
**Version:** 1.0.0
