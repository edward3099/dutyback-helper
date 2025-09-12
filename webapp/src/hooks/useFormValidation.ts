// Form validation hook for Dutyback Helper webapp

import { useState, useCallback, useMemo } from 'react';
import { ClaimData } from './useWizard';
import { 
  validateWizardStep, 
  validateCompleteClaim, 
  isClaimReadyForSubmission,
  getFieldError,
  formatValidationErrors 
} from '@/lib/validation';
import { 
  determineHMRCRoute, 
  getRouteInfo, 
  checkDeadlineEligibility,
  getNextSteps 
} from '@/lib/routing';

export interface ValidationState {
  errors: Record<string, string>;
  isValid: boolean;
  isStepValid: (step: number) => boolean;
  getFieldError: (field: string) => string | null;
  validateStep: (step: number) => boolean;
  validateAll: () => boolean;
  clearErrors: () => void;
  clearFieldError: (field: string) => void;
}

export interface RouteState {
  route: string;
  routeInfo: any;
  isEligible: boolean;
  deadlineInfo: {
    isEligible: boolean;
    daysRemaining: number;
    deadline: Date;
    message: string;
  };
  nextSteps: string[];
}

export function useFormValidation(claimData: Partial<ClaimData>) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validate a specific step
  const validateStep = useCallback((step: number): boolean => {
    const stepErrors = validateWizardStep(step, claimData);
    const newErrors: Record<string, string> = {};
    
    stepErrors.forEach(error => {
      newErrors[error.field] = error.message;
    });
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return stepErrors.length === 0;
  }, [claimData]);

  // Validate all steps
  const validateAll = useCallback((): boolean => {
    const allErrors = validateCompleteClaim(claimData);
    const newErrors: Record<string, string> = {};
    
    allErrors.forEach(error => {
      newErrors[error.field] = error.message;
    });
    
    setErrors(newErrors);
    return allErrors.length === 0;
  }, [claimData]);

  // Check if a specific step is valid
  const isStepValid = useCallback((step: number): boolean => {
    const stepErrors = validateWizardStep(step, claimData);
    return stepErrors.length === 0;
  }, [claimData]);

  // Get error for a specific field
  const getFieldError = useCallback((field: string): string | null => {
    return errors[field] || null;
  }, [errors]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  // Clear error for a specific field
  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  // Check if claim is ready for submission
  const isReady = useMemo(() => {
    return isClaimReadyForSubmission(claimData);
  }, [claimData]);

  // Get validation state
  const validationState: ValidationState = {
    errors,
    isValid: Object.keys(errors).length === 0,
    isStepValid,
    getFieldError,
    validateStep,
    validateAll,
    clearErrors,
    clearFieldError,
  };

  return validationState;
}

export function useRouteLogic(claimData: Partial<ClaimData>) {
  // Determine the HMRC route
  const route = useMemo(() => {
    return determineHMRCRoute(claimData);
  }, [claimData]);

  // Get route information
  const routeInfo = useMemo(() => {
    return getRouteInfo(claimData);
  }, [claimData]);

  // Check if route is eligible
  const isEligible = useMemo(() => {
    return claimData.channel !== null && claimData.isVATRegistered !== null;
  }, [claimData]);

  // Check deadline eligibility
  const deadlineInfo = useMemo(() => {
    if (!claimData.claimType) {
      return {
        isEligible: false,
        daysRemaining: 0,
        deadline: new Date(),
        message: 'Claim type not selected'
      };
    }
    
    return checkDeadlineEligibility(claimData, new Date());
  }, [claimData]);

  // Get next steps
  const nextSteps = useMemo(() => {
    return getNextSteps(claimData);
  }, [claimData]);

  // Get route state
  const routeState: RouteState = {
    route,
    routeInfo,
    isEligible,
    deadlineInfo,
    nextSteps,
  };

  return routeState;
}

// Combined hook for both validation and routing
export function useClaimLogic(claimData: Partial<ClaimData>) {
  const validation = useFormValidation(claimData);
  const routing = useRouteLogic(claimData);

  return {
    validation,
    routing,
    isReady: validation.isValid && routing.isEligible,
  };
}
