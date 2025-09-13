'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, CheckCircle, Truck, Mail, FileText, CreditCard, Upload, CheckSquare } from "lucide-react";
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
import SimpleStepper from "@/components/ui/SimpleStepper";
import ReactBitsFadeContent from "@/components/ui/ReactBitsFadeContent";
import ReactBitsAnimatedList from "@/components/ui/ReactBitsAnimatedList";

const wizardSteps = [
  { 
    id: 1, 
    title: "Channel Selection", 
    description: "How did you receive your package?",
    icon: Truck,
    color: "from-blue-500 to-blue-600"
  },
  { 
    id: 2, 
    title: "VAT Status", 
    description: "Are you VAT registered?",
    icon: FileText,
    color: "from-green-500 to-green-600"
  },
  { 
    id: 3, 
    title: "Claim Type", 
    description: "What type of claim?",
    icon: CreditCard,
    color: "from-purple-500 to-purple-600"
  },
  { 
    id: 4, 
    title: "Identifiers", 
    description: "MRN & EORI numbers",
    icon: FileText,
    color: "from-orange-500 to-orange-600"
  },
  { 
    id: 5, 
    title: "Evidence", 
    description: "Required documents",
    icon: Upload,
    color: "from-pink-500 to-pink-600"
  },
  { 
    id: 6, 
    title: "Review & Submit", 
    description: "Submit claim",
    icon: CheckSquare,
    color: "from-emerald-500 to-emerald-600"
  },
];

function PolishedWizardContent() {
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

  const handleStepChange = (step: number) => {
    goToStep(step);
  };

  const handleFinalStepCompleted = () => {
    console.log("All steps completed!");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ReactBitsFadeContent delay={200} duration={1200} className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Import Duty Refund Claim
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Follow our guided process to reclaim your overpaid import charges with confidence
          </p>
        </ReactBitsFadeContent>

        {/* Simple Stepper */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 p-8">
          <SimpleStepper
            steps={wizardSteps}
            currentStep={currentStep}
            onStepChange={handleStepChange}
            onNext={() => {
              if (canGoNext) {
                goToStep(currentStep + 1);
              }
            }}
            onPrevious={() => {
              if (canGoPrevious) {
                goToStep(currentStep - 1);
              }
            }}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
            nextButtonText="Continue"
            previousButtonText="Previous"
          >
            <ReactBitsFadeContent delay={300} duration={800}>
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${wizardSteps[currentStep - 1]?.color} text-white mb-4 shadow-lg`}>
                  {React.createElement(wizardSteps[currentStep - 1]?.icon, { className: "w-8 h-8" })}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Step {currentStep}: {wizardSteps[currentStep - 1]?.title}
                </h2>
                <p className="text-lg text-gray-600">
                  {wizardSteps[currentStep - 1]?.description}
                </p>
              </div>
            </ReactBitsFadeContent>

            <ReactBitsAnimatedList delay={500} staggerDelay={150} className="space-y-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-gray-800">
                    {wizardSteps[currentStep - 1]?.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {wizardSteps[currentStep - 1]?.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {renderStepContent()}
                  </div>
                </CardContent>
              </Card>
            </ReactBitsAnimatedList>
          </SimpleStepper>
        </div>

        {/* Validation Display */}
        <ReactBitsFadeContent delay={700} duration={800} className="mt-8">
          <ValidationDisplay
            errors={validation.errors}
            routeInfo={routing.routeInfo}
            deadlineInfo={routing.deadlineInfo}
            nextSteps={routing.nextSteps}
            className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6"
          />
        </ReactBitsFadeContent>
      </div>
    </div>
  );
}

export default function PolishedWizardPage() {
  return (
    <ClaimWizardProvider>
      <PolishedWizardContent />
    </ClaimWizardProvider>
  );
}
