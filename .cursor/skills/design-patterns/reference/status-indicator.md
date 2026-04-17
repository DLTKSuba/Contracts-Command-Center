---
name: Status Indicator
product: cross-product
category: feedback
status: draft
cross-product-candidate: true
created: "2025-02-11"
updated: "2025-02-11"
author: seed-patterns
source-component: ""
---

# Status Indicator

> **Product**: cross-product | **Category**: feedback | **Status**: draft

## Problem Statement

Users need to see status at a glance (e.g. Active, Draft, Completed, Unread count). Status can be shown as a Badge, NotificationBadge (count), Icon, or Tooltip for extra detail.

## Solution

Use Badge for status label (e.g. "Active", "Draft"); NotificationBadge for counts (e.g. unread); Icon for state (e.g. check, warning); Tooltip for hover explanation. Combine as needed (e.g. Badge + Tooltip).

## Anatomy

```
  [Active]  [3]  ✓  (with tooltip: "Completed")
  Badge     NotificationBadge  Icon
```

### Component Tree

```
Badge | NotificationBadge | Icon
(optional) Tooltip wrapping any of the above
```

### Key Elements

| Element | Required | Description |
|---------|----------|-------------|
| Indicator | Yes | Badge, NotificationBadge, or Icon |
| Tooltip | No | Explains status on hover/focus |
| Variant | Yes | Color/style for status type (success, warning, etc.) |

## Usage Guidelines

### When to Use

- Entity status (project, task, document)
- Unread or count (NotificationBadge)
- Inline state (e.g. saved, syncing) with Icon

### When NOT to Use

- Full message → Use Alert or Toast
- Progress → Use ProgressBar or Spinner
- Decorative only → Prefer semantic status

## Implementation

### Component Dependencies

```typescript
import { Badge } from '@/components/ui/badge';
import { NotificationBadge } from '@/components/ui/notification-badge';
import { Icon } from '@/components/ui/icon';
import { Tooltip } from '@/components/ui/tooltip';
// Verify from Harmony docs when available.
```

### Props/Configuration

*Verify against Harmony Badge, NotificationBadge, Icon, Tooltip when Harmony root is available.*

| Area | Notes |
|------|--------|
| Badge | variant (e.g. success, warning); label. |
| NotificationBadge | count; show when count > 0. |
| Tooltip | content for hover/focus. |

## Accessibility

- [ ] Status text or aria-label so screen reader gets meaning.
- [ ] Don't rely on color alone; use icon or text with color.

## Related Patterns

- **Toast / Notification** — Transient message.
- **Notification Center** — List of notifications with badges.

## Design Decisions

**Decision**: Badge/NotificationBadge/Icon + optional Tooltip. **Rationale**: Flexible for label, count, or icon. **Alternatives**: Text only; always tooltip.

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-02-11 | seed-patterns | Initial pattern documentation |

---

## For AI Agents

### Checklist for New Implementation

- [ ] Use Badge, NotificationBadge, or Icon for status.
- [ ] Optional Tooltip; ensure accessible label.
- [ ] Update registry if adding new instance.
