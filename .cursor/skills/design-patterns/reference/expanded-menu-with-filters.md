---
name: Expanded Menu with Filters
product: cross-product
category: navigation
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Expanded Menu with Filters

> **Product**: cross-product | **Category**: navigation | **Status**: draft

## Problem Statement

Users need to browse and filter a large set of entities (e.g. projects, documents) in a left sidebar. The sidebar should include search, filter bar, sort chips, and grouped entity lists, with tabs at the top. Reference: Harmony Functionality pages 10-18.

## Solution

A LeftSidebar that slides out with: TabStrip at top (e.g. All, Tab 2, Tab 3); Input for search; filter bar with Dropdown and Chip for sort (Last modified, Owner, Alphabetical); grouped entity lists with optional images; Primary and Secondary action buttons.

## Anatomy

```
┌─────────────────────────────────┐
│ [All] [Tab 2] [Tab 3]           │
│ [🔍 Search...              ]    │
│ Last modified [×] Owner [×]    │
│ [Primary] [Secondary]          │
│ ─────────────────────────────  │
│ Group 1                         │
│   • Entity A    [img]           │
│   • Entity B                   │
│ Group 2                         │
│   • Entity C                    │
└─────────────────────────────────┘
```

### Component Tree

```
LeftSidebar
├── TabStrip (All, Tab 2, Tab 3)
├── Input (search)
├── Dropdown, Chip (filters/sort)
├── Button (Primary), Button (Secondary)
└── Grouped lists (entity items, optional Icon/image)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| LeftSidebar | Yes | Slide-out panel |
| TabStrip | Yes | Tabs at top for categories |
| Search | Yes | Input to filter list |
| Sort/filter chips | Yes | e.g. Last modified, Owner, Alphabetical |
| Entity list | Yes | Grouped; optional images |
| Primary/Secondary buttons | Yes | Actions |

## Usage Guidelines

### When to Use

- Left sidebar for browsing projects, documents, etc. (Harmony 10-18)
- When search + filter + sort + tabs are needed together
- Entity picker or "recent" list with filters

### When NOT to Use

- Simple nav only → Use Tree Menu or ListMenu
- No filters → Simpler sidebar list
- Right-side panel → Use ShellPanel

## Implementation

### Component Dependencies

```typescript
import { LeftSidebar } from '@/components/ui/left-sidebar';
import { Input } from '@/components/ui/input';
import { Dropdown } from '@/components/ui/dropdown';
import { Chip } from '@/components/ui/chip';
import { Button } from '@/components/ui/button';
import { TabStrip } from '@/components/ui/tab-strip';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony LeftSidebar, Input, Dropdown, Chip, Button, TabStrip when Harmony root is available.*

| Area | Notes |
|------|--------|
| Tabs | Drive list source or filter. |
| Search | Filter list by text. |
| Chips | Sort or filter; remove chip to clear. |
| List | Grouped by category; click navigates or selects. |

## Accessibility

- [ ] Sidebar focus trap when open; Escape closes.
- [ ] Tabs, search, and list keyboard accessible.

## Related Patterns

- **Tree Menu** — Hierarchy in sidebar; no tabs/filters.
- **Filter Form (Sidebar)** — Filter form in sidebar.
- **Secondary / Tertiary Menu** — Nested menu levels.

## Design Decisions

**Decision**: Tabs + search + sort chips + grouped list. **Rationale**: Harmony Functionality 10-18. **Alternatives**: Single list; no tabs.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] LeftSidebar with TabStrip, search Input, sort Chips, buttons.
- [ ] Grouped entity list; optional images.
- [ ] Update registry if adding new instance.
