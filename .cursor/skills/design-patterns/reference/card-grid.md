---
name: Card Grid
product: cross-product
category: layouts
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Card Grid

> **Product**: cross-product | **Category**: layouts | **Status**: draft

## Problem Statement

Users need to display a set of items (e.g. projects, templates) as cards in a grid. Layout can vary: single full-width, 4-column equal, 2x2, 2-top + 1-bottom full-width, 3-top + 1-bottom full-width. Up to 4 page header buttons. Reference: Harmony Functionality pages 47-51.

## Solution

ShellPageHeader with optional action buttons (up to 4). Grid of Card components; optional Badge on cards. Variants: 1-col full-width, 4-col equal, 2x2, 2+1 full-width, 3+1 full-width. Document as variants of one pattern, not separate patterns.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ShellPageHeader   [Btn] [Btn] [Btn] [Btn]                    │
├─────────────────────────────────────────────────────────────┤
│ [Card] [Card] [Card] [Card]   (4-col)                       │
│ [Card] [Card]                                                 (2+1)
│ [Card──────────────full width──────────────]                 │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
ShellPageHeader (up to 4 buttons)
Grid
└── Card (repeated), optional Badge per card
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPageHeader | Yes | Title + up to 4 buttons |
| Grid | Yes | Responsive grid of Cards |
| Card | Yes | Content per item; optional Badge |
| Variant | Yes | 1-col, 4-col, 2x2, 2+1, 3+1 (Harmony 47-51) |

## Usage Guidelines

### When to Use

- Gallery of items (projects, templates, dashboards)
- When card layout is preferred over table
- Need one of the defined grid variants

### When NOT to Use

- Single card → One Card, no grid
- Table data → Use CRUD Table
- Kanban columns → Use Kanban Board

## Variants

### 1-col full-width

**Use when**: One large card (e.g. single dashboard widget).

### 4-col equal

**Use when**: Many items of equal importance (e.g. template gallery).

### 2x2 grid

**Use when**: Four prominent items.

### 2-top + 1-bottom full-width

**Use when**: Two cards above, one wide card below.

### 3-top + 1-bottom full-width

**Use when**: Three cards above, one wide below.

## Implementation

### Component Dependencies

```typescript
import { ShellPageHeader } from '@/components/ui/shell-page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPageHeader, Card, Badge, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Grid | CSS grid; class or variant for 1-col, 4-col, 2x2, 2+1, 3+1. |
| Cards | data.map to Card; optional Badge. |
| Header | Up to 4 buttons (Harmony 47-51). |

## Accessibility

- [ ] Cards focusable or contain focusable links; grid has logical order.
- [ ] Header buttons and cards keyboard accessible.

## Related Patterns

- **Widget Dashboard** — Specific layout + filter bar; uses Cards.
- **Kanban Board** — Column-based cards.
- **Template Picker** — Right panel with card grid of templates.

## Design Decisions

**Decision**: Single Card Grid pattern with layout variants. **Rationale**: Harmony 47-51; avoid pattern proliferation. **Alternatives**: Separate pattern per layout.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPageHeader with up to 4 buttons; grid of Cards.
- [ ] Choose variant (1-col, 4-col, 2x2, 2+1, 3+1).
- [ ] Update registry if adding new instance.
