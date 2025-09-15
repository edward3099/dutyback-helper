# Project Brief: Dutyback Helper

## Project Overview
**Dutyback Helper** is a web application that guides UK consumers and micro-sellers through the complex process of reclaiming overcharged import VAT/duty from couriers via HMRC processes.

## Core Problem
UK consumers and micro-sellers are often overcharged import VAT/duty by couriers. Reclaiming is possible via HMRC processes (CDS, C285, BOR286, C&E1179, VAT Return), but users get stuck because:
- They don't know the correct route
- They lack required identifiers (MRN, declarant EORI)
- They miss mandatory evidence items
- HMRC rules change often

## Solution
A guided webapp that:
- Routes users to the right HMRC process
- Helps retrieve identifiers from couriers
- Enforces evidence checklists
- Generates a clean claim pack

## Key Goals (v1)
1. Always route users to the **correct HMRC process** (CDS / C285 / BOR286 / C&E1179 / VAT Return / Seller Refund)
2. Provide **courier-specific playbooks** for MRN/EORI acquisition
3. Enforce **evidence guardrails** that mirror HMRC "what you'll need" lists
4. Generate a **claim pack** that's correct and complete
5. Build **trust** with anonymised outcome telemetry (approval %, median days, avg refund £)
6. Keep **pricing accessible** for small claim values (£10–£60)

## Target Users
- **Consumers** importing goods via couriers or post
- **Micro-sellers** and hobby traders under VAT threshold
- **Small businesses** with occasional imports, not using enterprise customs platforms

## Success Metrics
- Routing accuracy %
- Average courier response time for MRN/EORI
- Evidence completion rate
- Decision outcomes: approval %, median days, avg refund

## Non-Goals
- Filing claims as an authorised agent
- Deep courier API integrations (playbooks/manual templates only)
- Legal/tariff advisory services

## Project Status
Currently in active development with:
- Next.js frontend with Shadcn/UI components
- Supabase backend (Postgres, Auth, Storage)
- Stripe payment integration
- Wizard-based user flow implemented
- Multiple screens and components built
