---
name: prisma-supabase
description: Design or change Prisma v7 data access for Supabase PostgreSQL, including schema migrations, direct CLI connections, transaction-pooler runtime setup, query scoping, and serverless connection safety.
---

# Prisma v7 and Supabase Workflow

Use this skill for database schema, migrations, Prisma client setup, or data-access changes.

## 1. Inspect Before Editing

- Read `package.json`, `prisma.config.ts`, the Prisma schema, generated-client configuration, runtime client module, existing migrations, and every affected caller.
- Confirm installed versions of `prisma`, the Prisma client, `pg`, and `@prisma/adapter-pg`.
- Read the installed Prisma documentation before choosing the adapter constructor or client option shape; do not copy a version-specific form from memory.

## 2. Preserve and Verify Connection Separation

Maintain two distinct paths:

- **CLI and migrations:** `prisma.config.ts` uses `DIRECT_URL`, targeting the direct Supabase PostgreSQL connection on port `5432`.
- **Application runtime:** a server-only module creates an explicit `pg` `Pool` from `DATABASE_URL`, targeting the Supabase transaction pooler on port `6543`, and injects that pool through the installed version's supported `@prisma/adapter-pg` form.

Verify that the runtime `Pool`, adapter, and Prisma client are reused within an application instance rather than created per request or hot reload. Inspect explicit pool maximum, connection/idle timeouts, and intentional shutdown behavior for the deployment model. Verify direct versus pooler endpoints by parsed host/port assertions or redacted diagnostics; never print connection URLs or credentials.

Do not put connection URLs in `schema.prisma` or import the runtime client from browser-reachable code.

## 3. Design Safe Schema Changes

- Prefer explicit constraints, indexes, and relations that express domain invariants.
- Add compound unique constraints for idempotency in the true scope, such as actor/tenant plus operation plus idempotency key, or provider plus event ID.
- Consider existing rows before required columns or unique constraints; use staged migrations for destructive or backfilled changes.
- Never hardcode generated identifiers in data migrations or rewrite an applied migration unless explicitly repairing history.
- Explain data-loss and locking risk before destructive operations.

## 4. Enforce Ownership and Concurrency

- Authentication and authorization are separate checks. Scope owned reads and writes by actor/tenant in the database query, accounting for privileged roles that may bypass Supabase RLS.
- A preflight existence or version query is not concurrency protection; another writer can win before the mutation.
- For optimistic concurrency, include the expected version/state and ownership in a conditional `updateMany`/`deleteMany`, inspect the affected-row count, and map zero affected rows to a stable conflict such as HTTP `409`.
- Use transactions and database constraints for atomic invariants. Select only required fields, bound list queries, and index actual filters and ordering.
- Database transactions cannot roll back external blob, email, cache, or queue effects. Use a transactional outbox or a documented compensation, retry, and reconciliation path.

## 5. Execute and Verify

- Use `pnpm prisma generate` after changes that affect the generated client.
- Create migrations with `pnpm prisma migrate dev --name <description>` only when environment access is available and the user expects a migration to run.
- Never use reset against shared or production data.
- Prefer targeted data-access tests and `pnpm exec tsc --noEmit` over a full build.
- Test concurrent writers: assert one conditional mutation wins, losing writes affect zero rows and return the expected conflict, and idempotent duplicates cannot create multiple records.
- Test failure between database work and each external effect, including outbox delivery or compensation recovery.
- After DDL changes in Supabase, review security and performance advisors when project tools are available.

Report generated migrations, runtime pool/adapter findings, concurrency behavior, commands run, and manual deployment requirements without exposing connection details.
