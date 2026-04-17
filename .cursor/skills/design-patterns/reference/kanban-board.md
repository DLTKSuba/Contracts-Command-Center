---
name: Kanban Board
product: cross-product
category: data-display
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Kanban Board

> **Product**: cross-product | **Category**: data-display | **Status**: draft

## Problem Statement

Users need to view and manage items in a column-based workflow (e.g. To Do, In Progress, Done). Cards represent work items; columns represent stages. Drag-and-drop between columns should be supported. Reference: Harmony Functionality page 20 ("View data as" option — Board).

## Solution

A Kanban component with columns; each column contains KanbanCard components. Buttons and Dropdowns support column-level or card-level actions. Cards can be dragged between columns to change status.

## Anatomy

```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ To Do       │ In Progress │ Review      │ Done        │
│ [Dropdown]  │ [Dropdown]  │ [Dropdown]  │ [Dropdown]  │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ ┌─────────┐ │ ┌─────────┐ │ ┌─────────┐ │             │
│ │ Card 1  │ │ │ Card 3  │ │ │ Card 5  │ │             │
│ └─────────┘ │ └─────────┘ │ └─────────┘ │             │
│ ┌─────────┐ │             │             │             │
│ │ Card 2  │ │             │             │             │
│ └─────────┘ │             │             │             │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Component Tree

```
Kanban
├── Column 1
│   ├── Header (title, Dropdown optional)
│   └── KanbanCard (repeated)
├── Column 2
│   └── ...
└── Column N
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Kanban | Yes | Container for columns and drag-drop |
| Columns | Yes | Each column has title and list of cards |
| KanbanCard | Yes | Card per item; draggable |
| Column/card actions | No | Dropdown or Button for add/actions |

## Usage Guidelines

### When to Use

- Workflow stages (To Do, In Progress, Done, etc.)
- When drag-and-drop status change is primary interaction
- "View data as Board" alternative to Table/List

### When NOT to Use

- No columns or stages → Use Card Grid or list
- Read-only display → Table or list may be simpler
- Single column → Use Card list, not Kanban

## Implementation

### Component Dependencies

```typescript
import { Kanban } from '@/components/ui/kanban';
import { KanbanCard } from '@/components/ui/kanban-card';
import { Button } from '@/components/ui/button';
import { Dropdown } from '@/components/ui/dropdown';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Kanban, KanbanCard, Button, Dropdown when Harmony root is available.*

| Area | Notes |
|------|--------|
| Kanban | Columns config, data source, onCardMove. |
| KanbanCard | Item data, onClick, optional menu. |
| Drag-drop | Wire to status/column change in data model. |

## Accessibility

- [ ] Keyboard: Cards and columns focusable; move between columns via keyboard (e.g. arrow keys or actions).
- [ ] Screen reader: Announce column names and card labels; announce on move.

## Related Patterns

- **Card Grid** — Grid of cards without columns/workflow.
- **Data Table with Filter Bar** — Same data, table view; Board is alternative view.
- **Actions / Related Content Panel** — "View data as" can include Board.

## Design Decisions

**Decision**: Use Harmony Kanban/KanbanCard. **Rationale**: Aligns with "View data as Board" in Harmony Functionality page 20. **Alternatives**: Custom drag-drop list.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Kanban with columns; KanbanCard per item.
- [ ] Drag-drop or keyboard move between columns.
- [ ] Column/card actions as needed.
- [ ] Update registry if adding new instance.
