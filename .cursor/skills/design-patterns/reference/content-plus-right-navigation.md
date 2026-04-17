---
name: Content Plus Right Navigation
product: cross-product
category: layouts
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Content Plus Right Navigation

> **Product**: cross-product | **Category**: layouts | **Status**: draft

## Problem Statement

Users need a main content area (e.g. ShellPageHeader, Card, Table) with a detachable right drawer that shows context-sensitive data. Drawer content can be independent or tied to page selection (e.g. chart tied to table row). Reference: Harmony Functionality page 39.

## Solution

Layout: main area (ShellPageHeader, Card, Table) and ShellPanel on the right. Right panel shows context-sensitive content (e.g. chart for selected row, or standalone widget). Panel can be open/closed or detached; content bound to selection or page.

## Anatomy

```
┌──────────────────────────────┬─────────────────────┐
│ ShellPageHeader               │ Right panel         │
│ Card / Table (main)            │ (e.g. chart for     │
│                               │  selected row)      │
│                               │ [≡] [×]             │
└──────────────────────────────┴─────────────────────┘
```

### Component Tree

```
(Page layout)
├── Main — ShellPageHeader, Card, Table
└── ShellPanel (right)
    └── Content (context-sensitive: chart, detail, or standalone)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Main content | Yes | ShellPageHeader, Card, Table as needed |
| ShellPanel | Yes | Right drawer; detachable (Harmony 39) |
| Context content | Yes | Tied to selection or page (e.g. chart) or independent |

## Usage Guidelines

### When to Use

- Main content + optional right panel (Harmony 39)
- Chart or detail tied to table selection
- When panel can be closed to maximize main area

### When NOT to Use

- Always need panel visible → Split View
- Panel is primary (e.g. Template Picker) → Use that pattern
- Left panel → Use LeftSidebar patterns

## Implementation

### Component Dependencies

```typescript
import { ShellPageHeader } from '@/components/ui/shell-page-header';
import { Card } from '@/components/ui/card';
import { ShellPanel } from '@/components/ui/shell-panel';
import { Table } from '@/components/ui/table';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPageHeader, Card, ShellPanel, Table when Harmony root is available.*

| Area | Notes |
|------|--------|
| ShellPanel | open, onOpenChange; optional detach. |
| Content | Keyed by selectedRowId or page; or standalone widget. |

## Accessibility

- [ ] Panel focus trap when open; Escape or close button.
- [ ] Main and panel both keyboard accessible.

## Related Patterns

- **Master / Detail** — Table + right panel; same idea.
- **Detail Drawer** — Right panel for entity detail.
- **Actions / Related Content Panel** — Right panel with view + related + actions.

## Design Decisions

**Decision**: Main + detachable right panel; context-sensitive. **Rationale**: Harmony Functionality page 39. **Alternatives**: Always visible split; modal panel.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Main area (ShellPageHeader, Card, Table); ShellPanel right.
- [ ] Panel content from selection or page context.
- [ ] Optional detach/close for panel.
- [ ] Update registry if adding new instance.
