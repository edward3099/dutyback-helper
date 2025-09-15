# System Patterns: Dutyback Helper

## Architecture Overview
**Frontend**: Next.js 15.5.3 with App Router, React 19.1.0, TypeScript
**Backend**: Supabase (Postgres, Auth, Storage)
**UI**: Shadcn/UI components with Tailwind CSS
**Payments**: Stripe integration
**Deployment**: Vercel (frontend), Supabase Cloud (backend)

## Key Technical Decisions

### Frontend Architecture
- **Next.js App Router**: Modern routing with server components
- **Component Structure**: Organized by feature (dashboard, wizard, payments, etc.)
- **State Management**: React Context for auth and wizard state
- **Form Handling**: Custom hooks for validation and wizard progression
- **UI Components**: Shadcn/UI for consistency and accessibility

### Backend Architecture
- **Database**: Supabase Postgres with RLS (Row Level Security)
- **Authentication**: Supabase Auth with email/password
- **Storage**: Supabase Storage for file uploads (evidence documents)
- **API**: Supabase RPC functions and REST API
- **Edge Functions**: Stripe webhooks and payment processing

### Data Flow Patterns
```
User Input → Wizard Validation → Supabase Storage → Claim Pack Generation
     ↓
Courier Playbooks → MRN/EORI Collection → Evidence Upload
     ↓
Dashboard Tracking → Outcome Analytics → Success Metrics
```

## Component Relationships

### Core Components
- **Wizard System**: Multi-step form with conditional routing
- **Claim Management**: CRUD operations for user claims
- **Payment Processing**: Stripe integration for claim pack purchases
- **File Upload**: Evidence document handling with validation
- **Analytics Dashboard**: Success rate and outcome tracking

### Key Hooks
- `useWizard`: Manages wizard state and step progression
- `useFormValidation`: Handles form validation across steps
- `useAnalytics`: Tracks user behavior and outcomes
- `useRealtime`: Supabase real-time updates for claim status

## Design Patterns

### Routing Logic
```typescript
// Conditional routing based on user inputs
if (channel === 'postal') → BOR286
if (vatRegistered && claimType === 'import_vat') → VAT Return
if (claimValue <= 135 && vatChargedAtCheckout) → Seller Refund
else → CDS/C285/C&E1179 based on claim type
```

### Validation Patterns
- **MRN Format**: 18-character validation
- **Evidence Checklists**: Enforce HMRC requirements per route
- **File Uploads**: Type validation and size limits
- **Wizard Progression**: Block advancement until requirements met

### State Management
- **Wizard State**: Local state with session persistence
- **User Claims**: Supabase real-time subscriptions
- **Payment State**: Stripe session management
- **Analytics**: Event tracking for user actions

## Integration Patterns

### Supabase Integration
```typescript
// Standard pattern for data operations
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('user_id', user.id);
```

### Stripe Integration
```typescript
// Payment processing pattern
const session = await stripe.checkout.sessions.create({
  // payment configuration
});
```

### File Upload Pattern
```typescript
// Evidence upload with validation
const { data, error } = await supabase.storage
  .from('evidence')
  .upload(filePath, file);
```

## Security Patterns
- **RLS Policies**: Row-level security for user data isolation
- **File Validation**: Type and size checks for uploads
- **Payment Security**: Stripe handles sensitive payment data
- **Authentication**: Supabase Auth with secure session management

## Performance Patterns
- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image component
- **Caching**: Supabase query caching
- **Lazy Loading**: Components loaded on demand
