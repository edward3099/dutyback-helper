import { supabase } from './supabase';

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'one_time';
  features: string[];
  limits: {
    claims_per_month?: number;
    evidence_files_per_claim?: number;
    export_formats?: string[];
    priority_support?: boolean;
  };
  popular?: boolean;
  sort_order?: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  pricing_tier_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'unpaid' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_end?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
  payment_method: string;
  payment_intent_id?: string;
  description: string;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  subscription_id?: string;
  payment_id?: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  due_date: string;
  paid_at?: string;
  pdf_url?: string;
  created_at: string;
  updated_at: string;
}

export class PaymentService {
  /**
   * Get all available pricing tiers
   */
  async getPricingTiers(): Promise<PricingTier[]> {
    try {
      const { data, error } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching pricing tiers:', error);
      return [];
    }
  }

  /**
   * Get user's current subscription
   */
  async getUserSubscription(userId: string): Promise<Subscription | null> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          pricing_tiers (
            name,
            description,
            price,
            currency,
            interval,
            features,
            limits
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No subscription found
        }
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }

  /**
   * Create a new subscription
   */
  async createSubscription(
    userId: string,
    pricingTierId: string,
    paymentMethodId: string
  ): Promise<{ success: boolean; subscription?: Subscription; error?: string }> {
    try {
      // Get pricing tier details
      const { data: pricingTier, error: tierError } = await supabase
        .from('pricing_tiers')
        .select('*')
        .eq('id', pricingTierId)
        .single();

      if (tierError || !pricingTier) {
        return { success: false, error: 'Pricing tier not found' };
      }

      // Calculate period dates
      const now = new Date();
      const periodEnd = new Date(now);
      
      if (pricingTier.interval === 'monthly') {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      } else if (pricingTier.interval === 'yearly') {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      }

      // Create subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          pricing_tier_id: pricingTierId,
          status: 'active',
          current_period_start: now.toISOString(),
          current_period_end: periodEnd.toISOString(),
          cancel_at_period_end: false
        })
        .select()
        .single();

      if (subError) {
        return { success: false, error: subError.message };
      }

      // Create payment record
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          user_id: userId,
          subscription_id: subscription.id,
          amount: pricingTier.price,
          currency: pricingTier.currency,
          status: 'succeeded',
          payment_method: paymentMethodId,
          description: `Subscription to ${pricingTier.name}`,
          metadata: {
            pricing_tier: pricingTier.name,
            interval: pricingTier.interval
          }
        });

      if (paymentError) {
        console.error('Error creating payment record:', paymentError);
      }

      return { success: true, subscription };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return { success: false, error: 'Failed to create subscription' };
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({
          cancel_at_period_end: cancelAtPeriodEnd,
          status: cancelAtPeriodEnd ? 'active' : 'cancelled'
        })
        .eq('id', subscriptionId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      return { success: false, error: 'Failed to cancel subscription' };
    }
  }

  /**
   * Get user's payment history
   */
  async getPaymentHistory(userId: string, limit: number = 10): Promise<Payment[]> {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching payment history:', error);
      return [];
    }
  }

  /**
   * Get user's invoices
   */
  async getUserInvoices(userId: string, limit: number = 10): Promise<Invoice[]> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      return [];
    }
  }

  /**
   * Check if user has access to a feature
   */
  async checkFeatureAccess(
    userId: string,
    feature: keyof PricingTier['limits']
  ): Promise<{ hasAccess: boolean; limit?: number; current?: number }> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription) {
        return { hasAccess: false };
      }

      // Get current usage
      const { data: usage, error: usageError } = await supabase
        .from('feature_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('feature', feature)
        .gte('period_start', subscription.current_period_start)
        .lte('period_end', subscription.current_period_end)
        .single();

      if (usageError && usageError.code !== 'PGRST116') {
        console.error('Error fetching usage:', usageError);
        return { hasAccess: false };
      }

      const currentUsage = usage?.count || 0;
      const limit = subscription.pricing_tiers?.limits[feature];

      if (limit === undefined) {
        return { hasAccess: true };
      }

      return {
        hasAccess: currentUsage < limit,
        limit,
        current: currentUsage
      };
    } catch (error) {
      console.error('Error checking feature access:', error);
      return { hasAccess: false };
    }
  }

  /**
   * Record feature usage
   */
  async recordFeatureUsage(
    userId: string,
    feature: keyof PricingTier['limits'],
    count: number = 1
  ): Promise<void> {
    try {
      const subscription = await this.getUserSubscription(userId);
      
      if (!subscription) {
        return;
      }

      const { error } = await supabase
        .from('feature_usage')
        .upsert({
          user_id: userId,
          feature,
          count,
          period_start: subscription.current_period_start,
          period_end: subscription.current_period_end
        }, {
          onConflict: 'user_id,feature,period_start'
        });

      if (error) {
        console.error('Error recording feature usage:', error);
      }
    } catch (error) {
      console.error('Error recording feature usage:', error);
    }
  }

  /**
   * Get subscription analytics
   */
  async getSubscriptionAnalytics(): Promise<{
    totalSubscriptions: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    churnRate: number;
    popularTiers: Array<{ tier: string; count: number }>;
  }> {
    try {
      // This would typically be done with more complex queries
      // For now, return mock data
      return {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        monthlyRevenue: 0,
        churnRate: 0,
        popularTiers: []
      };
    } catch (error) {
      console.error('Error fetching subscription analytics:', error);
      return {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        monthlyRevenue: 0,
        churnRate: 0,
        popularTiers: []
      };
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
