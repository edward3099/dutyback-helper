-- Seed pricing tiers with recommended hybrid value + success model
INSERT INTO pricing_tiers (id, name, description, price, features, is_popular, created_at, updated_at) VALUES
(
  'free',
  'Free Triage',
  'Perfect for getting started and understanding your claim options',
  0,
  '["Route identification", "Basic courier templates", "HMRC guidance links", "Community support", "Basic deadline reminders"]',
  false,
  NOW(),
  NOW()
),
(
  'basic',
  'Basic Claim Pack',
  'Most popular choice - everything you need to submit your claim',
  1200,
  '["Complete claim pack generation", "Evidence checklist enforcement", "Email templates", "Basic deadline reminders", "Email support", "HMRC form generation"]',
  true,
  NOW(),
  NOW()
),
(
  'premium',
  'Premium Pack + QC',
  'For high-value claims with quality assurance and success guarantee',
  2500,
  '["Everything in Basic", "Quality assurance review", "Priority support (24-48hr response)", "Success guarantee (refund if not approved)", "Phone support", "Advanced deadline tracking", "Personalized guidance"]',
  false,
  NOW(),
  NOW()
),
(
  'enterprise',
  'Enterprise',
  'For businesses and high-volume users',
  5000,
  '["Everything in Premium", "Dedicated account manager", "Bulk processing (5+ claims)", "Custom templates", "White-label options", "API access", "Priority processing"]',
  false,
  NOW(),
  NOW()
);

-- Add some sample analytics data for demonstration
INSERT INTO analytics_events (id, user_id, event_type, event_name, properties, created_at) VALUES
('analytics_1', 'demo_user_1', 'business', 'claim_submitted', '{"route": "CDS", "value": 150, "tier": "basic"}', NOW() - INTERVAL '5 days'),
('analytics_2', 'demo_user_2', 'business', 'claim_approved', '{"route": "BOR286", "refund_amount": 75, "tier": "premium"}', NOW() - INTERVAL '3 days'),
('analytics_3', 'demo_user_3', 'business', 'claim_submitted', '{"route": "VAT_RETURN", "value": 300, "tier": "premium"}', NOW() - INTERVAL '1 day');

-- Add some sample policy changes for the support page
INSERT INTO policy_changes (id, policy_name, change_type, description, severity, created_at) VALUES
('policy_1', 'HMRC Deadline Extension for Low-Value Claims', 'deadline', 'HMRC has extended the deadline for low-value claims from 30 days to 45 days', 'HIGH', NOW() - INTERVAL '10 days'),
('policy_2', 'New Documentation Requirements for Overpayment Claims', 'documentation', 'Additional proof of payment required for overpayment claims over £100', 'MEDIUM', NOW() - INTERVAL '5 days'),
('policy_3', 'Royal Mail Process Update', 'process', 'Royal Mail has updated their internal process for handling duty refund requests', 'LOW', NOW() - INTERVAL '2 days');
