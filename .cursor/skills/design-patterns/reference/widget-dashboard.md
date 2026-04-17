---
name: Widget Dashboard
product: cross-product
category: layouts
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Widget Dashboard

> **Product**: cross-product | **Category**: layouts | **Status**: draft

## Problem Statement

Users need a dashboard with filter bar at top (Period, Project, Control accounts) and a grid of stat cards and chart cards. Layout: 4-col first row, 4-col with action icons second row, 3-col section-headed chart cards, full-width bottom card. Reference: Harmony Functionality page 52.

## Solution

ShellPageHeader with filter bar (Dropdown, DatePicker). Grid of Cards: first row 4 equal columns (stat cards); second row 4 columns with Badge/Icon actions; then 3-column chart cards with section headings; bottom full-width Card.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ShellPageHeader   Period [▼] Project [▼] Control [▼]       │
├──────────┬──────────┬──────────┬──────────┤
│ Card 1   │ Card 2   │ Card 3   │ Card 4   │  (4-col)
├──────────┼──────────┼──────────┼──────────┤
│ Card 5 ⋮ │ Card 6 ⋮ │ Card 7 ⋮ │ Card 8 ⋮ │  (4-col + icons)
├──────────┴──────────┴──────────┤
│ Section: Charts               │
│ [Card] [Card] [Card]          │  (3-col)
├───────────────────────────────┤
│ Full-width card               │
└───────────────────────────────┘
```

### Component Tree

```
ShellPageHeader
├── Title
└── Dropdown (Period), DatePicker, Dropdown (Project, Control accounts)
Grid
├── Row 1 — Card × 4
├── Row 2 — Card × 4 (Badge, Icon per card)
├── Section heading + Card × 3
└── Card (full-width)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPageHeader | Yes | Title + filter bar |
| Filter bar | Yes | Period, Project, Control accounts (Harmony 52) |
| Stat cards | Yes | First row 4-col; second row 4-col with icons |
| Chart cards | Yes | 3-col with section heading |
| Full-width card | Yes | Bottom |

## Usage Guidelines

### When to Use

- Executive or team dashboard with KPIs and charts
- When Period/Project/Control filters drive all widgets
- Harmony dashboard layout (page 52)

### When NOT to Use

- Single widget → Single Card or page
- No filters → Simpler grid
- Different layout → Use Card Grid variants

## Implementation

### Component Dependencies

```typescript
import { ShellPageHeader } from '@/components/ui/shell-page-header';
import { Card } from '@/components/ui/card';
import { Dropdown } from '@/components/ui/dropdown';
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPageHeader, Card, Dropdown, DatePicker, Badge, Icon when Harmony root is available.*

| Area | Notes |
|------|--------|
| Filter bar | Same as Data Table with Filter Bar; drive widget data. |
| Grid | CSS grid or layout component; responsive breakpoints. |
| Cards | Each card receives data from filter context. |

## Accessibility

- [ ] Filter controls and cards focusable; headings for sections.
- [ ] Chart cards have text alternative or summary.

## Related Patterns

- **Card Grid** — Grid of cards; this pattern defines specific layout + filter bar.
- **Data Table with Filter Bar** — Same filter bar concept.
- **Page Designer / Edit Mode** — Edit dashboard layout.

## Design Decisions

**Decision**: 4-col, 4-col, 3-col, full-width. **Rationale**: Harmony Functionality page 52. **Alternatives**: All equal; 2-col only.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPageHeader with Period, Project, Control dropdowns.
- [ ] Grid: 4+4 cards, then 3 chart cards + full-width card.
- [ ] Update registry if adding new instance.
