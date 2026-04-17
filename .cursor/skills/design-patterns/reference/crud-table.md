---
name: CRUD Table
product: cross-product
category: data-display
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# CRUD Table

> **Product**: cross-product | **Category**: data-display | **Status**: draft

## Problem Statement

Users need to view, create, update, and delete list-based entities (projects, tasks, resources) in a main workspace. They need a clear primary view with a page header, actions, a sortable/filterable table with linked names for drill-down, and a summary row when relevant. Reference: Harmony Functionality page 3.

## Solution

A main workspace view composed of ShellPageHeader with action buttons, an optional filter bar, a sortable Table with linked names, and a summary row below. Create/Edit use Dialog or Drawer; Delete uses Confirmation Dialog.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ShellPageHeader                                              │
│   Title | [Add] [Import] [Export] [...]                     │
├─────────────────────────────────────────────────────────────┤
│ (optional) Filter bar                                        │
├─────────────────────────────────────────────────────────────┤
│ Table                                                        │
│   ☐ | Name (link)     | Status  | Owner   | Date    | ⋮     │
│   ☐ | Project Alpha   | Active  | Jane    | 2/1/25  |       │
│   ☐ | Project Beta    | Draft   | John    | 2/5/25  |       │
├─────────────────────────────────────────────────────────────┤
│ Summary row (optional)  e.g. Total: 2 projects               │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
ShellPageHeader
├── Title
└── Button(s) — Add, Import, Export, etc.
(optional) Filter bar — Input, Dropdown, Button
Table
├── Checkbox column (optional, for bulk select)
├── Name column (Link to detail)
├── Data columns
├── Actions column (dropdown/menu)
└── Summary row (optional)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPageHeader | Yes | Page title and primary actions |
| Table | Yes | Sortable rows; at least one linked column (e.g. name) |
| Action buttons | Yes | At least Create; optional Import/Export |
| Summary row | No | Totals or counts below table |
| Filter bar | No | Period, project, category filters above table |

## Usage Guidelines

### When to Use

- Main list view for an entity type (projects, tasks, resources)
- When users need to scan, sort, and act on many rows
- When create/edit/delete are primary actions

### When NOT to Use

- Simple read-only display → Use Card Grid or list without CRUD
- Single-entity focus → Use Master/Detail or detail view
- Very few items → Consider Card list instead of table

## Implementation

### Component Dependencies

```typescript
import { ShellPageHeader } from '@/components/ui/shell-page-header';
import { Table } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input, Label } from '@/components/ui/input';
// Verify imports from Harmony component docs when Harmony root available.
```

### Props/Configuration

*Verify against Harmony Table, Button, ShellPageHeader, Dialog component docs when Harmony root is available.*

| Area | Notes |
|------|--------|
| ShellPageHeader | Title, action buttons (variant, label, onClick). |
| Table | Columns config, sort state, row selection, row actions. |
| Dialog | Used for create/edit forms; use Form Dialog pattern. |

## Accessibility

- [ ] Keyboard: Table sortable via keyboard; row actions in menu have focus order.
- [ ] Screen reader: Table has proper semantics; summary row announced.
- [ ] Focus: After create/edit dialog closes, focus returns to trigger or new row.

## Related Patterns

- **Form Dialog** — Create/Edit entity.
- **Confirmation Dialog** — Delete confirmation.
- **Master / Detail** — When detail is often opened from table.
- **Data Table with Filter Bar** — When filters are central.

## Design Decisions

**Decision**: Page header + table as main workspace. **Rationale**: Matches Harmony Functionality page 3; supports scalable list + actions. **Alternatives**: Tabs for multiple entity types; sidebar list + detail.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPageHeader with title and actions.
- [ ] Table with at least one linked column and row actions.
- [ ] Wire Create to Form Dialog; Delete to Confirmation Dialog.
- [ ] Optional filter bar and summary row.
- [ ] Update registry if adding new instance.
