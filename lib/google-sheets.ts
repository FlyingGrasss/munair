import "server-only";

import { createSign } from "node:crypto";

type SheetInfo = {
  properties: {
    sheetId: number;
    title: string;
    gridProperties?: { columnCount?: number };
  };
};

type SheetMatch = {
  sheetId: number;
  sheetTitle: string;
  rowNumber: number;
  columnCount: number;
};

type SyncResult = {
  status: "SYNCED" | "NOT_FOUND" | "UNCONFIGURED";
  matches: Array<Omit<SheetMatch, "columnCount">>;
};

class SheetsError extends Error {
  constructor() {
    super("GOOGLE_SHEETS_REQUEST_FAILED");
  }
}

const globalForSheets = globalThis as unknown as {
  sheetsAccessToken?: { value: string; expiresAt: number };
};

function config() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim();
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL?.trim();
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n").trim();
  if (!spreadsheetId || !clientEmail || !privateKey) return null;
  return { spreadsheetId, clientEmail, privateKey };
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

async function accessToken() {
  const configured = config();
  if (!configured) throw new SheetsError();

  const cached = globalForSheets.sheetsAccessToken;
  if (cached && cached.expiresAt > Date.now() + 60_000) return cached.value;

  const header = encode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = encode(JSON.stringify({
    iss: configured.clientEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3_600,
  }));
  const unsigned = `${header}.${payload}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(configured.privateKey).toString("base64url");

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${signature}`,
    }),
    cache: "no-store",
  });
  if (!response.ok) throw new SheetsError();
  const result = await response.json() as { access_token?: string; expires_in?: number };
  if (!result.access_token) throw new SheetsError();

  globalForSheets.sheetsAccessToken = {
    value: result.access_token,
    expiresAt: Date.now() + Math.max(60, result.expires_in || 3_600) * 1_000,
  };
  return result.access_token;
}

async function sheetsRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const configured = config();
  if (!configured) throw new SheetsError();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${configured.spreadsheetId}${path}`, {
    ...init,
    headers: { ...(init?.headers || {}), authorization: `Bearer ${await accessToken()}` },
    cache: "no-store",
  });
  if (!response.ok) throw new SheetsError();
  return response.json() as Promise<T>;
}

function normalizeEmail(value: unknown) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function sheetRange(title: string) {
  return encodeURIComponent(`'${title.replaceAll("'", "''")}'!A:ZZ`);
}

export async function colorApplicationRows(email: string): Promise<SyncResult> {
  if (!config()) return { status: "UNCONFIGURED", matches: [] };
  const target = normalizeEmail(email);
  if (!target) return { status: "NOT_FOUND", matches: [] };

  const metadata = await sheetsRequest<{ sheets?: SheetInfo[] }>("?fields=sheets(properties(sheetId,title,gridProperties(rowCount,columnCount)))");
  const sheets = metadata.sheets || [];
  const matches: SheetMatch[] = [];

  for (const sheet of sheets) {
    const values = await sheetsRequest<{ values?: unknown[][] }>(`/values/${sheetRange(sheet.properties.title)}?majorDimension=ROWS`);
    const rows = values.values || [];
    const columnCount = Math.max(1, Math.min(18278, sheet.properties.gridProperties?.columnCount || Math.max(1, ...rows.map((row) => row.length))));
    rows.forEach((row, index) => {
      if (row.some((cell) => normalizeEmail(cell) === target)) {
        matches.push({ sheetId: sheet.properties.sheetId, sheetTitle: sheet.properties.title, rowNumber: index + 1, columnCount });
      }
    });
  }

  if (!matches.length) return { status: "NOT_FOUND", matches: [] };

  await sheetsRequest(":batchUpdate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      requests: matches.map((match) => ({
        repeatCell: {
          range: {
            sheetId: match.sheetId,
            startRowIndex: match.rowNumber - 1,
            endRowIndex: match.rowNumber,
            startColumnIndex: 0,
            endColumnIndex: match.columnCount,
          },
          cell: { userEnteredFormat: { backgroundColor: { red: 0.82, green: 0.93, blue: 0.86 } } },
          fields: "userEnteredFormat.backgroundColor",
        },
      })),
    }),
  });

  return {
    status: "SYNCED",
    matches: matches.map((match) => ({ sheetId: match.sheetId, sheetTitle: match.sheetTitle, rowNumber: match.rowNumber })),
  };
}

export function isSheetsConfigured() {
  return Boolean(config());
}
