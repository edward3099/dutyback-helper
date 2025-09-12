// Constants for Dutyback Helper webapp

export const APP_CONFIG = {
  name: 'Dutyback Helper',
  description: 'Reclaim overpaid import VAT and duty from UK couriers',
  version: '1.0.0',
  url: 'https://dutyback-helper.com',
} as const;

export const HMRC_DEADLINES = {
  overpayment: 3 * 365, // 3 years in days
  rejected_import: 365, // 1 year in days
  withdrawal: 90, // 90 days
  low_value: 0, // Not eligible for refund
} as const;

export const MRN_FORMAT = {
  length: 18,
  pattern: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{14}$/,
} as const;

export const EORI_FORMAT = {
  pattern: /^GB[0-9]{12}$/,
} as const;

export const COURIER_PLAYBOOKS = {
  DHL: {
    name: 'DHL',
    contact: 'customercare@dhl.com',
    portal: 'https://www.dhl.com/contact-us',
    template: `Subject: Request for MRN and EORI for Import Duty Refund

Dear DHL Customer Service,

I am writing to request the Movement Reference Number (MRN) and Economic Operator Registration and Identification (EORI) number for a recent import that I believe was overcharged for VAT and duty.

Import Details:
- Tracking Number: [TRACKING_NUMBER]
- Import Date: [IMPORT_DATE]
- Value: £[VALUE]
- Description: [DESCRIPTION]

I need these details to submit a refund claim to HMRC. Please provide:
1. The 18-character MRN
2. The declarant's EORI number

Thank you for your assistance.

Best regards,
[YOUR_NAME]
[YOUR_EMAIL]
[YOUR_PHONE]`,
  },
  FedEx: {
    name: 'FedEx',
    contact: 'customer.service@fedex.com',
    portal: 'https://www.fedex.com/en-gb/customer-support.html',
    template: `Subject: Request for MRN and EORI for Import Duty Refund

Dear FedEx Customer Service,

I am writing to request the Movement Reference Number (MRN) and Economic Operator Registration and Identification (EORI) number for a recent import that I believe was overcharged for VAT and duty.

Import Details:
- Tracking Number: [TRACKING_NUMBER]
- Import Date: [IMPORT_DATE]
- Value: £[VALUE]
- Description: [DESCRIPTION]

I need these details to submit a refund claim to HMRC. Please provide:
1. The 18-character MRN
2. The declarant's EORI number

Thank you for your assistance.

Best regards,
[YOUR_NAME]
[YOUR_EMAIL]
[YOUR_PHONE]`,
  },
  UPS: {
    name: 'UPS',
    contact: 'customer.service@ups.com',
    portal: 'https://www.ups.com/gb/en/support/contact-us.page',
    template: `Subject: Request for MRN and EORI for Import Duty Refund

Dear UPS Customer Service,

I am writing to request the Movement Reference Number (MRN) and Economic Operator Registration and Identification (EORI) number for a recent import that I believe was overcharged for VAT and duty.

Import Details:
- Tracking Number: [TRACKING_NUMBER]
- Import Date: [IMPORT_DATE]
- Value: £[VALUE]
- Description: [DESCRIPTION]

I need these details to submit a refund claim to HMRC. Please provide:
1. The 18-character MRN
2. The declarant's EORI number

Thank you for your assistance.

Best regards,
[YOUR_NAME]
[YOUR_EMAIL]
[YOUR_PHONE]`,
  },
} as const;

export const EVIDENCE_REQUIREMENTS = {
  CDS: ['mrn', 'eori', 'invoice', 'transport_doc'],
  C285: ['mrn', 'eori', 'invoice'],
  'C&E1179': ['invoice', 'entitlement_proof', 'worksheet'],
  BOR286: ['charge_reference', 'invoice'],
  VAT_RETURN: ['invoice', 'import_documentation'],
  SELLER_REFUND: ['invoice', 'seller_contact'],
} as const;

export const WIZARD_STEPS = [
  {
    id: 1,
    title: 'Channel',
    description: 'How was your item delivered?',
    route: '/wizard/channel',
  },
  {
    id: 2,
    title: 'VAT Status',
    description: 'Are you VAT registered?',
    route: '/wizard/vat-status',
  },
  {
    id: 3,
    title: 'Claim Type',
    description: 'What type of claim?',
    route: '/wizard/claim-type',
  },
  {
    id: 4,
    title: 'Identifiers',
    description: 'MRN and EORI details',
    route: '/wizard/identifiers',
  },
  {
    id: 5,
    title: 'Evidence',
    description: 'Upload required documents',
    route: '/wizard/evidence',
  },
  {
    id: 6,
    title: 'Review',
    description: 'Review and export claim pack',
    route: '/wizard/review',
  },
] as const;

export const PRICING = {
  free: {
    name: 'Free Triage',
    price: 0,
    features: ['Route identification', 'Courier templates', 'Basic guidance'],
  },
  basic: {
    name: 'Basic Claim Pack',
    price: 9,
    features: ['Complete claim pack', 'Evidence checklist', 'HMRC guidance'],
  },
  premium: {
    name: 'Premium Pack + QC',
    price: 19,
    features: ['Everything in Basic', 'Quality check', 'Reminder system', 'Priority support'],
  },
} as const;

export const ROUTING_RULES = {
  postal: 'BOR286',
  vat_registered: 'VAT_RETURN',
  under_135: 'SELLER_REFUND',
  overpayment: 'CDS',
  rejected_import: 'C285',
  withdrawal: 'C&E1179',
} as const;
