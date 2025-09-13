"use client";

import { useClaimWizard } from "@/hooks/useWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, ExternalLink, CheckCircle, AlertCircle, Mail } from "lucide-react";

export function BranchSellerRefund() {
  const { claimData, updateClaimData, closeBranchScreen } = useClaimWizard();

  const handleAcknowledgmentChange = (checked: boolean) => {
    updateClaimData({
      sellerRefundAcknowledged: checked
    });
  };

  const handleContinue = () => {
    if (claimData.sellerRefundAcknowledged) {
      closeBranchScreen();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Seller Refund (Low Value Goods)
        </h3>
        <p className="text-gray-600">
          For goods under £135, try requesting a refund directly from the seller first
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> For goods under £135, the seller may have already 
          refunded the VAT. Try contacting them directly before submitting an HMRC claim.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Why Try Seller Refund First?
          </CardTitle>
          <CardDescription>
            Understanding the seller refund process for low value goods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Faster Resolution</h4>
                <p className="text-gray-600 text-sm">
                  Sellers can often process refunds much faster than HMRC claims
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Simpler Process</h4>
                <p className="text-gray-600 text-sm">
                  No need to complete HMRC forms or provide detailed evidence
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-semibold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Direct Contact</h4>
                <p className="text-gray-600 text-sm">
                  You can contact the seller directly through their customer service
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="text-yellow-900">What to Do Next</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-800">1. Contact the Seller</h4>
            <p className="text-yellow-700 text-sm">
              Reach out to the seller or marketplace to request a VAT refund
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-800">2. Provide Evidence</h4>
            <p className="text-yellow-700 text-sm">
              Show them proof of the overcharged VAT amount
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-800">3. Keep Records</h4>
            <p className="text-yellow-700 text-sm">
              Save all correspondence in case you need to escalate to HMRC
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-semibold text-yellow-800">4. If Seller Refuses</h4>
            <p className="text-yellow-700 text-sm">
              If the seller won't refund, you can still submit an HMRC claim
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">HMRC Guidance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-blue-800">Official Rules</h4>
            <p className="text-blue-700 text-sm">
              For detailed information about seller refund rules, see the official HMRC guidance
            </p>
            <Button variant="outline" size="sm" className="mt-2">
              <ExternalLink className="w-4 h-4 mr-2" />
              View HMRC Seller Refund Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="seller_refund_acknowledged"
          checked={claimData.sellerRefundAcknowledged || false}
          onCheckedChange={handleAcknowledgmentChange}
        />
        <Label htmlFor="seller_refund_acknowledged" className="text-sm">
          I understand that I should try contacting the seller first, and will proceed to HMRC claim if needed
        </Label>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={closeBranchScreen}>
          Back to Wizard
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!claimData.sellerRefundAcknowledged}
        >
          Continue to Evidence
        </Button>
      </div>
    </div>
  );
}
