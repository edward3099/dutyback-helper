"use client";

import { useClaimWizard } from "@/hooks/useWizard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { CourierSelector } from "@/components/courier/CourierSelector";
import { FieldError } from "@/components/validation/ValidationDisplay";

export function Step4Identifiers() {
  const { claimData, updateClaimData, validation } = useClaimWizard();
  const [showHelp, setShowHelp] = useState(false);

  const handleMRNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateClaimData({ mrn: e.target.value });
  };

  const handleEORIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateClaimData({ eori: e.target.value });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const mrnTemplate = `Dear [Courier Name],

I am writing to request the Movement Reference Number (MRN) and Economic Operators Registration and Identification (EORI) number for my recent import.

Package details:
- Tracking number: [Your tracking number]
- Delivery date: [Delivery date]
- Recipient: [Your name and address]

Please provide:
1. The MRN (18-character reference number)
2. The EORI number associated with this import

This information is required for my HMRC duty refund claim.

Thank you for your assistance.

Best regards,
[Your name]
[Your contact details]`;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Enter your MRN and EORI numbers
        </h3>
        <p className="text-gray-600">
          These are required for your HMRC claim. Don't have them? We'll help you get them.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MRN Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              MRN Number
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 p-1 h-auto"
                onClick={() => setShowHelp(!showHelp)}
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Movement Reference Number (18 characters)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="mrn">MRN</Label>
              <Input
                id="mrn"
                type="text"
                placeholder="18GB123456789012345"
                value={claimData.mrn}
                onChange={handleMRNChange}
                maxLength={18}
                className="font-mono"
              />
              <FieldError field="mrn" errors={validation.errors} />
              <p className="text-xs text-gray-500">
                {claimData.mrn.length}/18 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* EORI Input */}
        <Card>
          <CardHeader>
            <CardTitle>EORI Number</CardTitle>
            <CardDescription>
              Economic Operators Registration and Identification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="eori">EORI</Label>
              <Input
                id="eori"
                type="text"
                placeholder="GB123456789012345"
                value={claimData.eori}
                onChange={handleEORIChange}
                className="font-mono"
              />
              <FieldError field="eori" errors={validation.errors} />
              <p className="text-xs text-gray-500">
                Usually starts with GB followed by 9 digits
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Courier Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help Getting Your Numbers?</CardTitle>
          <CardDescription>
            Select your courier to get specific instructions and templates for obtaining your MRN and EORI numbers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CourierSelector
            selectedCourier={claimData.courier}
            onCourierSelect={(courier) => updateClaimData({ courier })}
          />
        </CardContent>
      </Card>

      {/* Help Section */}
      {showHelp && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How to get your MRN and EORI numbers</CardTitle>
            <CardDescription className="text-blue-800">
              These numbers are usually provided by your courier or can be found on your customs documentation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Where to find them:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Customs declaration form (C88)</li>
                <li>• Courier's tracking page</li>
                <li>• Email from courier with customs charges</li>
                <li>• HMRC online services (if you have access)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Request template:</h4>
              <div className="bg-white p-3 rounded border">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">{mrnTemplate}</pre>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => copyToClipboard(mrnTemplate)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Template
                </Button>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" asChild>
                <a href="https://www.gov.uk/guidance/import-vat-and-duty" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  HMRC Guidance
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href="https://www.gov.uk/eori" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  EORI Information
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Status */}
      {claimData.mrn && claimData.eori && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">✓</span>
            </div>
            <p className="text-green-800 font-medium">
              Both MRN and EORI numbers are provided
            </p>
          </div>
        </div>
      )}

      {(!claimData.mrn || !claimData.eori) && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-xs">!</span>
            </div>
            <p className="text-yellow-800 font-medium">
              Both MRN and EORI numbers are required to proceed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
