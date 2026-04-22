# Consistency Rules — dEssence

## 10 Strict Rules That Protect the Visual Language

### 1. One Accent Color Only
The only chromatic color in the entire interface is Indigo (`#6366f1`). Semantic colors (success, warning, error, info) appear only in status indicators and badges — never as decorative elements, backgrounds, or gradients.

### 2. Depth Through Opacity, Not Color
Surface differentiation is achieved exclusively through white opacity layers (3%, 4%, 6%, 8%, 10%) over the near-black base. Never introduce new background colors. If it needs to be different, it needs a different opacity.

### 3. Border Weight Is Always 1px at 6% Opacity
All default borders use `border-white/[0.06]`. Active states use `border-white/[0.12]`. No other border weights or colors. No colored borders except accent focus rings.

### 4. Serif for Authority, Sans for Everything Else
IBM Plex Serif is used exclusively for: page titles, card headings, stat numbers, brand name, and empty state headings. All other text — labels, body, buttons, metadata, badges — uses IBM Plex Sans. Never mix this rule.

### 5. No Motion Without Purpose
Every animation must serve one of three purposes: (a) orient the user in space, (b) confirm an action happened, (c) reduce perceived latency. Decorative animation is forbidden. If you can remove the animation and nothing is lost, remove it.

### 6. Card Radius Is Always 12px
All card-level containers use `rounded-[var(--radius-lg)]` (12px). Inner elements use 8px or 6px. Buttons use 8px. Badges use 9999px. This hierarchy must never be violated.

### 7. Stagger, Don't Flash
When multiple cards appear simultaneously, they must stagger by 30–50ms per item. Lists of items never appear all at once. The stagger direction matches the visual flow (top-to-bottom for vertical lists, left-to-right for grids).

### 8. Every Result Explains Itself
Any surfaced item (inbox card, beacon match, ask answer, suggested action) must include a visible "why" mechanism: a reason line, a citation, a confidence score, or an evidence reference. No black-box results.

### 9. Actions Live Inside Context
Action buttons appear within the card they act upon, not in floating toolbars, not in separate menus, not in modals. The user should never need to context-switch to take action on something they're looking at.

### 10. White Space Is Structural, Not Decorative
Spacing serves information hierarchy. Between major sections: 24px. Between cards: 10–12px. Inside cards: 16px padding. No arbitrary large gaps. Every spacing value should be traceable to the 4px grid. If there's empty space, it must create breathing room for dense information — not hide that there's nothing there.
