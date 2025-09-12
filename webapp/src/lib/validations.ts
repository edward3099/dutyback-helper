// Validation utilities for Dutyback Helper webapp

import { MRN_FORMAT, EORI_FORMAT, HMRC_DEADLINES } from './constants';
import { ValidationError, WizardData, ClaimType } from '@/types';

export function validateMRN(mrn: string): ValidationError | null {
  if (!mrn) {
    return { field: 'mrn', message: 'MRN is required' };
  }
  
  if (mrn.length !== MRN_FORMAT.length) {
    return { field: 'mrn', message: `MRN must be exactly ${MRN_FORMAT.length} characters` };
  }
  
  if (!MRN_FORMAT.pattern.test(mrn)) {
    return { field: 'mrn', message: 'MRN format is invalid. Must be 2 letters, 2 numbers, then 14 alphanumeric characters' };
  }
  
  return null;
}

export function validateEORI(eori: string): ValidationError | null {
  if (!eori) {
    return { field: 'eori', message: 'EORI is required' };
  }
  
  if (!EORI_FORMAT.pattern.test(eori)) {
    return { field: 'eori', message: 'EORI format is invalid. Must start with GB followed by 12 digits' };
  }
  
  return null;
}

export function validateChargeReference(chargeRef: string): ValidationError | null {
  if (!chargeRef) {
    return { field: 'charge_reference', message: 'Charge reference is required for postal claims' };
  }
  
  if (chargeRef.length < 5) {
    return { field: 'charge_reference', message: 'Charge reference must be at least 5 characters' };
  }
  
  return null;
}

export function validateWizardStep(step: number, data: Partial<WizardData>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  switch (step) {
    case 1: // Channel selection
      if (!data.channel) {
        errors.push({ field: 'channel', message: 'Please select a delivery channel' });
      }
      break;
      
    case 2: // VAT status
      if (data.channel === 'courier' && !data.vat_status) {
        errors.push({ field: 'vat_status', message: 'Please select your VAT registration status' });
      }
      break;
      
    case 3: // Claim type
      if (data.channel === 'courier' && data.vat_status === 'not_registered' && !data.claim_type) {
        errors.push({ field: 'claim_type', message: 'Please select the type of claim' });
      }
      break;
      
    case 4: // Identifiers
      if (data.channel === 'courier' && data.vat_status === 'not_registered') {
        const mrnError = validateMRN(data.mrn || '');
        if (mrnError) errors.push(mrnError);
        
        const eoriError = validateEORI(data.eori || '');
        if (eoriError) errors.push(eoriError);
      }
      
      if (data.channel === 'postal') {
        const chargeRefError = validateChargeReference(data.charge_reference || '');
        if (chargeRefError) errors.push(chargeRefError);
      }
      break;
      
    case 5: // Evidence
      const requiredEvidence = getRequiredEvidence(data);
      if (requiredEvidence.length > 0 && (!data.evidence || data.evidence.length === 0)) {
        errors.push({ field: 'evidence', message: 'Please upload the required evidence documents' });
      }
      break;
  }
  
  return errors;
}

export function getRequiredEvidence(data: Partial<WizardData>): string[] {
  if (data.channel === 'postal') {
    return ['charge_reference', 'invoice'];
  }
  
  if (data.vat_status === 'registered') {
    return ['invoice', 'import_documentation'];
  }
  
  if (data.claim_type === 'low_value') {
    return ['invoice', 'seller_contact'];
  }
  
  // Default for courier claims
  return ['mrn', 'eori', 'invoice', 'transport_doc'];
}

export function calculateDeadline(claimType: ClaimType): Date {
  const now = new Date();
  const days = HMRC_DEADLINES[claimType] || HMRC_DEADLINES.overpayment;
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

export function isDeadlinePassed(claimType: ClaimType, claimDate: Date): boolean {
  const deadline = calculateDeadline(claimType);
  return new Date() > deadline;
}

export function getDaysUntilDeadline(claimType: ClaimType, claimDate: Date): number {
  const deadline = calculateDeadline(claimType);
  const now = new Date();
  const diffTime = deadline.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function determineClaimRoute(data: Partial<WizardData>): string {
  if (data.channel === 'postal') {
    return 'BOR286';
  }
  
  if (data.vat_status === 'registered') {
    return 'VAT_RETURN';
  }
  
  if (data.claim_type === 'low_value') {
    return 'SELLER_REFUND';
  }
  
  if (data.claim_type === 'overpayment') {
    return 'CDS';
  }
  
  if (data.claim_type === 'rejected_import') {
    return 'C285';
  }
  
  if (data.claim_type === 'withdrawal') {
    return 'C&E1179';
  }
  
  return 'CDS'; // Default fallback
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}
