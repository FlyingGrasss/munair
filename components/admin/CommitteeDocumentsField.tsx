"use client";

import { FileUp, Plus, X } from "lucide-react";
import { useState } from "react";
import { parseDocuments, type ContentDocument } from "@/lib/documents";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function titleFromFileName(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim() || "Study guide";
}

export default function CommitteeDocumentsField({
  name = "documents",
  id = name,
  defaultValue = "",
}: {
  name?: string;
  id?: string;
  defaultValue?: string;
}) {
  const [documents, setDocuments] = useState<ContentDocument[]>(() => parseDocuments(defaultValue));
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [status, setStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const serialized = documents
    .filter((document) => document.title.trim() && document.url.trim())
    .map((document) => `${document.title.trim()} | ${document.url.trim()}`)
    .join("\n");

  const uploadGuide = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > MAX_FILE_SIZE) {
      setStatus("Guides must be 10 MB or smaller.");
      return;
    }

    setIsUploading(true);
    setStatus("Uploading guide...");
    try {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("kind", "committee-document");
      const response = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Guide upload failed.");

      setDocuments((current) => [...current, { title: titleFromFileName(file.name), url: result.url }]);
      setStatus("Guide uploaded. Save the committee to publish it.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Guide upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const addLink = () => {
    if (!linkTitle.trim() || !linkUrl.trim()) {
      setStatus("Add both a guide title and a URL.");
      return;
    }
    setDocuments((current) => [...current, { title: linkTitle.trim(), url: linkUrl.trim() }]);
    setLinkTitle("");
    setLinkUrl("");
    setStatus("");
  };

  return (
    <div className="flex flex-col gap-3 text-sm text-white">
      <span className="font-semibold">Committee guides</span>
      <input type="hidden" name={name} value={serialized} />
      <div className="rounded-lg border border-white/10 bg-black/15 p-3">
        <label htmlFor={`${id}-file`} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold hover:border-[var(--color-accent)] has-[:disabled]:cursor-wait has-[:disabled]:opacity-50">
          <input
            id={`${id}-file`}
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(event) => {
              void uploadGuide(event.target.files?.[0]);
              event.currentTarget.value = "";
            }}
            disabled={isUploading}
            aria-describedby={`${id}-file-help`}
            className="sr-only"
          />
          <FileUp className="size-4" aria-hidden="true" />
          {isUploading ? "Uploading..." : "Upload PDF or Word guide"}
        </label>
        <p id={`${id}-file-help`} className="mt-2 text-xs text-white/50">PDF, DOC, or DOCX up to 10 MB. Uploading does not publish it until you save the committee.</p>
      </div>

      <div className="grid gap-2 rounded-lg border border-white/10 bg-black/15 p-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end">
        <label className="flex flex-col gap-1 text-xs text-white/65" htmlFor={`${id}-link-title`}>
          Guide title
          <input id={`${id}-link-title`} value={linkTitle} onChange={(event) => setLinkTitle(event.target.value)} placeholder="DISEC Study Guide" className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[var(--color-accent)]" />
        </label>
        <label className="flex flex-col gap-1 text-xs text-white/65" htmlFor={`${id}-link-url`}>
          Existing guide URL
          <input id={`${id}-link-url`} type="url" value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="https://..." className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[var(--color-accent)]" />
        </label>
        <button type="button" onClick={addLink} className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-3 py-2 text-xs font-semibold hover:border-[var(--color-accent)]">
          <Plus className="size-4" aria-hidden="true" /> Add link
        </button>
      </div>

      {documents.length > 0 && (
        <ul className="flex flex-col gap-2" aria-label="Committee guides">
          {documents.map((document, index) => (
            <li key={`${document.url}-${index}`} className="grid gap-2 rounded-lg border border-white/10 bg-black/15 p-3 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center">
              <label className="sr-only" htmlFor={`${id}-${index}-title`}>Guide {index + 1} title</label>
              <input id={`${id}-${index}-title`} value={document.title} onChange={(event) => setDocuments((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-[var(--color-accent)]" />
              <label className="sr-only" htmlFor={`${id}-${index}-url`}>Guide {index + 1} URL</label>
              <input id={`${id}-${index}-url`} type="url" value={document.url} onChange={(event) => setDocuments((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, url: event.target.value } : item))} className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/70 outline-none focus:border-[var(--color-accent)]" />
              <button type="button" onClick={() => setDocuments((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="inline-flex items-center justify-center rounded-md border border-red-400/40 p-2 text-red-100 hover:bg-red-500/15" aria-label={`Remove ${document.title || `guide ${index + 1}`}`}>
                <X className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {status && <p role="status" className="text-xs font-semibold text-white/70">{status}</p>}
    </div>
  );
}
