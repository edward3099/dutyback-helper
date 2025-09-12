"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingBag, ExternalLink, CheckCircle, AlertTriangle, Info, Store } from "lucide-react";

interface SellerRefundInfoScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

const marketplaces = [
  {
    name: "Amazon",
    description: "Amazon marketplace seller refund process",
    color: "bg-orange-100 text-orange-800",
    icon: "A",
    steps: [
      "Log into your Amazon Seller Central account",
      "Navigate to Orders > Manage Orders",
      "Find the specific order and click 'Refund'",
      "Select 'Import Duty Refund' as the reason",
      "Submit the refund request with supporting documentation"
    ]
  },
  {
    name: "eBay",
    description: "eBay marketplace seller refund process",
    color: "bg-blue-100 text-blue-800",
    icon: "E",
    steps: [
      "Access your eBay Seller Hub",
      "Go to Orders > Manage Orders",
      "Find the order and select 'Issue Refund'",
      "Choose 'Import Duty Overcharge' as the reason",
      "Upload supporting documents and submit"
    ]
  },
  {
    name: "Etsy",
    description: "Etsy marketplace seller refund process",
    color: "bg-green-100 text-green-800",
    icon: "E",
    steps: [
      "Log into your Etsy Shop Manager",
      "Navigate to Orders & Shipping",
      "Find the order and click 'Issue Refund'",
      "Select 'Import Duty Refund' as the reason",
      "Provide documentation and submit the request"
    ]
  },
  {
    name: "Other Marketplace",
    description: "General marketplace seller refund process",
    color: "bg-gray-100 text-gray-800",
    icon: "O",
    steps: [
      "Contact the marketplace seller support team",
      "Explain the import duty overcharge situation",
      "Provide order details and supporting documentation",
      "Request a refund for the overcharged amount",
      "Follow up on the refund status"
    ]
  }
];

export function SellerRefundInfoScreen({ onBack, onContinue }: SellerRefundInfoScreenProps) {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <ShoppingBag className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-900">Seller Refund Information</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get guidance on how to request refunds from different marketplaces for overcharged import duties.
        </p>
      </div>

      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Important:</strong> If you purchased from a marketplace seller, you may be able to request a refund directly from the seller or marketplace. This is often faster than going through HMRC.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              When to Use Seller Refunds
            </CardTitle>
            <CardDescription>
              Situations where seller refunds are appropriate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Recent Purchase</h4>
                  <p className="text-sm text-gray-600">
                    The purchase was made within the last 30 days
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Clear Overcharge</h4>
                  <p className="text-sm text-gray-600">
                    You have clear evidence of import duty overcharge
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Responsive Seller</h4>
                  <p className="text-sm text-gray-600">
                    The seller is responsive and cooperative
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
              When to Use HMRC Instead
            </CardTitle>
            <CardDescription>
              Situations where HMRC refunds are more appropriate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Older Purchase</h4>
                  <p className="text-sm text-gray-600">
                    The purchase was made more than 30 days ago
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Unresponsive Seller</h4>
                  <p className="text-sm text-gray-600">
                    The seller is not responding to refund requests
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Complex Case</h4>
                  <p className="text-sm text-gray-600">
                    The overcharge involves complex customs calculations
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Marketplace-Specific Instructions
          </CardTitle>
          <CardDescription>
            Step-by-step instructions for requesting refunds from different marketplaces
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketplaces.map((marketplace) => (
              <Card key={marketplace.name} className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${marketplace.color} rounded-lg flex items-center justify-center`}>
                      <span className="font-bold text-lg">{marketplace.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{marketplace.name}</CardTitle>
                      <CardDescription className="text-sm">{marketplace.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {marketplace.steps.map((step, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
                        </div>
                        <p className="text-sm text-gray-700">{step}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
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
            Helpful links and documents for marketplace refunds
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => window.open('https://sellercentral.amazon.co.uk/', '_blank')}
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="font-medium">Amazon Seller Central</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Access your Amazon seller account
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => window.open('https://www.ebay.co.uk/sh/l', '_blank')}
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="font-medium">eBay Seller Hub</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Manage your eBay seller account
              </span>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => window.open('https://www.etsy.com/uk/shop', '_blank')}
            >
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="font-medium">Etsy Shop Manager</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                Access your Etsy shop dashboard
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
