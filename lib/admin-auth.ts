import "server-only";

import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const COOKIE = "munair_admin";
const TTL_SECONDS = 365 * 24 * 60 * 60;
const scryptAsync = promisify(scrypt);
const tokenHash = (value: string) => createHash("sha256").update(value).digest("hex");

async function currentToken() {
  return (await cookies()).get(COOKIE)?.value || "";
}

export async function isAdmin() {
  const token = await currentToken();
  if (!token || !process.env.DATABASE_URL) return false;
  const session = await prisma.adminSession.findUnique({ where: { tokenHash: tokenHash(token) } });
  if (!session || session.revokedAt || session.expiresAt <= new Date() || session.version !== (process.env.ADMIN_SESSION_VERSION || "1")) return false;
  if (Date.now() - session.lastSeenAt.getTime() > 24 * 60 * 60_000) {
    await prisma.adminSession.update({ where: { id: session.id }, data: { lastSeenAt: new Date() } }).catch(() => undefined);
  }
  return true;
}

export async function createAdminSession() {
  if (!process.env.DATABASE_URL) throw new Error("ADMIN_DATABASE_NOT_CONFIGURED");
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + TTL_SECONDS * 1000);
  await prisma.adminSession.create({ data: { tokenHash: tokenHash(token), version: process.env.ADMIN_SESSION_VERSION || "1", expiresAt } });
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TTL_SECONDS,
    priority: "high",
  });
}

export async function clearAdminSession() {
  const token = await currentToken();
  if (token && process.env.DATABASE_URL) {
    await prisma.adminSession.updateMany({ where: { tokenHash: tokenHash(token), revokedAt: null }, data: { revokedAt: new Date() } }).catch(() => undefined);
  }
  (await cookies()).delete(COOKIE);
}

export async function revokeAllAdminSessions() {
  await prisma.adminSession.updateMany({ where: { revokedAt: null }, data: { revokedAt: new Date() } });
  (await cookies()).delete(COOKIE);
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function assertOrigin() {
  const incoming = await headers();
  const origin = incoming.get("origin");
  if (!origin) {
    if (process.env.NODE_ENV === "production") throw new Error("INVALID_ORIGIN");
    return;
  }
  const configured = process.env.ADMIN_ORIGIN || process.env.NEXT_PUBLIC_SITE_URL;
  if (!configured || new URL(origin).origin !== new URL(configured).origin) throw new Error("INVALID_ORIGIN");
}

export async function requireAdminMutation() {
  await assertOrigin();
  await requireAdmin();
}

export async function verifyAdminPassword(password: string) {
  const configured = process.env.ADMIN_PASSWORD_HASH || "";
  const [salt, expectedHex] = configured.split(":");
  if (!salt || !expectedHex || password.length < 12 || password.length > 256) return false;
  const actual = await scryptAsync(password, salt, 64) as Buffer;
  const expected = Buffer.from(expectedHex, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
