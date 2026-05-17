import { google } from "googleapis";
import { env } from "../config/env.js";

const getSheetsClient = () => {
  const privateKey = env.googlePrivateKey.replace(/\\n/g, "\n");
  const auth = new google.auth.JWT({
    email: env.googleServiceAccountEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  return google.sheets({ version: "v4", auth });
};

export const appendAnalyticsRow = async (event) => {
  if (!env.googleSheetId || !env.googleServiceAccountEmail || !env.googlePrivateKey) {
    return { skipped: true };
  }

  const sheets = getSheetsClient();
  const values = [
    [
      new Date().toISOString(),
      event.eventType,
      event.userEmail || "",
      event.userId || "",
      event.destination || "",
      event.metadata?.duration || "",
      event.metadata?.people || "",
      JSON.stringify(event.metadata || {}).slice(0, 3000)
    ]
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: env.googleSheetId,
    range: env.googleSheetRange,
    valueInputOption: "USER_ENTERED",
    requestBody: { values }
  });

  return { skipped: false };
};
