'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRealtimeUpdates } from '@/hooks/useRealtime';
import { RealtimeUpdate } from '@/lib/realtime';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  claimId?: string;
  timestamp: number;
}

export function ToastNotifications() {
  const { updates } = useRealtimeUpdates();
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    // Process new updates and create toast notifications
    updates.forEach(update => {
      if (update.type === 'UPDATE' && update.table === 'claims') {
        const claim = update.data as any;
        const oldClaim = update.oldData as any;
        
        // Check if status changed
        if (claim && oldClaim && claim.status !== oldClaim.status) {
          const toast = createStatusChangeToast(claim, oldClaim);
          if (toast) {
            addToast(toast);
          }
        }
      } else if (update.type === 'INSERT' && update.table === 'evidence') {
        const evidence = update.data as any;
        const toast = createEvidenceUploadToast(evidence);
        if (toast) {
          addToast(toast);
        }
      } else if (update.type === 'INSERT' && update.table === 'outcomes') {
        const outcome = update.data as any;
        const toast = createOutcomeToast(outcome);
        if (toast) {
          addToast(toast);
        }
      }
    });
  }, [updates]);

  const createStatusChangeToast = (claim: any, oldClaim: any): ToastNotification | null => {
    const statusMessages: Record<string, { type: ToastNotification['type'], title: string, message: string }> = {
      'submitted': {
        type: 'info',
        title: 'Claim Submitted',
        message: 'Your claim has been successfully submitted and is now in review.'
      },
      'under_review': {
        type: 'info',
        title: 'Under Review',
        message: 'HMRC is now reviewing your claim. This typically takes 2-4 weeks.'
      },
      'approved': {
        type: 'success',
        title: 'Claim Approved!',
        message: `Great news! Your claim for £${claim.total_amount || '0'} has been approved.`
      },
      'rejected': {
        type: 'error',
        title: 'Claim Rejected',
        message: 'Unfortunately, your claim has been rejected. Please check the details.'
      },
      'additional_info_required': {
        type: 'warning',
        title: 'Additional Information Required',
        message: 'HMRC needs more information to process your claim.'
      }
    };

    const statusInfo = statusMessages[claim.status];
    if (!statusInfo) return null;

    return {
      id: `status-${claim.id}-${Date.now()}`,
      type: statusInfo.type,
      title: statusInfo.title,
      message: statusInfo.message,
      claimId: claim.id,
      timestamp: Date.now()
    };
  };

  const createEvidenceUploadToast = (evidence: any): ToastNotification | null => {
    return {
      id: `evidence-${evidence.id}-${Date.now()}`,
      type: 'success',
      title: 'Evidence Uploaded',
      message: `Evidence file "${evidence.file_name}" has been successfully uploaded.`,
      claimId: evidence.claim_id,
      timestamp: Date.now()
    };
  };

  const createOutcomeToast = (outcome: any): ToastNotification | null => {
    return {
      id: `outcome-${outcome.id}-${Date.now()}`,
      type: 'info',
      title: 'Outcome Received',
      message: `New outcome received for your claim: ${outcome.decision || 'Decision pending'}.`,
      claimId: outcome.claim_id,
      timestamp: Date.now()
    };
  };

  const addToast = (toast: ToastNotification) => {
    setToasts(prev => [toast, ...prev.slice(0, 4)]); // Keep max 5 toasts
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastIcon = (type: ToastNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getToastStyles = (type: ToastNotification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Card
          key={toast.id}
          className={`w-80 shadow-lg border-l-4 ${getToastStyles(toast.type)} animate-in slide-in-from-right duration-300`}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getToastIcon(toast.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-gray-900">
                  {toast.title}
                </h4>
                <p className="text-sm text-gray-700 mt-1">
                  {toast.message}
                </p>
                {toast.claimId && (
                  <div className="mt-2">
                    <span className="text-xs text-gray-500">
                      Claim #{toast.claimId.slice(-8)}
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 h-6 w-6 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
