---
name: Error State
product: cross-product
category: feedback
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Error State

> **Product**: cross-product | **Category**: feedback | **Status**: draft

## Problem Statement

When something goes wrong (load failed, validation error, server error), users need a clear error message and a recovery action (retry, go back, contact support) instead of a blank or confusing screen.

## Solution

An Alert (with Icon) showing the error message, inside a Card or content area. Include a Button (or Link) for recovery: Retry, Go back, or Contact support. Use for section or page-level errors.

## Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│  ⚠  Unable to load projects. Something went wrong.         │
│      [Retry]  [Go back]                                     │
└─────────────────────────────────────────────────────────────┘
```

### Component Tree

```
Card or container
├── Alert
│   ├── Icon (error)
│   ├── Message
│   └── Button (Retry, Go back, etc.)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Message | Yes | Clear, user-friendly error text |
| Icon | No | Warning or error icon |
| Recovery action | Yes | Button or Link (Retry, Go back, Contact support) |
| Card/container | No | Wraps error for layout |

## Usage Guidelines

### When to Use

- Data load failed (table, list, dashboard)
- Form submit failed
- Permission or server error

### When NOT to Use

- Validation errors on form → Inline field errors
- Non-blocking issue → Toast or inline Alert
- Expected empty result → Empty State, not error

## Implementation

### Component Dependencies

```typescript
import { Alert } from '@/components/ui/alert';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Alert, Icon, Button, Card when Harmony root is available.*

| Area | Notes |
|------|--------|
| Message | From error object or static text; avoid raw stack traces. |
| Retry | onClick refetch or resubmit. |
| Go back | Navigate back or to safe page. |

## Accessibility

- [ ] Alert has role="alert" or aria-live="assertive" so it's announced.
- [ ] Recovery button focusable; focus move to error or button when shown.

## Related Patterns

- **Toast / Notification** — For non-critical errors.
- **Empty State** — No data but no error.
- **Loading State** — Precedes error when load fails.

## Design Decisions

**Decision**: Message + recovery action. **Rationale**: User can recover without dead end. **Alternatives**: Message only; generic "Something went wrong".

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Show error message and recovery Button(s).
- [ ] Use Alert + Icon; optional Card wrapper.
- [ ] Update registry if adding new instance.
