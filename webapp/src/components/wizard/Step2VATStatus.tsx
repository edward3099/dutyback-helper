"use client";

import { useClaimWizard } from "@/hooks/useWizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Calculator } from "lucide-react";
import ReactBitsSpotlightCard from "@/components/ui/ReactBitsSpotlightCard";

export function Step2VATStatus() {
  const { claimData, updateClaimData, openBranchScreen } = useClaimWizard();

  const handleVATStatusSelect = (isVATRegistered: boolean) => {
    updateClaimData({ isVATRegistered });
  };

  const handleVATReturnClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openBranchScreen('vat-return');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Are you VAT registered?
        </h3>
        <p className="text-gray-600">
          This affects which HMRC form you'll need to use for your claim.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VAT Registered Option */}
        <ReactBitsSpotlightCard
          isSelected={claimData.isVATRegistered === true}
          onClick={() => handleVATStatusSelect(true)}
          variant="vat"
        >
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Yes, VAT Registered</h3>
            <p className="text-sm opacity-80 mb-4">
              I have a valid VAT registration number
            </p>
            <ul className="text-xs space-y-1 text-left mb-4">
              <li>• You have a VAT registration number</li>
              <li>• You submit VAT returns to HMRC</li>
              <li>• You can claim VAT on business expenses</li>
              <li>• Different claim process applies</li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVATReturnClick}
              className="w-full flex items-center gap-2 text-xs"
            >
              <Calculator className="w-3 h-3" />
              VAT Return Information
            </Button>
          </div>
        </ReactBitsSpotlightCard>

        {/* Not VAT Registered Option */}
        <ReactBitsSpotlightCard
          isSelected={claimData.isVATRegistered === false}
          onClick={() => handleVATStatusSelect(false)}
          variant="vat"
        >
          <div className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No, Not VAT Registered</h3>
            <p className="text-sm opacity-80 mb-4">
              I don't have a VAT registration number
            </p>
            <ul className="text-xs space-y-1 text-left">
              <li>• You don't have a VAT number</li>
              <li>• You don't submit VAT returns</li>
              <li>• You're a private individual or small business</li>
              <li>• Different claim process applies</li>
            </ul>
          </div>
        </ReactBitsSpotlightCard>
      </div>

      {claimData.isVATRegistered !== null && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-green-800 font-medium">
              Selected: {claimData.isVATRegistered ? 'VAT Registered' : 'Not VAT Registered'}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Need help determining your VAT status?</h4>
        <p className="text-blue-800 text-sm">
          If you're unsure about your VAT registration status, you can check with HMRC or look for your VAT number on invoices and correspondence.
        </p>
      </div>
    </div>
  );
}
