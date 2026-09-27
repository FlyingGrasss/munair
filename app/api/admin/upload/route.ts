import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { assertOrigin, isAdmin } from "@/lib/admin-auth";

const uploadTypes = {
  image: {
    folder: "images",
    allowedMimeTypes: new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]),
    allowedExtensions: new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]),
    message: "Choose a JPG, PNG, WebP, AVIF, or GIF image smaller than 10 MB.",
  },
  "committee-document": {
    folder: "committee-guides",
    allowedMimeTypes: new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]),
    allowedExtensions: new Set([".pdf", ".doc", ".docx"]),
    message: "Choose a PDF, DOC, or DOCX guide smaller than 10 MB.",
  },
} as const;
type UploadKind = keyof typeof uploadTypes;

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data")) return NextResponse.json({ error: { code: "INVALID_CONTENT_TYPE", message: "Upload a file form." } }, { status: 415 });
  if (Number(request.headers.get("content-length") || 0) > 10.5 * 1024 * 1024) return NextResponse.json({ error: { code: "PAYLOAD_TOO_LARGE", message: "The upload is too large." } }, { status: 413 });
  if (!(await isAdmin())) return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "Sign in to upload files." } }, { status: 401 });
  try { await assertOrigin(); } catch { return NextResponse.json({ error: { code: "INVALID_ORIGIN", message: "This upload request is not allowed." } }, { status: 403 }); }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  const bucket = process.env.SUPABASE_STORAGE_BUCKET?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !bucket || !serviceRoleKey) return NextResponse.json({ error: { code: "SERVICE_UNCONFIGURED", message: "File storage is not configured." } }, { status: 503 });
  let form: FormData;
  try { form = await request.formData(); } catch { return NextResponse.json({ error: { code: "INVALID_FORM", message: "Upload a valid file form." } }, { status: 422 }); }
  const requestedKind = form.get("kind");
  const kind: UploadKind = requestedKind === "committee-document" ? "committee-document" : "image";
  if (requestedKind !== null && requestedKind !== "image" && requestedKind !== "committee-document") return NextResponse.json({ error: { code: "INVALID_FILE_KIND", message: "This file type is not supported." } }, { status: 422 });
  const uploadType = uploadTypes[kind];
  const file = form.get("file");
  const extension = file instanceof File ? file.name.slice(file.name.lastIndexOf(".")).toLowerCase() : "";
  if (!(file instanceof File) || !uploadType.allowedMimeTypes.has(file.type) || !uploadType.allowedExtensions.has(extension) || file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: { code: "INVALID_FILE", message: uploadType.message } }, { status: 422 });
  }
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-") || "upload";
  const path = `munair/admin/${uploadType.folder}/${randomUUID()}-${safeName}`;
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  try {
    const response = await fetch(`${supabaseUrl}/storage/v1/object/${encodeURIComponent(bucket)}/${encodedPath}`, {
      method: "POST",
      headers: { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, "Content-Type": file.type, "x-upsert": "false" },
      body: await file.arrayBuffer(),
    });
    if (!response.ok) return NextResponse.json({ error: { code: "STORAGE_FAILED", message: "The file could not be stored." } }, { status: 502 });
  } catch {
    return NextResponse.json({ error: { code: "STORAGE_FAILED", message: "The file could not be stored." } }, { status: 502 });
  }
  return NextResponse.json({ url: `${supabaseUrl}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`, kind, name: file.name });
}
