import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { assertOrigin, isAdmin } from "@/lib/admin-auth";

const allowed = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in to upload files." } }, { status: 401 });
  try { await assertOrigin(); } catch { return NextResponse.json({ error: { code: "INVALID_ORIGIN", message: "This upload request is not allowed." } }, { status: 403 }); }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !bucket || !serviceRoleKey) return NextResponse.json({ error: { code: "SERVICE_UNCONFIGURED", message: "Image storage is not configured." } }, { status: 503 });
  if (Number(request.headers.get("content-length") || 0) > 10.5 * 1024 * 1024) return NextResponse.json({ error: { code: "PAYLOAD_TOO_LARGE", message: "The upload is too large." } }, { status: 413 });
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) return NextResponse.json({ error: { code: "INVALID_CONTENT_TYPE", message: "Upload an image form." } }, { status: 415 });
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || !allowed.has(file.type) || file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: { code: "INVALID_FILE", message: "Choose a JPG, PNG, WebP, or AVIF image smaller than 10 MB." } }, { status: 422 });
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-") || "upload";
  const path = `munair/admin/${randomUUID()}-${safeName}`;
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  try {
    const response = await fetch(`${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`, {
      method: "POST",
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, "Content-Type": file.type, "x-upsert": "false" },
      body: await file.arrayBuffer(),
    });
    if (!response.ok) return NextResponse.json({ error: { code: "STORAGE_FAILED", message: "The image could not be stored." } }, { status: 502 });
  } catch {
    return NextResponse.json({ error: { code: "STORAGE_FAILED", message: "The image could not be stored." } }, { status: 502 });
  }
  return NextResponse.json({ url: `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}` });
}
