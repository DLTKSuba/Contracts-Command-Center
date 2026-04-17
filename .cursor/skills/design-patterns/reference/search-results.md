---
name: Search Results
product: cross-product
category: data-display
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Search Results

> **Product**: cross-product | **Category**: data-display | **Status**: draft

## Problem Statement

Users need to search for entities (projects, documents, people) and see results in a clear, scannable format. Results may be shown as a table or as cards; a loading state and empty state are required.

## Solution

A search Input (with optional Icon), with results displayed as either Table rows or a Card list. Show a Spinner while loading; use Badge for counts or status when relevant. Support empty state when no results.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ [🔍 Search...                                        ]      │
├─────────────────────────────────────────────────────────────┤
│ Loading: [Spinner]  OR  Results as Table/Cards               │
│ (Optional) "42 results" Badge                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
Input (search, with Icon optional)
Spinner (when loading)
Table OR Card (repeated) — when results
Badge (optional, result count or filter)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Search input | Yes | Text input; debounced query to backend or local filter |
| Results area | Yes | Table or Card list bound to results |
| Loading state | Yes | Spinner or skeleton while fetching |
| Empty state | Yes | Message when no results (optional Empty State pattern) |

## Usage Guidelines

### When to Use

- Global or context search (projects, files, users)
- When results can be list (table) or card layout
- When loading and empty states must be explicit

### When NOT to Use

- Filtering a fixed list only → Use filter bar or dropdown
- No async search → Simple filter input may suffice
- Single result redirect → May not need results list UI

## Implementation

### Component Dependencies

```typescript
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Table } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Input, Icon, Table, Card, Spinner, Badge when Harmony root is available.*

| Area | Notes |
|------|--------|
| Input | value, onChange, debounce; onSubmit or onBlur for search trigger. |
| Results | data from search API; map to Table columns or Card props. |
| Loading | isLoading; show Spinner when true. |
| Empty | results.length === 0 and !isLoading → show empty message. |

## Accessibility

- [ ] Keyboard: Search input focusable; results focusable (table or cards).
- [ ] Screen reader: Announce loading, result count, and "no results" when applicable.

## Related Patterns

- **Empty State** — Use when no results.
- **Data Table with Filter Bar** — Filter bar can include search.
- **Search and Filter Panel** — Shell panel for saved/context search.

## Design Decisions

**Decision**: Table or Card for results. **Rationale**: Table for dense data; cards for richer previews. **Alternatives**: List with thumbnails; hybrid.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Search input with debounced or submitted query.
- [ ] Loading (Spinner) and results (Table or Cards) states.
- [ ] Empty state when no results.
- [ ] Update registry if adding new instance.
