"use client";

import { useClaimWizard } from "@/hooks/useWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";

export function BranchBOR286() {
  const { claimData, updateClaimData, closeBranchScreen } = useClaimWizard();

  const handleChargeReferenceChange = (value: string) => {
    updateClaimData({
      bor286ChargeReference: value
    });
  };

  const handleContinue = () => {
    if (claimData.bor286ChargeReference) {
      closeBranchScreen();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Postal Import Claim (BOR286)
        </h3>
        <p className="text-gray-600">
          For goods imported through postal services, you'll need to use HMRC form BOR286
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> Postal claims have different requirements than courier claims. 
          You'll need a charge reference number from your postal service.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Required Information
          </CardTitle>
          <CardDescription>
            Please provide the charge reference number from your postal service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="charge_reference">Charge Reference Number</Label>
            <Input
              id="charge_reference"
              placeholder="Enter charge reference from postal service"
              value={claimData.bor286ChargeReference || ''}
              onChange={(e) => handleChargeReferenceChange(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              This can usually be found on your postal service receipt or customs charge notice
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-800">1. Download BOR286 Form</h4>
            <p className="text-blue-700 text-sm">
              You'll need to complete and submit HMRC form BOR286
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              <ExternalLink className="w-4 h-4 mr-2" />
              Download BOR286 Form
            </Button>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-800">2. Gather Evidence</h4>
            <p className="text-blue-700 text-sm">
              You'll need your invoice and proof of payment
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-800">3. Submit to HMRC</h4>
            <p className="text-blue-700 text-sm">
              Send the completed form and evidence to HMRC
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={closeBranchScreen}>
          Back to Wizard
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!claimData.bor286ChargeReference}
        >
          Continue to Evidence
        </Button>
      </div>
    </div>
  );
}
