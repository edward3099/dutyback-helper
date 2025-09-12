"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, FileText, ExternalLink, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface VATReturnInfoScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

export function VATReturnInfoScreen({ onBack, onContinue }: VATReturnInfoScreenProps) {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Calculator className="w-8 h-8 text-green-600" />
          <h1 className="text-3xl font-bold text-gray-900">VAT Return Information</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Important information about VAT returns and how they affect your import duty refund claim.
        </p>
      </div>

      <Alert className="border-amber-200 bg-amber-50">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <strong>Important:</strong> If you are VAT registered, you may need to adjust your VAT return to reflect the refunded import VAT. Please read the guidance below carefully.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              What You Need to Know
            </CardTitle>
            <CardDescription>
              Key points about VAT returns and import duty refunds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">VAT Registration Impact</h4>
                  <p className="text-sm text-gray-600">
                    If you're VAT registered, any refunded import VAT must be declared on your VAT return.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Timing Considerations</h4>
                  <p className="text-sm text-gray-600">
                    You should receive your refund before filing your next VAT return to avoid complications.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-600 text-xs font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Record Keeping</h4>
                  <p className="text-sm text-gray-600">
                    Keep all documentation related to your refund claim for your VAT records.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              Important Considerations
            </CardTitle>
            <CardDescription>
              Things to consider before proceeding with your claim
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-900 mb-1">VAT Return Deadline</h4>
                <p className="text-sm text-amber-800">
                  Ensure you can process the refund before your next VAT return is due.
                </p>
              </div>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Professional Advice</h4>
                <p className="text-sm text-blue-800">
                  Consider consulting with an accountant if you're unsure about VAT implications.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">Documentation</h4>
                <p className="text-sm text-green-800">
                  Ensure you have all required documents before submitting your claim.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Next Steps
          </CardTitle>
          <CardDescription>
            What happens after you proceed with your VAT-related claim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Submit Claim</h4>
              <p className="text-sm text-gray-600">
                Complete and submit your import duty refund claim
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Receive Refund</h4>
              <p className="text-sm text-gray-600">
                HMRC processes your claim and issues the refund
              </p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Update VAT Return</h4>
              <p className="text-sm text-gray-600">
                Declare the refunded VAT on your next VAT return
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5" />
            Additional Resources
          </CardTitle>
          <CardDescription>
            Helpful links and documents for VAT-related claims
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => window.open('https://www.gov.uk/vat-returns', '_blank')}
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="font-medium">VAT Returns Guide</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Official HMRC guidance on VAT returns
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => window.open('https://www.gov.uk/guidance/import-duty-and-vat-when-sending-goods-to-the-uk', '_blank')}
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="font-medium">Import VAT Guidance</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                HMRC guidance on import VAT and duty
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Wizard
        </Button>
        <Button onClick={onContinue} className="min-w-[120px]">
          I Understand, Continue
        </Button>
      </div>
    </div>
  );
}
