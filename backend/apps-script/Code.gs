/**
 * Vaelro Website Leads — Apps Script Web App
 * ------------------------------------------------------------------
 * Versioned source of truth for the backend behind the site's contact
 * flow (src/components/sections/ContactFlow.tsx). Paste this into the
 * Apps Script editor bound to the Google Sheet named
 * "Vaelro Website Leads", then deploy as a Web App (see DEPLOY notes
 * at the bottom).
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
 *     website_url        // honeypot — must be empty for a real human
 *   }
 *
 * The Session 1 feedback form on /workshop/session-1 posts to the same
 * URL with form: "session1-feedback". That goes to handleFeedback()
 * below: its own "Session 1 Feedback" tab and its own email, and never
 * the lead sheet or Spike_Data. Shape:
 *
 *   {
 *     form: "session1-feedback",
 *     rating,            // 1 to 5, "Was this worth your morning?"
 *     octoberWish,       // "What would make October 9 worth coming back for?"
 *     referral,          // "Know anyone else who should be at these?"
 *     name, business, email,
 *     wantsTools,        // true when "Send me the free tools" is checked
 *     source, website_url
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

var FEEDBACK_FORM = 'session1-feedback';
var FEEDBACK_SHEET = 'Session 1 Feedback';
var FEEDBACK_HEADERS = [
  'Timestamp',
  'Worth the morning (1 to 5)',
  'What would make October 9 worth it',
  'Who else should be here',
  'Name',
  'Business',
  'Email',
  'Send the free tools',
  'Source',
];

/** Prevent formula injection — prefix = + - @ with an apostrophe. */
function safe(v) {
  var s = String(v || "");
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    // Session 1 feedback has its own tab and email. It returns here, so it
    // never reaches the lead sheet, the lead email, or Spike_Data.
    if (data.form === FEEDBACK_FORM) {
      return handleFeedback(data);
    }

    // 1. Honeypot. A filled website_url means a bot — silently succeed.
    if (data.website_url && String(data.website_url).trim() !== '') {
      return jsonOutput({ ok: true });
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

    // ── Write to Spike_Data → Inbound tab ──
    try {
      var spike = SpreadsheetApp.openById(
        "1vqsGdNZsjBtjBCrV1_Rmw2NeZNJ1fbC_F5fsDcV_BYU"
      );
      var inbound = spike.getSheetByName("Inbound");
      if (!inbound) {
        inbound = spike.insertSheet("Inbound");
        inbound.getRange("A:O").setNumberFormat("@");
        inbound.appendRow([
          "id","timestamp","name","business","email","phone",
          "need","website_situation","busywork","headache",
          "urgency","budget","notes","source","status"
        ]);
      }
      var sid = Math.random().toString(16).slice(2, 10);
      if (!/[a-f]/.test(sid)) sid = "a" + sid.slice(1);
      inbound.appendRow([
        sid,
        timestamp.toISOString(),
        safe(data.name),
        safe(data.business),
        safe(data.email),
        safe(data.phone),
        safe(data.need),
        safe(data.websiteSituation),
        safe(data.busywork),
        safe(data.headache),
        safe(data.urgency),
        safe(data.budget),
        safe(data.notes),
        safe(data.source),
        "New"
      ]);
    } catch (spikeErr) {
      Logger.log("Spike inbound write failed: " + spikeErr);
    }

    return jsonOutput({ ok: true });
  } catch (err) {
    return jsonOutput({ ok: false, error: String(err) });
  }
}

/**
 * One Session 1 feedback response: a row in the "Session 1 Feedback" tab
 * (created on first use, in this same spreadsheet) and an email to
 * hello@vaelro.co. Every reply names the form, which is how you can tell
 * from outside that this version is the one deployed: POST a feedback
 * payload with website_url filled in and this answers
 * {"ok":true,"form":"session1-feedback"} without writing anything, where
 * an older deployment answers {"ok":true} and nothing more.
 */
function handleFeedback(data) {
  if (data.website_url && String(data.website_url).trim() !== '') {
    return jsonOutput({ ok: true, form: FEEDBACK_FORM });
  }

  var rating = Number(data.rating);
  if (!(rating >= 1 && rating <= 5)) {
    return jsonOutput({ ok: false, form: FEEDBACK_FORM, error: 'rating must be 1 to 5' });
  }

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet =
    spreadsheet.getSheetByName(FEEDBACK_SHEET) || spreadsheet.insertSheet(FEEDBACK_SHEET);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(FEEDBACK_HEADERS);
    sheet.getRange(1, 1, 1, FEEDBACK_HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  var timestamp = new Date();
  var wantsTools = data.wantsTools === true;
  sheet.appendRow([
    timestamp,
    rating,
    safe(value(data.octoberWish)),
    safe(value(data.referral)),
    safe(value(data.name)),
    safe(value(data.business)),
    safe(value(data.email)),
    wantsTools ? 'Yes' : 'No',
    safe(value(data.source)),
  ]);

  var who = value(data.business) || value(data.name) || 'No name given';
  var lines = [
    'Was this worth your morning? ' + rating + ' out of 5',
    '',
    'What would make October 9 worth coming back for?',
    value(data.octoberWish) || '(no answer)',
    '',
    'Know anyone else who should be at these?',
    value(data.referral) || '(no answer)',
    '',
    'Name: ' + (value(data.name) || '(none)'),
    'Business: ' + (value(data.business) || '(none)'),
    'Email: ' + (value(data.email) || '(none)'),
    'Send the free tools: ' + (wantsTools ? 'Yes' : 'No'),
    '',
    'Submitted: ' + timestamp,
    'Source page: ' + (value(data.source) || '(none)'),
  ];
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject:
      'Session 1 feedback: ' + rating + '/5 · ' + who +
      (wantsTools ? ' · wants the free tools' : ''),
    body: lines.join('\n'),
  });

  return jsonOutput({ ok: true, form: FEEDBACK_FORM });
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
 * 2. Deploy → New deployment → type "Web app".
 *      Execute as:      Me
 *      Who has access:  Anyone
 *    Deploy, authorize when prompted, and copy the Web app /exec URL.
 * 3. Send me that /exec URL — I'll wire it into ContactFlow.tsx.
 *
 * UPDATING (every change after the first deploy)
 * ------------------------------------------------------------------
 * Paste this file over Code.gs and Save, then Deploy → Manage
 * deployments → the pencil (Edit) → Version: New version → Deploy.
 * Never "New deployment" for an update: that mints a new /exec URL,
 * and the site keeps posting to the old one. The URL lives in
 * src/lib/appsScript.ts.
 */
