# PILAR SYSTEMS - Production Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

- [ ] GitHub repository with all code pushed to main
- [ ] Vercel account
- [ ] PostgreSQL database (Supabase, Neon, or Railway recommended)
- [ ] Stripe account with products created
- [ ] Supabase project for authentication
- [ ] OpenAI API key
- [ ] Twilio account with phone number
- [ ] WhatsApp Business API access
- [ ] Google Cloud project with Calendar API enabled
- [ ] Email account with IMAP/SMTP access
- [ ] n8n instance (optional but recommended)

## Environment Variables

### Required for Production

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_BASIC_SETUP_FEE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PRO_SETUP_FEE_ID=price_...
STRIPE_WHATSAPP_ADDON_PRICE_ID=price_...

# OpenAI
OPENAI_API_KEY=sk-...

# Twilio (Phone)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# WhatsApp Cloud API
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_VERIFY_TOKEN=your-secure-token

# Google Calendar OAuth
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/callback/google

# Email (IMAP/SMTP)
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-app-password
EMAIL_IMAP_HOST=imap.gmail.com
EMAIL_IMAP_PORT=993
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false

# n8n Automation
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
N8N_API_KEY=your-n8n-api-key

# Security
ENCRYPTION_KEY=your-64-character-hex-encryption-key
RATE_LIMIT_REDIS_URL=https://your-upstash-redis.upstash.io
RATE_LIMIT_REDIS_TOKEN=your-upstash-redis-token

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
LOG_LEVEL=info
```

## Deployment Steps

### 1. Database Setup

**Option A: Supabase (Recommended)**
```bash
# Create project at supabase.com
# Copy DATABASE_URL from project settings
# Run migrations
npx prisma migrate deploy
```

**Option B: Neon or Railway**
```bash
# Create PostgreSQL database
# Copy connection string
# Run migrations
npx prisma migrate deploy
```

### 2. Stripe Setup

```bash
# 1. Create Stripe account at stripe.com
# 2. Get API keys from Dashboard
# 3. Create products and prices
npm run stripe:setup

# 4. Configure webhook endpoint
# URL: https://your-domain.com/api/stripe/webhooks
# Events: checkout.session.completed, invoice.payment_succeeded, customer.subscription.*
```

### 3. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Or connect via Vercel Dashboard:
# 1. Import GitHub repository
# 2. Configure environment variables
# 3. Deploy
```

### 4. Configure Environment Variables in Vercel

Go to Vercel Dashboard → Project Settings → Environment Variables and add all variables from the list above.

### 5. Post-Deployment Configuration

**Stripe Webhooks:**
- Add production webhook endpoint in Stripe Dashboard
- URL: `https://your-domain.com/api/stripe/webhooks`
- Copy webhook secret to Vercel environment variables

**WhatsApp Webhooks:**
- Configure webhook URL in WhatsApp Business API
- URL: `https://your-domain.com/api/webhooks/whatsapp`
- Verify token: Use the same value as `WHATSAPP_VERIFY_TOKEN`

**Twilio Webhooks:**
- Configure incoming call webhook
- URL: `https://your-domain.com/api/webhooks/twilio`

**Google OAuth:**
- Add authorized redirect URI
- URI: `https://your-domain.com/api/auth/callback/google`

**n8n Workflows:**
- Import workflows from `n8n-workflows/` directory
- Update webhook URLs to point to your production domain
- Configure n8n to send webhooks to your API routes

### 6. Verify Deployment

Test the complete flow:
1. Visit your production URL
2. Sign up for an account
3. Complete Stripe checkout
4. Complete onboarding wizard
5. Access dashboard
6. Test AI features (WhatsApp, Email, Phone)
7. Verify calendar integration
8. Check analytics

## Multi-Tenant Architecture

The platform is designed for multi-tenant operation:

### Data Isolation
- Each studio has a separate `Workspace` record
- All data is scoped to `workspaceId`
- Database queries automatically filter by workspace

### Integration Isolation
- Each workspace has separate integration credentials
- Phone numbers are workspace-specific
- WhatsApp senders are workspace-specific
- Email accounts are workspace-specific
- Calendar connections are workspace-specific

### Subscription Isolation
- Each workspace has its own Stripe subscription
- Billing is handled per workspace
- Usage tracking is per workspace

### API Key Isolation
- All API keys are encrypted per workspace
- Keys are stored in the `Integration` table
- Automatic decryption when needed

## Security Checklist

- [ ] All environment variables configured in Vercel
- [ ] Stripe webhook secret configured
- [ ] Database connection uses SSL
- [ ] All API keys are encrypted
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] Authentication is required for all protected routes
- [ ] Input validation is enabled on all forms
- [ ] Error messages don't expose sensitive information

## Monitoring

Set up monitoring for:
- Application errors (Vercel logs)
- Database performance (Supabase/Neon dashboard)
- API usage (Stripe, OpenAI, Twilio dashboards)
- Webhook delivery (Stripe, WhatsApp, Twilio)
- User signups and conversions

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all environment variables are set
- Ensure DATABASE_URL is accessible from Vercel

### Webhooks Not Working
- Verify webhook URLs are correct
- Check webhook secrets match
- Review webhook delivery logs in provider dashboards

### Authentication Issues
- Verify Supabase URL and keys
- Check redirect URIs are configured
- Ensure cookies are enabled

### Integration Failures
- Verify API keys are correct
- Check rate limits haven't been exceeded
- Review integration-specific logs

## Support

For deployment issues:
- Email: ytraide@gmail.com
- GitHub: @PilarSystems

---

**Production Checklist:**
- [ ] Code pushed to GitHub main
- [ ] Database created and migrated
- [ ] Stripe products created
- [ ] All environment variables configured
- [ ] Vercel deployment successful
- [ ] Webhooks configured
- [ ] OAuth redirect URIs configured
- [ ] Full flow tested
- [ ] Monitoring enabled
- [ ] Ready for customers ✅
