"use client";

import { useClaimWizard } from "@/hooks/useWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";

export function BranchVATReturn() {
  const { closeBranchScreen } = useClaimWizard();

  const handleContinue = () => {
    closeBranchScreen();
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          VAT Return Adjustment
        </h3>
        <p className="text-gray-600">
          As a VAT registered business, you can claim import VAT through your VAT return
        </p>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Good news:</strong> VAT registered businesses can claim import VAT directly 
          through their VAT return, which is often simpler than other HMRC processes.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            How VAT Return Claims Work
          </CardTitle>
          <CardDescription>
            Understanding the VAT return process for import VAT claims
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Calculate Correct VAT</h4>
                <p className="text-gray-600 text-sm">
                  Determine the correct VAT amount that should have been charged on your import
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Adjust Your VAT Return</h4>
                <p className="text-gray-600 text-sm">
                  Include the overpaid VAT as an adjustment in your next VAT return
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Provide Evidence</h4>
                <p className="text-gray-600 text-sm">
                  Keep your import documentation and invoices as evidence
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-900">Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-green-800">VAT Return Period</h4>
            <p className="text-green-700 text-sm">
              You can claim import VAT in any VAT return period within 3 years of the import
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-green-800">Documentation Required</h4>
            <p className="text-green-700 text-sm">
              Keep your import invoices and customs documentation as evidence
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-green-800">HMRC Guidance</h4>
            <p className="text-green-700 text-sm">
              For detailed guidance on VAT return adjustments, see the official HMRC guidance
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              <ExternalLink className="w-4 h-4 mr-2" />
              View HMRC VAT Return Guidance
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={closeBranchScreen}>
          Back to Wizard
        </Button>
        <Button onClick={handleContinue}>
          Continue to Evidence
        </Button>
      </div>
    </div>
  );
}
