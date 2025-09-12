"use client";

import { useClaimWizard } from "@/hooks/useWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, DollarSign, Package, ShoppingBag } from "lucide-react";

export function Step3ClaimType() {
  const { claimData, updateClaimData, openBranchScreen } = useClaimWizard();

  const handleClaimTypeSelect = (claimType: 'overpayment' | 'rejected' | 'withdrawal' | 'low_value') => {
    updateClaimData({ claimType });
  };

  const handleSellerRefundClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openBranchScreen('seller-refund');
  };

  const claimTypes = [
    {
      id: 'overpayment' as const,
      title: 'Overpayment',
      description: 'You were charged too much duty/VAT',
      icon: DollarSign,
      color: 'bg-red-100 text-red-600',
      details: [
        'You paid more than the correct amount',
        'HMRC charged you incorrectly',
        'You want a refund of the excess',
        'Most common type of claim'
      ]
    },
    {
      id: 'rejected' as const,
      title: 'Rejected Import',
      description: 'Your package was rejected by customs',
      icon: AlertCircle,
      color: 'bg-orange-100 text-orange-600',
      details: [
        'Package was refused entry to UK',
        'You want a refund of duties paid',
        'Goods were returned to sender',
        'Different time limits apply'
      ]
    },
    {
      id: 'withdrawal' as const,
      title: 'Withdrawal',
      description: 'You withdrew your import declaration',
      icon: Clock,
      color: 'bg-blue-100 text-blue-600',
      details: [
        'You cancelled your import',
        'Goods were not imported',
        'You want a refund of duties',
        'Must be within 90 days'
      ]
    },
    {
      id: 'low_value' as const,
      title: 'Low Value (≤£135)',
      description: 'Package value is £135 or less',
      icon: Package,
      color: 'bg-green-100 text-green-600',
      details: [
        'Package value is £135 or less',
        'Different rules apply',
        'Simplified process',
        'May not be eligible for refund'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          What type of claim do you want to make?
        </h3>
        <p className="text-gray-600">
          This determines the specific process and time limits for your claim.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {claimTypes.map((type) => {
          const Icon = type.icon;
          return (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all duration-200 ${
                claimData.claimType === type.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleClaimTypeSelect(type.id)}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto w-12 h-12 ${type.color} rounded-full flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">{type.title}</CardTitle>
                <CardDescription>
                  {type.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2 mb-4">
                  {type.details.map((detail, index) => (
                    <li key={index}>• {detail}</li>
                  ))}
                </ul>
                {type.id === 'overpayment' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSellerRefundClick}
                    className="w-full flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Try Seller Refund First
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {claimData.claimType && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-green-800 font-medium">
              Selected: {claimTypes.find(t => t.id === claimData.claimType)?.title}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-900 mb-2">Important Time Limits</h4>
        <div className="text-yellow-800 text-sm space-y-1">
          <p><strong>Overpayments:</strong> 3 years from payment date</p>
          <p><strong>Rejected imports:</strong> 1 year from rejection date</p>
          <p><strong>Withdrawals:</strong> 90 days from withdrawal date</p>
          <p><strong>Low value:</strong> May not be eligible for refund</p>
        </div>
      </div>
    </div>
  );
}
