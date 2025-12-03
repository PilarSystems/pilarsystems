// Checkout-related content strings for consistency and maintainability

export const CHECKOUT_CONTENT = {
  PRIVACY_STATEMENT: 'Your payment information is processed securely by Stripe. We never store your full card details. All data is handled in accordance with GDPR regulations.',
  
  TRIAL_INFO: {
    DAYS: 14,
    DESCRIPTION: 'No credit card required during trial. Cancel anytime.',
    DUE_TODAY_LABEL: 'Due today',
    DUE_TODAY_SUBTEXT: '14-day free trial starts now',
  },
  
  TRUST_SIGNALS: {
    SSL: {
      TITLE: 'SSL Secured',
      DESCRIPTION: '256-bit encryption',
    },
    PAYMENTS: {
      TITLE: 'Secure Payments',
      DESCRIPTION: 'Powered by Stripe',
    },
    GDPR: {
      TITLE: 'GDPR Compliant',
      DESCRIPTION: 'Data protection',
    },
    CANCEL: {
      TITLE: 'Cancel Anytime',
      DESCRIPTION: 'No commitments',
    },
  },
  
  SUPPORT_EMAIL: 'support@pilarsystems.de',
} as const
