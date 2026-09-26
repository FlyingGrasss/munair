---
name: observability-design
description: Design or implement structured logs, correlation IDs, error reporting, tracing, redaction, Sentry, and OpenTelemetry for Next.js applications. Use when adding diagnostics, production monitoring, performance traces, alerts, or operational telemetry.
---

# Observability Design Workflow

Observability explains why a system is failing or slow. Keep it separate from product analytics and durable audit history.

## 1. Start Provider-Neutral

Establish:

- one-line structured JSON server logs
- opaque request/support IDs
- optional trace/span correlation
- stable route templates instead of concrete sensitive URLs
- error classes and public error codes
- duration/timing helpers
- centralized field allowlisting and redaction

Telemetry failures must never break ordinary domain behavior.

## 2. Minimize at the Source

Do not collect arbitrary objects and hope a denylist catches everything. Exclude credentials, cookies, authorization headers, connection strings, request/response bodies, query values, personal data, payment/health/government identifiers, free-form content, AI prompts, and uploaded filenames by default.

Redaction must be recursive, non-mutating, cycle-safe, depth/size bounded, and applied before data reaches a provider. Provider-side scrubbing is defense in depth.

## 3. Choose One Trace Owner

For Next.js instrumentation, inspect the installed docs for `instrumentation.ts`, `instrumentation-client.ts`, runtime gating, and `onRequestError`.

- Sentry-centric: Sentry owns errors and performance.
- OTel-centric: an OpenTelemetry SDK/exporter owns traces; Sentry is error-only.
- Coexistence: only after verifying provider ownership, duplicate spans, propagation, sampling, and shutdown.

Never register competing global tracer providers accidentally. Keep tracing, profiling, replay, and broad log capture opt-in with an explicit sampling/cost budget.

## 4. Keep Audit Records Separate

Sensitive administrative mutations may require an append-only application database record written in the same transaction or through an outbox. Stdout, Sentry, analytics, and traces are not the only copy of an audit trail.

## 5. Verify

Test one valid JSON line per log, route-template normalization, recursive secret/PII removal, bounded cyclic input, request ID trust policy, error normalization, missing-provider behavior, sampling validation, client/server secret separation, trace correlation when present, and telemetry-provider failure isolation.
