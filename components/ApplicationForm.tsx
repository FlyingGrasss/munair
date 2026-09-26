"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogRoot } from "@/components/ui/dialog";
import { FieldShell, Input, Select, Textarea } from "@/components/ui/field";
import type { ApplicationDefinition, QuestionDefinition, SiteSettings } from "@/types/conference";

type Values = Record<string, string>;
type Errors = Record<string, string>;

function Question({ question, value, error, prefix = "", onChange }: { question: QuestionDefinition; value?: string; error?: string; prefix?: string; onChange: (value: string) => void }) {
  const id = `${prefix}${question.id}`;
  const shared = { id, name: question.id, value: value || "", required: question.required, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => onChange(event.target.value), "aria-invalid": Boolean(error), "aria-describedby": error ? `${id}-error` : undefined };
  const hint = question.minWords ? `Minimum ${question.minWords} words.` : undefined;
  return <FieldShell id={id} label={question.label} required={question.required} error={error} hint={hint}>
    {question.type === "longText" ? <Textarea {...shared} /> : question.type === "dropdown" ? <Select {...shared}><option value="">Select an option</option>{question.options?.map((option) => <option key={option}>{option}</option>)}</Select> : <Input {...shared} type={question.type === "shortText" ? "text" : question.type === "phone" ? "tel" : question.type} min={question.type === "number" ? 0 : undefined} />}
  </FieldShell>;
}

export default function ApplicationForm({ application, settings }: { application: ApplicationDefinition; settings: SiteSettings }) {
  const router = useRouter();
  const questions = settings.form.questions[application.id];
  const delegation = application.id === "delegation";
  const minDelegates = settings.form.minimumDelegates;
  const [answers, setAnswers] = useState<Values>({});
  const [summary, setSummary] = useState<Values>(delegation ? { numberOfDelegates: String(minDelegates) } : {});
  const [delegates, setDelegates] = useState<Values[]>(delegation ? Array.from({ length: minDelegates }, () => ({})) : []);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const payload = useMemo(() => delegation ? { summary, delegates } : { answers }, [answers, delegates, delegation, summary]);
  const summaryQuestions = delegation ? questions.slice(0, 3) : [];
  const memberQuestions = delegation ? questions.slice(3) : [];

  const updateDelegateCount = (count: number) => {
    const safe = Math.max(minDelegates, Math.min(40, count || minDelegates));
    setSummary((current) => ({ ...current, numberOfDelegates: String(safe) }));
    setDelegates((current) => Array.from({ length: safe }, (_, index) => current[index] || {}));
  };

  async function requestCode(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage(""); setErrors({});
    try {
      const response = await fetch(`/api/applications/${application.id}/challenge`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) { setErrors(result.error?.details || {}); setMessage(result.error?.message || "Please review the form and try again."); return; }
      setChallengeId(result.challengeId); setDialogOpen(true);
    } catch { setMessage("The application service could not be reached. Please try again."); }
    finally { setBusy(false); }
  }

  async function verify(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch(`/api/applications/${application.id}/verify`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ challengeId, code, payload }) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error?.message || "Verification failed."); return; }
      router.push(`/success?type=${application.id}`);
    } catch { setMessage("The verification service could not be reached. Please try again."); }
    finally { setBusy(false); }
  }

  return <>
    <form onSubmit={requestCode} className="space-y-10" noValidate>
      {delegation ? <>
        <fieldset className="grid gap-6 rounded-lg border border-[var(--border)] p-5 sm:grid-cols-2"><legend className="px-2 font-display text-3xl">Delegation details</legend>
          {summaryQuestions.map((question) => <Question key={question.id} question={question} value={summary[question.id]} error={errors[`summary.${question.id}`]} onChange={(value) => question.id === "numberOfDelegates" ? updateDelegateCount(Number(value)) : setSummary((current) => ({ ...current, [question.id]: value }))} />)}
        </fieldset>
        <div className="space-y-4">{delegates.map((delegate, index) => <details key={index} open={index === 0} className="group rounded-lg border border-[var(--border)] bg-white">
          <summary className="cursor-pointer list-none px-5 py-5 font-bold">Delegate {index + 1}<span className="float-right text-[var(--red)] group-open:rotate-45"><Plus /></span></summary>
          <fieldset className="grid gap-6 border-t border-[var(--border)] p-5 sm:grid-cols-2"><legend className="sr-only">Delegate {index + 1} details</legend>{memberQuestions.map((question) => <Question key={question.id} prefix={`delegate-${index}-`} question={question} value={delegate[question.id]} error={errors[`delegates.${index}.${question.id}`]} onChange={(value) => setDelegates((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [question.id]: value } : item))} />)}</fieldset>
        </details>)}</div>
        <div className="flex gap-3"><Button variant="secondary" onClick={() => updateDelegateCount(delegates.length + 1)}><Plus className="size-4" /> Add delegate</Button>{delegates.length > minDelegates && <Button variant="quiet" onClick={() => updateDelegateCount(delegates.length - 1)}><Minus className="size-4" /> Remove last</Button>}</div>
      </> : <fieldset className="grid gap-6 sm:grid-cols-2"><legend className="sr-only">Application details</legend>{questions.map((question) => <div key={question.id} className={question.type === "longText" ? "sm:col-span-2" : ""}><Question question={question} value={answers[question.id]} error={errors[question.id]} onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))} /></div>)}</fieldset>}
      {message && <p role="alert" className="border-l-4 border-[var(--red)] bg-red-50 p-4 text-sm font-semibold text-red-800">{message}</p>}
      <div className="border-t border-[var(--border)] pt-6"><Button type="submit" disabled={busy}>{busy ? "Checking application…" : "Continue to email verification"}</Button></div>
    </form>
    <p className="mt-5 border-t border-[var(--border)] pt-4 text-xs leading-5 text-[var(--muted)]">Email verification is required before an application is submitted.</p>

    <DialogRoot open={dialogOpen} onOpenChange={setDialogOpen}><DialogContent title="Verify your email" description="Enter the six-digit code we sent. It expires in 10 minutes.">
      <form onSubmit={verify} className="space-y-5"><FieldShell id="verification-code" label="Verification code" required error={message || undefined}><Input id="verification-code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} className="text-center text-2xl font-extrabold tracking-[.4em]" aria-invalid={Boolean(message)} /></FieldShell><Button type="submit" disabled={busy || code.length !== 6}>{busy ? "Submitting…" : "Verify and submit"}</Button></form>
    </DialogContent></DialogRoot>
  </>;
}
