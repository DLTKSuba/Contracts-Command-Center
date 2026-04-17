---
name: Template Picker
product: cross-product
category: layouts
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Template Picker

> **Product**: cross-product | **Category**: layouts | **Status**: draft

## Problem Statement

Users need to choose a template (e.g. Gantt chart, Kanban board, Burn down chart) from a right-side panel. Templates are grouped by category with chip sub-filters; user can drag and drop onto the page. Reference: Harmony Functionality page 23.

## Solution

A ShellPanel on the right with TabStrip (Default templates / My templates). Templates grouped by category (e.g. Gantt, Burn down/up, Kanban, Pie, Heatmaps); Chip sub-filters. Card per template; drag and drop onto page.

## Anatomy

```
┌──────────────────────────────────┬─────────────────────┐
│ Page content                      │ Template Picker    │
│ (drop target)                     │ [Default] [My]     │
│                                   │ Category [Chip][Chip] │
│                                   │ ─────────────────  │
│                                   │ [Card] [Card]      │
│                                   │ [Card] [Card]      │
└──────────────────────────────────┴─────────────────────┘
```

### Component Tree

```
ShellPanel (right)
├── TabStrip (Default templates, My templates)
├── Chip (per category filter)
├── Card (per template) — draggable
└── (drop target is main content area)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPanel | Yes | Right panel |
| Tabs | Yes | Default templates / My templates |
| Category chips | Yes | Filter by Gantt, Kanban, Pie, etc. (Harmony 23) |
| Template cards | Yes | Draggable; drop onto page |
| Drop target | Yes | Main content area accepts drop |

## Usage Guidelines

### When to Use

- Add widget/template to dashboard or page (Harmony 23)
- When templates are categorized and user may have "my" vs default
- Drag-from-panel onto canvas

### When NOT to Use

- No drag-drop → Simple list or Card Grid
- Single template type → Dropdown or list
- Left-side only → Use different panel placement

## Implementation

### Component Dependencies

```typescript
import { ShellPanel } from '@/components/ui/shell-panel';
import { TabStrip } from '@/components/ui/tab-strip';
import { Chip } from '@/components/ui/chip';
import { Card } from '@/components/ui/card';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPanel, TabStrip, Chip, Card when Harmony root is available.*

| Area | Notes |
|------|--------|
| Tabs | Default vs My templates; data source per tab. |
| Chips | Filter by category (Gantt, Burn down, Kanban, Pie, Heatmaps). |
| Drag-drop | Card draggable; page or grid is drop target; add widget on drop. |

## Accessibility

- [ ] Panel and cards keyboard accessible; drag-drop has keyboard alternative (e.g. select + "Add to page").
- [ ] Categories and template names announced.

## Related Patterns

- **Page Designer / Edit Mode** — Edit mode where templates are added.
- **Card Grid** — Grid of cards; templates are a use case.
- **Widget Dashboard** — Dashboard that can receive dropped templates.

## Design Decisions

**Decision**: Right panel, tabs, category chips, drag-drop. **Rationale**: Harmony Functionality page 23. **Alternatives**: Modal picker; left panel.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPanel with Default/My tabs and category Chips.
- [ ] Template Cards draggable; main area drop target.
- [ ] On drop, add widget/template to page.
- [ ] Update registry if adding new instance.
