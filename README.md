# Persona — Personality Insight Lab

A bilingual (Simplified Chinese / English), responsive Next.js MVP for a thoughtful personality-insight experience.

## Release status

**Current release: demo only. Not a validated psychometric assessment.**

The app currently includes a bilingual landing page, 15 original demo questions, illustrative five-dimension results, browser-local progress saving, a private browser-local reflection note with TXT export, print-friendly results, and branded loading/error/not-found states.

It has no production-grade database, authentication, admin console, payments, server-side scoring, or AI report service. An optional Google Apps Script + Sheets demo integration is provided; it stores only anonymous aggregate demo scores after explicit consent and is not suitable for sensitive or commercial production data. Do not collect sensitive assessment data or sell reports on this prototype. Demo scores are not validated measurements and must not be used for diagnosis, hiring, or consequential decisions.

## Stack

- Next.js 15.5.24 + React 18 + TypeScript (framework version upgraded to a patched release before deployment)
- Responsive CSS; demo content currently lives in the frontend
- Vercel-compatible deployment configuration
- No environment variables are required to run the demo

## Local development

Requirements: Node.js 20 or later.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Checks before release

```bash
npm run typecheck
npm run lint
npm run build
npm start
# In a separate terminal, after the server is running:
npm run smoke
```

The smoke check verifies the homepage, favicon, robots policy, and `/api/health` endpoint. For a deployed site, run it with `BASE_URL=https://your-deployment.example npm run smoke`. It does not replace full browser end-to-end testing. Run the type check, lint, production build, and browser flow checks before calling the release verified.

## Automated verification

GitHub Actions runs TypeScript checking, ESLint, and a production build on pushes to `main`, pull requests, and manual dispatch. See the [latest workflow runs](https://github.com/AAKN2026/psycho/actions). A green workflow is required before treating the code as build-verified; deployment and browser testing must still be confirmed separately.

## Publish with GitHub Pages

This repository is configured for a static Next.js export and GitHub Pages deployment. The demo is frontend-only; server API routes and server-only features are not available on GitHub Pages.

1. Open **Settings → Pages** in this repository: https://github.com/AAKN2026/psycho/settings/pages
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open **Actions** and check the **Deploy to GitHub Pages** workflow. It runs automatically after commits to `main`, or can be started manually.
4. Wait for the deployment job to succeed. The expected project URL is https://aakn2026.github.io/psycho/ .
5. Test the URL on desktop and mobile: landing page, Chinese/English switch, every question, required-answer validation, browser refresh/resume, results, print/save PDF, and unknown-route 404.

The workflow builds to `out/`, checks the static artifacts, and deploys that folder. Because this is a project site, the production base path is `/psycho`. If the repository is renamed, update the base path in `next.config.mjs`.

GitHub Pages can host the current static demo, but it cannot run Next.js server routes, a database, authentication endpoints, payment webhooks, or server-side AI report generation. Those require a separate backend or a server-capable host.

## Optional Google Apps Script + Google Sheets

The repository includes a minimal opt-in integration for saving aggregate demo scores to a Google Sheet. It is intentionally separate from the static site: the browser sends a small JSON payload to a Web App URL that you deploy and own.

- Setup instructions: [apps-script/README.md](https://github.com/AAKN2026/psycho/blob/main/apps-script/README.md)
- Apps Script receiver: [apps-script/Code.gs](https://github.com/AAKN2026/psycho/blob/main/apps-script/Code.gs)

Only a random record ID, timestamp, language, schema version, five illustrative dimension scores, and a consent flag are sent. Individual answers, reflection notes, names, email addresses, and phone numbers are excluded. The user must enter their own Apps Script deployment URL and explicitly tick consent before submitting.

**Important:** you must create and deploy the Apps Script in your Google account; committing Code.gs to GitHub does not deploy it to Google. The website uses a no-CORS request, so it cannot confirm the row was written; verify it in the Google Sheet. A public Apps Script endpoint is not a private API and should only be used for low-risk demo data. Do not use it for identifiable or sensitive psychological data. For a commercial launch, use a properly secured backend with authentication, abuse prevention, retention/deletion controls, and a reviewed privacy notice.

## Environment configuration for future backend work

`.env.example` is a planning template only. Do not add placeholder secrets or copy server-only secrets into variables prefixed with `NEXT_PUBLIC_`. Before connecting real services, configure them in the hosting provider's encrypted environment settings and implement authentication, authorization, server-side validation, data retention, and deletion flows.

## Scientific, privacy, and product guardrails

1. Review the exact assessment instrument, scoring rules, language rights, interpretation boundaries, and norms (if any) before offering a formal assessment.
2. Evidence for English items does not automatically validate a Chinese translation.
3. Never invent scores, norms, percentiles, diagnoses, or scientific validity.
4. State clearly that personality insights are not a clinical diagnosis.
5. Before storing real responses, implement least-privilege access, row-level security, retention limits, deletion workflows, and security testing.
6. Before charging users, implement server-verified payment webhooks, entitlement checks, and secure report access.

## Current feature checklist

- [x] Responsive bilingual landing page
- [x] Demo questionnaire and required-answer validation
- [x] Browser-local save/resume
- [x] Illustrative results and reflection prompts
- [x] Private reflection journal saved in the current browser
- [x] Download reflection note as a plain-text file
- [x] Print-friendly report
- [x] Branded loading, error, and 404 states
- [x] Basic security response headers
- [x] Vercel deployment configuration and documented release checklist
- [x] Non-sensitive health endpoint and deployed-site smoke-check script
- [ ] Production build and browser E2E tests executed
- [ ] Successful hosted deployment verified
- [ ] Expert-reviewed and licensed assessment instrument
- [x] Optional Google Apps Script + Sheets integration for anonymous demo scores (manual setup required)\n- [ ] Production-grade backend, authentication, privacy controls, payments, and paid reports
