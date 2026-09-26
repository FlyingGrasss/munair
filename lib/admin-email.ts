import "server-only";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { colorApplicationRows } from "@/lib/google-sheets";

export type AdminEmailInput = {
  idempotencyKey: string;
  recipientEmail: string;
  subject: string;
  body: string;
  applicationSubmissionId?: string;
};

export async function sendAdminEmail(input: AdminEmailInput) {
  const existing = await prisma.adminEmail.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
  if (existing && (existing.recipientEmail !== input.recipientEmail || existing.subject !== input.subject || existing.body !== input.body || existing.applicationSubmissionId !== (input.applicationSubmissionId || null))) {
    return { status: "CONFLICT" as const };
  }
  if (existing?.status === "SENT") {
    return { status: "SENT" as const, sheetSyncStatus: existing.sheetSyncStatus, sheetMatches: existing.sheetMatches };
  }
  if (existing?.status === "PROCESSING") {
    return { status: "PROCESSING" as const, sheetSyncStatus: existing.sheetSyncStatus, sheetMatches: existing.sheetMatches };
  }

  const email = existing || await prisma.adminEmail.create({
    data: {
      idempotencyKey: input.idempotencyKey,
      recipientEmail: input.recipientEmail,
      subject: input.subject,
      body: input.body,
      applicationSubmissionId: input.applicationSubmissionId,
    },
  });

  if (existing?.status === "FAILED") {
    await prisma.adminEmail.update({ where: { id: email.id }, data: { status: "PROCESSING", lastErrorCode: null, sheetSyncStatus: "PENDING" } });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    await prisma.adminEmail.update({ where: { id: email.id }, data: { status: "FAILED", lastErrorCode: "EMAIL_NOT_CONFIGURED" } });
    return { status: "FAILED" as const, code: "EMAIL_NOT_CONFIGURED" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const sent = await resend.emails.send(
    { from: process.env.RESEND_FROM, to: email.recipientEmail, subject: email.subject, text: email.body },
    { idempotencyKey: email.idempotencyKey },
  );

  if (sent.error || !sent.data?.id) {
    await prisma.adminEmail.update({ where: { id: email.id }, data: { status: "FAILED", lastErrorCode: "EMAIL_PROVIDER_FAILED" } });
    return { status: "FAILED" as const, code: "EMAIL_PROVIDER_FAILED" };
  }

  await prisma.adminEmail.update({
    where: { id: email.id },
    data: { status: "SENT", providerMessageId: sent.data.id, sentAt: new Date(), lastErrorCode: null },
  });

  try {
    const sheetResult = await colorApplicationRows(email.recipientEmail);
    await prisma.adminEmail.update({
      where: { id: email.id },
      data: { sheetSyncStatus: sheetResult.status, sheetMatches: sheetResult.matches },
    });
    return { status: "SENT" as const, sheetSyncStatus: sheetResult.status, sheetMatches: sheetResult.matches };
  } catch {
    await prisma.adminEmail.update({ where: { id: email.id }, data: { sheetSyncStatus: "FAILED", lastErrorCode: "SHEETS_SYNC_FAILED" } });
    return { status: "SENT" as const, sheetSyncStatus: "FAILED" as const, sheetMatches: [] };
  }
}
