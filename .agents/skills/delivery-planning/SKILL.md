---
name: delivery-planning
description: Plan software work proportionally before implementation. Use for new projects, features, cross-cutting changes, authentication, schema changes, public APIs, external integrations, destructive operations, and any task whose boundaries or risks are not already obvious.
---

# Delivery Planning Workflow

Plan before editing, but keep the plan proportional to risk.

## 1. Classify the Work

- **Micro:** copy, formatting, or isolated mechanical correction. State intent; no plan artifact.
- **Local:** contained behavior change with known boundaries. List files, behavior, and one validation step.
- **Cross-cutting:** multiple layers, public contract, cache behavior, or a new dependency. Map boundaries, data flow, failure states, tests, and rollout.
- **High-risk:** authentication, authorization, schema/destructive changes, secrets, sensitive data, billing, external side effects, deployment, or cost. Write a phased plan with threat/failure model, migration, rollback, and explicit confirmation for irreversible or costly actions.

Escalate whenever evidence reveals a wider scope.

## 2. Discover Before Designing

Inspect the target repository's rules, package versions, structure, nearby implementations, tests, and current diagnostics. For Next.js work, read the relevant installed guides under `node_modules/next/dist/docs/` before selecting APIs.

Identify:

- user and business outcome
- in-scope and out-of-scope behavior
- actors, permissions, and sensitive data
- source of truth and ownership boundaries
- server/client/runtime boundaries
- cache ownership and invalidation
- loading, empty, error, and success states
- external systems and failure behavior
- observability, analytics, and audit requirements
- migration, compatibility, and rollback needs

Ask only when a decision cannot be learned safely from the repository and proceeding would create material risk.

## 3. Route to Focused Skills

Load the relevant workflow instead of duplicating it:

- Next.js behavior: `nextjs-feature`
- UI and interaction: `ui-feature`
- Prisma/Supabase: `prisma-supabase`
- caching: `cache-design`
- APIs/security: `api-hardening`
- editors: `content-editor`
- admin authentication: `auth-admin`
- analytics: `analytics-design`
- observability: `observability-design`

## 4. Write an Executable Plan

For non-trivial work, state:

1. Evidence and constraints.
2. Proposed behavior and explicit non-goals.
3. Files or subsystems to change.
4. Data/security/cache implications.
5. Ordered implementation steps and dependencies.
6. Validation at the narrowest useful level.
7. Rollback or recovery for high-risk work.

Do not create a ceremonial plan that only restates the request. Every step must reduce uncertainty or produce a verifiable outcome.

## 5. Execute and Update

Work through the plan without repeatedly narrating routine actions. If implementation invalidates an assumption, update the plan and explain the material change. Finish only when requested behavior and proportional validation are complete.
