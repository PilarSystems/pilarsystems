# PILAR SYSTEMS - AI-Powered Fitness Studio SaaS Platform

A fully production-ready, automated multichannel AI SaaS platform for fitness studios.

## Features

### Core Platform
- **Complete Authentication System** - Supabase Auth with email/password, magic link, password reset, and email verification
- **Stripe Billing Integration** - Full subscription management with setup fees and add-ons
- **7-Step Onboarding Wizard** - Guided setup for studio information, integrations, and AI rules
- **Comprehensive Dashboard** - KPIs, charts, activity timeline, and analytics

### AI Automation
- **WhatsApp AI** - Automated responses, lead qualification, and follow-up sequences
- **Phone AI** - Missed call handling, voicemail transcription, and AI summaries
- **Email AI** - Inbox classification, auto-replies, and lead conversion
- **Lead Engine** - Automatic A/B/C classification and prioritization
- **Follow-up Engine** - Multichannel automated sequences

### Modules
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

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Payment**: Stripe
- **AI**: OpenAI GPT-4
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
cp .env.example .env
```

Edit `.env` and fill in all required values.

4. Set up the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Create Stripe products:
```bash
npx ts-node scripts/create-stripe-products.ts
```

Add the returned price IDs to your `.env` file.

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for all required environment variables. Key variables include:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `OPENAI_API_KEY` - OpenAI API key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `WHATSAPP_API_TOKEN` - WhatsApp Business API token
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `ENCRYPTION_KEY` - 64-character hex key for encrypting integration credentials

## Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe Dashboard
3. Run the product creation script:
```bash
npx ts-node scripts/create-stripe-products.ts
```
4. Configure webhook endpoint in Stripe Dashboard:
   - URL: `https://your-domain.com/api/stripe/webhooks`
   - Events: `checkout.session.completed`, `customer.subscription.*`, `invoice.payment_*`

## n8n Automation Setup

1. Set up an n8n instance (self-hosted or cloud)
2. Import the workflow JSON files from `n8n-workflows/`
3. Configure webhook URLs in your n8n workflows
4. Set the `N8N_WEBHOOK_URL` environment variable

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

The `vercel.json` file is already configured for production deployment.

### Post-Deployment

1. Configure Stripe webhooks to point to your production URL
2. Set up WhatsApp webhook URL in Meta Business Manager
3. Configure Twilio webhook URLs for incoming calls
4. Test all integrations

## Project Structure

```
pilarsystems/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Dashboard pages
│   ├── onboarding/        # Onboarding wizard
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── auth/             # Auth components
│   ├── dashboard/        # Dashboard components
│   └── ...
├── lib/                   # Utility libraries
├── services/              # Business logic services
│   ├── ai/               # AI automation services
│   ├── integrations/     # Integration services
│   └── stripe/           # Stripe services
├── types/                 # TypeScript type definitions
├── prisma/               # Prisma schema and migrations
├── scripts/              # Utility scripts
├── n8n-workflows/        # n8n workflow exports
└── public/               # Static assets
```

## API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Leads
- `GET /api/leads` - List leads
- `POST /api/leads` - Create lead
- `GET /api/leads/[id]` - Get lead details
- `PATCH /api/leads/[id]` - Update lead

### Messages
- `GET /api/messages` - List messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations/[leadId]` - Get conversation

### Webhooks
- `POST /api/stripe/webhooks` - Stripe webhook handler
- `POST /api/webhooks/whatsapp` - WhatsApp webhook handler
- `POST /api/webhooks/twilio` - Twilio webhook handler

## Security

- All integration credentials are encrypted at rest
- Rate limiting on all API endpoints
- CORS restrictions
- Input validation with Zod
- Supabase Auth for authentication
- Stripe for secure payment processing

## Support

For issues and questions, please open an issue on GitHub or contact support@pilarsystems.com

## License

Proprietary - All rights reserved

## Contributing

This is a private project. Contributions are by invitation only.

---

Built with ❤️ by PILAR SYSTEMS
