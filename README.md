# PILAR SYSTEMS - AI-Powered Fitness Studio SaaS Platform

A fully production-ready, automated multichannel AI SaaS platform for fitness studios, built on top of a modern Next.js marketing site template.

## Overview

This repository contains two integrated applications:

1. **Marketing Site** (`src/` directory) - Modern Next.js 15 template with 20+ homepage variations
2. **SaaS Platform** (`app/` directory) - Complete AI-powered fitness studio management system

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

## Marketing Site Features

- **20+ Homepage Variations** - Different layouts and styles for various business needs
- **50+ Inner Pages** - Authentication, pricing, blog, about, services, contact, and more
- **500+ Components** - Reusable React components with modern design
- **Dark/Light Mode** - Seamless theme switching with next-themes
- **Smooth Animations** - GSAP and Lenis for premium interactions
- **Responsive Design** - Mobile-first approach with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Payment**: Stripe
- **AI**: OpenAI GPT-4 and GPT-4o-mini
- **Animations**: GSAP 3.13, Lenis smooth scrolling
- **Maps**: Leaflet with React integration
- **Deployment**: Vercel

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

## Vercel Deployment Configuration

**IMPORTANT**: When deploying to Vercel, configure environment variables directly in the Vercel dashboard (Project Settings → Environment Variables), not as secret references. The `DATABASE_URL` and other sensitive variables should be added as plain environment variables, not as references to Vercel secrets.

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
