# PILAR SYSTEMS - AI-Powered Fitness Studio SaaS Platform

**High-End Mode Enabled** 🚀

Eine vollautomatische SaaS-Plattform für Fitnessstudios im DACH-Raum mit Apple-Style Design, Ultra-Animationen und vollständiger Backend-Automatisierung.

A fully production-ready, automated multichannel AI SaaS platform for fitness studios in the DACH region (Germany, Austria, Switzerland), featuring Apple-style design, ultra-animations, and complete backend automation.

## 🚀 Schnellstart (Quick Start)

Get the platform running locally in 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/PilarSystems/pilarsystems.git
cd pilarsystems

# 2. Install dependencies
yarn install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and fill in all required values (see ENV_SETUP.md for details)

# 4. Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# 5. Create Stripe products (optional for local testing)
npx ts-node scripts/create-stripe-products.ts
# Copy the returned Price IDs to your .env.local

# 6. Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the marketing site.  
Navigate to [http://localhost:3000/signup](http://localhost:3000/signup) to test the SaaS platform.

**📖 For detailed setup instructions, see [ENV_SETUP.md](./ENV_SETUP.md)**

---

## Overview

This repository contains a fully integrated, production-ready platform:

1. **Marketing Website** - Apple-style design with ultra-animations, 6 pages, German content, SEO-optimized
2. **SaaS Platform** - Complete AI-powered fitness studio management system with full automation
3. **Blog System** - 3 German blog posts with static generation
4. **Backend Hardening** - Feature flags, graceful degradation, multi-tenant security

## SaaS Platform Features

### Core Platform
- **Complete Authentication System** - Supabase Auth with email/password, magic link, password reset, and email verification
- **Stripe Billing Integration** - Full subscription management with setup fees (BASIC €100/mo + €500 setup, PRO €149/mo + €1000 setup, WhatsApp addon €20/mo)
- **7-Step Onboarding Wizard** - Guided setup for studio information, integrations, and AI rules
- **Comprehensive Dashboard** - KPIs, charts, activity timeline, and analytics

### AI Automation
- **WhatsApp AI** - Automated responses, lead qualification, and follow-up sequences
- **Phone AI** - Missed call handling, voicemail transcription, and AI summaries
- **Email AI** - Inbox classification, auto-replies, and lead conversion
- **Lead Engine** - Automatic A/B/C classification and prioritization
- **Follow-up Engine** - Multichannel automated sequences

### Dashboard Modules
- **Leads Management** - Unified inbox, detail pages, A/B/C classification
- **Messages** - WhatsApp and Email unified chat with AI auto-replies
- **Phone AI** - Call logs, transcripts, and AI-generated summaries
- **Calendar** - Event management with Google Calendar integration
- **Growth Analytics** - Conversion tracking, KPIs, and custom filters
- **Settings** - Studio info, team invites, AI rules, and billing portal

### Integrations
- WhatsApp Cloud API
- Twilio (Phone & SMS)
- Google Calendar OAuth
- Email IMAP/SMTP
- n8n Automation Workflows

## High-End Mode Features

### Marketing Website (Apple-Style Design)
- **6 Marketing Pages** - Home, Pricing, Features, WhatsApp Coach, Solutions, About
- **Ultra-Animationen** - Framer Motion with AnimatedGradient, DepthCard, MicroButton, ScrollSection
- **Code-Based Visuals** - No images, all animated components (NodeFlow, AnimatedGradient, etc.)
- **DACH-Optimized** - Complete German content, conversion-strong copy
- **SEO-Optimized** - Metadata, OpenGraph, Sitemap, Robots.txt
- **Blog System** - 3 German blog posts with static generation
- **Dark/Light Mode** - Seamless theme switching with next-themes
- **Responsive Design** - Mobile-first approach with Tailwind CSS

### Motion Primitives Library
- `PageTransition` - Smooth page transitions
- `AnimatedGradient` - Animated gradient backgrounds (radial/conic/linear)
- `DepthCard` - 3D hover effects with depth
- `MicroButton` - Spring animations on hover
- `ScrollSection` - Scroll-triggered animations with stagger
- `NodeFlow` - Animated node graphs
- `TransitionRoot` - Root-level transition wrapper

### Backend Hardening
- **Feature Flag System** - Graceful degradation when ENV vars missing
- **API Protection** - All integration endpoints protected
- **No Crashes** - Returns 200 with informative message when disabled
- **Multi-Tenant Safe** - Per-tenant secrets loading
- **Idempotent Webhooks** - Safe retry handling

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Animations**: Framer Motion 12.23.24 (ultra-animations)
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Payment**: Stripe (BASIC €100/mo + €500 setup, PRO €149/mo + €1000 setup)
- **AI**: OpenAI GPT-4, ElevenLabs Voice AI
- **Integrations**: Twilio, WhatsApp Business API, Google Calendar, n8n
- **Deployment**: Vercel
- **Theme**: next-themes 0.4.6 (dark/light mode)

## Database Schema

The platform includes 12 comprehensive database tables:
- users, workspaces, subscriptions
- wizard_progress, integrations
- leads, messages, call_logs
- followups, calendar_events
- ai_rules, activity_logs, tasks

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Supabase account)
- Stripe account
- OpenAI API key
- Twilio account (for phone integration)
- WhatsApp Business API access
- Google Cloud project (for Calendar API)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/PilarSystems/pilarsystems.git
cd pilarsystems
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in all required values (see `.env.example` for all 40+ required variables).

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Create Stripe products:
```bash
npx ts-node scripts/create-stripe-products.ts
```

Add the returned price IDs to your `.env.local` file.

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for all required environment variables. Key variables include:

### Database & Auth
- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

### Payment
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key

### AI & Integrations
- `OPENAI_API_KEY` - OpenAI API key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `WHATSAPP_API_TOKEN` - WhatsApp Business API token
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Security
- `ENCRYPTION_KEY` - 64-character hex key for encrypting integration credentials
- `NEXTAUTH_SECRET` - NextAuth secret for session encryption

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Click **Import**

3. **Configure Environment Variables:**
   - Go to **Settings** → **Environment Variables**
   - Add ALL variables from `.env.local` (see [ENV_SETUP.md](./ENV_SETUP.md) for complete list)
   - **IMPORTANT**: Add variables as plain environment variables, NOT as secret references
   - Select environments: **Production**, **Preview**, **Development**

4. **Deploy:**
   - Click **Deploy**
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

5. **Configure Webhooks:**
   - Update webhook URLs in Stripe, Twilio, and WhatsApp to use your production domain
   - See [ENV_SETUP.md](./ENV_SETUP.md#webhook-configuration) for detailed instructions

6. **Custom Domain (Optional):**
   - Go to **Settings** → **Domains**
   - Add your custom domain
   - Update `NEXT_PUBLIC_APP_URL` environment variable

### Production Checklist

Before going live, ensure:

- [ ] All environment variables are set in Vercel
- [ ] Database migrations have been run
- [ ] Stripe products have been created
- [ ] Stripe webhooks are configured
- [ ] Twilio webhooks are configured (if using Phone AI)
- [ ] WhatsApp webhooks are configured (if using WhatsApp AI)
- [ ] Google Calendar OAuth is configured (if using Calendar sync)
- [ ] Custom domain is connected (optional)
- [ ] SSL certificate is active
- [ ] Test signup → checkout → onboarding → dashboard flow

**📖 For detailed deployment instructions, see [ENV_SETUP.md](./ENV_SETUP.md#production-setup-vercel)**

## Project Structure

```
pilarsystems/
├── src/                       # Marketing site (Next.js 15 template)
│   ├── app/                  # Marketing pages and routes
│   ├── components/           # Marketing site components
│   ├── data/                 # Static content (blogs, services, team)
│   └── utils/                # Marketing site utilities
├── app/                       # SaaS Platform (Next.js App Router)
│   ├── (auth)/               # Authentication pages
│   ├── dashboard/            # Dashboard pages
│   ├── onboarding/           # Onboarding wizard
│   ├── checkout/             # Stripe checkout page
│   └── api/                  # API routes
├── components/               # SaaS platform components
├── lib/                      # Utility libraries
├── services/                 # Business logic services
├── types/                    # TypeScript type definitions
├── prisma/                   # Prisma schema and migrations
├── scripts/                  # Utility scripts
├── n8n-workflows/            # n8n workflow exports
└── public/                   # Static assets
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma generate  # Generate Prisma client
npx prisma migrate dev  # Run migrations
npx prisma studio    # Open Prisma Studio

# Stripe
npm run stripe:setup # Create Stripe products

# Code Quality
npm run lint         # Run ESLint
```

## Support

For issues and questions:
- **SaaS Platform**: support@pilarsystems.com
- **Marketing Template**: hello@pixel71.com

## License

Proprietary - All rights reserved

---

**Link to Devin run**: https://app.devin.ai/sessions/231e7cbe34d34249a7244e67ec0eb2a9  
**Requested by**: Freddi Lörcher (ytraide@gmail.com) / @PilarSystems

Built with ❤️ by PILAR SYSTEMS
