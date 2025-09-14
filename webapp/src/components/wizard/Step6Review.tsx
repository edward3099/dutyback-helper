"use client";

import { useClaimWizard } from "@/hooks/useWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, FileText, Download, Mail } from "lucide-react";
import { ClaimPackExport } from "@/components/export/ClaimPackExport";
import { useState } from "react";

export function Step6Review() {
  const { claimData } = useClaimWizard();
  const [showExport, setShowExport] = useState(false);

  const getChannelDisplay = (channel: string | null) => {
    switch (channel) {
      case 'courier': return 'Courier Delivery';
      case 'postal': return 'Postal Delivery';
      default: return 'Not selected';
    }
  };

  const getVATStatusDisplay = (isVATRegistered: boolean | null) => {
    switch (isVATRegistered) {
      case true: return 'VAT Registered';
      case false: return 'Not VAT Registered';
      default: return 'Not selected';
    }
  };

  const getClaimTypeDisplay = (claimType: string | null) => {
    switch (claimType) {
      case 'overpayment': return 'Overpayment';
      case 'rejected': return 'Rejected Import';
      case 'withdrawal': return 'Withdrawal';
      case 'low_value': return 'Low Value (≤£135)';
      default: return 'Not selected';
    }
  };

  const getEvidenceSummary = () => {
    const evidence = claimData.evidence;
    const total = Object.keys(evidence).length;
    const completed = Object.values(evidence).filter(Boolean).length;
    return `${completed}/${total} documents`;
  };

  const getHMRCProcess = () => {
    if (claimData.channel === 'postal') {
      return 'BOR286 Postal Process';
    } else if (claimData.isVATRegistered) {
      return 'VAT Return Process';
    } else {
      return 'Standard Refund Process';
    }
  };

  const getTimeLimit = () => {
    switch (claimData.claimType) {
      case 'overpayment': return '3 years from payment date';
      case 'rejected': return '1 year from rejection date';
      case 'withdrawal': return '90 days from withdrawal date';
      case 'low_value': return 'May not be eligible';
      default: return 'Varies by claim type';
    }
  };

  const isReadyToSubmit = () => {
    return claimData.channel && 
           claimData.isVATRegistered !== null && 
           claimData.claimType && 
           claimData.mrn && 
           claimData.eori &&
           Object.values(claimData.evidence).some(Boolean);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Review Your Claim
        </h3>
        <p className="text-gray-600">
          Please review all the information below before submitting your claim.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Claim Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Claim Details
            </CardTitle>
            <CardDescription>
              Basic information about your claim
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Channel:</span>
              <Badge variant={claimData.channel ? "default" : "secondary"}>
                {getChannelDisplay(claimData.channel)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">VAT Status:</span>
              <Badge variant={claimData.isVATRegistered !== null ? "default" : "secondary"}>
                {getVATStatusDisplay(claimData.isVATRegistered)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Claim Type:</span>
              <Badge variant={claimData.claimType ? "default" : "secondary"}>
                {getClaimTypeDisplay(claimData.claimType)}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">HMRC Process:</span>
              <span className="text-sm text-gray-900">{getHMRCProcess()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Time Limit:</span>
              <span className="text-sm text-gray-900">{getTimeLimit()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Identifiers */}
        <Card>
          <CardHeader>
            <CardTitle>Identifiers</CardTitle>
            <CardDescription>
              Required reference numbers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm font-medium text-gray-600 block mb-1">MRN:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {claimData.mrn || 'Not provided'}
              </code>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600 block mb-1">EORI:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                {claimData.eori || 'Not provided'}
              </code>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Evidence Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Evidence Summary</CardTitle>
          <CardDescription>
            Documents you have available ({getEvidenceSummary()})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(claimData.evidence).map(([key, hasDocument]) => (
              <div key={key} className="flex items-center space-x-2">
                {hasDocument ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">What happens next?</CardTitle>
          <CardDescription className="text-blue-800">
            After submitting your claim, here's what to expect:
          </CardDescription>
        </CardHeader>
        <CardContent className="text-blue-800 text-sm space-y-2">
          <p>1. <strong>Claim Pack Generated:</strong> We'll create your complete HMRC claim pack</p>
          <p>2. <strong>Download Documents:</strong> Get your claim form and evidence checklist</p>
          <p>3. <strong>Submit to HMRC:</strong> Send your claim using the correct HMRC process</p>
          <p>4. <strong>Track Progress:</strong> Monitor your claim status in your dashboard</p>
          <p>5. <strong>Receive Refund:</strong> HMRC will process and refund your overpaid charges</p>
        </CardContent>
      </Card>

      {/* Ready Status */}
      {isReadyToSubmit() ? (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
            <p className="text-green-800 font-medium">
              Your claim is ready to submit! All required information has been provided.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-yellow-500 mr-3" />
            <p className="text-yellow-800 font-medium">
              Please complete all required steps before submitting your claim.
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={() => setShowExport(true)}
          className="flex items-center"
          disabled={!isReadyToSubmit()}
        >
          <Download className="w-4 h-4 mr-2" />
          Download Claim Pack
        </Button>
        <Button variant="outline" className="flex items-center">
          <Mail className="w-4 h-4 mr-2" />
          Email to Me
        </Button>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Export Claim Pack</h2>
                <Button 
                  variant="outline" 
                  onClick={() => setShowExport(false)}
                >
                  Close
                </Button>
              </div>
              <ClaimPackExport 
                claimData={claimData}
                evidenceFiles={claimData.evidenceFiles || []}
                onExportComplete={() => setShowExport(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
