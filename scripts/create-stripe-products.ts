import Stripe from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

async function createProducts() {
  try {
    console.log('Creating Stripe products and prices...')

    const basicProduct = await stripe.products.create({
      name: 'PILAR BASIC',
      description: 'Basic fitness studio management plan',
      metadata: {
        plan: 'BASIC',
      },
    })
    console.log('✓ Created PILAR BASIC product:', basicProduct.id)

    const basicPrice = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 10000, // €100 in cents
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan: 'BASIC',
        type: 'subscription',
      },
    })
    console.log('✓ Created BASIC monthly price:', basicPrice.id)

    const basicSetupFee = await stripe.prices.create({
      product: basicProduct.id,
      unit_amount: 50000, // €500 in cents
      currency: 'eur',
      metadata: {
        plan: 'BASIC',
        type: 'setup_fee',
      },
    })
    console.log('✓ Created BASIC setup fee:', basicSetupFee.id)

    const proProduct = await stripe.products.create({
      name: 'PILAR PRO',
      description: 'Professional fitness studio management plan with advanced features',
      metadata: {
        plan: 'PRO',
      },
    })
    console.log('✓ Created PILAR PRO product:', proProduct.id)

    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 14900, // €149 in cents
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan: 'PRO',
        type: 'subscription',
      },
    })
    console.log('✓ Created PRO monthly price:', proPrice.id)

    const proSetupFee = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 100000, // €1000 in cents
      currency: 'eur',
      metadata: {
        plan: 'PRO',
        type: 'setup_fee',
      },
    })
    console.log('✓ Created PRO setup fee:', proSetupFee.id)

    const whatsappProduct = await stripe.products.create({
      name: 'WhatsApp AI Add-on',
      description: 'AI-powered WhatsApp automation for customer communication',
      metadata: {
        addon: 'whatsapp',
      },
    })
    console.log('✓ Created WhatsApp Add-on product:', whatsappProduct.id)

    const whatsappPrice = await stripe.prices.create({
      product: whatsappProduct.id,
      unit_amount: 2000, // €20 in cents
      currency: 'eur',
      recurring: {
        interval: 'month',
      },
      metadata: {
        addon: 'whatsapp',
        type: 'subscription',
      },
    })
    console.log('✓ Created WhatsApp Add-on price:', whatsappPrice.id)

    console.log('\n✅ All products and prices created successfully!')
    console.log('\nAdd these to your .env file:')
    console.log(`STRIPE_BASIC_PRICE_ID=${basicPrice.id}`)
    console.log(`STRIPE_BASIC_SETUP_FEE_ID=${basicSetupFee.id}`)
    console.log(`STRIPE_PRO_PRICE_ID=${proPrice.id}`)
    console.log(`STRIPE_PRO_SETUP_FEE_ID=${proSetupFee.id}`)
    console.log(`STRIPE_WHATSAPP_ADDON_PRICE_ID=${whatsappPrice.id}`)
  } catch (error) {
    console.error('Error creating products:', error)
    process.exit(1)
  }
}

createProducts()
