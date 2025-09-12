"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Mail, Phone, CheckCircle } from "lucide-react";
import { COURIER_PLAYBOOKS } from "@/lib/constants";

interface CourierPlaybookModalProps {
  courier: 'DHL' | 'FedEx' | 'UPS';
  isOpen: boolean;
  onClose: () => void;
}

export function CourierPlaybookModal({ courier, isOpen, onClose }: CourierPlaybookModalProps) {
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const playbook = COURIER_PLAYBOOKS[courier];

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(playbook.template);
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2000);
    } catch (err) {
      console.error('Failed to copy template:', err);
    }
  };

  const handleOpenPortal = () => {
    window.open(playbook.portal, '_blank', 'noopener,noreferrer');
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent('Request for MRN and EORI for Import Duty Refund');
    const body = encodeURIComponent(playbook.template);
    window.open(`mailto:${playbook.contact}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">{courier[0]}</span>
            </div>
            {courier} Playbook
          </DialogTitle>
          <DialogDescription>
            Step-by-step guide to obtain your MRN and EORI numbers from {courier}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription>
                Use these details to contact {courier} for your MRN and EORI numbers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a 
                      href={`mailto:${playbook.contact}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {playbook.contact}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Self-Serve Portal</p>
                    <button
                      onClick={handleOpenPortal}
                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                    >
                      Visit Portal
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Template */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="w-5 h-5" />
                Request Template
              </CardTitle>
              <CardDescription>
                Pre-written email template to request your MRN and EORI numbers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {playbook.template}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCopyTemplate} className="flex items-center gap-2">
                  {copiedTemplate ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Template
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleSendEmail} className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Instructions</CardTitle>
              <CardDescription>
                Follow these steps to get your MRN and EORI numbers from {courier}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Gather Your Information</h4>
                    <p className="text-gray-600 text-sm">
                      Collect your tracking number, delivery date, package value, and description before contacting {courier}.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Choose Your Method</h4>
                    <p className="text-gray-600 text-sm">
                      You can either use the self-serve portal or send an email using our template above.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Submit Your Request</h4>
                    <p className="text-gray-600 text-sm">
                      Use the template above and replace the placeholder information with your actual details.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Follow Up</h4>
                    <p className="text-gray-600 text-sm">
                      {courier} typically responds within 2-5 business days. If you don't hear back, follow up with a phone call.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">5</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Verify Information</h4>
                    <p className="text-gray-600 text-sm">
                      Once you receive the MRN and EORI numbers, verify they are correct before proceeding with your claim.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips and Notes */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-yellow-900">Important Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-yellow-800 text-sm space-y-2">
              <p>• <strong>Be specific:</strong> Include your tracking number and delivery date in your request</p>
              <p>• <strong>Be patient:</strong> Courier companies may take several days to respond</p>
              <p>• <strong>Keep records:</strong> Save all correspondence for your claim file</p>
              <p>• <strong>Follow up:</strong> If you don't hear back within a week, call their customer service</p>
              <p>• <strong>Verify details:</strong> Double-check the MRN format (18 characters) and EORI format (GB + 12 digits)</p>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleSendEmail} className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Send Email Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
