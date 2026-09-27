import { NextResponse } from "next/server";
import { allowRequest, equalHash, hashCode, requestIp, sha256, stableJson } from "@/lib/applications/security";
import { isApplicationType, validateApplication } from "@/lib/applications/validation";
import { prisma } from "@/lib/prisma";
import { getPublicContent } from "@/lib/site-settings";
import type { Prisma } from "@/lib/generated/prisma/client";

const error = (status: number, code: string, message: string, details?: unknown) => NextResponse.json({ ok: false, error: { code, message, details } }, { status });

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (!isApplicationType(type)) return error(404, "APPLICATION_NOT_FOUND", "This application does not exist.");
  if (!process.env.DATABASE_URL || !process.env.APPLICATION_CODE_SECRET) return error(503, "SERVICE_NOT_CONFIGURED", "Applications are being prepared. Please try again later.");
  const ip = requestIp(request);
  if (!await allowRequest(`${ip}:${type}:verify`)) return error(429, "RATE_LIMITED", "Too many attempts. Please wait before trying again.");
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return error(415, "INVALID_CONTENT_TYPE", "Send the verification as JSON.");
  if (Number(request.headers.get("content-length") || 0) > 262_144) return error(413, "PAYLOAD_TOO_LARGE", "The verification request is too large.");
  let body: { challengeId?: unknown; code?: unknown; payload?: unknown };
  try {
    const raw = await request.text();
    if (raw.length > 262_144) return error(413, "PAYLOAD_TOO_LARGE", "The verification request is too large.");
    body = JSON.parse(raw);
  } catch { return error(400, "INVALID_JSON", "The verification request could not be read."); }
  if (typeof body.challengeId !== "string" || typeof body.code !== "string" || !/^\d{6}$/.test(body.code)) return error(422, "INVALID_CODE", "Enter the six-digit code from your email.");
  const { settings } = await getPublicContent();
  if (settings.applicationsClosed) return error(410, "APPLICATIONS_CLOSED", "Applications are currently closed.");
  const result = validateApplication(type, body.payload, settings);
  if (!result.ok) return error(422, "VALIDATION_FAILED", "Please review your application.", result.errors);
  const challenge = await prisma.verificationChallenge.findUnique({ where: { id: body.challengeId } });
  if (!challenge || challenge.email !== result.email || challenge.applicationType !== type) return error(400, "CHALLENGE_INVALID", "This verification request is no longer valid.");
  if (challenge.expiresAt <= new Date()) return error(410, "CODE_EXPIRED", "This code has expired. Request a new one.");
  if (challenge.attempts >= 5) return error(429, "CODE_LOCKED", "Too many incorrect codes. Request a new one.");
  if (!equalHash(challenge.payloadHash, sha256(stableJson(result.payload)))) return error(409, "APPLICATION_CHANGED", "Your application changed after the code was sent. Request a new code.");
  if (!equalHash(challenge.codeHash, hashCode(body.code, challenge.id))) {
    await prisma.verificationChallenge.update({ where: { id: challenge.id }, data: { attempts: { increment: 1 } } });
    return error(422, "INVALID_CODE", "That code is not correct.");
  }

  const previous = await prisma.submissionClaim.findUnique({ where: { email_applicationType: { email: result.email, applicationType: type } } });
  if (previous?.status === "COMPLETED") return NextResponse.json({ ok: true, alreadySubmitted: true });
  const claim = await prisma.submissionClaim.upsert({ where: { email_applicationType: { email: result.email, applicationType: type } }, create: { email: result.email, applicationType: type, status: "PROCESSING" }, update: { status: "PROCESSING", attempts: { increment: 1 }, lastErrorCode: null } });
  try {
    await prisma.$transaction([
      prisma.applicationSubmission.upsert({
        where: { claimId: claim.id },
        create: { email: result.email, applicationType: type, payload: result.payload as unknown as Prisma.InputJsonValue, claimId: claim.id },
        update: { payload: result.payload as unknown as Prisma.InputJsonValue },
      }),
      prisma.submissionClaim.update({
        where: { email_applicationType: { email: result.email, applicationType: type } },
        data: { status: "COMPLETED", completedAt: new Date() },
      }),
      prisma.verificationChallenge.deleteMany({ where: { id: challenge.id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch {
    const code = "DELIVERY_FAILED";
    await prisma.submissionClaim.update({ where: { email_applicationType: { email: result.email, applicationType: type } }, data: { status: "FAILED", lastErrorCode: code } }).catch(() => undefined);
    return error(503, code, "Your application was verified but could not be delivered. Please try submitting again.");
  }
}
