export function csvCell(value: unknown) {
  let text = value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
  if (/^[=+\-@]/.test(text)) text = `'${text}`;
  return `"${text.replaceAll('"', '""')}"`;
}

export function submissionsToCsv(rows: Array<{ id: string; email: string; applicationType: string; payload: unknown; createdAt: Date }>) {
  const header = ["id", "applicationType", "email", "submittedAt", "payload"].map(csvCell).join(",");
  return [header, ...rows.map((row) => [row.id, row.applicationType, row.email, row.createdAt.toISOString(), row.payload].map(csvCell).join(","))].join("\r\n");
}
