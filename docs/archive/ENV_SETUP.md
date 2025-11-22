# Environment Variables Setup Guide

This guide provides detailed instructions for setting up all environment variables required for PILAR SYSTEMS in both development and production environments.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Development Setup](#development-setup)
3. [Production Setup (Vercel)](#production-setup-vercel)
4. [Variable Reference](#variable-reference)
5. [Webhook Configuration](#webhook-configuration)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

For local development:

```bash
# 1. Copy the example file
cp .env.example .env.local

# 2. Fill in all values (see sections below)
# Edit .env.local with your favorite editor

# 3. Generate Prisma client
npx prisma generate

# 4. Run database migrations
npx prisma migrate dev

# 5. Create Stripe products
npx ts-node scripts/create-stripe-products.ts

# 6. Start development server
yarn dev
```

---

## Development Setup

### 1. Database (PostgreSQL)

**Required for:** Development & Production

```env
DATABASE_URL=postgresql://user:password@localhost:5432/pilarsystems
```

**How to get:**
- **Local:** Install PostgreSQL and create a database named `pilarsystems`
- **Vercel:** Go to Vercel Dashboard → Storage → Create → Postgres → Copy connection string

**Used in:** `development`, `production`

---

### 2. Supabase Auth

**Required for:** Development & Production

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**How to get:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project (or select existing)
3. Go to **Project Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

**Used in:** `development`, `production`

**Note:** The `NEXT_PUBLIC_*` variables are safe for client-side. The `service_role` key must NEVER be exposed to the client.

---

### 3. Stripe Billing

**Required for:** Development & Production

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_BASIC_PRICE_ID=price_basic_monthly
STRIPE_BASIC_SETUP_FEE_ID=price_basic_setup
STRIPE_PRO_PRICE_ID=price_pro_monthly
STRIPE_PRO_SETUP_FEE_ID=price_pro_setup
STRIPE_WHATSAPP_ADDON_PRICE_ID=price_whatsapp_addon
```

**How to get:**

1. **API Keys:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com)
   - Navigate to **Developers** → **API Keys**
   - Copy **Secret key** (use test key `sk_test_...` for development)
   - Copy **Publishable key** (use test key `pk_test_...` for development)

2. **Webhook Secret:**
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - Set URL to: `https://your-domain.com/api/stripe/webhooks`
   - Select events:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Click **Add endpoint**
   - Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

3. **Price IDs:**
   - Run the setup script: `npx ts-node scripts/create-stripe-products.ts`
   - The script will create all products and prices in Stripe
   - Copy the Price IDs from the output into your `.env.local`

**Used in:** `development`, `production`

**Note:** Use test keys (`sk_test_...`, `pk_test_...`) for development and live keys (`sk_live_...`, `pk_live_...`) for production.

---

### 4. OpenAI (AI Automation)

**Required for:** Development & Production

```env
OPENAI_API_KEY=sk-your-openai-api-key
```

**How to get:**
1. Go to [OpenAI Platform](https://platform.openai.com)
2. Navigate to **API Keys**
3. Click **Create new secret key**
4. Copy the key → `OPENAI_API_KEY`

**Used in:** `development`, `production`

**Used for:** WhatsApp AI, Phone AI, Email AI, Lead classification, Follow-up automation

---

### 5. Twilio (Phone AI)

**Required for:** Production (Optional for Development)

```env
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

**How to get:**
1. Go to [Twilio Console](https://console.twilio.com)
2. From the dashboard, copy:
   - **Account SID** → `TWILIO_ACCOUNT_SID`
   - **Auth Token** → `TWILIO_AUTH_TOKEN`
3. Navigate to **Phone Numbers** → **Manage** → **Active numbers**
4. Purchase a phone number if you don't have one
5. Copy the phone number in E.164 format (e.g., `+1234567890`) → `TWILIO_PHONE_NUMBER`
6. Configure the webhook:
   - Click on your phone number
   - Under **Voice & Fax**, set **A CALL COMES IN** to: `https://your-domain.com/api/webhooks/twilio`
   - Under **Messaging**, set **A MESSAGE COMES IN** to: `https://your-domain.com/api/webhooks/twilio`
   - Click **Save**

**Used in:** `production` (optional for `development`)

---

### 6. WhatsApp Cloud API

**Required for:** Production (Optional for Development)

```env
WHATSAPP_API_TOKEN=your-whatsapp-api-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-number-id
WHATSAPP_VERIFY_TOKEN=your-custom-verify-token
```

**How to get:**
1. Go to [Meta for Developers](https://developers.facebook.com)
2. Create an app or select existing app
3. Add **WhatsApp** product
4. Navigate to **WhatsApp** → **API Setup**
5. Copy:
   - **Temporary access token** → `WHATSAPP_API_TOKEN` (for testing)
   - **Phone number ID** → `WHATSAPP_PHONE_NUMBER_ID`
6. For production, create a permanent token:
   - Go to **System Users** → Create system user
   - Generate token with `whatsapp_business_messaging` permission
7. Create a custom verify token (any random string) → `WHATSAPP_VERIFY_TOKEN`
8. Configure webhook:
   - Go to **WhatsApp** → **Configuration**
   - Click **Edit** next to Webhook
   - Set **Callback URL** to: `https://your-domain.com/api/webhooks/whatsapp`
   - Set **Verify token** to the same value as `WHATSAPP_VERIFY_TOKEN`
   - Subscribe to `messages` events
   - Click **Verify and save**

**Used in:** `production` (optional for `development`)

---

### 7. Google Calendar OAuth

**Required for:** Production (Optional for Development)

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/google/callback
```

**How to get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure OAuth consent screen if prompted
6. Select **Application type**: Web application
7. Add **Authorized redirect URIs**:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://your-domain.com/api/auth/google/callback`
8. Click **Create**
9. Copy:
   - **Client ID** → `GOOGLE_CLIENT_ID`
   - **Client secret** → `GOOGLE_CLIENT_SECRET`
10. Set `GOOGLE_REDIRECT_URI` to match your authorized redirect URI

**Used in:** `production` (optional for `development`)

---

### 8. Email (IMAP/SMTP)

**Required for:** Production (Optional for Development)

```env
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-email-password
EMAIL_IMAP_HOST=imap.gmail.com
EMAIL_IMAP_PORT=993
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
```

**How to get (Gmail example):**
1. Go to [Google Account](https://myaccount.google.com)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Click **App passwords**
5. Select **Mail** and **Other (Custom name)**
6. Enter "PILAR SYSTEMS" and click **Generate**
7. Copy the 16-character password → `EMAIL_PASSWORD`
8. Set:
   - `EMAIL_USER` to your Gmail address
   - `EMAIL_IMAP_HOST` to `imap.gmail.com`
   - `EMAIL_IMAP_PORT` to `993`
   - `EMAIL_SMTP_HOST` to `smtp.gmail.com`
   - `EMAIL_SMTP_PORT` to `587`
   - `EMAIL_SMTP_SECURE` to `false`

**For Outlook/Office 365:**
- `EMAIL_IMAP_HOST`: `outlook.office365.com`
- `EMAIL_SMTP_HOST`: `smtp.office365.com`

**Used in:** `production` (optional for `development`)

---

### 9. ElevenLabs (Voice AI)

**Required for:** Production (Optional for Development)

```env
ELEVENLABS_API_KEY=your-elevenlabs-api-key
```

**How to get:**
1. Go to [ElevenLabs](https://elevenlabs.io)
2. Sign up or log in to your account
3. Navigate to **Profile** → **API Keys**
4. Click **Generate API Key** or copy existing key
5. Copy the API key → `ELEVENLABS_API_KEY`

**Used in:** `production` (optional for `development`)

**Used for:** 
- Voice selection in onboarding wizard (Step 3)
- Voice preview playback in settings
- Text-to-speech for phone AI and WhatsApp voice messages
- AI assistant voice personality customization

**Note:** The free tier includes 10,000 characters/month. For production use, consider upgrading to a paid plan.

---

### 10. n8n Workflow Automation

**Required for:** Production (Optional for Development)

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
```

**How to get:**
1. Deploy n8n instance (self-hosted or n8n.cloud)
2. Create a workflow with a Webhook node
3. Copy the **Production URL** from the Webhook node → `N8N_WEBHOOK_URL`

**Used in:** `production` (optional for `development`)

**Note:** n8n workflows are provided in the `n8n/` directory. Import them into your n8n instance.

---

### 11. Security & Encryption

**Required for:** Development & Production

```env
ENCRYPTION_KEY=your-64-character-hex-encryption-key
NEXTAUTH_SECRET=your-nextauth-secret
```

**How to generate:**

```bash
# Generate ENCRYPTION_KEY (64-character hex)
openssl rand -hex 32

# Generate NEXTAUTH_SECRET (base64)
openssl rand -base64 32
```

**Used in:** `development`, `production`

**Used for:**
- `ENCRYPTION_KEY`: Encrypting API keys, tokens, and sensitive user data in database
- `NEXTAUTH_SECRET`: Session token encryption and CSRF protection

---

### 12. Rate Limiting (Optional)

**Required for:** Production (Recommended)

```env
RATE_LIMIT_REDIS_URL=https://your-upstash-redis.upstash.io
RATE_LIMIT_REDIS_TOKEN=your-upstash-redis-token
```

**How to get:**
1. Go to [Upstash Console](https://console.upstash.com)
2. Create a new Redis database
3. Navigate to **REST API** tab
4. Copy:
   - **UPSTASH_REDIS_REST_URL** → `RATE_LIMIT_REDIS_URL`
   - **UPSTASH_REDIS_REST_TOKEN** → `RATE_LIMIT_REDIS_TOKEN`

**Used in:** `production` (optional for `development`)

**Note:** If not set, rate limiting will be disabled (not recommended for production).

---

### 13. Application Settings

**Required for:** Development & Production

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
LOG_LEVEL=info
```

**Configuration:**
- **Development:**
  - `NEXT_PUBLIC_APP_URL`: `http://localhost:3000`
  - `NODE_ENV`: `development`
  - `LOG_LEVEL`: `debug`

- **Production:**
  - `NEXT_PUBLIC_APP_URL`: `https://your-domain.com`
  - `NODE_ENV`: `production`
  - `LOG_LEVEL`: `info`

**Used in:** `development`, `production`

---

## Production Setup (Vercel)

### Step-by-Step Guide

1. **Push your code to GitHub:**
   ```bash
   git push origin main
   ```

2. **Import project to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **Add New** → **Project**
   - Import your GitHub repository
   - Click **Import**

3. **Configure Environment Variables:**
   - In the project settings, go to **Settings** → **Environment Variables**
   - Add ALL variables from your `.env.local` file
   - For each variable:
     - Click **Add**
     - Enter **Key** (e.g., `DATABASE_URL`)
     - Enter **Value** (the actual value)
     - Select environments: **Production**, **Preview**, **Development**
     - Click **Save**

4. **Required Variables for Production:**
   ```
   DATABASE_URL
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   STRIPE_SECRET_KEY
   STRIPE_PUBLISHABLE_KEY
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
   N8N_WEBHOOK_URL
   ENCRYPTION_KEY
   NEXTAUTH_SECRET
   RATE_LIMIT_REDIS_URL
   RATE_LIMIT_REDIS_TOKEN
   NEXT_PUBLIC_APP_URL
   NODE_ENV=production
   LOG_LEVEL=info
   ```

5. **Deploy:**
   - Click **Deploy**
   - Wait for deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

6. **Configure Custom Domain (Optional):**
   - Go to **Settings** → **Domains**
   - Add your custom domain
   - Follow DNS configuration instructions
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain
   - Update all webhook URLs in Stripe, Twilio, WhatsApp to use your custom domain

---

## Variable Reference

### By Environment

| Variable | Development | Production | Notes |
|----------|-------------|------------|-------|
| `DATABASE_URL` | Required | Required | Use local DB for dev, Vercel Postgres for prod |
| `NEXT_PUBLIC_SUPABASE_URL` | Required | Required | Same for both |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required | Required | Same for both |
| `SUPABASE_SERVICE_ROLE_KEY` | Required | Required | Same for both |
| `STRIPE_SECRET_KEY` | Required | Required | Use test key for dev, live key for prod |
| `STRIPE_PUBLISHABLE_KEY` | Required | Required | Use test key for dev, live key for prod |
| `STRIPE_WEBHOOK_SECRET` | Required | Required | Different for dev and prod |
| `STRIPE_*_PRICE_ID` | Required | Required | Create separate products for dev and prod |
| `OPENAI_API_KEY` | Required | Required | Same for both |
| `ELEVENLABS_API_KEY` | Optional | Required | Only needed for voice selection testing in dev |
| `TWILIO_*` | Optional | Required | Only needed for phone AI testing in dev |
| `WHATSAPP_*` | Optional | Required | Only needed for WhatsApp AI testing in dev |
| `GOOGLE_*` | Optional | Required | Only needed for calendar sync testing in dev |
| `EMAIL_*` | Optional | Required | Only needed for email AI testing in dev |
| `N8N_WEBHOOK_URL` | Optional | Required | Only needed for automation testing in dev |
| `ENCRYPTION_KEY` | Required | Required | Generate separate keys for dev and prod |
| `NEXTAUTH_SECRET` | Required | Required | Generate separate secrets for dev and prod |
| `RATE_LIMIT_REDIS_*` | Optional | Required | Recommended for production |
| `NEXT_PUBLIC_APP_URL` | Required | Required | `localhost:3000` for dev, domain for prod |
| `NODE_ENV` | `development` | `production` | Auto-set by Vercel |
| `LOG_LEVEL` | `debug` | `info` | More verbose logging in dev |

---

## Webhook Configuration

After deploying to production, configure webhooks in external services:

### Stripe Webhooks

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Set **Endpoint URL**: `https://your-domain.com/api/stripe/webhooks`
4. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy **Signing secret** and update `STRIPE_WEBHOOK_SECRET` in Vercel

### Twilio Webhooks

1. Go to [Twilio Console](https://console.twilio.com) → **Phone Numbers**
2. Click on your phone number
3. Under **Voice & Fax**:
   - Set **A CALL COMES IN** to: `https://your-domain.com/api/webhooks/twilio`
   - Method: `POST`
4. Under **Messaging**:
   - Set **A MESSAGE COMES IN** to: `https://your-domain.com/api/webhooks/twilio`
   - Method: `POST`
5. Click **Save**

### WhatsApp Webhooks

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Navigate to your app → **WhatsApp** → **Configuration**
3. Click **Edit** next to Webhook
4. Set **Callback URL**: `https://your-domain.com/api/webhooks/whatsapp`
5. Set **Verify token**: Same value as `WHATSAPP_VERIFY_TOKEN`
6. Click **Verify and save**
7. Subscribe to `messages` events

---

## Troubleshooting

### Common Issues

**Issue: "DATABASE_URL is not defined"**
- **Solution:** Make sure you've copied `.env.example` to `.env.local` and filled in the value

**Issue: "Prisma Client not generated"**
- **Solution:** Run `npx prisma generate`

**Issue: "Stripe webhook signature verification failed"**
- **Solution:** Make sure `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe Dashboard

**Issue: "Supabase auth not working"**
- **Solution:** Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

**Issue: "OpenAI API rate limit exceeded"**
- **Solution:** Check your OpenAI usage and upgrade your plan if needed

**Issue: "Twilio webhook not receiving calls"**
- **Solution:** Make sure your webhook URL is publicly accessible (use ngrok for local testing)

**Issue: "WhatsApp webhook verification failed"**
- **Solution:** Make sure `WHATSAPP_VERIFY_TOKEN` matches the verify token in Meta dashboard

**Issue: "Rate limiting not working"**
- **Solution:** Check that `RATE_LIMIT_REDIS_URL` and `RATE_LIMIT_REDIS_TOKEN` are set correctly

### Testing Webhooks Locally

For local development, use [ngrok](https://ngrok.com) to expose your local server:

```bash
# Start your dev server
yarn dev

# In another terminal, start ngrok
ngrok http 3000

# Use the ngrok URL (e.g., https://abc123.ngrok.io) for webhook configuration
```

---

## Security Best Practices

1. **Never commit `.env.local` or `.env` files** - They contain secrets
2. **Use different keys for development and production** - Especially for Stripe and encryption
3. **Rotate secrets regularly** - Especially `ENCRYPTION_KEY` and `NEXTAUTH_SECRET`
4. **Use environment-specific Stripe keys** - Test keys for dev, live keys for prod
5. **Enable rate limiting in production** - Protect against abuse
6. **Use strong encryption keys** - Generate with `openssl rand -hex 32`
7. **Restrict API key permissions** - Only grant necessary permissions
8. **Monitor API usage** - Set up alerts for unusual activity

---

## Support

If you encounter issues not covered in this guide:

1. Check the [README.md](./README.md) for general setup instructions
2. Review the [TEST_PLAN.md](./TEST_PLAN.md) for testing procedures
3. Check the application logs for error messages
4. Verify all environment variables are set correctly

---

**Last Updated:** November 2025
