---
name: Bulk Action Bar
product: cross-product
category: data-display
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Bulk Action Bar

> **Product**: cross-product | **Category**: data-display | **Status**: draft

## Problem Statement

When users select multiple table rows, they need to perform actions on the selection (e.g. delete, assign, change status) without opening each item. The UI must show that a selection exists and offer contextual actions.

## Solution

A bar that appears when one or more table rows are selected. It shows the selection count (e.g. "3 selected") and a set of contextual actions (ButtonGroup or buttons). Actions apply to all selected items; clearing selection hides the bar.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ 3 selected    [Assign] [Change status] [Delete] [Clear]      │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
BulkActionBar (conditional on selection count > 0)
├── Chip or text (selection count)
├── ButtonGroup or Buttons (contextual actions)
└── Button (Clear selection)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Selection count | Yes | e.g. "N selected" or Chip with count |
| Contextual actions | Yes | Buttons for bulk operations (assign, delete, etc.) |
| Clear selection | Yes | Button or control to deselect all |

## Usage Guidelines

### When to Use

- Tables with checkbox selection where bulk operations are supported
- Assign, delete, status change, export selection, etc.
- When showing selection state and actions in one place reduces clutter

### When NOT to Use

- Single-select only → Use row actions or detail panel
- No bulk operations supported → Do not show bulk bar
- Actions are always one per row → Use row action menu only

## Implementation

### Component Dependencies

```typescript
import { ButtonGroup } from '@/components/ui/button-group';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ButtonGroup, Button, Chip when Harmony root is available.*

| Area | Notes |
|------|--------|
| Visibility | Show when selectedRowIds.length > 0. |
| Count | Display selectedRowIds.length. |
| Actions | Each button calls handler with selectedRowIds. |
| Clear | setSelectedRowIds([]) or equivalent. |

## Accessibility

- [ ] Keyboard: Bar focusable when visible; actions in tab order.
- [ ] Screen reader: Announce "N items selected" and action labels.

## Related Patterns

- **CRUD Table** — Table that uses row selection and Bulk Action Bar.
- **Confirmation Dialog** — Use for destructive bulk actions (e.g. delete).

## Design Decisions

**Decision**: Bar appears above or below table when selection exists. **Rationale**: Clear affordance; doesn’t occupy permanent space. **Alternatives**: Floating bar; inline in table header.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Render bar only when selection count > 0.
- [ ] Show count and contextual actions; wire to selected ids.
- [ ] Provide Clear selection control.
- [ ] Update registry if adding new instance.
