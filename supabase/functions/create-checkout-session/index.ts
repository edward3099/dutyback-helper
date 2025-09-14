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

    const { pricing_tier_id, user_id, success_url, cancel_url } = await req.json()

    // Get pricing tier details
    const { data: pricingTier, error: tierError } = await supabaseClient
      .from('pricing_tiers')
      .select('*')
      .eq('id', pricing_tier_id)
      .single()

    if (tierError || !pricingTier) {
      throw new Error('Pricing tier not found')
    }

    // Create Stripe checkout session
    const isSubscription = pricingTier.interval !== 'one_time'
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: pricingTier.currency.toLowerCase(),
            product_data: {
              name: pricingTier.name,
              description: pricingTier.description,
            },
            unit_amount: Math.round(pricingTier.price * 100), // Convert to pence
            ...(isSubscription && {
              recurring: {
                interval: pricingTier.interval === 'monthly' ? 'month' : 'year'
              }
            })
          },
          quantity: 1,
        },
      ],
      mode: isSubscription ? 'subscription' : 'payment',
      success_url: success_url,
      cancel_url: cancel_url,
      customer_email: user.email,
      metadata: {
        user_id: user_id,
        pricing_tier_id: pricing_tier_id,
        tier_name: pricingTier.name,
      },
    })

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
