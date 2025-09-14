'use client';

import React, { useState, useEffect } from 'react';
import { PricingCard } from '@/components/pricing/PricingCard';
import { PricingTier } from '@/lib/payments';
import { paymentService } from '@/lib/payments';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';
import { PaymentSuccess } from '@/components/payment/PaymentSuccess';

export default function PricingPage() {
  const { user } = useAuth();
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPricingTiers();
  }, []);

  const fetchPricingTiers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tiers = await paymentService.getPricingTiers();
      setPricingTiers(tiers);
    } catch (err) {
      setError('Failed to load pricing information');
      console.error('Error fetching pricing tiers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTier = async (tierId: string) => {
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    setIsProcessing(true);
    try {
      // In a real implementation, this would integrate with Stripe or another payment processor
      // For now, we'll just show a success message
      setSelectedTier(tierId);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert('Payment processing would be implemented here with Stripe integration');
    } catch (err) {
      console.error('Error processing payment:', err);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pricing information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <>
      <PaymentSuccess />
      <div className="min-h-screen bg-gray-50 py-8 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan for your import duty refund needs. 
            All plans include our core features with different limits and support levels.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {pricingTiers.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              onSelect={handleSelectTier}
              isSelected={selectedTier === tier.id}
              isLoading={isProcessing && selectedTier === tier.id}
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Features</th>
                  {pricingTiers.map((tier) => (
                    <th key={tier.id} className="text-center py-4 px-6 font-medium text-gray-900">
                      {tier.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-700">Claims per month</td>
                  {pricingTiers.map((tier) => (
                    <td key={tier.id} className="text-center py-4 px-6">
                      {tier.limits.claims_per_month === -1 
                        ? 'Unlimited' 
                        : tier.limits.claims_per_month || 'N/A'
                      }
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Evidence files per claim</td>
                  {pricingTiers.map((tier) => (
                    <td key={tier.id} className="text-center py-4 px-6">
                      {tier.limits.evidence_files_per_claim === -1 
                        ? 'Unlimited' 
                        : tier.limits.evidence_files_per_claim || 'N/A'
                      }
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Export formats</td>
                  {pricingTiers.map((tier) => (
                    <td key={tier.id} className="text-center py-4 px-6">
                      {tier.limits.export_formats?.join(', ') || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Priority support</td>
                  {pricingTiers.map((tier) => (
                    <td key={tier.id} className="text-center py-4 px-6">
                      {tier.limits.priority_support ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-400 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Can I change my plan at any time?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                What happens if I exceed my plan limits?
              </h3>
              <p className="text-gray-600">
                We'll notify you when you're approaching your limits. You can upgrade your plan or purchase additional capacity as needed.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! Our Free plan allows you to try our service with 1 claim per month. No credit card required.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and bank transfers for annual plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
