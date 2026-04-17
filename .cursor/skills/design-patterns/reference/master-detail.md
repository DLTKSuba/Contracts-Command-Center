---
name: Master / Detail
product: cross-product
category: layouts
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Master / Detail

> **Product**: cross-product | **Category**: layouts | **Status**: draft

## Problem Statement

Users need to browse a list (master) and view or edit details of the selected item (detail) without losing the list context. The detail should be context-sensitive to the selected row and allow quick switching between items.

## Solution

A layout with a Table on the left (master) and a ShellPanel on the right showing the detail form or view for the selected row. The right panel is context-sensitive to selection; selecting another row updates the panel content.

## Anatomy

```
┌──────────────────────────┬──────────────────────────────────┐
│ Table (Master)            │ ShellPanel (Detail)              │
│   Name      | Status      │  [Entity Name]                   │
│   ──────────┼──────────   │  ─────────────────────────────  │
│ ► Item A    | Active      │  Label: [Input              ]   │
│   Item B    | Draft       │  Label: [Input              ]   │
│   Item C    | Closed      │  [Save] [Cancel]                 │
│                          │                                  │
└──────────────────────────┴──────────────────────────────────┘
```

### Component Tree

```
(Container)
├── Table (master list)
│   └── Row selection → drives detail
└── ShellPanel (detail)
    ├── Card (optional)
    ├── Label, Input, (form fields)
    └── Button (Save, Cancel, etc.)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Table (master) | Yes | List of entities; selection drives detail |
| ShellPanel | Yes | Right-side panel for detail view/form |
| Detail content | Yes | Form or read-only view for selected row |
| Selection state | Yes | Single (or multi) selection synced to panel |

## Usage Guidelines

### When to Use

- List of entities where users frequently open detail (e.g. projects, contacts)
- When context of the list should remain visible while editing
- When switching between items is common

### When NOT to Use

- Single-entity workflows → Use full-page form
- Rarely opened detail → Consider table row expand or Dialog instead
- Mobile-first with no space for panel → Use full-page detail with back

## Implementation

### Component Dependencies

```typescript
import { Table } from '@/components/ui/table';
import { ShellPanel } from '@/components/ui/shell-panel';
import { Card } from '@/components/ui/card';
import { Label, Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Table, ShellPanel, Card, Input, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| ShellPanel | Open/close, width (mini/expanded), title. |
| Table | Selection mode (single), onSelectionChange. |
| Detail form | Bound to selected entity id; load/save via app state or API. |

## Accessibility

- [ ] Keyboard: Tab from table to panel; panel has focus trap when open.
- [ ] Screen reader: Announce selection change and panel content.
- [ ] Focus: When selection changes, move focus to panel or first focusable in panel.

## Related Patterns

- **Detail Drawer** — Similar but drawer can be used in other contexts.
- **CRUD Table** — Master list often matches CRUD Table structure.
- **Content Plus Right Navigation** — Related layout with right panel.

## Design Decisions

**Decision**: Table left, ShellPanel right. **Rationale**: Familiar master/detail; panel keeps list visible. **Alternatives**: Detail below table (stacked); drawer overlay.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Table with single-selection; sync selected id to state.
- [ ] ShellPanel content driven by selected id (load entity, show form).
- [ ] Include Save/Cancel or equivalent in panel.
- [ ] Update registry if adding new instance.
