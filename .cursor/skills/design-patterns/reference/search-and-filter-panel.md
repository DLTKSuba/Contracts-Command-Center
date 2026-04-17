---
name: Search and Filter Panel
product: cross-product
category: forms
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Search and Filter Panel

> **Product**: cross-product | **Category**: forms | **Status**: draft

## Problem Statement

Users need a right-side panel for search with tabs: Context search, Global search, Saved searches. Filter dropdowns, Save search and Apply buttons, and Clear link. Reference: Harmony Functionality page 25.

## Solution

A ShellPanel on the right with TabStrip (Context search / Global search / Saved searches). Input for search; Dropdown(s) for filters. Button "Save search", Button "Apply", and Clear link. Content updates per tab.

## Anatomy

```
┌──────────────────────────────────┬─────────────────────┐
│ Main content                      │ Search & Filter     │
│                                   │ [Context][Global][Saved] │
│                                   │ [Search input...]  │
│                                   │ Filter [Dropdown▼]│
│                                   │ [Save search][Apply] │
│                                   │ Clear               │
└──────────────────────────────────┴─────────────────────┘
```

### Component Tree

```
ShellPanel (right)
├── TabStrip (Context search, Global search, Saved searches)
├── Input (search)
├── Dropdown (filters)
├── Button (Save search), Button (Apply)
└── Link (Clear)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| ShellPanel | Yes | Right panel (Harmony 25) |
| Tabs | Yes | Context / Global / Saved searches |
| Search input | Yes | Query input |
| Filters | Yes | Dropdown(s) |
| Save search | Yes | Persist current criteria |
| Apply | Yes | Run search with current criteria |
| Clear | Yes | Reset criteria |

## Usage Guidelines

### When to Use

- Dedicated search panel (Harmony 25)
- When context vs global vs saved searches are distinct
- Need save and apply and clear

### When NOT to Use

- Simple search only → Search input in header or content
- No saved searches → No tab or single view
- Left sidebar search → Use Expanded Menu with Filters

## Implementation

### Component Dependencies

```typescript
import { ShellPanel } from '@/components/ui/shell-panel';
import { TabStrip } from '@/components/ui/tab-strip';
import { Input } from '@/components/ui/input';
import { Dropdown } from '@/components/ui/dropdown';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony ShellPanel, TabStrip, Input, Dropdown, Button, Link when Harmony root is available.*

| Area | Notes |
|------|--------|
| Tabs | Context (current page), Global, Saved (list of saved). |
| Save search | Persist name + criteria; add to Saved tab. |
| Apply | Run search; update results in main area or panel. |
| Clear | Reset filters and query. |

## Accessibility

- [ ] Tabs and form controls keyboard accessible.
- [ ] Panel has label; search results announced if in panel.

## Related Patterns

- **Filter Form (Sidebar)** — Left sidebar filters.
- **Expanded Menu with Filters** — Left sidebar with search.
- **Search Results** — Results view; this is search UI in panel.

## Design Decisions

**Decision**: Right panel with Context/Global/Saved tabs. **Rationale**: Harmony Functionality page 25. **Alternatives**: Single search; no saved.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] ShellPanel with Context/Global/Saved tabs.
- [ ] Search Input, filter Dropdowns, Save search, Apply, Clear.
- [ ] Update registry if adding new instance.
