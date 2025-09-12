"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, ExternalLink, CheckCircle, AlertCircle } from "lucide-react";

interface BOR286PostalScreenProps {
  onBack: () => void;
  onContinue: (chargeReference: string) => void;
}

export function BOR286PostalScreen({ onBack, onContinue }: BOR286PostalScreenProps) {
  const [chargeReference, setChargeReference] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const validateChargeReference = (value: string) => {
    // BOR286 charge reference format: typically 12-15 characters, alphanumeric
    const isValidFormat = /^[A-Z0-9]{12,15}$/.test(value);
    setIsValid(isValidFormat);
    return isValidFormat;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setChargeReference(value);
    if (value.length > 0) {
      validateChargeReference(value);
    } else {
      setIsValid(null);
    }
  };

  const handleContinue = () => {
    if (isValid) {
      onContinue(chargeReference);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <FileText className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">BOR286 Postal Screen</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Enter your BOR286 charge reference number to proceed with your postal import duty refund claim.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Charge Reference Form
          </CardTitle>
          <CardDescription>
            Your BOR286 charge reference is required to process your postal import duty refund claim.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="chargeReference" className="text-base font-medium">
              BOR286 Charge Reference Number
            </Label>
            <div className="relative">
              <Input
                id="chargeReference"
                type="text"
                placeholder="Enter your BOR286 charge reference"
                value={chargeReference}
                onChange={handleInputChange}
                className={`pr-10 ${
                  isValid === true 
                    ? 'border-green-500 focus:ring-green-500' 
                    : isValid === false 
                    ? 'border-red-500 focus:ring-red-500' 
                    : ''
                }`}
                maxLength={15}
              />
              {isValid === true && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
              )}
              {isValid === false && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
              )}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {chargeReference.length}/15 characters
              </span>
              {isValid === true && (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  Valid Format
                </Badge>
              )}
              {isValid === false && (
                <Badge variant="destructive">
                  Invalid Format
                </Badge>
              )}
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Format Requirements:</strong> BOR286 charge references are typically 12-15 characters long and contain only letters and numbers (no spaces or special characters).
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Need Help Finding Your Charge Reference?</h3>
            <p className="text-blue-800 text-sm mb-3">
              Your BOR286 charge reference can usually be found on:
            </p>
            <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
              <li>Royal Mail customs charge notification</li>
              <li>Parcel delivery receipt</li>
              <li>Email confirmation from Royal Mail</li>
              <li>Online tracking information</li>
            </ul>
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
            Helpful documents and links for your BOR286 postal claim
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => window.open('/docs/bor286-guide.pdf', '_blank')}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="font-medium">BOR286 Guide</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Complete guide to understanding BOR286 postal charges
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => window.open('https://www.gov.uk/guidance/import-duty-and-vat-when-sending-goods-to-the-uk', '_blank')}
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="font-medium">HMRC Guidance</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Official HMRC guidance on import duty and VAT
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Wizard
        </Button>
        <Button 
          onClick={handleContinue}
          disabled={!isValid}
          className="min-w-[120px]"
        >
          Continue with Claim
        </Button>
      </div>
    </div>
  );
}
