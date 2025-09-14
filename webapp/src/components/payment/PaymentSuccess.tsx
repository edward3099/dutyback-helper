'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentSuccessProps {
  onClose?: () => void;
}

export function PaymentSuccess({ onClose }: PaymentSuccessProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we're on a success page
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setIsVisible(true);
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your subscription has been activated. You can now access all the features of your chosen plan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">What's next?</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Start creating your first claim</li>
              <li>• Access premium features</li>
              <li>• Get priority support</li>
              <li>• Export your claim packs</li>
            </ul>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => window.location.href = '/wizard'} 
              className="flex-1"
            >
              Start Claim Wizard
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'} 
              variant="outline"
              className="flex-1"
            >
              View Dashboard
            </Button>
          </div>
          {onClose && (
            <Button 
              onClick={onClose} 
              variant="ghost" 
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
