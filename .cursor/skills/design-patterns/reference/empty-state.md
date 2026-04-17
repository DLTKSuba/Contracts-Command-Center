---
name: Empty State
product: cross-product
category: layouts
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Empty State

> **Product**: cross-product | **Category**: layouts | **Status**: draft

## Problem Statement

When there is no data yet (e.g. no projects, no tasks), users need a clear placeholder that explains the state and offers a call-to-action (e.g. Create project) instead of a blank or error-like view.

## Solution

A Card (or dedicated area) with an Icon, short message, and primary Button (e.g. "Create your first project"). Optional ShellPageHeader above. Used in place of table/list when count is zero.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ShellPageHeader (optional)                                  │
├─────────────────────────────────────────────────────────────┤
│                    ┌─────┐                                  │
│                    │ icon│                                  │
│                    └─────┘                                  │
│              No projects yet                                 │
│     Get started by creating your first project.             │
│              [Create project]                               │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
ShellPageHeader (optional)
Card or container
├── Icon
├── Heading (e.g. "No projects yet")
├── Description (optional)
└── Button (primary CTA)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Message | Yes | Short heading; optional description |
| CTA button | Yes | Primary action (Create, Add, etc.) |
| Icon | No | Illustrative or semantic icon |
| Card/container | Yes | Wraps content for consistency |

## Usage Guidelines

### When to Use

- List/table/grid has zero items and user can add first
- After filter returns no results (optional; can use "No results" + clear filters)
- First-time experience (onboarding)

### When NOT to Use

- Error (something broke) → Use Error State
- Loading → Use Loading State
- User has no permission to add → Message only, no CTA or disabled CTA

## Implementation

### Component Dependencies

```typescript
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { ShellPageHeader } from '@/components/ui/shell-page-header';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Card, Icon, Button, ShellPageHeader when Harmony root is available.*

| Area | Notes |
|------|--------|
| Message | heading, description (optional). |
| Button | label, onClick (e.g. open Form Dialog). |
| Icon | Name or component; optional. |

## Accessibility

- [ ] Heading level appropriate (e.g. h2); CTA focusable.
- [ ] Screen reader: Announce empty state and CTA.

## Related Patterns

- **Error State** — Error message + recovery action.
- **Loading State** — Loading indicator.
- **CRUD Table** — Empty state often used when table has no rows.

## Design Decisions

**Decision**: Icon + message + single primary CTA. **Rationale**: Clear and actionable. **Alternatives**: Illustration only; multiple CTAs.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Show when data length === 0 (and not loading/error).
- [ ] Message + primary Button; optional Icon.
- [ ] Update registry if adding new instance.
