---
name: Data Table with Filter Bar
product: cross-product
category: data-display
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Data Table with Filter Bar

> **Product**: cross-product | **Category**: data-display | **Status**: draft

## Problem Statement

Users need to narrow large datasets by period, project, category, or other dimensions. Active filters should be visible (e.g. as chips) and easy to clear. Reference: Harmony Functionality page 52 filter bar.

## Solution

A filter bar above the table containing dropdowns (e.g. Period, Project, Category), with active filters shown as Chips. A Clear button resets all filters. The table displays only rows matching the current filters.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ Period [Dropdown ▼]  Project [Dropdown ▼]  Category [▼]      │
│ [Clear]                                                      │
│ Active: [Q1 2025 ×] [Alpha ×] [Design ×]                     │
├─────────────────────────────────────────────────────────────┤
│ Table (filtered rows)                                        │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
Filter bar
├── Dropdown (Period)
├── Dropdown (Project)
├── Dropdown (Category)
├── Button (Clear)
└── Chip (per active filter, dismissible)
Table
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Filter controls | Yes | At least one dropdown or filter input |
| Active filter chips | Yes | Chips showing current filters; remove one to clear that filter |
| Clear button | Yes | Resets all filters |
| Table | Yes | Data bound to filter state |

## Usage Guidelines

### When to Use

- Large lists that need scoping by time, project, category, or similar
- When users need to see and clear multiple filters at once
- Dashboards or list views with standard filter dimensions

### When NOT to Use

- Very few filter options → Inline dropdowns next to table may suffice
- Single filter → A single dropdown or search may be enough
- No table → Use Filter Form (Sidebar) for other contexts

## Implementation

### Component Dependencies

```typescript
import { Table } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dropdown } from '@/components/ui/dropdown';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Dropdown, DatePicker, Button, Chip, Table when Harmony root is available.*

| Area | Notes |
|------|--------|
| Dropdown/DatePicker | Options, value, onChange; map to filter state. |
| Chip | Label, onRemove; one chip per active filter. |
| Clear Button | onClick clears all filter state. |
| Table | data filtered by current filter state (client or server). |

## Accessibility

- [ ] Keyboard: All filter controls and chips focusable; Chip remove via keyboard.
- [ ] Screen reader: Announce filter count or "X filters active"; Clear announced.

## Related Patterns

- **CRUD Table** — Often combined; filter bar above same table.
- **Filter Form (Sidebar)** — Sidebar filter panel for different context.
- **Widget Dashboard** — Filter bar at top (Period, Project, etc.) is similar.

## Design Decisions

**Decision**: Chips for active filters + Clear. **Rationale**: Visibility of current scope; easy to remove one or all. **Reference**: Harmony Functionality page 52.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Filter bar with dropdowns/inputs; state drives table data.
- [ ] Chips for each active filter with remove.
- [ ] Clear button to reset all.
- [ ] Update registry if adding new instance.
