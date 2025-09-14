import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    })

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      throw new Error('No stripe signature')
    }

    // Verify webhook signature
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      throw new Error('No webhook secret configured')
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return new Response('Webhook signature verification failed', { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutSessionCompleted(supabaseClient, session)
        break
      
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentSucceeded(supabaseClient, paymentIntent)
        break
      
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        await handlePaymentIntentFailed(supabaseClient, failedPayment)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function handleCheckoutSessionCompleted(supabaseClient: any, session: Stripe.Checkout.Session) {
  const { user_id, pricing_tier_id } = session.metadata || {}
  
  if (!user_id || !pricing_tier_id) {
    console.error('Missing metadata in checkout session')
    return
  }

  // Update payment record
  await supabaseClient
    .from('payments')
    .update({
      status: 'completed',
      stripe_session_id: session.id,
      amount: session.amount_total,
      currency: session.currency,
    })
    .eq('user_id', user_id)
    .eq('pricing_tier_id', pricing_tier_id)

  // Create subscription if it's a recurring plan
  const { data: pricingTier } = await supabaseClient
    .from('pricing_tiers')
    .select('*')
    .eq('id', pricing_tier_id)
    .single()

  if (pricingTier && pricingTier.interval !== 'one_time') {
    await supabaseClient
      .from('subscriptions')
      .insert({
        user_id: user_id,
        pricing_tier_id: pricing_tier_id,
        status: 'active',
        stripe_session_id: session.id,
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      })
  }
}

async function handlePaymentIntentSucceeded(supabaseClient: any, paymentIntent: Stripe.PaymentIntent) {
  // Update payment record
  await supabaseClient
    .from('payments')
    .update({
      status: 'completed',
      stripe_payment_intent_id: paymentIntent.id,
    })
    .eq('payment_intent_id', paymentIntent.id)
}

async function handlePaymentIntentFailed(supabaseClient: any, paymentIntent: Stripe.PaymentIntent) {
  // Update payment record
  await supabaseClient
    .from('payments')
    .update({
      status: 'failed',
      stripe_payment_intent_id: paymentIntent.id,
    })
    .eq('payment_intent_id', paymentIntent.id)
}
