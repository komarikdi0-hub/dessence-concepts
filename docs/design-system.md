# Design System — dEssence

## Tech Stack

| Library | Version | Role |
|---------|---------|------|
| React | 19 | UI framework |
| TypeScript | 5.9 | Type safety |
| Vite | 8 | Build + dev server |
| Tailwind CSS | 4 | Utility-first styling via `@tailwindcss/vite` |
| Framer Motion | 12 | All animations and transitions |
| clsx + tailwind-merge | latest | Class composition via `cn()` utility |
| IBM Plex Sans + Serif | Google Fonts | Typography |

## Overall Impression

The interface feels like a **dark instrument panel in a quiet control room**. Almost-black surfaces with razor-thin borders create a layered depth system. Cards and panels float above the surface with subtle shadows and barely-visible borders. The feeling is precise, calm, and intellectually sharp — like a watchmaker's workshop at night.

## Mood & Associations

- **Recording studio monitoring desk** — dark surfaces, precise controls, focused lighting
- **Architect's drafting table after dark** — structured workspace, clean grid, floating overlays
- **High-end watch dial** — restrained detail, premium materials, nothing decorative
- **Observatory control room** — calm monitoring, intelligent alerts, quiet confidence

## Composition Principles

- **Sidebar + content** layout with fixed 220px left navigation
- **Center-weighted** content areas with max-width constraints (680–720px for reading, full for boards)
- **Three depth layers**: background (surface-0), navigation/chrome (surface-1), content cards (surface-2/3)
- **Asymmetric balance**: sidebar anchors left, content breathes in center, actions align right

## Color Personality

Monochromatic near-black palette with a single indigo accent (`#6366f1`). Surfaces are separated by opacity variations of white (3%, 4%, 6%, 8%, 10%) rather than distinct colors. The accent appears sparingly: active indicators, primary buttons, badges, and interactive highlights.

### Color Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `surface-0` | `#0a0a0b` | App background |
| `surface-1` | `#111113` | Sidebar, main content area |
| `surface-2` | `#18181b` | Cards, panels |
| `surface-3` | `#1e1e22` | Elevated cards, hover states |
| `surface-4` | `#26262b` | Active/pressed states |
| `border` | `rgba(255,255,255,0.06)` | Default borders |
| `border-active` | `rgba(255,255,255,0.12)` | Focus/active borders |
| `accent` | `#6366f1` | Primary accent (Indigo) |
| `accent-hover` | `#4f46e5` | Accent hover |
| `accent-subtle` | `rgba(99,102,241,0.08)` | Accent backgrounds |
| `success` | `#22c55e` | Positive states |
| `warning` | `#f59e0b` | Caution states |
| `error` | `#ef4444` | Danger states |
| `info` | `#3b82f6` | Informational states |

### Text Colors

| Usage | Value |
|-------|-------|
| Primary text | `#e4e4e7` (body default) |
| Strong text | `white/90` |
| Secondary text | `white/60`, `white/50` |
| Tertiary text | `white/35`, `white/30` |
| Muted text | `white/20`, `white/15` |
| Disabled text | `white/10` |

## Typography Character

Two typefaces from IBM Plex family:

- **IBM Plex Serif** — headings, titles, and brand elements. Conveys weight, credibility, maturity.
- **IBM Plex Sans** — all body text, labels, buttons, UI chrome. Neutral, technical, invisible.

The combination feels like a **well-designed business card** — the name in serif, details in sans.

### Type Scale

| Size | Weight | Usage |
|------|--------|-------|
| 22px | Serif 600 | Large stat numbers |
| 18px | Serif 600 | Page titles, section headings |
| 16px | Serif 500 | Empty state headings |
| 15px | Serif 600 | Logo/brand |
| 14px | Sans 500 | Card titles, body text, input text |
| 13px | Sans 500 | Button text, secondary body |
| 12px | Sans 500 | Labels, badges, metadata |
| 11px | Sans 500 | Small labels, source text |
| 10px | Sans 600 | Section headers (uppercase tracked), tiny labels |

## Motion Character

All animations are **pneumatic**: fast entrance, soft landing, no bounce, no overshoot. Things arrive quickly and settle with precision. The feeling is mechanical, damped, and expensive.

Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo) for most transitions.

See `motion-spec.md` for complete motion table.

## Border Radii

| Token | Value | Usage |
|-------|-------|-------|
| `radius-xs` | 4px | Tiny action buttons, inner elements |
| `radius-sm` | 6px | Small buttons, nested controls |
| `radius-md` | 8px | Buttons, inputs, small cards |
| `radius-lg` | 12px | Cards, panels, modals |
| `radius-xl` | 16px | Command bar, overlays |
| `radius-2xl` | 20px | Large containers |
| `radius-full` | 9999px | Pills, badges, avatars |

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.3)` | Buttons, small elements |
| `shadow-md` | `0 4px 12px rgba(0,0,0,0.4)` | Cards |
| `shadow-lg` | `0 8px 32px rgba(0,0,0,0.5)` | Modals, command bar |
| `shadow-xl` | `0 16px 48px rgba(0,0,0,0.6)` | Large overlays |
| `shadow-glow` | `0 0 20px rgba(99,102,241,0.15)` | Accent glow effect |

## Component Specs

### Button
- 3 sizes: sm (28px), md (32px), lg (40px)
- 4 variants: primary (accent bg), secondary (glass with border), ghost (transparent), danger
- whileTap scale 0.97
- Font: 12–14px Sans medium

### Badge
- Height: 20px
- 6 variants: default, accent, success, warning, error, outline
- Optional dot indicator
- Font: 11px Sans medium

### Card
- 4 variants: default, elevated, glass, interactive
- border-radius: 12px
- Interactive variant adds hover state change

### Input
- Height: 36px
- Optional leading icon
- border + focus ring transition
- Font: 13px Sans

### Tabs
- Animated active indicator using layoutId
- Spring transition: stiffness 400, damping 30
- Height: 28px per tab

## App Shell Structure

```
┌─────────────────────────────────────────────────┐
│ ┌──────────┬──────────────────────────────────┐ │
│ │          │ TopBar (title + actions)          │ │
│ │ Sidebar  ├──────────────────────────────────┤ │
│ │ 220px    │                                  │ │
│ │          │ Content Area (scrollable)         │ │
│ │ - Logo   │                                  │ │
│ │ - Search │ Max-width: 680–720px (centered)  │ │
│ │ - Nav    │                                  │ │
│ │ - Mode   │                                  │ │
│ │ - User   │                                  │ │
│ └──────────┴──────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Inbox Card System

- Priority indicator: colored bar (1px wide, 8px tall) on left
- Type badge + "New" badge on top row
- Title (14px medium) + summary (12px muted)
- Expandable "Why" section with evidence
- Feedback controls: thumbs up/down, dismiss
- Action buttons in expanded state

## Ask Response System

- User messages: accent-tinted bubble, right-aligned
- AI responses: elevated card with logo, structured content
- Citations section with source cards (icon + title + snippet)
- Suggested actions as button group
- Save to board / Create beacon actions

## Beacon Builder Patterns

- Card-based list with expand/collapse
- Status badge (Active/Paused/Draft) with dot indicators
- Rules displayed as checked list items
- Sources as tagged pills
- Cadence + last match metadata in footer

## Profile/Traits Patterns

- Category filter pills at top
- Trait cards with lock/unlock icon
- Confidence bar for inferred traits (percentage)
- Expandable evidence section
- Confirm/Reject/Edit/Lock actions

## Responsive Rules

- Sidebar collapses to icon-only below 768px
- Content max-width adjusts: 720px → full width
- Board grid: 3 cols → 2 cols → 1 col
- Card padding reduces on mobile
- Command bar width: 520px → 90vw

## Accessibility Notes

- All interactive elements have visible focus rings (2px accent)
- Reduced motion media query disables animations
- Custom scrollbar styling
- Sufficient color contrast for text hierarchy
- Semantic HTML structure
