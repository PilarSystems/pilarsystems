# Phase 5, Task 15: Stripe Billing (B2B + B2C Subscriptions)

**Status**: ✅ Complete  
**Date**: 2025-11-23  
**Author**: Devin

## Overview

Implemented a complete Stripe billing system supporting both B2B (Studios) and B2C (Gym Buddy) subscriptions with automatic tenant provisioning, subscription management, and webhook handling.

## Architecture

### Subscription Model

Extended Prisma `Subscription` model to support both B2B and B2C:

```prisma
model Subscription {
  id                   String             @id @default(uuid())
  kind                 SubscriptionKind   @default(B2B)
  workspaceId          String?            @unique
  workspace            Workspace?
  userId               String?
  stripeCustomerId     String             @unique
  stripeSubscriptionId String             @unique
  plan                 Plan
  status               SubscriptionStatus
  whatsappAddon        Boolean            @default(false)
  currentPeriodStart   DateTime
  currentPeriodEnd     DateTime
  createdAt            DateTime           @default(now())
  updatedAt            DateTime           @updatedAt

  @@index([userId])
  @@index([kind, status])
}

enum SubscriptionKind {
  B2B
  B2C
}

enum Plan {
  BASIC
  PRO
  GYM_BUDDY
}
```

### Stripe Products

**B2B (Studios)**:
- **PILAR BASIC**: €500 setup + €100/month
- **PILAR PRO**: €1000 setup + €149/month
- **WhatsApp Add-on**: €20/month

**B2C (Gym Buddy)**:
- **GYM BUDDY**: €20/month (configurable via env)

## Implementation

### 1. Core Services

#### `/lib/stripe.ts`
- Lazy-initialized Stripe client (removed invalid apiVersion)
- `STRIPE_PLANS` configuration with backward-compatible env vars
- Added `GYM_BUDDY` plan configuration

#### `/services/stripe/checkout.ts`
- `createCheckoutSession()`: B2B checkout with workspace, setup fees, trial periods
- `createBuddyCheckoutSession()`: B2C checkout for Gym Buddy subscriptions
- `createPortalSession()`: B2B customer portal
- `createBuddyPortalSession()`: B2C customer portal
- Metadata includes `audience: 'b2b' | 'b2c'` for webhook routing

#### `/services/stripe/webhooks.ts`
- `handleCheckoutSessionCompleted()`: Routes to B2B or B2C handler based on audience
- `handleB2CCheckoutCompleted()`: Creates B2C subscription and activates Buddy
- `handleSubscriptionUpdated()`: Activates/deactivates Buddy based on status
- `handleSubscriptionDeleted()`: Deactivates Buddy on cancellation
- `handleInvoicePaymentFailed()`: Deactivates Buddy on payment failure
- `activateBuddy()`: Logs activation (subscription status is source of truth)
- `deactivateBuddy()`: Logs deactivation (subscription status is source of truth)

### 2. API Routes

#### `POST /api/stripe/create-checkout`
- Accepts `plan: 'BASIC' | 'PRO' | 'GYM_BUDDY'`
- Routes to B2B or B2C checkout based on plan
- Validates existing subscriptions before creating new ones
- Supports affiliate tracking for B2B

#### `POST /api/stripe/webhooks`
- Verifies Stripe signature
- Processes webhook events with idempotency
- Enqueues events to webhook queue for tenant isolation

#### `GET /api/stripe/subscription-status`
- Query params: `workspaceId` (B2B) or `userId` (B2C)
- Returns: `{ audience, status, plan, currentPeriodEnd, whatsappAddon }`
- Used by frontend to display subscription status

### 3. Webhook Event Flow

**B2B Checkout Flow**:
1. User selects plan on `/pricing`
2. `POST /api/stripe/create-checkout` creates workspace if needed
3. Stripe checkout → payment → webhook `checkout.session.completed`
4. `handleCheckoutSessionCompleted()` (audience='b2b'):
   - Creates `Subscription` record (kind='B2B')
   - Updates `Workspace.subscriptionId`
   - Creates 7 `WizardProgress` records
   - Enqueues autopilot provisioning
   - Processes affiliate conversion if applicable

**B2C Checkout Flow**:
1. User visits `/gymbuddy/start`
2. `POST /api/stripe/create-checkout` with `plan='GYM_BUDDY'`
3. Stripe checkout → payment → webhook `checkout.session.completed`
4. `handleB2CCheckoutCompleted()` (audience='b2c'):
   - Creates `Subscription` record (kind='B2C', userId)
   - Calls `activateBuddy(userId)`
   - User can now use Gym Buddy features

**Subscription Updates**:
- `customer.subscription.updated`: Updates status, activates/deactivates Buddy
- `customer.subscription.deleted`: Marks as canceled, deactivates Buddy
- `invoice.payment_failed`: Marks as past_due, deactivates Buddy

### 4. Subscription Validation

Gym Buddy API routes check subscription status:

```typescript
const subscription = await prisma.subscription.findFirst({
  where: { userId, kind: 'B2C' },
})

if (!subscription || !['active', 'trialing'].includes(subscription.status)) {
  return 'Your Gym Buddy subscription is not active.'
}
```

## Environment Variables

Required for production:

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# B2B Plans
STRIPE_PRICE_BASIC=price_...           # €100/month
STRIPE_BASIC_YEARLY_PRICE_ID=price_... # €1000/year
STRIPE_BASIC_SETUP_FEE_ID=price_...    # €500 one-time

STRIPE_PRICE_PRO=price_...             # €149/month
STRIPE_PRO_YEARLY_PRICE_ID=price_...   # €1490/year
STRIPE_PRO_SETUP_FEE_ID=price_...      # €1000 one-time

# B2C Plans
STRIPE_PRICE_GYMBUDDY=price_...        # €20/month

# Add-ons
STRIPE_WHATSAPP_ADDON_PRICE_ID=price_... # €20/month

# App
NEXT_PUBLIC_APP_URL=https://pilarsystems.com
```

## Database Migration

Run migration to add B2C support:

```bash
npx prisma migrate deploy
```

Migration adds:
- `Subscription.kind` enum (B2B/B2C)
- `Subscription.userId` nullable field
- `Plan.GYM_BUDDY` enum value
- Indexes on `userId` and `(kind, status)`

## Testing

### Local Testing

1. **B2B Checkout**:
```bash
curl -X POST http://localhost:3000/api/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "BASIC",
    "billingCycle": "monthly",
    "userId": "user_123",
    "email": "studio@example.com"
  }'
```

2. **B2C Checkout**:
```bash
curl -X POST http://localhost:3000/api/stripe/create-checkout \
  -H "Content-Type: application/json" \
  -d '{
    "plan": "GYM_BUDDY",
    "userId": "user_456",
    "email": "buddy@example.com",
    "name": "Max"
  }'
```

3. **Subscription Status**:
```bash
# B2B
curl http://localhost:3000/api/stripe/subscription-status?workspaceId=ws_123

# B2C
curl http://localhost:3000/api/stripe/subscription-status?userId=user_456
```

### Webhook Testing

Use Stripe CLI to forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhooks
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
```

## Files Created/Modified

### Created (1 file):
- `app/api/stripe/subscription-status/route.ts` (52 lines)

### Modified (5 files):
- `src/server/db/schema.prisma` (+15 lines): Added B2C subscription support
- `lib/stripe.ts` (+9 lines): Added GYM_BUDDY plan, removed invalid apiVersion
- `services/stripe/checkout.ts` (+108 lines): Added B2C checkout functions
- `services/stripe/webhooks.ts` (+94 lines): Added B2C webhook handlers
- `app/api/stripe/create-checkout/route.ts` (+30 lines): Added B2C routing

**Total**: 256 lines added, 1 file created

## Integration Points

### Frontend Integration

**B2B** (`/pricing`):
```typescript
const response = await fetch('/api/stripe/create-checkout', {
  method: 'POST',
  body: JSON.stringify({
    plan: 'BASIC',
    billingCycle: 'monthly',
    userId,
    email,
  }),
})
const { url } = await response.json()
window.location.href = url
```

**B2C** (`/gymbuddy/start`):
```typescript
const response = await fetch('/api/stripe/create-checkout', {
  method: 'POST',
  body: JSON.stringify({
    plan: 'GYM_BUDDY',
    userId,
    email,
    name,
  }),
})
const { url } = await response.json()
window.location.href = url
```

**Subscription Status** (`/dashboard/billing`):
```typescript
const response = await fetch(`/api/stripe/subscription-status?workspaceId=${workspaceId}`)
const { status, plan, currentPeriodEnd } = await response.json()
```

### Backend Integration

Gym Buddy API routes automatically check subscription:

```typescript
// In /api/gymbuddy/message/route.ts
const subscription = await prisma.subscription.findFirst({
  where: { userId, kind: 'B2C' },
})

if (!subscription || !['active', 'trialing'].includes(subscription.status)) {
  return NextResponse.json(
    { error: 'Subscription required' },
    { status: 403 }
  )
}
```

## Security Considerations

1. **Webhook Verification**: All webhooks verify Stripe signature
2. **Idempotency**: Webhooks processed with idempotency keys
3. **Tenant Isolation**: B2B uses workspaceId, B2C uses userId
4. **Subscription Validation**: All Gym Buddy routes check active subscription
5. **Metadata Validation**: Audience field prevents cross-contamination

## Monitoring

### Key Metrics

- Subscription creation rate (B2B vs B2C)
- Churn rate by plan
- Failed payment rate
- Webhook processing latency
- Subscription status distribution

### Logs

All Stripe operations logged with:
- `logger.info`: Successful operations
- `logger.warn`: Validation failures
- `logger.error`: Processing errors

Search logs by:
- `workspaceId` (B2B)
- `userId` (B2C)
- `sessionId` (Stripe checkout)
- `subscriptionId` (Stripe subscription)

## Future Enhancements

1. **Proration**: Handle plan upgrades/downgrades with proration
2. **Trials**: Configurable trial periods per plan
3. **Coupons**: Support for discount codes and promotions
4. **Usage-Based Billing**: Metered billing for API usage
5. **Multi-Currency**: Support for EUR, USD, GBP
6. **Tax Calculation**: Automatic tax calculation with Stripe Tax
7. **Dunning**: Automated retry logic for failed payments
8. **Analytics**: Subscription analytics dashboard

## Troubleshooting

### Common Issues

**Issue**: Webhook signature verification fails  
**Solution**: Ensure `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard

**Issue**: Subscription not created after payment  
**Solution**: Check webhook logs, verify metadata includes audience/workspaceId/userId

**Issue**: Gym Buddy not activated after payment  
**Solution**: Check subscription status in database, verify webhook processed

**Issue**: Build fails with Stripe apiVersion error  
**Solution**: Removed invalid apiVersion from lib/stripe.ts (fixed in this PR)

## References

- [Stripe Checkout Documentation](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe Subscriptions Documentation](https://stripe.com/docs/billing/subscriptions/overview)
- [Prisma Schema Documentation](https://www.prisma.io/docs/concepts/components/prisma-schema)
