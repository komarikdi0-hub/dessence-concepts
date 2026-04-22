# Wise.com Design System — Reference for dEssence

Studied at wise.com, April 2026. Use this to guide all palette and UI decisions.

---

## Core Philosophy

> **Color is a reward, not a default.**

Wise doesn't paint surfaces — they use color only where it earns its place:
on the one CTA that matters, on a success state, on an active indicator.
Everything else is white, near-white, or one of three gray tones.
The result: their green feels vivid and powerful precisely *because* the rest is quiet.

---

## Palette

### Backgrounds
| Role | Value | Notes |
|------|-------|-------|
| App background | `#F9FAFB` | Near-white, barely a hint of cool |
| Surface (cards, panels) | `#FFFFFF` | Pure white only on cards |
| Surface hover / secondary | `#F3F4F6` | Tailwind gray-100 equivalent |

### Borders
| Role | Value |
|------|-------|
| Default border | `#E5E7EB` |
| Hover / stronger | `#D1D5DB` |

### Text
| Role | Value | Notes |
|------|-------|-------|
| Heading / primary | `#111827` | Near-black, slightly warm |
| Body text | `#374151` | Readable, not harsh |
| Muted / secondary | `#6B7280` | Labels, metadata |
| Faint / placeholder | `#9CA3AF` | Timestamps, hints |

### Accent — ONE color only
| Role | Value | Notes |
|------|-------|-------|
| Primary accent | `#11A46A` | Rich saturated green |
| Accent hover | `#0D8A58` | Darker green for hover states |
| Accent tint (bg) | `#E6F5EF` | For pills, highlights, active states |

---

## Rules for Accent Use

1. **ONE accent per concept.** Never two accent colors in the same view.
2. Accent goes on: primary button, active tab underline, type badge pill background, send button.
3. Accent does NOT go on: card backgrounds, borders, shadows, secondary text, icons by default.
4. If something is colored, it must be the ONLY colored thing in its visual cluster.

---

## Typography

- **Headings**: 700 weight, letter-spacing `-0.02em` to `-0.03em` (tight)
- **Labels / UI text**: 600 weight, normal or slightly tight spacing
- **Body**: 400 weight, `line-height: 1.6–1.7`
- **Metadata**: 11–12px, `#6B7280`
- **Type badges**: 9–10px, 700 weight, ALL CAPS, `letter-spacing: 0.07em`

---

## Shadows

Wise is nearly flat. Shadows exist only to lift cards off a surface, not to create drama.

```
SM: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)
MD: 0 4px 14px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.04)
```

No colored shadows. No warm-tinted shadows. Just neutral gray.

---

## Cards

- `border-radius: 14–16px`
- `border: 1px solid #E5E7EB` (barely visible)
- White background
- Hover: shadow increases, border color deepens slightly (`#D1D5DB`)
- Hover lift: `translateY(-2px)` — subtle, not dramatic

---

## What makes Wise feel premium (and NOT generic)

1. **No decoration** — no gradients on headers, no colorful section dividers, no icon accents
2. **Confident whitespace** — generous padding, nothing crowded
3. **Typography does the work** — heavy headings contrast with light body text
4. **Images carry color** — any vivid color in the UI comes from product screenshots or photos
5. **Restraint on interactive states** — hover is a subtle elevation, not a color explosion

---

## What to AVOID (anti-patterns)

- Multiple accent colors in one view
- Warm/cool color tints on backgrounds (no cream, no sky-blue surfaces)
- Colored shadows
- Gradient headers or sidebars
- More than 2 different background tones on screen at once
- Accent color on borders, separators, or non-interactive elements

---

## Applied to dEssence

The dEssence palette maps directly onto Wise:

```ts
const BG            = '#F9FAFB';
const SURF          = '#FFFFFF';
const SURF2         = '#F3F4F6';
const BORDER        = '#E5E7EB';
const BORDER2       = '#D1D5DB';
const INK           = '#111827';
const BODY          = '#374151';
const MUT           = '#6B7280';
const FAINT         = '#9CA3AF';
const ACCENT        = '#11A46A';
const ACCENT_H      = '#0D8A58';
const ACCENT_LIGHT  = '#E6F5EF';
```

The images in the pinboard ARE the color. Let them breathe.
