# Minimal White Design System

This is the visual source of truth for generated interfaces. Agents should compose these primitives and patterns instead of inventing a new visual language per feature.

The direction is informed by publicly observable patterns across Marc Lou's product sites. No proprietary source, copy, branding, or assets are included.

## Visual Contract

### Tokens

| Token | Default | Allowed adjustment |
| --- | --- | --- |
| Page | `#ffffff` | Near-white down to `#fafafa` |
| Surface | `#ffffff` | Keep primary cards white |
| Subtle surface | `#f7f7f8` | Neutral only |
| Text | `#18181b` | Near-black |
| Muted text | `#71717a` | Must retain readable contrast |
| Border | `#e4e4e7` | One pixel by default |
| Strong border | `#a1a1aa` | Focused or selected state |
| Primary | `#18181b` | Product may replace with one saturated brand color |
| Primary text | `#ffffff` | Maintain contrast |
| Focus | `#2563eb` | One consistent visible ring |
| Success | `#15803d` | Semantic use only |
| Warning | `#a16207` | Semantic use only |
| Danger | `#b91c1c` | Semantic use only |

Use a product accent sparingly. Do not generate a palette of unrelated accent colors.

### Geometry

- Page content: `68rem` maximum for marketing, `80rem` for data-heavy admin.
- Reading content: `42rem` to `48rem`.
- Section spacing: `4rem` mobile, `6rem` desktop; reduce for admin surfaces.
- Control heights: `2.25rem`, `2.5rem`, or `2.75rem`.
- Field radius: `0.5rem`.
- Container radius: `0.75rem`; do not exceed `1rem` without a product-specific reason.
- Pills are reserved for tags, status, and compact filters—not ordinary buttons or cards.
- Shadows are reserved for floating overlays. Static content uses borders or whitespace.

### Typography

- Use one practical sans family and at most one deliberate display family.
- Marketing headline: bold, tight line-height, direct copy, no gradient text.
- Body: readable line length and ordinary sentence casing.
- Admin: compact hierarchy and tabular numerals for metrics.
- Avoid giant headings that leave the first viewport mostly empty.

## Page Composition

### Marketing

Use this sequence only when each section has real content:

1. Compact navigation.
2. Direct headline and short outcome-focused explanation.
3. One primary action and at most one secondary action.
4. Concrete proof or product preview near the fold.
5. Problem/comparison section.
6. Three-to-five step or feature narrative.
7. Testimonials/proof.
8. Simple pricing.
9. FAQ.
10. Repeated CTA and compact footer.

Vary section structure according to content. Do not default every section to three equal icon cards.

### Product and admin

- Favor useful density over oversized whitespace.
- Use one page header with title, context, and actions.
- Keep filters and search close to the data they affect.
- Use real tables for tabular information.
- Keep edit flows in-place when accessible.
- Use persistent status for save/sync state.
- Render cached content immediately and skeletons only for missing content.

## Component Rules

- Primary buttons are solid and compact; secondary buttons use a border or quiet surface.
- Links remain visually identifiable and are not buttons unless they navigate as a prominent CTA.
- Inputs are white with one-pixel borders and strong focus rings.
- Cards exist only for grouped concepts; plain sections and dividers are preferred otherwise.
- Dialogs are narrow enough to read, with explicit title, consequence, cancel, and action order.
- Status notices use semantic border/background/text, not decorative gradients.
- Navigation uses text labels; icons support labels rather than replacing them by default.

## Prohibited Defaults

Unless the product explicitly calls for them, do not generate:

- purple/blue gradient backgrounds or gradient text
- glowing blurred blobs
- glassmorphism
- huge pill-shaped calls to action
- excessive rounded cards or shadows
- three generic icon cards as the default feature section
- floating dashboard mockups with invented data
- badge overload
- decorative charts without product meaning
- animation on every section
- hidden scrollbars
- low-contrast gray text

## UI Foundation

- Use native HTML for simple controls.
- Use Base UI for complex accessible behavior such as dialogs, menus, popovers, and select-like controls.
- Use Tailwind for project-owned styling.
- Use the repository's registry components as the starting point.
- Do not apply default shadcn or DaisyUI visual styles alongside this system.
- DaisyUI may be selected as a separate rapid-prototyping mode, but a project must choose one visual foundation deliberately.
