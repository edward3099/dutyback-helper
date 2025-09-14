'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentSuccessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // In a real implementation, you would verify the payment with Stripe
      // For now, we'll just show a success message
      setPaymentDetails({
        sessionId,
        status: 'completed',
        amount: '£12.00', // This would come from Stripe
        tier: 'Basic Plan'
      });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [sessionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Thank you for your purchase. Your payment has been processed successfully.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Plan:</span>
                <span className="font-medium">{paymentDetails.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">{paymentDetails.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600 capitalize">
                  {paymentDetails.status}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
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
              You will receive a confirmation email shortly. 
              If you have any questions, please contact our support team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
