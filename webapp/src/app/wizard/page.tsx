"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Circle } from "lucide-react";
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

const steps = [
  { id: 1, title: "Channel", description: "How did you receive your package?" },
  { id: 2, title: "VAT Status", description: "Are you VAT registered?" },
  { id: 3, title: "Claim Type", description: "What type of claim?" },
  { id: 4, title: "Identifiers", description: "MRN & EORI numbers" },
  { id: 5, title: "Evidence", description: "Required documents" },
  { id: 6, title: "Review", description: "Submit claim" },
];

function WizardContent() {
  const { 
    currentStep, 
    currentBranchScreen,
    goToStep, 
    canGoNext, 
    canGoPrevious, 
    isStepComplete,
    updateClaimData,
    closeBranchScreen,
    validation,
    routing,
    isReady
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
    // TODO: Implement submission logic
    console.log("Submitting claim...");
    setTimeout(() => {
      setIsSubmitting(false);
      // TODO: Navigate to success page or dashboard
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

  const renderStep = () => {
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Import Duty Refund Claim
          </h1>
          <p className="text-lg text-gray-600">
            Follow our guided process to reclaim your overpaid import charges
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep > step.id
                        ? "bg-green-500 text-white"
                        : currentStep === step.id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="ml-2 sm:ml-3 min-w-0 flex-shrink">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 whitespace-nowrap">{step.title}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-4 lg:w-8 h-0.5 mx-1 lg:mx-2 ${
                      currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium mr-3">
                {currentStep}
              </span>
              Step {currentStep}: {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {renderStep()}
          </CardContent>
          
          {/* Navigation */}
          <div className="flex justify-between px-6 pb-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={!canGoPrevious()}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex space-x-3">
            {currentStep < 6 ? (
              <Button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="flex items-center"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canGoNext() || isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Claim
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
          </div>
        </Card>

        {/* Validation Display */}
        <ValidationDisplay
          errors={validation.errors}
          routeInfo={routing.routeInfo}
          deadlineInfo={routing.deadlineInfo}
          nextSteps={routing.nextSteps}
          className="mb-2"
        />
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
