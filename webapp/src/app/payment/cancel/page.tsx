'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, Home, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Cancelled
          </CardTitle>
          <CardDescription>
            Your payment was cancelled. No charges have been made to your account.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              Don't worry! You can try again anytime. Your account remains unchanged.
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/pricing')}
              className="w-full"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>
              Need help? Contact our support team if you're experiencing any issues.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
