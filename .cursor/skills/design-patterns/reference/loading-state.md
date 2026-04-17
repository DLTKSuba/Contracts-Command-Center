---
name: Loading State
product: cross-product
category: feedback
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Loading State

> **Product**: cross-product | **Category**: feedback | **Status**: draft

## Problem Statement

Users need to know that content or an action is in progress. A loading indicator (Spinner, ProgressBar) with optional context (e.g. "Loading projects") reduces uncertainty and prevents duplicate submissions.

## Solution

Spinner or ProgressBar, often inside or next to the area that is loading (e.g. Card, table area). Use Spinner for indeterminate wait; ProgressBar when progress is known. Optional short message.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│                    ⟳  Loading...                            │
│                    (or progress bar)                        │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
(Container — Card or content area)
├── Spinner | ProgressBar
└── Optional message
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Indicator | Yes | Spinner (indeterminate) or ProgressBar (determinate) |
| Context | No | Message or placement in Card/content area |
| Scope | Yes | Inline (button/row) or block (page/section) |

## Usage Guidelines

### When to Use

- Async data load (table, list, dashboard)
- Form submit or action in progress
- File upload (ProgressBar with percent)

### When NOT to Use

- Instant feedback → No loader
- Error occurred → Use Error State
- Skeleton preferred → Use skeleton UI; document as variant if needed

## Implementation

### Component Dependencies

```typescript
import { Spinner } from '@/components/ui/spinner';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Card } from '@/components/ui/card';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Spinner, ProgressBar, Card when Harmony root is available.*

| Area | Notes |
|------|--------|
| Spinner | size, aria-label (e.g. "Loading"). |
| ProgressBar | value (0–100) when determinate. |
| Placement | Replace content with spinner, or overlay. |

## Accessibility

- [ ] aria-busy or aria-live; spinner has aria-label.
- [ ] Don't remove focus from trigger if loading was triggered by user action.

## Related Patterns

- **Error State** — When load fails.
- **Search Results** — Loading state while search in progress.
- **Import Dialog** — ProgressBar per file.

## Design Decisions

**Decision**: Spinner for indeterminate, ProgressBar for progress. **Rationale**: Common convention. **Alternatives**: Skeleton; inline text only.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Show Spinner or ProgressBar while loading; optional message.
- [ ] Scope to component or page; aria-label for spinner.
- [ ] Update registry if adding new instance.
