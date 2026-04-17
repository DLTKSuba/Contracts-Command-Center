---
name: Toast / Notification
product: cross-product
category: feedback
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Toast / Notification

> **Product**: cross-product | **Category**: feedback | **Status**: draft

## Problem Statement

Users need transient feedback after an action (e.g. "Saved", "Deleted") or for non-blocking messages (e.g. "New message received"). The message should appear briefly and not require dismissal, or offer a dismiss control.

## Solution

An Alert (or toast component) with Icon, short message, and optional Button (e.g. Undo, View). Appears in a fixed position (e.g. bottom-right); auto-dismiss after a few seconds or on user dismiss. Does not block interaction.

## Anatomy

```
                    ┌─────────────────────────────┐
                    │ ✓  Project saved.    [Undo] │
                    └─────────────────────────────┘
```

### Component Tree

```
Alert / Toast container
├── Icon (status or type)
├── Message text
└── Button (optional — Undo, View, Dismiss)
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Message | Yes | Short text (e.g. "Saved", "Error uploading") |
| Icon | No | Success, error, or info icon |
| Button | No | Undo, View, or Dismiss |
| Auto-dismiss | No | Typically 3–5 seconds for success |

## Usage Guidelines

### When to Use

- Confirm success after save, delete, or submit
- Non-critical errors or info (e.g. "Sync in progress")
- Transient message that shouldn't block the page

### When NOT to Use

- Critical error requiring action → Use Error State or inline Alert
- User must read and act → Use Dialog or inline message
- Long or complex message → Use Alert or panel

## Implementation

### Component Dependencies

```typescript
import { Alert } from '@/components/ui/alert';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Alert, Icon, Button when Harmony root is available.*

| Area | Notes |
|------|--------|
| Message | text, variant (success, error, info). |
| Position | Fixed (e.g. bottom-right); stack multiple toasts. |
| Auto-dismiss | timeout in ms; optional onDismiss callback. |

## Accessibility

- [ ] Live region (e.g. aria-live="polite") so screen reader announces.
- [ ] Optional button focusable; don't steal focus from current task.

## Related Patterns

- **Error State** — Full-page or inline error with recovery.
- **Contextual Notification** — Inline notification near toolbar.
- **Notification Center** — Persistent list of notifications.

## Design Decisions

**Decision**: Transient, non-blocking, optional button. **Rationale**: Standard toast behavior. **Alternatives**: Always require dismiss; inline only.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Toast/Alert with message; optional Icon and Button.
- [ ] Position and stacking; auto-dismiss or dismiss control.
- [ ] Update registry if adding new instance.
