"use client";

import { useClaimWizard } from "@/hooks/useWizard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Calculator } from "lucide-react";

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* VAT Registered Option */}
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            claimData.isVATRegistered === true 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:shadow-md'
          }`}
          onClick={() => handleVATStatusSelect(true)}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-xl">Yes, VAT Registered</CardTitle>
            <CardDescription>
              I have a valid VAT registration number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2 mb-4">
              <li>• You have a VAT registration number</li>
              <li>• You submit VAT returns to HMRC</li>
              <li>• You can claim VAT on business expenses</li>
              <li>• Different claim process applies</li>
            </ul>
            <Button
              variant="outline"
              size="sm"
              onClick={handleVATReturnClick}
              className="w-full flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              VAT Return Information
            </Button>
          </CardContent>
        </Card>

        {/* Not VAT Registered Option */}
        <Card 
          className={`cursor-pointer transition-all duration-200 ${
            claimData.isVATRegistered === false 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:shadow-md'
          }`}
          onClick={() => handleVATStatusSelect(false)}
        >
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-6 h-6 text-orange-600" />
            </div>
            <CardTitle className="text-xl">No, Not VAT Registered</CardTitle>
            <CardDescription>
              I don't have a VAT registration number
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• You don't have a VAT number</li>
              <li>• You don't submit VAT returns</li>
              <li>• You're a private individual or small business</li>
              <li>• Different claim process applies</li>
            </ul>
          </CardContent>
        </Card>
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
