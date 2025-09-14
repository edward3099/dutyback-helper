import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { pricing_tier_id, amount, currency, user_id, metadata } = await req.json()

    // Get pricing tier details
    const { data: pricingTier, error: tierError } = await supabaseClient
      .from('pricing_tiers')
      .select('*')
      .eq('id', pricing_tier_id)
      .single()

    if (tierError || !pricingTier) {
      throw new Error('Pricing tier not found')
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to pence
      currency: currency.toLowerCase(),
      metadata: {
        user_id: user_id,
        pricing_tier_id: pricing_tier_id,
        tier_name: pricingTier.name,
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Store payment intent in database
    const { error: dbError } = await supabaseClient
      .from('payments')
      .insert({
        user_id: user_id,
        amount: amount,
        currency: currency,
        status: 'pending',
        payment_intent_id: paymentIntent.id,
        description: `Payment for ${pricingTier.name}`,
        metadata: {
          pricing_tier_id: pricing_tier_id,
          tier_name: pricingTier.name,
          ...metadata
        }
      })

    if (dbError) {
      console.error('Database error:', dbError)
      // Don't throw here, payment intent was created successfully
    }

    return new Response(
      JSON.stringify({
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating payment intent:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
