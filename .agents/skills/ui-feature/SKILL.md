---
name: ui-feature
description: Build or review accessible, minimalist React and Tailwind UI features with a consistent design language, DaisyUI evaluation, cache-aware loading states, custom modals, in-place editing, toasts, and correct Turkish copy.
---

# UI Feature Workflow

## 1. Inspect the Existing Design Language

Before adding UI:

- Find global styles, Tailwind configuration, theme tokens, component primitives, icon usage, and nearby screens.
- Identify the installed Tailwind and component-library versions.
- Reuse existing components and variants before creating new ones.
- For greenfield work, evaluate DaisyUI first. Adopt it only if its current version supports the desired Tailwind setup and visual language.
- Do not mix component systems without a clear accessibility or capability gap.

## 2. Define the Complete State Model

Design these states before implementation:

- initial loading
- cached/stale content while refreshing
- empty
- success
- validation error
- recoverable request error
- unauthorized/forbidden
- destructive action pending
- disabled and read-only

Render a stable shell immediately. Show cached data while revalidating when safe. Use a layout-matched skeleton only when no usable data exists, and reserve final dimensions to avoid layout shift.

For loading and cached shells:

- Mark the updating region with `aria-busy="true"`; keep any still-valid content readable and operable unless the operation makes it unsafe.
- Hide skeleton shapes from assistive technology and do not render fake buttons, links, inputs, or other focusable controls as placeholders.
- Disable shimmer and non-essential transitions under reduced-motion preferences.
- Visually and textually distinguish stale-but-usable content from first-load placeholders when freshness matters.
- Never retain one account's or tenant's cached shell after an account, workspace, or tenant switch. Clear or scope it before rendering the new identity.

## 3. Keep the UI Minimal and Consistent

- Use centralized semantic colors, spacing, typography, radii, shadows, and motion tokens.
- Prefer clear hierarchy and whitespace over decorative containers.
- Avoid arbitrary one-off colors and dimensions when a token exists.
- Keep action placement and labels consistent across similar resources.
- Use `react-hot-toast` for brief, non-blocking outcome feedback, not for decisions or detailed errors requiring action.
- Follow the feedback hierarchy: field errors next to fields; form or section errors beside the affected work with recovery actions; page-level failures in the page; toasts only for transient outcomes that need no decision. Do not report the same failure through multiple competing channels.
- Never use `cursor-wait`; retain the normal cursor and indicate pending state within the affected control.
- Treat decorative motion as optional, never as the only signal, and remove or reduce it for reduced-motion preferences.
- Do not hide scrollbars on scrollable regions; users need a visible overflow affordance.

## 4. Build Accessible Interactions

- Use semantic elements and labels.
- Ensure keyboard operation, visible focus, adequate contrast, and reduced-motion behavior.
- Do not encode meaning through color alone.
- Announce asynchronous status when appropriate without creating noisy live regions.
- Prevent duplicate submissions and preserve entered data after recoverable failures.
- Never nest interactive controls. A link must not contain a button, and a button must not contain a link or another control; use one semantic control with the appropriate appearance.

For every reusable form primitive:

- Give the control a stable, unique `id` and associate a visible `<label>` with it.
- Connect help text and validation messages with `aria-describedby`; keep referenced IDs stable even as messages change.
- Mark required fields in visible text as well as with the semantic `required` state when appropriate.
- Set `aria-invalid="true"` only while the current value is invalid, and associate the specific error message with the control.
- Supply accurate `autocomplete` tokens and `inputMode` values instead of disabling autocomplete broadly.

For navigation:

- Use named navigation landmarks when more than one navigation region exists.
- Mark the current destination with the appropriate `aria-current` value.
- Menu, disclosure, and drawer triggers must expose `aria-expanded` and `aria-controls`.
- Closed or visually hidden navigation must not leave descendants in the tab order.
- Give touch targets enough size and spacing for reliable use without forcing oversized visual controls.

## 5. Use In-App Modals Correctly

Never use `alert`, `confirm`, or `prompt`.

Apply this contract to every modal and drawer:

- Render it in a portal or platform top layer so stacking contexts cannot place it beneath the page.
- Give the surface an accessible name and, when useful, a description.
- Move focus to the least destructive useful control or the first invalid field; do not focus a destructive action by default.
- Keep focus within the open surface and restore it to the opener, or to a logical surviving control if the opener was removed.
- Support Escape and an explicit close or cancel control unless dismissal would discard or corrupt an operation.
- Lock background scrolling without causing layout jumps, and make the background inert to pointer and keyboard interaction.
- Define pending dismissal behavior explicitly. Never let backdrop click or Escape silently abandon a submitted mutation; either keep dismissal disabled with clear status or safely continue the operation after closing.

For destructive actions:

- Show an accessible custom modal.
- Name the exact target and consequence.
- Provide a clear cancel action and an explicit destructive label.
- Keep the modal open with actionable feedback if the request fails.

For editing:

- Use an in-place modal by default rather than navigating to a separate edit page.
- Prepopulate current values, validate inline, and guard against duplicate submission.

## 6. Preserve Turkish Text

- Keep source files UTF-8.
- Use real characters: `ç`, `ğ`, `ı`, `İ`, `ö`, `ş`, and `ü`.
- Check modified Turkish copy for mojibake and replacement characters.

## 7. Keep Locale State Consistent

- Derive document language, routing, formatting, validation copy, component-library labels, and accessible names from the same active locale.
- Do not mix fallback English generic labels such as “Close”, “Menu”, or “Loading” into a Turkish interface. Translate visible and assistive text together.
- When locale changes, update stale cached UI and persistence scopes so content from the previous locale is not mislabeled.

## 8. Verify Proportionally

Run a targeted test or `pnpm exec tsc --noEmit` when relevant. Do not run browser automation or a production build unless explicitly requested or genuinely necessary. Tell the user which visual states still need manual inspection.
