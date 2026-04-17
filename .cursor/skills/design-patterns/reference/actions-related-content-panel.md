---
name: Actions / Related Content Panel
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Actions / Related Content Panel

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

Users need a right-side panel that is context-sensitive to the current page: "View data as" (Board, Table, List, Calendar, Schedule, Gantt, Network graph), "View related content" chips, and Create/assign action buttons. Reference: Harmony Functionality pages 20, 22.

## Solution

A ShellPanel on the right containing: TabStrip or options for view type (Board, Table, List, Calendar, etc.); Chip(s) for related content; Button(s) for Create/assign. Content changes based on page/selection.

## Anatomy

```
┌──────────────────────────────────┬─────────────────────┐
│ Main content                     │ Actions / Related   │
│                                  │ View as: [Board][Table][List]... │
│                                  │ Related: [Chip][Chip]           │
│                                  │ [Create] [Assign]               │
└──────────────────────────────────┴─────────────────────┘
```

### Component Tree

```
ShellPanel (right)
├── TabStrip or ButtonGroup — View data as (Board, Table, List, Calendar, Schedule, Gantt, Network graph)
├── Chip — View related content
├── Button — Create, Assign
└── (context-sensitive to page/selection)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPanel | Yes | Right panel |
| View options | Yes | Board, Table, List, Calendar, Schedule, Gantt, Network (Harmony 20) |
| Related chips | Yes | Links to related content |
| Action buttons | Yes | Create, Assign, etc. |

## Usage Guidelines

### When to Use

- Right panel for view switching and related content (Harmony 20, 22)
- When view type (board/table/calendar) and related links are page-specific
- Contextual actions (create, assign) next to main content

### When NOT to Use

- No view switching → Use Content Plus Right Navigation only
- No related content → Simpler toolbar
- Left-side nav → Use LeftSidebar patterns

## Implementation

### Component Dependencies

```typescript
import { ShellPanel } from '@/components/ui/shell-panel';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { Dropdown } from '@/components/ui/dropdown';
import { Icon } from '@/components/ui/icon';
import { TabStrip } from '@/components/ui/tab-strip';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPanel, Button, Chip, Dropdown, Icon, TabStrip when Harmony root is available.*

| Area | Notes |
|------|--------|
| View as | Switch main content view; state or URL. |
| Related | Chips link to related pages/content. |
| Actions | Create/Assign wire to app actions. |
| Context | Panel content keyed by page or selection. |

## Accessibility

- [ ] View options and buttons focusable; panel has label.
- [ ] Chips keyboard accessible.

## Related Patterns

- **Content Plus Right Navigation** — Right panel; this pattern adds view + related + actions.
- **Contextual Toolbar** — Right toolbar (icons); different from panel content.
- **Kanban Board** — One of the "View as" options.

## Design Decisions

**Decision**: View as + related chips + actions in right panel. **Rationale**: Harmony Functionality 20, 22. **Alternatives**: Toolbar only; no panel.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPanel with view options (Board, Table, List, etc.).
- [ ] Related content Chips; Create/Assign buttons.
- [ ] Context-sensitive content by page/selection.
- [ ] Update registry if adding new instance.
