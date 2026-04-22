# Motion Spec — dEssence

## Easing Tokens

| Token | Value | Character |
|-------|-------|-----------|
| `ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary — fast in, soft stop |
| `ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Gentler version for subtle transitions |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric — used for loops and toggles |
| `spring-snappy` | `stiffness: 400, damping: 30` | Tab indicators, sidebar active state |
| `spring-gentle` | `stiffness: 350, damping: 30` | Sidebar active indicator |

## Transition Table

| Transition | Use Case | Duration | Easing | Delay | Notes |
|-----------|----------|----------|--------|-------|-------|
| Screen enter | Page/screen transition in | 250ms | ease-out-expo | 0 | opacity 0→1, y 6→0 |
| Screen exit | Page/screen transition out | 250ms | ease-out-expo | 0 | opacity 1→0, y 0→-4 |
| Card enter | Inbox/board card appearance | 350ms | ease-out-expo | index × 40ms | opacity 0→1, y 12→0 |
| Card exit | Card dismiss/archive | 350ms | ease-out-expo | 0 | opacity 1→0, x 0→-20 |
| Expand/collapse | Card detail expansion | 250ms | ease-out-expo | 0 | height auto, opacity transition |
| Command bar open | Search overlay appear | 200ms | ease-out-expo | 0 | opacity 0→1, scale 0.96→1, y -10→0 |
| Command bar close | Search overlay dismiss | 200ms | ease-out-expo | 0 | opacity 1→0, scale 1→0.97, y 0→-5 |
| Backdrop fade | Overlay background | 150ms | linear | 0 | opacity 0→1 |
| Tab indicator | Active tab slide | spring | stiffness 400, damping 30 | 0 | layoutId animation |
| Sidebar indicator | Active nav item | spring | stiffness 350, damping 30 | 0 | layoutId animation |
| Button press | Click feedback | 100ms | linear | 0 | scale 1→0.97 |
| Toast enter | Notification appear | 250ms | ease-out-expo | 0 | opacity 0→1, y 20→0, scale 0.95→1 |
| Toast exit | Notification dismiss | 250ms | ease-out-expo | 0 | opacity 1→0, y 0→10, scale 1→0.97 |
| Empty state | Empty view appear | 400ms | ease-out-expo | 0 | opacity 0→1, y 8→0 |
| Hover actions | Card action buttons | 150ms | linear | 0 | opacity + scale |
| Artifact card | Board card appear | 350ms | ease-out-expo | index × 30ms | opacity 0→1, scale 0.97→1 |
| Board card | Board list card appear | 400ms | ease-out-expo | index × 50ms | opacity 0→1, y 16→0 |
| Ask message | Chat message appear | 400ms | ease-out-expo | index × 100ms | opacity 0→1, y 16→0 |
| Board transition | Board list → detail | 300ms | ease-out-expo | 0 | opacity + x slide |
| Color transition | All CSS transitions | 150ms | linear | 0 | Hover/focus state changes |
| Border transition | Focus/active borders | 150ms | linear | 0 | Color change |
| Chevron rotate | Expand indicator | 200ms | ease-out-expo | 0 | rotate 0→90° |

## Motion Principles

1. **Pneumatic** — things arrive fast and settle softly, like precision-engineered machinery
2. **No bounce** — nothing overshoots, nothing springs back
3. **No playfulness** — motion serves clarity, not delight
4. **Stagger for hierarchy** — card lists stagger by 30–50ms per item
5. **Exit faster than enter** — exits are 20% shorter/more abrupt
6. **Scale for depth** — subtle scale (0.95–1.0) suggests z-axis movement
7. **Opacity for attention** — fade controls what the eye notices
8. **Layout animations for continuity** — tab indicators use layoutId for smooth position tracking
