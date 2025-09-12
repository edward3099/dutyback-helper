// Core types for Dutyback Helper webapp

export type ClaimStatus = 
  | 'draft'
  | 'identifiers_pending'
  | 'evidence_missing'
  | 'exported'
  | 'submitted'
  | 'decided';

export type ClaimRoute = 
  | 'CDS'
  | 'C285'
  | 'BOR286'
  | 'C&E1179'
  | 'VAT_RETURN'
  | 'SELLER_REFUND';

export type CourierType = 'DHL' | 'FedEx' | 'UPS' | 'Royal Mail';

export type ChannelType = 'courier' | 'postal';

export type VATStatus = 'registered' | 'not_registered';

export type ClaimType = 'overpayment' | 'rejected_import' | 'withdrawal' | 'low_value';

export type EvidenceType = 'invoice' | 'packing_list' | 'transport_doc' | 'other';

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Claim {
  id: string;
  user_id: string;
  route: ClaimRoute;
  status: ClaimStatus;
  created_at: string;
  updated_at: string;
  channel?: ChannelType;
  vat_status?: VATStatus;
  claim_type?: ClaimType;
  mrn?: string;
  eori?: string;
  courier?: CourierType;
  charge_reference?: string; // For BOR286
}

export interface Identifier {
  id: string;
  claim_id: string;
  mrn: string;
  eori: string;
  courier: CourierType;
  request_date: string;
  obtained_date?: string;
}

export interface Evidence {
  id: string;
  claim_id: string;
  file_type: EvidenceType;
  file_url: string;
  status: 'pending' | 'validated' | 'rejected';
  uploaded_at: string;
}

export interface Outcome {
  id: string;
  claim_id: string;
  decision: 'approved' | 'rejected';
  decision_days: number;
  refund_amount: number;
  decided_at: string;
}

export interface PolicyUpdate {
  id: string;
  title: string;
  description: string;
  last_checked: string;
  changes: string[];
  source_url: string;
}

export interface Stats {
  approval_rate: number;
  median_days: number;
  avg_refund: number;
  total_claims: number;
  by_courier: {
    [key in CourierType]: {
      approval_rate: number;
      median_days: number;
      avg_refund: number;
      total_claims: number;
    };
  };
}

// Wizard step types
export interface WizardStep {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export interface WizardData {
  channel?: ChannelType;
  vat_status?: VATStatus;
  claim_type?: ClaimType;
  mrn?: string;
  eori?: string;
  courier?: CourierType;
  charge_reference?: string;
  evidence: EvidenceType[];
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isValid: boolean;
  errors: ValidationError[];
  data: Partial<WizardData>;
}
