'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClaimWizardProvider, useClaimWizard } from "@/hooks/useWizard";
import { Step1ChannelSelection } from "@/components/wizard/Step1ChannelSelection";
import { Step2VATStatus } from "@/components/wizard/Step2VATStatus";
import { Step3ClaimType } from "@/components/wizard/Step3ClaimType";
import { Step4Identifiers } from "@/components/wizard/Step4Identifiers";
import { Step5Evidence } from "@/components/wizard/Step5Evidence";
import { Step6Review } from "@/components/wizard/Step6Review";
import { BOR286PostalScreen } from "@/components/screens/BOR286PostalScreen";
import { VATReturnInfoScreen } from "@/components/screens/VATReturnInfoScreen";
import { SellerRefundInfoScreen } from "@/components/screens/SellerRefundInfoScreen";
import { ValidationDisplay } from "@/components/validation/ValidationDisplay";

function EnhancedWizardContent() {
  const {
    currentStep,
    currentBranchScreen,
    goToStep,
    canGoNext,
    canGoPrevious,
    updateClaimData,
    closeBranchScreen,
    validation,
    routing,
  } = useClaimWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (canGoNext()) {
      goToStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious()) {
      goToStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log("Submitting claim...");
    setTimeout(() => {
      setIsSubmitting(false);
    }, 2000);
  };

  const handleBOR286Continue = (chargeReference: string) => {
    updateClaimData({ bor286ChargeReference: chargeReference });
    closeBranchScreen();
  };

  const handleVATReturnContinue = () => {
    updateClaimData({ vatReturnAcknowledged: true });
    closeBranchScreen();
  };

  const handleSellerRefundContinue = () => {
    updateClaimData({ sellerRefundAcknowledged: true });
    closeBranchScreen();
  };

  const renderStepContent = () => {
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

  // Render branch screens if active
  if (currentBranchScreen) {
    switch (currentBranchScreen) {
      case 'bor286':
        return (
          <BOR286PostalScreen
            onBack={closeBranchScreen}
            onContinue={handleBOR286Continue}
          />
        );
      case 'vat-return':
        return (
          <VATReturnInfoScreen
            onBack={closeBranchScreen}
            onContinue={handleVATReturnContinue}
          />
        );
      case 'seller-refund':
        return (
          <SellerRefundInfoScreen
            onBack={closeBranchScreen}
            onContinue={handleSellerRefundContinue}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Import Duty Refund Claim
          </h1>
          <p className="text-lg text-gray-600">
            Follow our guided process to reclaim your overpaid import charges
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Step {currentStep}</CardTitle>
            <CardDescription>
              {currentStep === 1 && "How did you receive your package?"}
              {currentStep === 2 && "Are you VAT registered?"}
              {currentStep === 3 && "What type of claim?"}
              {currentStep === 4 && "MRN & EORI numbers"}
              {currentStep === 5 && "Required documents"}
              {currentStep === 6 && "Submit claim"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        <ValidationDisplay
          errors={validation.errors}
          routeInfo={routing.routeInfo}
          deadlineInfo={routing.deadlineInfo}
          nextSteps={routing.nextSteps}
          className="mb-6"
        />

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoPrevious()}
          >
            Previous
          </Button>

          <div className="flex space-x-3">
            {currentStep < 6 ? (
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canGoNext() || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Claim"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnhancedWizardPage() {
  return (
    <ClaimWizardProvider>
      <EnhancedWizardContent />
    </ClaimWizardProvider>
  );
}
