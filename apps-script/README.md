# Persona + Google Apps Script + Google Sheets (demo integration)

This integration is optional. The static website can remain on GitHub Pages; Google Apps Script receives an explicitly consented submission and appends **aggregate demo scores only** to a Google Sheet.

## Data sent

- Random demo record ID
- Submission timestamp
- Interface language (zh or en)
- Schema version
- Five illustrative dimension values (0–100)
- Consent flag

The website does **not** send individual question answers, the user's reflection note, name, email address, or phone number. These scores are illustrative demo output, not validated psychological measurements.

## Setup

1. Sign in to the Google account that should own the data.
2. Open [Google Apps Script](https://script.google.com/) and create a new standalone project.
3. Replace the contents of Code.gs with this repository file: [apps-script/Code.gs](https://github.com/AAKN2026/psycho/blob/main/apps-script/Code.gs).
4. In the Apps Script editor, select setupPersonaDatabase and click **Run**. Review the permissions and authorize spreadsheet access. Open **Execution log** to find the new spreadsheet URL. The spreadsheet is owned by your Google account.
5. Select **Deploy → New deployment → Web app**.
6. Choose **Execute as: Me**. For the current public demo, set access to **Anyone** so visitors can submit only the minimal demo result payload. This makes the endpoint public; see the security limitations below.
7. Click **Deploy**, complete any authorization prompts, and copy the URL ending in /exec (not a /dev test URL).
8. Open the [Persona website](https://aakn2026.github.io/psycho/), complete the demo questionnaire, then on the results page paste your /exec URL into the Google Sheets field, tick the consent box, and click **Save to Google Sheets**.
9. Open the spreadsheet and check the DemoResults tab. A new row should appear.

## Deploy updates

When Code.gs changes, open Apps Script and use **Deploy → Manage deployments → Edit** to select a new version and redeploy. Keep the /exec URL if you edit the existing deployment.

## Important security and privacy limits

- A public Apps Script Web App is **not a private API**. Anyone who discovers the URL can attempt to send requests. Input validation, a script lock, duplicate detection, and a storage cap reduce accidental misuse but are not strong abuse prevention.
- The browser uses a no-CORS POST because Apps Script web-app responses commonly cannot be read directly from a static cross-origin page. Therefore the website can say the request was sent, but **cannot verify that a row was written**; verify the result in Google Sheets.
- Do not use this demo endpoint for identifiable, clinical, or otherwise sensitive personal data. Do not add raw answers, free-text notes, email addresses, or names to the payload.
- Keep the Google Sheet private. Do not publish the spreadsheet or its sharing link on the website.
- For a public commercial product, add robust abuse prevention, a privacy notice and deletion/retention process, and obtain a privacy/security review. Consider a server-side backend with authentication and rate limiting instead of a public Apps Script endpoint.
- A Google Sheet is suitable for a small MVP, not a high-volume or high-sensitivity production database.

## Optional data-retention cleanup

The script also includes `purgePersonaDemoResultsOlderThan90Days()`, which deletes rows whose timestamp is older than 90 days. You can run it manually from the Apps Script editor. If you want automatic cleanup, run `installPersonaDailyRetentionTrigger()` once and authorize it; this installs a daily trigger that performs the same cleanup. Choose a retention period that matches your privacy notice and operational needs before enabling it. This cleanup is not installed automatically by the setup function.
