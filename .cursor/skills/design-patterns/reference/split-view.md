---
name: Split View
product: cross-product
category: layouts
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Split View

> **Product**: cross-product | **Category**: layouts | **Status**: draft

## Problem Statement

Users need to see two panels side-by-side for comparison or for list+detail without using a drawer (e.g. two tables, or table + form). Both panels are always visible in the same view.

## Solution

Two-panel layout: left and right (or top and bottom). Each panel can contain Card, Table, or form fields. Optional resizable divider. No overlay; both panels in same viewport.

## Anatomy

```
┌──────────────────────────┬──────────────────────────┐
│ Card / Table / form      │ Card / Table / form      │
│ (left panel)             │ (right panel)            │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
```

### Component Tree

```
Split container
├── Panel left — Card | Table | form fields
└── Panel right — Card | Table | form fields
(optional) Resizer between panels
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Two panels | Yes | Left and right (or top/bottom) |
| Content | Yes | Card, Table, or form in each |
| Resizer | No | Draggable divider to resize |

## Usage Guidelines

### When to Use

- Compare two items (e.g. before/after, two versions)
- List + detail when detail should stay visible (no drawer)
- Side-by-side forms or tables

### When NOT to Use

- Primary list + occasional detail → Use Master/Detail or Detail Drawer
- One panel is contextual/overlay → Use ShellPanel
- Single column preferred → Use stacked layout

## Implementation

### Component Dependencies

```typescript
import { Card } from '@/components/ui/card';
import { Table } from '@/components/ui/table';
// Layout: split container + panels; verify from Harmony or layout docs.
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Card, Table when Harmony root is available.*

| Area | Notes |
|------|--------|
| Layout | CSS grid/flex or split component; ratio (e.g. 50/50, 1/2). |
| Resizer | Optional; store width in state or CSS variable. |

## Accessibility

- [ ] Both panels keyboard accessible; resizer focusable if present.
- [ ] Live regions if content updates (e.g. selection in one panel updates other).

## Related Patterns

- **Master / Detail** — Table + panel; panel can be drawer or split.
- **Content Plus Right Navigation** — Right panel; similar idea.
- **Detail Drawer** — Overlay panel vs always-visible split.

## Design Decisions

**Decision**: Two panels always visible. **Rationale**: Comparison and list+detail without overlay. **Alternatives**: Drawer; tabs.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Two-panel layout; content in each (Card, Table, form).
- [ ] Optional resizer; responsive behavior.
- [ ] Update registry if adding new instance.
