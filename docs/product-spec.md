# dEssence — AI Memory Workspace

## Product Overview

dEssence is an AI-powered personal memory system. Users save links, text, quotes, screenshots, and notes — dEssence stores them as memory units and lets users query their saved knowledge through a conversational interface.

The core value: **save once, recall intelligently**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Vite 8 + React 19 + TypeScript 5.9 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite` plugin) |
| Animation | Framer Motion 12 |
| Fonts | IBM Plex Sans (UI) + IBM Plex Serif (quotes) |
| Utilities | clsx + tailwind-merge via `cn()` helper |

No backend. All data is client-side mock data. This is a design prototype.

---

## Architecture

Single-file UI architecture (`src/App.tsx` ~480 lines) containing all components:

```
src/
  App.tsx          — All UI components + app logic
  index.css        — Tailwind theme, scrollbar, scroll effects
  main.tsx         — React entry point
  lib/utils.ts     — cn() utility (clsx + tailwind-merge)
  data/mock.ts     — Types (Memory, ChatMessage, Citation) + seed data
```

### Component Map

```
App
 ├── Pinboard (scrollable, full-screen background)
 │    └── Masonry (4-column flex layout, infinite scroll)
 │         └── MemoryCard (image | quote | link | note)
 ├── Bottom Fade Gradient
 ├── Chat Panel (floating, bottom-center, 720px max)
 │    ├── ClarificationBar (category selection after save)
 │    ├── Messages (scrollable, 340px max)
 │    │    ├── Message (user bubble | AI bubble)
 │    │    │    └── CitationChip (inline memory reference)
 │    │    └── TypingDots (AI thinking indicator)
 │    └── Input Bar (always visible)
 │         ├── Paperclip button
 │         ├── Text input
 │         ├── Demo button
 │         └── Send button
 ├── DropOverlay (drag-and-drop feedback)
 └── DemoCursor (interactive walkthrough)
```

---

## Data Model

### Memory

```typescript
interface Memory {
  id: string;
  type: 'image' | 'quote' | 'link' | 'note';
  content: string;
  source?: string;     // hostname or attribution
  image?: string;      // URL for image type
  timestamp: string;
  category?: string;   // user-assigned via clarification
}
```

### ChatMessage

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];  // inline references to memories
}
```

### Citation

```typescript
interface Citation {
  memoryId: string;       // references Memory.id
  label: string;          // display text
  type: Memory['type'];   // for icon/color selection
}
```

---

## User Flows

### Flow 1: Save via Chat

1. User types a URL, text, or quote into the chat input
2. System detects input type:
   - **URL** (`https://...`) -> saved as `link`
   - **Question** (ends with `?` or starts with query words) -> treated as query (Flow 2)
   - **Text** -> saved as `quote` (short) or `note` (long)
3. Memory card appears on the pinboard
4. AI responds: "Saved to your memory!"
5. **Clarification bar** appears: "What type of content is this?"
6. Category pills: Link, Quote, Note, Image, Article, Listing
7. User picks a category -> AI confirms, bar disappears

### Flow 2: Query Memory

1. User asks a question in the chat (e.g. "What apartments have I saved?")
2. Typing indicator shows while AI "thinks" (1.2s delay)
3. AI responds with natural language answer
4. **Citation chips** appear inline, referencing specific saved memories
5. Each chip shows an icon (by type) + truncated label

### Flow 3: Save via Drag & Drop

1. User drags an image file, URL, or text onto the pinboard
2. Drop overlay appears: "Drop to save"
3. On drop:
   - **Image file** -> saved as `image` type with blob URL
   - **URL text** -> saved as `link`
   - **Plain text** -> saved as `quote` or `note`
4. Chat opens with AI confirmation + clarification bar

### Flow 4: Interactive Demo

1. User clicks the play button (triangle icon) in the input bar
2. An animated cursor circle appears at screen center
3. Cursor autonomously demonstrates the full flow:
   - Moves to input, types a URL
   - Clicks send -> memory saved, AI responds
   - Clarification bar appears, cursor clicks "Listing"
   - Cursor types a question: "What apartments have I saved?"
   - Clicks send -> AI responds with citation chips
   - Cursor hovers over a citation chip
4. Demo ends after ~12 seconds, cursor fades out
5. Can be stopped mid-flow by clicking the stop button (X icon)

---

## Design System

### Color

| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent` | `#3489FF` | Primary actions, links, active states |
| `--color-accent-hover` | `#1a6fe0` | Hover on accent elements |
| `--color-accent-subtle` | `rgba(52,137,255,0.06)` | Backgrounds, tints |
| Background | `#ffffff` | Page background |
| Text primary | `#1a1a1a` | Body text |
| Text secondary | `rgba(0,0,0,0.5)` | Labels, timestamps |

Single accent color. Light theme only.

### Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Body | IBM Plex Sans | 400 | 14px |
| Labels | IBM Plex Sans | 500-600 | 12-13px |
| Quotes | IBM Plex Sans | 500 italic | 14px |
| Chat bubbles | IBM Plex Sans | 500 | 14px |

### Radius

| Token | Value | Usage |
|-------|-------|-------|
| Cards | 14px | Memory cards |
| Chat panel | 20px | Floating panel |
| Input fields | 10-12px | Text inputs, buttons |
| Pills | 9999px (full) | Category pills, suggestion chips |

### Shadows

| Element | Shadow |
|---------|--------|
| Chat panel | `0 12px 60px rgba(0,0,0,0.12)` |
| Card hover | `0 4px 20px rgba(0,0,0,0.08)` |
| Remove button | `shadow-md` (Tailwind default) |

---

## Scroll Effects

### Infinite Scroll

The masonry pinboard scrolls infinitely. When the user approaches the bottom (within 800px), more cycles of cards are appended. Each of the 4 columns shows all 28 memory items (offset per column for visual variety), ensuring all columns have identical heights.

### Chromatic Split

During scrolling, cards get a chromatic aberration effect via `box-shadow`:

- **Blue fringe** (3px upward): `rgba(52, 137, 255, 0.18)`
- **Red fringe** (3px downward): `rgba(255, 60, 90, 0.12)`

Appears in 0.12s, fades in 0.5s. Implemented via `.is-scrolling` class toggle on the scroll container (debounced at 200ms).

---

## Chat Panel States

### Collapsed (default)

```
[clip] [Ask your memory...        ] [demo] [send]
```

Just the input bar. Expands on focus or send.

### Expanded

```
 Memory Chat                              [collapse]
 ┌─ Clarification (if active) ──────────────────┐
 │ What type of content is this?                 │
 │ [Link] [Quote] [Note] [Image] [Article] [Listing] │
 └───────────────────────────────────────────────┘

 User: https://airbnb.com/rooms/tokyo-2br

 AI: Saved to your memory! I've stored this link.

 User: What apartments have I saved?

 AI: I found 2 apartment-related items...
    [Apartment in Shibuya] [Tokyo Shibuya 2BR]
 ─────────────────────────────────────────────────
 [clip] [Ask your memory...        ] [demo] [send]
```

Max height for messages: 340px (scrollable). Panel width: 720px.

---

## AI Response Logic

Scripted keyword matching for the demo (no real AI):

| Keywords | Response Topic | Citations |
|----------|---------------|-----------|
| apartment, shibuya | Apartment listings | m2 (Shibuya 2BR) |
| quote | Saved quotes collection | First 3 quote-type memories |
| flight, travel, tokyo, japan | Travel plans | m7 (flight), m9 (Tokyo), m21 (ramen) |
| tech, link | Tech bookmarks | First 3 link-type memories |
| *(default)* | General memory summary | First 2 memories |

---

## Demo Cursor Sequence

| Step | Action | Duration |
|------|--------|----------|
| 1 | Cursor appears at center | 700ms |
| 2 | Move to input, click to expand | 1200ms |
| 3 | Type URL character by character | ~1600ms |
| 4 | Move to send, click | 800ms |
| 5 | Wait for AI response + clarification | 1900ms |
| 6 | Move to "Listing" category, click | 1200ms |
| 7 | Wait for AI confirmation | 1700ms |
| 8 | Move to input, type question | ~1500ms |
| 9 | Move to send, click | 800ms |
| 10 | Wait for AI response with citations | 1300ms |
| 11 | Move to citation chip, click | 1300ms |
| 12 | Cursor fades out | ~400ms |
| **Total** | | **~12.5s** |

Cursor visual: 28px circle, `border-accent`, `bg-accent/20`, spring animation. Click pulse: expanding ring that fades out.

---

## Layout Dimensions

```
┌─────────────────────────────────────────────────┐
│                                                   │
│           Pinboard (full screen)                  │
│           4 columns, 14px gap                     │
│           max-width: 1400px                       │
│           padding: 24px top/sides                 │
│           padding-bottom: 240px                   │
│                                                   │
│                                                   │
├───────────────── gradient 240px ─────────────────┤
│                                                   │
│        ┌── Chat Panel (720px max) ──┐            │
│        │                             │            │
│        │   Messages (340px max-h)    │            │
│        │   Input bar (40px h)        │            │
│        │                             │            │
│        └─────────────────────────────┘            │
│              margin-bottom: 20px                   │
└─────────────────────────────────────────────────┘
```

---

## Accessibility

- `prefers-reduced-motion`: disables all animations
- `:focus-visible`: 2px accent outline with 2px offset
- Custom scrollbar: 6px thin, transparent track
- Semantic HTML: buttons for interactive elements, proper alt text on images
- Text contrast: minimum black/70 on white for body text

---

## File Reference

| File | Lines | Purpose |
|------|-------|---------|
| `src/App.tsx` | ~480 | All components, state, demo logic |
| `src/data/mock.ts` | ~57 | Types + 28 seed memories |
| `src/index.css` | ~118 | Theme, scrollbar, chromatic effect |
| `src/lib/utils.ts` | ~5 | cn() utility |
| `src/main.tsx` | ~10 | React DOM entry |
| `index.html` | ~16 | Shell + Google Fonts |
