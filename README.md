# Persona — Personality Insight Lab

A bilingual (Simplified Chinese / English), responsive Next.js MVP for a thoughtful personality-insight experience.

## Release status

**Current release: demo only. Not a validated psychometric assessment.**

The app now includes a bilingual IPIP-NEO-120 item bank (English source items and published Mandarin translation), deterministic reverse-key scoring for five broad factors, 30 four-item facet scores, browser-local progress saving, a private reflection note with TXT export, print-friendly results, and separate visual, multi-sensory, and optional auditory activities. The personality inventory has published research and Mandarin translation evidence, but this website has not independently validated it in a Singapore bilingual sample or established local norms.

It has no production-grade database, authentication, admin console, payments, server-side scoring, or AI report service. An optional Google Apps Script + Sheets integration is provided for saving only five aggregate factor scores after explicit consent; it does not save the 120 item responses or 30 facet scores, so retrieved reports can restore only the five broad factors. This public endpoint is not suitable for sensitive or commercial production data. Do not collect sensitive assessment data or sell reports on this prototype. The inventory has published research and Mandarin translation evidence, but the website has not been independently validated in a Singapore bilingual sample and has no local norms. Results are for self-reflection and must not be used for diagnosis, hiring, or consequential decisions.

## Stack

- Next.js 15.5.24 + React 18 + TypeScript (framework version upgraded to a patched release before deployment)
- Responsive CSS; demo content currently lives in the frontend
- GitHub Pages static-export deployment configuration
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

The static-export smoke check verifies the generated homepage, 404 page, favicon, robots policy, and GitHub Pages asset base path in `out/`. It does not call a server API because GitHub Pages is static hosting. The check does not replace full browser end-to-end testing. Run the type check, lint, production build, and browser flow checks before calling the release verified.

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

The repository includes a minimal opt-in integration for saving five aggregate factor scores to a Google Sheet and retrieving them with a code. It does not store item-level answers or facet scores. It is intentionally separate from the static site: the browser sends a small JSON payload to the Web App URL centrally configured by the site operator.

- Setup instructions: [apps-script/README.md](https://github.com/AAKN2026/psycho/blob/main/apps-script/README.md)
- Apps Script receiver: [apps-script/Code.gs](https://github.com/AAKN2026/psycho/blob/main/apps-script/Code.gs)

Only a random record ID, timestamp, language, schema version, five illustrative dimension scores, a retrieval code, and a consent flag are sent. Individual answers, reflection notes, names, email addresses, and phone numbers are excluded. The endpoint is configured by the site operator in `app/page.tsx`; visitors do not enter a Google URL. A visitor must explicitly tick consent and click save. The retrieval code can be used to look up the saved aggregate scores on another device.

**Setup:** create or open your Apps Script project, copy `apps-script/Code.gs`, run `setupPersonaDatabase()` once to authorize spreadsheet access and create/upgrade the sheet, then deploy a Web App (execute as you, access available to anyone). Update the existing Web App deployment to a new version whenever you change the script. The endpoint must match `PUBLIC_APPS_SCRIPT_ENDPOINT` in `app/page.tsx`. Test by saving a demo report, confirming the `access_code` and score columns in `DemoResults`, then retrieving that code in a private/incognito window or another device. Committing Code.gs to GitHub does not deploy it to Google. The website uses a no-CORS save request, so it cannot confirm the row was written; verify it in the Google Sheet. A public Apps Script endpoint is not a private API and should only be used for low-risk demo data. Do not use it for identifiable or sensitive psychological data. For a commercial launch, use a properly secured backend with authentication, abuse prevention, retention/deletion controls, and a reviewed privacy notice.

## Environment configuration for future backend work

`.env.example` is a planning template only. Do not add placeholder secrets or copy server-only secrets into variables prefixed with `NEXT_PUBLIC_`. Before connecting real services, configure them in the hosting provider's encrypted environment settings and implement authentication, authorization, server-side validation, data retention, and deletion flows.

## Scientific, privacy, and product guardrails

1. Review the exact assessment instrument, scoring rules, language rights, interpretation boundaries, and norms (if any) before offering a formal assessment. The core personality items now use the public-domain IPIP-NEO-120 inventory and a published Mandarin translation. The site's implementation and score presentation still require independent verification, and Singapore bilingual norms have not been established.
2. Evidence for English items does not automatically validate a Chinese translation.
3. Never invent scores, norms, percentiles, diagnoses, or scientific validity.
4. State clearly that personality insights are not a clinical diagnosis. The sound activity records only a six-trial same/different auditory task; it is not a personality, intelligence, or hearing test.
5. Before storing real responses, implement least-privilege access, row-level security, retention limits, deletion workflows, and security testing.
6. Before charging users, implement server-verified payment webhooks, entitlement checks, and secure report access.

## Current feature checklist

- [x] Responsive bilingual landing page
- [x] IPIP-NEO-120 bilingual item bank and required-answer validation
- [x] Deterministic five-factor and 30-facet scoring (not percentiles)
- [x] Browser-local save/resume
- [x] Five-factor results, 30 facet results, and reflection prompts
- [x] Private reflection journal saved in the current browser
- [x] Download reflection note as a plain-text file
- [x] Print-friendly report
- [x] Branded loading, error, and 404 states
- [x] Basic security response headers
- [x] Vercel deployment configuration and documented release checklist
- [x] Non-sensitive health endpoint and deployed-site smoke-check script
- [ ] Production build and browser E2E tests executed
- [ ] Successful hosted deployment verified
- [x] Public-domain IPIP-NEO-120 source items and published Mandarin translation selected
- [ ] Independent Singapore bilingual validation and local norms
- [x] Optional Google Apps Script + Sheets integration for anonymous aggregate scores (manual setup required)\n- [ ] Production-grade backend, authentication, privacy controls, payments, and paid reports
