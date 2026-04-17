---
name: Tree Menu
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Tree Menu

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

Products with deep navigation (e.g. Accounting > General Ledger > Manage Fiscal Years) need a hierarchical structure in the left sidebar. Users expand/collapse nodes and click to navigate.

## Solution

A LeftSidebar containing a ListMenu (or tree component) that displays a hierarchy. Nodes can expand to show children; clicking a leaf navigates. Supports multiple levels.

## Anatomy

```
┌─────────────────────────────────┐
│ ▼ Accounting                    │
│   ▼ General Ledger              │
│     • Chart of Accounts         │
│     ► Manage Fiscal Years       │
│     • Journals                  │
│ ▶ Projects                      │
│ ▶ Reports                       │
└─────────────────────────────────┘
```

### Component Tree

```
LeftSidebar
└── ListMenu (tree)
    ├── Node (expandable)
    │   ├── Node (expandable)
    │   │   └── Node (leaf, link)
    │   └── ...
    └── ...
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| LeftSidebar | Yes | Container for tree |
| Tree / ListMenu | Yes | Hierarchical nodes; expand/collapse |
| Links | Yes | Leaf nodes or clickable nodes navigate |
| Expand/collapse | Yes | Toggle children visibility |

## Usage Guidelines

### When to Use

- Deep hierarchy (3+ levels) in left nav
- Accounting, config, or admin sections (Harmony 11)
- When users need to browse by category then drill down

### When NOT to Use

- Flat list → Use ListMenu without hierarchy
- Two levels → Secondary panel may suffice
- Many top-level items → Consider grouping or search

## Implementation

### Component Dependencies

```typescript
import { LeftSidebar } from '@/components/ui/left-sidebar';
import { ListMenu } from '@/components/ui/list-menu';
// Verify from Harmony docs when available; tree may be ListMenu with nested items.
```

### Props/Configuration

*Verify against Harmony LeftSidebar, ListMenu when Harmony root is available.*

| Area | Notes |
|------|--------|
| Data | Nested structure { label, href?, children? }. |
| State | Expanded node ids; toggle on click. |
| Navigation | Leaf click or node click navigates. |

## Accessibility

- [ ] Arrow keys expand/collapse; Enter activates.
- [ ] aria-expanded, tree role or equivalent.

## Related Patterns

- **Secondary / Tertiary Menu** — Nested levels with secondary panel.
- **Breadcrumb Trail** — Linear path; tree is full hierarchy.
- **Expanded Menu with Filters** — Sidebar with tabs/filters, not tree.

## Design Decisions

**Decision**: Tree in left sidebar. **Rationale**: Harmony Functionality page 11; deep nav. **Alternatives**: Accordion; flat list with indentation.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] LeftSidebar with tree/list menu; nested data.
- [ ] Expand/collapse and navigation on click.
- [ ] Update registry if adding new instance.
