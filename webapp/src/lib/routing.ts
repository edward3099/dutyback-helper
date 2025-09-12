// HMRC routing logic and rules for Dutyback Helper webapp

import { ClaimData, ClaimType, ChannelType, VATStatus } from '@/types';
import { EVIDENCE_REQUIREMENTS } from './constants';

export type HMRCRoute = 
  | 'CDS'
  | 'C285'
  | 'BOR286'
  | 'C&E1179'
  | 'VAT_RETURN'
  | 'SELLER_REFUND';

export interface RouteInfo {
  route: HMRCRoute;
  name: string;
  description: string;
  formNumber?: string;
  evidenceRequired: string[];
  deadline: number; // days from claim date
  eligibility: string[];
  process: string[];
  contactInfo: {
    phone: string;
    email: string;
    website: string;
  };
}

// HMRC route definitions
export const HMRC_ROUTES: Record<HMRCRoute, RouteInfo> = {
  CDS: {
    route: 'CDS',
    name: 'Customs Declaration Service',
    description: 'For overpayment claims on goods imported through courier services',
    evidenceRequired: ['mrn', 'eori', 'invoice', 'transport_doc'],
    deadline: 3 * 365, // 3 years
    eligibility: [
      'Goods imported through courier (DHL, FedEx, UPS, etc.)',
      'Overpaid VAT and/or duty',
      'Have MRN and EORI numbers',
      'Claim within 3 years of import'
    ],
    process: [
      'Obtain MRN and EORI from courier',
      'Gather required evidence documents',
      'Submit claim through CDS online portal',
      'Wait for HMRC decision (typically 15-30 days)'
    ],
    contactInfo: {
      phone: '0300 200 3700',
      email: 'customs.declarations@hmrc.gov.uk',
      website: 'https://www.gov.uk/guidance/claim-a-refund-of-import-vat-and-duty'
    }
  },
  C285: {
    route: 'C285',
    name: 'Form C285 - Rejected Import',
    description: 'For goods that were rejected at customs and returned to sender',
    evidenceRequired: ['mrn', 'eori', 'invoice'],
    deadline: 365, // 1 year
    eligibility: [
      'Goods rejected at customs',
      'Goods returned to sender',
      'Have MRN and EORI numbers',
      'Claim within 1 year of rejection'
    ],
    process: [
      'Obtain MRN and EORI from courier',
      'Complete HMRC form C285',
      'Submit with supporting evidence',
      'Wait for HMRC decision (typically 15-30 days)'
    ],
    contactInfo: {
      phone: '0300 200 3700',
      email: 'customs.declarations@hmrc.gov.uk',
      website: 'https://www.gov.uk/guidance/claim-a-refund-of-import-vat-and-duty'
    }
  },
  BOR286: {
    route: 'BOR286',
    name: 'Form BOR286 - Postal Import',
    description: 'For goods imported through postal services (Royal Mail, etc.)',
    evidenceRequired: ['charge_reference', 'invoice'],
    deadline: 0, // No specific deadline for postal
    eligibility: [
      'Goods imported through postal service',
      'Have charge reference number',
      'Overpaid VAT and/or duty',
      'Can provide proof of payment'
    ],
    process: [
      'Obtain charge reference from postal service',
      'Complete HMRC form BOR286',
      'Submit with supporting evidence',
      'Wait for HMRC decision (typically 15-30 days)'
    ],
    contactInfo: {
      phone: '0300 200 3700',
      email: 'customs.declarations@hmrc.gov.uk',
      website: 'https://www.gov.uk/guidance/claim-a-refund-of-import-vat-and-duty'
    }
  },
  'C&E1179': {
    route: 'C&E1179',
    name: 'Form C&E1179 - Withdrawal',
    description: 'For goods withdrawn from customs before clearance',
    evidenceRequired: ['invoice', 'entitlement_proof', 'worksheet'],
    deadline: 90, // 90 days
    eligibility: [
      'Goods withdrawn before customs clearance',
      'Claim within 90 days of withdrawal',
      'Can prove entitlement to refund',
      'Have supporting documentation'
    ],
    process: [
      'Complete HMRC form C&E1179',
      'Attach entitlement proof and worksheet',
      'Submit with supporting evidence',
      'Wait for HMRC decision (typically 15-30 days)'
    ],
    contactInfo: {
      phone: '0300 200 3700',
      email: 'customs.declarations@hmrc.gov.uk',
      website: 'https://www.gov.uk/guidance/claim-a-refund-of-import-vat-and-duty'
    }
  },
  VAT_RETURN: {
    route: 'VAT_RETURN',
    name: 'VAT Return Adjustment',
    description: 'For VAT registered businesses to claim through their VAT return',
    evidenceRequired: ['invoice', 'import_documentation'],
    deadline: 3 * 365, // 3 years
    eligibility: [
      'VAT registered business',
      'Goods imported for business use',
      'Overpaid VAT on import',
      'Can provide import documentation'
    ],
    process: [
      'Gather import documentation and invoices',
      'Calculate correct VAT amount',
      'Adjust VAT return for the relevant period',
      'Submit VAT return with supporting evidence'
    ],
    contactInfo: {
      phone: '0300 200 3700',
      email: 'customs.declarations@hmrc.gov.uk',
      website: 'https://www.gov.uk/guidance/claim-a-refund-of-import-vat-and-duty'
    }
  },
  SELLER_REFUND: {
    route: 'SELLER_REFUND',
    name: 'Direct Seller Refund',
    description: 'For low value goods, try requesting refund directly from seller first',
    evidenceRequired: ['invoice', 'seller_contact'],
    deadline: 0, // No HMRC deadline, but seller may have time limits
    eligibility: [
      'Goods under £135 value',
      'Purchased from online marketplace',
      'Seller may have refunded the VAT',
      'Can contact seller directly'
    ],
    process: [
      'Contact seller to request VAT refund',
      'Provide proof of overpayment',
      'If seller refuses, proceed to HMRC claim',
      'Keep all correspondence as evidence'
    ],
    contactInfo: {
      phone: 'N/A',
      email: 'Contact seller directly',
      website: 'N/A'
    }
  }
};

// Main routing function
export function determineHMRCRoute(claimData: Partial<ClaimData>): HMRCRoute {
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

// Get route information
export function getRouteInfo(claimData: Partial<ClaimData>): RouteInfo {
  const route = determineHMRCRoute(claimData);
  return HMRC_ROUTES[route];
}

// Check if route is eligible for claim
export function isRouteEligible(claimData: Partial<ClaimData>): boolean {
  const route = determineHMRCRoute(claimData);
  const routeInfo = HMRC_ROUTES[route];
  
  // Check basic eligibility criteria
  if (claimData.channel === 'postal' && route !== 'BOR286') {
    return false;
  }
  
  if (claimData.isVATRegistered === true && route !== 'VAT_RETURN') {
    return false;
  }
  
  if (claimData.claimType === 'low_value' && route !== 'SELLER_REFUND') {
    return false;
  }
  
  return true;
}

// Get alternative routes if current route is not eligible
export function getAlternativeRoutes(claimData: Partial<ClaimData>): RouteInfo[] {
  const alternatives: RouteInfo[] = [];
  
  // If postal, only BOR286 is available
  if (claimData.channel === 'postal') {
    return [HMRC_ROUTES.BOR286];
  }
  
  // If VAT registered, only VAT_RETURN is available
  if (claimData.isVATRegistered === true) {
    return [HMRC_ROUTES.VAT_RETURN];
  }
  
  // For low value claims, suggest seller refund first, then CDS
  if (claimData.claimType === 'low_value') {
    alternatives.push(HMRC_ROUTES.SELLER_REFUND);
    alternatives.push(HMRC_ROUTES.CDS);
    return alternatives;
  }
  
  // For other claim types, suggest appropriate routes
  switch (claimData.claimType) {
    case 'overpayment':
      alternatives.push(HMRC_ROUTES.CDS);
      break;
    case 'rejected_import':
      alternatives.push(HMRC_ROUTES.C285);
      break;
    case 'withdrawal':
      alternatives.push(HMRC_ROUTES['C&E1179']);
      break;
    default:
      alternatives.push(HMRC_ROUTES.CDS);
  }
  
  return alternatives;
}

// Get routing explanation for user
export function getRoutingExplanation(claimData: Partial<ClaimData>): string {
  const routeInfo = getRouteInfo(claimData);
  return `${routeInfo.name}: ${routeInfo.description}`;
}

// Get next steps for the determined route
export function getNextSteps(claimData: Partial<ClaimData>): string[] {
  const routeInfo = getRouteInfo(claimData);
  return routeInfo.process;
}

// Check if claim meets deadline requirements
export function checkDeadlineEligibility(claimData: Partial<ClaimData>, claimDate: Date = new Date()): {
  isEligible: boolean;
  daysRemaining: number;
  deadline: Date;
  message: string;
} {
  const routeInfo = getRouteInfo(claimData);
  const deadline = new Date(claimDate);
  deadline.setDate(deadline.getDate() + routeInfo.deadline);
  
  const now = new Date();
  const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const isEligible = daysRemaining > 0;
  
  let message = '';
  if (isEligible) {
    message = `You have ${daysRemaining} days remaining to submit your claim`;
  } else {
    message = `The deadline for this type of claim has passed (${daysRemaining} days overdue)`;
  }
  
  return {
    isEligible,
    daysRemaining,
    deadline,
    message
  };
}
