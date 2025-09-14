"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { claimsAPI } from "@/lib/api/supabase";
import { ClaimWizardProvider, useClaimWizard } from "@/hooks/useWizard";
import { Step1ChannelSelection } from "@/components/wizard/Step1ChannelSelection";
import { Step2VATStatus } from "@/components/wizard/Step2VATStatus";
import { Step3ClaimType } from "@/components/wizard/Step3ClaimType";
import { Step4Identifiers } from "@/components/wizard/Step4Identifiers";
import { Step5Evidence } from "@/components/wizard/Step5Evidence";
import { Step6Review } from "@/components/wizard/Step6Review";
import { BranchBOR286 } from "@/components/wizard/BranchBOR286";
import { BranchVATReturn } from "@/components/wizard/BranchVATReturn";
import { BranchSellerRefund } from "@/components/wizard/BranchSellerRefund";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useAnalytics, useJourneyTracking, usePerformanceTracking } from "@/hooks/useAnalytics";

const steps = [
  { id: 1, title: "Channel", description: "How did you import?" },
  { id: 2, title: "VAT Status", description: "Are you VAT registered?" },
  { id: 3, title: "Claim Type", description: "What type of claim?" },
  { id: 4, title: "Identifiers", description: "Import details" },
  { id: 5, title: "Evidence", description: "Required documents" },
  { id: 6, title: "Review", description: "Submit claim" },
];

function WizardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { 
    currentStep, 
    goToStep, 
    goToNextStep,
    canGoNext, 
    canGoPrevious, 
    isStepComplete,
    updateClaimData,
    claimData,
    currentBranchScreen,
    shouldShowBranchScreen,
    openBranchScreen,
    closeBranchScreen
  } = useClaimWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Analytics tracking
  const { trackAction, trackBusiness, trackError } = useAnalytics();
  const { addStep, complete } = useJourneyTracking('claim_wizard', 'wizard_started');
  const { trackPageLoad } = usePerformanceTracking();

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Track page load performance
  React.useEffect(() => {
    const startTime = performance.now();
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      trackPageLoad(loadTime);
    };
    
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [trackPageLoad]);

  // Track step changes
  React.useEffect(() => {
    addStep(`step_${currentStep}_${steps[currentStep - 1]?.title.toLowerCase().replace(' ', '_')}`, {
      step: currentStep,
      step_title: steps[currentStep - 1]?.title,
      channel: claimData.channel,
      isVATRegistered: claimData.isVATRegistered,
      claimType: claimData.claimType
    });
  }, [currentStep, addStep, claimData]);

  // Check for branch screens when moving to next step
  React.useEffect(() => {
    const branchScreen = shouldShowBranchScreen();
    if (branchScreen && !currentBranchScreen) {
      openBranchScreen(branchScreen);
    }
  }, [claimData, shouldShowBranchScreen, currentBranchScreen, openBranchScreen]);

  const handleNext = () => {
    if (canGoNext()) {
      // Check if we should show a branch screen
      const branchScreen = shouldShowBranchScreen();
      if (branchScreen && !currentBranchScreen) {
        openBranchScreen(branchScreen);
      } else {
        goToNextStep();
      }
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious()) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Track claim submission attempt
      trackAction('claim_submission_attempted', {
        channel: claimData.channel,
        isVATRegistered: claimData.isVATRegistered,
        claimType: claimData.claimType,
        hasEvidence: !!(claimData.evidenceFiles && claimData.evidenceFiles.length > 0)
      });

      const { data, error } = await claimsAPI.createClaim({
        claim_type: claimData.claimType as 'duty' | 'vat' | 'both',
        channel: claimData.channel as 'courier' | 'postal',
        vat_status: claimData.isVATRegistered ? 'registered' : 'not_registered',
        mrn: claimData.mrn || undefined,
        eori: claimData.eori || undefined,
        courier_name: claimData.courier || undefined,
        tracking_number: claimData.trackingNumber || undefined,
        import_date: claimData.importDate || undefined,
        duty_amount: claimData.dutyAmount || undefined,
        vat_amount: claimData.vatAmount || undefined,
        total_amount: claimData.totalAmount || undefined,
        reason: claimData.reason || undefined,
        additional_notes: claimData.additionalNotes || undefined,
      });

      if (error) throw new Error(error);
      
      setSubmitSuccess(true);
      
      // Track successful claim submission
      trackBusiness('claim_submitted_successfully', {
        claimId: data?.id,
        channel: claimData.channel,
        isVATRegistered: claimData.isVATRegistered,
        claimType: claimData.claimType,
        evidenceCount: claimData.evidenceFiles?.length || 0
      });

      // Complete the journey
      complete(true, 'claim_submitted_successfully');
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error("Error submitting claim:", error);
      setSubmitError(error.message || 'Failed to submit claim');
      
      // Track failed claim submission
      trackBusiness('claim_submission_failed', {
        error: error.message,
        channel: claimData.channel,
        isVATRegistered: claimData.isVATRegistered,
        claimType: claimData.claimType
      });

      // Track error
      trackError(error, {
        action: 'claim_submission',
        channel: claimData.channel,
        isVATRegistered: claimData.isVATRegistered,
        claimType: claimData.claimType
      });

      // Complete the journey with failure
      complete(false, 'submission_failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  const renderStepContent = () => {
    // Show branch screens if they're open
    if (currentBranchScreen) {
      switch (currentBranchScreen) {
        case 'bor286':
          return <BranchBOR286 />;
        case 'vat-return':
          return <BranchVATReturn />;
        case 'seller-refund':
          return <BranchSellerRefund />;
        default:
          return null;
      }
    }

    // Show regular wizard steps
    switch (currentStep) {
      case 1:
        return <Step1ChannelSelection />;
      case 2:
        return <Step2VATStatus />;
      case 3:
        return <Step3ClaimType />;
      case 4:
        return <Step4Identifiers />;
      case 5:
        return <Step5Evidence />;
      case 6:
        return <Step6Review />;
      default:
        return <Step1ChannelSelection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Import Duty Refund Wizard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Follow these steps to submit your import duty refund claim
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    currentStep >= step.id
                      ? "bg-blue-600"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  {step.id}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block absolute top-6 left-12 w-full h-0.5 ${
                      currentStep > step.id
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                    style={{ width: "calc(100% - 3rem)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          {submitSuccess ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Claim Submitted Successfully!</h3>
              <p className="text-gray-600 mb-4">
                Your claim has been submitted and is being processed. You'll be redirected to your dashboard shortly.
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {submitError && (
                <Alert className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              {renderStepContent()}
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious()}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          {currentStep === 6 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Claim"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!canGoNext()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function WizardPage() {
  return (
    <ClaimWizardProvider>
      <WizardContent />
    </ClaimWizardProvider>
  );
}