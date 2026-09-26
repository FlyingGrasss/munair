import { APPLICATION_TYPES } from "@/config/conference";
import type { ApplicationType, QuestionDefinition, SiteSettings } from "@/types/conference";

export type ApplicationPayload = { answers?: Record<string, string>; summary?: Record<string, string>; delegates?: Record<string, string>[] };

export function isApplicationType(value: string): value is ApplicationType {
  return APPLICATION_TYPES.includes(value as ApplicationType);
}

function cleanRecord(value: unknown): Record<string, string> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length > 80) return null;
  const result: Record<string, string> = {};
  for (const [key, item] of entries) {
    if (!/^[a-zA-Z0-9_-]{1,80}$/.test(key) || typeof item !== "string" || item.length > 12_000) return null;
    result[key] = item.trim();
  }
  return result;
}

function questionError(question: QuestionDefinition, value: string | undefined) {
  if (question.required && !value) return `${question.label} is required.`;
  if (!value) return null;
  if (question.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `${question.label} must be a valid email.`;
  if (question.type === "number" && !Number.isFinite(Number(value))) return `${question.label} must be a number.`;
  if (question.options?.length && !question.options.includes(value)) return `${question.label} has an invalid selection.`;
  if (question.minCharacters && value.length < question.minCharacters) return `${question.label} must be at least ${question.minCharacters} characters.`;
  if (question.minWords && value.split(/\s+/).filter(Boolean).length < question.minWords) return `${question.label} must be at least ${question.minWords} words.`;
  return null;
}

export function validateApplication(type: ApplicationType, input: unknown, settings: SiteSettings): { ok: true; payload: ApplicationPayload; email: string } | { ok: false; errors: Record<string, string> } {
  const raw = input && typeof input === "object" ? input as ApplicationPayload : {};
  const questions = settings.form.questions[type];
  const errors: Record<string, string> = {};

  if (type === "delegation") {
    const summary = cleanRecord(raw.summary);
    const delegates = Array.isArray(raw.delegates) ? raw.delegates.map(cleanRecord) : [];
    if (!summary) return { ok: false, errors: { form: "Invalid delegation details." } };
    const summaryQuestions = questions.slice(0, 3);
    const memberQuestions = questions.slice(3);
    summaryQuestions.forEach((question) => { const error = questionError(question, summary[question.id]); if (error) errors[`summary.${question.id}`] = error; });
    const requestedCount = Number(summary.numberOfDelegates);
    if (!Number.isInteger(requestedCount) || requestedCount < settings.form.minimumDelegates || requestedCount !== delegates.length) errors["summary.numberOfDelegates"] = `A delegation must include at least ${settings.form.minimumDelegates} delegates, and the count must match the member forms.`;
    delegates.forEach((delegate, index) => {
      if (!delegate) { errors[`delegates.${index}`] = "Invalid delegate details."; return; }
      memberQuestions.forEach((question) => { const error = questionError(question, delegate[question.id]); if (error) errors[`delegates.${index}.${question.id}`] = error; });
    });
    return Object.keys(errors).length ? { ok: false, errors } : { ok: true, payload: { summary, delegates: delegates as Record<string, string>[] }, email: summary.contactEmail.toLowerCase() };
  }

  const answers = cleanRecord(raw.answers);
  if (!answers) return { ok: false, errors: { form: "Invalid application details." } };
  questions.forEach((question) => { const error = questionError(question, answers[question.id]); if (error) errors[question.id] = error; });
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, payload: { answers }, email: (answers.email || "").toLowerCase() };
}
