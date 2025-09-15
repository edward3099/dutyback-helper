# Product Context: Dutyback Helper

## Why This Project Exists
UK import duty/VAT overcharging is a widespread problem affecting thousands of consumers and small businesses annually. The HMRC reclaim process is complex, with multiple routes depending on circumstances, and users frequently fail due to missing information or incorrect routing.

## Problems We Solve
1. **Routing Confusion**: Users don't know which HMRC process applies to their situation
2. **Missing Identifiers**: Users lack MRN (Movement Reference Number) and EORI (Economic Operator Registration and Identification) numbers
3. **Incomplete Evidence**: Users miss mandatory documentation required by HMRC
4. **Policy Changes**: HMRC rules change frequently, making guidance outdated

## How It Should Work
### User Journey
1. **Homepage** → Clear value proposition and "Start Claim" CTA
2. **Guided Wizard** → Step-by-step process that automatically routes users
3. **Courier Playbooks** → Specific instructions for getting MRN/EORI from each courier
4. **Evidence Validation** → Enforced checklists matching HMRC requirements
5. **Claim Pack Generation** → Complete, formatted submission package
6. **Dashboard Tracking** → Monitor claim status and deadlines
7. **Outcome Analytics** → Build trust through success rate transparency

### Key User Flows
#### Main Wizard Flow
1. **Channel Selection**: Courier vs Postal (determines routing)
2. **VAT Status**: VAT-registered vs not (affects process)
3. **Claim Type**: Overpayment, rejected import, withdrawal, ≤£135 seller refund
4. **Identifiers**: MRN/EORI collection with courier-specific help
5. **Evidence Upload**: Mandatory document checklists
6. **Review & Export**: Final validation and claim pack generation

#### Branch Screens
- **BOR286 Postal Screen**: For Royal Mail/Parcelforce claims
- **VAT Return Info**: For VAT-registered users (must use VAT return)
- **Seller Refund Info**: For ≤£135 claims (must go to seller/marketplace)

## User Experience Goals
1. **Simplicity**: Complex HMRC processes made accessible
2. **Accuracy**: 100% correct routing to prevent claim rejections
3. **Completeness**: All required evidence captured before submission
4. **Transparency**: Clear expectations and success metrics
5. **Support**: Help available at every step

## Success Indicators
- High completion rate through wizard
- Low HMRC rejection rate due to missing information
- Positive user feedback on process clarity
- Strong conversion from free triage to paid claim packs
- Growing user base and repeat usage

## Competitive Advantage
- **Comprehensive Routing**: Covers all HMRC processes in one tool
- **Courier-Specific Guidance**: Detailed playbooks for each major courier
- **Evidence Enforcement**: Prevents incomplete submissions
- **Outcome Transparency**: Builds trust through success metrics
- **Accessible Pricing**: Designed for small claim values
