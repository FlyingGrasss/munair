"use client";

import { useState } from "react";

type ApplicationRow = {
  id: string;
  email: string;
  applicationType: string;
  payload: unknown;
  createdAt: string;
};

type SendState =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string };

function applicantName(payload: unknown) {
  if (!payload || typeof payload !== "object") return "Applicant";
  const value = payload as { answers?: Record<string, unknown>; summary?: Record<string, unknown> };
  const answers = value.answers || value.summary || {};
  const name = answers.fullName || answers.delegateFullName || answers.schoolName || answers.school;
  return typeof name === "string" && name.trim() ? name.trim() : "Applicant";
}

function sheetMessage(status: string) {
  if (status === "SYNCED") return "Sent. Matching row(s) in Sheets were highlighted.";
  if (status === "NOT_FOUND") return "Sent. No matching email was found in the Sheets tabs.";
  if (status === "UNCONFIGURED") return "Sent. Sheets highlighting is waiting for its connection details.";
  return "Sent, but the Sheets row could not be highlighted.";
}

function EmailComposer({ application }: { application: ApplicationRow }) {
  const name = applicantName(application.payload);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(`Hello ${name},\n\n\nBest,\nMUNAIR Team`);
  const [state, setState] = useState<SendState>({ kind: "idle" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ kind: "sending" });
    try {
      const response = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          idempotencyKey: crypto.randomUUID().replaceAll("-", ""),
          recipientEmail: application.email,
          subject,
          body,
          applicationSubmissionId: application.id,
        }),
      });
      const result = await response.json() as { ok?: boolean; sheetSyncStatus?: string; error?: { message?: string } };
      if (!response.ok) {
        setState({ kind: "error", message: result.error?.message || "The email could not be sent." });
        return;
      }
      setState({ kind: "success", message: sheetMessage(result.sheetSyncStatus || "FAILED") });
      setSubject("");
      setBody(`Hello ${name},\n\n\nBest,\nMUNAIR Team`);
    } catch {
      setState({ kind: "error", message: "The email service could not be reached." });
    }
  }

  return <details className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4">
    <summary className="cursor-pointer text-sm font-bold text-[var(--color-accent)]">Send an email</summary>
    <form onSubmit={submit} className="mt-4 grid gap-3">
      <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/60">To<input value={application.email} readOnly className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm normal-case tracking-normal text-white" /></label>
      <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/60">Subject<input value={subject} onChange={(event) => setSubject(event.target.value)} required maxLength={180} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm normal-case tracking-normal text-white" /></label>
      <label className="grid gap-1 text-xs font-bold uppercase tracking-[0.12em] text-white/60">Message<textarea value={body} onChange={(event) => setBody(event.target.value)} required maxLength={20_000} rows={7} className="rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-sm normal-case tracking-normal text-white" /></label>
      <button type="submit" disabled={state.kind === "sending"} className="w-fit rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-bold text-white transition hover:bg-white hover:text-black disabled:opacity-55">{state.kind === "sending" ? "Sending…" : "Send email"}</button>
      {state.kind === "success" && <p role="status" className="text-sm font-semibold text-green-300">{state.message}</p>}
      {state.kind === "error" && <p role="alert" className="text-sm font-semibold text-red-200">{state.message}</p>}
    </form>
  </details>;
}

export default function AdminApplicationInbox({ applications }: { applications: ApplicationRow[] }) {
  return <section className="rounded-xl border border-white/10 bg-black/25 p-6">
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold">Applications</h2>
        <p className="mt-2 text-sm text-white/60">Send a custom email to an applicant. After a successful send, every matching email row in the connected Sheets tabs is highlighted.</p>
      </div>
      <span className="text-sm font-bold text-[var(--color-accent)]">{applications.length} recent</span>
    </div>
    <div className="mt-6 grid gap-3">
      {applications.map((application) => <article key={application.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-bold">{applicantName(application.payload)}</p>
            <p className="mt-1 text-sm text-white/65">{application.email}</p>
          </div>
          <div className="text-right text-xs font-bold uppercase tracking-[0.12em] text-white/45">
            <p>{application.applicationType}</p>
            <p className="mt-1">{new Date(application.createdAt).toLocaleDateString("en-GB")}</p>
          </div>
        </div>
        <EmailComposer application={application} />
      </article>)}
      {!applications.length && <p className="text-sm text-white/60">No applications have been submitted yet.</p>}
    </div>
  </section>;
}
