'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { PricingTier } from '@/lib/payments';
import { PaymentButton } from '@/components/payment/PaymentButton';

interface PricingCardProps {
  tier: PricingTier;
  onSelect: (tierId: string) => void;
  isSelected?: boolean;
  isLoading?: boolean;
}

export function PricingCard({ tier, onSelect, isSelected, isLoading }: PricingCardProps) {
  const formatPrice = (price: number, currency: string, interval: string) => {
    if (price === 0) return 'Free';
    
    const formattedPrice = new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency.toUpperCase()
    }).format(price);
    
    if (interval === 'one_time') {
      return formattedPrice;
    }
    
    return `${formattedPrice}/${interval === 'yearly' ? 'year' : 'month'}`;
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('unlimited') || 
        feature.toLowerCase().includes('everything') ||
        feature.toLowerCase().includes('priority') ||
        feature.toLowerCase().includes('dedicated')) {
      return <Check className="w-4 h-4 text-green-500" />;
    }
    return <Check className="w-4 h-4 text-gray-500" />;
  };

  return (
    <Card className={`relative h-full flex flex-col ${isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''} ${tier.popular ? 'border-blue-500' : ''}`}>
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
        <CardDescription className="text-gray-600 text-sm leading-relaxed">{tier.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold text-gray-900">
            {formatPrice(tier.price, tier.currency, tier.interval)}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <PaymentButton
          pricingTierId={tier.id}
          amount={tier.price}
          currency={tier.currency}
          tierName={tier.name}
          className={tier.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}
        />
        
        <div className="space-y-3 flex-1">
          <h4 className="font-medium text-sm text-gray-900">Features included:</h4>
          <ul className="space-y-2">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                {getFeatureIcon(feature)}
                <span className="text-gray-700 leading-relaxed break-words">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {tier.limits && Object.keys(tier.limits).length > 0 && (
          <div className="pt-4 border-t border-gray-200 mt-auto">
            <h4 className="font-medium text-sm text-gray-900 mb-2">Limits:</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              {tier.limits.claims_per_month && (
                <li className="break-words">
                  {tier.limits.claims_per_month === -1 
                    ? 'Unlimited claims per month'
                    : `${tier.limits.claims_per_month} claims per month`
                  }
                </li>
              )}
              {tier.limits.evidence_files_per_claim && (
                <li className="break-words">
                  {tier.limits.evidence_files_per_claim === -1 
                    ? 'Unlimited evidence files per claim'
                    : `${tier.limits.evidence_files_per_claim} evidence files per claim`
                  }
                </li>
              )}
              {tier.limits.export_formats && (
                <li className="break-words">
                  Export formats: {tier.limits.export_formats.join(', ')}
                </li>
              )}
              {tier.limits.priority_support && (
                <li className="break-words">Priority support included</li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
