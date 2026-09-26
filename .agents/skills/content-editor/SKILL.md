---
name: content-editor
description: Design, implement, or review page builders and CMS editors with conflict-safe draft autosave, explicit publishing, revisions, undo, preview, accessible reordering, asset compensation, and unsaved-navigation protection.
---

# Content Editor Workflow

Use this workflow for page builders, CMS forms, block editors, and other long-lived draft experiences.

## 1. Map Ownership and State

Before editing code, find the editor route, data model, mutations, cache boundaries, asset lifecycle, authorization checks, and nearby tests. Define three separate states:

- **local:** the user's current in-memory edits, which may not have reached the server
- **saved:** the latest durable draft and its server-issued version
- **published:** the immutable or separately versioned state visible to readers

Do not imply that “saved” means “published.” Show the current state with persistent text, not only a transient toast, color, spinner, or disabled button.

## 2. Make Draft Saving Ordered and Conflict-Safe

- Debounce routine autosave requests, but serialize writes so only one draft save is in flight and queued edits are saved afterward in order.
- Send the last accepted version, revision number, or ETag with every save and enforce compare-and-swap on the server.
- Advance the client's saved baseline only from a successful server response.
- On `409 Conflict` or an equivalent version mismatch, stop autosave and preserve the local draft. Never retry by overwriting the newer server version.
- Offer explicit recovery: reload the server version, copy/export local work, or enter a deliberate reconciliation flow.
- Keep failures and offline state visible near the save status. Retry safely without losing edits or claiming success early.
- Flush the debounce queue and await all in-flight saves before publish, preview that requires saved data, or any operation that depends on the latest draft.

## 3. Keep Publishing Explicit

- Make publish a distinct, authorized mutation with an explicit control and clear pending state.
- Publish a specific saved draft version. Reject the operation if that version is no longer current.
- Invalidate reader pages, metadata, sitemap/feed output, redirects, and relevant caches after publication, unpublication, slug changes, or restoration.
- Do not auto-publish autosaves, undo operations, or revision restores.

## 4. Revisions, Undo, Preview, and Reorder

- Store revisions with actor, timestamp, source version, and enough data to explain or restore the change.
- Restore a revision into a new draft version; preserve history and require a separate publish action.
- Keep undo/redo local, bounded by count or memory, and reset or rebase it deliberately after server reloads and conflict resolution.
- Preview the intended local or saved version and label which one is shown. Protect previews from indexing and unauthorized access.
- Support pointer reordering plus keyboard-accessible alternatives such as move up/down controls or a documented keyboard interaction. Announce the new position and persist one ordered result.

## 5. Protect Navigation and Destructive Actions

- Track unsaved local changes independently from an autosave request's pending state.
- When navigation would lose edits, use the router's supported interception mechanism and an accessible custom modal with stay/discard choices. Never use `window.confirm`.
- Do not use `beforeunload` to trigger a browser-native prompt under this preset. Use durable autosave to minimize tab-close loss and state the unavoidable limitation when the browser cannot show custom UI.
- Define what happens when navigation begins during debounce, save, publish, upload, and conflict resolution. Do not silently discard queued work.
- Use a custom confirmation modal for destructive block, revision, page, or asset operations; name the target and consequence and provide cancel.

## 6. Make External Asset Changes Compensatable

Treat storage uploads, media processing, and third-party asset operations as separate systems from the draft transaction.

- Create an intent or pending record before external work when practical.
- Attach the asset to the draft only after external success and authorization checks.
- If draft persistence fails, retain enough state to retry or schedule idempotent cleanup of orphaned assets.
- Make cleanup safe to repeat, observable, and bounded by ownership checks. Never delete a shared asset merely because one editor operation failed.

## 7. Verify Adversarial Flows

Add targeted tests for:

- rapid edits across multiple debounce windows and out-of-order network timing
- offline transitions, timeouts, validation failures, and retries
- two tabs or users editing the same version and receiving a conflict without overwrite
- publishing while autosave is debounced or in flight
- navigation while local changes, saves, uploads, or publish are pending
- revision restoration without automatic publication
- undo limits and keyboard reorder alternatives
- orphaned external assets and repeatable compensation

Use the lightest relevant project check. Report any browser behaviors that still require manual verification.
