/**
 * Persona demo-result receiver for Google Apps Script + Google Sheets.
 *
 * Stores only anonymous aggregate demo scores. Never accept raw answers,
 * reflection notes, names, email addresses, or other identifying details.
 *
 * Setup:
 * 1. Create a standalone Apps Script project at https://script.google.com/
 * 2. Paste this file into Code.gs.
 * 3. Run setupPersonaDatabase() once and authorize spreadsheet access.
 * 4. Deploy > New deployment > Web app; Execute as: Me.
 *    Access: Anyone. Copy the /exec URL into Persona's result screen.
 *
 * IMPORTANT: a public Apps Script web app is not a private/authenticated API.
 * This endpoint is intended only for low-risk demo data. Review privacy,
 * abuse controls, and applicable laws before collecting real user data.
 */

const CONFIG = {
  spreadsheetProperty: "PERSONA_SPREADSHEET_ID",
  sheetName: "DemoResults",
  maxRows: 5000,
  headers: [
    "record_id",
    "created_at",
    "locale",
    "schema_version",
    "openness",
    "conscientiousness",
    "extraversion",
    "agreeableness",
    "emotional_balance",
    "consent"
  ]
};

/**
 * Run once manually from the Apps Script editor.
 * Creates a spreadsheet and stores its ID in Script Properties.
 */
function setupPersonaDatabase() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty(CONFIG.spreadsheetProperty);
  let spreadsheet;

  if (spreadsheetId) {
    spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  } else {
    spreadsheet = SpreadsheetApp.create("Persona Demo Results");
    spreadsheetId = spreadsheet.getId();
    properties.setProperty(CONFIG.spreadsheetProperty, spreadsheetId);
  }

  let sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
  if (!sheet) sheet = spreadsheet.insertSheet(CONFIG.sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, CONFIG.headers.length).setValues([CONFIG.headers]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, CONFIG.headers.length).setFontWeight("bold");
    sheet.autoResizeColumns(1, CONFIG.headers.length);
  }

  Logger.log("Persona spreadsheet: " + spreadsheet.getUrl());
  return spreadsheet.getUrl();
}

/**
 * Optional retention cleanup: delete demo records older than 90 days.
 * Run manually from the editor, or install the daily trigger below.
 */
function purgePersonaDemoResultsOlderThan90Days() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty(CONFIG.spreadsheetProperty);
  if (!spreadsheetId) throw new Error("Run setupPersonaDatabase() first.");

  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(CONFIG.sheetName);
  if (!sheet || sheet.getLastRow() < 2) return 0;

  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  const timestamps = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
  let deleted = 0;

  // Delete bottom-up so row indexes remain valid.
  for (let i = timestamps.length - 1; i >= 0; i--) {
    const parsed = Date.parse(String(timestamps[i][0]));
    if (Number.isFinite(parsed) && parsed < cutoff) {
      sheet.deleteRow(i + 2);
      deleted++;
    }
  }
  Logger.log("Deleted " + deleted + " demo result rows older than 90 days.");
  return deleted;
}

/**
 * Optional: run once to install a daily retention-cleanup trigger.
 * Google will ask you to authorize trigger execution.
 */
function installPersonaDailyRetentionTrigger() {
  const handler = "purgePersonaDemoResultsOlderThan90Days";
  const exists = ScriptApp.getProjectTriggers().some(function(trigger) {
    return trigger.getHandlerFunction() === handler;
  });
  if (!exists) {
    ScriptApp.newTrigger(handler).timeBased().everyDays(1).atHour(3).create();
  }
  Logger.log("Daily 90-day retention cleanup is " + (exists ? "already installed." : "installed."));
}

function doGet() {
  return jsonResponse({
    ok: true,
    service: "persona-demo-results",
    schemaVersion: 1,
    message: "Endpoint is running. Submit demo results with POST."
  });
}

function doPost(event) {
  const lock = LockService.getScriptLock();
  try {
    const raw = event && event.postData && event.postData.contents;
    if (!raw || raw.length > 12000) {
      return jsonResponse({ ok: false, error: "invalid_payload" });
    }

    const payload = JSON.parse(raw);
    const validated = validatePayload(payload);
    if (!validated.ok) {
      return jsonResponse({ ok: false, error: validated.error });
    }

    const properties = PropertiesService.getScriptProperties();
    const spreadsheetId = properties.getProperty(CONFIG.spreadsheetProperty);
    if (!spreadsheetId) {
      return jsonResponse({ ok: false, error: "run_setup_first" });
    }

    lock.waitLock(10000);
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(CONFIG.sheetName);
    if (!sheet) return jsonResponse({ ok: false, error: "sheet_missing" });

    if (sheet.getLastRow() >= CONFIG.maxRows + 1) {
      return jsonResponse({ ok: false, error: "demo_storage_limit_reached" });
    }

    // Prevent accidental duplicate submissions when a browser retries.
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const startRow = Math.max(2, lastRow - 499);
      const ids = sheet.getRange(startRow, 1, lastRow - startRow + 1, 1).getDisplayValues().flat();
      if (ids.includes(validated.recordId)) {
        return jsonResponse({ ok: true, duplicate: true, recordId: validated.recordId });
      }
    }

    const score = validated.scores;
    sheet.appendRow([
      validated.recordId,
      validated.createdAt,
      validated.locale,
      validated.schemaVersion,
      score.openness,
      score.conscientiousness,
      score.extraversion,
      score.agreeableness,
      score.emotionalBalance,
      true
    ]);

    return jsonResponse({ ok: true, recordId: validated.recordId });
  } catch (error) {
    console.error(error);
    return jsonResponse({ ok: false, error: "internal_error" });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function validatePayload(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, error: "invalid_payload" };
  }
  if (payload.action !== "save_demo_result" || payload.consent !== true) {
    return { ok: false, error: "consent_required" };
  }
  if (payload.schemaVersion !== 1) {
    return { ok: false, error: "unsupported_schema" };
  }
  if (typeof payload.recordId !== "string" || !/^psn_[a-z0-9]+_[a-z0-9]{4,16}$/.test(payload.recordId)) {
    return { ok: false, error: "invalid_record_id" };
  }
  if (payload.locale !== "zh" && payload.locale !== "en") {
    return { ok: false, error: "invalid_locale" };
  }
  if (typeof payload.createdAt !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(payload.createdAt) || isNaN(Date.parse(payload.createdAt))) {
    return { ok: false, error: "invalid_timestamp" };
  }

  const keys = ["openness", "conscientiousness", "extraversion", "agreeableness", "emotionalBalance"];
  if (!payload.scores || typeof payload.scores !== "object" || Array.isArray(payload.scores)) {
    return { ok: false, error: "invalid_scores" };
  }
  const scores = {};
  for (const key of keys) {
    const value = payload.scores[key];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) {
      return { ok: false, error: "invalid_score_" + key };
    }
    scores[key] = Math.round(value);
  }
  return {
    ok: true,
    recordId: payload.recordId,
    createdAt: payload.createdAt,
    locale: payload.locale,
    schemaVersion: 1,
    scores: scores
  };
}

function jsonResponse(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
