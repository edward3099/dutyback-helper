import { getStripe } from './stripe';
import { supabase } from './supabase';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

export interface CreatePaymentIntentRequest {
  pricingTierId: string;
  amount: number;
  currency: string;
  userId: string;
  metadata?: Record<string, any>;
}

export class StripePaymentService {
  private static instance: StripePaymentService;
  
  public static getInstance(): StripePaymentService {
    if (!StripePaymentService.instance) {
      StripePaymentService.instance = new StripePaymentService();
    }
    return StripePaymentService.instance;
  }

  async createPaymentIntent(request: CreatePaymentIntentRequest): Promise<PaymentIntent> {
    try {
      // Create payment intent via Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          pricing_tier_id: request.pricingTierId,
          amount: request.amount,
          currency: request.currency,
          user_id: request.userId,
          metadata: request.metadata || {}
        }
      });

      if (error) {
        throw new Error(`Failed to create payment intent: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Stripe not loaded');
      }

      const { error } = await stripe.confirmPayment({
        clientSecret: paymentIntentId,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error confirming payment:', error);
      return { success: false, error: 'Payment confirmation failed' };
    }
  }

  async createCheckoutSession(pricingTierId: string, userId: string): Promise<{ url: string }> {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          pricing_tier_id: pricingTierId,
          user_id: userId,
          success_url: `${window.location.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${window.location.origin}/pricing?cancelled=true`,
        }
      });

      if (error) {
        throw new Error(`Failed to create checkout session: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  async getPaymentMethods(userId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('get-payment-methods', {
        body: { user_id: userId }
      });

      if (error) {
        throw new Error(`Failed to get payment methods: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  async createSubscription(pricingTierId: string, userId: string, paymentMethodId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          pricing_tier_id: pricingTierId,
          user_id: userId,
          payment_method_id: paymentMethodId
        }
      });

      if (error) {
        throw new Error(`Failed to create subscription: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }
}

export const stripePaymentService = StripePaymentService.getInstance();
