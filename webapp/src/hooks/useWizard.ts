import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react';

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
}

interface ClaimWizardContextType {
  currentStep: number;
  claimData: ClaimData;
  goToStep: (step: number) => void;
  updateClaimData: (updates: Partial<ClaimData>) => void;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;
  isStepComplete: (step: number) => boolean;
}

const ClaimWizardContext = createContext<ClaimWizardContextType | undefined>(undefined);

export const ClaimWizardProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState(1);
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

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 6) {
      setCurrentStep(step);
    }
  }, []);

  const updateClaimData = useCallback((updates: Partial<ClaimData>) => {
    setClaimData(prev => ({ ...prev, ...updates }));
  }, []);

  const canGoNext = useCallback(() => {
    switch (currentStep) {
      case 1:
        return claimData.channel !== null;
      case 2:
        return claimData.isVATRegistered !== null;
      case 3:
        return claimData.claimType !== null;
      case 4:
        return claimData.mrn.length > 0 && claimData.eori.length > 0;
      case 5:
        return Object.values(claimData.evidence).some(Boolean);
      case 6:
        return true;
      default:
        return false;
    }
  }, [currentStep, claimData]);

  const canGoPrevious = useCallback(() => {
    return currentStep > 1;
  }, [currentStep]);

  const isStepComplete = useCallback((step: number) => {
    switch (step) {
      case 1:
        return claimData.channel !== null;
      case 2:
        return claimData.isVATRegistered !== null;
      case 3:
        return claimData.claimType !== null;
      case 4:
        return claimData.mrn.length > 0 && claimData.eori.length > 0;
      case 5:
        return Object.values(claimData.evidence).some(Boolean);
      case 6:
        return true;
      default:
        return false;
    }
  }, [claimData]);

  const value = {
    currentStep,
    claimData,
    goToStep,
    updateClaimData,
    canGoNext,
    canGoPrevious,
    isStepComplete,
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