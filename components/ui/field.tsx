import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const control = "min-h-11 w-full rounded-md border border-[var(--border)] bg-white px-3 text-sm text-[var(--ink)] outline-none placeholder:text-[#777] focus:border-[var(--red)] focus:ring-2 focus:ring-[var(--red)]/20 disabled:bg-[#eee]";

export function FieldShell({ id, label, required, error, hint, children }: { id: string; label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode }) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return <div className="grid gap-1.5"><label htmlFor={id} className="text-sm font-bold text-[var(--ink)]">{label}{required ? <span className="ml-1 font-normal text-[var(--muted)]">(required)</span> : null}</label>{typeof children === "object" && children ? <span className="contents" data-describedby={describedBy}>{children}</span> : children}{hint ? <p id={`${id}-hint`} className="text-xs leading-5 text-[var(--muted)]">{hint}</p> : null}{error ? <p id={`${id}-error`} className="text-xs font-semibold text-red-700">{error}</p> : null}</div>;
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "min-h-32 py-3 leading-6", className)} {...props} />;
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(control, className)} {...props} />;
}
