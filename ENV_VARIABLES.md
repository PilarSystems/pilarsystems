# Complete Environment Variables Reference

## All Required Environment Variables

### Database (1 variable)
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```
**Purpose:** PostgreSQL database connection string
**Required:** Yes
**Where to get:** Supabase, Neon, Railway, or your PostgreSQL provider

### Supabase Authentication (3 variables)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```
**Purpose:** User authentication and session management
**Required:** Yes
**Where to get:** Supabase Dashboard → Project Settings → API

### Stripe Billing (8 variables)
```env
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_BASIC_SETUP_FEE_ID=price_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_PRO_SETUP_FEE_ID=price_...
STRIPE_WHATSAPP_ADDON_PRICE_ID=price_...
```
**Purpose:** Subscription billing and payment processing
**Required:** Yes
**Where to get:** 
- API keys: Stripe Dashboard → Developers → API keys
- Price IDs: Run `npm run stripe:setup` or create manually in Stripe Dashboard

### OpenAI (1 variable)
```env
OPENAI_API_KEY=sk-...
```
**Purpose:** AI-powered responses and automation
**Required:** Yes
**Where to get:** OpenAI Platform → API keys

### Twilio Phone Integration (3 variables)
```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890
```
**Purpose:** Phone calls and SMS messaging
**Required:** Yes (for phone features)
**Where to get:** Twilio Console → Account Info

### WhatsApp Cloud API (3 variables)
```env
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...
WHATSAPP_VERIFY_TOKEN=your-secure-random-token
```
**Purpose:** WhatsApp messaging integration
**Required:** Yes (for WhatsApp features)
**Where to get:** 
- API Token & Phone Number ID: Meta Business Suite → WhatsApp → API Setup
- Verify Token: Generate a secure random string

### Google Calendar OAuth (3 variables)
```env
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/callback/google
```
**Purpose:** Calendar synchronization
**Required:** Yes (for calendar features)
**Where to get:** Google Cloud Console → APIs & Services → Credentials

### Email Integration (7 variables)
```env
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-app-password
EMAIL_IMAP_HOST=imap.gmail.com
EMAIL_IMAP_PORT=993
EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_SECURE=false
```
**Purpose:** Email inbox monitoring and sending
**Required:** Yes (for email features)
**Where to get:** Your email provider (Gmail, Outlook, etc.)

### n8n Automation (2 variables)
```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
N8N_API_KEY=your-n8n-api-key
```
**Purpose:** Workflow automation
**Required:** Optional (recommended for advanced automation)
**Where to get:** Your n8n instance

### Security & Infrastructure (3 variables)
```env
ENCRYPTION_KEY=your-64-character-hex-encryption-key
RATE_LIMIT_REDIS_URL=https://your-upstash-redis.upstash.io
RATE_LIMIT_REDIS_TOKEN=your-upstash-redis-token
```
**Purpose:** Data encryption and rate limiting
**Required:** Yes
**Where to get:**
- Encryption Key: Generate with `openssl rand -hex 32`
- Redis: Upstash Dashboard → Create Database

### Application Configuration (3 variables)
```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
LOG_LEVEL=info
```
**Purpose:** Application configuration
**Required:** Yes
**Where to get:** Your deployment URL and preferences

## Total Count: 40 Environment Variables

### By Category:
- Database: 1
- Authentication: 3
- Billing: 8
- AI: 1
- Phone: 3
- WhatsApp: 3
- Calendar: 3
- Email: 7
- Automation: 2
- Security: 3
- Configuration: 3
- **Optional: 2** (n8n variables)

## Quick Setup Guide

### 1. Copy Template
```bash
cp .env.example .env.local
```

### 2. Fill in Required Variables

**Start with these (minimum to run):**
1. DATABASE_URL
2. NEXT_PUBLIC_SUPABASE_URL
3. NEXT_PUBLIC_SUPABASE_ANON_KEY
4. SUPABASE_SERVICE_ROLE_KEY
5. STRIPE_SECRET_KEY
6. STRIPE_WEBHOOK_SECRET
7. OPENAI_API_KEY
8. ENCRYPTION_KEY
9. NEXT_PUBLIC_APP_URL

**Then add integration variables as needed:**
- Twilio (for phone features)
- WhatsApp (for WhatsApp features)
- Google (for calendar features)
- Email (for email features)
- n8n (for advanced automation)

### 3. Generate Encryption Key
```bash
openssl rand -hex 32
```

### 4. Run Stripe Setup
```bash
npm run stripe:setup
```
This will output the price IDs you need for Stripe variables.

### 5. Verify Configuration
```bash
npm run dev
```
Check that the app starts without errors.

## Environment-Specific Notes

### Development (.env.local)
- Use Stripe test keys (sk_test_...)
- Use test phone numbers
- Use development URLs (http://localhost:3000)
- Can use placeholder values for testing

### Production (Vercel)
- Use Stripe live keys (sk_live_...)
- Use real phone numbers
- Use production URLs (https://your-domain.com)
- All values must be real and valid

## Security Best Practices

1. **Never commit .env files to git**
   - Already in .gitignore
   - Use .env.example as template only

2. **Rotate keys regularly**
   - Especially after team changes
   - Use different keys per environment

3. **Use strong encryption keys**
   - Generate with cryptographically secure methods
   - Never reuse keys across projects

4. **Limit key permissions**
   - Use read-only keys where possible
   - Restrict API key scopes

5. **Monitor key usage**
   - Set up alerts for unusual activity
   - Review logs regularly

## Troubleshooting

### "Environment variable not found"
- Check spelling matches exactly
- Verify variable is set in Vercel Dashboard
- Restart development server after changes

### "Invalid API key"
- Verify key is copied completely
- Check for extra spaces or newlines
- Ensure using correct environment (test vs live)

### "Database connection failed"
- Verify DATABASE_URL format
- Check database is accessible from your IP
- Ensure SSL mode is correct

### "Webhook verification failed"
- Verify webhook secret matches
- Check webhook URL is correct
- Review webhook logs in provider dashboard

---

**Quick Reference:** 40 total variables, 38 required, 2 optional
