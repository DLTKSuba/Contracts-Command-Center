---
name: Contextual Notification
product: cross-product
category: feedback
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Contextual Notification

> **Product**: cross-product | **Category**: feedback | **Status**: draft

## Problem Statement

Users need inline notification near the right toolbar (e.g. "Go to workflows for progress") with an action link. It may expand to a form (e.g. Request Schedule Review with fields). Reference: Harmony Functionality page 26.

## Solution

An Alert (or inline toast) placed near the right toolbar. Contains message and Button or Link (e.g. "Go to workflows"). Optionally expandable to show a form (e.g. Request Schedule Review with inputs). Transient or dismissible.

## Anatomy

```
                    ┌─────────────────────────────────────┐
                    │ Go to workflows for progress. [Link]│
                    │ (optional) [Expand] → form fields   │
                    └─────────────────────────────────────┘
```

### Component Tree

```
Alert (inline, near toolbar)
├── Message
├── Button | Link (action)
└── (optional) Expandable form — Label, Input, Button
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Message | Yes | Short contextual text |
| Action | Yes | Link or Button (e.g. "Go to workflows") |
| Expandable form | No | Expand to show form (e.g. Request Schedule Review) |
| Placement | Yes | Near right toolbar (Harmony 26) |

## Usage Guidelines

### When to Use

- Contextual hint with action (Harmony 26)
- When notification is tied to current page/toolbar
- Optional expand to form for follow-up action

### When NOT to Use

- Global message → Toast or Notification Center
- No action needed → Toast or Status Indicator
- Blocking → Use Dialog

## Implementation

### Component Dependencies

```typescript
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/link';
// Optional: form fields if expandable.
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Alert, Button, Link when Harmony root is available.*

| Area | Notes |
|------|--------|
| Message | text; optional variant. |
| Action | href or onClick (e.g. navigate to workflows). |
| Expand | Optional; show form on expand (Request Schedule Review). |

## Accessibility

- [ ] Alert and action focusable; expand control if present.
- [ ] Live region if notification appears dynamically.

## Related Patterns

- **Toast / Notification** — Transient; this is contextual and may expand.
- **Notification Center** — Full list; this is single contextual item.
- **Form Dialog** — If expanded form is modal instead of inline.

## Design Decisions

**Decision**: Inline near toolbar + optional expand to form. **Rationale**: Harmony Functionality page 26. **Alternatives**: Always expanded; toast only.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Alert near right toolbar with message and action Link/Button.
- [ ] Optional expand to form (e.g. Request Schedule Review).
- [ ] Update registry if adding new instance.
