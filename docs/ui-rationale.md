# UI Rationale — dEssence Redesign

## Main UX Decisions

### 1. Inbox as Home, Not Storage
The biggest shift: the default screen shows **outcomes**, not raw saves. Instead of a masonry grid of links, the user sees prioritized matches, active tasks, and intelligent suggestions. This immediately communicates "the system is working for you."

### 2. Evidence-First Design
Every surfaced result includes a "Why" explanation. Beacon matches show which rules triggered. Ask answers cite specific artifacts. Profile traits show evidence with confidence scores. This builds trust without requiring the user to investigate.

### 3. Progressive Disclosure Over Feature Explosion
Cards start compact (title + summary + type). Clicking expands to reveal evidence, actions, and metadata. This keeps the interface scannable while making deep information accessible. The user controls information density.

### 4. Single Visual Language
One accent color. One border treatment. One card radius. One motion character. The entire interface feels like one coherent instrument rather than a collection of features from different design sprints.

### 5. Actions in Context
Every actionable item includes its actions right there — no navigation to a separate screen, no modal, no menu. "Save to board," "Not relevant," "Create beacon" — all within the card where the information lives.

## Before/After Improvements

| Aspect | Before | After |
|--------|--------|-------|
| Home screen | Raw chat + masonry pinboard | Intelligent action console with prioritized cards |
| Navigation | Horizontal tabs, confusing hierarchy | Fixed sidebar with clear workspace sections |
| Card design | Plain white cards, no visual hierarchy | Layered dark cards with type indicators, priority bars |
| Information density | Low — lots of wasted space | High — compact but readable, progressive disclosure |
| Trust/transparency | None — no explanation of results | Evidence on every card, citations on answers |
| Visual quality | Generic SaaS dashboard | Premium dark workspace with precise typography |
| Motion | None | Purposeful pneumatic transitions throughout |

## How Simplicity Was Improved

1. **Reduced navigation choices**: 5 primary destinations instead of scattered tabs
2. **Command bar (⌘K)**: Fast access to anything without navigating
3. **Consistent card patterns**: Once you understand one card type, you understand them all
4. **Visual hierarchy does the work**: Priority bars, badges, and type icons eliminate need to read everything
5. **Feedback is one click**: Thumbs up/down directly on cards, no forms
6. **Boards are workspaces, not dumps**: Description, metadata, and view modes make boards useful

## How Trust/Explainability Was Handled

1. **Inbox cards**: Every item has a "reason" field shown in expanded view
2. **Ask answers**: Citations section with source links and snippets
3. **Beacon matches**: Rules that triggered the match are listed explicitly
4. **Profile traits**: Each trait shows evidence (artifact counts, patterns detected)
5. **Confidence bars**: Inferred traits show numeric confidence with visual indicator
6. **Explicit vs inferred distinction**: Clear badges separate user-set values from system guesses
7. **Lock/unlock controls**: Users can freeze traits they've confirmed

## Key Product Insights Reflected in Design

- **"I never lose what I saved"** → Boards with artifact counts, search everywhere
- **"I can find and use it later"** → Ask mode with grounded retrieval + citations
- **"I understand why this appeared"** → Evidence panels on every surfaced result
- **"I can move from info to decision"** → Action buttons embedded in every context
- **"I don't need to manually organize"** → Auto-grouping suggestions, smart inbox
- **"I can trust this system"** → Transparent traits, editable preferences, explicit evidence
