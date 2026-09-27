import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getPublicContent } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";
import { allowRequest, hashCode, makeCode, requestIp, sha256, stableJson } from "@/lib/applications/security";
import { isApplicationType, validateApplication } from "@/lib/applications/validation";
import { getExternalApplicationDestination } from "@/lib/applications/availability";

const error = (status: number, code: string, message: string, details?: unknown) => NextResponse.json({ ok: false, error: { code, message, details } }, { status });

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isApplicationType(type)) return error(404, "APPLICATION_NOT_FOUND", "This application does not exist.");
  if (!process.env.DATABASE_URL || !process.env.RESEND_API_KEY || !process.env.APPLICATION_CODE_SECRET) return error(503, "SERVICE_NOT_CONFIGURED", "Applications are being prepared. Please try again later.");
  const ip = requestIp(request);
  if (!await allowRequest(`${ip}:${type}:challenge`)) return error(429, "RATE_LIMITED", "Too many attempts. Please wait before trying again.");
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return error(415, "INVALID_CONTENT_TYPE", "Send the application as JSON.");
  if (Number(request.headers.get("content-length") || 0) > 262_144) return error(413, "PAYLOAD_TOO_LARGE", "The application is too large.");
  let body: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 262_144) return error(413, "PAYLOAD_TOO_LARGE", "The application is too large.");
    body = JSON.parse(raw);
  } catch { return error(400, "INVALID_JSON", "The application could not be read."); }
  const { settings } = await getPublicContent();
  if (settings.applicationsClosed) return error(410, "APPLICATIONS_CLOSED", "Applications are currently closed.");
  const application = settings.applications.find((item) => item.id === type);
  if (!application?.enabled) return error(404, "APPLICATION_CLOSED", "This application is currently closed.");
  if (getExternalApplicationDestination(settings, type)) return error(410, "EXTERNAL_APPLICATION", "This application uses an external form.");
  const result = validateApplication(type, body, settings);
  if (!result.ok) return error(422, "VALIDATION_FAILED", "Please review the highlighted fields.", result.errors);
  const existing = await prisma.submissionClaim.findUnique({ where: { email_applicationType: { email: result.email, applicationType: type } } });
  if (existing?.status === "COMPLETED") return error(409, "ALREADY_SUBMITTED", "An application for this role has already been submitted with this email.");

  const id = randomUUID();
  const code = makeCode();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 10 * 60_000);
  await prisma.verificationChallenge.upsert({
    where: { email_applicationType: { email: result.email, applicationType: type } },
    create: { id, email: result.email, applicationType: type, codeHash: hashCode(code, id), payloadHash: sha256(stableJson(result.payload)), ipHash: sha256(ip), expiresAt, lastSentAt: now },
    update: { id, codeHash: hashCode(code, id), payloadHash: sha256(stableJson(result.payload)), ipHash: sha256(ip), attempts: 0, expiresAt, lastSentAt: now },
  });
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const sent = await resend.emails.send({ from: process.env.RESEND_FROM || settings.conference.senderEmail, to: result.email, subject: `${code} is your ${settings.conference.brandName} verification code`, text: `Your verification code is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this message.` });
    if (sent.error) throw new Error("RESEND_FAILED");
  } catch {
    await prisma.verificationChallenge.delete({ where: { id } }).catch(() => undefined);
    return error(503, "EMAIL_UNAVAILABLE", "We could not send the verification email. Please try again.");
  }
  return NextResponse.json({ ok: true, challengeId: id, expiresInSeconds: 600 });
}
