/**
 * Vaelro Website Leads — Apps Script Web App
 * ------------------------------------------------------------------
 * Versioned source of truth for the backend behind the site's contact
 * flow (src/components/sections/ContactFlow.tsx). Paste this into the
 * Apps Script editor bound to the Google Sheet named
 * "Vaelro Website Leads", set TURNSTILE_SECRET in Script Properties,
 * then deploy as a Web App (see DEPLOY notes at the bottom).
 *
 * The frontend POSTs a JSON object as a plain-text body (no JSON
 * content-type header) to avoid a CORS preflight. Shape:
 *
 *   {
 *     name, business, email, phone,
 *     need,              // human-readable answer to "What brings you in?"
 *     websiteSituation,  // human-readable 2W answer, or ""
 *     busywork,          // human-readable 2A answer, or ""
 *     headache,          // human-readable 2N answer, or ""
 *     urgency,           // human-readable answer to "How soon..."
 *     budget,            // human-readable answer to "What budget..."
 *     notes,             // optional free text
 *     source,            // page path the form was submitted from
 *     website_url,       // honeypot — must be empty for a real human
 *     token              // Cloudflare Turnstile token
 *   }
 */

// Header row, in the exact required order.
var HEADERS = [
  'Timestamp',
  'Name',
  'Business',
  'Email',
  'Phone',
  'Need',
  'Website situation',
  'Busywork',
  'Headache',
  'Urgency',
  'Budget',
  'Notes',
  'Source',
];

var NOTIFY_EMAIL = 'hello@vaelro.co';
var TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    // 1. Honeypot. A filled website_url means a bot — silently succeed.
    if (data.website_url && String(data.website_url).trim() !== '') {
      return jsonOutput({ ok: true });
    }

    // 2. Verify the Cloudflare Turnstile token.
    if (!verifyTurnstile(data.token)) {
      return jsonOutput({ ok: false });
    }

    // 3. Append the row (create the header row first if the sheet is empty).
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    ensureHeaders(sheet);

    var timestamp = new Date();
    var row = [
      timestamp,
      value(data.name),
      value(data.business),
      value(data.email),
      value(data.phone),
      value(data.need),
      value(data.websiteSituation),
      value(data.busywork),
      value(data.headache),
      value(data.urgency),
      value(data.budget),
      value(data.notes),
      value(data.source),
    ];
    sheet.appendRow(row);

    // 4. Notify.
    sendNotification(data, timestamp);

    return jsonOutput({ ok: true });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  }
}

/** Cloudflare Turnstile server-side verification. */
function verifyTurnstile(token) {
  if (!token) return false;
  var secret =
    PropertiesService.getScriptProperties().getProperty('TURNSTILE_SECRET');
  if (!secret) return false;

  var res = UrlFetchApp.fetch(TURNSTILE_VERIFY_URL, {
    method: 'post',
    payload: { secret: secret, response: token },
    muteHttpExceptions: true,
  });
  try {
    var body = JSON.parse(res.getContentText());
    return body.success === true;
  } catch (err) {
    return false;
  }
}

/** Write the header row if the sheet has no data yet. */
function ensureHeaders(sheet) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
}

/** Email hello@vaelro.co with a triage subject and a labeled Q&A body. */
function sendNotification(data, timestamp) {
  var business = value(data.business) || 'Unknown business';
  var subject =
    'New lead: ' +
    business +
    ' · ' +
    (value(data.need) || '—') +
    ' · ' +
    (value(data.urgency) || '—') +
    ' · ' +
    (value(data.budget) || '—');

  // Every question and answer, labeled, in order. The three middle
  // questions are branch-specific; only show the ones that were answered.
  var lines = [];
  lines.push('What brings you in?: ' + (value(data.need) || '—'));
  if (value(data.websiteSituation)) {
    lines.push("What's the website situation today?: " + value(data.websiteSituation));
  }
  if (value(data.busywork)) {
    lines.push('What eats the most time in a normal week?: ' + value(data.busywork));
  }
  if (value(data.headache)) {
    lines.push('What is the biggest headache right now?: ' + value(data.headache));
  }
  lines.push('How soon do you want this handled?: ' + (value(data.urgency) || '—'));
  lines.push('What kind of budget feels comfortable?: ' + (value(data.budget) || '—'));
  lines.push('');
  lines.push('Name: ' + (value(data.name) || '—'));
  lines.push('Business: ' + business);
  lines.push('Email: ' + (value(data.email) || '—'));
  lines.push('Phone: ' + (value(data.phone) || '—'));
  lines.push('');
  lines.push('Anything else we should know?:');
  lines.push(value(data.notes) || '(none)');
  lines.push('');
  lines.push('Submitted: ' + timestamp);
  lines.push('Source page: ' + (value(data.source) || '—'));

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subject,
    body: lines.join('\n'),
  });
}

/** Normalize any incoming field to a trimmed string. */
function value(v) {
  if (v === null || v === undefined) return '';
  return String(v).trim();
}

/** JSON response via ContentService. */
function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/*
 * DEPLOY
 * ------------------------------------------------------------------
 * 1. In the Google Sheet "Vaelro Website Leads", open Extensions →
 *    Apps Script. Paste this file's contents into Code.gs and Save.
 * 2. Project Settings → Script Properties → add a property:
 *      Key:   TURNSTILE_SECRET
 *      Value: <your Cloudflare Turnstile SECRET key>
 * 3. Deploy → New deployment → type "Web app".
 *      Execute as:      Me
 *      Who has access:  Anyone
 *    Deploy, authorize when prompted, and copy the Web app /exec URL.
 * 4. Send me that /exec URL and the Turnstile SITE key — I'll wire them
 *    into ContactFlow.tsx. (Local dev uses Cloudflare's public test keys
 *    so nothing is blocked meanwhile.)
 */
