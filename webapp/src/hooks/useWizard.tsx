import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { useClaimLogic } from './useFormValidation';

export interface ClaimData {
  // Channel selection
  channel: 'courier' | 'postal' | null;
  
  // VAT status
  isVATRegistered: boolean | null;
  
  // Claim type
  claimType: 'overpayment' | 'rejected' | 'withdrawal' | 'low_value' | null;
  
  // Identifiers
  mrn: string;
  eori: string;
  
  // Evidence
  evidence: {
    invoice: boolean;
    customsDeclaration: boolean;
    paymentProof: boolean;
    correspondence: boolean;
  };
  
  // Additional data
  courier?: string;
  packageValue?: number;
  dutyPaid?: number;
  vatPaid?: number;
  importDate?: string;
  rejectionReason?: string;
  
  // Branch screen data
  bor286ChargeReference?: string;
  sellerRefundAcknowledged?: boolean;
  vatReturnAcknowledged?: boolean;
}

type BranchScreen = 'bor286' | 'vat-return' | 'seller-refund' | null;

interface ClaimWizardContextType {
  currentStep: number;
  claimData: ClaimData;
  currentBranchScreen: BranchScreen;
  goToStep: (step: number) => void;
  updateClaimData: (updates: Partial<ClaimData>) => void;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
  isStepComplete: (step: number) => boolean;
  openBranchScreen: (screen: BranchScreen) => void;
  closeBranchScreen: () => void;
  // Enhanced validation and routing
  validation: any;
  routing: any;
  isReady: boolean;
}

const ClaimWizardContext = createContext<ClaimWizardContextType | undefined>(undefined);

export const ClaimWizardProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [currentBranchScreen, setCurrentBranchScreen] = useState<BranchScreen>(null);
  const [claimData, setClaimData] = useState<ClaimData>({
    channel: null,
    isVATRegistered: null,
    claimType: null,
    mrn: '',
    eori: '',
    evidence: {
      invoice: false,
      customsDeclaration: false,
      paymentProof: false,
      correspondence: false,
    },
  });

  // Enhanced validation and routing logic
  const { validation, routing, isReady } = useClaimLogic(claimData);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
    }
  }, []);

  const updateClaimData = useCallback((updates: Partial<ClaimData>) => {
    setClaimData(prev => ({ ...prev, ...updates }));
  }, []);

  const canGoNext = useCallback(() => {
    // Use enhanced validation for step validation
    return validation.isStepValid(currentStep);
  }, [currentStep, validation]);

  const canGoPrevious = useCallback(() => {
    return currentStep > 1;
  }, [currentStep]);

  const isStepComplete = useCallback((step: number) => {
    // Use enhanced validation for step completion
    return validation.isStepValid(step);
  }, [validation]);

  const openBranchScreen = useCallback((screen: BranchScreen) => {
    setCurrentBranchScreen(screen);
  }, []);

  const closeBranchScreen = useCallback(() => {
    setCurrentBranchScreen(null);
  }, []);

  const value = {
    currentStep,
    claimData,
    currentBranchScreen,
    goToStep,
    updateClaimData,
    canGoNext,
    canGoPrevious,
    isStepComplete,
    openBranchScreen,
    closeBranchScreen,
    // Enhanced validation and routing
    validation,
    routing,
    isReady,
  };

  return (
    <ClaimWizardContext.Provider value={value}>
      {children}
    </ClaimWizardContext.Provider>
  );
};

export const useClaimWizard = () => {
  const context = useContext(ClaimWizardContext);
  if (context === undefined) {
    throw new Error('useClaimWizard must be used within a ClaimWizardProvider');
  }
  return context;
};

// Legacy export for backward compatibility
export const useWizard = useClaimWizard;