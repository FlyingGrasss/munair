import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminMutation } from "@/lib/admin-auth";
import { allowRequest } from "@/lib/applications/security";
import { prisma } from "@/lib/prisma";
import { sendAdminEmail } from "@/lib/admin-email";

const schema = z.object({
  idempotencyKey: z.string().regex(/^[a-zA-Z0-9_-]{16,96}$/),
  recipientEmail: z.string().email().max(320),
  subject: z.string().trim().min(1).max(180),
  body: z.string().trim().min(1).max(20_000),
  applicationSubmissionId: z.string().cuid().optional(),
});

export async function POST(request: Request) {
  await requireAdminMutation();
  if (request.headers.get("content-type")?.toLowerCase().startsWith("application/json") !== true) {
    return NextResponse.json({ error: { code: "INVALID_CONTENT_TYPE", message: "Send the email as JSON." } }, { status: 415 });
  }
  if (Number(request.headers.get("content-length") || 0) > 24_576) {
    return NextResponse.json({ error: { code: "PAYLOAD_TOO_LARGE", message: "The email is too large." } }, { status: 413 });
  }
  if (!(await allowRequest("admin:send-email"))) {
    return NextResponse.json({ error: { code: "RATE_LIMITED", message: "Too many emails were sent. Try again later." } }, { status: 429, headers: { "retry-after": "600" } });
  }

  let parsed: z.infer<typeof schema>;
  try {
    parsed = schema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: { code: "INVALID_EMAIL", message: "Check the recipient, subject, and message." } }, { status: 422 });
  }

  if (parsed.applicationSubmissionId) {
    const submission = await prisma.applicationSubmission.findUnique({ where: { id: parsed.applicationSubmissionId }, select: { email: true } });
    if (!submission || submission.email.trim().toLowerCase() !== parsed.recipientEmail.trim().toLowerCase()) {
      return NextResponse.json({ error: { code: "SUBMISSION_MISMATCH", message: "The selected application does not match this recipient." } }, { status: 422 });
    }
  }

  const result = await sendAdminEmail({ ...parsed, recipientEmail: parsed.recipientEmail.trim().toLowerCase() });
  if (result.status === "PROCESSING") {
    return NextResponse.json({ error: { code: "EMAIL_PROCESSING", message: "This email is already being sent." } }, { status: 409 });
  }
  if (result.status === "CONFLICT") {
    return NextResponse.json({ error: { code: "IDEMPOTENCY_CONFLICT", message: "This send request was already used for different email content." } }, { status: 409 });
  }
  if (result.status === "FAILED") {
    return NextResponse.json({ error: { code: result.code, message: "The email could not be sent." } }, { status: 502 });
  }
  return NextResponse.json({ ok: true, sheetSyncStatus: result.sheetSyncStatus, sheetMatches: result.sheetMatches });
}
