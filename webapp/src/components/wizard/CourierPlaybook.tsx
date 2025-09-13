"use client";

import { useState } from "react";
import { useClaimWizard } from "@/hooks/useWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  Clock, 
  Phone, 
  Globe,
  FileText,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

interface CourierPlaybookProps {
  courier: 'DHL' | 'FedEx' | 'UPS';
  onClose: () => void;
}

interface CourierInfo {
  name: string;
  contact: string;
  portal: string;
  phone: string;
  template: string;
  instructions: string[];
  tips: string[];
  averageResponseTime: string;
}

const COURIER_INFO: Record<string, CourierInfo> = {
  DHL: {
    name: 'DHL',
    contact: 'customercare@dhl.com',
    portal: 'https://www.dhl.com/contact-us',
    phone: '0344 248 0844',
    template: `Subject: Request for MRN and EORI for Import Duty Refund

Dear DHL Customer Service,

I am writing to request the Movement Reference Number (MRN) and Economic Operator Registration and Identification (EORI) number for a recent import that I believe was overcharged for VAT and duty.

Import Details:
- Tracking Number: [TRACKING_NUMBER]
- Import Date: [IMPORT_DATE]
- Value: £[VALUE]
- Description: [DESCRIPTION]

I need these details to submit a refund claim to HMRC. Please provide:
1. The 18-character MRN
2. The declarant's EORI number

Thank you for your assistance.

Best regards,
[YOUR_NAME]
[YOUR_EMAIL]
[YOUR_PHONE]`,
    instructions: [
      'Contact DHL Customer Service via email or phone',
      'Provide your tracking number and import details',
      'Request both MRN and EORI numbers',
      'Keep a record of all correspondence',
      'Follow up if you don\'t receive a response within 5 business days'
    ],
    tips: [
      'DHL typically responds within 2-3 business days',
      'Be specific about needing both MRN and EORI',
      'Include your tracking number in all communications',
      'Keep copies of all emails and reference numbers'
    ],
    averageResponseTime: '2-3 business days'
  },
  FedEx: {
    name: 'FedEx',
    contact: 'customer.service@fedex.com',
    portal: 'https://www.fedex.com/en-gb/customer-support.html',
    phone: '0345 600 6000',
    template: `Subject: Request for MRN and EORI for Import Duty Refund

Dear FedEx Customer Service,

I am writing to request the Movement Reference Number (MRN) and Economic Operator Registration and Identification (EORI) number for a recent import that I believe was overcharged for VAT and duty.

Import Details:
- Tracking Number: [TRACKING_NUMBER]
- Import Date: [IMPORT_DATE]
- Value: £[VALUE]
- Description: [DESCRIPTION]

I need these details to submit a refund claim to HMRC. Please provide:
1. The 18-character MRN
2. The declarant's EORI number

Thank you for your assistance.

Best regards,
[YOUR_NAME]
[YOUR_EMAIL]
[YOUR_PHONE]`,
    instructions: [
      'Use FedEx Customer Service portal or email',
      'Provide your tracking number and shipment details',
      'Request both MRN and EORI numbers',
      'Use their online support system for faster response',
      'Follow up via phone if email response is slow'
    ],
    tips: [
      'FedEx has a good online support system',
      'Try their live chat feature for immediate assistance',
      'Be prepared to provide detailed shipment information',
      'Keep all reference numbers and case IDs'
    ],
    averageResponseTime: '1-2 business days'
  },
  UPS: {
    name: 'UPS',
    contact: 'customer.service@ups.com',
    portal: 'https://www.ups.com/gb/en/support/contact-us.page',
    phone: '03457 877 877',
    template: `Subject: Request for MRN and EORI for Import Duty Refund

Dear UPS Customer Service,

I am writing to request the Movement Reference Number (MRN) and Economic Operator Registration and Identification (EORI) number for a recent import that I believe was overcharged for VAT and duty.

Import Details:
- Tracking Number: [TRACKING_NUMBER]
- Import Date: [IMPORT_DATE]
- Value: £[VALUE]
- Description: [DESCRIPTION]

I need these details to submit a refund claim to HMRC. Please provide:
1. The 18-character MRN
2. The declarant's EORI number

Thank you for your assistance.

Best regards,
[YOUR_NAME]
[YOUR_EMAIL]
[YOUR_PHONE]`,
    instructions: [
      'Contact UPS Customer Service via their support portal',
      'Provide your tracking number and import details',
      'Request both MRN and EORI numbers',
      'Use their online case management system',
      'Follow up if you don\'t receive a response within 3 business days'
    ],
    tips: [
      'UPS has a comprehensive online support system',
      'Create an account on their website for better tracking',
      'Use their case management system to track your request',
      'Be specific about needing customs documentation'
    ],
    averageResponseTime: '2-4 business days'
  }
};

export function CourierPlaybook({ courier, onClose }: CourierPlaybookProps) {
  const { claimData, updateClaimData } = useClaimWizard();
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    trackingNumber: claimData.trackingNumber || '',
    importDate: claimData.importDate || '',
    value: claimData.packageValue?.toString() || '',
    description: '',
    yourName: '',
    yourEmail: '',
    yourPhone: ''
  });

  const courierInfo = COURIER_INFO[courier];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateEmail = () => {
    let email = courierInfo.template;
    
    // Replace placeholders with form data
    email = email.replace('[TRACKING_NUMBER]', formData.trackingNumber || '[TRACKING_NUMBER]');
    email = email.replace('[IMPORT_DATE]', formData.importDate || '[IMPORT_DATE]');
    email = email.replace('[VALUE]', formData.value || '[VALUE]');
    email = email.replace('[DESCRIPTION]', formData.description || '[DESCRIPTION]');
    email = email.replace('[YOUR_NAME]', formData.yourName || '[YOUR_NAME]');
    email = email.replace('[YOUR_EMAIL]', formData.yourEmail || '[YOUR_EMAIL]');
    email = email.replace('[YOUR_PHONE]', formData.yourPhone || '[YOUR_PHONE]');
    
    return email;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmail());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const openEmailClient = () => {
    const subject = encodeURIComponent('Request for MRN and EORI for Import Duty Refund');
    const body = encodeURIComponent(generateEmail());
    window.open(`mailto:${courierInfo.contact}?subject=${subject}&body=${body}`);
  };

  const saveToClaimData = () => {
    updateClaimData({
      trackingNumber: formData.trackingNumber,
      importDate: formData.importDate,
      packageValue: formData.value ? parseFloat(formData.value) : undefined,
      courier: courier.toLowerCase() as 'dhl' | 'fedex' | 'ups'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {courier} Playbook
          </h3>
          <p className="text-gray-600">
            Get your MRN and EORI numbers from {courier}
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wizard
        </Button>
      </div>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">{courierInfo.contact}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-gray-600">{courierInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium">Support Portal</p>
                <a 
                  href={courierInfo.portal} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  Visit Portal <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium">Response Time</p>
                <p className="text-sm text-gray-600">{courierInfo.averageResponseTime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Step-by-Step Instructions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {courierInfo.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <Badge variant="outline" className="mt-0.5">
                  {index + 1}
                </Badge>
                <p className="text-sm text-gray-700">{instruction}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {courierInfo.tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">{tip}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Email Template Form */}
      <Card>
        <CardHeader>
          <CardTitle>Email Template Generator</CardTitle>
          <CardDescription>
            Fill in your details to generate a personalized email template
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                value={formData.trackingNumber}
                onChange={(e) => handleInputChange('trackingNumber', e.target.value)}
                placeholder="Enter tracking number"
              />
            </div>
            <div>
              <Label htmlFor="importDate">Import Date</Label>
              <Input
                id="importDate"
                type="date"
                value={formData.importDate}
                onChange={(e) => handleInputChange('importDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="value">Package Value (£)</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => handleInputChange('value', e.target.value)}
                placeholder="Enter package value"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of items"
              />
            </div>
            <div>
              <Label htmlFor="yourName">Your Name</Label>
              <Input
                id="yourName"
                value={formData.yourName}
                onChange={(e) => handleInputChange('yourName', e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div>
              <Label htmlFor="yourEmail">Your Email</Label>
              <Input
                id="yourEmail"
                type="email"
                value={formData.yourEmail}
                onChange={(e) => handleInputChange('yourEmail', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="yourPhone">Your Phone</Label>
              <Input
                id="yourPhone"
                value={formData.yourPhone}
                onChange={(e) => handleInputChange('yourPhone', e.target.value)}
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Generated Email Template</Label>
              <Textarea
                value={generateEmail()}
                readOnly
                className="min-h-[200px] font-mono text-sm"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline">
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
              <Button onClick={openEmailClient}>
                <Mail className="w-4 h-4 mr-2" />
                Open Email Client
              </Button>
              <Button onClick={saveToClaimData} variant="secondary">
                <ArrowRight className="w-4 h-4 mr-2" />
                Save & Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Alert>
        <AlertDescription>
          <strong>Important:</strong> Keep copies of all correspondence with {courier}. 
          You'll need the MRN and EORI numbers to complete your HMRC claim. 
          If you don't receive a response within the expected timeframe, follow up with a phone call.
        </AlertDescription>
      </Alert>
    </div>
  );
}
