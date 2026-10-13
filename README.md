# Persona — Personality Insight Lab

A bilingual (Simplified Chinese / English), responsive web app MVP for evidence-informed adult personality assessment and paid in-depth reports.

## Current status

- [x] Initial Next.js + TypeScript scaffold
- [x] Responsive bilingual landing page prototype
- [x] Interactive bilingual demo questionnaire (15 original demo items)
- [x] Previous / next navigation, progress indicator and required-answer validation
- [x] Browser-local progress saving and resume
- [x] Demo result visualisation across five illustrative dimensions
- [x] MVP disclaimer and science-first positioning
- [ ] Expert-approved assessment instrument and licensed/verified language versions
- [ ] Supabase Auth, schema, RLS policies and migrations
- [ ] Server-backed assessment sessions, item delivery and response persistence (the current demo is browser-local only)
- [ ] Deterministic scoring engine with versioned scoring keys
- [x] Demo results page (illustrative only; not validated psychometric scores)
- [x] Dimension-specific reflection prompts in the demo report
- [x] Browser print / Save as PDF action with print-friendly layout
- [x] Branded responsive 404 page
- [x] Branded loading state and recoverable application-error screen
- [x] Document language attribute follows the selected Chinese / English locale
- [x] ESLint configuration for Next.js Core Web Vitals rules
- [ ] Payment provider, verified webhooks and paid report entitlements
- [ ] AI report generation with schema validation and audit trail
- [ ] Secure PDF delivery, deletion workflow and admin dashboard
- [ ] Psychometric, security, accessibility and bilingual QA
- [ ] Run production build and browser end-to-end checks before public launch

## Stack

- Next.js App Router + TypeScript
- Supabase (Auth + PostgreSQL + Row Level Security), to be configured
- Server-side scoring and AI report generation
- Payment provider integration, to be selected and configured
- Responsive CSS; bilingual copy and demo items are currently held in the frontend

## Local development

Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Environment configuration

Copy `.env.example` to `.env.local` and fill in values only after the corresponding services are created. Never expose `SUPABASE_SERVICE_ROLE_KEY`, payment secrets, webhook secrets, or AI provider keys to browser code.

## Demo limitations

The current questionnaire is a product-flow prototype. Its original demo items, simple illustrative scoring, and dimension descriptions are not a validated psychometric instrument, do not use population norms, and must not be used for diagnosis, hiring, or consequential decisions. Progress is saved only in the current browser and is not sent to a database. Clearing browser storage removes the saved demo progress.

## Scientific and safety guardrails

1. Do not launch a paid assessment until the exact instrument, item set, scoring rules, language rights, interpretation boundaries and norms (if any) have been reviewed.
2. English evidence does not automatically validate a translated Chinese version.
3. AI must explain verified scores; it must never calculate or invent psychometric scores, norms, percentiles or diagnoses.
4. Clearly state that personality insights are not a clinical diagnosis.
5. Apply least privilege, RLS, retention limits, deletion workflows, and secure payment verification before collecting real assessment data.

## Deployment

This is a Next.js application, not a static GitHub Pages site. Deploy to a compatible host such as Vercel or another Node.js hosting provider. GitHub remains the source-code repository.
