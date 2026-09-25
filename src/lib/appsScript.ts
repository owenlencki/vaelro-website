/**
 * The Google Apps Script web app behind every form on the site: the Contact
 * page's lead flow and the Session 1 feedback form. Its source of truth is
 * backend/apps-script/Code.gs, which is deployed by hand; an update is a new
 * version of the same deployment, so this URL does not change.
 */
export const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxM3e_0MyXn4R88l5CsrGjoYNcDReD0Q2wFSjbp3OVcANuTnC7WJi98bp-YdkFFGZOWlg/exec";

/**
 * POST a payload and report whether the script accepted it. The body is JSON
 * sent as plain text with no JSON content-type header, which keeps the
 * request "simple" and avoids a CORS preflight the script cannot answer.
 * Network failures and rejections both come back as false.
 */
export async function postToAppsScript(
  payload: Record<string, unknown>,
): Promise<boolean> {
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      redirect: "follow",
    });
    const data = (await res.json()) as { ok?: boolean };
    return data.ok === true;
  } catch {
    return false;
  }
}
