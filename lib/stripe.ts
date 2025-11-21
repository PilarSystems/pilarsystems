import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const apiKey = process.env.STRIPE_SECRET_KEY
    if (!apiKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required')
    }
    stripeInstance = new Stripe(apiKey, {
      apiVersion: '2025-11-17.clover',
      typescript: true,
    })
  }
  return stripeInstance
}

export function getStripePlans() {
  return {
    BASIC: {
      name: 'PILAR BASIC',
      price: 10000, // €100 in cents
      setupFee: 50000, // €500 in cents
      priceId: process.env.STRIPE_BASIC_PRICE_ID || '',
      yearlyPriceId: process.env.STRIPE_BASIC_YEARLY_PRICE_ID || '',
      setupFeeId: process.env.STRIPE_BASIC_SETUP_FEE_ID || '',
    },
    PRO: {
      name: 'PILAR PRO',
      price: 14900, // €149 in cents
      setupFee: 100000, // €1000 in cents
      priceId: process.env.STRIPE_PRO_PRICE_ID || '',
      yearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID || '',
      setupFeeId: process.env.STRIPE_PRO_SETUP_FEE_ID || '',
    },
    WHATSAPP_ADDON: {
      name: 'WhatsApp AI Add-on',
      price: 2000, // €20 in cents
      priceId: process.env.STRIPE_WHATSAPP_ADDON_PRICE_ID || '',
    },
  }
}

export const STRIPE_PLANS = getStripePlans()
