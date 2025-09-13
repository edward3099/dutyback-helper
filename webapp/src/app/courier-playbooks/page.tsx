"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CourierPlaybook } from "@/components/wizard/CourierPlaybook";
import { ArrowLeft, HelpCircle, ExternalLink } from "lucide-react";
import Link from "next/link";

const couriers = [
  {
    id: 'DHL',
    name: 'DHL',
    description: 'International express delivery',
    color: 'bg-yellow-100 text-yellow-800',
    icon: 'D',
    responseTime: '2-3 business days'
  },
  {
    id: 'FedEx',
    name: 'FedEx',
    description: 'Express and ground shipping',
    color: 'bg-purple-100 text-purple-800',
    icon: 'F',
    responseTime: '1-2 business days'
  },
  {
    id: 'UPS',
    name: 'UPS',
    description: 'Package delivery and logistics',
    color: 'bg-brown-100 text-brown-800',
    icon: 'U',
    responseTime: '2-4 business days'
  }
];

export default function CourierPlaybooksPage() {
  const [selectedCourier, setSelectedCourier] = useState<'DHL' | 'FedEx' | 'UPS' | null>(null);

  const handleCourierSelect = (courier: 'DHL' | 'FedEx' | 'UPS') => {
    setSelectedCourier(courier);
  };

  const handleClose = () => {
    setSelectedCourier(null);
  };

  if (selectedCourier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <CourierPlaybook courier={selectedCourier} onClose={handleClose} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Courier Playbooks
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get step-by-step instructions for obtaining your MRN and EORI numbers from major couriers. 
            These numbers are essential for your HMRC duty refund claim.
          </p>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                What You'll Get
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-blue-800 text-sm space-y-2">
                <li>• Step-by-step instructions</li>
                <li>• Email templates</li>
                <li>• Contact information</li>
                <li>• Pro tips and best practices</li>
                <li>• Response time expectations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-900">Why You Need These</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-green-800 text-sm space-y-2">
                <li>• MRN: 18-character reference number</li>
                <li>• EORI: Economic operator ID</li>
                <li>• Required for HMRC claims</li>
                <li>• Proves your import details</li>
                <li>• Enables duty refund processing</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-900">Quick Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-yellow-800 text-sm space-y-2">
                <li>• Keep all correspondence</li>
                <li>• Be specific in your requests</li>
                <li>• Follow up if no response</li>
                <li>• Save reference numbers</li>
                <li>• Contact during business hours</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Courier Selection */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Select Your Courier</CardTitle>
              <CardDescription className="text-center">
                Choose your courier to get specific instructions and templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {couriers.map((courier) => (
                  <Card 
                    key={courier.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105"
                    onClick={() => handleCourierSelect(courier.id as 'DHL' | 'FedEx' | 'UPS')}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 ${courier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <span className="font-bold text-2xl">{courier.icon}</span>
                      </div>
                      <CardTitle className="text-xl">{courier.name}</CardTitle>
                      <CardDescription>{courier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          Average response time: <strong>{courier.responseTime}</strong>
                        </p>
                        <Button className="w-full">
                          Get Playbook
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" asChild>
                  <a href="https://www.gov.uk/guidance/import-vat-and-duty" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    HMRC Import Duty Guidance
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://www.gov.uk/eori" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    EORI Information
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="https://www.gov.uk/guidance/claim-a-refund-of-import-vat-and-duty" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    HMRC Refund Claims
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/wizard">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Start Your Claim
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
