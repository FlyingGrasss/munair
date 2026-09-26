"use client";

import { useState } from "react";

export default function ImageUpload({ name = "imageUrl", defaultValue = "" }: { name?: string; defaultValue?: string }) {
  const [url, setUrl] = useState(defaultValue); const [message, setMessage] = useState(""); const [busy, setBusy] = useState(false);
  return <div className="grid gap-2"><input type="hidden" name={name} value={url} /><label className="text-sm font-bold">Image <input className="mt-1 block w-full text-sm" type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={async (event) => { const file = event.target.files?.[0]; if (!file) return; setBusy(true); setMessage("Uploading…"); const form = new FormData(); form.set("file", file); try { const response = await fetch("/api/admin/upload", { method: "POST", body: form }); const result = await response.json(); if (!response.ok) throw new Error(result.error?.message); setUrl(result.url); setMessage("Image uploaded."); } catch (error) { setMessage(error instanceof Error ? error.message : "Upload failed."); } finally { setBusy(false); } }} /></label>{url && <p className="break-all text-xs text-[var(--muted)]">{url}</p>}{message && <p role="status" className="text-xs font-semibold">{message}</p>}</div>;
}
