'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, Check } from 'lucide-react';
import { stripePaymentService } from '@/lib/stripe-payment';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface PaymentButtonProps {
  pricingTierId: string;
  amount: number;
  currency: string;
  tierName: string;
  className?: string;
}

export function PaymentButton({ 
  pricingTierId, 
  amount, 
  currency, 
  tierName,
  className 
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handlePayment = async () => {
    if (!user) {
      // Trigger the login dialog by dispatching a custom event
      window.dispatchEvent(new CustomEvent('showAuthDialog', { 
        detail: { mode: 'login', redirect: '/pricing' } 
      }));
      return;
    }

    setIsLoading(true);
    
    try {
      // Create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          pricing_tier_id: pricingTierId,
          user_id: user.id,
          success_url: `${window.location.origin}/pricing?success=true`,
          cancel_url: `${window.location.origin}/pricing?canceled=true`,
        }
      });

      if (error) {
        throw new Error(`Failed to create checkout session: ${error.message}`);
      }

      const { url, error: edgeFunctionError } = data;

      if (edgeFunctionError) {
        throw new Error(edgeFunctionError);
      }
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  if (isSuccess) {
    return (
      <Button disabled className={`w-full ${className}`}>
        <Check className="w-4 h-4 mr-2" />
        Payment Successful
      </Button>
    );
  }

  return (
    <Button 
      onClick={handlePayment}
      disabled={isLoading}
      className={`w-full ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
          {amount === 0 ? 'Get Started Free' : `Pay ${formatPrice(amount, currency)}`}
        </>
      )}
    </Button>
  );
}
