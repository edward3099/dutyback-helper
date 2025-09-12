// Enhanced validation and routing logic for Dutyback Helper webapp

import { MRN_FORMAT, EORI_FORMAT, HMRC_DEADLINES, EVIDENCE_REQUIREMENTS } from './constants';
import { ValidationError, ClaimData, ClaimType, ChannelType, VATStatus } from '@/types';

// Enhanced MRN validation with detailed error messages
export function validateMRN(mrn: string): ValidationError | null {
  if (!mrn) {
    return { field: 'mrn', message: 'MRN is required' };
  }
  
  if (mrn.length !== MRN_FORMAT.length) {
    return { 
      field: 'mrn', 
      message: `MRN must be exactly ${MRN_FORMAT.length} characters (currently ${mrn.length})` 
    };
  }
  
  if (!MRN_FORMAT.pattern.test(mrn)) {
    return { 
      field: 'mrn', 
      message: 'MRN format is invalid. Must be 2 letters, 2 numbers, then 14 alphanumeric characters (e.g., GB123456789012345678)' 
    };
  }
  
  return null;
}

// Enhanced EORI validation
export function validateEORI(eori: string): ValidationError | null {
  if (!eori) {
    return { field: 'eori', message: 'EORI is required' };
  }
  
  if (!EORI_FORMAT.pattern.test(eori)) {
    return { 
      field: 'eori', 
      message: 'EORI format is invalid. Must start with GB followed by exactly 12 digits (e.g., GB123456789012)' 
    };
  }
  
  return null;
}

// Enhanced charge reference validation for postal claims
export function validateChargeReference(chargeRef: string): ValidationError | null {
  if (!chargeRef) {
    return { field: 'charge_reference', message: 'Charge reference is required for postal claims' };
  }
  
  if (chargeRef.length < 5) {
    return { field: 'charge_reference', message: 'Charge reference must be at least 5 characters' };
  }
  
  if (chargeRef.length > 50) {
    return { field: 'charge_reference', message: 'Charge reference must be less than 50 characters' };
  }
  
  return null;
}

// Enhanced evidence validation with specific requirements
export function validateEvidence(claimData: Partial<ClaimData>): ValidationError[] {
  const errors: ValidationError[] = [];
  const requiredEvidence = getRequiredEvidenceForRoute(claimData);
  
  if (requiredEvidence.length === 0) {
    return errors;
  }
  
  const providedEvidence = getProvidedEvidence(claimData);
  const missingEvidence = requiredEvidence.filter(evidence => !providedEvidence.includes(evidence));
  
  if (missingEvidence.length > 0) {
    errors.push({
      field: 'evidence',
      message: `Missing required evidence: ${missingEvidence.join(', ')}`
    });
  }
  
  return errors;
}

// Get required evidence based on claim route
export function getRequiredEvidenceForRoute(claimData: Partial<ClaimData>): string[] {
  const route = determineClaimRoute(claimData);
  return EVIDENCE_REQUIREMENTS[route] || [];
}

// Get provided evidence from claim data
export function getProvidedEvidence(claimData: Partial<ClaimData>): string[] {
  const evidence: string[] = [];
  
  if (claimData.evidence?.invoice) evidence.push('invoice');
  if (claimData.evidence?.customsDeclaration) evidence.push('customsDeclaration');
  if (claimData.evidence?.paymentProof) evidence.push('paymentProof');
  if (claimData.evidence?.correspondence) evidence.push('correspondence');
  
  // Add identifiers if available
  if (claimData.mrn) evidence.push('mrn');
  if (claimData.eori) evidence.push('eori');
  if (claimData.charge_reference) evidence.push('charge_reference');
  
  return evidence;
}

// Enhanced step validation with detailed error messages
export function validateWizardStep(step: number, claimData: Partial<ClaimData>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  switch (step) {
    case 1: // Channel selection
      if (!claimData.channel) {
        errors.push({ field: 'channel', message: 'Please select how you received your package' });
      }
      break;
      
    case 2: // VAT status
      if (claimData.channel === 'courier' && claimData.isVATRegistered === null) {
        errors.push({ field: 'isVATRegistered', message: 'Please select your VAT registration status' });
      }
      break;
      
    case 3: // Claim type
      if (claimData.channel === 'courier' && claimData.isVATRegistered === false && !claimData.claimType) {
        errors.push({ field: 'claimType', message: 'Please select the type of claim you want to make' });
      }
      break;
      
    case 4: // Identifiers
      if (claimData.channel === 'courier' && claimData.isVATRegistered === false) {
        const mrnError = validateMRN(claimData.mrn || '');
        if (mrnError) errors.push(mrnError);
        
        const eoriError = validateEORI(claimData.eori || '');
        if (eoriError) errors.push(eoriError);
      }
      
      if (claimData.channel === 'postal') {
        const chargeRefError = validateChargeReference(claimData.charge_reference || '');
        if (chargeRefError) errors.push(chargeRefError);
      }
      break;
      
    case 5: // Evidence
      const evidenceErrors = validateEvidence(claimData);
      errors.push(...evidenceErrors);
      break;
  }
  
  return errors;
}

// Enhanced deadline calculation with proper date handling
export function calculateDeadline(claimType: ClaimType, claimDate: Date = new Date()): Date {
  const days = HMRC_DEADLINES[claimType] || HMRC_DEADLINES.overpayment;
  const deadline = new Date(claimDate);
  deadline.setDate(deadline.getDate() + days);
  return deadline;
}

// Check if deadline has passed
export function isDeadlinePassed(claimType: ClaimType, claimDate: Date): boolean {
  const deadline = calculateDeadline(claimType, claimDate);
  return new Date() > deadline;
}

// Get days until deadline
export function getDaysUntilDeadline(claimType: ClaimType, claimDate: Date): number {
  const deadline = calculateDeadline(claimType, claimDate);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Enhanced routing logic with detailed explanations
export function determineClaimRoute(claimData: Partial<ClaimData>): string {
  // Postal claims always go to BOR286
  if (claimData.channel === 'postal') {
    return 'BOR286';
  }
  
  // VAT registered users go to VAT Return
  if (claimData.isVATRegistered === true) {
    return 'VAT_RETURN';
  }
  
  // Low value claims should try seller refund first
  if (claimData.claimType === 'low_value') {
    return 'SELLER_REFUND';
  }
  
  // Specific claim type routing
  switch (claimData.claimType) {
    case 'overpayment':
      return 'CDS';
    case 'rejected_import':
      return 'C285';
    case 'withdrawal':
      return 'C&E1179';
    default:
      return 'CDS'; // Default fallback
  }
}

// Get routing explanation for user
export function getRoutingExplanation(claimData: Partial<ClaimData>): string {
  const route = determineClaimRoute(claimData);
  
  switch (route) {
    case 'BOR286':
      return 'Postal claims must be submitted using HMRC form BOR286';
    case 'VAT_RETURN':
      return 'VAT registered users can claim through their VAT return';
    case 'SELLER_REFUND':
      return 'Low value claims should first try requesting a refund directly from the seller';
    case 'CDS':
      return 'Overpayment claims are submitted through the Customs Declaration Service (CDS)';
    case 'C285':
      return 'Rejected import claims are submitted using HMRC form C285';
    case 'C&E1179':
      return 'Withdrawal claims are submitted using HMRC form C&E1179';
    default:
      return 'Claim route will be determined based on your selections';
  }
}

// Validate complete claim data
export function validateCompleteClaim(claimData: Partial<ClaimData>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Validate all steps
  for (let step = 1; step <= 5; step++) {
    const stepErrors = validateWizardStep(step, claimData);
    errors.push(...stepErrors);
  }
  
  return errors;
}

// Check if claim is ready for submission
export function isClaimReadyForSubmission(claimData: Partial<ClaimData>): boolean {
  const errors = validateCompleteClaim(claimData);
  return errors.length === 0;
}

// Get claim summary for review
export function getClaimSummary(claimData: Partial<ClaimData>) {
  const route = determineClaimRoute(claimData);
  const requiredEvidence = getRequiredEvidenceForRoute(claimData);
  const providedEvidence = getProvidedEvidence(claimData);
  const missingEvidence = requiredEvidence.filter(evidence => !providedEvidence.includes(evidence));
  
  return {
    route,
    routeExplanation: getRoutingExplanation(claimData),
    requiredEvidence,
    providedEvidence,
    missingEvidence,
    isReady: missingEvidence.length === 0,
    deadline: claimData.claimType ? calculateDeadline(claimData.claimType as ClaimType) : null,
  };
}

// Format validation errors for display
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) return '';
  
  return errors.map(error => `${error.field}: ${error.message}`).join('\n');
}

// Get field-specific error message
export function getFieldError(errors: ValidationError[], field: string): string | null {
  const error = errors.find(e => e.field === field);
  return error ? error.message : null;
}
