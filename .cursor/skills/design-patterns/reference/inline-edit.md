---
name: Inline Edit
product: cross-product
category: forms
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Inline Edit

> **Product**: cross-product | **Category**: forms | **Status**: draft

## Problem Statement

Users need to edit table cell values quickly without opening a dialog or leaving the table view. Click or focus should reveal an input; save (blur or Enter) or cancel (Escape) should return to read-only display.

## Solution

Table cells that display a value and, on click/focus, switch to an Input. Button or Icon for save/commit; Escape or Cancel reverts. No separate dialog.

## Anatomy

```
│ Name          │ Status        │ Owner   │
│ Project Alpha │ [Dropdown ▼]  │ Jane    │  ← cell in edit mode
│ Project Beta  │ Draft         │ John    │
```

### Component Tree

```
Table
└── Cell (editable)
    ├── Read: text + optional Icon (edit)
    └── Edit: Input | Dropdown | etc. + Button/Icon (save), (cancel)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Table | Yes | Contains editable cells |
| Input (or Dropdown etc.) | Yes | Shown in cell when editing |
| Save/cancel | Yes | Commit or revert; Escape to cancel |
| Read view | Yes | Default cell content when not editing |

## Usage Guidelines

### When to Use

- Quick edits to one or two columns (name, status, date)
- When opening a dialog would be heavy for a single value
- Dense tables where context should stay visible

### When NOT to Use

- Complex or multi-field edit → Use Form Dialog or Detail Drawer
- Validation or dependencies across fields → Prefer form
- Rare edits → Row action "Edit" opening dialog may be fine

## Implementation

### Component Dependencies

```typescript
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Table, Input, Button, Icon when Harmony root is available.*

| Area | Notes |
|------|--------|
| Cell state | editingCellId or (rowId, columnId); toggle on click/focus. |
| Save | On blur/Enter: validate, persist, exit edit mode. |
| Cancel | On Escape or explicit Cancel: revert, exit edit mode. |

## Accessibility

- [ ] Keyboard: Enter cell to edit; Escape to cancel; Tab to next.
- [ ] Screen reader: Announce "editing" and "saved" or "cancelled".

## Related Patterns

- **CRUD Table** — Table that may include inline-editable columns.
- **Form Dialog** — Use for full record edit.

## Design Decisions

**Decision**: In-cell input with save on blur/Enter. **Rationale**: Fast edits without navigation. **Alternatives**: Double-click to edit; always-visible edit icon.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Table with editable cells; toggle edit mode per cell.
- [ ] Input (or appropriate control) in cell when editing.
- [ ] Save on blur/Enter; cancel on Escape.
- [ ] Update registry if adding new instance.
