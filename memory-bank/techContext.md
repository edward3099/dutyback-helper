# Technical Context: Dutyback Helper

## Technology Stack

### Frontend
- **Framework**: Next.js 15.5.3 (App Router)
- **React**: 19.1.0 with TypeScript 5
- **Styling**: Tailwind CSS 4 with Shadcn/UI components
- **Icons**: Lucide React
- **Animations**: Framer Motion, GSAP, React Spring
- **3D Graphics**: Three.js with React Three Fiber
- **Charts**: Recharts
- **File Handling**: File-saver, JSZip, html2canvas, jsPDF

### Backend
- **Database**: Supabase Postgres
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Edge Functions**: Supabase Edge Functions (TypeScript)
- **API**: Supabase REST API and RPC functions

### Payments
- **Payment Processor**: Stripe
- **Integration**: @stripe/stripe-js, stripe (server-side)

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint with Next.js config
- **Build Tool**: Turbopack (Next.js)
- **Type Checking**: TypeScript

## Development Setup

### Project Structure
```
dutyrefund/
├── webapp/                 # Next.js frontend
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities and API clients
│   │   └── types/         # TypeScript types
│   └── package.json
├── backend/               # Node.js backend (if needed)
├── supabase/             # Supabase configuration
│   ├── functions/        # Edge functions
│   └── migrations/       # Database migrations
└── memory-bank/          # Project documentation
```

### Key Dependencies
- **UI Components**: @radix-ui/* packages for accessible components
- **Form Handling**: Custom validation with react-hook-form patterns
- **State Management**: React Context + useState/useReducer
- **Data Fetching**: Supabase client with real-time subscriptions
- **File Processing**: Multiple libraries for PDF generation and ZIP creation

## Technical Constraints

### Performance Requirements
- **Load Time**: < 3 seconds initial load
- **Wizard Steps**: Smooth transitions between steps
- **File Uploads**: Support up to 10MB per file
- **Real-time Updates**: < 1 second latency for claim status changes

### Browser Support
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Responsive**: Support for mobile devices
- **Accessibility**: WCAG 2.1 AA compliance

### Security Requirements
- **Data Protection**: GDPR compliance for EU users
- **File Security**: Virus scanning for uploaded documents
- **Payment Security**: PCI DSS compliance via Stripe
- **Authentication**: Secure session management

## Environment Configuration

### Required Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Integration Points

### Supabase Integration
- **Database Tables**: Users, Claims, Identifiers, Evidence, Outcomes, Updates
- **Authentication**: Email/password with email verification
- **Storage Buckets**: evidence-documents, claim-packs
- **Real-time**: Claim status updates, notification system

### Stripe Integration
- **Products**: Free triage, £9 basic pack, £19 premium pack
- **Payment Flow**: Checkout session → webhook → claim pack generation
- **Webhooks**: Payment success/failure handling

### External APIs
- **HMRC**: Policy change monitoring (future)
- **Courier APIs**: None (manual playbooks only)
- **Email**: Supabase Auth email templates

## Deployment Architecture

### Frontend (Vercel)
- **Build**: Next.js static export or serverless functions
- **CDN**: Vercel Edge Network
- **Domain**: Custom domain with SSL
- **Environment**: Production and staging environments

### Backend (Supabase)
- **Database**: Managed Postgres with backups
- **Edge Functions**: Serverless TypeScript functions
- **Storage**: Global CDN for file storage
- **Auth**: Managed authentication service

### Monitoring
- **Analytics**: Vercel Analytics
- **Error Tracking**: Built-in Next.js error reporting
- **Performance**: Web Vitals monitoring
- **Uptime**: Vercel and Supabase monitoring
