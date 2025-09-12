// Validation display component for Dutyback Helper webapp

import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock, AlertTriangle, Info } from 'lucide-react';

interface ValidationDisplayProps {
  errors: Record<string, string>;
  routeInfo?: any;
  deadlineInfo?: {
    isEligible: boolean;
    daysRemaining: number;
    deadline: Date;
    message: string;
  };
  nextSteps?: string[];
  className?: string;
}

export function ValidationDisplay({ 
  errors, 
  routeInfo, 
  deadlineInfo, 
  nextSteps, 
  className = '' 
}: ValidationDisplayProps) {
  const hasErrors = Object.keys(errors).length > 0;
  const hasRouteInfo = routeInfo && routeInfo.route;
  const hasDeadlineInfo = deadlineInfo && deadlineInfo.message;

  if (!hasErrors && !hasRouteInfo && !hasDeadlineInfo) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Validation Errors */}
      {hasErrors && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field} className="text-sm">
                    <span className="font-medium capitalize">{field.replace('_', ' ')}:</span> {message}
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Route Information */}
      {hasRouteInfo && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-blue-600" />
              Claim Route: {routeInfo.name}
            </CardTitle>
            <CardDescription>
              {routeInfo.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Evidence Requirements */}
            <div>
              <h4 className="font-medium text-sm mb-2">Required Evidence:</h4>
              <div className="flex flex-wrap gap-2">
                {routeInfo.evidenceRequired?.map((evidence: string) => (
                  <Badge key={evidence} variant="secondary" className="text-xs">
                    {evidence.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Eligibility Criteria */}
            {routeInfo.eligibility && (
              <div>
                <h4 className="font-medium text-sm mb-2">Eligibility:</h4>
                <ul className="text-sm space-y-1">
                  {routeInfo.eligibility.map((criteria: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Next Steps */}
            {nextSteps && nextSteps.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Next Steps:</h4>
                <ol className="text-sm space-y-1">
                  {nextSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full min-w-[20px] text-center">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Deadline Information */}
      {hasDeadlineInfo && (
        <Alert variant={deadlineInfo.isEligible ? "default" : "destructive"}>
          {deadlineInfo.isEligible ? (
            <Clock className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>{deadlineInfo.message}</span>
              {deadlineInfo.isEligible && (
                <Badge variant="secondary" className="ml-2">
                  {deadlineInfo.daysRemaining} days left
                </Badge>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Field-specific error display component
interface FieldErrorProps {
  field: string;
  errors: Record<string, string>;
  className?: string;
}

export function FieldError({ field, errors, className = '' }: FieldErrorProps) {
  const error = errors[field];
  
  if (!error) return null;

  return (
    <div className={`text-sm text-red-600 mt-1 flex items-center gap-1 ${className}`}>
      <XCircle className="h-4 w-4" />
      <span>{error}</span>
    </div>
  );
}

// Validation summary component
interface ValidationSummaryProps {
  isValid: boolean;
  errorCount: number;
  routeInfo?: any;
  className?: string;
}

export function ValidationSummary({ 
  isValid, 
  errorCount, 
  routeInfo, 
  className = '' 
}: ValidationSummaryProps) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg border ${className}`}>
      <div className="flex items-center gap-2">
        {isValid ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <XCircle className="h-5 w-5 text-red-600" />
        )}
        <span className="font-medium">
          {isValid ? 'Ready to submit' : `${errorCount} error${errorCount !== 1 ? 's' : ''} to fix`}
        </span>
      </div>
      
      {routeInfo && (
        <Badge variant="outline" className="text-xs">
          {routeInfo.route}
        </Badge>
      )}
    </div>
  );
}
