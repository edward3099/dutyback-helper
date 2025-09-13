'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SimpleStepperProps {
  steps: Array<{
    id: number;
    title: string;
    description: string;
  }>;
  currentStep: number;
  onStepChange: (step: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
  nextButtonText?: string;
  previousButtonText?: string;
  children: React.ReactNode;
}

export default function SimpleStepper({ 
  steps, 
  currentStep, 
  onStepChange,
  onNext,
  onPrevious,
  canGoNext = true,
  canGoPrevious = true,
  nextButtonText = "Next",
  previousButtonText = "Previous",
  children 
}: SimpleStepperProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Step Indicators */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          const isClickable = true;

          return (
            <React.Fragment key={step.id}>
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium cursor-pointer transition-all duration-300
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg scale-110' 
                    : isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }
                `}
                onClick={() => isClickable && onStepChange(step.id)}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div 
                  className={`
                    flex-1 h-0.5 mx-2 transition-all duration-300
                    ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-[400px]"
      >
        {children}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <div>
          {currentStep > 1 && (
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                ${canGoPrevious 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md' 
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              {previousButtonText}
            </button>
          )}
        </div>

        <div>
          {currentStep < steps.length && (
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`
                px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2
                ${canGoNext 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg' 
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {nextButtonText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
