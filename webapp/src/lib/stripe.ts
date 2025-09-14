import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!publishableKey) {
      throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
    }
    
    stripePromise = loadStripe(publishableKey);
  }
  
  return stripePromise;
};

export const formatPrice = (amount: number, currency: string = 'GBP'): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: currency,
  }).format(amount / 100); // Convert from pence to pounds
};

export const formatPriceForStripe = (amount: number): number => {
  return Math.round(amount * 100); // Convert pounds to pence
};
